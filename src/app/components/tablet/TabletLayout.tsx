import React, { ReactNode, useState } from 'react';
import { Home, Users, MessageCircle, User, Calendar, Bell, Settings, Search, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { PageType } from '../../App';

interface TabletLayoutProps {
  children: ReactNode;
  currentPage: PageType;
  onNavigate: (page: PageType, data?: any) => void;
  hasUnreadMessages?: boolean;
  hasUnreadNotifications?: boolean;
  unreadCount?: number;
  userName?: string;
  darkMode?: boolean;
}

export function TabletLayout({
  children,
  currentPage,
  onNavigate,
  hasUnreadMessages = false,
  hasUnreadNotifications = false,
  unreadCount = 0,
  userName = "James Chow",
  darkMode = false
}: TabletLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home', page: 'home' as PageType },
    { id: 'study', icon: BookOpen, label: 'Study Session', page: 'study-session' as PageType },
    { id: 'matchmaking', icon: Users, label: 'Matchmaking', page: 'matchmaking' as PageType },
    { id: 'messages', icon: MessageCircle, label: 'Chat', page: 'messages' as PageType, badge: unreadCount },
    { id: 'calendar', icon: Calendar, label: 'Calendar', page: 'calendar-page' as PageType },
  ];

  const isActive = (pageId: string) => {
    const pageMap: Record<string, PageType[]> = {
      'home': ['home', 'ai-chatbot', 'progress-tracker', 'search-overlay', 'search-result', 'upload-audio', 'upload-document', 'upload-video'],
      'matchmaking': ['matchmaking', 'preferences', 'modules-difficulty', 'mode-availability', 'auto-match', 'match-profile', 'send-request', 'match-status', 'request-detail', 'view-all-requests'],
      'messages': ['messages', 'chat', 'call', 'shared-notes', 'study-planner', 'community-events'],
      'calendar': ['calendar-page', 'event-details', 'edit-event', 'event-comments'],
      'study': ['study-session', 'co-solve-lobby', 'public-workspace', 'private-workspace', 'results', 'activity-summary', 'session-complete', 'session-summary', 'session-reflection', 'consultation-instructor', 'consultation-student', 'consultation-reflection', 'consultation-chat', 'consultation-chat-log'],
      'profile': ['profile'],
    };
    
    return pageMap[pageId]?.includes(currentPage) || false;
  };

  return (
    <div className={`flex h-full overflow-hidden relative ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Left Sidebar Navigation */}
      <aside className={`border-r flex flex-col transition-all duration-300 ${
        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      } ${
        isSidebarOpen ? 'w-72' : 'w-0 border-r-0'
      }`}>
        <div className={`${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300 flex flex-col h-full`}>
          {/* User Info */}
          <div className={`p-6 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <button
              onClick={() => onNavigate('profile')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors group relative ${
                darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                {userName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 text-left">
                <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>{userName}</p>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>View Profile</p>
              </div>
              {/* Toggle Button */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSidebarOpen(false);
                }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                  darkMode ? 'hover:bg-slate-600' : 'hover:bg-slate-100'
                }`}
              >
                <ChevronLeft className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`} />
              </div>
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.page)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive(item.id)
                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                    : darkMode 
                      ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <Badge className="bg-red-500 text-white px-2 py-0.5 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className={`p-4 border-t space-y-1 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <button
              onClick={() => onNavigate('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
                darkMode ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span className="flex-1 text-left">Notifications</span>
              {hasUnreadNotifications && (
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                darkMode ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="flex-1 text-left">Settings</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar Toggle Button (when closed) */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-50 border rounded-r-lg px-1.5 py-3 shadow-lg transition-all ${
            darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`} />
        </button>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}