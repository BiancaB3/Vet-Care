import api from './api';
import type { TutorRequest, TutorResponse } from '../types/tutor';

export async function listarTutores(): Promise<TutorResponse[]> {
  const response = await api.get<TutorResponse[]>('/tutores');
  return response.data;
}

export async function buscarTutorPorId(id: number): Promise<TutorResponse> {
  const response = await api.get<TutorResponse>(`/tutores/${id}`);
  return response.data;
}

export async function criarTutor(payload: TutorRequest): Promise<TutorResponse> {
  const response = await api.post<TutorResponse>('/tutores', payload);
  return response.data;
}

export async function atualizarTutor(id: number, payload: TutorRequest): Promise<void> {
  await api.put(`/tutores/${id}`, payload);
}
