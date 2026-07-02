'use client';

import type { ReactNode } from 'react';
import { Edit2, Search, Trash2, Dog } from 'lucide-react';
import type { Pet, Tutor } from '../context/VetContext';

export type VetCarePetSectionProps = {
  currentVetPets: Pet[];
  currentVetTutors: Tutor[];
  petSearch: string;
  onPetSearchChange: (value: string) => void;
  onOpenPetModal: (id?: string) => void;
  onDeletePet: (id: string) => void;
  renderSpeciesIcon: (species: string) => ReactNode;
};

export default function VetCarePetSection({
  currentVetPets,
  currentVetTutors,
  petSearch,
  onPetSearchChange,
  onOpenPetModal,
  onDeletePet,
  renderSpeciesIcon,
}: VetCarePetSectionProps) {
  const filteredPets = currentVetPets.filter((pet) => pet.name.toLowerCase().includes(petSearch.toLowerCase()));

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-primary">Cadastro de Pets</h2>
          <p className="text-slate-400 mt-2">Pets cadastrados</p>
        </div>
        <button
          type="button"
          onClick={() => onOpenPetModal()}
          className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-secondary hover:shadow-xl text-white font-bold rounded-xl transition-all shadow-lg"
        >
          <Dog className="w-5 h-5" /> Novo Pet
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={petSearch}
          onChange={(e) => onPetSearchChange(e.target.value)}
          placeholder="Buscar pet..."
          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-primary font-medium"
        />
      </div>

      {currentVetPets.length === 0 ? (
        <div className="text-center py-12">
          <Dog className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-400">Nenhum pet cadastrado</p>
        </div>
      ) : filteredPets.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-400">Nenhum pet encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPets.map((pet) => {
            const tutor = currentVetTutors.find((item) => item.id === pet.tutorId);
            return (
              <div key={pet.id} className="modern-card rounded-xl p-4 border border-slate-200">
                <div className="flex items-start justify-between mb-3">
                  {renderSpeciesIcon(pet.species)}
                  <div className="flex gap-2">
                    <button type="button" onClick={() => onOpenPetModal(pet.id)} className="p-1 hover:bg-blue-50 rounded">
                      <Edit2 className="w-4 h-4 text-slate-400 hover:text-blue-500" />
                    </button>
                    <button onClick={() => onDeletePet(pet.id)} className="p-1 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
                <h4 className="font-semibold mb-1">{pet.name}</h4>
                <p className="text-sm text-slate-500 mb-2">{pet.species}{pet.breed ? ` - ${pet.breed}` : ''}</p>
                {tutor && <p className="text-xs text-primary">Tutor: {tutor.name}</p>}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}