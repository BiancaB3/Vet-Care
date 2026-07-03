import api from './api';
import type {
  VeterinarioCadastroRequest,
  VeterinarioUpdateRequest,
  VeterinarioResponse,
} from '../types/veterinario';

export async function listarVeterinarios(): Promise<VeterinarioResponse[]> {
  const response = await api.get<VeterinarioResponse[]>('/veterinarios');
  return response.data;
}

export async function buscarVeterinarioPorId(id: number): Promise<VeterinarioResponse> {
  const response = await api.get<VeterinarioResponse>(`/veterinarios/${id}`);
  return response.data;
}

export async function buscarVeterinarioLogado(): Promise<VeterinarioResponse> {
  const response = await api.get<VeterinarioResponse>('/veterinarios/logado');
  return response.data;
}

export async function cadastrarVeterinario(
  payload: VeterinarioCadastroRequest,
): Promise<VeterinarioResponse> {
  const response = await api.post<VeterinarioResponse>('/veterinarios/cadastro', payload);
  return response.data;
}

export async function atualizarVeterinario(
  id: number,
  payload: VeterinarioUpdateRequest,
): Promise<void> {
  await api.put(`/veterinarios/${id}`, payload);
}
