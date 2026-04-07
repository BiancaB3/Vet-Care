'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Type Definitions
export interface Veterinarian {
  id: string;
  name: string;
  email: string;
  crmv: string;
  phone: string;
}

export interface Tutor {
  id: string;
  vetId: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

export interface Pet {
  id: string;
  vetId: string;
  tutorId: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  createdAt: Date;
}

export interface Appointment {
  id: string;
  vetId: string;
  petId: string;
  date: string;
  time: string;
  reason: string;
  status: 'agendado' | 'concluido' | 'cancelado';
  confirmed: boolean;
  createdAt: Date;
}

export interface Consultation {
  id: string;
  vetId: string;
  petId: string;
  date: string;
  time: string;
  reason: string;
  diagnosis: string;
  prescription: string;
  notes: string;
  createdAt: Date;
}

interface VetContextType {
  currentVet: Veterinarian | null;
  login: (vet: Veterinarian) => void;
  logout: () => void;
  tutors: Tutor[];
  addTutor: (tutor: Tutor) => void;
  updateTutor: (id: string, data: Partial<Tutor>) => void;
  deleteTutor: (id: string) => void;
  pets: Pet[];
  addPet: (pet: Pet) => void;
  updatePet: (id: string, data: Partial<Pet>) => void;
  deletePet: (id: string) => void;
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, data: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  consultations: Consultation[];
  addConsultation: (consultation: Consultation) => void;
  updateConsultation: (id: string, data: Partial<Consultation>) => void;
  deleteConsultation: (id: string) => void;
}

const VetContext = createContext<VetContextType | undefined>(undefined);

export function VetProvider({ children }: { children: ReactNode }) {
  const [currentVet, setCurrentVet] = useState<Veterinarian | null>(null);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  // Load tutors and pets from localStorage when vet logs in
  const login = (vet: Veterinarian) => {
    setCurrentVet(vet);
    // TUTORES
    if (typeof window !== 'undefined') {
      const storedTutors = localStorage.getItem(`vetcare_tutores_${vet.id}`);
      // Sempre sobrescreve os dados ao logar com maria@vetcare.com
      if (vet.email === 'maria@vetcare.com') {
        const defaultTutors = [
          { id: 'tutor1', vetId: vet.id, name: 'Mel Maia', email: 'mel.maia@tiktok.com', phone: '(21) 99888-7766', createdAt: new Date() },
          { id: 'tutor2', vetId: vet.id, name: 'Fausto Silva', email: 'loco.bicho@domingao.com', phone: '(11) 91234-5678', createdAt: new Date() },
          { id: 'tutor3', vetId: vet.id, name: 'Ana Maria Braga', email: 'acorda.menina@maisvoce.com', phone: '(21) 98765-4321', createdAt: new Date() },
          { id: 'tutor4', vetId: vet.id, name: 'Neymar Junior', email: 'cai.cai@menino-ney.br', phone: '(13) 91010-1010', createdAt: new Date() },
          { id: 'tutor6', vetId: vet.id, name: 'Gretchen', email: 'rainha@bundinha.com', phone: '(11) 90000-0002', createdAt: new Date() },
        ];
        setTutors(defaultTutors);
        localStorage.setItem(`vetcare_tutores_${vet.id}`, JSON.stringify(defaultTutors));
        const defaultPets = [
          { id: 'pet1', vetId: vet.id, tutorId: 'tutor1', name: 'Fofinho de Neve', species: 'Cão', breed: 'Lulu da Pomerânia', age: 2, weight: 2, createdAt: new Date() },
          { id: 'pet2', vetId: vet.id, tutorId: 'tutor2', name: 'Churrasquinho', species: 'Cão', breed: 'Vira-lata Caramelo', age: 5, weight: 12, createdAt: new Date() },
          { id: 'pet3', vetId: vet.id, tutorId: 'tutor3', name: 'Louro José II', species: 'Ave', breed: 'Papagaio-verdadeiro', age: 1, weight: 1, createdAt: new Date() },
          { id: 'pet4', vetId: vet.id, tutorId: 'tutor4', name: 'Mbappé', species: 'Cão', breed: 'Bulldog Francês (corre muito)', age: 3, weight: 25, createdAt: new Date() },
          { id: 'pet6', vetId: vet.id, tutorId: 'tutor6', name: 'Piripiri', species: 'Cão', breed: 'Poodle Gigante', age: 10, weight: 4.2, createdAt: new Date() },
        ];
        setPets(defaultPets);
        localStorage.setItem(`vetcare_pets_${vet.id}`, JSON.stringify(defaultPets));
      } else {
        if (storedTutors) {
          try {
            setTutors(JSON.parse(storedTutors));
          } catch {
            setTutors([]);
          }
        } else {
          setTutors([]);
        }
        if (storedPets) {
          try {
            setPets(JSON.parse(storedPets));
          } catch {
            setPets([]);
          }
        } else {
          setPets([]);
        }
      }
    }
  };

  const logout = () => {
    setCurrentVet(null);
    setTutors([]);
    setPets([]);
    setAppointments([]);
    setConsultations([]);
  };

  // Sync tutors and pets to localStorage whenever changed
  useEffect(() => {
    if (currentVet && typeof window !== 'undefined') {
      localStorage.setItem(`vetcare_tutores_${currentVet.id}`, JSON.stringify(tutors));
      localStorage.setItem(`vetcare_pets_${currentVet.id}`, JSON.stringify(pets));
    }
  }, [tutors, pets, currentVet]);

  const addTutor = (tutor: Tutor) => {
    if (currentVet) {
      tutor.vetId = currentVet.id;
      setTutors(prev => {
        const updated = [...prev, tutor];
        if (typeof window !== 'undefined') {
          localStorage.setItem(`vetcare_tutores_${currentVet.id}`, JSON.stringify(updated));
        }
        return updated;
      });
    }
  };

  const updateTutor = (id: string, data: Partial<Tutor>) => {
    setTutors(prev => {
      const updated = prev.map(t => (t.id === id ? { ...t, ...data } : t));
      if (currentVet && typeof window !== 'undefined') {
        localStorage.setItem(`vetcare_tutores_${currentVet.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const deleteTutor = (id: string) => {
    setTutors(prev => {
      const updated = prev.filter(t => t.id !== id);
      if (currentVet && typeof window !== 'undefined') {
        localStorage.setItem(`vetcare_tutores_${currentVet.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const addPet = (pet: Pet) => {
    if (currentVet) {
      pet.vetId = currentVet.id;
      setPets(prev => {
        const updated = [...prev, pet];
        if (typeof window !== 'undefined') {
          localStorage.setItem(`vetcare_pets_${currentVet.id}`, JSON.stringify(updated));
        }
        return updated;
      });
    }
  };

  const updatePet = (id: string, data: Partial<Pet>) => {
    setPets(prev => {
      const updated = prev.map(p => (p.id === id ? { ...p, ...data } : p));
      if (currentVet && typeof window !== 'undefined') {
        localStorage.setItem(`vetcare_pets_${currentVet.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const deletePet = (id: string) => {
    setPets(prev => {
      const updated = prev.filter(p => p.id !== id);
      if (currentVet && typeof window !== 'undefined') {
        localStorage.setItem(`vetcare_pets_${currentVet.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const addAppointment = (appointment: Appointment) => {
    if (currentVet) {
      appointment.vetId = currentVet.id;
      setAppointments([...appointments, appointment]);
    }
  };

  const updateAppointment = (id: string, data: Partial<Appointment>) => {
    setAppointments(appointments.map(a => (a.id === id ? { ...a, ...data } : a)));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(appointments.map(a => (a.id === id ? { ...a, status } : a)));
  };

  const addConsultation = (consultation: Consultation) => {
    if (currentVet) {
      consultation.vetId = currentVet.id;
      setConsultations([...consultations, consultation]);
    }
  };

  const updateConsultation = (id: string, data: Partial<Consultation>) => {
    setConsultations(consultations.map(c => (c.id === id ? { ...c, ...data } : c)));
  };

  const deleteConsultation = (id: string) => {
    setConsultations(consultations.filter(c => c.id !== id));
  };

  const value: VetContextType = {
    currentVet,
    login,
    logout,
    tutors,
    addTutor,
    updateTutor,
    deleteTutor,
    pets,
    addPet,
    updatePet,
    deletePet,
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    updateAppointmentStatus,
    consultations,
    addConsultation,
    updateConsultation,
    deleteConsultation,
  };

  return <VetContext.Provider value={value}>{children}</VetContext.Provider>;
}

export function useVet() {
  const context = useContext(VetContext);
  if (!context) {
    throw new Error('useVet deve ser usado dentro de VetProvider');
  }
  return context;
}