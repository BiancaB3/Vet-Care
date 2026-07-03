'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { criarTutor, atualizarTutor } from '@/app/services/tutorService';
import { buscarEnderecoPorCep } from '@/app/services/enderecoService';
import { pushNotification } from '@/app/redux/slices/notificationsSlice';
import { getDraft, saveDraft, clearDraft } from '@/app/lib/formDraft';
import type { TutorResponse } from '@/app/types/tutor';

export interface TutorFormProps {
  tutorExistente?: TutorResponse;
}

type TutorFormState = {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  cep: string;
  endereco: string;
};

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)})${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)})${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)})${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function formatCep(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

function isCpfValido(value: string) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i += 1) {
    soma += Number(cpf[i]) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== Number(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i += 1) {
    soma += Number(cpf[i]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;

  return resto === Number(cpf[10]);
}

function emptyForm(): TutorFormState {
  return { nome: '', email: '', telefone: '', cpf: '', cep: '', endereco: '' };
}

export default function TutorForm({ tutorExistente }: TutorFormProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const draftId = tutorExistente ? String(tutorExistente.id) : undefined;

  const [tutor, setTutor] = useState<TutorFormState>(() => {
    if (tutorExistente) {
      return {
        nome: tutorExistente.nome,
        email: tutorExistente.email,
        telefone: tutorExistente.telefone,
        cpf: formatCpf(tutorExistente.cpf ?? ''),
        cep: formatCep(tutorExistente.cep ?? ''),
        endereco: tutorExistente.endereco ?? '',
      };
    }
    return emptyForm();
  });
  const [isCepLoading, setIsCepLoading] = useState(false);

  useEffect(() => {
    if (!tutorExistente && getDraft('tutor')) {
      const draft = getDraft('tutor');
      if (draft) {
        setTutor((prev) => ({
          ...prev,
          nome: draft.name,
          email: draft.email,
          telefone: draft.phone,
          cpf: draft.cpf,
          cep: draft.cep,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (campo: keyof TutorFormState, valor: string) => {
    let novoValor = valor;
    if (campo === 'cpf') novoValor = formatCpf(valor);
    if (campo === 'cep') novoValor = formatCep(valor);
    if (campo === 'telefone') novoValor = formatPhone(valor);

    const proximo = { ...tutor, [campo]: novoValor };
    setTutor(proximo);

    saveDraft(
      'tutor',
      {
        name: proximo.nome,
        email: proximo.email,
        phone: proximo.telefone,
        cpf: proximo.cpf,
        cep: proximo.cep,
      },
      draftId,
    );
  };

  const handleCepBlur = async () => {
    const cepNormalizado = onlyDigits(tutor.cep);
    if (cepNormalizado.length !== 8) {
      return;
    }

    setIsCepLoading(true);
    try {
      const endereco = await buscarEnderecoPorCep(cepNormalizado);
      const cidadeUf = `${endereco.localidade ?? ''}${endereco.uf ? `/${endereco.uf}` : ''}`;
      const enderecoFormatado = [endereco.logradouro, endereco.bairro, cidadeUf]
        .map((parte) => (parte ?? '').trim())
        .filter((parte) => parte.length > 0)
        .join(' - ');

      setTutor((prev) => ({ ...prev, endereco: enderecoFormatado }));
    } catch {
      alert('Nao foi possivel consultar o CEP informado.');
    } finally {
      setIsCepLoading(false);
    }
  };

  const handleSalvar = async () => {
    const cpfNormalizado = onlyDigits(tutor.cpf);
    const cepNormalizado = onlyDigits(tutor.cep);

    if (!isCpfValido(cpfNormalizado)) {
      alert('CPF invalido. Informe um CPF valido com 11 digitos.');
      return;
    }

    if (cepNormalizado.length !== 8) {
      alert('CEP invalido. Informe um CEP valido com 8 digitos.');
      return;
    }

    if (!tutor.endereco.trim()) {
      alert('Busque um CEP valido para preencher o endereco do tutor.');
      return;
    }

    const payload = {
      nome: tutor.nome,
      email: tutor.email,
      telefone: tutor.telefone,
      cpf: cpfNormalizado,
      cep: cepNormalizado,
      endereco: tutor.endereco,
      status: 'ATIVO',
    };

    try {
      if (tutorExistente) {
        await atualizarTutor(tutorExistente.id, payload);
        dispatch(
          pushNotification({
            message: `Tutor "${tutor.nome}" atualizado com sucesso`,
            type: 'edicao',
          }),
        );
      } else {
        await criarTutor(payload);
        dispatch(
          pushNotification({
            message: `Tutor "${tutor.nome}" cadastrado com sucesso`,
            type: 'cadastro',
          }),
        );
      }
    } catch {
      alert('Nao foi possivel salvar o tutor.');
      return;
    }

    clearDraft('tutor', draftId);
    router.push('/tutores');
  };

  return (
    <form action={handleSalvar} className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">Nome completo</label>
          <input
            type="text"
            required
            value={tutor.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            placeholder="Nome completo do tutor"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Email</label>
          <input
            type="email"
            required
            value={tutor.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="seu@email.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Telefone</label>
          <input
            type="tel"
            required
            value={tutor.telefone}
            onChange={(e) => handleChange('telefone', e.target.value)}
            placeholder="(XX)XXXXX-XXXX"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">CPF</label>
          <input
            type="text"
            required
            value={tutor.cpf}
            onChange={(e) => handleChange('cpf', e.target.value)}
            placeholder="000.000.000-00"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">CEP</label>
          <input
            type="text"
            required
            value={tutor.cep}
            onChange={(e) => handleChange('cep', e.target.value)}
            onBlur={handleCepBlur}
            placeholder="00000-000"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
          {isCepLoading && <p className="text-xs text-slate-500">Buscando endereco pelo CEP...</p>}
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">Endereco</label>
          <input
            type="text"
            required
            value={tutor.endereco}
            onChange={(e) => handleChange('endereco', e.target.value)}
            placeholder="Rua - Bairro - Cidade/UF"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
        </div>

        <div className="md:col-span-2 flex items-center justify-end gap-6 pt-6 mt-6 border-t border-slate-100">
          <Link
            href="/tutores"
            className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            CANCELAR
          </Link>
          <button
            type="submit"
            className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            SALVAR
          </button>
        </div>
      </div>
    </form>
  );
}
