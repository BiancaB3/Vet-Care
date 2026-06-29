'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { currentVet, logout } = useAuth();

  return (
    <header className="w-full sticky top-0 z-50 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/agendamentos" className="flex items-center gap-2">
            <img src="/LOGOVETCARE.png" alt="VetCare" width={36} height={36} className="h-9 w-9 object-cover rounded-full mix-blend-multiply" />
            <span className="text-lg font-bold text-white">VetCare</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            <Link href="/agendamentos" className="px-3 py-2 text-sm text-white hover:bg-blue-700 rounded">Agendamentos</Link>
            <Link href="/tutores" className="px-3 py-2 text-sm text-white hover:bg-blue-700 rounded">Tutores</Link>
            <Link href="/pets" className="px-3 py-2 text-sm text-white hover:bg-blue-700 rounded">Pets</Link>
            <Link href="/veterinarios" className="px-3 py-2 text-sm text-white hover:bg-blue-700 rounded">Veterinários</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-sm font-bold text-white">{currentVet?.name ?? 'Veterinário'}</span>
            <span className="text-xs text-zinc-200">{currentVet?.crmv ?? 'CRMV'}</span>
          </div>
          <button onClick={logout} className="px-3 py-2 rounded bg-blue-800 text-white hover:bg-blue-900">Sair</button>
        </div>
      </div>
    </header>
  );
}
