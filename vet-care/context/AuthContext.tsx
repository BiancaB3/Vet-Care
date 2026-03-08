'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { VeterinarioLogado } from '@/lib/types';
import { getVeterinarioPorEmailSenha } from '@/lib/mockData';

const STORAGE_USER = 'vetcare_user';

interface AuthContextType {
  veterinario: VeterinarioLogado | null;
  loading: boolean;
  login: (email: string, senha: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [veterinario, setVeterinario] = useState<VeterinarioLogado | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_USER);
      if (raw) {
        const user = JSON.parse(raw) as VeterinarioLogado;
        setVeterinario(user);
      }
    } catch {
      localStorage.removeItem(STORAGE_USER);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((email: string, senha: string): boolean => {
    const vet = getVeterinarioPorEmailSenha(email, senha);
    if (!vet) return false;
    const logado: VeterinarioLogado = { id: vet.id, nome: vet.nome, crmv: vet.crmv, email: vet.email };
    setVeterinario(logado);
    localStorage.setItem(STORAGE_USER, JSON.stringify(logado));
    return true;
  }, []);

  const logout = useCallback(() => {
    setVeterinario(null);
    localStorage.removeItem(STORAGE_USER);
  }, []);

  return (
    <AuthContext.Provider value={{ veterinario, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
