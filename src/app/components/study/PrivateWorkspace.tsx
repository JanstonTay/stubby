import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pen, Eraser, ArrowLeft, Undo, Redo, DoorOpen, Loader2, Check, Type, Palette } from 'lucide-react';
import type { AppState, PageType } from '../../App';
import { LeaveActivityModal } from './LeaveActivityModal';
import { SubmissionFeedback } from '../SubmissionFeedback';

interface PrivateWorkspaceProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  onNavigate: (page: PageType) => void;
}

const questions = [
  'Find the derivative of f(x) = x²',
  'Solve for x: 2x + 5 = 13',
  'What is the area of a circle with radius 4?',
];

export function PrivateWorkspace({ state, updateState, onNavigate }: PrivateWorkspaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [textAnswer, setTextAnswer] = useState(state.userAnswers[state.currentQuestion] || '');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [submissionState, setSubmissionState] = useState<'idle' | 'submitting' | 'submitted'>('idle');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  useEffect(() => {
    if (state.workMode === 'whiteboard') {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [state.workMode]);

  const startDrawing = (e: any) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.strokeStyle = tool === 'pen' ? '#2563eb' : '#ffffff';
    ctx.lineWidth = tool === 'pen' ? 3 : 25;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const newHistory = history.slice(0, historyStep + 1);
          newHistory.push(imageData);
          setHistory(newHistory);
          setHistoryStep(newHistory.length - 1);
        }
      }
    }
    setIsDrawing(false);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      setHistoryStep(historyStep - 1);
      ctx.putImageData(history[historyStep - 1], 0, 0);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      setHistoryStep(historyStep + 1);
      ctx.putImageData(history[historyStep + 1], 0, 0);
    }
  };

  const submitAnswer = () => {
    setSubmissionState('submitting');
    
    setTimeout(() => {
      setSubmissionState('submitted');
      updateState({
        userAnswers: {
          ...state.userAnswers,
          [state.currentQuestion]: textAnswer || 'Whiteboard answer',
        },
      });
      
      setTimeout(() => {
        onNavigate('results');
      }, 800);
    }, 2000);
  };

  const prevQuestion = () => {
    updateState({ currentQuestion: Math.max(0, state.currentQuestion - 1) });
    setTextAnswer(state.userAnswers[state.currentQuestion - 1] || '');
  };

  const nextQuestion = () => {
    updateState({ currentQuestion: Math.min(questions.length - 1, state.currentQuestion + 1) });
    setTextAnswer(state.userAnswers[state.currentQuestion + 1] || '');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Submission Overlay */}
      {submissionState === 'submitting' && (
        <SubmissionFeedback 
          message="Analyzing and syncing your work..." 
          onClose={() => setSubmissionState('idle')}
        />
      )}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b-2 border-slate-100 py-6 px-6 flex items-center justify-between sticky top-0 z-20">
          <button 
            onClick={() => onNavigate('public-workspace')}
            className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
          >
              <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
          </button>
          <h1 className="text-[10px] font-black uppercase tracking-[.4em] text-slate-900">Private Workspace</h1>
          <button
              onClick={() => setShowLeaveModal(true)}
              className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
          >
              <DoorOpen size={20} className="text-slate-900 group-hover:text-red-500 transition-colors" />
          </button>
      </div>

      <div className="flex-1 px-6 flex flex-col gap-4 pt-6 pb-24 overflow-hidden">
        {/* Question Panel */}
        <div className="bg-white rounded-3xl p-6 border-2 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)]">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={prevQuestion}
              disabled={state.currentQuestion === 0}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-gray-100 disabled:opacity-30 border-2 border-indigo-900"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-center flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Personal Challenge</p>
                <h3 className="text-sm font-black uppercase text-gray-900 leading-tight">{questions[state.currentQuestion]}</h3>
            </div>
            <button
              onClick={nextQuestion}
              disabled={state.currentQuestion === questions.length - 1}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-gray-100 disabled:opacity-30 border-2 border-indigo-900"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-white p-1.5 rounded-2xl border-2 border-indigo-900 shadow-[2px_2px_0px_0px_rgba(67,56,202,0.3)]">
          <button
            onClick={() => updateState({ workMode: 'text' })}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
              state.workMode === 'text' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Type size={16} />
            Text
          </button>
          <button
            onClick={() => updateState({ workMode: 'whiteboard' })}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
              state.workMode === 'whiteboard' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Palette size={16} />
            Board
          </button>
        </div>

        {/* Workspace Area */}
        <div className="flex-1 min-h-[400px] bg-white rounded-3xl border-2 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)] overflow-hidden flex flex-col relative">
          {state.workMode === 'text' ? (
            <textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Type your personal solution..."
              className="flex-1 p-6 text-sm font-bold bg-transparent resize-none outline-none placeholder:text-gray-300"
            />
          ) : (
            <>
              <div className="absolute top-4 left-4 flex gap-2 z-20">
                <button
                  onClick={() => setTool('pen')}
                  className={`w-10 h-10 rounded-xl border-2 border-indigo-900 flex items-center justify-center transition-all shadow-[2px_2px_0px_0px_rgba(67,56,202,0.3)] ${
                    tool === 'pen' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'
                  }`}
                >
                  <Pen size={18} />
                </button>
                <button
                  onClick={() => setTool('eraser')}
                  className={`w-10 h-10 rounded-xl border-2 border-indigo-900 flex items-center justify-center transition-all shadow-[2px_2px_0px_0px_rgba(67,56,202,0.3)] ${
                    tool === 'eraser' ? 'bg-white text-blue-600' : 'bg-white text-gray-900'
                  }`}
                >
                  <Eraser size={18} />
                </button>
              </div>
              <div className="absolute top-4 right-4 flex gap-2 z-20">
                <button 
                  onClick={handleUndo}
                  disabled={historyStep <= 0}
                  className="w-10 h-10 rounded-xl border-2 border-slate-900 bg-white flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(67,56,202,0.3)] disabled:opacity-30 disabled:border-slate-200"
                >
                  <Undo size={18} />
                </button>
                <button 
                  onClick={handleRedo}
                  disabled={historyStep >= history.length - 1}
                  className="w-10 h-10 rounded-xl border-2 border-slate-900 bg-white flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(67,56,202,0.3)] disabled:opacity-30 disabled:border-slate-200"
                >
                  <Redo size={18} />
                </button>
              </div>
              
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-full touch-none cursor-crosshair bg-white"
              />
            </>
          )}

          {/* Privacy Indicator */}
          <div className="absolute bottom-4 left-4 bg-gray-900 text-white px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
            Private Instance
          </div>
        </div>

        {/* Footer Actions */}
        <button
          onClick={submitAnswer}
          disabled={submissionState !== 'idle'}
          className="w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 bg-indigo-600 text-white hover:bg-indigo-700 shadow-[4px_4px_0px_0px_rgba(79,70,229,0.3)] disabled:opacity-50"
        >
          {submissionState === 'submitted' ? 'Solution Synced' : 'Submit for Review'}
        </button>

        <button
          onClick={() => onNavigate('public-workspace')}
          className="w-full py-3 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 bg-white text-gray-900 border-2 border-indigo-900"
        >
          Return to Collaborative Lab
        </button>
      </div>

      {showLeaveModal && (
        <LeaveActivityModal
          onClose={() => setShowLeaveModal(false)}
          onLeave={() => {
            setShowLeaveModal(false);
            onNavigate('study-session');
          }}
          pageName="Private Workspace"
        />
      )}
    </div>
  );
}
