import { Check, Trophy, ChevronLeft, Home as HomeIcon } from 'lucide-react';
import type { PageType } from '../../App';

interface ProgressTrackerPageProps {
  onNavigate: (page: PageType) => void;
  darkMode?: boolean;
}

export function ProgressTrackerPage({ onNavigate, darkMode = false }: ProgressTrackerPageProps) {
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <header className={`px-6 py-5 border-b flex items-center justify-between sticky top-0 z-40 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <button 
          onClick={() => onNavigate('home')}
          className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all active:scale-95 shadow-sm group ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
        >
          <ChevronLeft size={20} className={`transition-colors group-hover:text-indigo-600 ${darkMode ? 'text-white' : 'text-slate-900'}`} />
        </button>
        <h1 className={`text-[14px] font-black uppercase tracking-[0.2em] flex-1 text-center ${darkMode ? 'text-white' : 'text-slate-900'}`}>Progress Overview</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 p-6 space-y-8 pb-32">
        {/* Milestone Tracker (Wireframe Step 3 & 4) */}
        <div className={`relative overflow-hidden p-8 rounded-[2.5rem] shadow-premium border space-y-10 group ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between px-4 relative">
             {/* Progress Line */}
             <div className={`absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 -z-10 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}></div>
             <div className="absolute top-1/2 left-0 w-2/3 h-1 bg-indigo-500 -translate-y-1/2 -z-10 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.3)]"></div>

             {/* Milestones */}
             <div className="flex flex-col items-center gap-3">
               <div className={`w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white border-4 shadow-lg ${darkMode ? 'border-slate-800' : 'border-indigo-50'}`}>
                 <Check size={20} />
               </div>
               <span className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Start</span>
             </div>

             <div className="flex flex-col items-center gap-3">
               <div className={`w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white border-4 shadow-lg scale-110 ${darkMode ? 'border-slate-800' : 'border-indigo-50'}`}>
                 <Check size={20} />
               </div>
               <span className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-slate-900'}`}>3 Hrs</span>
             </div>

             <div className="flex flex-col items-center gap-3">
               <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 shadow-sm transition-transform group-hover:rotate-12 ${darkMode ? 'bg-slate-700 text-slate-400 border-slate-600' : 'bg-slate-50 text-slate-200 border-white'}`}>
                 <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-slate-500' : 'bg-slate-200'}`}></div>
               </div>
               <span className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>5 Hrs</span>
             </div>
          </div>
        </div>

        {/* Motivational Section (Wireframe Step 5, 6, 7) */}
        <div className="bg-gradient-to-b from-indigo-600 to-violet-700 p-8 rounded-[2.5rem] shadow-premium text-center space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/10 transition-colors"></div>
          
          <div className="space-y-2 relative z-10">
            <p className="text-indigo-100 text-sm font-medium">Study for <span className="text-white font-bold underline decoration-indigo-300/50 underline-offset-4">2 more hours</span> till</p>
            <p className="text-white font-black text-2xl tracking-tight">2359 to earn:</p>
          </div>

          <div className="flex justify-center py-4 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-white blur-3xl opacity-20 rounded-full animate-pulse"></div>
              <div className="w-36 h-36 rounded-full bg-white/10 backdrop-blur-md border-8 border-white/20 shadow-premium flex items-center justify-center relative transition-transform group-hover:scale-110 duration-500">
                <Trophy size={70} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
              </div>
            </div>
          </div>

          <p className="text-[11px] font-black text-indigo-200 uppercase tracking-[0.3em] relative z-10">5 Hours High-Achiever Badge</p>
        </div>
      </main>
    </div>
  );
}
