import { useState } from 'react';
import { ChevronLeft, Send, AlertTriangle } from 'lucide-react';
import type { PageType } from '../../App';

interface ConsultationChatLogProps {
  onNavigate: (page: PageType) => void;
}

interface Message {
  id: number;
  sender: 'instructor' | 'student';
  text: string;
  time: string;
}

export function ConsultationChatLog({ onNavigate }: ConsultationChatLogProps) {
  const [message, setMessage] = useState('');
  const [showSpamWarning, setShowSpamWarning] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [lastMessageTime, setLastMessageTime] = useState(0);

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'student', text: 'Hi, I need help with this derivative problem!', time: '14:23' },
    { id: 2, sender: 'instructor', text: 'Sure! Let me explain it step by step.', time: '14:24' },
    { id: 3, sender: 'instructor', text: 'First, you need to apply the power rule to the constant.', time: '14:24' },
    { id: 4, sender: 'student', text: 'Got it, thank you so much!', time: '14:26' },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const now = Date.now();
    const timeSinceLastMessage = now - lastMessageTime;

    if (timeSinceLastMessage < 5000) {
      const newCount = messageCount + 1;
      setMessageCount(newCount);

      if (newCount > 3) {
        setShowSpamWarning(true);
        setMessage('');
        return;
      }
    } else {
      setMessageCount(1);
    }

    setLastMessageTime(now);

    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'instructor',
      text: message,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b-2 border-slate-100 py-6 px-6 flex items-center justify-between sticky top-0 z-20">
          <button 
            onClick={() => onNavigate('study-session')}
            className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
          >
              <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
          </button>
          <h1 className="text-[10px] font-black uppercase tracking-[.4em] text-slate-900">Full Chat Log</h1>
          <div className="w-10"></div>
      </div>

      {/* Spam Warning */}
      {showSpamWarning && (
        <div className="mx-6 mt-4 animate-in slide-in-from-top-4">
          <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-500 shadow-[4px_4px_0px_0px_rgba(245,158,11,0.2)]">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle size={20} className="text-amber-600" />
              <p className="text-xs font-black uppercase tracking-tight text-amber-700">Cooldown Active</p>
            </div>
            <p className="text-[10px] font-bold text-amber-600 mb-4 leading-relaxed">
              You're sending messages too fast. Please take a break to keep the conversation focused.
            </p>
            <button
              onClick={() => setShowSpamWarning(false)}
              className="w-full py-3 bg-amber-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-md active:scale-95 transition-all"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 px-6 pt-6 pb-24 overflow-y-auto space-y-6">
        {messages.map((msg, i) => {
            const isMe = msg.sender === 'instructor';
            const showAvatar = i === 0 || messages[i-1].sender !== msg.sender;
            
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-10 h-10 rounded-xl border-2 border-indigo-900 flex items-center justify-center text-xl flex-shrink-0 bg-white ${!showAvatar && 'opacity-0'}`}>
                    {msg.sender === 'student' ? '👱‍♂️' : '🎓'}
                </div>
                <div className="flex flex-col gap-1.5 max-w-[70%]">
                    <div className={`p-4 rounded-3xl border-2 shadow-[2px_2px_0px_0px_rgba(67,56,202,0.3)] ${
                        isMe ? 'bg-purple-600 text-white border-indigo-900 rounded-tr-sm' : 'bg-white text-gray-900 border-indigo-900 rounded-tl-sm'
                    }`}>
                        <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${isMe ? 'text-right text-purple-400' : 'text-left text-gray-400'}`}>
                        {msg.time}
                    </span>
                </div>
              </div>
            );
        })}
      </div>

      {/* Input Fixed Bar */}
      <div className="p-6 bg-white border-t-2 border-indigo-900 flex gap-2">
        <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-5 py-4 bg-gray-50 rounded-2xl text-xs font-bold outline-none border-2 border-indigo-900 focus:shadow-[2px_2px_0px_0px_rgba(67,56,202,0.3)] transition-all"
        />
        <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center disabled:opacity-30 disabled:grayscale transition-all active:scale-95 hover:bg-indigo-700"
        >
            <Send size={20} />
        </button>
      </div>
    </div>
  );
}
