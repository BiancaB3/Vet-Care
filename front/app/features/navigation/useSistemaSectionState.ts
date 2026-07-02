'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { resolveSectionByPathname, type SistemaSection } from './sections';

type UseSistemaSectionStateParams = {
  initialSection: SistemaSection;
  embedded: boolean;
};

export function useSistemaSectionState({
  initialSection,
  embedded,
}: UseSistemaSectionStateParams) {
  const pathname = usePathname();
  const [activeSection, setActiveSectionState] = useState<SistemaSection>(initialSection);

  useEffect(() => {
    if (embedded) {
      setActiveSectionState(resolveSectionByPathname(pathname));
      return;
    }

    setActiveSectionState(initialSection);
  }, [embedded, initialSection, pathname]);

  const setActiveSection = (section: SistemaSection) => {
    setActiveSectionState(section);
  };

  return { activeSection, setActiveSection };
}
