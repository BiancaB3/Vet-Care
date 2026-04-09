'use client';
import { useAuth } from '../context/AuthContext';

export default function PageHeader({ title }: { title: string }) {
  const { user } = useAuth();
  const initials = user?.nome ? user.nome.charAt(0).toUpperCase() : 'V';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
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
  );
}
