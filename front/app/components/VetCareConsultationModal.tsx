'use client';

import { ClipboardList, X } from 'lucide-react';
import type { ConsultationDraft } from '../types/DraftContext';

type PetOption = {
  id: string;
  name: string;
};

type ConsultationToEdit = {
  petId: string;
  date: string;
  time: string;
  reason: string;
  diagnosis: string;
  prescription: string;
  notes: string;
} | null;

export type VetCareConsultationModalProps = {
  consultationForm: ConsultationDraft;
  currentVetPets: PetOption[];
  editingConsultationId: string | null;
  consultationToEdit: ConsultationToEdit;
  showDraft: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onConsultationFormChange: (next: ConsultationDraft) => void;
  onDiscardDraft: () => void;
};

export default function VetCareConsultationModal({
  consultationForm,
  currentVetPets,
  editingConsultationId,
  consultationToEdit,
  showDraft,
  onClose,
  onSubmit,
  onConsultationFormChange,
  onDiscardDraft,
}: VetCareConsultationModalProps) {
  return (
    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
      <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-bold">{editingConsultationId ? 'Editar Prontuario' : 'Registrar Prontuario'}</h3>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>
      <form onSubmit={onSubmit} className="p-6 space-y-5">
        {showDraft && (
          <div className="p-3 bg-amber-50 text-amber-800 rounded-xl text-sm flex items-center justify-between gap-3 border border-amber-200">
            <span>Rascunho recuperado.</span>
            <button type="button" onClick={onDiscardDraft} className="shrink-0 px-3 py-1.5 font-semibold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900">
              Descartar
            </button>
          </div>
        )}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Pet</label>
          <select value={consultationForm.petId} onChange={(e) => onConsultationFormChange({ ...consultationForm, petId: e.target.value })} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium">
            <option value="">Selecione o pet</option>
            {currentVetPets.map((pet) => <option key={pet.id} value={pet.id}>{pet.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Data</label>
          <input type="date" value={consultationForm.date} onChange={(e) => onConsultationFormChange({ ...consultationForm, date: e.target.value })} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Hora</label>
          <input type="time" value={consultationForm.time} onChange={(e) => onConsultationFormChange({ ...consultationForm, time: e.target.value })} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Motivo da Consulta</label>
          <textarea value={consultationForm.reason} onChange={(e) => onConsultationFormChange({ ...consultationForm, reason: e.target.value })} rows={2} placeholder="Descreva o motivo da consulta" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium resize-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Diagnostico</label>
          <textarea value={consultationForm.diagnosis} onChange={(e) => onConsultationFormChange({ ...consultationForm, diagnosis: e.target.value })} rows={3} placeholder="Descreva o diagnostico" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium resize-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Prescricao / Recomendacoes</label>
          <textarea value={consultationForm.prescription} onChange={(e) => onConsultationFormChange({ ...consultationForm, prescription: e.target.value })} rows={3} placeholder="Medicamentos, dosagem, recomendacoes..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium resize-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Observacoes Gerais</label>
          <textarea value={consultationForm.notes} onChange={(e) => onConsultationFormChange({ ...consultationForm, notes: e.target.value })} rows={2} placeholder="Observacoes adicionais" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary font-medium resize-none" />
        </div>
        <div className="p-3 bg-blue-50 text-blue-600 rounded text-sm">
          Este prontuario sera enviado por email ao tutor.
        </div>
        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border-2 text-slate-700 font-bold rounded-xl hover:bg-slate-100">Cancelar</button>
          <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl">
            {editingConsultationId ? 'Atualizar' : 'Registrar'}
          </button>
        </div>
      </form>
    </div>
  );
}
