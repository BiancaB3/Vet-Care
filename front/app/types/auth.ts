export interface LoginResponse {
  token: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface AuthState {
  usuario: import('./veterinario').VeterinarioResponse | null;
  token: string;
}