'use client';

import { User, Users, X } from 'lucide-react';

type TutorFormState = {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  cep: string;
  street: string;
  district: string;
  city: string;
  state: string;
};

type TutorOption = {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string | null;
  cep?: string | null;
  endereco?: string | null;
};

export type VetCareTutorModalProps = {
  tutorForm: TutorFormState;
  tutorPhoto: string;
  isCepLoading: boolean;
  currentVetTutors: TutorOption[];
  editingTutorId: string | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onTutorFormChange: (next: TutorFormState) => void;
  onTutorPhotoChange: (value: string) => void;
  onTutorPhotoClear: () => void;
  onCepBlur: (cep: string) => void;
  onDiscardDraft: () => void;
};

export default function VetCareTutorModal({
  tutorForm,
  tutorPhoto,
  isCepLoading,
  currentVetTutors,
  editingTutorId,
  onClose,
  onSubmit,
  onTutorFormChange,
  onTutorPhotoChange,
  onTutorPhotoClear,
  onCepBlur,
  onDiscardDraft,
}: VetCareTutorModalProps) {
  return (
    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
      <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-bold">Cadastrar Tutor</h3>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>
      <form onSubmit={onSubmit} className="p-6 space-y-5">
        {editingTutorId && (
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
          <label className="block text-sm font-semibold text-slate-700 mb-2">Foto do Tutor</label>
          <div className="flex items-center gap-4">
            <div
              className="relative w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 hover:border-primary transition-colors cursor-pointer"
              onClick={() => document.getElementById('tutor-photo-input')?.click()}
            >
              {tutorPhoto
                ? <img src={tutorPhoto} alt="Foto do tutor" className="w-full h-full object-cover" />
                : <div className="flex flex-col items-center gap-1 text-slate-400"><User className="w-7 h-7" /><span className="text-xs">Foto</span></div>
              }
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => document.getElementById('tutor-photo-input')?.click()}
                className="px-3 py-2 text-sm font-medium rounded-xl border border-primary text-primary hover:bg-primary/10 transition-all"
              >
                {tutorPhoto ? 'Alterar foto' : 'Enviar foto'}
              </button>
              {tutorPhoto && (
                <button
                  type="button"
                  onClick={onTutorPhotoClear}
                  className="px-3 py-2 text-sm font-medium rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 transition-all"
                >
                  Remover
                </button>
              )}
            </div>
            <input
              id="tutor-photo-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => onTutorPhotoChange(ev.target?.result as string);
                reader.readAsDataURL(file);
                e.target.value = '';
              }}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Nome Completo</label>
          <input type="text" value={tutorForm.name} onChange={(e) => onTutorFormChange({ ...tutorForm, name: e.target.value })} placeholder="Nome Completo" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input type="email" value={tutorForm.email} onChange={(e) => onTutorFormChange({ ...tutorForm, email: e.target.value })} placeholder="Email" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Telefone</label>
            <input type="tel" value={tutorForm.phone} onChange={(e) => onTutorFormChange({ ...tutorForm, phone: e.target.value })} placeholder="(XX)XXXXX-XXXX" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">CPF</label>
            <input type="text" value={tutorForm.cpf} onChange={(e) => onTutorFormChange({ ...tutorForm, cpf: e.target.value })} placeholder="000.000.000-00 ou 00000000000" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">CEP</label>
            <input type="text" value={tutorForm.cep} onChange={(e) => onTutorFormChange({ ...tutorForm, cep: e.target.value })} onBlur={() => onCepBlur(tutorForm.cep)} placeholder="00000-000 ou 00000000" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Rua</label>
            <input type="text" value={tutorForm.street} onChange={(e) => onTutorFormChange({ ...tutorForm, street: e.target.value })} placeholder="Rua" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Bairro</label>
            <input type="text" value={tutorForm.district} onChange={(e) => onTutorFormChange({ ...tutorForm, district: e.target.value })} placeholder="Bairro" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Cidade</label>
            <input type="text" value={tutorForm.city} onChange={(e) => onTutorFormChange({ ...tutorForm, city: e.target.value })} placeholder="Cidade" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">UF</label>
            <input type="text" value={tutorForm.state} onChange={(e) => onTutorFormChange({ ...tutorForm, state: e.target.value.toUpperCase().slice(0, 2) })} placeholder="UF" required maxLength={2} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium uppercase" />
          </div>
        </div>
        {isCepLoading && <p className="text-sm text-slate-500">Buscando endereco pelo CEP...</p>}
        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border-2 text-slate-700 font-bold rounded-xl hover:bg-slate-100">Cancelar</button>
          <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl">Salvar</button>
        </div>
      </form>
    </div>
  );
}