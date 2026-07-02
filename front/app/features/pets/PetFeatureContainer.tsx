'use client';

import { useState } from 'react';
import { Cat, Dog, Feather, Mouse, Turtle } from 'lucide-react';
import type { Pet, Tutor } from '../../context/VetContext';
import VetCarePetSection from '../../components/VetCarePetSection';

type PetFeatureContainerProps = {
  currentVetPets: Pet[];
  currentVetTutors: Tutor[];
  onOpenPetModal: (id?: string) => void;
  onDeletePet: (id: string) => void;
};

export default function PetFeatureContainer({
  currentVetPets,
  currentVetTutors,
  onOpenPetModal,
  onDeletePet,
}: PetFeatureContainerProps) {
  const [petSearch, setPetSearch] = useState('');

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
    <VetCarePetSection
      currentVetPets={currentVetPets}
      currentVetTutors={currentVetTutors}
      petSearch={petSearch}
      onPetSearchChange={setPetSearch}
      onOpenPetModal={onOpenPetModal}
      onDeletePet={onDeletePet}
      renderSpeciesIcon={getSpeciesIcon}
    />
  );
}
