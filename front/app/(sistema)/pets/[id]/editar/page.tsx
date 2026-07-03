'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PetForm from '../../componentes/PetForm';
import { buscarPetPorId } from '@/app/services/petService';
import type { PetResponse } from '@/app/types/pet';

export default function EditarPet() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [pet, setPet] = useState<PetResponse | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const dados = await buscarPetPorId(id);
      if (dados) setPet(dados);
      else router.push('/pets');
    } catch (error) {
      alert('Erro ao carregar dados do pet!');
      console.error(error);
      router.push('/pets');
    }
  };

  if (!pet) return <div className="p-8">Carregando dados...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-3 mb-8">
          <Link
            href="/pets"
            className="group flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors"
          >
            <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span>
            Voltar para listagem
          </Link>

          <div className="space-y-1 border-l-4 border-primary pl-4">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Editar Pet #{id}
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
          <PetForm petExistente={pet} />
        </div>
      </div>
    </div>
  );
}
