import { useState, useEffect } from 'react';
import { Play, Pause, MessageCircle, HelpCircle, ChevronRight, CheckCircle2, Target, Plus, Info, Video, Coffee, Zap, Brain, Sparkles, DoorOpen, ChevronLeft, X, Send, FileText, Edit3 } from 'lucide-react';
import type { PageType, AppState, Member, UserStatus } from '../../App';
import { ActivitySelectionModal } from './ActivitySelectionModal';
import { ConsultationConfirmModal } from './ConsultationConfirmModal';
import { ExitSessionModal } from './ExitSessionModal';

interface StudySessionProps {
  onNavigate: (page: PageType) => void;
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  darkMode?: boolean;
}

export function StudySession({ onNavigate, state, updateState, darkMode = false }: StudySessionProps) {
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [selectedHelper, setSelectedHelper] = useState<Member | null>(null);
  const [chatMessage, setChatMessage] = useState('Can someone explain Q2 before we start co-solve?');
  const [groupChatMessages, setGroupChatMessages] = useState([
    { id: 1, sender: 'Sarah', text: 'Anyone stuck on Q2?', time: '2:34 PM', isMe: false },
    { id: 2, sender: 'You', text: 'I just finished it!', time: '2:35 PM', isMe: true },
    { id: 3, sender: 'Marcus', text: 'Can someone explain the formula?', time: '2:36 PM', isMe: false },
  ]);

  const [sharedNotes] = useState([
    { id: 1, title: 'Tutorial Q1-Q3 Notes', content: 'Key points:\n• Formula derivation\n• Example problems\n• Common mistakes', lastEdited: '2 min ago' },
    { id: 2, title: 'Study Guide', content: 'Chapter 5 summary:\n• Definition of terms\n• Important theorems\n• Practice questions', lastEdited: '10 min ago' },
  ]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStatusChange = (status: UserStatus) => {
    updateState({ userStatus: status });
  };

  const handleHelpSelection = (member: Member) => {
    setSelectedHelper(member);
    setShowHelpModal(true);
  };

  const handleConfirmConsultation = () => {
    setShowHelpModal(false);
    onNavigate('consultation-student');
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    setGroupChatMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'You',
        text: chatMessage,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        isMe: true
      }
    ]);
    setChatMessage('');
  };

  // Mock progress for members
  const memberProgress = {
    '1': 60, // Alex
    '2': 45, // Sam
    '3': 75, // James
  };

  // Calculate focus distribution percentages
  const totalTracked = state.focusDuration + state.breakDuration || 1;
  const focusPercent = (state.focusDuration / totalTracked) * 100;

  return (
    <div className={`h-full flex flex-col overflow-hidden relative ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Consultation Reflection Prompt */}
      {state.showConsultationReflectionPrompt && (
        <div className={`absolute top-24 right-6 left-6 z-40 rounded-[2rem] border-2 p-6 shadow-premium animate-in slide-in-from-top-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-900'}`}>
          <div className="flex items-start justify-between mb-4">
            <p className={`text-xs font-black uppercase tracking-tight leading-relaxed ${darkMode ? 'text-white' : 'text-slate-900'}`}>Would you like to complete a consultation reflection?</p>
            <button
              onClick={() => updateState({ showConsultationReflectionPrompt: false })}
              className={`w-6 h-6 rounded-full flex items-center justify-center border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}
            >
              <X size={14} className={darkMode ? 'text-slate-400' : 'text-slate-400'} />
            </button>
          </div>
          <button
            onClick={() => {
              updateState({ showConsultationReflectionPrompt: false });
              onNavigate('consultation-reflection');
            }}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
          >
            Start Reflection
          </button>
        </div>
      )}

      {/* Header */}
      <div className={`backdrop-blur-xl border-b py-5 px-6 flex items-center justify-between sticky top-0 z-20 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/85 border-slate-100'}`}>
          <button 
            onClick={() => onNavigate('home')}
            aria-label="Back"
            className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all active:scale-95 shadow-sm group ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
          >
              <ChevronLeft size={20} className={`group-hover:text-indigo-600 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`} />
          </button>
          <div className="text-center">
            <h1 className={`text-[10px] font-black uppercase tracking-[.35em] ${darkMode ? 'text-white' : 'text-slate-900'}`}>Study Session</h1>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">Live Loop</span>
            </div>
          </div>
          <button
            onClick={() => setShowExitModal(true)}
            aria-label="End Session"
            className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all active:scale-95 shadow-sm group ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
          >
            <DoorOpen size={20} className={`group-hover:text-red-500 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`} />
          </button>
      </div>

      <div className="flex-1 px-6 flex flex-col gap-6 pt-6 pb-32 overflow-auto">
        {/* Timer & Micro-goal Section */}
        <div className={`rounded-[2rem] p-6 border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-6 mb-6">
            {/* Circular Timer */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="48" cy="48" r="42"
                  className={darkMode ? 'stroke-slate-700 fill-none' : 'stroke-gray-100 fill-none'}
                  style={{ strokeWidth: '8' }}
                />
                <circle
                  cx="48" cy="48" r="42"
                  className={`fill-none transition-all duration-1000 ${state.userStatus === 'focus' ? 'stroke-indigo-600' : 'stroke-amber-400'}`}
                  style={{
                    strokeWidth: '8',
                    strokeDasharray: 263.89,
                    strokeDashoffset: 263.89 - (263.89 * (state.sessionDuration % 3600)) / 3600,
                    strokeLinecap: 'round'
                  }}
                />
              </svg>
                <button 
                  onClick={() => updateState({ isSessionActive: !state.isSessionActive })}
                  aria-label={state.isSessionActive ? 'Pause Timer' : 'Start Timer'}
                  className="absolute inset-0 flex items-center justify-center group"
                >
                  <div className="text-center transition-transform group-hover:scale-110">
                    <p className={`text-xl font-bold tabular-nums leading-none ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatTime(state.sessionDuration)}</p>
                    <div className="flex justify-center mt-1">
                      {state.isSessionActive ? <Pause size={10} className={darkMode ? 'fill-white' : 'fill-gray-900'} /> : <Play size={10} className={(darkMode ? 'fill-white' : 'fill-gray-900') + " ml-0.5"} />}
                    </div>
                  </div>
                </button>
            </div>

            {/* Micro-goal */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Micro-goal</p>
                  <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Finish Tutorial Q1-Q3</p>
                </div>
                {/* Timer Controls Removed for Clean Look as per Wireframe */}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">Focus Tracker</p>
              <div className={`h-2 w-full rounded-full mt-2 overflow-hidden flex ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <div 
                    className="h-full bg-indigo-500 transition-all duration-500" 
                    style={{ width: `${focusPercent}%` }}
                ></div>
                <div 
                    className="h-full bg-amber-300 transition-all duration-500" 
                    style={{ width: `${100 - focusPercent}%` }}
                ></div>
              </div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mt-2 flex gap-2">
                <span>● Focusing: {formatTime(state.focusDuration)}</span>
                <span>● Break: {formatTime(state.breakDuration)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Squad Section - Combined Card */}
        <div className={`rounded-[2rem] p-6 border shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Members</h2>
            <button 
                onClick={() => setShowActivityModal(true)}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-indigo-700 active:scale-95 transition-all shadow-sm"
            >
              Start Activity
            </button>
          </div>
          
          <div className="space-y-4">
            {/* User Component */}
            <button 
                onClick={() => onNavigate('results')}
                className={`w-full text-left p-4 rounded-2xl border transition-all active:scale-[0.98] pointer-events-auto ${darkMode ? 'bg-slate-900/50 border-slate-600 hover:bg-slate-700' : 'bg-indigo-50/40 border-indigo-100 hover:bg-indigo-50'}`}
            >
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xl">
                        👨‍🎓
                    </div>
                    <div className="flex-1">
                        <p className={`text-xs font-bold uppercase ${darkMode ? 'text-white' : 'text-gray-900'}`}>You</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase">
                            {state.userStatus === 'focus' ? '⚡ Focusing' : state.userStatus === 'break' ? '☕ On Break' : '⚠️ Need Help'} • {formatTime(state.sessionDuration)} in status
                        </p>
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <span className="text-[8px] font-bold uppercase text-gray-400 tracking-wider">Goal-progress</span>
                        <span className="text-[8px] font-bold uppercase text-gray-400">80%</span>
                    </div>
                    <div className={`h-1.5 w-full rounded-full overflow-hidden border ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="h-full bg-indigo-600 w-[80%]"></div>
                    </div>
                </div>
            </button>

            {state.members.map(member => (
                <button 
                    key={member.id} 
                    onClick={() => handleHelpSelection(member)}
                className={`w-full text-left p-4 rounded-2xl border transition-all active:scale-[0.98] ${
                        member.status === 'need-help' 
                            ? (darkMode ? 'bg-amber-900/20 border-amber-600 hover:bg-amber-900/30' : 'bg-amber-50 border-amber-100 hover:bg-amber-50') 
                            : member.status === 'break'
                            ? (darkMode ? 'bg-slate-900/50 border-slate-600 hover:bg-slate-700' : 'bg-sky-50/60 border-sky-100 hover:bg-sky-50')
                            : (darkMode ? 'bg-slate-900/50 border-slate-600 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-indigo-50')
                    }`}
                >
                    <div className="flex items-center gap-4 mb-3">
                        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-xl transition-all ${darkMode ? 'bg-slate-800 border-slate-500' : 'bg-white border-slate-200'}`}>
                            {member.avatar}
                        </div>
                        <div className="flex-1">
                            <p className={`text-xs font-bold uppercase ${darkMode ? 'text-white' : 'text-gray-900'}`}>{member.name}</p>
                            <p className={`text-[9px] font-bold uppercase ${member.status === 'need-help' ? 'text-amber-600' : 'text-gray-400'}`}>
                                {member.status === 'focus' ? '⚡ Focusing' : member.status === 'break' ? '☕ On Break' : '⚠️ Need Help'} • {formatTime(member.statusTimer)} in status
                            </p>
                        </div>
                        {member.status === 'need-help' && (
                            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white animate-pulse shadow-sm transition-colors hover:bg-amber-600">
                                <HelpCircle size={16} />
                            </div>
                        )}
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <span className="text-[8px] font-bold uppercase text-gray-400 tracking-wider">Goal-progress</span>
                            <span className="text-[8px] font-bold uppercase text-gray-400">{memberProgress[member.id as keyof typeof memberProgress]}%</span>
                        </div>
                        <div className={`h-1.5 w-full rounded-full overflow-hidden border ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-gray-50 border-gray-100'}`}>
                            <div 
                                className={`h-full ${member.status === 'need-help' ? 'bg-amber-500' : 'bg-indigo-600'}`} 
                                style={{ width: `${memberProgress[member.id as keyof typeof memberProgress]}%` }}
                            ></div>
                        </div>
                    </div>
                </button>
            ))}
          </div>
        </div>

        {/* Split-Screen Notes & Chat View (Tablet Feature) */}
        <div className={`rounded-[2rem] border shadow-sm overflow-hidden ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className={`p-4 border-b-2 ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Study Workspace</h2>
          </div>
          <div className="flex h-96">
            {/* Left: Shared Notes */}
            <div className={`flex-[3] border-r-2 flex flex-col overflow-hidden ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
              <div className={`px-4 py-3 border-b flex items-center justify-between ${darkMode ? 'border-slate-700 bg-slate-900/50' : 'border-slate-100 bg-slate-50'}`}>
                <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-400">Shared Notes</h3>
                <button className="p-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
                  <Edit3 size={12} className="text-indigo-600" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {sharedNotes.map(note => (
                  <div
                    key={note.id}
                    className={`p-3 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] ${darkMode ? 'bg-slate-900/50 border-slate-600 hover:border-indigo-600' : 'bg-slate-50 border-slate-200 hover:border-indigo-300'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-indigo-600 flex-shrink-0" />
                        <p className={`text-[11px] font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{note.title}</p>
                      </div>
                      <span className="text-[8px] font-bold text-gray-400 whitespace-nowrap">{note.lastEdited}</span>
                    </div>
                    <p className={`text-[10px] whitespace-pre-line ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Group Chat */}
            <div className="flex-[2] flex flex-col">
              <div className={`px-4 py-3 border-b flex items-center gap-2 ${darkMode ? 'border-slate-700 bg-slate-900/50' : 'border-slate-100 bg-slate-50'}`}>
                <MessageCircle size={12} className="text-indigo-600" />
                <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-400">Group Chat</h3>
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500"></span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {groupChatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                      {!msg.isMe && (
                        <span className="text-[8px] font-bold text-gray-400 mb-0.5 px-1">{msg.sender}</span>
                      )}
                      <div
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-medium ${
                          msg.isMe
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : (darkMode ? 'bg-slate-900/80 border border-slate-600 text-white rounded-tl-none' : 'bg-slate-100 text-slate-900 rounded-tl-none')
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[8px] font-bold text-gray-400 mt-0.5 px-1">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`p-3 border-t ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type message..."
                    className={`flex-1 px-3 py-2 rounded-lg text-[11px] font-medium outline-none transition-all ${darkMode ? 'bg-slate-900/50 border border-slate-600 text-white placeholder:text-slate-500 focus:border-indigo-600' : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-300'}`}
                  />
                <button
                    onClick={handleSendMessage}
                    disabled={!chatMessage.trim()}
                    aria-label="Send Study Chat Message"
                    className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-lg disabled:bg-slate-300 disabled:text-slate-500 transition-all active:scale-90"
                  >
                    <Send size={14} className="translate-x-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className={`absolute bottom-4 left-6 right-6 p-4 backdrop-blur-md rounded-[2rem] border shadow-lg z-20 ${darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/95 border-slate-200'}`}>
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-3 ml-1">Your Status</p>
        <div className="flex gap-2">
            {[
                { id: 'focus' as UserStatus, label: 'Focusing', icon: Zap, active: state.userStatus === 'focus' },
                { id: 'break' as UserStatus, label: 'On Break', icon: Coffee, active: state.userStatus === 'break' },
                { id: 'need-help' as UserStatus, label: 'Need Help', icon: HelpCircle, active: state.userStatus === 'need-help' }
            ].map(status => (
                <button
                    key={status.id}
                    onClick={() => handleStatusChange(status.id)}
                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-tight flex items-center justify-center gap-1.5 transition-all border-2 ${
                        status.active 
                            ? status.id === 'focus' 
                                ? 'bg-indigo-600 border-indigo-600 text-white' 
                                : status.id === 'break'
                                ? 'bg-amber-500 border-amber-500 text-white'
                                : 'bg-red-500 border-red-500 text-white'
                            : (darkMode ? 'bg-slate-700 border-slate-600 text-slate-400 hover:border-slate-500' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300')
                    }`}
                >
                    <status.icon size={12} fill={status.active ? 'currentColor' : 'none'} />
                    {status.label}
                </button>
            ))}
        </div>
      </div>

      {/* FAB AI - Floating */}
      <button 
        onClick={() => onNavigate('ai-chatbot')}
        aria-label="Open AI Assistant"
        className="absolute bottom-28 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-90 transition-all z-30 animate-bounce"
        style={{ animationDuration: '2s', animationIterationCount: 'infinite' }}
      >
        <Sparkles size={24} className="animate-pulse" />
      </button>

      {/* Modals */}
      {showActivityModal && (
        <ActivitySelectionModal
          onClose={() => setShowActivityModal(false)}
          onSelect={(activity) => {
            setShowActivityModal(false);
            updateState({ isSessionActive: true });
            if (activity === 'co-solve') onNavigate('co-solve-lobby');
          }}
        />
      )}

      {showHelpModal && selectedHelper && (
        <ConsultationConfirmModal
          memberName={selectedHelper.name}
          onCancel={() => setShowHelpModal(false)}
          onConfirm={handleConfirmConsultation}
        />
      )}

      {showExitModal && (
        <ExitSessionModal
          onCancel={() => setShowExitModal(false)}
          onConfirm={() => {
            setShowExitModal(false);
            onNavigate('session-complete');
          }}
        />
      )}
    </div>
  );
}
