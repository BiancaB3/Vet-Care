import type { Veterinario, Tutor, Pet, Consulta } from './types';

const VET_ID = 'vet-1';

export const veterinariosMock: Veterinario[] = [
  {
    id: VET_ID,
    nome: 'Maria Silva',
    crmv: 'SP 12345',
    email: 'maria@vetcare.com',
    senha: '123456',
  },
  {
    id: 'vet-2',
    nome: 'João Santos',
    crmv: 'SP 67890',
    email: 'joao@vetcare.com',
    senha: '123456',
  },
];

const STORAGE_KEYS = {
  tutores: (vetId: string) => `vetcare_tutores_${vetId}`,
  pets: (vetId: string) => `vetcare_pets_${vetId}`,
  consultas: (vetId: string) => `vetcare_consultas_${vetId}`,
} as const;

function getFromStorage<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

const tutoresIniciais: Tutor[] = [
  { id: 't1', nome: 'Carlos Souza', telefone: '(11) 99999-1111', email: 'carlos@email.com', veterinarioId: VET_ID },
  { id: 't2', nome: 'Ana Oliveira', telefone: '(11) 98888-2222', email: 'ana@email.com', veterinarioId: VET_ID },
];

const petsIniciais: Pet[] = [
  { id: 'p1', nome: 'Thor', especie: 'Cão', raca: 'Golden Retriever', tutorId: 't1', veterinarioId: VET_ID },
  { id: 'p2', nome: 'Luna', especie: 'Gato', raca: 'Persa', tutorId: 't2', veterinarioId: VET_ID },
];

const consultasIniciais: Consulta[] = [
  {
    id: 'c1',
    dataHora: new Date(Date.now() + 86400000).toISOString(),
    diagnostico: 'Check-up anual',
    prescricao: 'Vermífugo mensal.',
    petId: 'p1',
    veterinarioId: VET_ID,
  },
];

export function getVeterinarioPorEmailSenha(email: string, senha: string): Veterinario | undefined {
  return veterinariosMock.find((v) => v.email === email && v.senha === senha);
}

export function getTutores(vetId: string): Tutor[] {
  const key = STORAGE_KEYS.tutores(vetId);
  const stored = getFromStorage<Tutor>(key, []);
  if (stored.length === 0) {
    const iniciais = tutoresIniciais.filter((t) => t.veterinarioId === vetId);
    setStorage(key, iniciais);
    return iniciais;
  }
  return stored.filter((t) => t.veterinarioId === vetId);
}

export function setTutores(vetId: string, tutores: Tutor[]): void {
  setStorage(STORAGE_KEYS.tutores(vetId), tutores.filter((t) => t.veterinarioId === vetId));
}

export function getPets(vetId: string): Pet[] {
  const key = STORAGE_KEYS.pets(vetId);
  const stored = getFromStorage<Pet>(key, []);
  if (stored.length === 0) {
    const iniciais = petsIniciais.filter((p) => p.veterinarioId === vetId);
    setStorage(key, iniciais);
    return iniciais;
  }
  return stored.filter((p) => p.veterinarioId === vetId);
}

export function setPets(vetId: string, pets: Pet[]): void {
  setStorage(STORAGE_KEYS.pets(vetId), pets.filter((p) => p.veterinarioId === vetId));
}

export function getConsultas(vetId: string): Consulta[] {
  const key = STORAGE_KEYS.consultas(vetId);
  const stored = getFromStorage<Consulta>(key, []);
  if (stored.length === 0) {
    const iniciais = consultasIniciais.filter((c) => c.veterinarioId === vetId);
    setStorage(key, iniciais);
    return iniciais;
  }
  return stored.filter((c) => c.veterinarioId === vetId);
}

export function setConsultas(vetId: string, consultas: Consulta[]): void {
  setStorage(STORAGE_KEYS.consultas(vetId), consultas.filter((c) => c.veterinarioId === vetId));
}
