'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

const links = [
  { href: '/agendamentos', label: 'Agendamentos' },
  { href: '/tutores', label: 'Tutores' },
  { href: '/pets', label: 'Pets' },
  { href: '/prontuarios', label: 'Prontuários' },
  { href: '/veterinarios', label: 'Veterinários' },
];

export default function HomePage() {
  const usuario = useSelector((state: RootState) => state.auth.usuario);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">
        Bem-vindo{usuario?.nome ? `, ${usuario.nome}` : ''}!
      </h1>
      <p className="text-slate-500 mb-8">O que você gostaria de gerenciar hoje?</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:border-primary hover:shadow-md transition-all font-semibold text-slate-700"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
