import { ChevronLeft, Send, Sparkles, Music, FileText, Video, Clock, ArrowUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useState } from 'react';
import type { PageType } from '../../App';

interface AIChatbotProps {
  onNavigate: (page: PageType) => void;
}

export function AIChatbot({ onNavigate }: AIChatbotProps) {
  const [query, setQuery] = useState('Explain JavaScript arrays for my FOP revision');
  const [assistantRole, setAssistantRole] = useState('Programming tutor for Diploma in IT students');

  const recentSearches = [
    { id: 1, title: 'Javascript Array', time: '5h ago' },
    { id: 2, title: 'Looping over Javascript', time: '10h ago' },
    { id: 3, title: 'Tips for Essay', time: '1d ago', isYesterday: true }
  ];

  const handleSearch = () => {
    if (query.trim()) {
      onNavigate('search-result', query);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Header */}
      <header className="px-6 py-5 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
        <button 
          onClick={() => onNavigate('home')}
          aria-label="Back"
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
        >
          <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
        </button>
        <div className="flex items-center justify-center gap-3">
          {/* <Sparkles size={18} className="text-indigo-600" /> */}
          <h1 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em]">Stubby AI</h1>
        </div>
        <div className="w-10"></div>
      </header>

      <div className="flex flex-col flex-1">
        {/* Sidebar Removed */}

        {/* Main Content Area */}
        <main className="flex-1 p-6 space-y-8 overflow-auto max-w-2xl mx-auto w-full pb-24">
             {/* Role Input */}
             <div className="space-y-3 px-2">
                <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Assistant Role</label>
                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg">Customizable</span>
                </div>
                <div className="relative group">
                    <Input 
                        className="h-12 rounded-2xl border-2 border-slate-100 px-5 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white transition-all outline-none" 
                        placeholder="e.g., UI/UX Designer, Researcher, Coder..." 
                        value={assistantRole}
                        onChange={(e) => setAssistantRole(e.target.value)}
                    />
                </div>
                <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">Tailors the AI's answering style based on your academic field.</p>
             </div>

             {/* Stubby AI Main Section */}
             <div className="text-center space-y-4 pt-4">
                <div className="w-20 h-20 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-100 mb-6 animate-pulse">
                    <Sparkles size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">How can I help you?</h2>
                <div className="relative max-w-sm mx-auto group">
                    <Input 
                        className="h-16 rounded-[2rem] border-2 border-slate-200 px-8 text-center text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white transition-all outline-none" 
                        placeholder="Search for study notes, labs..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button 
                        onClick={handleSearch}
                        aria-label="Search"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer active:scale-90"
                    >
                        <ArrowUp size={20} />
                    </button>
                </div>
             </div>

             {/* Action Grid */}
             <div className="grid grid-cols-3 gap-4 px-2">
                <button 
                    onClick={() => onNavigate('upload-audio')}
                    className="flex flex-col items-center gap-3 p-6 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 hover:bg-white hover:shadow-premium transition-all group active:scale-95"
                >
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                        <Music size={20} />
                    </div>
                    <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Audio</span>
                </button>
                <button 
                    onClick={() => onNavigate('upload-document')}
                    className="flex flex-col items-center gap-3 p-6 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 hover:bg-white hover:shadow-premium transition-all group active:scale-95"
                >
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                        <FileText size={20} />
                    </div>
                    <span className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">Doc</span>
                </button>
                <button 
                    onClick={() => onNavigate('upload-video')}
                    className="flex flex-col items-center gap-3 p-6 bg-rose-50 rounded-[2.5rem] border border-rose-100 hover:bg-white hover:shadow-premium transition-all group active:scale-95"
                >
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-600 shadow-sm group-hover:scale-110 transition-transform">
                        <Video size={20} />
                    </div>
                    <span className="text-[10px] font-black text-rose-900 uppercase tracking-widest">Video</span>
                </button>
             </div>

             {/* Recent Searches */}
             <div className="space-y-6">
                <div className="flex items-center gap-2 px-1">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">History</span>
                </div>

                <div className="space-y-3">
                    <p className="text-[10px] font-black text-indigo-600 bg-indigo-50 w-fit px-3 py-1 rounded-full uppercase tracking-wider">Today</p>
                    {recentSearches.filter(s => !s.isYesterday).map(s => (
                        <div 
                            key={s.id} 
                            className="bg-white border border-slate-100 p-5 rounded-3xl flex justify-between items-center shadow-sm cursor-pointer hover:border-indigo-100 hover:shadow-premium transition-all group active:scale-[0.99]"
                            onClick={() => onNavigate('search-result', s.title)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <Sparkles size={18} />
                                </div>
                                <span className="text-sm font-bold text-slate-900">{s.title}</span>
                            </div>
                            <span className="text-[11px] font-medium text-slate-300 group-hover:text-slate-400">{s.time}</span>
                        </div>
                    ))}
                    
                    <p className="text-[10px] font-black text-slate-400 bg-slate-100 w-fit px-3 py-1 rounded-full mt-6 uppercase tracking-wider">Yesterday</p>
                    {recentSearches.filter(s => s.isYesterday).map(s => (
                        <div 
                            key={s.id} 
                            className="bg-white border border-slate-100 p-5 rounded-3xl flex justify-between items-center shadow-sm cursor-pointer hover:border-indigo-100 hover:shadow-premium transition-all group active:scale-[0.99]"
                            onClick={() => onNavigate('search-result', s.title)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <Sparkles size={18} />
                                </div>
                                <span className="text-sm font-bold text-slate-900">{s.title}</span>
                            </div>
                            <span className="text-[11px] font-medium text-slate-300 group-hover:text-slate-400">{s.time}</span>
                        </div>
                    ))}
                </div>
             </div>
          </main>
          </div>
    </div>
  );
}
