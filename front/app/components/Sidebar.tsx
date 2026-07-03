
import Link from 'next/link';

export default function Sidebar() {
  const items = [
    { href: '/home', label: 'Home' },
    { href: '/agendamentos', label: 'Agendamentos' },
    { href: '/tutores', label: 'Tutores' },
    { href: '/pets', label: 'Pets' },
    { href: '/prontuarios', label: 'Prontuários' },
    { href: '/veterinarios', label: 'Veterinários' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-4 hidden md:block">
      <nav>
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-primary font-medium transition-all">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
