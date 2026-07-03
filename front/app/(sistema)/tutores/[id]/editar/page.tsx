'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TutorForm from '../../componentes/TutorForm';
import { buscarTutorPorId } from '@/app/services/tutorService';
import type { TutorResponse } from '@/app/types/tutor';

export default function EditarTutorPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [tutor, setTutor] = useState<TutorResponse | null>(null);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const dados = await buscarTutorPorId(id);
        setTutor(dados);
      } catch {
        alert('Nao foi possivel carregar os dados do tutor.');
        router.push('/tutores');
      }
    };

    buscarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!tutor) return <div className="p-8">Carregando dados...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-3 mb-8">
          <Link
            href="/tutores"
            className="group flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors"
          >
            <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span>
            Voltar para listagem
          </Link>

          <div className="space-y-1 border-l-4 border-primary pl-4">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Editar Tutor #{id}
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
          <TutorForm tutorExistente={tutor} />
        </div>
      </div>
    </div>
  );
}
