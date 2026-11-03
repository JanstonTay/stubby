import { useRef, useState, useEffect } from 'react';
import { Pen, Eraser, Send, MessageCircle, Undo, Redo, DoorOpen, User, Sparkles, Type, Palette } from 'lucide-react';
import { ExportModal } from './ExportModal';
import { ExitConsultationModal } from './ExitConsultationModal';
import type { PageType, AppState } from '../../App';

interface ConsultationStudentProps {
  onNavigate: (page: PageType) => void;
  updateState: (updates: Partial<AppState>) => void;
  state: AppState;
}

export function ConsultationStudent({ onNavigate, updateState, state }: ConsultationStudentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [workMode, setWorkMode] = useState<'text' | 'whiteboard'>('whiteboard');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [textExplanation, setTextExplanation] = useState('');
  const [message, setMessage] = useState('');
  const [consultationTime, setConsultationTime] = useState(0);
  const [notes, setNotes] = useState('');
  const [aiHint, setAiHint] = useState('');
  const [activeInstruction, setActiveInstruction] = useState<'explain' | 'example' | 'practice' | 'wrong' | null>(null);

  useEffect(() => {
    if (workMode === 'whiteboard') {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [workMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setConsultationTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessage('');
    }
  };

  const handleConfirmExit = () => {
    setShowLeaveModal(false);
    updateState({ showConsultationReflectionPrompt: true });
    onNavigate('study-session');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 bg-white border-b-2 border-indigo-900 shadow-sm relative z-10">
        <div className="w-10"></div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full border border-blue-200">
            <User size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Learner Mode</span>
          </div>
          <h1 className="text-xl font-black uppercase tracking-tight">Assistance</h1>
        </div>
        <button
          onClick={() => setShowLeaveModal(true)}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 bg-gray-100 hover:bg-gray-200 border-2 border-transparent hover:border-indigo-900"
        >
          <DoorOpen size={20} className="text-gray-900" />
        </button>
      </div>

      <div className="flex-1 px-6 flex flex-col gap-4 pt-6 pb-24 overflow-auto">
        {/* Tracking */}
        <div className="bg-white rounded-3xl p-5 border-2 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)] flex items-center justify-between">
            <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Topic: Linear Equations</p>
                <h3 className="text-sm font-black uppercase text-gray-900">Seeking Clarity</h3>
            </div>
            <div className="px-4 py-2 bg-gray-900 text-white rounded-2xl font-black text-sm tabular-nums">
                {formatTime(consultationTime)}
            </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-white p-1.5 rounded-2xl border-2 border-indigo-900 shadow-[2px_2px_0px_0px_rgba(67,56,202,0.3)]">
          <button
            onClick={() => setWorkMode('text')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
              workMode === 'text' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Type size={16} />
            Text
          </button>
          <button
            onClick={() => setWorkMode('whiteboard')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
              workMode === 'whiteboard' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Palette size={16} />
            Board
          </button>
        </div>

        {/* Workspace */}
        <div className="flex-1 bg-white rounded-3xl border-2 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)] overflow-hidden flex flex-col relative min-h-[250px]">
          {workMode === 'text' ? (
            <textarea
              value={textExplanation}
              onChange={(e) => setTextExplanation(e.target.value)}
              placeholder="Show your work or type your question..."
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
                <button className="w-10 h-10 rounded-xl border-2 border-indigo-900 bg-white flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(67,56,202,0.3)]">
                  <Undo size={18} />
                </button>
                <button className="w-10 h-10 rounded-xl border-2 border-indigo-900 bg-white flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(67,56,202,0.3)]">
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

          {/* AI Helper for Student */}
          {aiHint ? (
              <div className="absolute bottom-4 left-4 right-4 bg-indigo-900 text-white p-4 rounded-2xl border-2 border-indigo-900 shadow-lg animate-in slide-in-from-bottom-2 z-20">
                  <p className="text-[8px] font-black uppercase tracking-widest text-indigo-300 mb-1">AI Smart Hint</p>
                  <p className="text-xs font-bold leading-relaxed">{aiHint}</p>
                  <button onClick={() => setAiHint('')} className="absolute top-2 right-2 text-indigo-400 hover:text-white">
                    <X size={14} />
                  </button>
              </div>
          ) : (
            <button 
                onClick={() => setAiHint("Try isolating 'y' on the left side first. Look at the constant sign when moving it across the equals bond.")}
                className="absolute bottom-4 left-4 px-4 py-2 bg-indigo-50 border-2 border-indigo-200 text-indigo-700 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-sm z-20">
                <Sparkles size={14} />
                Get Hint
            </button>
          )}
        </div>

        {/* Direction Controls for Student */}
        <div className="bg-white rounded-3xl p-5 border-2 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)]">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Ask your mentor to:</p>
            <div className="grid grid-cols-2 gap-2">
                {[
                    { id: 'explain', label: 'Explain Step-by-Step' },
                    { id: 'example', label: 'Show Another Example' },
                    { id: 'wrong', label: 'Highlight My Error' },
                    { id: 'practice', label: 'Test My Skills' }
                ].map(action => (
                    <button
                        key={action.id}
                        onClick={() => setActiveInstruction(action.id as any)}
                        className={`py-3 px-2 rounded-2xl text-[10px] font-black uppercase tracking-tight transition-all border-2 ${
                            activeInstruction === action.id 
                            ? 'bg-gray-900 text-white border-indigo-900' 
                            : 'bg-gray-50 text-gray-600 border-transparent hover:bg-white hover:border-gray-200'
                        }`}
                    >
                        {action.label}
                    </button>
                ))}
            </div>
        </div>

        {/* Messaging Bar */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Live message to mentor..."
            className="flex-1 px-5 py-4 bg-white rounded-2xl text-xs font-bold outline-none border-2 border-indigo-900 shadow-[2px_2px_0px_0px_rgba(67,56,202,0.3)] focus:shadow-none transition-all"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center border-2 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
          >
            <Send size={20} />
          </button>
          <button 
            onClick={() => onNavigate('consultation-chat-log')}
            className="w-14 h-14 rounded-2xl bg-white border-2 border-indigo-900 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
          >
            <MessageCircle size={20} className="text-gray-900" />
          </button>
        </div>
      </div>

      {showLeaveModal && (
        <ExitConsultationModal 
          onCancel={() => setShowLeaveModal(false)} 
          onConfirm={handleConfirmExit} 
        />
      )}

      {showExportModal && (
        <ExportModal onClose={() => setShowExportModal(false)} />
      )}
    </div>
  );
}

const X = ({ size, className }: { size: number, className: string }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
)
