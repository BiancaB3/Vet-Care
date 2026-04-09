'use client';
import { useAuth } from '../../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  // Placeholder values for demonstration
  const consultasHoje = 0;
  const totalPets = 0;
  const totalTutores = 0;

  const initials = user?.nome ? user.nome.charAt(0).toUpperCase() : 'V';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <div className="flex items-center gap-6">
            <div className="relative">
              <button className="notification-bell">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 0 1-6 0v-1m6 0H9"/></svg>
                <span className="notification-badge">0</span>
              </button>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{user?.nome ?? 'Veterinário'}</p>
                <p className="text-xs text-slate-500">{(user as any)?.crmv ?? 'CRMV'}</p>
              </div>
              <div className="profile-avatar gradient-primary">{initials}</div>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Dashboard Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-hover bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-2">Consultas Hoje</p>
                <p className="text-3xl font-bold text-slate-900">{consultasHoje}</p>
              </div>
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                {/* Calendar Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="text-white" width="24" height="24" fill="none" viewBox="0 0 24 24"><rect width="18" height="16" x="3" y="5" rx="2" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" d="M16 3v4M8 3v4M3 9h18"/></svg>
              </div>
            </div>
          </div>
          <div className="card-hover bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-2">Total de Pets</p>
                <p className="text-3xl font-bold text-slate-900">{totalPets}</p>
              </div>
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                {/* Dog Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="text-white" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M10 19v-1a2 2 0 1 1 4 0v1m-7-6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm16 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM7 10V7.8A2.8 2.8 0 0 1 9.8 5h4.4A2.8 2.8 0 0 1 17 7.8V10m-10 0h10c.6 0 1 .4 1 1v2.5c0 2.485-2.015 4.5-4.5 4.5h-3C7.015 18 5 15.985 5 13.5V11c0-.6.4-1 1-1Z"/></svg>
              </div>
            </div>
          </div>
          <div className="card-hover bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm mb-2">Total de Tutores</p>
                <p className="text-3xl font-bold text-slate-900">{totalTutores}</p>
              </div>
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                {/* Users Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="text-white" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2m14-10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm6 10v-2a4 4 0 0 0-3-3.87M21 3a4 4 0 0 1 0 7.87"/></svg>
              </div>
            </div>
          </div>
        </div>
        {/* Próximas Consultas */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 mb-8">
          <h3 className="text-xl font-bold mb-4 text-slate-900">Próximas Consultas</h3>
          <div className="space-y-2 text-slate-600">
            <p className="text-center py-8">Nenhuma consulta agendada</p>
          </div>
        </div>
        {/* Agendamentos Pendentes & Notificações Recentes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="text-lg font-bold mb-4 text-slate-900">Agendamentos Pendentes</h3>
            <div className="space-y-2 text-sm">
              <p className="text-center py-6 text-slate-500">Nenhum pendente</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="text-lg font-bold mb-4 text-slate-900">Notificações Recentes</h3>
            <div className="space-y-2 text-sm">
              <p className="text-center py-6 text-slate-500">Nenhuma notificação</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}