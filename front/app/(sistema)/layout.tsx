'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function SistemaLayout({ children }: { children: React.ReactNode }) {
  const usuario = useSelector((state: RootState) => state.auth.usuario);
  const router = useRouter();

  useEffect(() => {
    if (usuario == null) {
      router.push('/login');
    }
  }, [usuario, router]);

  if (usuario == null) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
