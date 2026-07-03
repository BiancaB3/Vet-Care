'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cadastrarVeterinario } from '../../services/veterinarioService';

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)})${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)})${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)})${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export default function RegistrarPage() {
  const router = useRouter();

  const handleRegister = async (formData: FormData) => {
    const nome = formData.get('nome')?.toString().trim() ?? '';
    const crmv = formData.get('crmv')?.toString().trim() ?? '';
    const email = formData.get('email')?.toString().trim() ?? '';
    const senha = formData.get('senha')?.toString() ?? '';
    const telefone = formData.get('telefone')?.toString().trim() ?? '';

    if (!nome || !crmv || !email || !senha) {
      alert('Preencha nome, CRMV, email e senha para cadastrar.');
      return;
    }

    try {
      await cadastrarVeterinario({
        nome,
        crmv,
        especialidade: 'Clinico geral',
        telefone,
        email,
        senha,
      });

      alert('Cadastro realizado! Faca login para continuar');
      router.push('/login');
    } catch {
      alert('Nao foi possivel concluir o cadastro.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Criar Conta</h1>
          <p className="text-sm text-gray-500 mt-1">Cadastro de veterinario</p>
        </div>

        <form action={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">Nome Completo</label>
            <input
              name="nome"
              type="text"
              required
              placeholder="Dr(a). Nome"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">CRMV</label>
            <input
              name="crmv"
              type="text"
              required
              placeholder="CRMV-XX/12345"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="seu@email.com"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">Senha</label>
            <input
              name="senha"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">Telefone</label>
            <input
              name="telefone"
              type="tel"
              placeholder="(11) 99999-9999"
              maxLength={14}
              onChange={(e) => {
                e.target.value = formatPhone(e.target.value);
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Link
              href="/login"
              className="flex-1 text-center px-4 py-2.5 border-2 border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100 transition-all"
            >
              Voltar
            </Link>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-200"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
