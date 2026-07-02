'use client';

export type VetCareVeterinarioSectionProps = {
  currentVet: {
    name: string;
    email: string;
    crmv: string;
    phone?: string;
  };
};

export default function VetCareVeterinarioSection({ currentVet }: VetCareVeterinarioSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-primary">Veterinários</h2>
          <p className="text-slate-400 mt-2">Perfil e profissionais vinculados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="modern-card rounded-xl p-5 border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Veterinário logado</p>
          <h3 className="text-xl font-bold text-slate-900">{currentVet.name}</h3>
          <p className="text-sm text-slate-500 mt-1">{currentVet.email}</p>
          <p className="text-sm text-slate-600 mt-2"><strong>CRMV:</strong> {currentVet.crmv}</p>
          <p className="text-sm text-slate-600"><strong>Telefone:</strong> {currentVet.phone || 'Não informado'}</p>
        </div>
      </div>
    </section>
  );
}