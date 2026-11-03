import { Clock, ClipboardCheck, FileText, Gauge, Coffee, BarChart3, ArrowRight } from 'lucide-react';
import type { PageType, AppState } from '../../App';

interface SessionCompleteProps {
  onNavigate: (page: PageType) => void;
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function SessionComplete({ onNavigate, state, updateState }: SessionCompleteProps) {
  const productivity = { text: 'High Productivity', color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-300' };
  const focusPercentage = 75;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-8 bg-black text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[80px]"></div>
        </div>
        
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 relative z-10">Session Done!</h1>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] relative z-10">Nov 14, 2024 • 14:00 - 15:30</p>
      </div>

      <div className="flex-1 px-6 flex flex-col gap-6 pt-6 pb-24 overflow-auto">
        {/* Productivity Score */}
        <div className="p-8 rounded-3xl border-2 border-green-400 shadow-[4px_4px_0px_0px_rgba(34,197,94,0.3)] bg-gradient-to-br from-green-100 to-green-200 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Performance Rank</p>
            <h2 className="text-3xl font-black uppercase tracking-tight text-green-600">High Productivity</h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border-2 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)]">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-3 border-2 border-blue-200">
                    <Clock size={20} className="text-blue-600" />
                </div>
                <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Focus Time</p>
                <p className="text-2xl font-black text-gray-900 tabular-nums">{formatTime(state.sessionDuration)}</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border-2 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)]">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mb-3 border-2 border-amber-200">
                    <Coffee size={20} className="text-amber-500" />
                </div>
                <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Break Time</p>
                <p className="text-2xl font-black text-gray-900 tabular-nums">05:00</p>
            </div>
        </div>

        {/* Achievement Card */}
        <div className="bg-white p-6 rounded-3xl border-2 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)]">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center flex-shrink-0 border-2 border-green-200">
                    <ClipboardCheck size={28} className="text-green-600" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase text-gray-400">Micro-Goal Reached</p>
                    <p className="text-sm font-black text-gray-900 uppercase">Tutorial Q1–Q3 Resolved</p>
                </div>
            </div>
            {/* Progress Visualization */}
            <div className="space-y-2">
                <div className="flex justify-between items-end">
                    <p className="text-[9px] font-black uppercase text-gray-400">Consistency Score</p>
                    <p className="text-sm font-black text-gray-900">{focusPercentage}%</p>
                </div>
                <div className="h-4 bg-gray-100 rounded-full border-2 border-gray-200 overflow-hidden relative">
                    <div 
                        className="h-full bg-gradient-to-r from-gray-700 to-gray-900 transition-all duration-1000"
                        style={{ width: `${focusPercentage}%` }}
                    />
                </div>
            </div>
        </div>

        {/* Navigation Actions */}
        <div className="space-y-3">
          <button
            onClick={() => onNavigate('session-summary')}
            className="w-full h-20 bg-white border-2 border-indigo-900 rounded-3xl flex items-center justify-between px-6 transition-all active:scale-95 group hover:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center border text-gray-900 group-hover:bg-white transition-colors">
                    <FileText size={22} />
                </div>
                <div className="text-left">
                    <span className="block font-black uppercase tracking-tight text-xs">Analytics Report</span>
                    <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest">Full breakdown of performance</span>
                </div>
            </div>
            <ArrowRight size={20} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
          </button>
          
          <button
            onClick={() => onNavigate('session-reflection')}
            className="w-full h-20 bg-white border-2 border-indigo-900 rounded-3xl flex items-center justify-between px-6 transition-all active:scale-95 group hover:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center border text-gray-900 group-hover:bg-white transition-colors">
                    <Gauge size={22} />
                </div>
                <div className="text-left">
                    <span className="block font-black uppercase tracking-tight text-xs">Learning Reflection</span>
                    <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest">Note down what you learned</span>
                </div>
            </div>
            <ArrowRight size={20} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
          </button>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-4 mt-auto mb-8">
            <button
                onClick={() => onNavigate('home')}
                className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 hover:bg-indigo-700"
            >
                Back to Dashboard
            </button>
            <button
                onClick={() => {
                  updateState({ 
                    sessionDuration: 0, 
                    focusDuration: 0, 
                    breakDuration: 0, 
                    isSessionActive: false 
                  });
                  onNavigate('study-session');
                }}
                className="flex-1 py-4 bg-white border-2 border-indigo-900 text-gray-900 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 hover:bg-gray-50"
            >
                Start New
            </button>
        </div>
      </div>
    </div>
  );
}
