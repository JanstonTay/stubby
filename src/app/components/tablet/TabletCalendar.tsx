import React, { useState } from 'react';
import { Plus, Calendar as CalendarIcon, Clock, MapPin, Edit, Trash2, MessageCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import type { PageType, CalendarEvent } from '../../App';

interface TabletCalendarProps {
  onNavigate: (page: PageType, data?: any) => void;
  events: CalendarEvent[];
  onUpdateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  onDeleteEvent: (id: string) => void;
  darkMode?: boolean;
}

export function TabletCalendar({
  onNavigate,
  events,
  onUpdateEvent,
  onDeleteEvent,
  darkMode = false
}: TabletCalendarProps) {
  const [view, setView] = useState<'month' | 'week' | 'agenda'>('agenda');

  // Get events for today and upcoming
  const today = new Date();
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.isoDate);
    return eventDate.toDateString() === today.toDateString();
  });

  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.isoDate);
      return eventDate > today;
    })
    .sort((a, b) => new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime());

  const pastEvents = events
    .filter(event => {
      const eventDate = new Date(event.isoDate);
      return eventDate < today && eventDate.toDateString() !== today.toDateString();
    })
    .sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime())
    .slice(0, 5);

  return (
    <div className={`h-full overflow-y-auto ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Calendar</h2>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{events.length} total sessions</p>
          </div>
          <Button
            size="icon"
            className="size-12"
            onClick={() => {
              alert('Create new event functionality');
            }}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* View Selector */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={view === 'agenda' ? 'default' : (darkMode ? 'secondary' : 'outline')}
            size="sm"
            onClick={() => setView('agenda')}
            className={`h-12 px-5 text-base font-semibold ${darkMode && view !== 'agenda' ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white' : ''}`}
          >
            Agenda
          </Button>
          <Button
            variant={view === 'week' ? 'default' : (darkMode ? 'secondary' : 'outline')}
            size="sm"
            onClick={() => setView('week')}
            className={`h-12 px-5 text-base font-semibold ${darkMode && view !== 'week' ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white' : ''}`}
          >
            Week
          </Button>
          <Button
            variant={view === 'month' ? 'default' : (darkMode ? 'secondary' : 'outline')}
            size="sm"
            onClick={() => setView('month')}
            className={`h-12 px-5 text-base font-semibold ${darkMode && view !== 'month' ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white' : ''}`}
          >
            Month
          </Button>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {/* Today's Events */}
          {todayEvents.length > 0 && (
            <div>
              <h3 className={`font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                Today
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {todayEvents.map(event => (
                  <Card
                    key={event.id}
                    className={`p-4 transition-all cursor-pointer ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-750' : 'bg-white border-slate-200 hover:shadow-md'}`}
                    onClick={() => onNavigate('event-details', event)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`}>
                          {event.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>{event.topic}</h4>
                          <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>with {event.name}</p>
                        </div>
                      </div>
                      <Badge
                        className={`text-xs ${
                          event.status === 'Confirmed'
                            ? (darkMode ? 'bg-emerald-500/20 text-emerald-400 border-0' : 'bg-emerald-100 text-emerald-700')
                            : (darkMode ? 'bg-amber-500/20 text-amber-400 border-0' : 'bg-amber-100 text-amber-700')
                        }`}
                      >
                        {event.status}
                      </Badge>
                    </div>

                    <div className="space-y-1.5">
                      <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{event.booking}</span>
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div>
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Upcoming</h3>
              <div className="grid grid-cols-2 gap-3">
                {upcomingEvents.map(event => (
                  <Card
                    key={event.id}
                    className={`p-4 transition-all cursor-pointer ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-750' : 'bg-white border-slate-200 hover:shadow-md'}`}
                    onClick={() => onNavigate('event-details', event)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`}>
                          {event.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>{event.topic}</h4>
                          <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>with {event.name}</p>
                        </div>
                      </div>
                      <Badge
                        className={`text-xs ${
                          event.status === 'Confirmed'
                            ? (darkMode ? 'bg-emerald-500/20 text-emerald-400 border-0' : 'bg-emerald-100 text-emerald-700')
                            : (darkMode ? 'bg-amber-500/20 text-amber-400 border-0' : 'bg-amber-100 text-amber-700')
                        }`}
                      >
                        {event.status}
                      </Badge>
                    </div>

                    <div className="space-y-1.5">
                      <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>{event.date}</span>
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{event.booking}</span>
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div>
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-slate-600' : 'text-slate-500'}`}>Past</h3>
              <div className="grid grid-cols-2 gap-3">
                {pastEvents.map(event => (
                  <Card
                    key={event.id}
                    className={`p-4 transition-all cursor-pointer opacity-60 ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-750' : 'bg-white border-slate-200 hover:shadow-md'}`}
                    onClick={() => onNavigate('event-details', event)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${darkMode ? 'bg-slate-700 text-slate-500' : 'bg-slate-100 text-slate-700'}`}>
                          {event.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>{event.topic}</h4>
                          <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>with {event.name}</p>
                        </div>
                      </div>
                      <Badge
                        className={`text-xs ${
                          event.status === 'Confirmed'
                            ? (darkMode ? 'bg-emerald-500/20 text-emerald-400 border-0' : 'bg-emerald-100 text-emerald-700')
                            : (darkMode ? 'bg-amber-500/20 text-amber-400 border-0' : 'bg-amber-100 text-amber-700')
                        }`}
                      >
                        {event.status}
                      </Badge>
                    </div>

                    <div className="space-y-1.5">
                      <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>{event.date}</span>
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{event.booking}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {events.length === 0 && (
            <Card className={`p-12 text-center ${darkMode ? 'bg-slate-800 border-slate-700' : 'border-slate-200'}`}>
              <CalendarIcon className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-slate-700' : 'text-slate-300'}`} />
              <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>No events scheduled</h3>
              <p className={`text-sm mb-4 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                Start by finding a study partner
              </p>
              <Button onClick={() => onNavigate('matchmaking')}>
                Find Study Partner
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
