export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Texto de Copyright e Identidade */}
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            {/* Ícone W3C SVG: Copyright/Info */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-zinc-400"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <p>
              &copy; {currentYear}{' '}
              <span className="font-semibold text-zinc-700">VetCare</span>. Todos os direitos reservados.
            </p>
          </div>

          {/* Links de Navegação */}
          <div className="flex items-center gap-8">
            <a
              href="#"
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-all duration-200"
            >
              Suporte
            </a>
            <a
              href="#"
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-all duration-200"
            >
              Termos de uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}