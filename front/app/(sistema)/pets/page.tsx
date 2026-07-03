'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Cat, Dog, Feather, Mouse, Search, Turtle } from 'lucide-react';
import { listarPets, excluirPet } from '@/app/services/petService';
import { listarTutores } from '@/app/services/tutorService';
import type { PetResponse } from '@/app/types/pet';
import type { TutorResponse } from '@/app/types/tutor';
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

export default function Pets() {
  const dispatch = useDispatch();

  const [pets, setPets] = useState<PetResponse[]>([]);
  const [tutores, setTutores] = useState<TutorResponse[]>([]);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [dadosPets, dadosTutores] = await Promise.all([listarPets(), listarTutores()]);
      setPets(dadosPets);
      setTutores(dadosTutores);
    } catch (error) {
      alert('Erro ao carregar dados dos pets!');
      console.error(error);
    }
  };

  const nomeTutor = (tutorId: number | null) => {
    if (tutorId == null) return null;
    return tutores.find((tutor) => tutor.id === tutorId)?.nome ?? null;
  };

  const handleExcluir = async (pet: PetResponse) => {
    if (!window.confirm(`Deseja realmente remover o pet "${pet.nome}"?`)) {
      return;
    }

    try {
      await excluirPet(pet.id, pet);
      setPets((prev) => prev.filter((item) => item.id !== pet.id));
      dispatch(
        pushNotification({
          message: `Pet "${pet.nome}" removido`,
          type: 'cancelamento',
        }),
      );
    } catch (error) {
      alert('Erro ao remover pet!');
      console.error(error);
    }
  };

  const petsFiltrados = pets.filter((pet) =>
    pet.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Cadastro de Pets</h1>
          <p className="text-slate-400 mt-1">Pets cadastrados</p>
        </div>
        <Link
          href="/pets/novo"
          className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <span className="text-xl">+</span> Novo Pet
        </Link>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar pet..."
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
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Nome</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Espécie / Raça</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Tutor</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {petsFiltrados.map((pet) => (
                <tr key={pet.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-slate-500">#{pet.id}</td>
                  <td className="px-6 py-4">{getSpeciesIcon(pet.especie)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{pet.nome}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {pet.especie}
                    {pet.raca ? ` - ${pet.raca}` : ''}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {nomeTutor(pet.tutorId) ?? '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-right space-x-3">
                    <Link
                      href={`/pets/${pet.id}/editar`}
                      className="text-primary hover:text-secondary font-medium transition-colors"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleExcluir(pet)}
                      className="text-red-600 hover:text-red-800 font-medium transition-colors"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}

              {petsFiltrados.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">
                    Nenhum pet encontrado!
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
