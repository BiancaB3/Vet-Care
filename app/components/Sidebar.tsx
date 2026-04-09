import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  return (
  <aside className="sidebar flex flex-col">
      <div className="p-6 border-b border-emerald-600">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#6b9080] to-[#5a7d71] rounded-xl flex items-center justify-center">
            {/* Stethoscope Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="#fff" strokeWidth="2" d="M4 3v7a6 6 0 0 0 12 0V3m-6 13v2a3 3 0 0 0 6 0v-2"/></svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">VetCare</h2>
            <p className="text-xs text-emerald-200">Sistema Pro</p>
          </div>
        </div>
      <p className="text-sm text-emerald-100 font-semibold">{user?.nome ?? 'Veterinário'}</p>
      {/* CRMV is not in User type, so only show if present */}
      {user && (user as any).crmv && (
        <p className="text-xs text-emerald-200">{(user as any).crmv}</p>
      )}
      {!user || !(user as any).crmv ? (
        <p className="text-xs text-emerald-200">CRMV</p>
      ) : null}
      </div>
      <nav className="p-4 space-y-2 flex-1">
        <a href="/sistema/home" className="sidebar-btn active"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M3 9.5 12 4l9 5.5M4 10v7a2 2 0 0 0 2 2h2m12-9v7a2 2 0 0 1-2 2h-2m-6 0v-4h4v4"/></svg> Dashboard</a>
        <a href="/sistema/agendamentos" className="sidebar-btn"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><rect width="18" height="16" x="3" y="5" rx="2" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" d="M16 3v4M8 3v4M3 9h18"/></svg> Agenda</a>
        <a href="/sistema/pets" className="sidebar-btn"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M10 19v-1a2 2 0 1 1 4 0v1m-7-6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm16 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM7 10V7.8A2.8 2.8 0 0 1 9.8 5h4.4A2.8 2.8 0 0 1 17 7.8V10m-10 0h10c.6 0 1 .4 1 1v2.5c0 2.485-2.015 4.5-4.5 4.5h-3C7.015 18 5 15.985 5 13.5V11c0-.6.4-1 1-1Z"/></svg> Pets</a>
        <a href="/sistema/tutores" className="sidebar-btn"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2m14-10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm6 10v-2a4 4 0 0 0-3-3.87M21 3a4 4 0 0 1 0 7.87"/></svg> Tutores</a>
        <a href="/sistema/prontuarios" className="sidebar-btn"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-8 0h8m-8 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2m-8 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> Prontuários</a>
      </nav>
    <div className="absolute bottom-6 left-4 right-4">
      <button onClick={logout} className="w-full py-2.5 px-4 bg-red-500/20 text-red-200 rounded-lg hover:bg-red-500/30 transition-all flex items-center justify-center gap-2 font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M15 3h6m0 0v6m0-6L10 14m-4 0v6h6"/></svg>
          Sair
        </button>
      </div>
    </aside>
  );
}
