'use client';

import { useState } from 'react';
import type { Tutor } from '../../types/VetContext';
import VetCareTutorSection from '../../components/VetCareTutorSection';

type TutorFeatureContainerProps = {
  currentVetTutors: Tutor[];
  onOpenTutorModal: (id?: string) => void;
  onDeleteTutor: (id: string) => void;
};

export default function TutorFeatureContainer({
  currentVetTutors,
  onOpenTutorModal,
  onDeleteTutor,
}: TutorFeatureContainerProps) {
  const [tutorSearch, setTutorSearch] = useState('');

  return (
    <VetCareTutorSection
      currentVetTutors={currentVetTutors}
      tutorSearch={tutorSearch}
      onTutorSearchChange={setTutorSearch}
      onOpenTutorModal={onOpenTutorModal}
      onDeleteTutor={onDeleteTutor}
    />
  );
}

