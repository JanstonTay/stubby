import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send, Paperclip, Phone, Video, MoreVertical, FileText, Calendar, X, Globe, Users, Search, Palette, Flag, Eraser, Pin, Upload, FolderPlus, PenTool, Plus, Check, User, Mic, Smile } from 'lucide-react';
import { SharedNotes } from './extensions/SharedNotes';
import { StudyPlanner } from './extensions/StudyPlanner';
import { WhiteboardModal } from './extensions/WhiteboardModal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import type { PageType, ChatConversation, ChatMessage } from '../../App';

interface ChatProps {
  onNavigate: (page: PageType, data?: any) => void;
  chat?: any;
  chats: ChatConversation[];
  onSendMessage: (chatId: string | number, message: Omit<ChatMessage, 'id'>) => void;
  onUpdateSharedNotes: React.Dispatch<React.SetStateAction<any[]>>;
}

export function Chat({ onNavigate, chat, chats, onSendMessage, onUpdateSharedNotes }: ChatProps) {
  // Use local default if chat is missing, but preferably we use the ID to find the full chat data
  const conversation = chats.find(c => c.id === chat?.id) || chat || chats[0] || { name: 'Sarah Johnson', type: 'friend', id: 0, messages: [] };
  const messages = conversation.messages || [];

  const isCommunity = conversation.type === 'community';
  const isGroup = conversation.type === 'group';

  const [messageText, setMessageText] = useState('Want to revise arrays together at 2 PM?');
  const [showOptions, setShowOptions] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success'>('idle');
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const [showCallConfirm, setShowCallConfirm] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');
  const [newFolderName, setNewFolderName] = useState('FOP2 Revision Pack');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showReactionPicker, setShowReactionPicker] = useState<number | string | null>(null);
  const [messageReactions, setMessageReactions] = useState<Record<string | number, { emoji: string; count: number; users: string[] }[]>>({});
  const [menuNotice, setMenuNotice] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Available reaction emojis
  const reactionEmojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

  const members: (any & { role?: string, isYou?: boolean })[] = isCommunity ? [
    { name: 'Admin', initials: 'A', role: 'Administrator', avatar: '🛡️' },
    { name: 'Sarah', initials: 'S', avatar: '👩' },
    { name: 'Mike', initials: 'M', avatar: '👨' },
    { name: 'Emma', initials: 'E', avatar: '👩‍🦰' },
    { name: 'John', initials: 'J', avatar: '🧑' }
  ] : [
    { name: 'You', initials: 'Y', isYou: true, avatar: '😎' },
    { name: 'Sarah Lim', initials: 'SL', avatar: '👩' },
    { name: 'Marcus Tan', initials: 'MT', avatar: '👨' },
    { name: 'Emily Wong', initials: 'EW', avatar: '👩‍💻' }
  ];

  // Pre-set messages for tablet
  const presetMessages = [
    'Online or meet up?',
    'When are you free?',
    'Which module are we studying?',
    'Can you explain this concept?',
    'Let\'s start now!',
    'Need a break?'
  ];

  // Voice recording timer
  useEffect(() => {
    let interval: any;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  // Close reaction picker when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showReactionPicker) {
        setShowReactionPicker(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showReactionPicker]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!messageText.trim()) return;
    onSendMessage(conversation.id, {
      text: messageText,
      isMe: true,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      sender: 'You'
    });
    setMessageText('');
  };

  const handlePresetMessage = (message: string) => {
    onSendMessage(conversation.id, {
      text: message,
      isMe: true,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      sender: 'You'
    });
  };

  const handleVoiceRecord = () => {
    if (isRecordingVoice) {
      // Stop recording and send voice message
      onSendMessage(conversation.id, {
        text: `🎤 Voice message (${recordingDuration}s)`,
        isMe: true,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        sender: 'You'
      });
      setIsRecordingVoice(false);
    } else {
      // Start recording
      setIsRecordingVoice(true);
    }
  };

  const handleAddReaction = (messageId: number | string, emoji: string) => {
    setMessageReactions((prev) => {
      const current = prev[messageId] || [];
      const existing = current.find((reaction) => reaction.emoji === emoji);

      if (!existing) {
        return {
          ...prev,
          [messageId]: [...current, { emoji, count: 1, users: ['You'] }]
        };
      }

      const alreadyReacted = existing.users.includes('You');
      const updated = current
        .map((reaction) => {
          if (reaction.emoji !== emoji) return reaction;
          return {
            ...reaction,
            count: alreadyReacted ? Math.max(0, reaction.count - 1) : reaction.count + 1,
            users: alreadyReacted
              ? reaction.users.filter((user) => user !== 'You')
              : [...reaction.users, 'You']
          };
        })
        .filter((reaction) => reaction.count > 0);

      return {
        ...prev,
        [messageId]: updated
      };
    });
    setShowReactionPicker(null);
  };

  const handleMenuAction = (label: string) => {
    const notices: Record<string, string> = {
      Search: 'Search is ready for this chat.',
      'Chat Theme': 'A light study theme preview has been applied.',
      'Report & Block': 'Report saved for demo review.',
      'Clear Chat': 'Chat clear request saved in demo mode.',
      'Pin Message': 'Latest message pinned for this demo.'
    };

    if (label === 'Media') {
      setShowFilesModal(true);
    } else if (notices[label]) {
      setMenuNotice(notices[label]);
    }

    setShowOptions(false);
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      {/* Standardized Premium Header */}
      <header className="px-6 py-5 bg-white border-b border-slate-200 flex items-center justify-between z-40 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('messages')}
            aria-label="Back"
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
          >
            <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
          </button>
          <div className="flex items-center gap-2">
            <div 
              className={`w-9 h-9 rounded-full flex items-center justify-center border border-slate-200 shadow-sm cursor-pointer transition-all hover:scale-105 ${
                isGroup ? 'bg-indigo-50 text-indigo-600' : isCommunity ? 'bg-violet-50 text-violet-600' : 'bg-slate-100 text-slate-600'
              }`}
              onClick={() => (isGroup || isCommunity) ? setShowMembers(true) : onNavigate('profile')}
            >
              {isGroup ? <Users size={16} /> : isCommunity ? <Globe size={16} /> : <span className="font-bold text-xs">{conversation?.name?.charAt(0) || '?'}</span>}
            </div>
            <div className="min-w-0 cursor-pointer" onClick={() => (isGroup || isCommunity) ? setShowMembers(true) : onNavigate('profile')}>
              <h2 className="text-[13px] font-extrabold text-slate-900 truncate leading-none mb-0.5">{conversation?.name}</h2>
              <p className="text-[10px] font-bold text-slate-400 truncate leading-none">
                {isCommunity ? `${conversation.memberCount || 0} members` : isGroup ? '4 members' : 'Online'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 relative">
          {/* Show all icons for both private and group chats */}
          <button 
            onClick={() => onNavigate('shared-notes')}
            aria-label="Shared Notes"
            className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-95"
          >
            <FileText size={18} />
          </button>
          <button 
             onClick={() => isCommunity ? onNavigate('community-events') : onNavigate('study-planner')}
             aria-label={isCommunity ? 'Community Events' : 'Study Planner'}
             className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-95"
          >
            <Calendar size={18} />
          </button>
          <button 
            onClick={() => {
              setCallType('voice');
              setShowCallConfirm(true);
            }}
            aria-label="Voice Call"
            className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-95"
          >
            <Phone size={18} />
          </button>
          <button 
            onClick={() => {
              setCallType('video');
              setShowCallConfirm(true);
            }}
            aria-label="Video Call"
            className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-95"
          >
            <Video size={18} />
          </button>
          <button 
            onClick={() => setShowOptions(!showOptions)}
            aria-label="More Options"
            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-95 ${showOptions ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
          >
            <MoreVertical size={18} />
          </button>

          {showOptions && (
            <div className="absolute top-12 right-0 w-48 bg-white rounded-2xl shadow-premium border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {[
                { icon: (isGroup || isCommunity) ? Globe : User, label: (isGroup || isCommunity) ? 'View Members' : 'Profile', onClick: () => (isGroup || isCommunity) ? setShowMembers(true) : onNavigate('profile') },
                { icon: Search, label: 'Search' },
                { icon: FileText, label: 'Media' },
                { icon: Palette, label: 'Chat Theme' },
                { icon: Flag, label: 'Report & Block', danger: true },
                { icon: Eraser, label: 'Clear Chat' },
                { icon: Pin, label: 'Pin Message' }
              ].map((item, idx) => (
                <button 
                  key={idx}
                  className={`w-full px-4 py-2.5 flex items-center gap-3 hover:bg-indigo-50 transition-colors group ${item.danger ? 'text-rose-500' : ''}`}
                  onClick={() => {
                    item.onClick?.();
                    if (item.onClick) setShowOptions(false);
                    if (!item.onClick) handleMenuAction(item.label);
                  }}
                >
                  <item.icon size={16} className={`${item.danger ? 'text-rose-500' : 'text-slate-400 group-hover:text-indigo-600'} transition-colors`} />
                  <span className={`text-[11px] font-bold ${item.danger ? 'text-rose-500' : 'text-slate-600 group-hover:text-indigo-900'}`}>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {menuNotice && (
        <div className="mx-6 mt-4 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-[11px] font-bold text-indigo-700 flex items-center justify-between">
          <span>{menuNotice}</span>
          <button onClick={() => setMenuNotice('')} className="text-indigo-400 hover:text-indigo-700" aria-label="Dismiss chat notice">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Messages Scrolling Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6 min-h-0"
      >
        <div className="flex justify-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                Today
            </span>
        </div>

        {messages.map((message: any) => {
          const reactions = messageReactions[message.id] || message.reactions || [];
          return (
          <div
            key={message.id}
            className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex flex-col ${message.isMe ? 'items-end' : 'items-start'} max-w-[80%] relative group`}>
              {!message.isMe && (isGroup || isCommunity) && (
                <span className="text-[10px] font-bold text-slate-400 mb-1 ml-1">{message.sender}</span>
              )}
              
              <div className="relative">
                <div
                  className={`px-4 py-2 rounded-[1.25rem] text-[13px] font-medium leading-relaxed shadow-sm ${
                    message.isMe
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-100'
                      : 'bg-white text-slate-900 border border-slate-100 rounded-tl-none'
                  } ${message.isAnnouncement ? 'bg-amber-50 border-amber-200 text-amber-900 text-center italic w-full max-w-none rounded-2xl border-2' : ''}`}
                >
                  {message.text}
                </div>

                {/* Reaction Button - Shows on long press or tap */}
                {!message.isAnnouncement && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowReactionPicker(showReactionPicker === message.id ? null : message.id);
                    }}
                    aria-label="Add reaction"
                    className={`absolute ${message.isMe ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-all active:scale-95`}
                  >
                    <Smile className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                )}

                {/* Reaction Picker */}
                {showReactionPicker === message.id && !message.isAnnouncement && (
                  <div 
                    className={`absolute ${message.isMe ? 'left-0' : 'right-0'} top-full mt-2 p-2 rounded-xl shadow-lg border bg-white border-slate-200 flex gap-1 z-10 animate-in fade-in zoom-in-95 duration-200`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {reactionEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleAddReaction(message.id, emoji)}
                        aria-label={`React with ${emoji}`}
                        className="w-9 h-9 flex items-center justify-center text-lg rounded-lg transition-all hover:scale-110 active:scale-95 hover:bg-slate-100"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* Display Reactions */}
                {reactions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {reactions.map((reaction: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleAddReaction(message.id, reaction.emoji)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 transition-all hover:scale-105 active:scale-95 ${
                          reaction.users.includes('You')
                            ? 'bg-indigo-100 border border-indigo-300 text-indigo-700'
                            : 'bg-slate-100 border border-slate-200 text-slate-700'
                        }`}
                      >
                        <span>{reaction.emoji}</span>
                        <span>{reaction.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-[9px] font-bold text-slate-400 mt-1 px-1">
                {message.time}
              </span>
            </div>
          </div>
          );
        })}
      </div>

      {/* Preset Messages - Horizontal Scroll (Mobile) */}
      <div className="px-4 pt-2 pb-1 bg-white border-t border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          {presetMessages.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetMessage(preset)}
              className="flex-shrink-0 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-full text-[11px] font-semibold text-slate-700 hover:text-indigo-600 transition-all active:scale-95 whitespace-nowrap"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Wireframe Input Bar with Voice Message Button */}
      <div className="bg-white border-t border-slate-100 p-4 flex-shrink-0" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        {isRecordingVoice && (
          <div className="mb-3 flex items-center justify-center gap-3 px-4 py-2 bg-red-50 rounded-2xl border border-red-200 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-[11px] font-bold text-red-600">Recording... {recordingDuration}s</span>
            </div>
            <button 
              onClick={handleVoiceRecord}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider transition-all active:scale-95"
            >
              Stop & Send
            </button>
          </div>
        )}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowFilesModal(true)}
            aria-label="Attach files"
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-95 group"
          >
            <Paperclip size={20} className="group-hover:rotate-12 transition-transform" />
          </button>
          
          <div className="flex-1 relative">
            <input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={isCommunity ? "Message community..." : isGroup ? "Message group..." : "Type a message..."}
              className="w-full h-11 pl-5 pr-20 bg-indigo-50/50 border-2 border-transparent rounded-full text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-100 focus:ring-2 focus:ring-indigo-50 transition-all outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isRecordingVoice}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button 
                onClick={handleVoiceRecord}
                aria-label={isRecordingVoice ? 'Stop voice recording' : 'Start voice recording'}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all active:scale-95 ${isRecordingVoice ? 'bg-red-500 text-white shadow-lg shadow-red-100' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
              >
                <Mic size={16} />
              </button>
            </div>
          </div>
 
          <button 
            onClick={handleSend}
            disabled={!messageText.trim() || isRecordingVoice}
            aria-label="Send message"
            className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-full disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:opacity-100 transition-all active:scale-90 shadow-lg shadow-indigo-100"
          >
            <Send size={18} className="translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Files & Documents Modal (6.1.1B) */}
      {showFilesModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-sm" onClick={() => setShowFilesModal(false)}></div>
          <div className="bg-white w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-300">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-extrabold text-slate-900">Files & Documents</h3>
                <button onClick={() => setShowFilesModal(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={() => {
                    setIsUploading(true);
                    setTimeout(() => {
                      setIsUploading(false);
                      setUploadStatus('success');
                      setHasUploadedFile(true);
                      onUpdateSharedNotes((prev: any[]) => [
                        { id: Date.now(), type: 'file', name: 'study_notes_v1.pdf', size: '2.4 MB' },
                        ...prev
                      ]);
                      setTimeout(() => {
                        setUploadStatus('idle');
                      }, 2000);
                    }, 1500);
                  }}
                  disabled={isUploading}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all group ${
                    uploadStatus === 'success' ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                    uploadStatus === 'success' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-white border-slate-200 text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100'
                  }`}>
                    {isUploading ? (
                      <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : uploadStatus === 'success' ? (
                      <Check size={18} />
                    ) : (
                      <Upload size={18} />
                    )}
                  </div>
                  <span className={`text-sm font-bold ${uploadStatus === 'success' ? 'text-emerald-700' : 'text-slate-700'}`}>
                    {isUploading ? 'Uploading...' : uploadStatus === 'success' ? 'File Uploaded!' : 'Upload Files'}
                  </span>
                </button>

                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      if (!newFolderName.trim()) setNewFolderName('FOP2 Revision Pack');
                      setIsCreatingFolder(!isCreatingFolder);
                    }}
                    className="w-full flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100">
                      <FolderPlus size={18} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">New Folder</span>
                  </button>
                  
                  {isCreatingFolder && (
                    <div className="flex gap-2 p-2 bg-slate-50 rounded-xl animate-in slide-in-from-top-2">
                      <input 
                        placeholder="Folder name..."
                        value={newFolderName}
                        onChange={(e: any) => setNewFolderName(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-indigo-300"
                        autoFocus
                      />
                      <button 
                        onClick={() => {
                          if (newFolderName.trim()) {
                            onUpdateSharedNotes((prev: any[]) => [
                              { id: Date.now(), type: 'folder', name: newFolderName.trim(), count: 0 },
                              ...prev
                            ]);
                          }
                          setShowFilesModal(false);
                          setIsCreatingFolder(false);
                          setNewFolderName('FOP2 Revision Pack');
                          onNavigate('shared-notes');
                        }}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
                      >
                        Create
                      </button>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => {
                    setShowFilesModal(false);
                    setShowWhiteboard(true);
                  }}
                  className="w-full flex items-center gap-3 p-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl transition-all group text-white shadow-lg shadow-indigo-100"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/50 flex items-center justify-center">
                    <PenTool size={18} />
                  </div>
                  <span className="text-sm font-black">Open Live Whiteboard</span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Uploaded Files</h4>
                {hasUploadedFile ? (
                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center justify-between group animate-in slide-in-from-bottom-2 duration-300">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                              <FileText size={18} />
                          </div>
                          <div>
                              <p className="text-xs font-bold text-slate-900">study_notes_v1.pdf</p>
                              <p className="text-[9px] font-bold text-indigo-400">2.4 MB • Just now</p>
                          </div>
                      </div>
                      <button 
                        onClick={() => setHasUploadedFile(false)}
                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      >
                          <X size={16} />
                      </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 px-6 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-200 mb-3 shadow-sm">
                      <Upload size={24} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No files uploaded yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Group/Community Members Modal */}
      {showMembers && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-md" onClick={() => setShowMembers(false)}></div>
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-premium relative z-10 animate-in zoom-in-95 duration-300">
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {isCommunity ? 'Community Members' : 'Group Members'} ({isCommunity ? conversation.memberCount || 0 : members.length})
                </h3>
                <button onClick={() => setShowMembers(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors">
                  <X size={16} className="text-slate-400" />
                </button>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 pb-4">
                {members.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all text-xl shadow-sm ${
                        member.isYou ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-100'
                    }`}>
                      {member.avatar ? member.avatar : <span className="text-sm font-black">{member.initials}</span>}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-bold ${member.isYou ? 'text-indigo-600' : 'text-slate-900'}`}>{member.name}</p>
                        {member.isYou && <span className="px-1.5 py-0.5 bg-indigo-600 text-white text-[8px] font-black uppercase rounded shadow-sm">You</span>}
                      </div>
                      {member.role ? (
                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">{member.role}</p>
                      ) : (
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Member</p>
                      )}
                    </div>
                  </div>
                ))}
                {isCommunity && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-dashed border-slate-200">
                      <Plus size={16} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-400">+ {(conversation.memberCount || 0) - members.length} others</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Whiteboard Modal */}
      {showWhiteboard && (
        <WhiteboardModal onClose={() => setShowWhiteboard(false)} />
      )}

      {/* Call Confirmation Modal (Image 2) */}
      {showCallConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowCallConfirm(false)}></div>
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 p-10 flex flex-col items-center text-center space-y-6">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center">
              {callType === 'voice' ? <Phone size={28} className="text-indigo-600" /> : <Video size={28} className="text-indigo-600" />}
            </div>
            
            {/* Title and Description */}
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">Start {callType === 'voice' ? 'Voice' : 'Video'} Call?</h3>
              <p className="text-sm text-slate-500">
                Are you sure you want to start a {callType} call with <span className="text-indigo-600 font-semibold">{conversation.name}</span>?
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 w-full pt-2">
              <button 
                onClick={() => setShowCallConfirm(false)}
                className="flex-1 py-3.5 rounded-2xl text-xs font-bold text-slate-400 uppercase tracking-wider hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowCallConfirm(false);
                  onNavigate('call', { chat: conversation, type: callType });
                }}
                className="flex-1 py-3.5 bg-indigo-600 rounded-2xl text-xs font-bold text-white uppercase tracking-wider shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95"
              >
                Start Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
