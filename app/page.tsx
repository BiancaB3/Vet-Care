"use client";
import React from "react";
import { Calendar, ClipboardList, Dog, Users, CheckCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
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
            <div className="w-10 h-10 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
               <svg className="w-6 h-6" viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M70 15 C70 15, 25 35, 25 80 C25 125, 70 155, 70 155 C70 155, 115 125, 115 80 C115 35, 70 15, 70 15 Z" fill="#fefcf4" stroke="#e8e3d8" strokeWidth="1.5" />
                 <rect width="140" height="160" fill="#a2d4b8" opacity="0.7" />
                 <ellipse cx="70" cy="35" rx="20" ry="15" fill="white" opacity="0.25" />
               </svg>
              <svg className="w-6 h-6" viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M70 15 C70 15, 25 35, 25 80 C25 125, 70 155, 70 155 C70 155, 115 125, 115 80 C115 35, 70 15, 70 15 Z" fill="#fefcf4" stroke="#e8e3d8" strokeWidth="1.5" />
                <rect width="140" height="160" fill="#a2d4b8" opacity="0.7" />
                <ellipse cx="70" cy="35" rx="20" ry="15" fill="white" opacity="0.25" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#a2d4b8' }}>VetCare</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scrollToSection("features")} className="px-6 py-2.5 text-slate-600 hover:text-primary font-medium transition-colors">Recursos</button>
            <Link href="/login" className="px-8 py-4 bg-gradient-to-br from-[#a2d4b8] to-[#7bc4a1] hover:shadow-xl hover:shadow-primary/40 text-white font-bold rounded-2xl transition-all text-lg shadow-lg transform hover:scale-105">Acessar</Link>
          </div>
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
                <Link href="/login" className="px-8 py-4 bg-gradient-to-br from-[#a2d4b8] to-[#7bc4a1] hover:shadow-xl hover:shadow-primary/40 text-white font-bold rounded-2xl transition-all text-lg shadow-lg transform hover:scale-105">Comece Agora</Link>
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
                <svg className="w-full h-full p-12" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="200" cy="200" r="180" fill="none" stroke="#a2d4b8" strokeWidth="2" opacity="0.3"></circle>
                  <circle cx="200" cy="200" r="120" fill="none" stroke="#a2d4b8" strokeWidth="2" opacity="0.5"></circle>
                  <circle cx="200" cy="200" r="60" fill="none" stroke="#a2d4b8" strokeWidth="2"></circle>
                  <rect x="160" y="160" width="80" height="80" rx="8" fill="#a2d4b8" opacity="0.2"></rect>
                  <circle cx="120" cy="120" r="20" fill="#7bc4a1" opacity="0.7"></circle>
                  <circle cx="280" cy="120" r="20" fill="#7bc4a1" opacity="0.7"></circle>
                  <circle cx="120" cy="280" r="20" fill="#7bc4a1" opacity="0.7"></circle>
                  <circle cx="280" cy="280" r="20" fill="#7bc4a1" opacity="0.7"></circle>
                </svg>
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
            <div className="modern-card rounded-2xl p-8 bg-white shadow-md transition-all group">
              <div className="w-14 h-14 bg-[#a2d4b8] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" style={{color: 'white'}} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Agenda Inteligente</h4>
              <p className="text-slate-600">Gerencie consultas com facilidade e nunca perca um agendamento</p>
            </div>
            <div className="modern-card rounded-2xl p-8 bg-white shadow-md transition-all group">
              <div className="w-14 h-14 bg-[#a2d4b8] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" style={{color: 'white'}} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" aria-hidden="true"><rect width="16" height="20" x="4" y="2" rx="2" /><path d="M8 2v4" /><path d="M16 2v4" /><path d="M12 10h4" /><path d="M12 14h4" /><path d="M8 10h.01" /><path d="M8 14h.01" /></svg>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Prontuários Digitais</h4>
              <p className="text-slate-600">Histórico completo de cada paciente ao alcance de um clique</p>
            </div>
            <div className="modern-card rounded-2xl p-8 bg-white shadow-md transition-all group">
              <div className="w-14 h-14 bg-[#a2d4b8] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" style={{color: 'white'}} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" aria-hidden="true"><path d="M10 12v4" /><path d="M14 12v4" /><path d="M7 16v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" /><path d="M17 16V7a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v9" /><path d="M3 7h18" /><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" /></svg>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Gestão de Pets</h4>
              <p className="text-slate-600">Cadastre e acompanhe todos os seus pacientes animais</p>
            </div>
            <div className="modern-card rounded-2xl p-8 bg-white shadow-md transition-all group">
              <div className="w-14 h-14 bg-[#a2d4b8] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" style={{color: 'white'}} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Controle de Tutores</h4>
              <p className="text-slate-600">Mantenha dados completos e comunicação eficiente com os tutores</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h3 className="text-4xl font-bold text-slate-900">Pronto para começar?</h3>
          <p className="text-xl text-slate-600">Crie sua conta agora e acesse todos os recursos do VetCare</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="px-8 py-4 bg-gradient-to-br from-[#a2d4b8] to-[#7bc4a1] hover:shadow-xl hover:shadow-primary/40 text-white font-bold rounded-2xl transition-all text-lg shadow-lg transform hover:scale-105">Acessar Sistema</Link>
            <button
              onClick={scrollToTop}
              className="px-8 py-4 text-black font-bold rounded-xl transition-all text-lg bg-transparent border-0 hover:border-2 hover:border-[#a2d4b8]"
            >
              Voltar ao Topo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M70 15 C70 15, 25 35, 25 80 C25 125, 70 155, 70 155 C70 155, 115 125, 115 80 C115 35, 70 15, 70 15 Z" fill="#fefcf4" stroke="#e8e3d8" strokeWidth="1.5" />
                    <rect width="140" height="160" fill="#a2d4b8" opacity="0.7" />
                    <ellipse cx="70" cy="35" rx="20" ry="15" fill="white" opacity="0.25" />
                  </svg>
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
