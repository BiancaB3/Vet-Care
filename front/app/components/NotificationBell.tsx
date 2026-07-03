'use client';

import { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { clearNotifications } from '../redux/slices/notificationsSlice';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications.items);
  const hasUnread = notifications.length > 0;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 hover:bg-secondary text-white rounded-xl transition-all"
      >
        <Bell className="w-5 h-5" />
        {hasUnread && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded-xl shadow-xl p-4 w-64 max-h-96 overflow-y-auto z-50 text-slate-900">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <h4 className="text-sm font-semibold text-slate-700">Notificações</h4>
            </div>
            <button
              onClick={() => {
                dispatch(clearNotifications());
                setOpen(false);
              }}
              className="p-1 hover:bg-slate-100 rounded-full"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          {notifications.length === 0 ? (
            <p className="text-xs text-slate-500">Nenhuma notificação</p>
          ) : (
            <div className="space-y-2">
              {notifications
                .slice(-10)
                .reverse()
                .map((notif) => (
                  <div
                    key={notif.id}
                    className="text-xs text-slate-600 pb-2 border-b border-slate-200 last:border-0 rounded px-2 py-1"
                  >
                    <p className="line-clamp-2">{notif.message}</p>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
