export type SistemaSection = 'agenda' | 'tutores' | 'pets' | 'prontuarios' | 'veterinarios';

export type SistemaMenuItem = {
  href: string;
  label: string;
  section: SistemaSection;
};

export const SISTEMA_MENU_ITEMS: SistemaMenuItem[] = [
  { href: '/home', label: 'Home', section: 'agenda' },
  { href: '/agendamentos', label: 'Agendamentos', section: 'agenda' },
  { href: '/tutores', label: 'Tutores', section: 'tutores' },
  { href: '/pets', label: 'Pets', section: 'pets' },
  { href: '/prontuarios', label: 'Prontuários', section: 'prontuarios' },
  { href: '/veterinarios', label: 'Veterinários', section: 'veterinarios' },
];

export const resolveSectionByPathname = (pathname: string): SistemaSection => {
  const menuMatch = SISTEMA_MENU_ITEMS.find((item) => item.href === pathname);
  if (menuMatch) {
    return menuMatch.section;
  }

  if (pathname.startsWith('/tutores')) return 'tutores';
  if (pathname.startsWith('/pets')) return 'pets';
  if (pathname.startsWith('/prontuarios')) return 'prontuarios';
  if (pathname.startsWith('/veterinarios')) return 'veterinarios';

  return 'agenda';
};
