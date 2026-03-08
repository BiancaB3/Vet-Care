'use client';

export default function Header() {
  return (
    <header className="w-full border-b border-zinc-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Lado Esquerdo: Identidade do Chef */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-zinc-100 border border-zinc-200">
              {/* Ícone de Usuário SVG - W3C Standard */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5 text-zinc-600"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm font-bold text-zinc-800 leading-tight">
                Danilo Dias
              </span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">
                Chef Executivo
              </span>
            </div>
          </div>

          {/* Lado Direito: Ação de Sair */}
          <button 
            type="button"
            className="group flex items-center gap-2 px-3 py-2 rounded-md hover:bg-zinc-50 transition-colors"
          >
            <span className="hidden sm:block text-sm font-medium text-zinc-500 group-hover:text-zinc-800">
              Sair
            </span>
            {/* Ícone de LogOut SVG - W3C Standard */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-5 h-5 text-zinc-400 group-hover:text-red-500 transition-colors"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>

        </div>
      </div>
    </header>
  );
}