'use client';

import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { logout as logoutAction } from '../redux/slices/authSlice';
import NotificationBell from './NotificationBell';

export default function Header() {
  const usuario = useSelector((state: RootState) => state.auth.usuario);
  const dispatch = useDispatch();
  const logout = () => dispatch(logoutAction());

  return (
    <header className="w-full sticky top-0 z-50 bg-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/home" className="flex items-center gap-2">
            <img src="/LOGOVETCARE.png" alt="VetCare" width={36} height={36} className="h-9 w-9 object-cover rounded-full mix-blend-multiply" />
            <span className="text-lg font-bold text-white">VetCare</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            <Link href="/home" className="px-3 py-2 text-sm text-white hover:bg-secondary rounded">Home</Link>
            <Link href="/agendamentos" className="px-3 py-2 text-sm text-white hover:bg-secondary rounded">Agendamentos</Link>
            <Link href="/tutores" className="px-3 py-2 text-sm text-white hover:bg-secondary rounded">Tutores</Link>
            <Link href="/pets" className="px-3 py-2 text-sm text-white hover:bg-secondary rounded">Pets</Link>
            <Link href="/prontuarios" className="px-3 py-2 text-sm text-white hover:bg-secondary rounded">Prontuários</Link>
            <Link href="/veterinarios" className="px-3 py-2 text-sm text-white hover:bg-secondary rounded">Veterinários</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell />
          <div className="flex flex-col text-right">
            <span className="text-sm font-bold text-white">{usuario?.nome ?? 'Veterinário'}</span>
            <span className="text-xs text-zinc-200">{usuario?.crmv ?? 'CRMV'}</span>
          </div>
          <button onClick={logout} className="px-3 py-2 rounded bg-secondary text-white hover:bg-secondary/80">Sair</button>
        </div>
      </div>
    </header>
  );
}
