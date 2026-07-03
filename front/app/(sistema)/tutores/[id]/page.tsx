'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { buscarTutorPorId } from '@/app/services/tutorService';
import type { TutorResponse } from '@/app/types/tutor';

export default function DetalheTutorPage() {
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

          <div className="flex items-center justify-between">
            <div className="space-y-1 border-l-4 border-primary pl-4">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{tutor.nome}</h1>
              <p className="text-sm text-slate-500">Tutor #{tutor.id}</p>
            </div>
            <Link
              href={`/tutores/${tutor.id}/editar`}
              className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
            >
              Editar
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <dt className="text-sm font-semibold text-slate-500">Nome</dt>
              <dd className="text-base text-slate-900 mt-1">{tutor.nome}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-slate-500">Status</dt>
              <dd className="mt-1">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700">
                  {tutor.status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-slate-500">Email</dt>
              <dd className="text-base text-slate-900 mt-1">{tutor.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-slate-500">Telefone</dt>
              <dd className="text-base text-slate-900 mt-1">{tutor.telefone}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-slate-500">CPF</dt>
              <dd className="text-base text-slate-900 mt-1">{tutor.cpf}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-slate-500">CEP</dt>
              <dd className="text-base text-slate-900 mt-1">{tutor.cep}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-sm font-semibold text-slate-500">Endereco</dt>
              <dd className="text-base text-slate-900 mt-1">{tutor.endereco}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
