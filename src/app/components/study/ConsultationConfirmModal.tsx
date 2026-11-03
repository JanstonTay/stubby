interface ConsultationConfirmModalProps {
  memberName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConsultationConfirmModal({ memberName, onConfirm, onCancel }: ConsultationConfirmModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl border-2 border-indigo-900 overflow-hidden text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-yellow-400">
          <span className="text-4xl">🙋‍♂️</span>
        </div>
        
        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Help Request!</h2>
        <p className="text-sm font-bold text-gray-500 mb-6 leading-relaxed">
          <span className="text-gray-900">{memberName}</span> has requested help. Would you like to start a consultation session with them?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl text-sm font-black uppercase tracking-wider transition-all active:scale-95 bg-gray-100 text-gray-900 hover:bg-gray-200"
          >
            Not Now
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl text-sm font-black uppercase tracking-wider transition-all active:scale-95 bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
