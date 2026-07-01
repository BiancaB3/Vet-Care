import api from './api';
import type { Tutor } from '../context/VetContext';

type TutorApi = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf?: string | null;
  cep?: string | null;
  endereco?: string | null;
  status?: string | null;
};

type TutorPayload = {
  nome: string;
  email: string;
  telefone: string;
  cpf?: string | null;
  cep?: string | null;
  endereco?: string | null;
  status?: string | null;
};

function toTutorModel(item: TutorApi): Tutor {
  return {
    id: String(item.id),
    vetId: 'api',
    name: item.nome,
    email: item.email,
    phone: item.telefone,
    cpf: item.cpf ?? '',
    cep: item.cep ?? '',
    createdAt: new Date(),
  };
}

export async function listarTutores(): Promise<Tutor[]> {
  const response = await api.get<TutorApi[]>('/tutores');
  return response.data.map(toTutorModel);
}

export async function criarTutor(payload: TutorPayload): Promise<Tutor> {
  const response = await api.post<number>('/tutores', payload);
  const criado = await api.get<TutorApi>(`/tutores/${response.data}`);
  return toTutorModel(criado.data);
}

export async function atualizarTutor(id: number, payload: TutorPayload): Promise<Tutor> {
  await api.put(`/tutores/${id}`, payload);
  const atualizado = await api.get<TutorApi>(`/tutores/${id}`);
  return toTutorModel(atualizado.data);
}

export async function excluirTutor(id: number): Promise<void> {
  await api.delete(`/tutores/${id}`);
}
