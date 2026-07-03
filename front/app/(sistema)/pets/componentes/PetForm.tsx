'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { criarPet, atualizarPet } from '@/app/services/petService';
import { listarTutores } from '@/app/services/tutorService';
import type { PetResponse } from '@/app/types/pet';
import type { TutorResponse } from '@/app/types/tutor';
import { pushNotification } from '@/app/redux/slices/notificationsSlice';
import { getDraft, saveDraft, clearDraft } from '@/app/context/formDraft';

export type PetFormProps = {
  petExistente?: PetResponse;
};

type PetFormState = {
  tutorId: string;
  nome: string;
  especie: string;
  raca: string;
  idade: string;
  peso: string;
  sexo: string;
  cor: string;
};

const emptyForm = (): PetFormState => ({
  tutorId: '',
  nome: '',
  especie: '',
  raca: '',
  idade: '',
  peso: '',
  sexo: '',
  cor: '',
});

export default function PetForm({ petExistente }: PetFormProps) {
  const router = useRouter();
  const dispatch = useDispatch();

  const draftId = petExistente ? String(petExistente.id) : undefined;

  const [tutores, setTutores] = useState<TutorResponse[]>([]);
  const [form, setForm] = useState<PetFormState>(() => {
    if (petExistente) {
      return {
        tutorId: petExistente.tutorId != null ? String(petExistente.tutorId) : '',
        nome: petExistente.nome,
        especie: petExistente.especie,
        raca: petExistente.raca ?? '',
        idade: petExistente.idade != null ? String(petExistente.idade) : '',
        peso: petExistente.peso != null ? String(petExistente.peso) : '',
        sexo: petExistente.sexo,
        cor: petExistente.cor,
      };
    }

    const draft = getDraft('pet');
    if (draft) {
      return {
        tutorId: draft.tutorId,
        nome: draft.name,
        especie: draft.species,
        raca: draft.breed,
        idade: draft.age,
        peso: draft.weight,
        sexo: draft.sex,
        cor: draft.color,
      };
    }

    return emptyForm();
  });

  useEffect(() => {
    carregarTutores();
  }, []);

  const carregarTutores = async () => {
    try {
      const dados = await listarTutores();
      setTutores(dados);
    } catch (error) {
      alert('Erro ao carregar lista de tutores!');
      console.error(error);
    }
  };

  const salvarRascunho = (next: PetFormState) => {
    if (petExistente) return;
    saveDraft('pet', {
      tutorId: next.tutorId,
      name: next.nome,
      species: next.especie,
      breed: next.raca,
      age: next.idade,
      weight: next.peso,
      sex: next.sexo,
      color: next.cor,
    });
  };

  const handleChange = (campo: keyof PetFormState, valor: string) => {
    setForm((prev) => {
      const next = { ...prev, [campo]: valor };
      salvarRascunho(next);
      return next;
    });
  };

  const handleSalvar = async (formData: FormData) => {
    const payload = {
      nome: form.nome,
      especie: form.especie,
      raca: form.raca ? form.raca : null,
      idade: form.idade ? Number(form.idade) : null,
      peso: form.peso ? Number(form.peso) : null,
      sexo: form.sexo,
      cor: form.cor,
      tutor: { id: Number(form.tutorId) },
    };

    try {
      if (petExistente) {
        await atualizarPet(petExistente.id, payload);
        dispatch(
          pushNotification({
            message: `Pet "${form.nome}" atualizado com sucesso`,
            type: 'edicao',
          }),
        );
      } else {
        await criarPet(payload);
        dispatch(
          pushNotification({
            message: `Pet "${form.nome}" cadastrado com sucesso`,
            type: 'cadastro',
          }),
        );
      }
    } catch (error) {
      alert('Erro ao salvar pet!');
      console.error(error);
      return;
    }

    clearDraft('pet', draftId);
    router.push('/pets');
  };

  return (
    <form action={handleSalvar} className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Tutor</label>
          <select
            required
            value={form.tutorId}
            onChange={(e) => handleChange('tutorId', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary transition-all outline-none"
          >
            <option value="">Selecione o tutor</option>
            {tutores.map((tutor) => (
              <option key={tutor.id} value={tutor.id}>
                {tutor.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Nome do Pet</label>
          <input
            type="text"
            required
            value={form.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            placeholder="Nome do Pet"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary transition-all outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Espécie</label>
          <select
            required
            value={form.especie}
            onChange={(e) => handleChange('especie', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary transition-all outline-none"
          >
            <option value="">Selecione espécie</option>
            <option value="Cao">Cão</option>
            <option value="Gato">Gato</option>
            <option value="Ave">Ave</option>
            <option value="Reptil">Réptil</option>
            <option value="Roedor">Roedor</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Raça</label>
          <input
            type="text"
            value={form.raca}
            onChange={(e) => handleChange('raca', e.target.value)}
            placeholder="Raça"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary transition-all outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Idade (anos)</label>
          <input
            type="number"
            min={0}
            value={form.idade}
            onChange={(e) => handleChange('idade', e.target.value)}
            placeholder="Idade"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary transition-all outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Peso (kg)</label>
          <input
            type="number"
            step="0.1"
            min={0}
            value={form.peso}
            onChange={(e) => handleChange('peso', e.target.value)}
            placeholder="Peso em kg"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary transition-all outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Sexo</label>
          <select
            required
            value={form.sexo}
            onChange={(e) => handleChange('sexo', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary transition-all outline-none"
          >
            <option value="">Selecione o sexo</option>
            <option value="Macho">Macho</option>
            <option value="Femea">Fêmea</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Cor</label>
          <input
            type="text"
            required
            value={form.cor}
            onChange={(e) => handleChange('cor', e.target.value)}
            placeholder="Cor"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary transition-all outline-none"
          />
        </div>

        <div className="md:col-span-2 flex items-center justify-end gap-6 pt-6 mt-6 border-t border-slate-100">
          <Link
            href="/pets"
            className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            CANCELAR
          </Link>
          <button
            type="submit"
            className="px-10 py-3 bg-primary hover:bg-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-95"
          >
            {petExistente ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR PET'}
          </button>
        </div>
      </div>
    </form>
  );
}
