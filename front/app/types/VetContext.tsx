'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { listarPets, criarPet, atualizarPet, excluirPet } from '../services/petService';

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
  cpf?: string;
  cep?: string;
  endereco?: string;
  photo?: string;
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
  sex?: string;
  color?: string;
  photo?: string;
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
  addPet: (pet: Pet) => Promise<Pet>;
  updatePet: (id: string, data: Partial<Pet>) => Promise<Pet>;
  deletePet: (id: string) => Promise<void>;
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
  const { currentVet, login, logout } = useAuth();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  // Load pets from API when auth vet changes (login, hydrate, logout)
  useEffect(() => {
    let cancelled = false;

    if (!currentVet) {
      setTutors([]);
      setPets([]);
      setAppointments([]);
      setConsultations([]);
      return;
    }

    setTutors([]);

    (async () => {
      try {
        const petsApi = await listarPets(currentVet.id);
        if (!cancelled) {
          setPets(petsApi);
        }
      } catch {
        if (!cancelled) {
          setPets([]);
        }
      }

    })();

    return () => {
      cancelled = true;
    };
  }, [currentVet]);

  const addTutor = (tutor: Tutor) => {
    if (currentVet) {
      tutor.vetId = currentVet.id;
      setTutors(prev => [...prev, tutor]);
    }
  };

  const updateTutor = (id: string, data: Partial<Tutor>) => {
    setTutors(prev => prev.map(t => (t.id === id ? { ...t, ...data } : t)));
  };

  const deleteTutor = (id: string) => {
    setTutors(prev => prev.filter(t => t.id !== id));
  };

  const addPet = async (pet: Pet): Promise<Pet> => {
    if (!currentVet) {
      throw new Error('Veterinario nao autenticado.');
    }

    const criado = await criarPet(currentVet.id, {
      tutorId: pet.tutorId,
      nome: pet.name,
      especie: pet.species,
      raca: pet.breed,
      idade: pet.age,
      peso: pet.weight,
      sexo: pet.sex,
      cor: pet.color,
    });

    setPets(prev => [...prev, criado]);
    return criado;
  };

  const updatePet = async (id: string, data: Partial<Pet>): Promise<Pet> => {
    if (!currentVet) {
      throw new Error('Veterinario nao autenticado.');
    }

    const existente = pets.find((item) => item.id === id);
    const tutorId = data.tutorId ?? existente?.tutorId;

    if (!tutorId) {
      throw new Error('Tutor do pet nao informado.');
    }

    const atualizado = await atualizarPet(currentVet.id, Number(id), {
      tutorId,
      nome: data.name ?? existente?.name,
      especie: data.species ?? existente?.species,
      raca: data.breed ?? existente?.breed,
      idade: data.age ?? existente?.age,
      peso: data.weight ?? existente?.weight,
      sexo: data.sex ?? existente?.sex,
      cor: data.color ?? existente?.color,
    });

    setPets(prev => prev.map(p => (p.id === id ? atualizado : p)));
    return atualizado;
  };

  const deletePet = async (id: string): Promise<void> => {
    const sucesso = await excluirPet(Number(id));
    if (!sucesso) {
      throw new Error('Nao foi possivel excluir o pet.');
    }
    setPets(prev => prev.filter(p => p.id !== id));
  };

  const addAppointment = (appointment: Appointment) => {
    if (currentVet) {
      appointment.vetId = currentVet.id;
      setAppointments([...appointments, appointment]);
    }
  };

  const updateAppointment = (id: string, data: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => (a.id === id ? { ...a, ...data } : a)));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => (a.id === id ? { ...a, status } : a)));
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