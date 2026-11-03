import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import type { PageType, CalendarEvent } from '../../App';

interface CalendarPageProps {
  onNavigate: (page: PageType, data?: any) => void;
  events: CalendarEvent[];
  darkMode?: boolean;
}

export function CalendarPage({ onNavigate, events, darkMode = false }: CalendarPageProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10)); // November 2025
  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const bookedDates = events.map(e => e.isoDate); 
  const nextEvent = events[0];

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

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <header className={`px-6 py-5 border-b flex items-center justify-between sticky top-0 z-40 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <button 
          onClick={() => onNavigate('home')}
          aria-label="Back to home"
          className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all active:scale-95 shadow-sm group ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
        >
          <ChevronLeft size={20} className={`transition-colors group-hover:text-indigo-600 ${darkMode ? 'text-white' : 'text-slate-900'}`} />
        </button>
        <h1 className={`text-[14px] font-black uppercase tracking-[0.2em] flex-1 text-center ${darkMode ? 'text-white' : 'text-slate-900'}`}>Calendar & Schedule</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 p-6 space-y-6 pb-32">
        {/* Month View (Wireframe Step 3 & 4) */}
        <div className={`p-6 rounded-[2.5rem] shadow-premium border space-y-6 relative overflow-hidden group ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50 blur-3xl group-hover:bg-indigo-100 transition-colors"></div>
          
          <div className="flex items-center justify-between px-2 relative z-10">
            <h2 className={`text-sm font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-slate-900'}`}>{monthNames[month]} {year}</h2>
            <div className="flex gap-1">
              <button 
                onClick={prevMonth}
                aria-label="Previous month"
                className={`p-2 rounded-xl transition-all active:scale-90 ${darkMode ? 'text-white hover:bg-slate-700' : 'text-slate-900 hover:bg-slate-100'}`}
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextMonth}
                aria-label="Next month"
                className={`p-2 rounded-xl transition-all active:scale-90 ${darkMode ? 'text-white hover:bg-slate-700' : 'text-slate-900 hover:bg-slate-100'}`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 relative z-10">
            {weekdays.map((day, i) => (
              <div key={i} className={`text-center text-[10px] font-black py-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {day}
              </div>
            ))}
            {/* Pad leading empty cells */}
            {[...Array(offset)].map((_, i) => (
              <div key={`pad-${i}`} className="aspect-square"></div>
            ))}
            
            {Array.from({ length: days }, (_, i) => i + 1).map(date => {
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
              const isBooked = bookedDates.includes(dateStr);
              const eventForDate = events.find((event) => event.isoDate === dateStr);
              return (
                <button 
                  key={date}
                  type="button"
                  onClick={() => eventForDate && onNavigate('event-details', eventForDate)}
                  disabled={!eventForDate}
                  aria-label={eventForDate ? `Open ${eventForDate.topic} on ${eventForDate.date}` : `${date} ${monthNames[month]} ${year}`}
                  className={`aspect-square flex items-center justify-center text-xs font-bold rounded-xl transition-all
                    ${isBooked 
                        ? 'bg-indigo-600 text-white shadow-lg scale-105 hover:bg-indigo-700 active:scale-95 cursor-pointer' 
                        : (darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-50')
                    }
                  `}
                >
                  {date}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 px-2 text-[10px] font-medium text-slate-400 relative z-10">
            <div className="w-2.5 h-2.5 bg-indigo-600 rounded-[4px] shadow-sm"></div>
            <span>Booked Sessions</span>
          </div>
        </div>

        {nextEvent && (
          <button
            type="button"
            onClick={() => onNavigate('event-details', nextEvent)}
            className={`w-full rounded-[2rem] border p-5 text-left shadow-premium transition-all active:scale-[0.99] ${
              darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-indigo-50/50'
            }`}
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1">Next Study Session</p>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className={`text-sm font-black truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>{nextEvent.topic}</p>
                <p className={`text-xs font-bold truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{nextEvent.date} at {nextEvent.booking} with {nextEvent.name}</p>
              </div>
              <ChevronRight size={20} className="text-indigo-500 flex-shrink-0" />
            </div>
          </button>
        )}

        {/* Schedule Table (Wireframe Step 5, 6, 7, 8, 9) */}
        <div className={`rounded-[2.5rem] shadow-premium border overflow-hidden group ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className={`p-6 border-b flex items-center gap-2 ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
            <CalendarIcon size={18} className="text-indigo-600" />
            <h3 className={`text-sm font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-slate-900'}`}>Schedule Table</h3>
          </div>

          <div className="p-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b text-[10px] font-black uppercase tracking-widest sticky top-0 z-10 backdrop-blur-sm ${darkMode ? 'bg-slate-700/80 border-slate-600 text-white' : 'bg-slate-100/80 border-slate-200 text-slate-900'}`}>
                  <th className="py-4 px-4 text-left">Date</th>
                  <th className="py-4 px-4 text-left">Info</th>
                  <th className="py-4 px-4 text-left">Time</th>
                  <th className="py-4 px-4 text-left">Name</th>
                </tr>
              </thead>
              <tbody className={darkMode ? 'divide-y divide-slate-700' : 'divide-y divide-slate-100'}>
                {events.map((row, i) => (
                  <tr 
                    key={row.id} 
                    onClick={() => onNavigate('event-details', row)}
                    className={`text-[11px] font-medium transition-all group/row cursor-pointer active:bg-indigo-50 ${darkMode ? 'text-slate-300 hover:bg-indigo-900/20' : 'text-slate-600 hover:bg-indigo-50/40'}`}
                  >
                    <td className="py-5 px-4 transition-colors">
                      <div className={`font-medium transition-colors group-hover/row:text-indigo-600 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{row.date}</div>
                    </td>
                    <td className="py-5 px-3">
                      <div className={`font-medium mt-0.5 line-clamp-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{row.topic} • {row.location}</div>
                    </td>
                    <td className={`py-5 px-3 font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>{row.booking}</td>
                    <td className={`py-5 px-3 font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>{row.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
