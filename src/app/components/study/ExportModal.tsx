
import { Download, FileText, Image as ImageIcon, X } from 'lucide-react';

interface ExportModalProps {
  onClose: () => void;
}

export function ExportModal({ onClose }: ExportModalProps) {
  const handleExport = (format: 'pdf' | 'image') => {
    // Determine export logic here
    console.log(`Exporting as ${format}...`);
    // Ideally use window.print() or canvas to image logic
    // For now, just close
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-2 border-indigo-900 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Export Session</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-sm font-bold text-gray-500 mb-6 leading-relaxed">
          Save your consultation notes and whiteboard for future reference.
        </p>

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => handleExport('pdf')}
            className="group relative flex items-center p-4 rounded-2xl border-2 border-gray-100 hover:border-indigo-900 hover:bg-indigo-50 transition-all active:scale-95"
          >
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mr-4 group-hover:bg-red-200 transition-colors">
              <FileText size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-gray-900 uppercase text-xs tracking-wider mb-1">Download PDF</h3>
              <p className="text-[10px] font-bold text-gray-400">Best for printing & sharing</p>
            </div>
          </button>

          <button
            onClick={() => handleExport('image')}
            className="group relative flex items-center p-4 rounded-2xl border-2 border-gray-100 hover:border-indigo-900 hover:bg-indigo-50 transition-all active:scale-95"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
              <ImageIcon size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-gray-900 uppercase text-xs tracking-wider mb-1">Save Image</h3>
              <p className="text-[10px] font-bold text-gray-400">High quality whiteboard capture</p>
            </div>
          </button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
            <button 
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
            >
                Cancel
            </button>
        </div>
      </div>
    </div>
  );
}
