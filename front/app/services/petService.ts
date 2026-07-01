import api from './api';
import type { Pet } from '../context/VetContext';

type TutorRefApi = {
  id: number;
};

type PetApi = {
  id: number;
  nome: string;
  especie: string;
  raca?: string | null;
  idade?: number | null;
  peso?: number | null;
  sexo?: string | null;
  cor?: string | null;
  tutor?: TutorRefApi | null;
};

type PetPayload = {
  tutorId: string;
  nome?: string;
  especie?: string;
  raca?: string;
  idade?: number;
  peso?: number;
};

function toPetModel(vetId: string, item: PetApi): Pet {
  return {
    id: String(item.id),
    vetId,
    tutorId: String(item.tutor?.id ?? ''),
    name: item.nome,
    species: item.especie,
    breed: item.raca ?? undefined,
    age: item.idade ?? undefined,
    weight: item.peso ?? undefined,
    createdAt: new Date(),
  };
}

function toPetPayload(payload: PetPayload) {
  return {
    nome: payload.nome ?? '',
    especie: payload.especie ?? '',
    raca: payload.raca ?? null,
    idade: payload.idade ?? null,
    peso: payload.peso ?? null,
    sexo: null,
    cor: null,
    tutor: {
      id: Number(payload.tutorId),
    },
  };
}

export async function listarPets(vetId: string): Promise<Pet[]> {
  const response = await api.get<PetApi[]>('/pets');
  return response.data.map((item) => toPetModel(vetId, item));
}

export async function criarPet(vetId: string, payload: PetPayload): Promise<Pet> {
  const response = await api.post<number>('/pets', toPetPayload(payload));
  const criado = await api.get<PetApi>(`/pets/${response.data}`);
  return toPetModel(vetId, criado.data);
}

export async function atualizarPet(vetId: string, id: number, payload: PetPayload): Promise<Pet> {
  await api.put(`/pets/${id}`, toPetPayload(payload));
  const atualizado = await api.get<PetApi>(`/pets/${id}`);
  return toPetModel(vetId, atualizado.data);
}

export async function excluirPet(id: number): Promise<void> {
  await api.delete(`/pets/${id}`);
}
