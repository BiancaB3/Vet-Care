'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginService } from '../services/authService';
import { buscarVeterinarioLogado } from '../services/veterinarioService';
import { setToken, setUsuario } from '../redux/slices/authSlice';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [screen, setScreen] = useState<'login' | 'forgot'>('login');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleLogin = async (formData: FormData) => {
    const email = formData.get('email')?.toString() ?? '';
    const senha = formData.get('senha')?.toString() ?? '';

    try {
      const loginResult = await loginService({ email, senha });

      if (!loginResult?.token) {
        alert('Email ou senha incorretos');
        return;
      }

      dispatch(setToken({ token: loginResult.token }));

      const usuario = await buscarVeterinarioLogado();
      dispatch(setUsuario({ usuario }));

      router.push('/home');
    } catch {
      alert('Erro ao entrar no sistema!');
    }
  };

  const handleForgotPassword = () => {
    setForgotSuccess(true);
    setTimeout(() => {
      setScreen('login');
      setForgotSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">VetCare</h1>
          <p className="text-sm text-gray-500 mt-1">Sistema de Gestao Veterinaria</p>
        </div>

        {screen === 'login' && (
          <>
            <form action={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">E-mail</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Senha</label>
                <input
                  name="senha"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-primary/30 active:scale-[0.98]"
              >
                Acessar
              </button>

              <p className="text-center text-sm text-gray-600">
                Nao tem conta?{' '}
                <Link href="/login/registrar" className="text-emerald-600 hover:text-emerald-700 font-bold">
                  Cadastre-se
                </Link>
              </p>

              <p className="text-center text-sm text-gray-600 mt-2">
                <button
                  type="button"
                  onClick={() => setScreen('forgot')}
                  className="text-primary hover:text-secondary font-bold"
                >
                  Esqueci minha senha
                </button>
              </p>
            </form>
          </>
        )}

        {screen === 'forgot' && !forgotSuccess && (
          <form action={handleForgotPassword} className="space-y-5">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Recuperar Senha</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Email Cadastrado</label>
              <input
                name="email"
                type="email"
                required
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>
            <p className="text-sm text-slate-600 text-center">
              Voce receberá instruções de recuperação de senha no seu email cadastrado.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setScreen('login')}
                className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100 transition-all"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-primary hover:bg-secondary text-white font-bold rounded-lg transition-all shadow-lg"
              >
                Enviar
              </button>
            </div>
          </form>
        )}

        {screen === 'forgot' && forgotSuccess && (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Email Enviado!</h3>
            <p className="text-sm text-slate-600">
              Verifique sua caixa de entrada e siga as instruções para recuperar sua senha.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
