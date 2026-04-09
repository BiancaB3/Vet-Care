'use client';
import PageHeader from '../../components/PageHeader';

export default function AgendamentosPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PageHeader title="Agenda" />
      <div className="max-w-6xl mx-auto px-6 py-8 w-full">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Agendar Consulta</h3>
            <button className="btn-primary flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 5v14m-7-7h14"/></svg>
              Nova Consulta
            </button>
          </div>
          <div className="space-y-3">
            <p className="text-center py-8 text-slate-500">Nenhuma consulta agendada</p>
          </div>
        </div>
      </div>
    </div>
  );
}
