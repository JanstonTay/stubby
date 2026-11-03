import { useState } from 'react';
import { Smile, Meh, Frown, Check, Loader2, ChevronLeft } from 'lucide-react';
import type { PageType } from '../../App';

interface SessionReflectionProps {
  onNavigate: (page: PageType) => void;
}

export function SessionReflection({ onNavigate }: SessionReflectionProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [reflection, setReflection] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionState, setSubmissionState] = useState<'idle' | 'submitting' | 'submitted'>('idle');

  const moods = [
    { id: 'great', icon: Smile, label: 'Full Flow', color: '#16A34A', emoji: '🔥' },
    { id: 'okay', icon: Meh, label: 'Balanced', color: '#F59E0B', emoji: '⚖️' },
    { id: 'tough', icon: Frown, label: 'Rough', color: '#DC2626', emoji: '🌪️' },
  ];

  const handleSubmit = () => {
    setSubmissionState('submitting');
    
    setTimeout(() => {
      setSubmissionState('submitted');
      setIsSubmitted(true);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Submission Overlay */}
      {submissionState === 'submitting' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 border-2 border-slate-900 shadow-2xl flex flex-col items-center gap-4">
            <Loader2 size={48} className="text-indigo-600 animate-spin" />
            <p className="text-sm font-black uppercase tracking-widest text-slate-900">Syncing reflection to Cloud...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b-2 border-slate-100 py-6 px-6 flex items-center justify-between sticky top-0 z-20">
        {!isSubmitted && (
            <button
                onClick={() => onNavigate('session-complete')}
                className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
            >
                <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
            </button>
        )}
        <h1 className="text-[10px] font-black uppercase tracking-[.4em] text-slate-900 flex-1 text-center">
            {isSubmitted ? 'Submitted' : 'Post-Session'}
        </h1>
        <div className="w-10"></div>
      </div>

      {!isSubmitted ? (
        <div className="flex-1 px-6 flex flex-col gap-6 pt-6 pb-24 overflow-auto">
          {/* Mood Section */}
          <div className="bg-white rounded-3xl p-6 border-2 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)]">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 text-center">Daily Vibe Check</p>
                <div className="flex gap-3">
                {moods.map(mood => {
                    const isSelected = selectedMood === mood.id;
                    return (
                        <button
                            key={mood.id}
                            onClick={() => setSelectedMood(mood.id)}
                            className={`flex-1 p-4 rounded-2xl transition-all border-2 flex flex-col items-center gap-2 group ${
                                isSelected ? 'bg-gray-900 border-gray-900 text-white' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-white hover:border-gray-200 shadow-sm'
                            }`}
                        >
                            <span className={`text-2xl transition-transform ${isSelected ? 'scale-125' : 'group-hover:scale-110 grayscale group-hover:grayscale-0'}`}>
                                {mood.emoji}
                            </span>
                            <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap">
                                {mood.label}
                            </span>
                        </button>
                    );
                })}
                </div>
          </div>

          {/* Deep Reflection */}
          <div className="flex-1 bg-white rounded-3xl p-6 border-2 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)] flex flex-col min-h-[200px]">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Detailed Notes</p>
                <textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="Capture your thoughts here..."
                    className="w-full flex-1 bg-gray-50 rounded-2xl p-4 text-xs font-bold outline-none border-2 border-transparent focus:border-gray-900 transition-all resize-none"
                />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedMood || submissionState !== 'idle'}
            className="w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 bg-indigo-600 text-white hover:bg-indigo-700 shadow-[4px_4px_0px_0px_rgba(79,70,229,0.3)] disabled:opacity-50"
          >
            Store Reflection
          </button>
        </div>
      ) : (
        <div className="flex-1 px-8 flex flex-col items-center justify-center gap-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-green-500 rounded-full border-4 border-indigo-900 shadow-[8px_8px_0px_0px_rgba(67,56,202,0.6)] flex items-center justify-center text-white text-4xl">
                ✨
            </div>
            <div className="text-center">
                <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-2">Growth Stored!</h2>
                <p className="text-sm font-bold text-gray-500 leading-relaxed">
                    Your reflection has been added to your productivity timeline. Great job on the self-awareness!
                </p>
            </div>
            <div className="w-full space-y-3">
                <button
                    onClick={() => onNavigate('session-complete')}
                    className="w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 bg-indigo-600 text-white hover:bg-indigo-700 shadow-[4px_4px_0px_0px_rgba(79,70,229,0.3)]"
                >
                    Return to Summary
                </button>
                <button
                    onClick={() => onNavigate('home')}
                    className="w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 shadow-[4px_4px_0px_0px_rgba(79,70,229,0.2)]"
                >
                    Back Home
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
