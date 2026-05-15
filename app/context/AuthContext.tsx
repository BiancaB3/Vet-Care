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
import type { Veterinarian } from './VetContext';

const AUTH_TOKEN_KEY = 'vetcare_auth_token';
const AUTH_VET_KEY = 'vetcare_auth_vet';

export type AuthContextProps = {
  currentVet: Veterinarian | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (vet: Veterinarian) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentVet, setCurrentVet] = useState<Veterinarian | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedVet = localStorage.getItem(AUTH_VET_KEY);
    if (storedToken && storedVet) {
      try {
        const vet = JSON.parse(storedVet) as Veterinarian;
        setToken(storedToken);
        setCurrentVet(vet);
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_VET_KEY);
      }
    }
  }, []);

  const login = useCallback((vet: Veterinarian) => {
    const newToken = `mock-${vet.id}-${Date.now()}`;
    setCurrentVet(vet);
    setToken(newToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_TOKEN_KEY, newToken);
      localStorage.setItem(AUTH_VET_KEY, JSON.stringify(vet));
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentVet(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_VET_KEY);
    }
  }, []);

  const value = useMemo<AuthContextProps>(
    () => ({
      currentVet,
      token,
      isAuthenticated: currentVet !== null && token !== null,
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
