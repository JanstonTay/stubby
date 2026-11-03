import { ChevronLeft, Calendar, Plus, X, MapPin, Users, Clock, CheckCircle2, Info } from 'lucide-react';
import { globalStudents } from '../../../App';
import { useState } from 'react';
import type { PageType } from '../../../App';

interface StudyPlannerProps {
  onNavigate: (page: PageType) => void;
  sessions: any[];
  setSessions: (sessions: any[]) => void;
  chat?: any;
}

export function StudyPlanner({ onNavigate, sessions, setSessions, chat }: StudyPlannerProps) {
  const [showNewSession, setShowNewSession] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // New Session State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  const [startTime, setStartTime] = useState('14:00');
  const [duration, setDuration] = useState('2 hours');
  const [topic, setTopic] = useState('FOP array practice and tutorial Q1-Q3');
  const [location, setLocation] = useState<'Online' | 'In-Person'>('Online');
  const [partnerName, setPartnerName] = useState('Sarah Lim');
  const [partners, setPartners] = useState<string[]>(() => {
    if (!chat) return ['Sarah Lim'];
    if (chat.type === 'group') {
        // Auto-fill with "team members" (simulated from globalStudents for wireframe)
        // Check for specific group members if available, otherwise mock
        const groupMembers = globalStudents.slice(0, 3).map(s => s.name); 
        return groupMembers;
    }
    // General/Friend chat: just the partner
    return [chat.name];
  });

  // Filter sessions for the current chat context if available
  const displaySessions = chat 
    ? sessions.filter(s => s.partnerName === chat.name || (s.partners && s.partners.includes(chat.name.split(' ')[0]))) 
    : sessions;

  const handleCreateSession = () => {
    // Format Date: "2026-01-24" -> "Sat, Jan 24"
    const dateObj = new Date(date);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
    const dayNum = dateObj.getDate();
    const formattedDate = `${dayName}, ${monthName} ${dayNum}`; // "Sat, Jan 24"

    // Calculate End Time
    const [hours, minutes] = startTime.split(':').map(Number);
    const durationHours = parseInt(duration);
    let endHours = hours + durationHours;
    const ampm = endHours >= 12 ? 'PM' : 'AM';
    const startAmpm = hours >= 12 ? 'PM' : 'AM';
    const displayStartHours = hours % 12 || 12;
    const displayEndHours = endHours % 12 || 12;
    const timeString = `${displayStartHours}:${minutes.toString().padStart(2, '0')} ${startAmpm} - ${displayEndHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;

    const newSession = {
      id: Date.now(),
      time: timeString,
      date: formattedDate,
      isoDate: date, // Keep YYYY-MM-DD for accurate linking
      location: location,
      partners: partners,
      partnerName: chat ? chat.name : undefined,
      topic: topic || 'Study Session'
    };
    setSessions([newSession, ...sessions]);
    setShowNewSession(false);
    setShowSuccess(true);
    
    // Reset form
    setTopic('');
    setPartners(chat ? [chat.name] : []);
  };

  const handleAddPartner = () => {
    if (partnerName.trim() && !partners.includes(partnerName.trim())) {
      setPartners([...partners, partnerName.trim()]);
      setPartnerName('');
    }
  };

  const isAutoFilled = !!chat; // If coming from chat, it's auto-filled/read-only

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
          <h1 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Study Planner</h1>
          <p className="text-[10px] font-bold text-slate-400 mt-1">Manage your study sessions</p>
        </div>
      </header>

      <main className="flex-1 p-6 relative">
        {sessions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4 py-20 px-10 text-center">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 animate-in zoom-in-50 duration-500 shadow-sm border border-indigo-100">
              <Calendar size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black text-slate-900 tracking-tight">No study sessions planned</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Click "Add Session" to create one</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-32">
            {displaySessions.map((session) => (
              <div 
                key={session.id}
                onClick={() => onNavigate('event-details', { 
                    id: `evt-${session.id}`,
                    // Map to EventDetails expected format
                    topic: session.topic || 'Study Session', 
                    title: session.topic || 'Study Session', // Fallback
                    date: session.date,
                    booking: session.time, // EventDetails uses 'booking', StudyPlanner uses 'time'
                    location: session.location,
                    name: session.partnerName || session.partners.join(', ') || 'Study Group',
                    isoDate: session.isoDate,
                    description: `Study session with ${session.partners.join(', ')}`,
                    isOnline: session.location === 'Online'
                })}
                className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-3 animate-in slide-in-from-top-2 active:scale-[0.98] transition-all cursor-pointer hover:border-indigo-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-indigo-600" />
                    <span className="text-sm font-black text-slate-900">{session.time}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{session.date}</span>
                </div>
                {session.topic && (
                    <p className="text-xs font-bold text-slate-700 line-clamp-1">{session.topic}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin size={14} />
                    <span className="text-xs font-bold">{session.location}</span>
                  </div>
                  {session.partners?.length > 0 && (
                    <div className="flex -space-x-2">
                      {session.partners.map((p: string, i: number) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[8px] font-black text-indigo-600 uppercase">
                          {p.charAt(0)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fixed Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 px-6 py-6 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] z-50">
          <button 
            onClick={() => setShowNewSession(true)}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl flex items-center justify-center gap-2 text-xs font-black shadow-lg shadow-indigo-100 active:scale-[0.98] transition-all"
          >
            <Plus size={18} />
            <span>Add Study Session</span>
          </button>
        </div>
      </main>

      {/* New Session Modal (6.1.3a) */}
      {showNewSession && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowNewSession(false)}></div>
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-premium relative z-10 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">New Study Session</h3>
              <button onClick={() => setShowNewSession(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                <input 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-14 px-5 bg-indigo-50/50 rounded-2xl border border-transparent text-sm font-black text-slate-900 focus:bg-white focus:border-indigo-100 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time & Duration</label>
                <div className="flex gap-2">
                  <input 
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="flex-1 h-14 px-5 bg-indigo-50/50 rounded-2xl border border-transparent text-sm font-black text-slate-900 focus:bg-white focus:border-indigo-100 outline-none transition-all"
                  />
                  <select 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-32 h-14 px-4 bg-indigo-50/50 rounded-2xl border border-transparent text-sm font-black text-slate-900 focus:bg-white focus:border-indigo-100 outline-none transition-all appearance-none"
                  >
                    <option value="1 hour">1 hour</option>
                    <option value="2 hours">2 hours</option>
                    <option value="3 hours">3 hours</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                <div className="flex bg-indigo-50/50 p-1 rounded-2xl border border-indigo-100">
                  <button 
                    onClick={() => setLocation('Online')}
                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${location === 'Online' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-indigo-400'}`}
                  >Online</button>
                  <button 
                    onClick={() => setLocation('In-Person')}
                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${location === 'In-Person' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-indigo-400'}`}
                  >In-Person</button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Study Partners</label>
                
                {!isAutoFilled && (
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <select
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        className="w-full h-14 px-5 bg-indigo-50/50 border border-transparent rounded-2xl text-sm font-black text-slate-900 focus:bg-white focus:border-indigo-100 outline-none transition-all appearance-none"
                      >
                        <option value="">Select a partner...</option>
                        <optgroup label="All Students">
                          {globalStudents.map(student => (
                            <option key={student.name} value={student.name}>
                              {student.name}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400">
                        <Users size={16} />
                      </div>
                    </div>
                    <button 
                      onClick={handleAddPartner}
                      className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center active:scale-95 transition-all shadow-lg shadow-indigo-100"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                )}

                {partners.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {partners.map((p, i) => (
                      <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-lg border border-indigo-100 animate-in zoom-in-50">
                        {p}
                      </span>
                    ))}
                  </div>
                ) : isAutoFilled ? (
                   <p className="text-xs font-bold text-slate-400 italic">No partners available.</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Topics</label>
                <textarea 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="What topics will you cover?"
                  className="w-full h-24 p-5 bg-indigo-50/50 border border-transparent rounded-2xl text-sm font-bold text-slate-900 placeholder:text-indigo-200 focus:bg-white focus:border-indigo-100 outline-none transition-all resize-none"
                />
              </div>

              <button 
                onClick={handleCreateSession}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-indigo-100 active:scale-[0.98] transition-all"
              >
                Save Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal (6.1.3b) */}
      {showSuccess && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowSuccess(false)}></div>
          <div className="bg-white w-full max-w-[280px] rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 p-8 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-2">
              <CheckCircle2 size={40} />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-black text-slate-900 tracking-tight">Session Created!</h4>
              <p className="text-xs font-bold text-slate-400">Your study session has been added to the schedule</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
