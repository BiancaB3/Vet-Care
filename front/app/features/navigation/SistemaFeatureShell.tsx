'use client';

import AgendaFeatureContainer from '../agenda/AgendaFeatureContainer';
import PetFeatureContainer from '../pets/PetFeatureContainer';
import ProntuarioFeatureContainer from '../prontuarios/ProntuarioFeatureContainer';
import TutorFeatureContainer from '../tutores/TutorFeatureContainer';
import VetCareVeterinarioSection from '../../components/VetCareVeterinarioSection';
import type {
  Appointment,
  Consultation,
  Pet,
  Tutor,
  Veterinarian,
} from '../../context/VetContext';
import type { SistemaSection } from './sections';

type SistemaFeatureShellProps = {
  activeSection: SistemaSection;
  currentVet: Veterinarian;
  currentVetAppointments: Appointment[];
  currentVetPets: Pet[];
  currentVetTutors: Tutor[];
  currentVetConsultations: Consultation[];
  onOpenAppointmentModal: () => void;
  onDeleteAppointment: (id: string) => void;
  onToggleAppointmentConfirmation: (id: string, confirmed: boolean) => void;
  onShowToast: (message: string) => void;
  onOpenTutorModal: (id?: string) => void;
  onDeleteTutor: (id: string) => Promise<void>;
  onOpenPetModal: (id?: string) => void;
  onDeletePet: (id: string) => Promise<void>;
  onOpenConsultationModal: (id?: string) => void;
  onDeleteConsultation: (id: string) => void;
};

export default function SistemaFeatureShell({
  activeSection,
  currentVet,
  currentVetAppointments,
  currentVetPets,
  currentVetTutors,
  currentVetConsultations,
  onOpenAppointmentModal,
  onDeleteAppointment,
  onToggleAppointmentConfirmation,
  onShowToast,
  onOpenTutorModal,
  onDeleteTutor,
  onOpenPetModal,
  onDeletePet,
  onOpenConsultationModal,
  onDeleteConsultation,
}: SistemaFeatureShellProps) {
  if (activeSection === 'agenda') {
    return (
      <AgendaFeatureContainer
        currentVetAppointments={currentVetAppointments}
        currentVetPets={currentVetPets}
        currentVetTutors={currentVetTutors}
        onOpenAppointmentModal={onOpenAppointmentModal}
        onDeleteAppointment={onDeleteAppointment}
        onToggleAppointmentConfirmation={onToggleAppointmentConfirmation}
        onShowToast={onShowToast}
      />
    );
  }

  if (activeSection === 'tutores') {
    return (
      <TutorFeatureContainer
        currentVetTutors={currentVetTutors}
        onOpenTutorModal={onOpenTutorModal}
        onDeleteTutor={onDeleteTutor}
      />
    );
  }

  if (activeSection === 'pets') {
    return (
      <PetFeatureContainer
        currentVetPets={currentVetPets}
        currentVetTutors={currentVetTutors}
        onOpenPetModal={onOpenPetModal}
        onDeletePet={onDeletePet}
      />
    );
  }

  if (activeSection === 'prontuarios') {
    return (
      <ProntuarioFeatureContainer
        currentVetConsultations={currentVetConsultations}
        currentVetPets={currentVetPets}
        onOpenConsultationModal={onOpenConsultationModal}
        onDeleteConsultation={onDeleteConsultation}
      />
    );
  }

  if (activeSection === 'veterinarios') {
    return <VetCareVeterinarioSection currentVet={currentVet} />;
  }

  return null;
}
