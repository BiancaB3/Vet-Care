import api from './api';
import type { PetRequest, PetResponse } from '../types/pet';

export async function listarPets(): Promise<PetResponse[]> {
  const response = await api.get<PetResponse[]>('/pets');
  return response.data;
}

export async function buscarPetPorId(id: number): Promise<PetResponse> {
  const response = await api.get<PetResponse>(`/pets/${id}`);
  return response.data;
}

export async function criarPet(payload: PetRequest): Promise<PetResponse> {
  const response = await api.post<PetResponse>('/pets', payload);
  return response.data;
}

export async function atualizarPet(id: number, payload: PetRequest): Promise<void> {
  await api.put(`/pets/${id}`, payload);
}

export async function excluirPet(id: number, pet: PetResponse): Promise<void> {
  if (pet.tutorId == null) {
    throw new Error('Pet sem tutor associado nao pode ser excluido.');
  }

  await api.put(`/pets/${id}`, {
    nome: '__DELETE__',
    especie: pet.especie,
    raca: pet.raca,
    idade: pet.idade,
    peso: pet.peso,
    sexo: pet.sexo,
    cor: pet.cor,
    tutor: { id: pet.tutorId },
  });
}
