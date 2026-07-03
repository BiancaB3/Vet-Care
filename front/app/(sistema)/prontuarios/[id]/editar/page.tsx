'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProntuarioForm from '../../componentes/ProntuarioForm';
import { buscarProntuarioPorId } from '@/app/services/prontuarioService';
import type { ProntuarioResponse } from '@/app/types/prontuario';

export default function EditarProntuario() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [prontuario, setProntuario] = useState<ProntuarioResponse | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const dados = await buscarProntuarioPorId(id);
      if (dados) setProntuario(dados);
      else router.push('/prontuarios');
    } catch (error) {
      alert('Erro ao carregar dados do prontuário!');
      console.error(error);
      router.push('/prontuarios');
    }
  };

  if (!prontuario) return <div className="p-8">Carregando dados...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-3 mb-8">
          <Link
            href="/prontuarios"
            className="group flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors"
          >
            <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span>
            Voltar para listagem
          </Link>

          <div className="space-y-1 border-l-4 border-primary pl-4">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Editar Prontuário #{id}
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
          <ProntuarioForm prontuarioExistente={prontuario} />
        </div>
      </div>
    </div>
  );
}
