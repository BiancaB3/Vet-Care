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
  cpf: string;
  cep: string;
}

export interface PetDraft {
  tutorId: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  weight: string;
  sex: string;
  color: string;
}

export interface ConsultationDraft {
  petId: string;
  date: string;
  time: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
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

const emptyAppointment = (): AppointmentDraft => ({ petId: '', date: '', time: '', reason: '' });

const emptyTutor = (): TutorDraft => ({ name: '', email: '', phone: '', cpf: '', cep: '' });

const emptyPet = (): PetDraft => ({
  tutorId: '',
  name: '',
  species: '',
  breed: '',
  age: '',
  weight: '',
  sex: '',
  color: '',
});

const emptyConsultation = (): ConsultationDraft => ({
  petId: '',
  date: '',
  time: '',
  reason: '',
  diagnosis: '',
  treatment: '',
  prescription: '',
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

/** Returns the saved draft for a form, or null if there isn't one (or it's empty). */
export function getDraft<K extends DraftKind>(kind: K, id?: string | null): DraftMap[K] | null {
  if (typeof window === 'undefined') return null;
  const raw = Cookies.get(cookieKeyForDraft(kind, id));
  if (!raw) return null;
  const parsed = parseDraft(kind, raw);
  if (!parsed || !hasMeaningfulDraft(parsed as unknown as Record<string, unknown>)) return null;
  return parsed;
}

/** Merges `dados` into whatever draft is already saved and persists it for 1 day. */
export function saveDraft<K extends DraftKind>(
  kind: K,
  dados: Partial<DraftMap[K]>,
  id?: string | null,
): void {
  const key = cookieKeyForDraft(kind, id);
  const prevRaw = Cookies.get(key);
  const base = prevRaw ? (parseDraft(kind, prevRaw) ?? emptyDraftByKind(kind)) : emptyDraftByKind(kind);
  const atualizado = { ...base, ...dados } as DraftMap[K];
  Cookies.set(key, JSON.stringify(atualizado), { expires: 1 });
}

export function clearDraft(kind: DraftKind, id?: string | null): void {
  Cookies.remove(cookieKeyForDraft(kind, id));
}

export function hasDraft(kind: DraftKind, id?: string | null): boolean {
  return getDraft(kind, id) !== null;
}
