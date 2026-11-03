import React from 'react';
import { TopBar } from './TopBar';
import { AIPromo } from './AIPromo';
import { ProgressTracker } from './ProgressTracker';
import { FriendCalendar } from './FriendCalendar';
import type { PageType, CalendarEvent } from '../../App';

interface HomeProps {
  onNavigate: (page: PageType) => void;
  events: CalendarEvent[];
  hasUnread?: boolean;
  darkMode?: boolean;
}

export function Home({ onNavigate, events, hasUnread, darkMode = false }: HomeProps) {
  return (
    <div className={`h-full min-h-0 flex flex-col ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <TopBar onNavigate={onNavigate} hasUnread={hasUnread} darkMode={darkMode} />
      
      <main className="flex-1 min-h-0 overflow-y-auto px-6 py-8 space-y-8 pb-32">
        {/* Greeting Section with soft background */}
        <div className={`relative p-8 rounded-[2.5rem] border overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500 ${darkMode ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-50/50 border-indigo-200/60'}`}>
          <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl ${darkMode ? 'bg-indigo-500/10' : 'bg-indigo-500/5'}`}></div>
          <div className="relative z-10">
            <h1 className={`text-3xl font-extrabold tracking-tight leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Good afternoon, James!</h1>
            <p className={`font-medium mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Ready for some study matching?</p>
          </div>
        </div>

        {/* AI Feature Promo */}
        <AIPromo onNavigate={onNavigate} darkMode={darkMode} />

        {/* Progress Tracker */}
        <ProgressTracker onNavigate={onNavigate} darkMode={darkMode} />

        {/* Calendar */}
        <FriendCalendar onNavigate={onNavigate} events={events} darkMode={darkMode} />
      </main>
    </div>
  );
}
