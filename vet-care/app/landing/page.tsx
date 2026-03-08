import React from "react";
import { Calendar, ClipboardList, Dog, Users, CheckCircle, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  // Scroll helpers
  const scrollToSection = (section: string) => {
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 text-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#a2d4b8] to-[#7bc4a1] rounded-2xl flex items-center justify-center shadow-lg">
              {/* Logo SVG */}
              {/* ...SVG code... */}
            </div>
            <h1 className="text-2xl font-bold text-[#a2d4b8]">VetCare</h1>
          </div>
          <button onClick={() => scrollToSection("features")} className="px-6 py-2.5 text-slate-600 hover:text-primary font-medium transition-colors">Recursos</button>
          <a href="/login" className="px-6 py-3 bg-gradient-to-br from-[#a2d4b8] to-[#7bc4a1] hover:shadow-lg hover:shadow-primary/40 text-white font-bold rounded-xl transition-all shadow-lg">Acessar</a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">Bem-vindo ao VetCare</h2>
                <p className="text-xl text-slate-600 leading-relaxed">Sistema completo de gestão veterinária para clínicas e consultórios modernos</p>
              </div>
              <div className="flex gap-4">
                <a href="/login" className="px-8 py-4 bg-gradient-to-br from-[#a2d4b8] to-[#7bc4a1] hover:shadow-xl hover:shadow-primary/40 text-white font-bold rounded-2xl transition-all text-lg shadow-lg transform hover:scale-105">Comece Agora</a>
                <button onClick={() => scrollToSection("features")} className="px-8 py-4 border-2 border-[#a2d4b8] text-[#a2d4b8] hover:bg-primary/5 font-bold rounded-2xl transition-all text-lg">Saiba Mais</button>
              </div>
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#a2d4b8]">100%</p>
                  <p className="text-sm text-slate-600 mt-1">Digital</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#a2d4b8]">24/7</p>
                  <p className="text-sm text-slate-600 mt-1">Disponível</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#a2d4b8]">∞</p>
                  <p className="text-sm text-slate-600 mt-1">Escalável</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="w-full aspect-square bg-gradient-to-br from-[#a2d4b8]/30 to-emerald-300/30 rounded-3xl flex items-center justify-center overflow-hidden animate-float">
                {/* ...SVG code... */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-slate-900 mb-4">Recursos Poderosos</h3>
            <p className="text-xl text-slate-600">Tudo que você precisa para gerenciar sua clínica veterinária</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="modern-card rounded-2xl p-8 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-[#a2d4b8] to-[#7bc4a1] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Calendar className="w-7 h-7 text-white" /></div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Agenda Inteligente</h4>
              <p className="text-slate-600">Gerencie consultas com facilidade e nunca perca um agendamento</p>
            </div>
            <div className="modern-card rounded-2xl p-8 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-[#a2d4b8] to-[#7bc4a1] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><ClipboardList className="w-7 h-7 text-white" /></div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Prontuários Digitais</h4>
              <p className="text-slate-600">Histórico completo de cada paciente ao alcance de um clique</p>
            </div>
            <div className="modern-card rounded-2xl p-8 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-[#a2d4b8] to-[#7bc4a1] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Dog className="w-7 h-7 text-white" /></div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Gestão de Pets</h4>
              <p className="text-slate-600">Cadastre e acompanhe todos os seus pacientes animais</p>
            </div>
            <div className="modern-card rounded-2xl p-8 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-[#a2d4b8] to-[#7bc4a1] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Users className="w-7 h-7 text-white" /></div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Controle de Tutores</h4>
              <p className="text-slate-600">Mantenha dados completos e comunicação eficiente com os tutores</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h3 className="text-4xl font-bold text-slate-900">Por que escolher VetCare?</h3>
              <p className="text-lg text-slate-600">VetCare é uma solução moderna e completa desenvolvida especificamente para veterinários e clínicas que desejam otimizar suas operações.</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-[#a2d4b8] flex-shrink-0 mt-1" /> <span className="text-slate-600"><strong>Fácil de usar:</strong> Interface intuitiva que não requer treinamento</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-[#a2d4b8] flex-shrink-0 mt-1" /> <span className="text-slate-600"><strong>Seguro:</strong> Dados protegidos e criptografados</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-[#a2d4b8] flex-shrink-0 mt-1" /> <span className="text-slate-600"><strong>Confiável:</strong> Acesso 24/7 sem interrupções</span></li>
                <li className="flex items-start gap-3"><CheckCircle className="w-6 h-6 text-[#a2d4b8] flex-shrink-0 mt-1" /> <span className="text-slate-600"><strong>Escalável:</strong> Cresce com seu negócio</span></li>
              </ul>
            </div>
            <div className="relative">
              <div className="w-full aspect-square bg-gradient-to-br from-[#a2d4b8]/20 to-emerald-300/20 rounded-3xl flex items-center justify-center"><ShieldCheck className="w-32 h-32 text-[#a2d4b8]/50" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#a2d4b8] to-emerald-500">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h3 className="text-4xl font-bold text-white">Pronto para começar?</h3>
          <p className="text-xl text-white/80">Crie sua conta agora e acesse todos os recursos do VetCare</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/login" className="px-8 py-4 bg-white text-[#a2d4b8] hover:bg-slate-100 font-bold rounded-xl transition-all shadow-lg text-lg">Acessar Sistema</a>
            <button onClick={scrollToTop} className="px-8 py-4 border-2 border-white text-white hover:bg-white/10 font-bold rounded-xl transition-all text-lg">Voltar ao Topo</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#a2d4b8] to-[#7bc4a1] rounded-xl flex items-center justify-center">
                  {/* Logo SVG */}
                  {/* ...SVG code... */}
                </div>
                <h3 className="text-xl font-bold">VetCare</h3>
              </div>
              <p className="text-slate-400 text-sm">Sistema de gestão veterinária moderno e confiável</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><button onClick={() => scrollToSection("features")} className="hover:text-white transition-colors">Recursos</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Segurança</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            <p>© 2024 VetCare. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
