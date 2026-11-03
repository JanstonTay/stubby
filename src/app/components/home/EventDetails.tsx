import { useState } from 'react';
import { ChevronLeft, Calendar, Clock, User, Edit2, XCircle, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import type { PageType, CalendarEvent } from '../../App';

interface EventDetailsProps {
  onNavigate: (page: PageType, data?: any) => void;
  event?: CalendarEvent;
  onCancelEvent: (id: string) => void;
}

export function EventDetails({ onNavigate, event, onCancelEvent }: EventDetailsProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Default event object in case one isn't provided (fallback)
  const displayEvent = event || {
    id: '0',
    name: 'Ryan',
    date: 'Fri, Nov 7',
    status: 'Confirmed',
    booking: '5-7 PM',
    topic: 'FOP Assignment',
    location: 'Library',
    isoDate: '2025-11-07'
  };

  const handleCancel = () => {
    onCancelEvent(displayEvent.id);
    setShowCancelModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-in fade-in duration-500 relative">
      <header className="px-6 py-5 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
        <button 
          onClick={() => onNavigate('calendar-page')}
          aria-label="Back to calendar"
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
        >
          <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
        </button>
        <div className="flex items-center justify-center gap-3">
          <Calendar size={18} className="text-indigo-600" />
          <h1 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em]">Scheduled Details</h1>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 p-6 space-y-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-slate-200 space-y-8 relative overflow-hidden group">
          <div className="space-y-6">
            <div className="space-y-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Date:</span>
                <span className="text-sm font-bold text-slate-900">{displayEvent.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Time:</span>
                <span className="text-sm font-bold text-slate-900">{displayEvent.booking}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Study Topic:</span>
                <span className="text-sm font-bold text-slate-900 text-right">{displayEvent.topic}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Location:</span>
                <span className="text-sm font-bold text-slate-900">{displayEvent.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Person:</span>
                <span className="text-sm font-bold text-slate-900">{displayEvent.name}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="rounded-2xl h-12 border-slate-200 hover:bg-slate-50 hover:text-warning-600 hover:border-warning-100 text-slate-600 font-bold text-xs flex gap-2 group"
                onClick={() => onNavigate('edit-event', displayEvent)}
              >
                <Edit2 size={14} className="group-hover:text-indigo-600" />
                Request Edit
              </Button>
              <Button 
                variant="outline" 
                className="rounded-2xl h-12 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 text-slate-600 font-bold text-xs flex gap-2 group"
                onClick={handleCancel}
              >
                <XCircle size={14} className="group-hover:text-red-600" />
                Cancel
              </Button>
            </div>

            <Button 
              variant="outline" 
              className="w-full rounded-2xl h-12 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs flex gap-2 group"
              onClick={() => onNavigate('event-comments', displayEvent)}
            >
              <MessageSquare size={14} className="group-hover:text-indigo-600" />
              Comments
            </Button>
          </div>
        </div>
      </main>

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCancelModal(false)}></div>
          
          <div className="bg-white w-full max-w-[300px] rounded-[3rem] p-10 text-center space-y-8 shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="w-24 h-24 bg-rose-50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-sm relative">
              <XCircle className="text-rose-600 w-12 h-12" />
              <div className="absolute -inset-3 bg-rose-600/10 rounded-[2.5rem] animate-pulse"></div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Booking Cancelled</h3>
              <p className="text-[13px] font-medium text-slate-500 leading-relaxed px-2">
                Your scheduled event for <span className="text-indigo-600 font-bold">{displayEvent.date} at {displayEvent.booking}</span> has been cancelled.
              </p>
            </div>

            <Button 
              className="w-full h-14 bg-slate-900 hover:bg-indigo-600 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl shadow-premium transition-all active:scale-95"
              onClick={() => onNavigate('calendar-page')}
            >
              Back to Calendar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
