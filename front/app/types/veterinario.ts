export interface VeterinarioCadastroRequest {
  nome: string;
  crmv: string;
  especialidade?: string;
  telefone?: string;
  email: string;
  senha: string;
}

export interface VeterinarioUpdateRequest {
  nome: string;
  crmv: string;
  especialidade?: string;
  telefone?: string;
  email: string;
  senha?: string;
}

export interface VeterinarioResponse {
  id: number;
  nome: string;
  crmv: string;
  especialidade: string;
  telefone: string;
  email: string;
}
