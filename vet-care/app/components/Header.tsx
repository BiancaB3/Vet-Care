'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { veterinario, logout } = useAuth();

  return (
    <header className="app-header w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/home" className="flex items-center gap-2">
              <img
                src="/logo.svg"
                alt="VetCare"
                width={36}
                height={36}
                className="h-9 w-9 flex-shrink-0"
              />
              <span className="text-lg font-bold text-white">VetCare</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-1">
              <Link
                href="/home"
                className="app-link px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              >
                Início
              </Link>
              <Link
                href="/agenda"
                className="app-link px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              >
                Agenda
              </Link>
              <Link
                href="/tutores-pets"
                className="app-link px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              >
                Tutores e Pets
              </Link>
              <Link
                href="/consulta/nova"
                className="app-link px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              >
                Nova consulta
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/10 border border-white/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-[#61dafb]"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white leading-tight">
                  {veterinario?.nome ?? 'Veterinário'}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">
                  {veterinario?.crmv ?? 'CRMV'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => logout()}
              className="app-link group flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors text-zinc-300 hover:text-white"
            >
              <span className="hidden sm:block text-sm font-medium">Sair</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-[#61dafb] group-hover:text-white transition-colors"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
