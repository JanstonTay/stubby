import { Check, Zap, Coffee, AlertTriangle, ChevronLeft } from 'lucide-react';
import type { AppState, PageType, UserStatus } from '../../App';

interface CoSolveLobbyProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  onNavigate: (page: PageType) => void;
}

export function CoSolveLobby({ state, updateState, onNavigate }: CoSolveLobbyProps) {
  const toggleMember = (memberId: string) => {
    if (memberId === '1') return; // Current user can't be deselected
    
    updateState({
      selectedMembers: state.selectedMembers.includes(memberId)
        ? state.selectedMembers.filter(id => id !== memberId)
        : [...state.selectedMembers, memberId]
    });
  };

  const handleInviteAll = () => {
    const allOtherMemberIds = state.members
      .filter(m => m.id !== '1')
      .map(m => m.id);
    updateState({ selectedMembers: allOtherMemberIds });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'focus':
        return <Zap size={14} className="text-gray-900" />;
      case 'break':
        return <Coffee size={14} className="text-amber-500" />;
      case 'need-help':
        return <AlertTriangle size={14} className="text-amber-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: UserStatus) => {
    switch (status) {
      case 'focus':
        return 'Deep Focus';
      case 'break':
        return 'On Break';
      case 'need-help':
        return 'Need Help';
    }
  };

  const currentUser = { id: '0', name: 'You', avatar: '👨‍🎓', status: state.userStatus };
  const otherMembers = state.members;
  const joinedCount = 1; // Only current user has fully joined
  const pendingCount = state.selectedMembers.length;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b-2 border-slate-100 py-6 px-6 flex items-center justify-between sticky top-0 z-20">
          <button 
            onClick={() => onNavigate('study-session')}
            className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
          >
              <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
          </button>
          <h1 className="text-[10px] font-black uppercase tracking-[.4em] text-slate-900">Co-Solve Lobby</h1>
          <div className="w-10"></div>
      </div>

      <div className="flex-1 px-6 pt-6 pb-4 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            {joinedCount} JOINED <span className="mx-2">·</span> {pendingCount} PENDING
          </p>
          <button 
            onClick={handleInviteAll}
            className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 underline"
          >
            INVITE ALL
          </button>
        </div>

        <div className="space-y-4">
          {/* Current User - Auto-joined */}
          <div className="p-4 rounded-3xl bg-white border-2 border-indigo-900 shadow-[6px_6px_0px_0px_rgba(67,56,202,0.5)]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl bg-gray-50 border-2 border-indigo-900">
                {currentUser.avatar}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-900 uppercase tracking-tight">{currentUser.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="px-2 py-0.5 rounded-full bg-gray-50 border border-gray-200 flex items-center gap-1.5 grayscale">
                    {getStatusIcon(currentUser.status)}
                    <span className="text-[8px] font-bold uppercase tracking-wider text-gray-600">{getStatusText(currentUser.status as any)}</span>
                  </div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-900 border-2 border-indigo-900">
                <Check size={14} className="text-white" />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-50 px-4 text-[8px] font-bold uppercase tracking-[0.2em] text-gray-400">Squad Directory</span>
            </div>
          </div>

          {/* Other Members */}
          {otherMembers.map(member => {
            const isSelected = state.selectedMembers.includes(member.id);
            return (
              <button
                key={member.id}
                onClick={() => toggleMember(member.id)}
                className={`w-full p-4 rounded-3xl transition-all active:scale-[0.98] border-2 shadow-[6px_6px_0px_0px_rgba(67,56,202,0.5)] active:shadow-none active:translate-x-1 active:translate-y-1 ${
                  isSelected ? 'bg-white border-gray-900' : 'bg-white border-gray-900'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl bg-gray-50 border-2 border-indigo-900 grayscale group-hover:grayscale-0 transition-all ${isSelected ? 'grayscale-0 animate-pulse' : ''}`}>
                    {member.avatar}
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`text-xs font-bold uppercase tracking-tight text-gray-900`}>{member.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="px-2 py-0.5 rounded-full bg-gray-50 border border-gray-200 flex items-center gap-1.5 opacity-60">
                        {getStatusIcon(member.status)}
                        <span className="text-[8px] font-bold uppercase tracking-wider text-gray-600">{getStatusText(member.status as any)}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200'
                  }`}>
                    {isSelected && <Check size={14} />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 bg-white border-t-2 border-gray-900 space-y-3 relative z-20">
        <button
          onClick={() => {
            updateState({ workingInPublic: true });
            onNavigate('public-workspace');
          }}
          className="w-full py-4 rounded-2xl font-bold uppercase tracking-widest transition-all active:scale-95 bg-indigo-600 text-white hover:bg-indigo-700 shadow-[4px_4px_0px_0px_rgba(79,70,229,0.3)] disabled:opacity-50"
          disabled={joinedCount === 0}
        >
          Form Active Group
        </button>

        <button
          onClick={() => onNavigate('study-session')}
          className="w-full py-4 rounded-2xl font-bold uppercase tracking-widest transition-all active:scale-95 bg-white text-gray-900 border-2 border-indigo-900 hover:bg-gray-50"
        >
          Return to Lab
        </button>
      </div>
    </div>
  );
}
