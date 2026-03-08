import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-header w-full mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm text-zinc-300 font-medium">
              &copy; {currentYear}{' '}
              <span className="text-white font-semibold tracking-tight">
                VetCare
              </span>
              .
              <span className="block sm:inline ml-1">
                Todos os direitos reservados.
              </span>
            </p>
          </div>
          <nav className="flex items-center gap-8">
            <a
              href="#"
              className="app-link group flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-[#61dafb] transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 group-hover:rotate-12 transition-transform"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Suporte
            </a>
            <a
              href="#"
              className="app-link text-sm font-medium text-zinc-400 hover:text-[#61dafb] hover:underline underline-offset-4 transition-all"
            >
              Termos de uso
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
