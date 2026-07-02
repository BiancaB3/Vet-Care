import { AuthState } from "@/app/types/auth";
import { Usuario } from "@/app/types/usuarios";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import Cookies from "js-cookie";

const usuarioRecover = Cookies.get('usuario');
const tokenRecover = Cookies.get('token');

function shouldUseSecureCookie(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.location.protocol === 'https:';
}

function parseUsuarioFromCookie(raw: string | undefined): Usuario | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Usuario;
  } catch {
    Cookies.remove('usuario');
    return null;
  }
}

const initialState: AuthState = {
  usuario: tokenRecover ? parseUsuarioFromCookie(usuarioRecover) : null,
  token: tokenRecover ?? ""
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      Cookies.set('token', action.payload.token, {
        expires: 7,
        secure: shouldUseSecureCookie(),
        sameSite: 'lax',
      })
    },
    setUsuario: (state, action: PayloadAction<{ usuario: Usuario }>) => {
      state.usuario = action.payload.usuario;
      Cookies.set('usuario', JSON.stringify(action.payload.usuario), { expires: 7 });
    },
    logout: (state) => {
      state.token = "";
      state.usuario = null;
      Cookies.remove('usuario');
      Cookies.remove('token');
    }
  }
});

export const { setToken, setUsuario, logout } = authSlice.actions;
export default authSlice.reducer;