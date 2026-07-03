export interface TutorRequest {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  cep: string;
  endereco?: string;
  status?: string;
}

export interface TutorResponse {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  cep: string;
  endereco: string;
  status: string;
}
