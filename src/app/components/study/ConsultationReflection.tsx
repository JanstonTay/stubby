import { useState } from 'react';
import { Check, X, Loader2, ChevronLeft } from 'lucide-react';
import type { PageType } from '../../App';

interface ConsultationReflectionProps {
  onNavigate: (page: PageType) => void;
}

export function ConsultationReflection({ onNavigate }: ConsultationReflectionProps) {
  const [understanding, setUnderstanding] = useState<'yes' | 'no' | null>(null);
  const [notes, setNotes] = useState('');
  const [submissionState, setSubmissionState] = useState<'idle' | 'submitting' | 'submitted'>('idle');

  const checklist = [
    { id: 1, label: 'Key explanation provided', completed: true },
    { id: 2, label: 'Student attempted working', completed: true },
    { id: 3, label: 'Example was shown', completed: false },
    { id: 4, label: 'Whiteboard was used', completed: true },
    { id: 5, label: 'Student asked questions', completed: true },
  ];

  const handleSubmitReflection = () => {
    setSubmissionState('submitting');
    
    setTimeout(() => {
      setSubmissionState('submitted');
      setTimeout(() => {
        onNavigate('study-session');
      }, 800);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Submission Overlay */}
      {submissionState === 'submitting' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 border-2 border-slate-900 shadow-2xl flex flex-col items-center gap-4">
            <Loader2 size={48} className="text-indigo-600 animate-spin" />
            <p className="text-sm font-black uppercase tracking-widest text-slate-900">Archiving consultation analysis...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b-2 border-slate-100 py-6 px-6 flex items-center justify-between sticky top-0 z-20">
          <button 
            onClick={() => onNavigate('study-session')}
            className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
          >
              <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
          </button>
          <h1 className="text-[10px] font-black uppercase tracking-[.4em] text-slate-900">Reflection</h1>
          <div className="w-10"></div>
      </div>

      <div className="flex-1 px-6 flex flex-col gap-6 pt-6 pb-24 overflow-auto">
        {/* Topic Card */}
        <div className="bg-white rounded-3xl p-5 border-2 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)]">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Session Data</p>
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-sm font-black uppercase text-gray-900">Calculus Basics</h3>
                    <p className="text-xs font-bold text-gray-500">Mentored Sam J.</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border-2 border-blue-200">
                    <span className="font-black text-xs">A</span>
                </div>
            </div>
        </div>

        {/* Binary Choice */}
        <div className="bg-white rounded-3xl p-6 border-2 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)]">
            <p className="text-xs font-black uppercase tracking-tight text-gray-900 mb-4 text-center">Outcome: Did they grasp it?</p>
            <div className="flex gap-4">
                <button
                    onClick={() => setUnderstanding('yes')}
                    className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border-2 ${
                        understanding === 'yes' ? 'bg-green-600 text-white border-gray-900' : 'bg-gray-50 text-gray-400 border-transparent'
                    }`}
                >
                    Full Grip
                </button>
                <button
                    onClick={() => setUnderstanding('no')}
                    className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border-2 ${
                        understanding === 'no' ? 'bg-amber-500 text-white border-gray-900' : 'bg-gray-50 text-gray-400 border-transparent'
                    }`}
                >
                    Needs Drills
                </button>
            </div>
        </div>

        {/* Milestone Checklist */}
        <div className="bg-white rounded-3xl p-6 border-2 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)]">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Milestone Check</p>
            <div className="space-y-3">
                {checklist.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        item.completed ? 'bg-green-500 border-gray-900' : 'bg-gray-100 border-gray-200'
                    }`}>
                        {item.completed && <Check size={14} className="text-white" />}
                    </div>
                    <span className={`text-xs font-bold ${item.completed ? 'text-gray-900' : 'text-gray-300'}`}>
                        {item.label}
                    </span>
                </div>
                ))}
            </div>
        </div>

        {/* Summary Notes */}
        <div className="flex-1 bg-white rounded-3xl p-6 border-2 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)] flex flex-col min-h-[150px]">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Mentor Summary</p>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Final tips for the student..."
                className="w-full flex-1 bg-gray-50 rounded-2xl p-4 text-xs font-bold outline-none border-2 border-transparent focus:border-gray-900 transition-all resize-none"
            />
        </div>

        {/* Footer Actions */}
        <button
          onClick={handleSubmitReflection}
          disabled={submissionState !== 'idle'}
          className="w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 bg-indigo-600 text-white hover:bg-indigo-700 shadow-[4px_4px_0px_0px_rgba(79,70,229,0.3)] disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {submissionState === 'submitting' ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
          ) : submissionState === 'submitted' ? (
              <>
                <Check size={18} />
                Reflection Saved
              </>
          ) : (
              'Save & Close'
          )}
        </button>
      </div>
    </div>
  );
}
