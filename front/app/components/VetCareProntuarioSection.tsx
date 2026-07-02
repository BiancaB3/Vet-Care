'use client';

import type { ReactNode } from 'react';
import { ClipboardList, Edit2, FilePlus, Search, Trash2 } from 'lucide-react';
import type { Consultation, Pet } from '../types/VetContext';

export type VetCareProntuarioSectionProps = {
  currentVetConsultations: Consultation[];
  currentVetPets: Pet[];
  prontuarioSearch: string;
  onProntuarioSearchChange: (value: string) => void;
  onOpenConsultationModal: (id?: string) => void;
  onDeleteConsultation: (id: string) => void;
  renderSpeciesIcon: (species: string) => ReactNode;
};

export default function VetCareProntuarioSection({
  currentVetConsultations,
  currentVetPets,
  prontuarioSearch,
  onProntuarioSearchChange,
  onOpenConsultationModal,
  onDeleteConsultation,
  renderSpeciesIcon,
}: VetCareProntuarioSectionProps) {
  const filteredConsultations = currentVetConsultations.filter((consultation) => {
    const pet = currentVetPets.find((item) => item.id === consultation.petId);
    return (pet?.name.toLowerCase() || '').includes(prontuarioSearch.toLowerCase());
  });

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-primary">Prontuarios</h2>
          <p className="text-slate-400 mt-2">Historico de prontuarios</p>
        </div>
        <button
          type="button"
          onClick={() => onOpenConsultationModal()}
          className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-secondary hover:shadow-xl text-white font-bold rounded-xl transition-all shadow-lg"
        >
          <FilePlus className="w-5 h-5" /> Novo Prontuario
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={prontuarioSearch}
          onChange={(e) => onProntuarioSearchChange(e.target.value)}
          placeholder="Buscar prontuario..."
          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-primary font-medium"
        />
      </div>

      {currentVetConsultations.length === 0 ? (
        <div className="text-center py-12">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-400">Nenhuma consulta registrada</p>
        </div>
      ) : filteredConsultations.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-400">Nenhum prontuario encontrado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredConsultations.map((consultation) => {
            const pet = currentVetPets.find((item) => item.id === consultation.petId);
            return (
              <div key={consultation.id} className="modern-card rounded-xl p-4 border border-slate-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      {pet && renderSpeciesIcon(pet.species)}
                      <h4 className="font-semibold">{pet?.name || 'Pet'}</h4>
                    </div>
                    <p className="text-xs text-slate-500">{consultation.date} - {consultation.time}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => onOpenConsultationModal(consultation.id)} className="p-2 hover:bg-blue-50 rounded-lg">
                      <Edit2 className="w-4 h-4 text-slate-400 hover:text-blue-500" />
                    </button>
                    <button onClick={() => onDeleteConsultation(consultation.id)} className="p-2 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
                {consultation.reason && <p className="text-sm mb-2"><strong>Motivo:</strong> {consultation.reason}</p>}
                {consultation.diagnosis && <p className="text-sm mb-2"><strong>Diagnostico:</strong> {consultation.diagnosis}</p>}
                {consultation.prescription && <p className="text-sm text-blue-600 p-2 bg-blue-50 rounded"><strong>Prescricao:</strong> {consultation.prescription}</p>}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
