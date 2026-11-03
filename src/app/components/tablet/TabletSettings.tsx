import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Moon } from 'lucide-react';
import type { PageType, UserData } from '../../App';

interface TabletSettingsProps {
  onNavigate: (page: PageType) => void;
  userData: UserData;
  onUpdateUser: (updates: Partial<UserData>) => void;
}

export function TabletSettings({ onNavigate, userData, onUpdateUser }: TabletSettingsProps) {
  const [settingsPage, setSettingsPage] = useState<'menu' | 'general' | 'terms' | 'privacy' | 'appearance'>('menu');
  const [search, setSearch] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const darkMode = userData.darkMode;

  const showToast = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 2500);
  };

  const handleToggle = (label: string, value: boolean, setter: (v: boolean) => void) => {
    setter(!value);
    showToast(`${label} ${!value ? 'Enabled' : 'Disabled'}`);
  };

  const setIsAccountPrivate = (val: boolean) => onUpdateUser({ isAccountPrivate: val });
  const setPushNotifications = (val: boolean) => onUpdateUser({ pushNotifications: val });
  const setEmailNotifications = (val: boolean) => onUpdateUser({ emailNotifications: val });
  const setAutoSave = (val: boolean) => onUpdateUser({ autoSave: val });
  const setDarkMode = (val: boolean) => onUpdateUser({ darkMode: val });

  if (settingsPage === 'general') {
    return (
      <div className={`h-full flex flex-col overflow-hidden ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
        {/* Notification Toast */}
        {showNotification && (
          <div className="absolute top-8 left-0 right-0 z-[1000] flex justify-center pointer-events-none px-4 animate-in slide-in-from-top-4 duration-500">
            <div className="bg-slate-900/95 text-white px-5 py-2 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.2)] border border-white/10 flex items-center gap-2.5 backdrop-blur-xl">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-[10px] font-black tracking-[.2em] uppercase">
                {notificationMessage}
              </span>
            </div>
          </div>
        )}

        <div className={`backdrop-blur-xl border-b-2 py-6 px-8 flex items-center justify-between sticky top-0 z-20 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
          <button 
            onClick={() => setSettingsPage('menu')}
            className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all active:scale-95 shadow-sm group ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
          >
            <ChevronLeft size={20} className={`${darkMode ? 'text-white' : 'text-slate-900'} group-hover:text-indigo-400 transition-colors`} />
          </button>
          <h1 className={`text-[10px] font-black uppercase tracking-[.4em] ${darkMode ? 'text-white' : 'text-slate-900'}`}>General</h1>
          <div className="w-10"></div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-6 space-y-4">
            {[
              { label: 'Push Notifications', value: userData.pushNotifications, setter: setPushNotifications },
              { label: 'Email Notifications', value: userData.emailNotifications, setter: setEmailNotifications },
              { label: 'Auto-Save', value: userData.autoSave, setter: setAutoSave }
            ].map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => handleToggle(item.label, item.value, item.setter)}
                className={`flex items-center justify-between p-6 border-2 rounded-[2rem] shadow-sm group transition-all cursor-pointer active:scale-[0.98] ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-indigo-500' : 'bg-white border-slate-100 hover:border-indigo-100'}`}
              >
                <span className={`text-[11px] font-black uppercase tracking-widest group-hover:text-indigo-400 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.label}</span>
                <div className={`w-12 h-6 rounded-full transition-all relative ${item.value ? 'bg-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-700'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.value ? 'left-7' : 'left-1'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (settingsPage === 'privacy') {
    return (
      <div className={`h-full flex flex-col overflow-hidden ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
        {/* Notification Toast */}
        {showNotification && (
          <div className="absolute top-8 left-0 right-0 z-[1000] flex justify-center pointer-events-none px-4 animate-in slide-in-from-top-4 duration-500">
            <div className="bg-slate-900/95 text-white px-5 py-2 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.2)] border border-white/10 flex items-center gap-2.5 backdrop-blur-xl">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-[10px] font-black tracking-[.2em] uppercase">
                {notificationMessage}
              </span>
            </div>
          </div>
        )}

        <div className={`backdrop-blur-xl border-b-2 py-6 px-8 flex items-center justify-between sticky top-0 z-20 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
          <button 
            onClick={() => setSettingsPage('menu')}
            className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all active:scale-95 shadow-sm group ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
          >
            <ChevronLeft size={20} className={`${darkMode ? 'text-white' : 'text-slate-900'} group-hover:text-indigo-400 transition-colors`} />
          </button>
          <h1 className={`text-[10px] font-black uppercase tracking-[.4em] ${darkMode ? 'text-white' : 'text-slate-900'}`}>Privacy</h1>
          <div className="w-10"></div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-6">
            <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ml-1 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>Account Privacy</p>
            <div 
              onClick={() => handleToggle('Private Account', userData.isAccountPrivate, setIsAccountPrivate)}
              className={`flex items-center justify-between p-6 border-2 rounded-[2rem] shadow-sm transition-all group cursor-pointer active:scale-[0.98] ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-indigo-500' : 'bg-white border-slate-100 hover:border-indigo-100'}`}
            >
              <div className="flex flex-col">
                <span className={`text-[11px] font-black uppercase tracking-widest group-hover:text-indigo-400 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>Private Account</span>
                <span className={`text-[9px] font-black uppercase tracking-tighter mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{userData.isAccountPrivate ? 'Your account is private' : 'Your account is public'}</span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-all relative ${userData.isAccountPrivate ? 'bg-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-700'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${userData.isAccountPrivate ? 'left-7' : 'left-1'}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (settingsPage === 'terms') {
    return (
      <div className={`h-full flex flex-col overflow-hidden ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
        <div className={`backdrop-blur-xl border-b-2 py-6 px-8 flex items-center justify-between sticky top-0 z-20 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
          <button 
            onClick={() => setSettingsPage('menu')}
            className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all active:scale-95 shadow-sm group ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
          >
            <ChevronLeft size={20} className={`${darkMode ? 'text-white' : 'text-slate-900'} group-hover:text-indigo-400 transition-colors`} />
          </button>
          <h1 className={`text-[10px] font-black uppercase tracking-[.4em] ${darkMode ? 'text-white' : 'text-slate-900'}`}>Terms & Agreements</h1>
          <div className="w-10"></div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-8 space-y-8 pb-20">
            {[
              { title: '1. Acceptance of Terms', text: 'By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.' },
              { title: '2. Use of Service', text: 'You agree to use the service only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else\'s use and enjoyment of the service.' },
              { title: '3. User Responsibilities', text: 'You are responsible for maintaining the confidentiality of your account and password and for restricting access to your device.' },
              { title: '4. Content', text: 'All content provided on this service is for informational purposes only. We make no representations as to accuracy, completeness, or validity of any information.' },
              { title: '5. Changes to Terms', text: 'We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new terms on this page.' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-3 group text-left">
                <h2 className={`font-semibold text-xl font-black uppercase tracking-widest transition-colors ${darkMode ? 'text-indigo-400 group-hover:text-white' : 'text-indigo-600 group-hover:text-slate-900'}`}>{item.title}</h2>
                <p className={`text-md font-black leading-relaxed ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (settingsPage === 'appearance') {
    return (
      <div className={`h-full flex flex-col overflow-hidden ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
        {/* Notification Toast */}
        {showNotification && (
          <div className="absolute top-8 left-0 right-0 z-[1000] flex justify-center pointer-events-none px-4 animate-in slide-in-from-top-4 duration-500">
            <div className="bg-slate-900/95 text-white px-5 py-2 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.2)] border border-white/10 flex items-center gap-2.5 backdrop-blur-xl">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-[10px] font-black tracking-[.2em] uppercase">
                {notificationMessage}
              </span>
            </div>
          </div>
        )}

        <div className={`backdrop-blur-xl border-b-2 py-6 px-8 flex items-center justify-between sticky top-0 z-20 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
          <button 
            onClick={() => setSettingsPage('menu')}
            className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all active:scale-95 shadow-sm group ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
          >
            <ChevronLeft size={20} className={`${darkMode ? 'text-white' : 'text-slate-900'} group-hover:text-indigo-400 transition-colors`} />
          </button>
          <h1 className={`text-[10px] font-black uppercase tracking-[.4em] ${darkMode ? 'text-white' : 'text-slate-900'}`}>Appearance</h1>
          <div className="w-10"></div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-6 space-y-4">
            {[
              { label: 'Dark Mode', value: userData.darkMode, setter: setDarkMode }
            ].map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => handleToggle(item.label, item.value, item.setter)}
                className={`flex items-center justify-between p-6 border-2 rounded-[2rem] shadow-sm group transition-all cursor-pointer active:scale-[0.98] ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-indigo-500' : 'bg-white border-slate-100 hover:border-indigo-100'}`}
              >
                <span className={`text-[11px] font-black uppercase tracking-widest group-hover:text-indigo-400 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.label}</span>
                <div className={`w-12 h-6 rounded-full transition-all relative ${item.value ? 'bg-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-700'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.value ? 'left-7' : 'left-1'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    {label: 'General', value: 'general'},
    {label: 'Terms & Agreements', value: 'terms'},
    {label: 'Privacy', value: 'privacy'},
    {label: 'Appearance', value: 'appearance'},
  ].filter(item => item.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={`h-full flex flex-col overflow-hidden ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
      <div className={`backdrop-blur-xl border-b-2 py-6 px-8 flex items-center justify-between sticky top-0 z-20 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
        <button 
          onClick={() => onNavigate('profile')}
          className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all active:scale-95 shadow-sm group ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
        >
          <ChevronLeft size={20} className={`${darkMode ? 'text-white' : 'text-slate-900'} group-hover:text-indigo-400 transition-colors`} />
        </button>
        <h1 className={`text-[10px] font-black uppercase tracking-[.4em] ${darkMode ? 'text-white' : 'text-slate-900'}`}>Settings</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="p-8 pb-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-12 pr-6 py-4 border-2 rounded-[1.5rem] text-sm font-black focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all outline-none placeholder:text-gray-300 shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-100 text-gray-800 focus:border-indigo-100'}`} 
                placeholder="Search settings..." 
              />
            </div>
          </div>

          <div className="pb-8">
            {menuItems.map((item, idx) => (
              <button 
                key={item.value} 
                onClick={() => setSettingsPage(item.value as any)} 
                className={`w-full px-8 py-6 flex items-center justify-between border-b-2 transition-all hover:pl-10 group active:bg-indigo-50/10 ${darkMode ? 'border-slate-800 hover:bg-slate-800/50' : 'border-slate-50 hover:bg-slate-50/50'}`}
              >
                <span className={`text-[11px] font-black uppercase tracking-[.25em] group-hover:text-indigo-400 transition-colors ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{item.label}</span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
            
            {menuItems.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No settings found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
