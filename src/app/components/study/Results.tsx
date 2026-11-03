import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Pen, ChevronDown, ChevronUp, Sparkles, X, DoorOpen, SkipForward } from 'lucide-react';
import type { AppState, PageType } from '../../App';
import { LeaveActivityModal } from './LeaveActivityModal';

interface ResultsProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  onNavigate: (page: PageType) => void;
}

const questions = [
  'Find the derivative of f(x) = x²',
  'Solve for x: 2x + 5 = 13',
  'What is the area of a circle with radius 4?',
];

type MemberStatus = 'completed' | 'working' | 'skipped';
type AnswerCorrectness = 'correct' | 'incorrect' | 'partial';

export function Results({ state, updateState, onNavigate }: ResultsProps) {
  const [expandedWork, setExpandedWork] = useState<string | null>(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Mock data for demonstration
  const memberStatuses: Record<string, Record<number, { status: MemberStatus; correctness?: AnswerCorrectness; answer?: string }>> = {
    'user': {
      0: { status: 'completed', correctness: 'correct', answer: 'f\'(x) = 2x' },
      1: { status: 'completed', correctness: 'correct', answer: 'x = 4' },
      2: { status: 'completed', correctness: 'correct', answer: 'A = 16π' }
    },
    '1': {
      0: { status: 'completed', correctness: 'correct', answer: 'f\'(x) = 2x' },
      1: { status: 'completed', correctness: 'correct', answer: 'x = 4' },
      2: { status: 'working' }
    },
    '2': {
      0: { status: 'completed', correctness: 'incorrect', answer: 'f\'(x) = x' },
      1: { status: 'completed', correctness: 'correct', answer: 'x = 4' },
      2: { status: 'skipped' }
    },
    '3': {
      0: { status: 'completed', correctness: 'correct', answer: 'f\'(x) = 2x' },
      1: { status: 'skipped' },
      2: { status: 'working' }
    }
  };

  const allParticipants = [
    { id: 'user', name: 'You', avatar: '👨‍🎓' },
    ...state.members
  ];

  const prevQuestion = () => {
    updateState({ currentQuestion: Math.max(0, state.currentQuestion - 1) });
  };

  const nextQuestion = () => {
    updateState({ currentQuestion: Math.min(questions.length - 1, state.currentQuestion + 1) });
  };

  const toggleWorkPreview = (memberId: string) => {
    setExpandedWork(expandedWork === memberId ? null : memberId);
  };

  const handleLeave = () => {
    setShowLeaveModal(false);
    onNavigate('study-session');
  };

  const getStatusDisplay = (memberId: string) => {
    const memberData = memberStatuses[memberId]?.[state.currentQuestion];
    if (!memberData) return { icon: <Pen size={14} className="text-amber-500" />, text: 'Working...', color: 'text-amber-500' };

    switch (memberData.status) {
      case 'completed':
        return { icon: <Check size={14} className="text-green-600" />, text: 'Completed', color: 'text-green-600' };
      case 'working':
        return { icon: <Pen size={14} className="text-amber-500" />, text: 'Working...', color: 'text-amber-500' };
      case 'skipped':
        return { icon: <SkipForward size={14} className="text-gray-400" />, text: 'Skipped', color: 'text-gray-400' };
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-xl border-b border-slate-100 py-5 px-6 flex items-center justify-between sticky top-0 z-20">
          <button 
            onClick={() => handleLeave()}
            className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
          >
              <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
          </button>
          <h1 className="text-[10px] font-black uppercase tracking-[.4em] text-slate-900">Results</h1>
          <button
              onClick={() => setShowLeaveModal(true)}
              className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
          >
              <DoorOpen size={20} className="text-slate-900 group-hover:text-red-500 transition-colors" />
          </button>
      </div>

      <div className="flex-1 px-6 flex flex-col gap-6 pt-6 pb-24 overflow-auto">
        {/* Question Navigator */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-4">
            <button
              onClick={prevQuestion}
              disabled={state.currentQuestion === 0}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-slate-50 disabled:opacity-30 border border-slate-200"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-center flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Question {state.currentQuestion + 1} of {questions.length}</p>
                <h3 className="text-sm font-black uppercase text-gray-900 leading-tight">{questions[state.currentQuestion]}</h3>
            </div>
            <button
              onClick={nextQuestion}
              disabled={state.currentQuestion === questions.length - 1}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-slate-50 disabled:opacity-30 border border-slate-200"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Participant Progress */}
        <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Submissions</p>
          {allParticipants.map(participant => {
            const statusDisplay = getStatusDisplay(participant.id);
            const isCompleted = memberStatuses[participant.id]?.[state.currentQuestion]?.status === 'completed';
            const isExpanded = expandedWork === participant.id;
            const correctness = memberStatuses[participant.id]?.[state.currentQuestion]?.correctness;

            return (
              <div key={participant.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-indigo-50 border border-indigo-100 flex-shrink-0">
                    {participant.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-gray-900 uppercase text-xs">{participant.name}</p>
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-center gap-2">
                        {statusDisplay.icon}
                        <span className={`text-[10px] font-black uppercase ${statusDisplay.color}`}>{statusDisplay.text}</span>
                      </div>
                      {isCompleted && correctness && (
                        <div className="flex items-center gap-2">
                          {correctness === 'correct' ? <Check size={14} className="text-green-600" /> : <X size={14} className="text-red-600" />}
                          <span className={`text-[10px] font-black uppercase ${correctness === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                            {correctness.charAt(0).toUpperCase() + correctness.slice(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {isCompleted && (
                    <button
                      onClick={() => toggleWorkPreview(participant.id)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-gray-50 border-2 border-transparent hover:border-gray-900"
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  )}
                </div>

                {isExpanded && isCompleted && (
                  <div className="px-4 pb-4 animate-in slide-in-from-top-2">
                    <div className="rounded-2xl p-4 bg-gray-50 border-2 border-gray-100">
                        <p className="text-sm font-bold text-gray-900">
                            {memberStatuses[participant.id]?.[state.currentQuestion]?.answer || 'No answer provided'}
                        </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* AI Insight */}
        <div className="bg-white p-6 rounded-[2rem] border border-indigo-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                    <Sparkles size={16} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight text-gray-900">AI Group Feedback</h3>
            </div>
            <div className="space-y-2 text-sm" style={{ color: '#374151' }}>
              <p><span style={{ color: '#9333EA', fontWeight: 600 }}>Common mistakes:</span> Watch out for sign errors when applying the power rule.</p>
              <p><span style={{ color: '#9333EA', fontWeight: 600 }}>Improvement:</span> Practice more derivative problems to build fluency.</p>
            </div>
        </div>

        <button
          onClick={() => onNavigate('activity-summary')}
          className="w-full py-4 mt-2 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100"
        >
          View Activity Summary
        </button>
      </div>

      {showLeaveModal && (
        <LeaveActivityModal
          onClose={() => setShowLeaveModal(false)}
          onLeave={handleLeave}
          pageName="Results"
        />
      )}
    </div>
  );
}
