import api from './api';
import type { AgendamentoRequest, AgendamentoResponse } from '../types/agendamento';

export async function listarAgendamentos(): Promise<AgendamentoResponse[]> {
  const response = await api.get<AgendamentoResponse[]>('/agendamentos');
  return response.data;
}

export async function buscarAgendamentoPorId(id: number): Promise<AgendamentoResponse> {
  const response = await api.get<AgendamentoResponse>(`/agendamentos/${id}`);
  return response.data;
}

export async function criarAgendamento(
  payload: AgendamentoRequest,
): Promise<AgendamentoResponse> {
  const response = await api.post<AgendamentoResponse>('/agendamentos', payload);
  return response.data;
}

export async function atualizarAgendamento(
  id: number,
  payload: AgendamentoRequest,
): Promise<void> {
  await api.put(`/agendamentos/${id}`, payload);
}

export async function excluirAgendamento(id: number): Promise<void> {
  await api.delete(`/agendamentos/${id}`);
}
