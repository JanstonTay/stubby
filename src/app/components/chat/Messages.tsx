import { Search, Plus, Archive, ChevronDown, Users, Globe, MoreVertical, Pin, Trash2, BellOff, CheckCheck, CheckSquare, Ban, Settings, X, Search as SearchIcon } from 'lucide-react';
import { useState } from 'react';
import type { PageType, ChatConversation } from '../../App';

interface MessagesProps {
  onNavigate: (page: PageType, data?: any) => void;
  conversations: ChatConversation[];
  onCreateGroup: (name: string) => void;
}

export function Messages({ onNavigate, conversations, onCreateGroup }: MessagesProps) {
  const [activeTab, setActiveTab] = useState<'friend' | 'group' | 'community'>('friend');
  const [showArchive, setShowArchive] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [createGroupStep, setCreateGroupStep] = useState(1);
  const [newGroupName, setNewGroupName] = useState('FOP2 Study Squad');
  const [searchQuery, setSearchQuery] = useState('');

  const archivedChats = [
    { id: 101, name: 'Spring Semester 2023', lastMessage: 'Bob: Good luck everyone!', time: '6mo ago', sender: 'Bob' },
    { id: 102, name: 'Old Study Group', lastMessage: 'Tristan: Final exam complete', time: '8mo ago', sender: 'Tristan' },
  ];

  const getCurrentChats = () => {
    const chats = (conversations || []).filter(c => c.type === activeTab);
    if (!searchQuery) return chats;
    return chats.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const menuItems = [
    { icon: Pin, label: 'Pin Chat' },
    { icon: Trash2, label: 'Delete Chat' },
    { icon: BellOff, label: 'Mute' },
    { icon: Archive, label: 'Archive' },
    { icon: CheckCheck, label: 'Read All' },
    { icon: CheckSquare, label: 'Select All' },
    { icon: Ban, label: 'Block' },
    { icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col pb-32">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="px-6 py-5 flex items-center justify-between relative">
          <h1 className="text-[24px] font-black text-slate-900 tracking-tight">Chat</h1>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            aria-label="Chat options"
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${showDropdown ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <MoreVertical size={20} />
          </button>

          {showDropdown && (
            <div className="absolute top-16 right-6 w-48 bg-white rounded-2xl shadow-premium border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {menuItems.map((item, idx) => (
                <button 
                  key={idx}
                  className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors group text-left"
                  onClick={() => setShowDropdown(false)}
                >
                  <item.icon size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-900">{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 pb-4">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <SearchIcon className="w-5 h-5" />
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl text-sm font-extrabold text-slate-900 placeholder:text-slate-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/10 border"
            />
          </div>
        </div>

        <div className="flex px-6 border-t border-slate-100">
          {[
            { id: 'friend', label: 'General' },
            { id: 'group', label: 'Groups' },
            { id: 'community', label: 'Community' }
          ].map(tab => {
            const hasUnread = conversations.some(c => c.type === tab.id && c.unread > 0);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest transition-all relative flex items-center justify-center gap-2 ${
                  activeTab === tab.id 
                    ? 'text-indigo-600' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.label}
                {hasUnread && (
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full mx-6" />
                )}
              </button>
            );
          })}
        </div>
      </header>

      <main className="flex-1 overflow-auto pb-24">
        <button
          onClick={() => setShowArchive(!showArchive)}
          className="w-full flex items-center justify-between px-6 py-4 bg-slate-50/50 border-b border-slate-200 hover:bg-slate-100 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Archive className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-600">Archived Chats</span>
            <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-lg text-[9px] font-black">({archivedChats.length})</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showArchive ? 'rotate-180' : ''}`} />
        </button>

        {showArchive && (
          <div className="bg-slate-50/80 divide-y divide-slate-100">
            {archivedChats.map(chat => (
              <ChatItem key={chat.id} chat={chat} onClick={() => onNavigate('chat', chat)} />
            ))}
          </div>
        )}

        <div className="divide-y divide-slate-100">
          {getCurrentChats().map(chat => (
            <ChatItem key={chat.id} chat={chat} onClick={() => onNavigate('chat', chat)} />
          ))}
        </div>
      </main>

      {activeTab === 'group' && (
        <button 
          onClick={() => {
            setShowCreateGroup(true);
            setCreateGroupStep(1);
            setNewGroupName('FOP2 Study Squad');
          }}
          aria-label="Create new group"
          className="fixed bottom-24 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-indigo-200 active:scale-90 transition-all z-50 hover:bg-indigo-700"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {showCreateGroup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowCreateGroup(false)}></div>
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-premium relative z-10 scale-in-center animate-in zoom-in-95 duration-300">
            {createGroupStep === 1 ? (
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Create New</h3>
                  <button onClick={() => setShowCreateGroup(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors">
                    <X size={16} className="text-slate-400" />
                  </button>
                </div>
                
                <button 
                  onClick={() => setCreateGroupStep(2)}
                  className="w-full p-5 bg-slate-50 rounded-3xl border border-slate-200 flex items-center gap-4 hover:border-indigo-600 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                    <Users size={24} />
                  </div>
                  <div className="text-left">
                    <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">New Group</p>
                    <p className="text-[11px] font-bold text-slate-400">Create a group conversation</p>
                  </div>
                </button>

                <p className="text-[10px] font-bold text-slate-400 text-center italic bg-slate-50 py-3 rounded-2xl border border-slate-100">
                  Note: Communities are managed by admins
                </p>
              </div>
            ) : (
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">New Group</h3>
                  <button onClick={() => setShowCreateGroup(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors">
                    <X size={16} className="text-slate-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Group Name</label>
                    <input 
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="Enter group name..."
                      className="w-full h-14 px-5 bg-slate-50 border-slate-200 rounded-2xl text-[15px] font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none border"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setCreateGroupStep(1)}
                    className="flex-1 py-4 bg-slate-50 rounded-2xl text-[11px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 transition-all"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => {
                      if (newGroupName.trim()) {
                        onCreateGroup(newGroupName.trim());
                        setShowCreateGroup(false);
                        setNewGroupName('');
                      }
                    }}
                    disabled={!newGroupName.trim()}
                    className="flex-1 py-4 bg-indigo-600 rounded-2xl text-[11px] font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:shadow-none"
                  >
                    Create
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ChatItem({ chat, onClick }: { chat: any, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="px-6 py-5 flex items-center gap-4 hover:bg-indigo-50/30 transition-all cursor-pointer group active:scale-[0.99]"
    >
      <div className="relative flex-shrink-0">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center border border-slate-200 shadow-sm transition-all group-hover:scale-105 ${
          chat.type === 'group' ? 'bg-indigo-50 text-indigo-600' : chat.type === 'community' ? 'bg-violet-50 text-violet-600' : 'bg-slate-100 text-slate-400'
        }`}>
          {chat.type === 'group' ? <Users className="w-6 h-6" /> : chat.type === 'community' ? <Globe className="w-6 h-6" /> : <span className="text-xl font-black">{chat.name.charAt(0)}</span>}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-0.5">
          <h3 className="text-[15px] font-extrabold text-slate-900 truncate leading-tight">{chat.name}</h3>
          <span className="text-[11px] font-bold text-slate-400 uppercase ml-2 whitespace-nowrap">{chat.time}</span>
        </div>
        <div className="flex justify-between items-end">
          <p className="text-[13px] text-slate-500 truncate leading-relaxed font-medium">
            {chat.lastMessage}
          </p>
          {chat.unread > 0 && (
            <div className="w-5 h-5 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shrink-0 ml-4 shadow-sm shadow-indigo-100">
              {chat.unread}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
