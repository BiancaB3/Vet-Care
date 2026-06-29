
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 p-4">
      <nav>
        <ul className="flex flex-col gap-2">
          <li><Link href="/agendamentos" className="block px-2 py-1 rounded hover:bg-gray-200">Agendamentos</Link></li>
          <li><Link href="/tutores" className="block px-2 py-1 rounded hover:bg-gray-200">Tutores</Link></li>
          <li><Link href="/pets" className="block px-2 py-1 rounded hover:bg-gray-200">Pets</Link></li>
          <li><Link href="/veterinarios" className="block px-2 py-1 rounded hover:bg-gray-200">Veterinários</Link></li>
        </ul>
      </nav>
    </aside>
  );
}
