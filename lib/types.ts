export interface Veterinario {
  id: string;
  nome: string;
  crmv: string;
  email: string;
  senha: string;
}

export interface VeterinarioLogado {
  id: string;
  nome: string;
  crmv: string;
  email: string;
}

export interface Tutor {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  veterinarioId: string;
}

export interface Pet {
  id: string;
  nome: string;
  especie: string;
  raca: string;
  tutorId: string;
  veterinarioId: string;
}

export interface Consulta {
  id: string;
  dataHora: string;
  diagnostico: string;
  prescricao: string;
  petId: string;
  veterinarioId: string;
}
