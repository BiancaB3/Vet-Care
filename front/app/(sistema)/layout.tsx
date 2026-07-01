'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

export default function SistemaLayout({ children }: { children: React.ReactNode }) {
  const usuario = useSelector((state: RootState) => state.auth.usuario);
  const router = useRouter();

  useEffect(() => {
    if (usuario == null) {
      router.push('/login');
    }
  }, [usuario, router]);

  if (usuario == null) return null;

  return <>{children}</>;
}
