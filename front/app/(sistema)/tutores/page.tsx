'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Search, User, UserPlus, Users } from 'lucide-react';
import { listarTutores, excluirTutor } from '@/app/services/tutorService';
import type { TutorResponse } from '@/app/types/tutor';
import { pushNotification } from '@/app/redux/slices/notificationsSlice';

export default function TutoresPage() {
  const dispatch = useDispatch();

  const [tutores, setTutores] = useState<TutorResponse[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const dados = await listarTutores();
      setTutores(dados);
    } catch {
      alert('Erro ao carregar a lista de tutores!');
    } finally {
      setCarregando(false);
    }
  };

  const handleExcluir = async (tutor: TutorResponse) => {
    if (
      !window.confirm(
        `Deseja realmente remover o tutor "${tutor.nome}"? Isso também remove seus pets, agendamentos e prontuários vinculados.`,
      )
    ) {
      return;
    }

    try {
      await excluirTutor(tutor.id);
      setTutores((prev) => prev.filter((item) => item.id !== tutor.id));
      dispatch(
        pushNotification({
          message: `Tutor "${tutor.nome}" removido`,
          type: 'cancelamento',
        }),
      );
    } catch (error) {
      alert('Erro ao remover tutor!');
      console.error(error);
    }
  };

  const tutoresFiltrados = tutores.filter((tutor) =>
    tutor.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Cadastro de Tutores</h1>
          <p className="text-slate-500 mt-1">Gerenciar tutores e contatos</p>
        </div>
        <Link
          href="/tutores/novo"
          className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <UserPlus className="w-5 h-5" /> Novo Tutor
        </Link>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar tutor..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-primary outline-none font-medium"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Nome</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Email</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Telefone</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tutoresFiltrados.map((tutor) => (
                <tr key={tutor.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      {tutor.nome}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{tutor.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{tutor.telefone}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700">
                      {tutor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right space-x-3">
                    <Link
                      href={`/tutores/${tutor.id}`}
                      className="text-slate-600 hover:text-slate-800 font-medium transition-colors"
                    >
                      Detalhes
                    </Link>
                    <Link
                      href={`/tutores/${tutor.id}/editar`}
                      className="text-primary hover:text-secondary font-medium transition-colors"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleExcluir(tutor)}
                      className="text-red-600 hover:text-red-800 font-medium transition-colors"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}

              {!carregando && tutores.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                    <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    Nenhum tutor cadastrado
                  </td>
                </tr>
              )}

              {!carregando && tutores.length > 0 && tutoresFiltrados.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                    <Search className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    Nenhum tutor encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
