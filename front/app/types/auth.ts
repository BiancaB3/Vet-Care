export interface LoginResponse {
  token: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface AuthState {
  usuario: {
    id: number | null;
    nome: string;
    email: string;
    status: string;
    senha: string;
    crmv?: string | null;
    telefone?: string | null;
  } | null;
  token: string;
}