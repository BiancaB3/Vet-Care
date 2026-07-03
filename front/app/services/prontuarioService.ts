import api from './api';
import type { ProntuarioRequest, ProntuarioResponse } from '../types/prontuario';

export async function listarProntuarios(): Promise<ProntuarioResponse[]> {
  const response = await api.get<ProntuarioResponse[]>('/prontuarios');
  return response.data;
}

export async function buscarProntuarioPorId(id: number): Promise<ProntuarioResponse> {
  const response = await api.get<ProntuarioResponse>(`/prontuarios/${id}`);
  return response.data;
}

export async function criarProntuario(
  payload: ProntuarioRequest,
): Promise<ProntuarioResponse> {
  const response = await api.post<ProntuarioResponse>('/prontuarios', payload);
  return response.data;
}

export async function atualizarProntuario(
  id: number,
  payload: ProntuarioRequest,
): Promise<void> {
  await api.put(`/prontuarios/${id}`, payload);
}

export async function excluirProntuario(id: number): Promise<void> {
  await api.delete(`/prontuarios/${id}`);
}
