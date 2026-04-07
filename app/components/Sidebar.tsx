
export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 p-4">
      <nav>
        <ul className="flex flex-col gap-2">
          <li><a href="/home" className="block px-2 py-1 rounded hover:bg-gray-200">Início</a></li>
          <li><a href="/agenda" className="block px-2 py-1 rounded hover:bg-gray-200">Agenda</a></li>
          <li><a href="/tutores-pets" className="block px-2 py-1 rounded hover:bg-gray-200">Tutores e Pets</a></li>
          <li><a href="/consulta/nova" className="block px-2 py-1 rounded hover:bg-gray-200">Nova consulta</a></li>
        </ul>
      </nav>
    </aside>
  );
}
