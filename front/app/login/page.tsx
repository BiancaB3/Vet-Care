"use client";

import { Mail, Lock, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { useDispatch } from "react-redux";

// Ajuste estes imports para os paths reais do seu projeto VetCare:
import { loginService } from "../services/authService";
import { buscarUsuarioLogado } from "../services/usuarioService";
import { setToken, setUsuario } from "../redux/slices/authSlice";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const redirectTo = searchParams.get("redirectTo");

  const handleLogin = async (formData: FormData) => {
    const email = formData.get("email")?.toString() ?? "";
    const senha = formData.get("senha")?.toString() ?? "";

    try {
      const loginResult = await loginService({ email, senha });

      if (!loginResult?.token) {
        alert("Usuário ou senha inválido!");
        return;
      }

      dispatch(setToken({ token: loginResult.token }));

      const usuario = await buscarUsuarioLogado();
      dispatch(setUsuario({ usuario: { ...usuario } }));

      router.push(redirectTo || "/home");
    } catch (error: any) {
      console.error("Erro ao entrar no sistema:", error);

      const mensagem =
        error?.response?.data && typeof error.response.data === "string"
          ? error.response.data
          : "Erro ao entrar no sistema";

      alert(mensagem);
    }
  };

  const registerLink = redirectTo
    ? `/cadastro?redirectTo=${encodeURIComponent(redirectTo)}`
    : "/cadastro";

  return (
    <div className="min-h-screen w-full bg-stone-50 flex flex-col justify-center items-center p-6">
      <div className="flex items-center gap-2 font-black text-teal-600 text-3xl mb-8">
        <span className="tracking-tighter uppercase">
          VET<span className="text-orange-500">CARE</span>
        </span>
      </div>

      <div className="w-full max-w-[450px] bg-white rounded-[2rem] shadow-2xl shadow-stone-200/60 border border-stone-100 p-8 md:p-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Bem-vindo!
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-2">
            Acesse sua conta para continuar
          </p>
        </div>

        <form action={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
              E-mail
            </label>
            <div className="relative group">
              <input
                type="email"
                name="email"
                placeholder="exemplo@email.com"
                className="w-full pl-14 pr-6 py-4 rounded-[1.2rem] bg-stone-50 border border-stone-200 outline-none text-sm font-bold text-slate-700 transition-all focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5"
                required
              />
              <Mail
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors"
                size={20}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
              Senha
            </label>
            <div className="relative group">
              <input
                type="password"
                name="senha"
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-4 rounded-[1.2rem] bg-stone-50 border border-stone-200 outline-none text-sm font-bold text-slate-700 transition-all focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5"
                required
              />
              <Lock
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors"
                size={20}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-4 bg-slate-900 hover:bg-teal-600 text-white rounded-[1.2rem] font-black text-base shadow-xl shadow-slate-200 transition-all duration-300 flex items-center justify-center gap-3 group active:scale-[0.97]"
          >
            Entrar
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-stone-100 text-center">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-tight">
            Ainda não tem conta?
            <Link
              href={registerLink}
              className="ml-2 text-orange-500 font-black hover:text-teal-600 transition-colors underline underline-offset-4 decoration-2"
            >
              Cadastre-se agora
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-8 text-stone-400 text-[10px] font-bold uppercase tracking-widest">
        © 2026 VetCare
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone-50 text-slate-500">
          Carregando...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}