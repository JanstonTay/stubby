import { Settings, UserPlus, BookOpen, Users, MessageCircle, User, Loader2, ArrowLeft, Search, Plus, Award, ChevronRight, ChevronLeft, Home as HomeIcon, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BottomNav } from '../BottomNav';
import type { PageType, UserData } from '../../App';
import { Quiz } from './Quiz';

interface ProfilePageProps {
  onNavigate: (page: PageType) => void;
  userData: UserData;
  onUpdateUser: (updates: Partial<UserData>) => void;
  onToggleNav: (hidden: boolean) => void;
}

const ALL_BADGES = [
  "Day 1", "First Session", "5 Hours", "Active User", "Good Matchmaker",
  "10 Hours", "20 Hours", "30 Hours", "50 Hours",
  "75 Hours", "100 Hours", "Daily Champion", "Weekly Champion",
  "Monthly Champion", "Yearly Champion", "Grand Champion", "Royal Champion",
  "Super Champion", "Ultimate Champion", "Very Helpful", "Super Resourceful",
  "Lifesaver", "Celebrity"
];

export function ProfilePage({ onNavigate, userData, onUpdateUser, onToggleNav }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'badges'>('profile');
  const [showQuiz, setShowQuiz] = useState(false);
  const [showEditPage, setShowEditPage] = useState(false);
  const [showEditedNotification, setShowEditedNotification] = useState(false);
  const [showCompletedNotification, setShowCompletedNotification] = useState(false);
  const [showChangePicture, setShowChangePicture] = useState(false);
  const [showPictureUpdatedNotification, setShowPictureUpdatedNotification] = useState(false);
  const [showAddFriends, setShowAddFriends] = useState(false);
  const [showMatchesFriends, setShowMatchesFriends] = useState(false);
  const [matchesFriendsTab, setMatchesFriendsTab] = useState<'matches' | 'friends'>('matches');
  const [showViewAllBadges, setShowViewAllBadges] = useState(false);
  const [selectedBadges, setSelectedBadges] = useState(userData.selectedBadges);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const darkMode = userData.darkMode;

  useEffect(() => {
    onUpdateUser({ selectedBadges });
  }, [selectedBadges]);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const showToast = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
  };

  const openMatchesFriends = (tab: 'matches' | 'friends') => {
    setMatchesFriendsTab(tab);
    setShowMatchesFriends(true);
  };

  const renderContent = () => {
    if (showQuiz) {
      return <Quiz onComplete={(text) => {
        onUpdateUser({ profileText: text, hasCompletedQuiz: true });
        setShowQuiz(false);
        setShowCompletedNotification(true);
      }} onCancel={() => setShowQuiz(false)} darkMode={darkMode} />;
    }

    if (showEditPage) {
      return <EditProfileDescription darkMode={darkMode} currentText={userData.profileText} onSave={(text) => {
        onUpdateUser({ profileText: text });
        setShowEditPage(false);
        setShowEditedNotification(true);
      }} onCancel={() => setShowEditPage(false)} />;
    }

    if (showChangePicture) {
      return <ChangePicturePage darkMode={darkMode} selectedEmoji={userData.profilePicture} onSelect={(emoji) => {
        onUpdateUser({ profilePicture: emoji });
        setShowChangePicture(false);
        setShowPictureUpdatedNotification(true);
      }} onBack={() => setShowChangePicture(false)} />;
    }

    if (showAddFriends) {
      return <AddFriendsPage darkMode={darkMode} addedFriends={userData.addedFriends} onAddFriend={(friend) => {
        onUpdateUser({ addedFriends: [...userData.addedFriends, friend] });
        showToast(`${friend.name} added!`);
      }} onBack={() => setShowAddFriends(false)} />;
    }

    if (showMatchesFriends) {
      return <MatchesFriendsPage 
        darkMode={darkMode}
        initialTab={matchesFriendsTab} 
        addedFriends={userData.addedFriends} 
        matches={userData.matches} 
        onBack={() => setShowMatchesFriends(false)}
        onRemoveFriend={(friend) => {
          onUpdateUser({ addedFriends: userData.addedFriends.filter(f => f.name !== friend.name) });
          showToast(`${friend.name} removed!`);
        }}
      />
    }

    if (showViewAllBadges) {
      // Filter badges into unlocked and locked
      const unlockedBadgeNames = userData.unlockedBadges.map(b => b.name);
      const lockedBadgeNames = ALL_BADGES.filter(name => !unlockedBadgeNames.includes(name));
      
      return (
        <div className={`h-full flex flex-col ${darkMode ? 'bg-slate-900 text-white' : 'bg-white'}`}>
          <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-20 backdrop-blur-md ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
             <button onClick={() => setShowViewAllBadges(false)} className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all active:scale-95 shadow-sm group ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                <ChevronLeft size={20} className={`${darkMode ? 'text-white' : 'text-slate-900'} group-hover:text-indigo-400`} />
             </button>
             <h1 className={`text-sm font-black uppercase tracking-[.2em] ${darkMode ? 'text-white' : 'text-slate-900'}`}>View All Badges</h1>
             <div className="w-10"></div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 pb-32 space-y-10">
            {/* Unlocked Badges */}
            <div>
              <h2 className={`text-xs font-black uppercase tracking-widest mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Unlocked
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {userData.unlockedBadges.map((badge, index) => {
                  const isSelected = userData.selectedBadges.includes(badge.name);
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        if (isSelected) {
                          // Remove from selected
                          onUpdateUser({ 
                            selectedBadges: userData.selectedBadges.filter(b => b !== badge.name) 
                          });
                        } else if (userData.selectedBadges.length < 8) {
                          // Add to selected
                          onUpdateUser({ 
                            selectedBadges: [...userData.selectedBadges, badge.name] 
                          });
                        }
                      }}
                      className={`aspect-[3/4] rounded-2xl p-3 flex flex-col items-center justify-center gap-3 transition-all active:scale-95 relative group ${
                        isSelected 
                          ? (darkMode ? 'bg-indigo-900/30 border-2 border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-indigo-50 border-2 border-indigo-500 shadow-lg shadow-indigo-500/10')
                          : (darkMode ? 'bg-slate-800 border-2 border-slate-700 hover:bg-slate-700' : 'bg-white border-2 border-slate-200 hover:border-indigo-200 hover:shadow-md')
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center shadow-sm z-10 animate-in zoom-in duration-300">
                          <Check className="w-3 h-3 text-white stroke-[3px]" />
                        </div>
                      )}
                      
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 transition-transform group-hover:scale-110 ${isSelected ? 'bg-indigo-500 text-white' : (darkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-400')}`}>
                        <Award className="w-6 h-6" />
                      </div>
                      
                      <div className="text-center space-y-1 w-full">
                        <h3 className={`text-[10px] font-black uppercase leading-tight line-clamp-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{badge.name}</h3>
                        <p className={`text-[8px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          {new Date(badge.dateEarned).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Locked Badges */}
            <div>
              <h2 className={`text-xs font-black uppercase tracking-widest mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Locked
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 opacity-60">
                {lockedBadgeNames.map((name, index) => (
                  <div
                    key={index}
                    className={`aspect-[3/4] rounded-2xl p-3 flex flex-col items-center justify-center gap-3 border-2 border-dashed ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 ${darkMode ? 'bg-slate-800 text-slate-600' : 'bg-slate-200 text-slate-400'}`}>
                      <Award className="w-6 h-6" />
                    </div>
                    
                    <div className="text-center w-full">
                      <h3 className={`text-[10px] font-black uppercase leading-tight line-clamp-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Save Button - Fixed at bottom */}
          <div className={`p-6 border-t backdrop-blur-md sticky bottom-0 z-20 ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-100'}`}>
            <button 
              onClick={() => {
                setShowViewAllBadges(false);
                // Show saved notification
                setShowNotification(true);
                setNotificationMessage('Badge Selection Saved!');
                setTimeout(() => setShowNotification(false), 2000);
              }}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex-1 flex flex-col h-full relative ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>

        {/* Top Profile Header Section */}
        <div className={`px-6 pt-10 pb-8 border-b relative overflow-hidden ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 ${darkMode ? 'bg-indigo-500/20' : 'bg-indigo-500/10'}`}></div>
          
          <div className="flex items-start justify-between mb-8 relative z-10">
            <div className="flex items-center gap-5">
              <div className={`w-24 h-24 rounded-[2.5rem] border-2 flex items-center justify-center text-4xl shadow-premium relative group overflow-hidden ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}`}>
                {userData.profilePicture ? (
                  userData.profilePicture.startsWith('data:') ? (
                    <img src={userData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    userData.profilePicture
                  )
                ) : (
                  <User className={`w-12 h-12 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                )}
                <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors cursor-pointer" onClick={() => setShowChangePicture(true)}></div>
              </div>
              <div>
                <h1 className={`text-2xl font-black tracking-tight leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{userData.name}</h1>
              </div>
            </div>
            <button className={`p-3 rounded-2xl transition-all border shadow-premium active:scale-95 group ${darkMode ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' : 'bg-white border-slate-200 hover:bg-slate-50'}`} onClick={() => onNavigate('settings')}>
              <Settings className={`w-6 h-6 ${darkMode ? 'text-slate-300 group-hover:text-indigo-400' : 'text-slate-900 group-hover:text-indigo-600'}`} />
            </button>
          </div>

          {/* Stats */}
          <div className="flex justify-start gap-10 mb-8 relative z-10">
            <button onClick={() => openMatchesFriends('matches')} className="text-center group active:scale-95 transition-all">
              <div className={`text-2xl font-black group-hover:text-indigo-400 transition-colors tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{userData.matches.length}</div>
              <div className={`text-[10px] uppercase font-black tracking-[.2em] mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Matches</div>
            </button>
            <button onClick={() => openMatchesFriends('friends')} className="text-center group active:scale-95 transition-all">
              <div className={`text-2xl font-black group-hover:text-indigo-400 transition-colors tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{userData.addedFriends.length}</div>
              <div className={`text-[10px] uppercase font-black tracking-[.2em] mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Friends</div>
            </button>
            <button onClick={() => setShowViewAllBadges(true)} className="text-center group active:scale-95 transition-all">
              <div className={`text-2xl font-black group-hover:text-indigo-400 transition-colors tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{userData.selectedBadges.length}</div>
              <div className={`text-[10px] uppercase font-black tracking-[.2em] mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Badges</div>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 relative z-10">
            <button onClick={() => setShowChangePicture(true)} className="flex-1 px-4 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95">
              Change Picture
            </button>
            <button onClick={() => setShowEditPage(true)} className={`flex-1 px-4 py-4 border-2 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-premium active:scale-95 ${darkMode ? 'bg-slate-700 border-indigo-500/50 text-indigo-400 hover:bg-slate-600' : 'bg-white border-indigo-600 text-indigo-600 hover:bg-slate-50'}`}>
              Edit Profile
            </button>
            <button onClick={() => setShowAddFriends(true)} className={`px-4 py-4 border-2 rounded-2xl transition-all shadow-premium active:scale-95 ${darkMode ? 'bg-slate-700 border-indigo-500/50 text-indigo-400 hover:bg-slate-600' : 'bg-white border-indigo-600 text-indigo-600 hover:bg-slate-50'}`}>
              <UserPlus className="w-5 h-5 stroke-[2.5px]" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex px-4 backdrop-blur-md sticky top-0 z-20 border-b-2 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
          {[
            { id: 'profile', label: 'Profile' },
            { id: 'badges', label: 'Badges' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[.25em] transition-all relative ${
                activeTab === tab.id ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="relative z-10">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 shadow-lg shadow-indigo-500/20 animate-in slide-in-from-bottom-2"></div>
              )}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
          {activeTab === 'profile' ? (
            userData.profileText ? (
              <ProfileDescription profileText={userData.profileText} darkMode={darkMode} />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[16rem] text-center space-y-6 animate-in fade-in duration-700">
                <div className={`border-2 border-dashed rounded-[2.5rem] p-10 w-full group transition-all cursor-pointer ${darkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-indigo-500/50' : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-indigo-100'}`} onClick={() => setShowQuiz(true)}>
                  <div className={`w-16 h-16 rounded-2xl shadow-premium border flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-100'}`}>
                    <UserPlus className="w-8 h-8 text-indigo-600" />
                  </div>
                  <p className={`text-[10px] font-black uppercase tracking-[.2em] ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>You have not set up your profile ☹️</p>
                  <p className={`text-sm font-black mt-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Take this short quiz to set up your profile</p>
                </div>
                <button onClick={() => setShowQuiz(true)} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95 text-xs">
                  Start Quiz
                </button>
              </div>
            )
          ) : (
            <div className="grid grid-cols-4 gap-4 animate-in fade-in duration-500">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <button
                  key={i}
                  onClick={() => setShowViewAllBadges(true)}
                  className={`aspect-square border-2 rounded-2xl flex items-center justify-center hover:shadow-premium transition-all active:scale-90 group ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-slate-50 border-slate-100 hover:bg-white'}`}
                >
                  {userData.selectedBadges[i] ? (
                    <div className="flex flex-col items-center gap-1.5 p-1">
                      <Award className="w-7 h-7 text-indigo-400 transition-transform group-hover:scale-110" />
                      <span className={`text-[7px] font-black text-center leading-none uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-slate-900'}`}>{userData.selectedBadges[i]}</span>
                    </div>
                  ) : (
                    <Plus className={`w-7 h-7 transition-colors ${darkMode ? 'text-slate-600 group-hover:text-indigo-400' : 'text-slate-300 group-hover:text-indigo-400'}`} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`h-full relative overflow-hidden ${darkMode ? 'bg-slate-900 text-white' : 'bg-white'}`}>
      {/* Notification Toasts */}
      {(showNotification || showCompletedNotification || showEditedNotification || showPictureUpdatedNotification) && (
        <div className="absolute top-8 left-0 right-0 z-[1000] flex justify-center pointer-events-none px-4 animate-in slide-in-from-top-4 duration-500">
          <div className="bg-slate-900/95 text-white px-5 py-2 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.2)] border border-white/10 flex items-center gap-2.5 backdrop-blur-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-[10px] font-black tracking-[.2em] uppercase">
              {showNotification ? notificationMessage : 
               showCompletedNotification ? 'Profile Description Completed' : 
               showEditedNotification ? 'Profile Description Updated' : 
               'Profile Picture Updated!'}
            </span>
          </div>
        </div>
      )}

      {renderContent()}
    </div>
  );
}

function ProfileDescription({ profileText, darkMode }: { profileText: string; darkMode: boolean }) {
  const isStructured = profileText.includes('Bio:') && profileText.includes('Hobbies:') && profileText.includes('Diploma:');
  if (isStructured) {
    const sections = profileText.split('\n\n').filter(s => s.trim());
    return (
      <div className="space-y-3 animate-in fade-in duration-700 text-left">
        {sections.map((section, idx) => {
          return (
            <div key={idx} className="space-y-0">
              <p className={`text-sm leading-relaxed whitespace-pre-wrap ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{section.split(':')[0]}:</span> {section.split(':').slice(1).join(':').trim()}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`border-2 rounded-[2rem] p-8 shadow-premium animate-in fade-in duration-700 text-left ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
      <p className={`text-sm leading-relaxed whitespace-pre-wrap ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>{profileText}</p>
    </div>
  );
}

function EditProfileDescription({ currentText, onSave, onCancel, darkMode }: { currentText: string; onSave: (text: string) => void; onCancel: () => void; darkMode: boolean }) {
  const [text, setText] = useState(currentText);

  return (
    <div className={`h-full flex flex-col ${darkMode ? 'bg-slate-900 text-white' : 'bg-white'}`}>
      <div className={`backdrop-blur-xl border-b-2 py-6 px-6 flex items-center justify-between sticky top-0 z-20 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
        <button onClick={onCancel} className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all active:scale-95 shadow-sm group ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
          <ChevronLeft size={20} className={`${darkMode ? 'text-white' : 'text-slate-900'} group-hover:text-indigo-400 transition-colors`} />
        </button>
        <h1 className="text-[10px] font-black uppercase tracking-[.4em]">Edit Profile</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write about yourself..."
          className={`w-full h-96 p-6 border-2 rounded-[2rem] resize-none focus:outline-none focus:border-indigo-600 transition-colors text-sm ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}
        />
      </div>

      <div className={`p-6 border-t-2 backdrop-blur-md sticky bottom-0 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
        <button
          onClick={() => onSave(text)}
          disabled={!text.trim()}
          className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
        >
          Save
        </button>
      </div>
    </div>
  );
}

function ChangePicturePage({ selectedEmoji, onSelect, onBack, darkMode }: { selectedEmoji: string | null; onSelect: (emoji: string) => void; onBack: () => void; darkMode: boolean }) {
  const [tempSelection, setTempSelection] = useState<string | null>(selectedEmoji);
  const emojis = ['👨', '👩', '👦', '👧', '🧒', '👴', '👵', '🧑', '👨‍💻', '👩‍💻', '👨‍🎓', '👩‍🎓', '👨‍🔬', '👩‍🔬', '👨‍🎨', '👩‍🎨', '😀', '😎', '🤓', '🤗', '🥳', '😇', '🤠', '🥸', '🤡', '👽', '🤖', '👾', '🎃', '😺', '🦊', '🐼', '🐨', '🐯', '🦁', '🐸', '🐵'];

  const handleUploadImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          setTempSelection(dataUrl);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className={`h-full flex flex-col overflow-hidden ${darkMode ? 'bg-slate-900 text-white' : 'bg-white'}`}>
      <div className={`backdrop-blur-xl border-b-2 py-6 px-6 flex items-center justify-between sticky top-0 z-20 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
        <button onClick={onBack} className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all active:scale-95 shadow-sm group ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
          <ChevronLeft size={20} className={`${darkMode ? 'text-white' : 'text-slate-900'} group-hover:text-indigo-400 transition-colors`} />
        </button>
        <h1 className="text-[10px] font-black uppercase tracking-[.4em]">Change Picture</h1>
        <div className="w-10"></div>
      </div>

      <div className="px-6 pt-6 pb-4">
        <div className="flex flex-col items-center gap-3">
          <div className={`w-24 h-24 rounded-[2rem] border-2 flex items-center justify-center text-5xl shadow-lg overflow-hidden ${darkMode ? 'bg-slate-800 border-indigo-500' : 'bg-slate-50 border-indigo-600'}`}>
            {tempSelection ? (
              tempSelection.startsWith('data:') ? (
                <img src={tempSelection} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                tempSelection
              )
            ) : (
              '👤'
            )}
          </div>
          <p className={`text-xs font-black uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Current Picture</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 pb-24">
        <p className={`text-xs font-black uppercase tracking-wider mb-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Choose New Picture</p>
        <div className="grid grid-cols-5 gap-4">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setTempSelection(emoji)}
              className={`aspect-square text-3xl border-2 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${
                tempSelection === emoji 
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-lg ring-2 ring-indigo-500/20' 
                  : (darkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-500' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-indigo-600')
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className={`p-6 border-t-2 backdrop-blur-md sticky bottom-0 space-y-3 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
        <button
          onClick={handleUploadImage}
          className={`w-full py-4 border-2 rounded-[2rem] font-black uppercase tracking-widest transition-all active:scale-95 text-xs ${darkMode ? 'bg-slate-800 border-indigo-500/50 text-indigo-400 hover:bg-slate-700' : 'bg-white border-indigo-600 text-indigo-600 hover:bg-indigo-50'}`}
        >
          Upload Image
        </button>
        <button
          onClick={() => {
            if (tempSelection) onSelect(tempSelection);
          }}
          disabled={!tempSelection}
          className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
        >
          Save
        </button>
      </div>
    </div>
  );
}

function AddFriendsPage({ addedFriends, onAddFriend, onBack, darkMode }: { addedFriends: Array<{name: string, emoji: string}>; onAddFriend: (friend: {name: string, emoji: string}) => void; onBack: () => void; darkMode: boolean }) {
  const [searchQuery, setSearchQuery] = useState('');

  const allFriends = [
    { name: 'Sarah Lim', emoji: '👩' },
    { name: 'Marcus Tan', emoji: '👨' },
    { name: 'Emily Wong', emoji: '👩‍💻' },
    { name: 'Daniel Ng', emoji: '🧑' },
    { name: 'Alicia Goh', emoji: '👩‍🔬' },
    { name: 'Jason Lim', emoji: '👨‍🔧' },
    { name: 'Kimberly', emoji: '👩‍🎨' },
    { name: 'Aiden Koh', emoji: '🧟‍♂️' },
  ];

  const filteredFriends = allFriends.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !addedFriends.some(af => af.name === f.name)
  );

  return (
    <div className={`h-full flex flex-col ${darkMode ? 'bg-slate-900 text-white' : 'bg-white'}`}>
      <div className={`backdrop-blur-xl border-b-2 py-6 px-6 flex items-center justify-between sticky top-0 z-20 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
        <button onClick={onBack} className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all active:scale-95 shadow-sm group ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
          <ChevronLeft size={20} className={`${darkMode ? 'text-white' : 'text-slate-900'} group-hover:text-indigo-400 transition-colors`} />
        </button>
        <h1 className="text-[10px] font-black uppercase tracking-[.4em]">Add Friends</h1>
        <div className="w-10"></div>
      </div>

      <div className="px-6 py-4">
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search friends..."
            className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:border-indigo-600 transition-colors text-sm ${darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-600' : 'bg-white border-slate-200 text-slate-900'}`}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24">
        <div className="space-y-3">
          {filteredFriends.map((friend) => (
            <div key={friend.name} className={`flex items-center gap-4 p-4 border-2 rounded-2xl shadow-sm group transition-all ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-indigo-500/50' : 'bg-white border-slate-100 hover:border-indigo-100'}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border transition-transform group-hover:scale-110 ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>{friend.emoji}</div>
              <div className="flex-1">
                <p className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{friend.name}</p>
              </div>
              <button
                onClick={() => onAddFriend(friend)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MatchesFriendsPage({ initialTab, addedFriends, matches, onBack, onRemoveFriend, darkMode }: { initialTab: 'matches' | 'friends'; addedFriends: Array<{name: string, emoji: string}>; matches: Array<{name: string, emoji: string}>; onBack: () => void; onRemoveFriend: (friend: {name: string, emoji: string}) => void; darkMode: boolean }) {
  const [tab, setTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmRemove, setConfirmRemove] = useState<{name: string, emoji: string} | null>(null);

  const list = tab === 'matches' ? matches : addedFriends;
  const filteredList = list.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={`h-full flex flex-col relative ${darkMode ? 'bg-slate-900 text-white' : 'bg-white'}`}>
      {/* Confirmation Dialog */}
      {confirmRemove && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-6 animate-in fade-in duration-200">
          <div className={`rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <div className="flex flex-col items-center text-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${darkMode ? 'bg-red-500/10' : 'bg-red-100'}`}>
                <div className="text-4xl">{confirmRemove.emoji}</div>
              </div>
              <div>
                <h3 className={`text-lg font-black mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Remove Friend?</h3>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Are you sure you want to remove <span className={`font-bold ${darkMode ? 'text-indigo-400' : 'text-slate-900'}`}>{confirmRemove.name}</span> from your friends list?
                </p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={() => setConfirmRemove(null)}
                  className={`flex-1 px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onRemoveFriend(confirmRemove);
                    setConfirmRemove(null);
                  }}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-500/20"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`backdrop-blur-xl border-b-2 py-6 px-6 flex items-center justify-between sticky top-0 z-20 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
        <button onClick={onBack} className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all active:scale-95 shadow-sm group ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
          <ChevronLeft size={20} className={`${darkMode ? 'text-white' : 'text-slate-900'} group-hover:text-indigo-400 transition-colors`} />
        </button>
        <h1 className="text-[10px] font-black uppercase tracking-[.4em]">{tab === 'matches' ? 'Matches' : 'Friends'}</h1>
        <div className="w-10"></div>
      </div>

      <div className={`flex px-4 border-b-2 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        {[
          { id: 'matches', label: 'Matches' },
          { id: 'friends', label: 'Friends' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[.25em] transition-all relative ${
              tab === t.id ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {t.label}
            {tab === t.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 shadow-lg shadow-indigo-500/20"></div>
            )}
          </button>
        ))}
      </div>

      <div className="px-6 py-4">
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${tab}...`}
            className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:border-indigo-600 transition-colors text-sm ${darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-600' : 'bg-white border-slate-200 text-slate-900'}`}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24">
        <div className="space-y-3">
          {filteredList.map((item) => (
            <div key={item.name} className={`flex items-center gap-4 p-4 border-2 rounded-2xl shadow-sm group transition-all ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-indigo-500/50' : 'bg-white border-slate-100 hover:border-indigo-100'}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border transition-transform group-hover:scale-110 ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>{item.emoji}</div>
              <div className="flex-1">
                <p className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.name}</p>
              </div>
              {tab === 'friends' && (
                <button
                  onClick={() => setConfirmRemove(item)}
                  className={`p-2 rounded-xl transition-all active:scale-95 ${darkMode ? 'bg-slate-700 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          {filteredList.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No {tab} found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}