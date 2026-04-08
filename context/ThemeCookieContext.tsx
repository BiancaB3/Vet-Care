'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface ThemeCookieContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeCookieContext = createContext<ThemeCookieContextType>({ theme: 'light', setTheme: () => {} });

export function ThemeCookieProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState('light');

  useEffect(() => {
    const saved = Cookies.get('theme') || 'light';
    setThemeState(saved);
  }, []);

  const setTheme = (theme: string) => {
    Cookies.set('theme', theme);
    setThemeState(theme);
  };

  return (
    <ThemeCookieContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeCookieContext.Provider>
  );
}

export function useThemeCookie() {
  return useContext(ThemeCookieContext);
}
