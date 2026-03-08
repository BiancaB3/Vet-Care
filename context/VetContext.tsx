'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

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

  const login = (vet: Veterinarian) => {
    setCurrentVet(vet);
  };

  const logout = () => {
    setCurrentVet(null);
    setTutors([]);
    setPets([]);
    setAppointments([]);
    setConsultations([]);
  };

  const addTutor = (tutor: Tutor) => {
    if (currentVet) {
      tutor.vetId = currentVet.id;
      setTutors([...tutors, tutor]);
    }
  };

  const updateTutor = (id: string, data: Partial<Tutor>) => {
    setTutors(tutors.map(t => (t.id === id ? { ...t, ...data } : t)));
  };

  const deleteTutor = (id: string) => {
    setTutors(tutors.filter(t => t.id !== id));
  };

  const addPet = (pet: Pet) => {
    if (currentVet) {
      pet.vetId = currentVet.id;
      setPets([...pets, pet]);
    }
  };

  const updatePet = (id: string, data: Partial<Pet>) => {
    setPets(pets.map(p => (p.id === id ? { ...p, ...data } : p)));
  };

  const deletePet = (id: string) => {
    setPets(pets.filter(p => p.id !== id));
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