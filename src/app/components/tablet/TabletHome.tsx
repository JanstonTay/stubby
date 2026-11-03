import React from 'react';
import { Bell, Search, Sparkles, TrendingUp, Calendar as CalendarIcon, Clock, MapPin, ChevronRight, Target, Flame, Award, BookOpen, Users, ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import type { PageType, CalendarEvent } from '../../App';

interface TabletHomeProps {
  onNavigate: (page: PageType, data?: any) => void;
  events: CalendarEvent[];
  hasUnread?: boolean;
  userName?: string;
  darkMode?: boolean;
}

export function TabletHome({ onNavigate, events, hasUnread, userName = "James", darkMode = false }: TabletHomeProps) {
  const upcomingEvents = events.slice(0, 3);
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className={`h-full flex flex-col ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Compact Top Bar */}
      <div className={`border-b px-6 py-4 flex-shrink-0 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{greeting}, {userName}!</h1>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Here's your study overview</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="text"
                placeholder="Search students, modules..."
                onClick={() => onNavigate('search-overlay')}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('notifications')}
              className={`relative ${darkMode ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : ''}`}
            >
              <Bell className="w-5 h-5" />
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content - Single Column Bento Layout */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-4">
          {/* Top Stats Row - 3 compact cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card 
              className={`p-4 transition-shadow cursor-pointer ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-white' : 'bg-white border-slate-200 hover:shadow-md'}`} 
              onClick={() => onNavigate('progress-tracker')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                  <Flame className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                </div>
                <TrendingUp className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <div className={`text-2xl font-bold mb-0.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>12.5 hrs</div>
              <div className={`text-xs mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Study time</div>
              <div className={`text-xs font-medium ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>+2.5 hrs this week</div>
            </Card>

            <Card 
              className={`p-4 transition-shadow cursor-pointer ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-white' : 'bg-white border-slate-200 hover:shadow-md'}`} 
              onClick={() => onNavigate('matchmaking')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-indigo-500/10' : 'bg-indigo-50'}`}>
                  <Users className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                </div>
                <Badge variant="outline" className={`text-xs h-5 ${darkMode ? 'border-slate-600 text-slate-400' : ''}`}>Active</Badge>
              </div>
              <div className={`text-2xl font-bold mb-0.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>5</div>
              <div className={`text-xs mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Study partners</div>
              <div className={`text-xs font-medium ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>3 pending requests</div>
            </Card>

            <Card 
              className={`p-4 transition-shadow cursor-pointer ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-white' : 'bg-white border-slate-200 hover:shadow-md'}`} 
              onClick={() => onNavigate('progress-tracker')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                  <Award className={`w-5 h-5 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                </div>
                <Badge variant="outline" className={`text-xs h-5 ${darkMode ? 'border-slate-600 text-slate-400' : ''}`}>New</Badge>
              </div>
              <div className={`text-2xl font-bold mb-0.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>8 / 10</div>
              <div className={`text-xs mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Achievements</div>
              <div className={`text-xs font-medium ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>2 more to unlock</div>
            </Card>
          </div>

          {/* Study Progress Card - Horizontal Layout */}
          <Card className={`p-5 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Weekly Study Goal</h3>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>15 hour target • 83% complete</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onNavigate('progress-tracker')}
                className={darkMode ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : ''}
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Progress</span>
                  <span className={`text-sm font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>12.5 / 15 hrs</span>
                </div>
                <Progress value={83} className={`h-2 ${darkMode ? 'bg-slate-700' : ''}`} />
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className={`text-center p-3 rounded-lg ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                  <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>23</div>
                  <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Sessions</div>
                </div>
                <div className={`text-center p-3 rounded-lg ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                  <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>7</div>
                  <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Day Streak</div>
                </div>
                <div className={`text-center p-3 rounded-lg ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                  <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>5.2h</div>
                  <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>FOP2</div>
                </div>
                <div className={`text-center p-3 rounded-lg ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                  <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>4.8h</div>
                  <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>BED</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Two Column Layout for Sessions and AI */}
          <div className="grid grid-cols-2 gap-4">
            {/* Upcoming Sessions - Left */}
            <Card className={`p-5 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Upcoming Sessions</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onNavigate('calendar-page')}
                  className={darkMode ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : ''}
                >
                  <CalendarIcon className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2.5">
                {upcomingEvents.length > 0 ? (
                  <>
                    {upcomingEvents.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => onNavigate('event-details', event)}
                        className={`w-full p-3 rounded-lg transition-colors text-left flex items-start gap-3 ${
                          darkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-semibold ${
                          darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {event.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-medium text-sm mb-1 truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>{event.topic}</h4>
                          <div className={`flex items-center gap-1.5 text-xs mb-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            <Clock className="w-3 h-3" />
                            <span className="truncate">{event.date}</span>
                          </div>
                          <div className={`flex items-center gap-1.5 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className={`w-full mt-2 ${darkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white' : ''}`}
                      onClick={() => onNavigate('calendar-page')}
                    >
                      View All Sessions
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className={`w-10 h-10 mx-auto mb-2 ${darkMode ? 'text-slate-700' : 'text-slate-300'}`} />
                    <p className={`text-sm mb-3 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>No upcoming sessions</p>
                    <Button size="sm" onClick={() => onNavigate('matchmaking')}>
                      Find Partner
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* AI Assistant Card - Right */}
            <Card className={`p-5 flex flex-col border-0 ${
              darkMode 
                ? 'bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 text-white' 
                : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'
            }`}>
              <div className="mb-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${darkMode ? 'bg-indigo-500/30' : 'bg-indigo-500'}`}>
                  <Sparkles className={`w-7 h-7 ${darkMode ? 'text-indigo-400' : 'text-white'}`} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>AI Study Assistant</h3>
                  <Badge className="bg-indigo-500 text-white border-0 text-xs">Beta</Badge>
                </div>
                <p className={`text-sm mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Get personalized study recommendations, instant help with your modules, and smart scheduling suggestions.
                </p>
              </div>

              <div className="mt-auto space-y-2">
                <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span>24/7 availability</span>
                </div>
                <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span>Personalized to your modules</span>
                </div>
                <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span>Study tips & strategies</span>
                </div>
                <Button
                  onClick={() => onNavigate('ai-chatbot')}
                  className="bg-indigo-600 hover:bg-indigo-700 w-full mt-3"
                >
                  Start Chatting
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Quick Actions Row */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              className={`h-auto py-3 justify-start ${darkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : ''}`}
              onClick={() => onNavigate('matchmaking')}
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-indigo-500/20' : 'bg-indigo-50'}`}>
                  <Target className={`w-4 h-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                </div>
                <span className="text-sm font-medium">Find Partner</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className={`h-auto py-3 justify-start ${darkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : ''}`}
              onClick={() => onNavigate('study-session')}
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-emerald-500/20' : 'bg-emerald-50'}`}>
                  <BookOpen className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                </div>
                <span className="text-sm font-medium">Start Session</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className={`h-auto py-3 justify-start ${darkMode ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : ''}`}
              onClick={() => onNavigate('calendar-page')}
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-purple-500/20' : 'bg-purple-50'}`}>
                  <CalendarIcon className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <span className="text-sm font-medium">View Calendar</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
