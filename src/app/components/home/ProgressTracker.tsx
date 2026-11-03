import type { PageType } from '../../App';

interface ProgressTrackerProps {
  onNavigate?: (page: PageType) => void;
  darkMode?: boolean;
}

export function ProgressTracker({ onNavigate, darkMode = false }: ProgressTrackerProps) {
  const dailyGoal = 5;
  const currentProgress = 3;
  const percentage = (currentProgress / dailyGoal) * 100;

  return (
    <div 
      onClick={() => onNavigate?.('progress-tracker')}
      className={`p-7 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border space-y-6 cursor-pointer hover:shadow-premium transition-all active:scale-[0.98] ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
    >
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Daily Progress</h3>
        <span className={`text-[13px] font-extrabold px-3 py-1 rounded-full ${darkMode ? 'text-indigo-400 bg-indigo-500/20' : 'text-indigo-600 bg-indigo-50'}`}>{percentage.toFixed(0)}%</span>
      </div>
      
      <div className="space-y-4">
        <div className={`flex items-center justify-between text-[11px] font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          <span>Goal : {dailyGoal}H FOCUSED</span>
          <span className="text-emerald-500 font-black">Progress : +{currentProgress}H</span>
        </div>
        
        {/* Progress Bar */}
        <div className={`w-full rounded-full h-3.5 overflow-hidden p-1 shadow-inner ${darkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
          <div 
            className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className={`p-3 rounded-2xl flex flex-col gap-1 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Streak</span>
            <span className={`text-sm font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>🔥 7 Days</span>
          </div>
          <div className={`p-3 rounded-2xl flex flex-col gap-1 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Focus Rank</span>
            <span className={`text-sm font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>🏆 Top 10%</span>
          </div>
        </div>
      </div>
    </div>
  );
}