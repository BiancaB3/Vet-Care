'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Veterinarian } from './VetContext';
import type { RootState } from '../redux/store';
import { logout as logoutAction } from '../redux/slices/authSlice';

export type AuthContextProps = {
  currentVet: Veterinarian | null;
  token: string;
  isAuthenticated: boolean;
  login: (vet: Veterinarian) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const usuario = useSelector((state: RootState) => state.auth.usuario);
  const token = useSelector((state: RootState) => state.auth.token);
  const [currentVet, setCurrentVet] = useState<Veterinarian | null>(null);

  useEffect(() => {
    if (usuario == null) {
      setCurrentVet(null);
      return;
    }

    setCurrentVet({
      id: String(usuario.id ?? ''),
      name: usuario.nome,
      email: usuario.email,
      crmv: usuario.crmv ?? 'Nao informado',
      phone: usuario.telefone ?? '',
    });
  }, [usuario]);

  const login = useCallback((vet: Veterinarian) => {
    setCurrentVet(vet);
  }, []);

  const logout = useCallback(() => {
    setCurrentVet(null);
    dispatch(logoutAction());
  }, [dispatch]);

  const value = useMemo<AuthContextProps>(
    () => ({
      currentVet,
      token,
      isAuthenticated: currentVet !== null && token.length > 0,
      login,
      logout,
    }),
    [currentVet, token, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa estar dentro do AuthProvider');
  return context;
}
