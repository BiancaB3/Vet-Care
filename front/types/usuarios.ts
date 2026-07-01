
export class Usuario {
    constructor(
        public id: number|null,
        public nome: string,
        public email: string,
        public status: string,
        public senha: string,
        public crmv?: string,
        public telefone?: string
    ) { }
}

export interface AuthContextType {
    usuario: Usuario | null,
    token: string | null,
    login: (usuario: Usuario, token: string) => void,
    logout: () => void
}

export interface UsuarioFormProps {
    usuarioExistente?: Usuario
}