import { ArrowLeft, Bell, Check, Clock, X, Calendar as CalendarIcon, User as UserIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import React, { useState } from 'react';
import type { PageType } from '../../App';

interface NotificationsPanelProps {
  onNavigate: (page: PageType, data?: any) => void;
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  darkMode?: boolean;
}

export function NotificationsPanel({ onNavigate, notifications, setNotifications, darkMode = false }: NotificationsPanelProps) {
  // Mapper for icons since state in App.tsx can't easily store functional components without serialization warnings sometimes, 
  // but simpler to mapping by ID or type here.
  const getIcon = (type: string) => {
      switch(type) {
          case 'error': return X;
          case 'success': return Check;
          default: return Clock;
      }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const hasUnread = notifications.some(n => !n.isRead);

  return (
    <div className="min-h-screen bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-start p-6 animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 z-0" 
        onClick={() => onNavigate('home')}
      ></div>

      <div className={`w-full max-w-sm rounded-[2.5rem] shadow-premium border overflow-hidden relative z-10 animate-in slide-in-from-top-4 duration-500 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <header className={`px-6 py-5 border-b flex items-center justify-between ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
          <div className="flex items-center gap-2">
            <h2 className={`text-[11px] font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-slate-900'}`}>Notifications</h2>
            {hasUnread && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></div>}
          </div>
          <button 
            onClick={() => onNavigate('home')}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors shadow-sm ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-900'}`}
          >
            <X size={14} />
          </button>
        </header>

        <div className="p-6 space-y-4">
          {notifications.map((notif) => {
            const IconComponent = getIcon(notif.type);
            return (
            <div 
              key={notif.id}
              onClick={() => {
                setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
                if (notif.navTarget) {
                    onNavigate(notif.navTarget as PageType, notif.navData);
                }
              }}
              className={`group relative rounded-2xl p-4 border transition-all cursor-pointer active:scale-[0.98] ${
                darkMode 
                  ? (notif.isRead ? 'bg-slate-900 border-slate-700 opacity-60' : 'bg-slate-900 border-indigo-500/50 shadow-sm')
                  : (notif.isRead ? 'bg-white border-slate-100 opacity-60' : 'bg-white border-indigo-100 shadow-sm')
              }`}
            >
              {!notif.isRead && (
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.4)]"></div>
              )}
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl ${notif.color} border flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                  <IconComponent size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{notif.title}</h3>
                  {notif.date && (
                    <div className={`flex items-center gap-1.5 mb-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      <CalendarIcon size={10} className="text-slate-400" />
                      <p className="text-[11px] font-bold">{notif.date}</p>
                    </div>
                  )}
                  {notif.person && (
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <UserIcon size={10} />
                      <p className="text-[10px] font-medium">{notif.person}</p>
                    </div>
                  )}
                  {notif.message && (
                    <p className={`text-[11px] font-medium leading-relaxed mt-1 line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {notif.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            );
          })}

          {notifications.length === 0 && (
            <div className="py-12 text-center space-y-3">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <Bell className="text-slate-300 w-8 h-8" />
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">All caught up!</p>
            </div>
          )}

          {hasUnread && (
            <Button 
              variant="ghost" 
              onClick={markAllAsRead}
              className={`w-full h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors ${darkMode ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-400 hover:text-indigo-600'}`}
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}