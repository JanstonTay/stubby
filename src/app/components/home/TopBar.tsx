import { Search, Bell, User } from 'lucide-react';
import type { PageType } from '../../App';

interface TopBarProps {
  onNavigate?: (page: PageType) => void;
  hasUnread?: boolean;
  darkMode?: boolean;
}

export function TopBar({ onNavigate, hasUnread, darkMode = false }: TopBarProps) {
  return (
    <header className={`sticky top-0 z-40 px-6 py-5 backdrop-blur-xl border-b flex items-center justify-between ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
      <div className="flex items-center gap-2">
        <h1 className={`text-xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-slate-900'}`}>Stubby</h1>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => onNavigate?.('search-overlay')}
          aria-label="Search"
          className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all hover:shadow-premium group ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-slate-50 border-slate-100 hover:bg-white'}`}
        >
          <Search className={`transition-colors ${darkMode ? 'text-slate-400 group-hover:text-indigo-400' : 'text-slate-600 group-hover:text-indigo-600'}`} size={20} />
        </button>
        <button 
          onClick={() => onNavigate?.('notifications')}
          aria-label="Notifications"
          className={`relative w-10 h-10 rounded-2xl flex items-center justify-center border transition-all hover:shadow-premium group ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-slate-50 border-slate-100 hover:bg-white'}`}
        >
          <Bell className={`transition-colors ${darkMode ? 'text-slate-400 group-hover:text-indigo-400' : 'text-slate-600 group-hover:text-indigo-600'}`} size={20} />
          {hasUnread && <span className={`absolute top-2 right-2.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 animate-pulse ${darkMode ? 'border-slate-900' : 'border-white'} ring-4 ring-indigo-500/5`}></span>}
        </button>
      </div>
    </header>
  );
}
