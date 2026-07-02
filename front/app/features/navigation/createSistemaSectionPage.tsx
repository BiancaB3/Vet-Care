import VetCareApp from '../../components/VetCareApp';
import type { SistemaSection } from './sections';

export function createSistemaSectionPage(section: SistemaSection) {
  return function SistemaSectionPage() {
    return <VetCareApp initialSection={section} embedded />;
  };
}
