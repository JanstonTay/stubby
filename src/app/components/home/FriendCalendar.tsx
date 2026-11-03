import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import type { PageType, CalendarEvent } from '../../App';

interface FriendCalendarProps {
  onNavigate?: (page: PageType, data?: any) => void;
  events: CalendarEvent[];
  darkMode?: boolean;
}

export function FriendCalendar({ onNavigate, events, darkMode = false }: FriendCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10)); // November 2025
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDate(); 
  const isCurrentMonth = new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => {
    setCurrentDate((prev: Date) => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate((prev: Date) => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const days = daysInMonth(month, year);
  const offset = firstDayOfMonth(month, year);
  
  const dates = Array.from({ length: days }, (_, i) => i + 1);

  return (
    <div className={`p-7 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border space-y-6 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className={`text-xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Study Planner</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => onNavigate?.('calendar-page')}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all border hover:shadow-premium ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-400 hover:text-indigo-400 hover:bg-slate-600' : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-white'}`}
          >
            <Calendar size={20} />
          </button>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between px-2">
        <button 
          onClick={prevMonth}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors active:scale-90 ${darkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className={`text-sm font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{monthNames[month]} {year}</span>
        <button 
          onClick={nextMonth}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors active:scale-90 ${darkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1">
        {weekdays.map((day, i) => (
          <div key={i} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2">
            {day[0]}
          </div>
        ))}
        {/* Empty cells */}
        {[...Array(offset)].map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}
        
        {dates.map((date) => {
          const isToday = date === today && isCurrentMonth;
          const eventOnThisDay = events?.find(e => {
            const d = new Date(e.isoDate);
            return d.getDate() === date && d.getMonth() === month && d.getFullYear() === year;
          });
          const hasEvent = !!eventOnThisDay;
          
          return (
            <button
              key={date}
              onClick={() => hasEvent && onNavigate?.('event-details', eventOnThisDay)}
              className={`
                aspect-square flex flex-col items-center justify-center text-[13px] font-bold rounded-xl transition-all relative group
                ${isToday ? (darkMode ? 'bg-indigo-900/30 text-indigo-400 border border-indigo-500' : 'bg-indigo-50 text-indigo-600 border border-indigo-100') : ''}
                ${hasEvent && !isToday ? 'bg-indigo-600 text-white shadow-feature mb-0.5' : ''}
                ${!isToday && !hasEvent ? (darkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-50') : ''}
              `}
            >
              <span className="relative z-10">{date}</span>
            </button>
          );
        })}
      </div>

      <div className="pt-2 space-y-3">
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Upcoming Sessions</h4>
        {(events || []).slice(0, 1).map(event => (
          <div 
            key={event.id}
            onClick={() => onNavigate?.('event-details', event)}
            className={`p-4 rounded-2xl flex items-center gap-4 group cursor-pointer border transition-all active:scale-[0.98] ${darkMode ? 'bg-slate-900 border-slate-700 hover:bg-slate-700 hover:border-indigo-500/50' : 'bg-slate-50 border-transparent hover:bg-indigo-50/50 hover:border-indigo-100'}`}
          >
            <div className={`w-12 h-12 rounded-2xl border flex flex-col items-center justify-center shadow-sm group-hover:scale-105 transition-transform text-indigo-600 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <span className="text-sm font-black">{event.isoDate.split('-')[2]}</span>
              <span className="text-[9px] font-black uppercase text-slate-400">
                {new Date(event.isoDate).toLocaleString('en-US', { month: 'short' })}
              </span>
            </div>
            <div className="flex-1">
              <p className={`text-sm font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{event.topic}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin size={10} className="text-slate-400" />
                <p className="text-[11px] font-medium text-slate-500">{event.location}</p>
              </div>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-indigo-600 transition-transform group-hover:rotate-12 ${darkMode ? 'bg-indigo-500/20' : 'bg-indigo-50'}`}>
              <Calendar size={18} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}