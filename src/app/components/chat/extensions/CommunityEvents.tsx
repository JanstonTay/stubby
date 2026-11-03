import React, { useState } from 'react';
import { ChevronLeft, Calendar, MapPin, User, Users, CheckCircle2 } from 'lucide-react';
import type { PageType } from '../../../App';

interface CommunityEventsProps {
  onNavigate: (page: PageType) => void;
  events: Event[];
  setEvents: (events: Event[]) => void;
}

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  participants: number;
  isParticipating: boolean;
}

export function CommunityEvents({ onNavigate, events, setEvents }: CommunityEventsProps) {

  const toggleParticipation = (id: number) => {
    setEvents(events.map(event => 
      event.id === id 
        ? { 
            ...event, 
            isParticipating: !event.isParticipating,
            participants: event.isParticipating ? event.participants - 1 : event.participants + 1
          } 
        : event
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 bg-white border-b border-slate-100 flex items-center gap-4 sticky top-0 z-40">
        <button 
          onClick={() => onNavigate('chat')}
          aria-label="Back"
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
        >
          <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
        </button>
        <div className="flex-1">
          <h1 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Community Events</h1>
          <p className="text-[10px] font-bold text-slate-400 mt-1">Join sessions and fairs</p>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-4 pb-32">
        {events.map((event) => (
          <div 
            key={event.id}
            className="bg-white rounded-[2.5rem] border border-slate-200 shadow-premium overflow-hidden animate-in slide-in-from-bottom-4 duration-500"
          >
            <div className="p-8 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">{event.title}</h3>
                  <p className="text-xs font-medium text-slate-500 leading-relaxed">{event.description}</p>
                </div>
                {event.isParticipating && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 animate-in zoom-in-50">
                    <CheckCircle2 size={12} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Going</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2.5 text-slate-400">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-indigo-600 border border-slate-100">
                    <Calendar size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Date & Time</span>
                    <span className="text-xs font-bold text-slate-700">{event.date} @ {event.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-400">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-indigo-600 border border-slate-100">
                    <MapPin size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Location</span>
                    <span className="text-xs font-bold text-slate-700 truncate">{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-400">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-indigo-600 border border-slate-100">
                    <User size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Organizer</span>
                    <span className="text-xs font-bold text-slate-700 truncate">{event.organizer}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-400">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-indigo-600 border border-slate-100">
                    <Users size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Participants</span>
                    <span className="text-xs font-bold text-slate-700">{event.participants} people</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                {event.isParticipating ? (
                  <button 
                    onClick={() => toggleParticipation(event.id)}
                    className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 border border-transparent"
                  >
                    Cancel Participation
                  </button>
                ) : (
                  <button 
                    onClick={() => toggleParticipation(event.id)}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 active:scale-[0.98] transition-all hover:bg-indigo-700"
                  >
                    Participate
                  </button>
                )}
              </div>
            </div>
            
            <div className="h-2 bg-indigo-600/5 px-8">
               <div className="h-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-1000" 
                    style={{ width: `${Math.min((event.participants / 200) * 100, 100)}%` }}
                  ></div>
               </div>
            </div>
          </div>
        ))}

        <p className="text-[10px] font-bold text-slate-400 text-center py-6 italic">
          Community events are organized by admins and verified users
        </p>
      </main>
    </div>
  );
}
