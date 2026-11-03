import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pen, Eraser, Undo, Redo, DoorOpen, Type, Palette } from 'lucide-react';
import type { AppState, PageType } from '../../App';
import { LeaveActivityModal } from './LeaveActivityModal';

interface PublicWorkspaceProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  onNavigate: (page: PageType) => void;
}

const questions = [
  'Find the derivative of f(x) = x²',
  'Solve for x: 2x + 5 = 13',
  'What is the area of a circle with radius 4?',
];

type ParticipantStatus = 'drawing' | 'typing' | 'idle';

export function PublicWorkspace({ state, updateState, onNavigate }: PublicWorkspaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [textAnswer, setTextAnswer] = useState('');
  const [participantStatuses] = useState<Record<string, ParticipantStatus>>({
    '2': 'drawing',
    '3': 'idle',
  });
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

  const prevQuestion = () => {
    updateState({ currentQuestion: Math.max(0, state.currentQuestion - 1) });
  };

  const nextQuestion = () => {
    updateState({ currentQuestion: Math.min(questions.length - 1, state.currentQuestion + 1) });
  };

  const handleLeave = () => {
    setShowLeaveModal(false);
    onNavigate('study-session');
  };

  const getActivityText = (status: ParticipantStatus) => {
    switch (status) {
      case 'drawing': return 'Writing';
      case 'typing': return 'Typing';
      default: return 'Idle';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b-2 border-slate-100 py-6 px-6 flex items-center justify-between sticky top-0 z-20">
          <button 
            onClick={() => onNavigate('study-session')}
            className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
          >
              <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
          </button>
          <h1 className="text-[10px] font-black uppercase tracking-[.4em] text-slate-900">Public Workspace</h1>
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
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Collaborative Challenge</p>
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

        {/* Mode & Tools */}
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

        {/* Main Workspace */}
        <div className="flex-1 min-h-[400px] bg-white rounded-3xl border-2 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)] overflow-hidden flex flex-col relative">
          {state.workMode === 'text' ? (
            <textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Type your collaborative answer here..."
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
                  className="w-10 h-10 rounded-xl border-2 border-indigo-900 bg-white flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(67,56,202,0.3)] disabled:opacity-30 disabled:border-slate-200"
                >
                  <Undo size={18} />
                </button>
                <button 
                  onClick={handleRedo}
                  disabled={historyStep >= history.length - 1}
                  className="w-10 h-10 rounded-xl border-2 border-indigo-900 bg-white flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(67,56,202,0.3)] disabled:opacity-30 disabled:border-slate-200"
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

          {/* User Presence & Activity Overlays */}
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center justify-between shadow-premium">
            <div className="flex items-center gap-2">
                {state.members.concat([{id: 'user', name: 'You', avatar: '👨‍🎓'}] as any[]).map((member, i) => (
                    <div 
                        key={member.id} 
                        className="w-8 h-8 rounded-xl border-2 border-slate-900 flex items-center justify-center bg-white shadow-sm transition-all"
                        style={{ marginLeft: i > 0 ? '-10px' : '0', zIndex: 10 - i }}
                    >
                        <span className="text-xs">{member.avatar}</span>
                    </div>
                ))}
                <div className="ml-2 flex flex-col">
                    <span className="text-[8px] font-black uppercase text-indigo-400 leading-none">Collaborative Session</span>
                    <span className="text-[7px] font-bold text-white/50 uppercase tracking-tighter mt-0.5">3 Participants Active</span>
                </div>
            </div>
            <div className="flex flex-col items-end">
                {state.members.filter(m => participantStatuses[m.id] === 'drawing').map(m => (
                    <div key={m.id} className="flex items-center gap-1.5 animate-pulse">
                        <Pen size={8} className="text-indigo-400" />
                        <span className="text-[7px] font-black text-white uppercase tracking-tighter">{m.name} is {getActivityText(participantStatuses[m.id])}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <button
          onClick={() => onNavigate('results')}
          className="w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 bg-indigo-600 text-white hover:bg-indigo-700 shadow-[4px_4px_0px_0px_rgba(79,70,229,0.3)]"
        >
          Submit Shared Work
        </button>

        <button
          onClick={() => onNavigate('private-workspace')}
          className="w-full py-3 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 bg-white text-gray-900 border-2 border-indigo-900 hover:bg-indigo-50"
        >
          Switch to Private Workspace
        </button>
      </div>

      {showLeaveModal && (
        <LeaveActivityModal
          onClose={() => setShowLeaveModal(false)}
          onLeave={handleLeave}
          pageName="Public Workspace"
        />
      )}
    </div>
  );
}
