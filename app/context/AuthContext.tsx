
"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";

type User = {
  id?: number;
  nome: string;
  email?: string;
};

type AuthContextProps = {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = Cookies.get("usuario");
    const savedToken = Cookies.get("token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    Cookies.set("usuario", JSON.stringify(user), { expires: 7 });
    Cookies.set("token", token, { expires: 7 });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove("usuario");
    Cookies.remove("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa estar dentro do AuthProvider");
  return context;
}
