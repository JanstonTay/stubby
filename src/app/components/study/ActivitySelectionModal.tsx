import { X, Users } from 'lucide-react';

interface ActivitySelectionModalProps {
  onClose: () => void;
  onSelect: (activity: string) => void;
}

export function ActivitySelectionModal({ onClose, onSelect }: ActivitySelectionModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-6">
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xs bg-white rounded-[2rem] p-6 shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Select Activity</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-900" />
          </button>
        </div>
        
        <button
          onClick={() => onSelect('co-solve')}
          className="w-full p-4 rounded-2xl mb-4 text-left transition-all active:scale-95 group border border-slate-200 hover:border-indigo-200 bg-slate-50 hover:bg-white"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 group-hover:bg-blue-600 transition-colors">
              <Users size={24} className="text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="text-lg font-black text-gray-900 uppercase">Co-Solve</p>
              <p className="text-sm text-gray-500 font-bold">Work together on problems</p>
            </div>
          </div>
        </button>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl text-sm font-black uppercase tracking-wider transition-all active:scale-95 bg-gray-100 text-gray-900 hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
