import { Sparkles, Users, Target, Zap, AlertCircle, ChevronLeft } from 'lucide-react';
import type { PageType, AppState } from '../../App';

interface ActivitySummaryProps {
  onNavigate: (page: PageType) => void;
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function ActivitySummary({ onNavigate, state, updateState }: ActivitySummaryProps) {
  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-xl border-b border-slate-100 py-5 px-6 flex items-center justify-between sticky top-0 z-20">
          <button 
            onClick={() => onNavigate('results')}
            className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
          >
              <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
          </button>
          <h1 className="text-[10px] font-black uppercase tracking-[.4em] text-slate-900">Activity Log</h1>
          <div className="w-10"></div>
      </div>

      <div className="flex-1 px-6 flex flex-col gap-6 pt-6 pb-24 overflow-auto">
        {/* Metric Grid */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 text-center">Operational Metrics</p>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100 group hover:border-blue-600 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                        <Target size={16} className="text-blue-600" />
                        <span className="text-[10px] font-black uppercase text-blue-600">Accuracy</span>
                    </div>
                    <p className="text-xl font-black text-gray-900">67%</p>
                    <p className="text-[8px] font-black uppercase text-blue-400 mt-1">2 / 3 Resolved</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-100 group hover:border-amber-600 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap size={16} className="text-amber-600" />
                        <span className="text-[10px] font-black uppercase text-amber-600">Velocity</span>
                    </div>
                    <p className="text-xl font-black text-gray-900">3.2m</p>
                    <p className="text-[8px] font-black uppercase text-amber-400 mt-1">Avg / Task</p>
                </div>
                <div className="bg-green-50 p-4 rounded-2xl border-2 border-green-100 group hover:border-green-600 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                        <Users size={16} className="text-green-600" />
                        <span className="text-[10px] font-black uppercase text-green-600">Sync</span>
                    </div>
                    <p className="text-xl font-black text-gray-900">100%</p>
                    <p className="text-[8px] font-black uppercase text-green-400 mt-1">Full Team Engagement</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-100 group hover:border-purple-600 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={16} className="text-purple-600" />
                        <span className="text-[10px] font-black uppercase text-purple-600">Hotspots</span>
                    </div>
                    <p className="text-[8px] font-black uppercase text-purple-800 line-clamp-2 leading-tight">Notation flips, Chain rule nesting errors</p>
                </div>
            </div>
        </div>

        {/* AI Learning Notes */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex items-start gap-4 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={20} className="text-indigo-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm leading-5 font-black uppercase tracking-wider text-slate-900">AI Diagnostic Report</h3>
                  <p className="text-xs font-bold leading-relaxed text-slate-500 mt-1">Fixed demo report generated from this study session.</p>
                </div>
            </div>
            
            <div className="grid gap-3">
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1">Session Insight</p>
                    <p className="text-xs font-bold leading-relaxed text-slate-700">Your group solved 2 of 3 prompts. The main gap was notation consistency during derivative transforms.</p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Recommended Drill</p>
                    <p className="text-xs font-bold leading-relaxed text-slate-700">Run a 15-minute chain-rule practice loop, then compare final steps with Sarah and Alex.</p>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Focus Tracker</p>
                    <p className="text-xs font-bold leading-relaxed text-slate-700">Keep the next round to one focus block and one short break so the group stays aligned.</p>
                </div>
            </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto space-y-4 pb-8">
          <button
            onClick={() => onNavigate('co-solve-lobby')}
            className="group relative w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative">Initiate New Group Session</span>
          </button>
          
          <button
            onClick={() => onNavigate('study-session')}
            className="w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm"
          >
            Return to Active Lab
          </button>
        </div>
      </div>
    </div>
  );
}
