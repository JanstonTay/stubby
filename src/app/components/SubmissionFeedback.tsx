import { useEffect } from 'react';
import { Loader2, X } from 'lucide-react';

interface SubmissionFeedbackProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function SubmissionFeedback({ message, onClose, duration = 3000 }: SubmissionFeedbackProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="absolute left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] top-[80px]">
      <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <Loader2 size={18} className="animate-spin flex-shrink-0 text-gray-900" />
        <p className="text-xs font-black uppercase tracking-tight flex-1 text-gray-900">{message}</p>
        <button 
          onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90 bg-gray-100 flex-shrink-0"
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
}
