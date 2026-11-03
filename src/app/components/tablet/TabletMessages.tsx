import React, { useState, useEffect, useRef } from 'react';
import { Search, Phone, Video, MoreVertical, Send, Plus, Paperclip, Smile, Users, MessageCircle, Bell, BellOff, Archive, Trash2, ChevronDown, FileText, Calendar, X, Mic } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import type { PageType, ChatConversation, ChatMessage } from '../../App';

interface TabletMessagesProps {
  onNavigate: (page: PageType, data?: any) => void;
  chats: ChatConversation[];
  onAddMessage: (chatId: number | string, message: Omit<ChatMessage, 'id'>) => void;
  onCreateGroup: (name: string) => void;
  darkMode?: boolean;
}

export function TabletMessages({
  onNavigate,
  chats,
  onAddMessage,
  onCreateGroup,
  darkMode = false
}: TabletMessagesProps) {
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(chats[0] || null);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCallConfirm, setShowCallConfirm] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showReactionPicker, setShowReactionPicker] = useState<number | string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Available reaction emojis
  const reactionEmojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

  // Pre-set messages for quick replies
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

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const activeChat = selectedChat
    ? chats.find((chat) => chat.id === selectedChat.id) || selectedChat
    : chats[0] || null;

  useEffect(() => {
    if (!selectedChat && chats.length > 0) {
      setSelectedChat(chats[0]);
    }
  }, [chats, selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [activeChat?.messages.length]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChat) return;

    const newMessage: Omit<ChatMessage, 'id'> = {
      text: messageInput,
      isMe: true,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    onAddMessage(activeChat.id, newMessage);
    setMessageInput("");
  };

  const handlePresetMessage = (message: string) => {
    if (!activeChat) return;

    const newMessage: Omit<ChatMessage, 'id'> = {
      text: message,
      isMe: true,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    onAddMessage(activeChat.id, newMessage);
  };

  const handleVoiceRecord = () => {
    if (isRecordingVoice) {
      // Stop recording and send voice message
      if (activeChat) {
        const newMessage: Omit<ChatMessage, 'id'> = {
          text: `🎤 Voice message (${recordingDuration}s)`,
          isMe: true,
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        };
        onAddMessage(activeChat.id, newMessage);
      }
      setIsRecordingVoice(false);
    } else {
      // Start recording
      setIsRecordingVoice(true);
    }
  };

  const handleAddReaction = (messageId: number | string, emoji: string) => {
    if (!activeChat) return;

    // Find the message and update its reactions
    const updatedMessages = activeChat.messages.map((msg) => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const existingReaction = reactions.find((r) => r.emoji === emoji);

        if (existingReaction) {
          // Check if user already reacted with this emoji
          if (existingReaction.users.includes('You')) {
            // Remove reaction
            const updatedReactions = reactions
              .map((r) =>
                r.emoji === emoji
                  ? { ...r, count: r.count - 1, users: r.users.filter((u) => u !== 'You') }
                  : r
              )
              .filter((r) => r.count > 0);
            return { ...msg, reactions: updatedReactions };
          } else {
            // Add user to existing reaction
            return {
              ...msg,
              reactions: reactions.map((r) =>
                r.emoji === emoji
                  ? { ...r, count: r.count + 1, users: [...r.users, 'You'] }
                  : r
              ),
            };
          }
        } else {
          // Add new reaction
          return {
            ...msg,
            reactions: [...reactions, { emoji, count: 1, users: ['You'] }],
          };
        }
      }
      return msg;
    });

    // Update the chat with new messages
    // Note: You'll need to add an onUpdateChat function to properly persist this
    // For now, we'll just close the picker
    setShowReactionPicker(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`h-full flex ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Left Panel - Conversations List */}
      <div className={`w-[380px] border-r flex flex-col ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        {/* Header */}
        <div className={`p-6 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Messages</h2>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{chats.length} conversations</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                const groupName = prompt('Enter group name:');
                if (groupName) onCreateGroup(groupName);
              }}
              className={darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-700' : ''}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-9 ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500' : ''}`}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full p-4 border-b text-left transition-all ${
                darkMode ? 'border-slate-700 hover:bg-slate-700/50' : 'border-slate-100 hover:bg-slate-50'
              } ${
                selectedChat?.id === chat.id 
                  ? (darkMode ? 'bg-indigo-900/20 border-l-4 border-l-indigo-500' : 'bg-indigo-50 border-l-4 border-l-indigo-500') 
                  : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {chat.type === 'group' || chat.type === 'community' ? (
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center text-white">
                      <Users className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${darkMode ? 'bg-slate-700 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                      {chat.name.charAt(0)}
                    </div>
                  )}
                  {chat.unread > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      {chat.unread}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-semibold truncate ${
                      darkMode 
                        ? (chat.unread > 0 ? 'text-white' : 'text-slate-300')
                        : (chat.unread > 0 ? 'text-slate-900' : 'text-slate-700')
                    }`}>
                      {chat.name}
                    </h4>
                    <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{chat.time}</span>
                  </div>
                  
                  <div className={`text-sm truncate ${
                    chat.unread > 0 
                      ? (darkMode ? 'text-white font-medium' : 'text-slate-900 font-medium') 
                      : (darkMode ? 'text-slate-500' : 'text-slate-500')
                  }`}>
                    {chat.lastMessage}
                  </div>

                  {/* Type Badge */}
                  {chat.type !== 'friend' && (
                    <div className="mt-1">
                      <Badge variant="secondary" className={`text-xs ${darkMode ? 'bg-slate-700 text-slate-400 border-0' : ''}`}>
                        {chat.type === 'group' ? `${chat.members?.length || 0} members` : `${chat.memberCount || 0} members`}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Center Panel - Active Chat */}
      {activeChat ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className={`border-b p-4 flex items-center justify-between ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-3">
              {activeChat.type === 'group' || activeChat.type === 'community' ? (
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center text-white">
                  <Users className="w-6 h-6" />
                </div>
              ) : (
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${darkMode ? 'bg-slate-700 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                  {activeChat.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{activeChat.name}</h3>
                {activeChat.type === 'friend' ? (
                  <p className="text-sm text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full block"></span>
                    Online
                  </p>
                ) : (
                  <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                    {activeChat.type === 'group' ? `${activeChat.members?.length || 0} members` : `${activeChat.memberCount || 0} members`}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate('shared-notes')}
                className={darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-700' : ''}
              >
                <FileText className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => activeChat.type === 'community' ? onNavigate('community-events') : onNavigate('study-planner')}
                className={darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-700' : ''}
              >
                <Calendar className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setCallType('voice');
                  setShowCallConfirm(true);
                }}
                className={darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-700' : ''}
              >
                <Phone className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setCallType('video');
                  setShowCallConfirm(true);
                }}
                className={darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-700' : ''}
              >
                <Video className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className={darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-700' : ''}>
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className={`flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-4 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
            {activeChat.messages.length > 0 ? (
              <>
              {activeChat.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${message.isMe ? 'items-end' : 'items-start'} flex flex-col gap-1 relative group`}>
                    {message.isAnnouncement ? (
                      <div className={`w-full p-4 border rounded-xl ${darkMode ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-100 border-indigo-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Bell className={`w-4 h-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                          <span className={`font-semibold text-sm ${darkMode ? 'text-indigo-400' : 'text-indigo-900'}`}>Announcement</span>
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{message.text}</p>
                      </div>
                    ) : (
                      <>
                        {!message.isMe && activeChat.type !== 'friend' && (
                          <span className={`text-xs font-medium px-2 ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>{message.sender}</span>
                        )}
                        
                        <div className="relative">
                          <div
                            className={`px-4 py-3 rounded-2xl ${
                              message.isMe
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                : (darkMode ? 'bg-slate-800 text-white border border-slate-700' : 'bg-white text-slate-900 border border-slate-200 shadow-sm')
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.text}</p>
                          </div>

                          {/* Reaction Button - Shows on hover */}
                          <button
                            onClick={() => setShowReactionPicker(showReactionPicker === message.id ? null : message.id)}
                            className={`absolute ${message.isMe ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full ${
                              darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'
                            }`}
                          >
                            <Smile className="w-4 h-4" />
                          </button>

                          {/* Reaction Picker */}
                          {showReactionPicker === message.id && (
                            <div className={`absolute ${message.isMe ? 'left-0' : 'right-0'} top-full mt-2 p-2 rounded-xl shadow-lg border flex gap-1 z-10 animate-in fade-in zoom-in-95 duration-200 ${
                              darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                            }`}>
                              {reactionEmojis.map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => handleAddReaction(message.id, emoji)}
                                  className={`w-10 h-10 flex items-center justify-center text-xl rounded-lg transition-all hover:scale-110 active:scale-95 ${
                                    darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                                  }`}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Display Reactions */}
                          {message.reactions && message.reactions.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {message.reactions.map((reaction, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleAddReaction(message.id, reaction.emoji)}
                                  className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all hover:scale-105 active:scale-95 ${
                                    reaction.users.includes('You')
                                      ? (darkMode ? 'bg-indigo-900/50 border border-indigo-500 text-indigo-300' : 'bg-indigo-100 border border-indigo-300 text-indigo-700')
                                      : (darkMode ? 'bg-slate-700 border border-slate-600 text-slate-300' : 'bg-slate-100 border border-slate-200 text-slate-700')
                                  }`}
                                >
                                  <span>{reaction.emoji}</span>
                                  <span>{reaction.count}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <span className={`text-xs px-2 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{message.time}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-slate-700' : 'text-slate-300'}`} />
                  <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>No messages yet</h3>
                  <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Start the conversation by sending a message</p>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className={`border-t ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            {/* Preset Messages - Horizontal Scroll */}
            <div className="px-4 pt-3 pb-2 overflow-hidden">
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-1 px-1">
                {presetMessages.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetMessage(preset)}
                    className={`flex-shrink-0 px-4 py-2 border rounded-full text-xs font-semibold transition-all active:scale-95 whitespace-nowrap ${
                      darkMode 
                        ? 'bg-slate-700 hover:bg-indigo-900/30 border-slate-600 hover:border-indigo-500/50 text-slate-300 hover:text-indigo-400' 
                        : 'bg-slate-50 hover:bg-indigo-50 border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Recording Indicator */}
            {isRecordingVoice && (
              <div className={`mx-4 mb-3 flex items-center justify-center gap-3 px-4 py-2 rounded-2xl border animate-in fade-in slide-in-from-bottom-2 ${darkMode ? 'bg-red-900/20 border-red-500/30' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className={`text-[11px] font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>Recording... {recordingDuration}s</span>
                </div>
                <button 
                  onClick={handleVoiceRecord}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider transition-all active:scale-95"
                >
                  Stop & Send
                </button>
              </div>
            )}

            {/* Input Area */}
            <div className="px-4 pb-4">
              <div className="flex items-end gap-3">
                <Button variant="ghost" size="icon" className={darkMode ? 'text-slate-400 hover:text-white' : ''}>
                  <Paperclip className="w-5 h-5" />
                </Button>
                
                <div className="flex-1 relative">
                  <Textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className={`min-h-[44px] max-h-32 resize-none pr-24 ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500' : ''}`}
                    rows={1}
                    disabled={isRecordingVoice}
                  />
                  <div className="absolute right-2 bottom-2 flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleVoiceRecord}
                      className={`${isRecordingVoice ? 'bg-red-500 text-white hover:bg-red-600' : (darkMode ? 'text-slate-400 hover:text-white' : '')}`}
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={darkMode ? 'text-slate-400 hover:text-white' : ''}
                    >
                      <Smile className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || isRecordingVoice}
                  className="px-6"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`flex-1 flex items-center justify-center ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
          <div className="text-center">
            <MessageCircle className={`w-20 h-20 mx-auto mb-4 ${darkMode ? 'text-slate-700' : 'text-slate-300'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Select a conversation</h3>
            <p className={darkMode ? 'text-slate-500' : 'text-slate-500'}>Choose a conversation from the list to start messaging</p>
          </div>
        </div>
      )}

      {/* Call Confirmation Modal */}
      {showCallConfirm && activeChat && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowCallConfirm(false)}></div>
          <div className={`w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 p-10 flex flex-col items-center text-center space-y-6 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            {/* Icon */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${darkMode ? 'bg-indigo-500/20' : 'bg-indigo-50'}`}>
              {callType === 'voice' ? <Phone size={28} className="text-indigo-400" /> : <Video size={28} className="text-indigo-400" />}
            </div>
            
            {/* Title and Description */}
            <div className="space-y-2">
              <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Start {callType === 'voice' ? 'Voice' : 'Video'} Call?</h3>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Are you sure you want to start a {callType} call with <span className="text-indigo-400 font-semibold">{activeChat.name}</span>?
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 w-full pt-2">
              <button 
                onClick={() => setShowCallConfirm(false)}
                className={`flex-1 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${darkMode ? 'text-slate-500 hover:bg-slate-700' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowCallConfirm(false);
                  onNavigate('call', { chat: activeChat, type: callType });
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
