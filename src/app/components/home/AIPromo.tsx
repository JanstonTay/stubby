import { Bot, Sparkles } from 'lucide-react';
import type { PageType } from '../../App';

interface AIPromoProps {
  onNavigate: (page: PageType) => void;
  darkMode?: boolean;
}

export function AIPromo({ onNavigate, darkMode = false }: AIPromoProps) {
  return (
    <div className="relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 rounded-[2rem] opacity-100 transition-transform group-hover:scale-[1.02] duration-500"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/20 rounded-full -ml-12 -mb-12 blur-2xl"></div>
      
      <div className="relative p-7 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1.5 font-bold text-indigo-100 uppercase tracking-widest text-[10px]">
            <Sparkles size={12} className="text-indigo-200" />
            Premium Feature
          </div>
          <h2 className="text-2xl font-black text-white leading-tight">AI Tutoring V2.0</h2>
          <p className="text-indigo-100/80 text-sm font-medium">Get instant answers now.</p>
          
          <button 
            onClick={() => onNavigate('ai-chatbot')}
            className="mt-4 bg-white text-indigo-600 px-5 py-2.5 rounded-2xl font-black text-sm transition-all hover:bg-indigo-50 hover:shadow-[0_10px_40px_rgba(255,255,255,0.2)] active:scale-95"
          >
            Try Now
          </button>
        </div>
        
        <div className="w-24 h-24 flex items-center justify-center">
          <div className="p-4 bg-white/15 backdrop-blur-sm rounded-[1.5rem] border border-white/20 shadow-inner group-hover:rotate-12 transition-transform duration-500">
            <Bot size={52} className="text-white drop-shadow-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}