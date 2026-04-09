'use client';
import PageHeader from '../../components/PageHeader';

export default function TutoresPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PageHeader title="Tutores" />
      <div className="max-w-6xl mx-auto px-6 py-8 w-full">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Cadastro de Tutores</h3>
            <button className="btn-primary flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 5v14m-7-7h14"/></svg>
              Novo Tutor
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="text-center py-8 text-slate-500 col-span-full">Nenhum tutor cadastrado</p>
          </div>
        </div>
      </div>
    </div>
  );
}