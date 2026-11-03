import { X, FileText, MessageSquare, StickyNote, Copy } from 'lucide-react';

interface ExportModalProps {
  onClose: () => void;
  onExport?: () => void;
}

export function ExportModal({ onClose, onExport }: ExportModalProps) {
  const handleAction = () => {
    if (onExport) onExport();
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl border-2 border-gray-900 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Export Session</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-900" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={handleAction} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-100 hover:bg-white border-2 border-transparent hover:border-gray-900 transition-all group">
                <FileText size={24} className="text-blue-500 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase text-gray-500">PDF Log</span>
            </button>
            <button onClick={handleAction} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-100 hover:bg-white border-2 border-transparent hover:border-gray-900 transition-all group">
                <MessageSquare size={24} className="text-green-500 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase text-gray-500">Chat History</span>
            </button>
            <button onClick={handleAction} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-100 hover:bg-white border-2 border-transparent hover:border-gray-900 transition-all group">
                <StickyNote size={24} className="text-amber-500 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase text-gray-500">Meeting Notes</span>
            </button>
            <button onClick={handleAction} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-100 hover:bg-white border-2 border-transparent hover:border-gray-900 transition-all group">
                <Copy size={24} className="text-purple-500 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase text-gray-500">Copy Path</span>
            </button>
        </div>

        <button
          onClick={handleAction}
          className="w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 bg-gray-900 text-white hover:bg-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
        >
          Export All Files
        </button>
      </div>
    </div>
  );
}
