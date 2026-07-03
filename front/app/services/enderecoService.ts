import api from './api';
import type { EnderecoResponse } from '../types/endereco';

export async function buscarEnderecoPorCep(cep: string): Promise<EnderecoResponse> {
  const response = await api.get<EnderecoResponse>(`/api/enderecos/${cep}`);
  return response.data;
}
