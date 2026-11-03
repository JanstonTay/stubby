import { useState } from 'react';
import { Clock, Users, Target, Sparkles, UserPlus, Check, ChevronLeft } from 'lucide-react';
import type { PageType } from '../../App';

interface SessionSummaryProps {
  onNavigate: (page: PageType) => void;
}

export function SessionSummary({ onNavigate }: SessionSummaryProps) {
  const [friendRequests, setFriendRequests] = useState<Record<string, boolean>>({});

  const participants = [
    { id: '1', name: 'You', avatar: '👤', progress: 60 },
    { id: '2', name: 'Alex', avatar: '👨', progress: 75 },
    { id: '3', name: 'Sam', avatar: '👩', progress: 45 },
  ];

  const handleAddFriend = (id: string) => {
    setFriendRequests(prev => ({ ...prev, [id]: true }));
  };

  const groupCompletionAvg = Math.round(
    participants.reduce((sum, p) => sum + p.progress, 0) / participants.length
  );

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b-2 border-slate-100 py-6 px-6 flex items-center justify-between sticky top-0 z-20">
          <button 
            onClick={() => onNavigate('session-complete')}
            className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
          >
              <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
          </button>
          <h1 className="text-[10px] font-black uppercase tracking-[.4em] text-slate-900">Team Analysis</h1>
          <div className="w-10"></div>
      </div>

      <div className="flex-1 px-6 flex flex-col gap-6 pt-6 pb-24 overflow-auto">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border-2 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)]">
                <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-[10px] font-black uppercase text-gray-500">Duration</span>
                </div>
                <p className="text-xl font-black text-gray-900">1h 20m</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border-2 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)]">
                <div className="flex items-center gap-2 mb-2">
                    <Users size={16} className="text-gray-400" />
                    <span className="text-[10px] font-black uppercase text-gray-500">Squad Size</span>
                </div>
                <p className="text-xl font-black text-gray-900">3 Members</p>
            </div>
        </div>

        {/* Global Progress */}
        <div className="bg-white p-6 rounded-3xl border-2 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)]">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Group Synergy Level</p>
            <div className="flex items-end justify-between mb-3">
                <h3 className="text-2xl font-black uppercase text-gray-900">{groupCompletionAvg}%</h3>
                <span className="text-[10px] font-bold text-gray-400 pb-1">Efficiency Rating</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full border-2 border-indigo-900 overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-gray-900 to-black transition-all duration-1000"
                    style={{ width: `${groupCompletionAvg}%` }}
                />
            </div>
        </div>

        {/* AI Insight */}
        <div className="bg-indigo-900 text-white p-6 rounded-3xl border-2 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)] relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
                <Sparkles size={20} className="text-indigo-300" />
                <h3 className="text-sm font-black uppercase tracking-tight">AI Group Verdict</h3>
            </div>
            <div className="space-y-4">
                <div className="relative pl-4 border-l-2 border-indigo-500">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Collaborative Lift</p>
                    <p className="text-xs font-bold leading-relaxed text-indigo-50">Teamwork increased individual progress by roughly 12% compared to solo averages.</p>
                </div>
                <div className="relative pl-4 border-l-2 border-indigo-500">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Peak Sync</p>
                    <p className="text-xs font-bold leading-relaxed text-indigo-50">Highest concentration recorded during the co-solving phase (Min 30-55).</p>
                </div>
            </div>
        </div>

        {/* Members List */}
        <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Team Efficiency</p>
            {participants.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-3xl border-2 border-indigo-900 shadow-[2px_2px_0px_0px_rgba(67,56,202,0.3)]">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 border-2 border-indigo-900 flex items-center justify-center text-xl">
                            {p.avatar}
                        </div>
                        <div className="flex-1">
                            <p className="font-black text-gray-900 uppercase text-xs">{p.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.progress}% Complete</p>
                        </div>
                        {p.id !== '1' && (
                            <button 
                                onClick={() => handleAddFriend(p.id)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border-2 shadow-[2px_2px_0px_0px_rgba(67,56,202,0.3)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 ${
                                    friendRequests[p.id] ? 'bg-green-500 border-gray-900 text-white' : 'bg-white border-gray-900 text-gray-900'
                                }`}
                            >
                                {friendRequests[p.id] ? <Check size={18} /> : <UserPlus size={18} />}
                            </button>
                        )}
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden border">
                        <div 
                            className="h-full bg-gray-900 transition-all duration-1000"
                            style={{ width: `${p.progress}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="w-full py-4 mt-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 bg-indigo-600 text-white hover:bg-indigo-700 shadow-[4px_4px_0px_0px_rgba(79,70,229,0.3)]"
        >
          Exit to Dashboard
        </button>
      </div>
    </div>
  );
}
