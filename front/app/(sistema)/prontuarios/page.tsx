'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Cat, Dog, Feather, Mouse, Search, Turtle } from 'lucide-react';
import { listarProntuarios, excluirProntuario } from '@/app/services/prontuarioService';
import { listarPets } from '@/app/services/petService';
import type { ProntuarioResponse } from '@/app/types/prontuario';
import type { PetResponse } from '@/app/types/pet';
import { pushNotification } from '@/app/redux/slices/notificationsSlice';

function getSpeciesIcon(species: string) {
  const normalized = species.toLowerCase();
  if (normalized.includes('cao') || normalized.includes('cão') || normalized.includes('dog')) {
    return <Dog className="w-6 h-6 text-primary/30" />;
  }
  if (normalized.includes('gato') || normalized.includes('cat')) {
    return <Cat className="w-6 h-6 text-primary/30" />;
  }
  if (normalized.includes('ave')) {
    return <Feather className="w-6 h-6 text-primary/30" />;
  }
  if (normalized.includes('reptil')) {
    return <Turtle className="w-6 h-6 text-primary/30" />;
  }
  if (normalized.includes('roedor')) {
    return <Mouse className="w-6 h-6 text-primary/30" />;
  }
  return <Dog className="w-6 h-6 text-primary/30" />;
}

export default function Prontuarios() {
  const dispatch = useDispatch();

  const [prontuarios, setProntuarios] = useState<ProntuarioResponse[]>([]);
  const [pets, setPets] = useState<PetResponse[]>([]);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [dadosProntuarios, dadosPets] = await Promise.all([listarProntuarios(), listarPets()]);
      setProntuarios(dadosProntuarios);
      setPets(dadosPets);
    } catch (error) {
      alert('Erro ao carregar dados dos prontuários!');
      console.error(error);
    }
  };

  const handleExcluir = async (prontuario: ProntuarioResponse) => {
    if (!window.confirm('Deseja realmente remover este prontuário?')) {
      return;
    }

    try {
      await excluirProntuario(prontuario.id);
      setProntuarios((prev) => prev.filter((item) => item.id !== prontuario.id));
      dispatch(
        pushNotification({
          message: 'Prontuário removido',
          type: 'cancelamento',
        }),
      );
    } catch (error) {
      alert('Erro ao remover prontuário!');
      console.error(error);
    }
  };

  const buscarPet = (petId: number) => pets.find((pet) => pet.id === petId) ?? null;

  const prontuariosFiltrados = prontuarios.filter((prontuario) => {
    const pet = buscarPet(prontuario.petId);
    return (pet?.nome ?? '').toLowerCase().includes(busca.toLowerCase());
  });

  const formatarDataHora = (dataAtendimento: string) => {
    const [datePart, timePart] = dataAtendimento.split('T');
    if (!datePart) return dataAtendimento;
    const [ano, mes, dia] = datePart.split('-');
    const dataFormatada = ano && mes && dia ? `${dia}/${mes}/${ano}` : datePart;
    const hora = timePart ? timePart.slice(0, 5) : '';
    return hora ? `${dataFormatada} - ${hora}` : dataFormatada;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Prontuários</h1>
          <p className="text-slate-400 mt-1">Histórico de prontuários</p>
        </div>
        <Link
          href="/prontuarios/novo"
          className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <span className="text-xl">+</span> Novo Prontuário
        </Link>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar prontuário..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-primary focus:ring-2 focus:ring-primary outline-none font-medium"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Código</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600"></th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Pet</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Data / Hora</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Motivo</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prontuariosFiltrados.map((prontuario) => {
                const pet = buscarPet(prontuario.petId);
                return (
                  <tr key={prontuario.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-slate-500">#{prontuario.id}</td>
                    <td className="px-6 py-4">{pet && getSpeciesIcon(pet.especie)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                      {pet?.nome ?? 'Pet não encontrado'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatarDataHora(prontuario.dataAtendimento)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                      {prontuario.descricao || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-right space-x-3">
                      <Link
                        href={`/prontuarios/${prontuario.id}/editar`}
                        className="text-primary hover:text-secondary font-medium transition-colors"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleExcluir(prontuario)}
                        className="text-red-600 hover:text-red-800 font-medium transition-colors"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                );
              })}

              {prontuariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">
                    Nenhum prontuário encontrado!
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
