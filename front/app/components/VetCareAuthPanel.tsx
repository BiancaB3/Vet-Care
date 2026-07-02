'use client';

import { Bell, CheckCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react';

export type VetCareAuthScreen = 'login' | 'register' | 'forgot' | 'dashboard';

export type VetCareAuthPanelProps = {
  screen: VetCareAuthScreen;
  loginForm: { email: string; password: string };
  registerForm: { name: string; crmv: string; email: string; password: string; phone: string };
  forgotForm: { email: string };
  forgotSuccess: boolean;
  showPassword: boolean;
  onLoginFormChange: (field: 'email' | 'password', value: string) => void;
  onRegisterFormChange: (field: 'name' | 'crmv' | 'email' | 'password' | 'phone', value: string) => void;
  onForgotFormChange: (value: string) => void;
  onSubmitLogin: (event: React.FormEvent) => void;
  onSubmitRegister: (event: React.FormEvent) => void;
  onSubmitForgot: (event: React.FormEvent) => void;
  onGoToLogin: () => void;
  onGoToRegister: () => void;
  onGoToForgot: () => void;
  onTogglePasswordVisibility: () => void;
  formatPhone: (value: string) => string;
};

export default function VetCareAuthPanel({
  screen,
  loginForm,
  registerForm,
  forgotForm,
  forgotSuccess,
  showPassword,
  onLoginFormChange,
  onRegisterFormChange,
  onForgotFormChange,
  onSubmitLogin,
  onSubmitRegister,
  onSubmitForgot,
  onGoToLogin,
  onGoToRegister,
  onGoToForgot,
  onTogglePasswordVisibility,
  formatPhone,
}: VetCareAuthPanelProps) {
  return (
    <div className="w-full max-w-md animate-fade-in relative z-10">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-6">
          <img src="/LOGOVETCARE.png" alt="VetCare" className="w-24 h-24 object-cover rounded-full animate-float animate-pulse-glow mix-blend-multiply" />
        </div>
        <h1 className="text-4xl font-bold mb-2 text-primary">VetCare</h1>
        <p className="text-lg text-primary">Sistema de Gestao Veterinaria</p>
      </div>

      <div className="modern-card rounded-3xl p-8 shadow-2xl">
        {screen === 'login' && (
          <form onSubmit={onSubmitLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => onLoginFormChange('email', e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-primary font-medium"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  key={showPassword ? 'text' : 'password'}
                  type={showPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={(e) => onLoginFormChange('password', e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-primary font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={onTogglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/40 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              Entrar
            </button>
            <p className="text-center text-sm text-slate-600">
              Nao tem conta?{' '}
              <button
                type="button"
                onClick={onGoToRegister}
                className="text-emerald-600 hover:text-emerald-700 font-bold"
              >
                Cadastre-se
              </button>
            </p>
            <p className="text-center text-sm text-slate-600 mt-2">
              <button
                type="button"
                onClick={onGoToForgot}
                className="text-primary hover:text-secondary font-bold"
              >
                Esqueci minha senha
              </button>
            </p>
          </form>
        )}

        {screen === 'register' && (
          <form onSubmit={onSubmitRegister} className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Criar Conta</h3>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome Completo</label>
              <input
                type="text"
                value={registerForm.name}
                onChange={(e) => onRegisterFormChange('name', e.target.value)}
                placeholder="Dr(a). Nome"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-primary font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">CRMV</label>
              <input
                type="text"
                value={registerForm.crmv}
                onChange={(e) => onRegisterFormChange('crmv', e.target.value)}
                placeholder="CRMV-XX/12345"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-primary font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) => onRegisterFormChange('email', e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-primary font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Senha</label>
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) => onRegisterFormChange('password', e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-primary font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Telefone</label>
              <input
                type="tel"
                value={registerForm.phone}
                onChange={(e) => onRegisterFormChange('phone', formatPhone(e.target.value))}
                placeholder="(11) 99999-9999"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:border-primary font-medium"
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onGoToLogin}
                className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-all"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary to-secondary hover:shadow-lg text-white font-bold rounded-xl transition-all"
              >
                Cadastrar
              </button>
            </div>
          </form>
        )}

        {screen === 'forgot' && !forgotSuccess && (
          <form onSubmit={onSubmitForgot} className="space-y-5">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Recuperar Senha</h3>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Email Cadastrado</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={forgotForm.email}
                  onChange={(e) => onForgotFormChange(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-primary font-medium"
                  required
                />
              </div>
            </div>
            <p className="text-sm text-slate-600 text-center">Voce receberah instrucoes de recuperacao de senha no seu email cadastrado.</p>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onGoToLogin}
                className="flex-1 px-4 py-3.5 border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-all"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3.5 bg-gradient-to-r from-primary to-secondary hover:shadow-lg text-white font-bold rounded-xl transition-all shadow-lg"
              >
                Enviar
              </button>
            </div>
          </form>
        )}

        {screen === 'forgot' && forgotSuccess && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Email Enviado!</h3>
            <p className="text-sm text-slate-600">Verifique sua caixa de entrada e siga as instrucoes para recuperar sua senha.</p>
          </div>
        )}
      </div>
    </div>
  );
}
