import { ArrowLeft, Search, Mic, Clock, Calendar, X, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useState } from 'react';
import type { PageType } from '../../App';

interface SearchPanelProps {
  onNavigate: (page: PageType) => void;
}

export function SearchPanel({ onNavigate }: SearchPanelProps) {
  const [recentSearches, setRecentSearches] = useState([
    'Mock Exam Prep',
    'Campus Events',
    'FOP Assignment',
    'Sarah Johnson'
  ]);
  const [searchValue, setSearchValue] = useState("");
  const [showAudioModal, setShowAudioModal] = useState(false);

  const trendingTopics = [
    'Javascript Array',
    'Python Algorithms',
    'Web Dev Portfolio',
  ];

  const clearRecent = () => setRecentSearches([]);

  const handleSearch = (query: string) => {
    onNavigate('search-result', query);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col animate-in slide-in-from-bottom duration-500 relative">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-5 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('home')}
            aria-label="Back"
            className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center transition-all hover:bg-white hover:shadow-premium active:scale-95 group"
          >
            <ArrowLeft size={18} className="text-slate-600 group-hover:text-indigo-600 transition-colors" />
          </button>
          
          <div className="flex-1 relative group bg-slate-50 rounded-[1.25rem]">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Search className="w-5 h-5" />
            </div>
            <input 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-12 pr-11 h-12 bg-transparent border-transparent text-sm font-extrabold text-slate-900 placeholder:text-slate-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/10 border rounded-[1.25rem]"
              placeholder="Search study groups, partners..."
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchValue)}
            />
            <button 
              aria-label="Voice Search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors active:scale-90"
              onClick={() => setShowAudioModal(true)}
            >
              <Mic size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 space-y-10 overflow-auto pb-32">
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Recent Searches</h2>
              <button 
                onClick={clearRecent}
                className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors"
              >
                Clear
              </button>
            </div>
            
            <div className="space-y-2">
              {recentSearches.map((search, i) => (
                <button 
                   key={i}
                   onClick={() => handleSearch(search)}
                   className="w-full bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                      <Clock size={14} />
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{search}</span>
                  </div>
                  <div onClick={(e) => { e.stopPropagation(); setRecentSearches(s => s.filter((_, idx) => idx !== i)); }}>
                    <X size={12} className="text-slate-300 hover:text-rose-500 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trending */}
        <div className="space-y-4">
          <div className="px-1">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Trending Now</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic, i) => (
              <button 
                 key={i}
                 onClick={() => handleSearch(topic)}
                 className="px-5 py-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black flex items-center gap-2 hover:bg-indigo-100 transition-all active:scale-95"
              >
                <TrendingUp size={14} />
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Categories Mockup (Hidden by user) */}
      </main>

      {/* Audio Modal */}
      {showAudioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-[280px] bg-white rounded-[3rem] p-8 flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-indigo-600/20 rounded-full animate-ping scale-150"></div>
                    <div className="relative w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                        <Mic size={32} />
                    </div>
                </div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Listening...</h3>
                <p className="text-xs font-medium text-slate-400 mb-8">Speak now to search by audio</p>
                
                <button 
                    onClick={() => setShowAudioModal(false)}
                    className="w-full h-14 bg-slate-100 rounded-2xl text-[11px] font-black text-slate-900 uppercase tracking-widest hover:bg-slate-200 transition-colors active:scale-95"
                >
                    Cancel
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
