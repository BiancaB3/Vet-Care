
export class Usuario {
    constructor(
        public id: number|null,
        public nome: string,
        public email: string,
        public status: string,
        public senha: string 
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