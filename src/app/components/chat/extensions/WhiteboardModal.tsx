import { X, Pencil, Square, Circle, Eraser, Minus, PenTool, Download } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

interface WhiteboardModalProps {
  onClose: () => void;
}

export function WhiteboardModal({ onClose }: WhiteboardModalProps) {
  const [selectedTool, setSelectedTool] = useState('pencil');
  const [strokeSize, setStrokeSize] = useState(5);
  const [color, setColor] = useState('#4f46e5'); // indigo-600
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use parent dimensions
    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = canvas.parentElement?.clientHeight || 600;

    const context = canvas.getContext('2d');
    if (context) {
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = color;
      context.lineWidth = strokeSize;
      contextRef.current = context;
    }
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = strokeSize;
      // Eraser handling
      if (selectedTool === 'eraser') {
        contextRef.current.globalCompositeOperation = 'destination-out';
      } else {
        contextRef.current.globalCompositeOperation = 'source-over';
      }
    }
  }, [color, strokeSize, selectedTool]);

  const startDrawing = ({ nativeEvent }: React.MouseEvent) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }: React.MouseEvent) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
  };

  const tools = [
    { id: 'pencil', icon: Pencil },
    { id: 'line', icon: Minus },
    { id: 'circle', icon: Circle },
    { id: 'eraser', icon: Eraser },
  ];

  return (
    <div className="fixed inset-0 z-[150] flex flex-col bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300 p-6">
      <div className="flex-1 bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
        {/* Header */}
        <header className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
              <PenTool size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Live Whiteboard</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </header>

        {/* Toolbar (6.1.4) */}
        <div className="px-8 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-6">
          <div className="flex gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            {tools.map((tool) => (
              <button 
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  selectedTool === tool.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                <tool.icon size={18} />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div 
              className="w-10 h-10 rounded-xl shadow-inner border border-slate-100 cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => setColor(color === '#4f46e5' ? '#0F172A' : '#4f46e5')} // Toggle between indigo and slate for demo
            ></div>
            <div className="flex items-center gap-2 pr-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Size</span>
              <input 
                type="range" 
                min="1" 
                max="20" 
                value={strokeSize}
                onChange={(e) => setStrokeSize(parseInt(e.target.value))}
                className="w-24 accent-indigo-600 h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-white relative">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            onMouseLeave={finishDrawing}
            className="w-full h-full cursor-crosshair touch-none"
          />
        </div>

        {/* Footer Bar */}
        <footer className="px-8 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-500">Live collaboration enabled</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tool: <span className="text-indigo-600">{selectedTool}</span></p>
        </footer>
      </div>
    </div>
  );
}
