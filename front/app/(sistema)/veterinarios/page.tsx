'use client';

import { useEffect, useState } from 'react';
import { buscarVeterinarioLogado } from '@/app/services/veterinarioService';
import type { VeterinarioResponse } from '@/app/types/veterinario';

export default function Veterinarios() {
  const [veterinario, setVeterinario] = useState<VeterinarioResponse | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const dados = await buscarVeterinarioLogado();
      setVeterinario(dados);
    } catch (error) {
      alert('Erro ao carregar dados do veterinário!');
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Veterinários</h1>
          <p className="text-slate-400 mt-1">Perfil e profissionais vinculados</p>
        </div>
      </div>

      {!veterinario ? (
        <div className="p-8 text-slate-500 italic">Carregando dados...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Veterinário logado
            </p>
            <h3 className="text-xl font-bold text-slate-900">{veterinario.nome}</h3>
            <p className="text-sm text-slate-500 mt-1">{veterinario.email}</p>
            <p className="text-sm text-slate-600 mt-2">
              <strong>CRMV:</strong> {veterinario.crmv}
            </p>
            <p className="text-sm text-slate-600">
              <strong>Especialidade:</strong> {veterinario.especialidade || 'Não informada'}
            </p>
            <p className="text-sm text-slate-600">
              <strong>Telefone:</strong> {veterinario.telefone || 'Não informado'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
