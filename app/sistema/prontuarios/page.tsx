'use client';
import PageHeader from '../../components/PageHeader';

export default function ProntuariosPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PageHeader title="Prontuários" />
      <div className="max-w-6xl mx-auto px-6 py-8 w-full">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Prontuários</h3>
          </div>
          <div className="space-y-3">
            <p className="text-center py-8 text-slate-500">Nenhum prontuário registrado</p>
          </div>
        </div>
      </div>
    </div>
  );
}
