'use client';

import { Bell, LogOut, User, X } from 'lucide-react';
import type { Veterinarian } from '../types/VetContext';

export type VetCareNotification = {
  id: string;
  message: string;
  type: 'cadastro' | 'edicao' | 'cancelamento';
};

type VetCareDashboardHeaderProps = {
  currentVet: Veterinarian;
  notificationsOpen: boolean;
  hasUnread: boolean;
  notifications: VetCareNotification[];
  onToggleNotifications: () => void;
  onClearNotifications: () => void;
  onLogout: () => void;
};

export default function VetCareDashboardHeader({
  currentVet,
  notificationsOpen,
  hasUnread,
  notifications,
  onToggleNotifications,
  onClearNotifications,
  onLogout,
}: VetCareDashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-sm shadow-sm">
      <div className="flex items-center gap-4">
        <img src="/LOGOVETCARE.png" alt="VetCare" className="w-12 h-12 object-cover rounded-full mix-blend-multiply" />
        <div>
          <h1 className="text-2xl font-bold text-primary">VetCare</h1>
          <p className="text-xs text-primary font-bold">Dashboard Profissional</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={onToggleNotifications}
            className="relative p-2 hover:bg-primary/10 text-slate-600 hover:text-primary rounded-xl transition-all"
          >
            <Bell className="w-5 h-5" />
            {hasUnread && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded-xl shadow-xl p-4 w-64 max-h-96 overflow-y-auto z-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <h4 className="text-sm font-semibold text-slate-700">Notificacoes</h4>
                </div>
                <button onClick={onClearNotifications} className="p-1 hover:bg-slate-100 rounded-full">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-500">Nenhuma notificacao</p>
              ) : (
                <div className="space-y-2">
                  {notifications.slice(-10).reverse().map((notif) => (
                    <div key={notif.id} className="bg-sage-50 text-xs text-slate-600 pb-2 border-b border-slate-200 last:border-0 rounded px-2 py-1">
                      <p className="line-clamp-2">{notif.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{currentVet.name}</p>
            <p className="text-xs text-slate-500">{currentVet.crmv}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

