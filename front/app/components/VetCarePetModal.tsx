'use client';

import { Dog, X } from 'lucide-react';
import type { PetDraft } from '../types/DraftContext';

type TutorOption = {
  id: string;
  name: string;
};

export type VetCarePetModalProps = {
  petForm: PetDraft;
  petPhoto: string;
  currentVetTutors: TutorOption[];
  editingPetId: string | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onPetFormChange: (next: PetDraft) => void;
  onPetPhotoChange: (value: string) => void;
  onPetPhotoClear: () => void;
  onDiscardDraft: () => void;
};

export default function VetCarePetModal({
  petForm,
  petPhoto,
  currentVetTutors,
  editingPetId,
  onClose,
  onSubmit,
  onPetFormChange,
  onPetPhotoChange,
  onPetPhotoClear,
  onDiscardDraft,
}: VetCarePetModalProps) {
  return (
    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
      <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
        <div className="flex items-center gap-3">
          <Dog className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-bold">Cadastrar Pet</h3>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>
      <form onSubmit={onSubmit} className="p-6 space-y-5">
        {editingPetId && (
          <div className="p-3 bg-amber-50 text-amber-800 rounded-xl text-sm flex items-center justify-between gap-3 border border-amber-200">
            <span>Rascunho recuperado.</span>
            <button
              type="button"
              onClick={onDiscardDraft}
              className="shrink-0 px-3 py-1.5 font-semibold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900"
            >
              Descartar
            </button>
          </div>
        )}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Foto do Pet</label>
          <div className="flex items-center gap-4">
            <div
              className="relative w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 hover:border-primary transition-colors cursor-pointer"
              onClick={() => document.getElementById('pet-photo-input')?.click()}
            >
              {petPhoto
                ? <img src={petPhoto} alt="Foto do pet" className="w-full h-full object-cover" />
                : <div className="flex flex-col items-center gap-1 text-slate-400"><Dog className="w-7 h-7" /><span className="text-xs">Foto</span></div>
              }
            </div>
            <div className="flex flex-col gap-2">
              <button type="button" onClick={() => document.getElementById('pet-photo-input')?.click()} className="px-3 py-2 text-sm font-medium rounded-xl border border-primary text-primary hover:bg-primary/10 transition-all">
                {petPhoto ? 'Alterar foto' : 'Enviar foto'}
              </button>
              {petPhoto && (
                <button type="button" onClick={onPetPhotoClear} className="px-3 py-2 text-sm font-medium rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 transition-all">
                  Remover
                </button>
              )}
            </div>
            <input
              id="pet-photo-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => onPetPhotoChange(ev.target?.result as string);
                reader.readAsDataURL(file);
                e.target.value = '';
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tutor</label>
            <select value={petForm.tutorId} onChange={(e) => onPetFormChange({ ...petForm, tutorId: e.target.value })} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium">
              <option value="">Selecione o tutor</option>
              {currentVetTutors.map((tutor) => <option key={tutor.id} value={tutor.id}>{tutor.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Nome do Pet</label>
            <input type="text" value={petForm.name} onChange={(e) => onPetFormChange({ ...petForm, name: e.target.value })} placeholder="Nome do Pet" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Raca</label>
            <input type="text" value={petForm.breed} onChange={(e) => onPetFormChange({ ...petForm, breed: e.target.value })} placeholder="Raca" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Especie</label>
            <select value={petForm.species} onChange={(e) => onPetFormChange({ ...petForm, species: e.target.value })} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium">
              <option value="">Selecione especie</option>
              <option value="Cao">Cao</option>
              <option value="Gato">Gato</option>
              <option value="Ave">Ave</option>
              <option value="Reptil">Reptil</option>
              <option value="Roedor">Roedor</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Idade (anos)</label>
            <input type="number" min={0} value={petForm.age} onChange={(e) => onPetFormChange({ ...petForm, age: e.target.value })} placeholder="Idade" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Peso (kg)</label>
            <input type="number" step="0.1" min={0} value={petForm.weight} onChange={(e) => onPetFormChange({ ...petForm, weight: e.target.value })} placeholder="Peso em kg" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Sexo</label>
            <select value={petForm.sex} onChange={(e) => onPetFormChange({ ...petForm, sex: e.target.value })} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium">
              <option value="">Selecione o sexo</option>
              <option value="Macho">Macho</option>
              <option value="Femea">Femea</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Cor</label>
            <input type="text" value={petForm.color} onChange={(e) => onPetFormChange({ ...petForm, color: e.target.value })} placeholder="Cor" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium" />
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border-2 text-slate-700 font-bold rounded-xl hover:bg-slate-100">Cancelar</button>
          <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl">Salvar</button>
        </div>
      </form>
    </div>
  );
}
