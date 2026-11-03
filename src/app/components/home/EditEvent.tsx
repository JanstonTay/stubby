import { ChevronLeft, Check, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import type { PageType, CalendarEvent } from '../../App';

interface EditEventProps {
  onNavigate: (page: PageType, data?: any) => void;
  event?: CalendarEvent;
  onUpdateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
}

export function EditEvent({ onNavigate, event, onUpdateEvent }: EditEventProps) {
  const displayEvent: CalendarEvent = event || {
    id: 'demo-calendar-event',
    isoDate: '2025-11-07',
    date: 'Fri, Nov 7',
    booking: '5:00 PM',
    topic: 'FOP Assignment Review',
    location: 'Library Study Pod 3',
    name: 'Marcus Tan',
    status: 'Confirmed'
  };

  const [date, setDate] = useState(displayEvent.isoDate);
  const [time, setTime] = useState(displayEvent.booking);
  const [topic, setTopic] = useState(displayEvent.topic);
  const [location, setLocation] = useState(displayEvent.location);
  const [reason, setReason] = useState("Need to move this session to match my study partner's availability.");

  const handleSubmit = () => {
    // In a real app we'd send the request, here we update the event immediately
    onUpdateEvent(displayEvent.id, { 
      isoDate: date, 
      booking: time, 
      topic, 
      location,
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    });
    onNavigate('calendar-page');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-in slide-in-from-right duration-500">
      <header className="px-6 py-5 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
        <button 
          onClick={() => onNavigate('event-details', displayEvent)}
          aria-label="Back to event details"
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
        >
          <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
        </button>
        <div className="flex items-center justify-center gap-3">
          <Edit2 size={16} className="text-orange-500" />
          <h1 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em]">Request Edit</h1>
        </div>
        
        <div className="w-10"></div>
      </header>

      <main className="flex-1 p-6 space-y-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-slate-200 space-y-8 relative overflow-hidden group">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Date</label>
              <div className="relative">
                <Input 
                  type="date"
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-sm font-bold px-4 cursor-pointer transition-all focus:bg-white" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Time</label>
              <div className="relative">
                <Input 
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-sm font-bold px-4 transition-all focus:bg-white" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Person</label>
              <Input 
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-sm font-bold transition-all focus:bg-white" 
                defaultValue={displayEvent.name}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Study Topic</label>
              <Input 
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-sm font-bold transition-all focus:bg-white" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Location</label>
              <Input 
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-sm font-bold transition-all focus:bg-white" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Reason for Edit Request</label>
              <Textarea 
                className="min-h-[120px] rounded-2xl border-slate-100 bg-slate-50/50 text-xs font-medium leading-relaxed transition-all focus:bg-white" 
                placeholder="Please explain why you need to edit this event..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <Button 
              className="w-full rounded-2xl h-14 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-sm shadow-premium transition-all active:scale-95 flex gap-2"
              onClick={handleSubmit}
            >
              <Check size={18} />
              Submit Edit Request
            </Button>
            <Button 
              variant="ghost"
              className="w-full rounded-2xl h-12 text-slate-400 hover:text-slate-600 font-bold text-xs"
              onClick={() => onNavigate('event-details', displayEvent)}
            >
              Discard Changes
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
