'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Cookies from 'js-cookie';

export type DraftKind = 'appointment' | 'tutor' | 'pet' | 'consultation';

export interface AppointmentDraft {
  petId: string;
  date: string;
  time: string;
  reason: string;
}

export interface TutorDraft {
  name: string;
  email: string;
  phone: string;
}

export interface PetDraft {
  tutorId: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  weight: string;
}

export interface ConsultationDraft {
  petId: string;
  date: string;
  time: string;
  reason: string;
  diagnosis: string;
  prescription: string;
  notes: string;
}

export type DraftMap = {
  appointment: AppointmentDraft;
  tutor: TutorDraft;
  pet: PetDraft;
  consultation: ConsultationDraft;
};

export function cookieKeyForDraft(kind: DraftKind, id?: string | null): string {
  return `vetcare_${kind}_draft_${id ?? 'new'}`;
}

const emptyAppointment = (): AppointmentDraft => ({
  petId: '',
  date: '',
  time: '',
  reason: '',
});

const emptyTutor = (): TutorDraft => ({
  name: '',
  email: '',
  phone: '',
});

const emptyPet = (): PetDraft => ({
  tutorId: '',
  name: '',
  species: '',
  breed: '',
  age: '',
  weight: '',
});

const emptyConsultation = (): ConsultationDraft => ({
  petId: '',
  date: '',
  time: '',
  reason: '',
  diagnosis: '',
  prescription: '',
  notes: '',
});

export function emptyDraftByKind<K extends DraftKind>(kind: K): DraftMap[K] {
  switch (kind) {
    case 'appointment':
      return emptyAppointment() as DraftMap[K];
    case 'tutor':
      return emptyTutor() as DraftMap[K];
    case 'pet':
      return emptyPet() as DraftMap[K];
    case 'consultation':
      return emptyConsultation() as DraftMap[K];
  }
}

function parseDraft<K extends DraftKind>(kind: K, raw: string): DraftMap[K] | null {
  try {
    const parsed = JSON.parse(raw) as Partial<DraftMap[K]>;
    return { ...emptyDraftByKind(kind), ...parsed } as DraftMap[K];
  } catch {
    return null;
  }
}

function hasMeaningfulDraft(obj: Record<string, unknown> | null | undefined): boolean {
  if (!obj) return false;
  return Object.values(obj).some((v) => typeof v === 'string' && v.trim().length > 0);
}

interface DraftContextType {
  getDraft: <K extends DraftKind>(kind: K, id?: string | null) => DraftMap[K] | null;
  salvarProgresso: <K extends DraftKind>(kind: K, dados: Partial<DraftMap[K]>, id?: string | null) => void;
  limparRascunho: (kind: DraftKind, id?: string | null) => void;
  temRascunho: (kind: DraftKind, id?: string | null) => boolean;
}

const DraftContext = createContext<DraftContextType | undefined>(undefined);

export function DraftProvider({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState(0);

  const readFromCookie = useCallback(<K extends DraftKind>(kind: K, id?: string | null): DraftMap[K] | null => {
    if (typeof window === 'undefined') return null;
    const key = cookieKeyForDraft(kind, id);
    const raw = Cookies.get(key);
    if (!raw) return null;
    return parseDraft(kind, raw);
  }, []);

  const getDraft = useCallback(
    <K extends DraftKind>(kind: K, id?: string | null): DraftMap[K] | null => {
      void version;
      const d = readFromCookie(kind, id);
      if (!d) return null;
      if (!hasMeaningfulDraft(d as unknown as Record<string, unknown>)) return null;
      return d;
    },
    [readFromCookie, version]
  );

  const salvarProgresso = useCallback(
    <K extends DraftKind>(kind: K, dados: Partial<DraftMap[K]>, id?: string | null) => {
      const key = cookieKeyForDraft(kind, id);
      const prevRaw = Cookies.get(key);
      const base = prevRaw ? parseDraft(kind, prevRaw) ?? emptyDraftByKind(kind) : emptyDraftByKind(kind);
      const atualizado = { ...base, ...dados } as DraftMap[K];
      Cookies.set(key, JSON.stringify(atualizado), { expires: 1 });
      setVersion((v) => v + 1);
    },
    []
  );

  const limparRascunho = useCallback((kind: DraftKind, id?: string | null) => {
    Cookies.remove(cookieKeyForDraft(kind, id));
    setVersion((v) => v + 1);
  }, []);

  const temRascunho = useCallback(
    (kind: DraftKind, id?: string | null): boolean => {
      void version;
      const d = readFromCookie(kind, id);
      return hasMeaningfulDraft(d as unknown as Record<string, unknown> | null);
    },
    [readFromCookie, version]
  );

  const value: DraftContextType = {
    getDraft,
    salvarProgresso,
    limparRascunho,
    temRascunho,
  };

  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}

export function useDraft() {
  const context = useContext(DraftContext);
  if (!context) throw new Error('useDraft deve ser usado dentro de um DraftProvider');
  return context;
}
