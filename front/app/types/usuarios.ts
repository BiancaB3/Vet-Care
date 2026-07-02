export interface Usuario {
  id: number | null;
  nome: string;
  email: string;
  status: string;
  senha: string;
  cpf?: string | null;
  crmv?: string | null;
  telefone?: string | null;
  role?: string | null;
}

export interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (usuario: Usuario, token: string) => void;
  logout: () => void;
}

export interface UsuarioFormProps {
  usuarioExistente?: Usuario;
}