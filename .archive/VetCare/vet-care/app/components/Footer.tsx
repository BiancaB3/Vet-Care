export default function Footer() {
  // Pega o ano atual dinamicamente (2026)
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-zinc-50 border-t border-zinc-200 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Copyright Section */}
          <div className="text-center md:text-left">
            <p className="text-sm text-zinc-500 font-medium">
              &copy; {currentYear} <span className="text-zinc-900 font-semibold tracking-tight">ChefOrder</span>. 
              <span className="block sm:inline ml-1">Todos os direitos reservados.</span>
            </p>
          </div>

          {/* Links de Suporte e Termos */}
          <nav className="flex items-center gap-8">
            <a 
              href="#" 
              className="group flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-all duration-200"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 group-hover:rotate-12 transition-transform"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Suporte
            </a>

            <a 
              href="#" 
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:underline underline-offset-4 decoration-zinc-300 transition-all"
            >
              Termos de uso
            </a>
          </nav>
          
        </div>
      </div>
    </footer>
  );
}