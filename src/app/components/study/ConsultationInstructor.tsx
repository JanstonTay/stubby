import { useRef, useState, useEffect } from 'react';
import { Pen, Eraser, Send, MessageCircle, Check, Undo, Redo, DoorOpen, GraduationCap, Type, Palette, Sparkles } from 'lucide-react';
import { ExportModal } from './ExportModal';
import { ExitConsultationModal } from './ExitConsultationModal';
import type { PageType, AppState } from '../../App';

interface ConsultationInstructorProps {
  onNavigate: (page: PageType) => void;
  updateState: (updates: Partial<AppState>) => void;
  state: AppState;
}

export function ConsultationInstructor({ onNavigate, updateState, state }: ConsultationInstructorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [workMode, setWorkMode] = useState<'text' | 'whiteboard'>('whiteboard');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showMessageSent, setShowMessageSent] = useState(false);
  const [notes, setNotes] = useState('');
  const [textExplanation, setTextExplanation] = useState('');
  const [message, setMessage] = useState('');
  const [consultationTime, setConsultationTime] = useState(0);

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
    ctx.strokeStyle = tool === 'pen' ? '#9333ea' : '#ffffff';
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
      setShowMessageSent(true);
      setTimeout(() => setShowMessageSent(false), 2000);
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
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full border border-purple-200">
            <GraduationCap size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Mentor Mode</span>
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
        {/* Session Tracking */}
        <div className="bg-white rounded-3xl p-5 border-2 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)] flex items-center justify-between">
            <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Topic: Linear Equations</p>
                <h3 className="text-sm font-black uppercase text-gray-900">Solving for x & y</h3>
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
        <div className="flex-1 bg-white rounded-3xl border-2 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)] overflow-hidden flex flex-col relative min-h-[300px]">
          {workMode === 'text' ? (
            <textarea
              value={textExplanation}
              onChange={(e) => setTextExplanation(e.target.value)}
              placeholder="Start your explanation here..."
              className="flex-1 p-6 text-sm font-bold bg-transparent resize-none outline-none placeholder:text-gray-300"
            />
          ) : (
            <>
              <div className="absolute top-4 left-4 flex gap-2 z-20">
                <button
                  onClick={() => setTool('pen')}
                  className={`w-10 h-10 rounded-xl border-2 border-indigo-900 flex items-center justify-center transition-all shadow-[2px_2px_0px_0px_rgba(67,56,202,0.3)] ${
                    tool === 'pen' ? 'bg-purple-600 text-white' : 'bg-white text-gray-900'
                  }`}
                >
                  <Pen size={18} />
                </button>
                <button
                  onClick={() => setTool('eraser')}
                  className={`w-10 h-10 rounded-xl border-2 border-indigo-900 flex items-center justify-center transition-all shadow-[2px_2px_0px_0px_rgba(67,56,202,0.3)] ${
                    tool === 'eraser' ? 'bg-white text-purple-600' : 'bg-white text-gray-900'
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

          {/* AI Helper for Mentor */}
          <button 
             onClick={() => setTextExplanation("Here's a breakdown: First, move all x terms to one side. Then, simplify constants...")}
             className="absolute bottom-4 right-4 px-4 py-2 bg-indigo-50 border-2 border-indigo-200 text-indigo-700 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-sm z-20">
            <Sparkles size={14} />
            AI Suggestion
          </button>
        </div>

        {/* Private Mentor Notes */}
        <div className="bg-white rounded-3xl p-5 border-2 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)]">
            <div className="flex justify-between items-center mb-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Private Reflection</p>
                <button onClick={() => setShowExportModal(true)} className="text-[10px] font-black uppercase text-blue-600 flex items-center gap-1">
                    Export Log
                </button>
            </div>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Student seems to struggle with signs..."
                className="w-full bg-gray-50 rounded-2xl p-4 text-xs font-bold outline-none border-2 border-transparent focus:border-indigo-900 transition-all resize-none"
                rows={2}
            />
        </div>

        {/* Messaging Bar */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Live message to learner..."
            className="flex-1 px-5 py-4 bg-white rounded-2xl text-xs font-bold outline-none border-2 border-indigo-900 shadow-[2px_2px_0px_0px_rgba(67,56,202,0.3)] focus:shadow-none transition-all"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center border-2 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(67,56,202,0.4)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
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

        {/* Toast Notification */}
        {showMessageSent && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 z-50">
                <Check size={16} />
                Message Shared with Learner
            </div>
        )}
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
