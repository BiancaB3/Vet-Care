'use client';

import { Edit2, Search, Trash2, User, UserPlus, Users } from 'lucide-react';
import type { Tutor } from '../context/VetContext';

export type VetCareTutorSectionProps = {
  currentVetTutors: Tutor[];
  tutorSearch: string;
  onTutorSearchChange: (value: string) => void;
  onOpenTutorModal: (id?: string) => void;
  onDeleteTutor: (id: string) => void;
};

export default function VetCareTutorSection({
  currentVetTutors,
  tutorSearch,
  onTutorSearchChange,
  onOpenTutorModal,
  onDeleteTutor,
}: VetCareTutorSectionProps) {
  const filteredTutors = currentVetTutors.filter((tutor) => tutor.name.toLowerCase().includes(tutorSearch.toLowerCase()));

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-primary">Cadastro de Tutores</h2>
          <p className="text-slate-400 mt-2">Gerenciar tutores e contatos</p>
        </div>
        <button
          type="button"
          onClick={() => onOpenTutorModal()}
          className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-secondary hover:shadow-xl text-white font-bold rounded-xl transition-all shadow-lg"
        >
          <UserPlus className="w-5 h-5" /> Novo Tutor
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={tutorSearch}
          onChange={(e) => onTutorSearchChange(e.target.value)}
          placeholder="Buscar tutor..."
          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-primary font-medium"
        />
      </div>

      {currentVetTutors.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-400">Nenhum tutor cadastrado</p>
        </div>
      ) : filteredTutors.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-400">Nenhum tutor encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTutors.map((tutor) => (
            <div key={tutor.id} className="modern-card rounded-xl p-4 border border-slate-200">
              <div className="flex items-start justify-between mb-3">
                {tutor.photo
                  ? <img src={tutor.photo} alt={tutor.name} className="w-8 h-8 rounded-full object-cover" />
                  : <User className="w-6 h-6 text-primary" />
                }
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenTutorModal(tutor.id)}
                    className="p-1 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="w-4 h-4 text-slate-400 hover:text-blue-500" />
                  </button>
                  <button onClick={() => onDeleteTutor(tutor.id)} className="p-1 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                  </button>
                </div>
              </div>
              <h4 className="font-semibold mb-1">{tutor.name}</h4>
              <p className="text-xs text-slate-500">{tutor.email}</p>
              <p className="text-xs text-slate-500">{tutor.phone}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}