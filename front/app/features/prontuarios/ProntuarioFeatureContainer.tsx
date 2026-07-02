'use client';

import { useState } from 'react';
import { Cat, Dog, Feather, Mouse, Turtle } from 'lucide-react';
import type { Consultation, Pet } from '../../context/VetContext';
import VetCareProntuarioSection from '../../components/VetCareProntuarioSection';

type ProntuarioFeatureContainerProps = {
  currentVetConsultations: Consultation[];
  currentVetPets: Pet[];
  onOpenConsultationModal: (id?: string) => void;
  onDeleteConsultation: (id: string) => void;
};

export default function ProntuarioFeatureContainer({
  currentVetConsultations,
  currentVetPets,
  onOpenConsultationModal,
  onDeleteConsultation,
}: ProntuarioFeatureContainerProps) {
  const [prontuarioSearch, setProntuarioSearch] = useState('');

  const getSpeciesIcon = (species: string) => {
    const normalized = species.toLowerCase();
    if (normalized.includes('cao') || normalized.includes('cão') || normalized.includes('dog')) {
      return <Dog className="w-6 h-6 text-primary/30" />;
    }
    if (normalized.includes('gato') || normalized.includes('cat')) {
      return <Cat className="w-6 h-6 text-primary/30" />;
    }
    if (normalized.includes('ave')) {
      return <Feather className="w-6 h-6 text-primary/30" />;
    }
    if (normalized.includes('reptil')) {
      return <Turtle className="w-6 h-6 text-primary/30" />;
    }
    if (normalized.includes('roedor')) {
      return <Mouse className="w-6 h-6 text-primary/30" />;
    }
    return <Dog className="w-6 h-6 text-primary/30" />;
  };

  return (
    <VetCareProntuarioSection
      currentVetConsultations={currentVetConsultations}
      currentVetPets={currentVetPets}
      prontuarioSearch={prontuarioSearch}
      onProntuarioSearchChange={setProntuarioSearch}
      onOpenConsultationModal={onOpenConsultationModal}
      onDeleteConsultation={onDeleteConsultation}
      renderSpeciesIcon={getSpeciesIcon}
    />
  );
}
