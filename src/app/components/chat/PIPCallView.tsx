import { Minimize2, Maximize2, PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, User } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PIPCallViewProps {
  chat: any;
  type: 'voice' | 'video';
  onEndCall: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

export function PIPCallView({ chat, type, onEndCall, isMinimized, onToggleMinimize }: PIPCallViewProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(type === 'video');
  const [duration, setDuration] = useState(0);

  const isGroup = chat?.type === 'group' || chat?.type === 'community' || chat?.name?.toLowerCase().includes('group');

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const participants = [
    { name: 'You', initial: 'Y', status: 'Active', isMuted: false },
    { name: 'John', initial: 'J', status: 'Active', isMuted: true },
    { name: 'Sarah', initial: 'S', status: 'Active', isMuted: false },
    { name: 'Mike', initial: 'M', status: 'Active', isMuted: false },
  ];

  // Minimized PIP View
  if (isMinimized) {
    return (
      <div 
        onClick={onToggleMinimize}
        className="absolute top-6 right-6 z-[200] cursor-pointer group animate-in slide-in-from-top-4 duration-500"
      >
        <div className="w-56 h-40 bg-[#1a1c1e] rounded-2xl shadow-2xl border-2 border-white/10 overflow-hidden relative">
          {/* Main preview area */}
          <div className="absolute inset-0 flex items-center justify-center bg-[#2a2c2e]">
            <div className="w-16 h-16 rounded-full bg-[#3e3e3e] flex items-center justify-center border border-white/20">
              <span className="text-2xl text-white/50">{chat?.name?.charAt(0) || 'S'}</span>
            </div>
          </div>
          
          {/* Small self-video window at top-right (always visible for video calls) */}
          {isVideoOn && (
            <div className="absolute top-2 right-2 w-16 h-20 bg-[#3e3e3e] rounded-lg border border-white/20 flex items-center justify-center overflow-hidden">
              <User className="text-white/30" size={20} />
            </div>
          )}

          {/* Status Bar */}
          <div className="absolute top-3 left-3 right-20 flex items-center justify-between">
            <div className="px-2 py-1 bg-black/40 backdrop-blur-md rounded-full">
              <span className="text-[9px] text-white/80 font-bold">{formatDuration(duration)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {isMuted && (
                <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center">
                  <MicOff size={12} className="text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Hover overlay with expand hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 size={24} className="text-white drop-shadow-lg" />
            </div>
          </div>

          {/* End call button on hover */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEndCall();
            }}
            className="absolute bottom-3 right-3 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
          >
            <PhoneOff size={14} className="text-white rotate-[135deg]" />
          </button>
        </div>
      </div>
    );
  }

  // Full Screen View - Constrained to tablet size
  return (
    <div className="absolute inset-0 z-[150] flex flex-col bg-[#1a1c1e] text-white animate-in fade-in duration-300">
      {/* Minimize Button */}
      <button
        onClick={onToggleMinimize}
        className="absolute top-6 left-6 z-50 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all active:scale-95"
      >
        <Minimize2 size={18} className="text-white" />
      </button>

      {/* Top Header - Timer */}
      <div className="absolute top-6 left-20 z-50">
        <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-xs font-bold">
          {formatDuration(duration)}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative">
        {/* VIDEO CALL (FRIEND) - Matches reference image */}
        {isVideoOn && !isGroup && (
          <>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a1c1e]">
              <div className="flex flex-col items-center animate-in zoom-in duration-500">
                <div className="w-32 h-32 rounded-full border-4 border-slate-700/50 bg-[#3e3e3e] flex items-center justify-center mb-4 shadow-2xl">
                  <span className="text-5xl font-normal opacity-50">{chat?.name?.charAt(0) || 'S'}</span>
                </div>
                <h2 className="text-sm font-bold opacity-80 tracking-tight">{chat?.name || 'Sarah Johnson'}</h2>
              </div>
            </div>

            {/* Self Preview Window at top-right */}
            <div className="absolute top-8 right-8 w-24 h-32 bg-[#3e3e3e]/80 rounded-2xl border border-white/10 flex items-center justify-center z-10 shadow-2xl overflow-hidden">
              <User className="text-white opacity-20" size={32} />
            </div>
          </>
        )}

        {/* VIDEO CALL (GROUP) */}
        {isVideoOn && isGroup && (
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5 bg-black pt-20">
            {participants.map((p, i) => (
              <div key={i} className="bg-[#1a1c1e] flex flex-col items-center justify-center relative border border-white/5">
                <div className="w-16 h-16 rounded-full bg-[#3e3e3e] border border-white/10 flex items-center justify-center mb-2 shadow-lg">
                  <span className="text-xl font-bold opacity-60 text-white">{p.initial}</span>
                </div>
                <p className="text-[10px] font-bold opacity-60 text-white">{p.name}</p>
                
                {p.isMuted && (
                  <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center shadow-lg">
                    <MicOff size={10} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* VOICE CALL (FRIEND) */}
        {!isVideoOn && !isGroup && (
          <div className="flex flex-col items-center animate-in fade-in duration-700">
            <div className="w-48 h-48 rounded-full bg-[#3e3e3e] flex items-center justify-center text-white/50 border-4 border-white/5 mb-12 shadow-2xl">
              <span className="text-6xl font-normal opacity-40">{chat?.name?.charAt(0) || 'S'}</span>
            </div>
            
            <div className="text-center space-y-1 mb-2">
              <h2 className="text-2xl font-bold tracking-tight">{chat?.name || 'Sarah Johnson'}</h2>
              <p className="text-xs text-slate-500 font-medium">Voice Call</p>
            </div>

            <p className="text-sm font-medium text-slate-500 mb-12">{formatDuration(duration)}</p>

            <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[9px]">
              <Volume2 size={14} />
              <span>Speaker</span>
            </div>
          </div>
        )}

        {/* VOICE CALL (GROUP) */}
        {!isVideoOn && isGroup && (
          <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
            <h2 className="text-2xl font-black uppercase tracking-widest text-center mb-1">
              {chat?.name || 'CS 101 Study Group'}
            </h2>
            
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-16 italic">
              Group Voice Call • {formatDuration(duration)}
            </p>

            <div className="grid grid-cols-2 gap-x-12 gap-y-12 mb-16">
              {participants.map((p, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center border transition-all ${
                    p.initial === 'Y' ? 'bg-indigo-600/20 border-indigo-500' : 'bg-[#3e3e3e] border-white/10'
                  } mb-3 shadow-lg`}>
                    <span className="text-2xl font-bold text-white/60">{p.initial}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold mb-0.5">{p.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <p className="text-[9px] font-black text-white uppercase tracking-tighter opacity-80">Active</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[9px]">
              <Volume2 size={14} />
              <span>Speaker</span>
            </div>
          </div>
        )}
      </main>

      {/* Control Area */}
      <footer className="w-full pt-10 pb-12 border-t border-white/5 bg-[#111214]">
        <div className="max-w-xs mx-auto flex items-center justify-between mb-6">
          {/* Mute */}
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center bg-[#3e3e3e] border border-white/10 ${isMuted ? 'text-rose-500' : 'text-white'}`}
          >
            {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
          </button>

          {/* Camera */}
          <button 
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`w-14 h-14 rounded-full flex items-center justify-center border border-white/10 ${isVideoOn ? 'bg-indigo-600 text-white' : 'bg-[#3e3e3e] text-white'}`}
          >
            {isVideoOn ? <Video size={22} /> : <VideoOff size={22} />}
          </button>

          {/* Speaker */}
          <button 
            className="w-14 h-14 rounded-full flex items-center justify-center bg-[#3e3e3e] border border-white/10 text-white"
          >
            <Volume2 size={22} />
          </button>

          {/* End Call */}
          <button 
            onClick={onEndCall}
            className="w-14 h-14 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-rose-500/10 active:scale-95 transition-transform"
          >
            <PhoneOff size={24} strokeWidth={2.5} className="rotate-[135deg]" />
          </button>
        </div>
        
        {!isGroup && isVideoOn && (
          <p className="text-center text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">{chat?.name}</p>
        )}
      </footer>
    </div>
  );
}