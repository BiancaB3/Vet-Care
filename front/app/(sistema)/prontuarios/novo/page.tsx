import Link from 'next/link';
import ProntuarioForm from '../componentes/ProntuarioForm';

export default function NovoProntuario() {
  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-3 mb-8">
          <Link
            href="/prontuarios"
            className="group flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors"
          >
            <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span>
            Voltar para listagem
          </Link>

          <div className="space-y-1 border-l-4 border-emerald-500 pl-4">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Novo Prontuário</h1>
            <p className="text-sm text-slate-500">
              Preencha os dados para registrar um novo prontuário no sistema.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <ProntuarioForm />
        </div>
      </div>
    </div>
  );
}
