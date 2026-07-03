'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { criarProntuario, atualizarProntuario } from '@/app/services/prontuarioService';
import { listarPets } from '@/app/services/petService';
import type { ProntuarioResponse } from '@/app/types/prontuario';
import type { PetResponse } from '@/app/types/pet';
import { pushNotification } from '@/app/redux/slices/notificationsSlice';
import { getDraft, saveDraft, clearDraft } from '@/app/context/formDraft';

export type ProntuarioFormProps = {
  prontuarioExistente?: ProntuarioResponse;
};

type ProntuarioFormState = {
  petId: string;
  data: string;
  hora: string;
  descricao: string;
  diagnostico: string;
  tratamento: string;
  prescricao: string;
};

const emptyForm = (): ProntuarioFormState => ({
  petId: '',
  data: '',
  hora: '',
  descricao: '',
  diagnostico: '',
  tratamento: '',
  prescricao: '',
});

function splitDataAtendimento(dataAtendimento: string): { data: string; hora: string } {
  // dataAtendimento is an ISO LocalDateTime string, e.g. "2026-07-02T14:30:00"
  const [datePart, timePart] = dataAtendimento.split('T');
  return {
    data: datePart ?? '',
    hora: timePart ? timePart.slice(0, 5) : '',
  };
}

export default function ProntuarioForm({ prontuarioExistente }: ProntuarioFormProps) {
  const router = useRouter();
  const dispatch = useDispatch();

  const draftId = prontuarioExistente ? String(prontuarioExistente.id) : undefined;

  const [pets, setPets] = useState<PetResponse[]>([]);
  const [form, setForm] = useState<ProntuarioFormState>(() => {
    if (prontuarioExistente) {
      const { data, hora } = splitDataAtendimento(prontuarioExistente.dataAtendimento);
      return {
        petId: String(prontuarioExistente.petId),
        data,
        hora,
        descricao: prontuarioExistente.descricao ?? '',
        diagnostico: prontuarioExistente.diagnostico ?? '',
        tratamento: prontuarioExistente.tratamento ?? '',
        prescricao: prontuarioExistente.prescricao ?? '',
      };
    }

    const draft = getDraft('consultation');
    if (draft) {
      return {
        petId: draft.petId,
        data: draft.date,
        hora: draft.time,
        descricao: draft.reason,
        diagnostico: draft.diagnosis,
        tratamento: draft.treatment,
        prescricao: draft.prescription,
      };
    }

    return emptyForm();
  });

  useEffect(() => {
    carregarPets();
  }, []);

  const carregarPets = async () => {
    try {
      const dados = await listarPets();
      setPets(dados);
    } catch (error) {
      alert('Erro ao carregar lista de pets!');
      console.error(error);
    }
  };

  const salvarRascunho = (next: ProntuarioFormState) => {
    if (prontuarioExistente) return;
    saveDraft('consultation', {
      petId: next.petId,
      date: next.data,
      time: next.hora,
      reason: next.descricao,
      diagnosis: next.diagnostico,
      treatment: next.tratamento,
      prescription: next.prescricao,
    });
  };

  const handleChange = (campo: keyof ProntuarioFormState, valor: string) => {
    setForm((prev) => {
      const next = { ...prev, [campo]: valor };
      salvarRascunho(next);
      return next;
    });
  };

  const handleSalvar = async (formData: FormData) => {
    const dataAtendimento = `${form.data}T${form.hora}:00`;

    const payload = {
      dataAtendimento,
      descricao: form.descricao,
      diagnostico: form.diagnostico,
      tratamento: form.tratamento,
      prescricao: form.prescricao,
      pet: { id: Number(form.petId) },
    };

    try {
      if (prontuarioExistente) {
        await atualizarProntuario(prontuarioExistente.id, payload);
        dispatch(
          pushNotification({
            message: 'Prontuário atualizado com sucesso',
            type: 'edicao',
          }),
        );
      } else {
        await criarProntuario(payload);
        dispatch(
          pushNotification({
            message: 'Prontuário registrado com sucesso',
            type: 'cadastro',
          }),
        );
      }
    } catch (error) {
      alert('Erro ao salvar prontuário!');
      console.error(error);
      return;
    }

    clearDraft('consultation', draftId);
    router.push('/prontuarios');
  };

  return (
    <form action={handleSalvar} className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">Pet</label>
          <select
            required
            value={form.petId}
            onChange={(e) => handleChange('petId', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary transition-all outline-none"
          >
            <option value="">Selecione o pet</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Data</label>
          <input
            type="date"
            required
            value={form.data}
            onChange={(e) => handleChange('data', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary transition-all outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Hora</label>
          <input
            type="time"
            required
            value={form.hora}
            onChange={(e) => handleChange('hora', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary transition-all outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">Motivo da Consulta</label>
          <textarea
            required
            rows={2}
            value={form.descricao}
            onChange={(e) => handleChange('descricao', e.target.value)}
            placeholder="Descreva o motivo da consulta"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary transition-all outline-none resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">Diagnóstico</label>
          <textarea
            rows={3}
            value={form.diagnostico}
            onChange={(e) => handleChange('diagnostico', e.target.value)}
            placeholder="Descreva o diagnóstico"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary transition-all outline-none resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">Tratamento</label>
          <textarea
            rows={3}
            value={form.tratamento}
            onChange={(e) => handleChange('tratamento', e.target.value)}
            placeholder="Descreva o tratamento indicado"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary transition-all outline-none resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">Prescrição / Recomendações</label>
          <textarea
            rows={3}
            value={form.prescricao}
            onChange={(e) => handleChange('prescricao', e.target.value)}
            placeholder="Medicamentos, dosagem, recomendações..."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary transition-all outline-none resize-none"
          />
        </div>

        <div className="md:col-span-2 flex items-center justify-end gap-6 pt-6 mt-6 border-t border-slate-100">
          <Link
            href="/prontuarios"
            className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            CANCELAR
          </Link>
          <button
            type="submit"
            className="px-10 py-3 bg-primary hover:bg-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-95"
          >
            {prontuarioExistente ? 'SALVAR ALTERAÇÕES' : 'REGISTRAR PRONTUÁRIO'}
          </button>
        </div>
      </div>
    </form>
  );
}
