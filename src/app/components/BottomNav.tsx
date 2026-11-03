import { Home, BookOpen, Users, MessageCircle, User } from 'lucide-react';
import type { PageType } from '../App';

interface BottomNavProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  unreadMessages?: number;
}

export function BottomNav({ currentPage, onNavigate, unreadMessages = 0 }: BottomNavProps) {
  const navItems = [
    { icon: Home, label: 'Home', page: 'home' as PageType },
    { icon: BookOpen, label: 'Study Session', page: 'study-session' as PageType },
    { icon: Users, label: 'Matchmaking', page: 'matchmaking' as PageType },
    { icon: MessageCircle, label: 'Chat', page: 'messages' as PageType },
    { icon: User, label: 'Profile', page: 'profile' as PageType },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 max-w-md mx-auto z-50 shadow-[0_-8px_40px_rgba(0,0,0,0.04)]">
      <div className="grid grid-cols-5 gap-1 px-4 py-4">
        {navItems.map((item) => {
          const studySessionPages = [
            'study-session', 'co-solve-lobby', 'public-workspace', 'private-workspace', 
            'results', 'activity-summary', 'session-complete', 'session-summary', 
            'session-reflection', 'consultation-instructor', 'consultation-student', 
            'consultation-reflection', 'consultation-chat-log'
          ];
          
          const isActive = item.page === 'study-session' 
            ? studySessionPages.includes(currentPage)
            : currentPage === item.page || 
              (item.page === 'home' && currentPage === 'home') ||
              (item.page === 'matchmaking' && (currentPage === 'matchmaking' || currentPage === 'view-all-requests')) ||
              (item.page === 'messages' && (currentPage === 'messages' || currentPage === 'chat'));
          
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.page)}
              aria-label={item.label}
              className={`
                flex flex-col items-center justify-center relative transition-all active:scale-95 group
                ${isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}
              `}
            >
              <div className="relative mb-1">
                <item.icon className={`w-6 h-6 transition-all duration-300 ${isActive ? 'stroke-[2.5px] drop-shadow-[0_0_8px_rgba(79,70,229,0.3)] scale-110' : 'stroke-2'}`} />
                {item.label === 'Chat' && unreadMessages > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white ring-2 ring-indigo-500/10">
                    {unreadMessages}
                  </span>
                )}
                {/* Active Indicator Bar Removed */}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
