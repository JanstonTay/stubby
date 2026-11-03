import { useState } from 'react';
import { ChevronLeft, MessageSquare, Send, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import type { PageType, CalendarEvent } from '../../App';

interface EventCommentsProps {
  onNavigate: (page: PageType, data?: any) => void;
  event?: CalendarEvent;
}

export function EventComments({ onNavigate, event }: EventCommentsProps) {
  const displayEvent: CalendarEvent = event || {
    id: 'demo-calendar-event',
    isoDate: '2025-11-07',
    date: 'Fri, Nov 7',
    booking: '5-7 PM',
    topic: 'FOP Assignment Review',
    location: 'Library Study Pod 3',
    name: 'Ryan',
    status: 'Confirmed'
  };
  const [commentText, setCommentText] = useState('Can we meet 15 minutes earlier?');
  const [localComments, setLocalComments] = useState([
    { id: 1, author: 'Admin', time: '1 day ago', content: 'Event confirmed. Looking forward to seeing you!', isAdmin: true },
    { id: 2, author: 'Ryan', time: '1 day ago', content: 'Can we confirm the location for this event?', isAdmin: false },
  ]);

  const handleSend = () => {
    if (!commentText.trim()) return;
    
    // Create new comment locally - NOT sending to global chat as per request
    const newComment = {
        id: Date.now(),
        author: 'You',
        time: 'Just now',
        content: commentText,
        isAdmin: false
    };

    setLocalComments(prev => [...prev, newComment]);
    setCommentText('');
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
          <MessageSquare size={18} className="text-indigo-600" />
          <h1 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em]">comments</h1>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 px-6 pb-6 pt-2 flex flex-col overflow-hidden">
        <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-premium shrink-0 mb-4">
          <div className="flex items-center gap-4 text-slate-400 justify-center">
            <Calendar size={14} className="text-slate-300" />
            <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.1em] flex items-center gap-3">
              <span>{displayEvent.date}</span>
              <span className="w-1 h-1 rounded-full bg-slate-200"></span>
              <span>{displayEvent.booking}</span>
              <span className="w-1 h-1 rounded-full bg-slate-200"></span>
              <span>{displayEvent.name}</span>
            </h2>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-[2.5rem] shadow-premium overflow-hidden">
          <div className="flex-1 p-6 space-y-8 overflow-y-auto">
            <div className="relative flex items-center">
              <div className="flex-1 h-px bg-slate-100"></div>
              <span className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap">Previous Comments</span>
              <div className="flex-1 h-px bg-slate-100"></div>
            </div>

            <div className="space-y-3">
              {localComments.map((comment) => (
                <div key={comment.id} className={`p-5 rounded-[2rem] border transition-all ${
                  comment.isAdmin 
                    ? 'bg-indigo-50/40 border-indigo-100/50 shadow-sm' 
                    : 'bg-slate-50 border-slate-100 shadow-sm'
                }`}>
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className={`text-[11px] font-black uppercase tracking-wider ${
                      comment.isAdmin ? 'text-indigo-600' : 'text-slate-900'
                    }`}>
                      {comment.author}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">{comment.time}</span>
                  </div>
                  <p className={`text-sm leading-relaxed font-bold ${
                    comment.isAdmin ? 'text-indigo-900/80' : 'text-slate-600'
                  }`}>
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-slate-50/30 border-t border-slate-100 space-y-4">
            <div className="relative">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Add a Comment</label>
              <div className="relative group">
                  <Input 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your comment here..." 
                    className="h-16 pl-6 pr-16 rounded-[2rem] border-slate-200 bg-white focus:bg-white focus:border-indigo-400 transition-all text-sm font-medium shadow-sm"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!commentText.trim()}
                    aria-label="Send comment"
                    className="absolute right-1 top-1 h-14 w-14 flex items-center justify-center bg-indigo-600 text-white rounded-[1.7rem] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:opacity-100 transition-all active:scale-90 shadow-lg shadow-indigo-100 hover:bg-indigo-700"
                  >
                    <Send size={24} className="-ml-1 translate-y-0.5" />
                  </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
