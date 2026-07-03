export default function Footer() {
 
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto border-t border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-teal-50 py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">

          {/* Logo e Copyright - Cores de texto ajustadas para contraste */}
          <div className="flex items-center gap-3">
            {/* Ícone com tom VetCare (emerald/teal) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-emerald-600"
            >
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <line x1="20" y1="4" x2="8.12" y2="15.88" />
              <line x1="14.47" y1="14.48" x2="20" y2="20" />
              <line x1="8.12" y1="8.12" x2="12" y2="12" />
            </svg>
            <p className="text-sm text-emerald-900/90 font-semibold tracking-tight">
              VetCare <span className="text-emerald-300 mx-2">•</span> © {currentYear}
            </p>
          </div>

          {/* Links de Navegação */}
          <nav className="flex items-center gap-8">
            <a
              href="#"
              className="text-[11px] uppercase tracking-[0.18em] text-emerald-700/80 hover:text-emerald-900 transition-colors duration-200 font-extrabold"
            >
              Suporte
            </a>
            <a
              href="#"
              className="text-[11px] uppercase tracking-[0.18em] text-emerald-700/80 hover:text-emerald-900 transition-colors duration-200 font-extrabold"
            >
              Termos
            </a>
          </nav>

        </div>

        {/* Linha decorativa de saída - Ajustada para o tema VetCare */}
        <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-emerald-200 to-transparent opacity-80"></div>
      </div>
    </footer>
  );
}