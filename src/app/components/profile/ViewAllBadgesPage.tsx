import { useState } from 'react';
import { Award, ChevronLeft } from 'lucide-react';

interface ViewAllBadgesPageProps {
    selectedBadges: string[];
    unlockedBadgesList: Array<{name: string, dateEarned: string}>;
    onBack: (badges: string[]) => void;
}

export function ViewAllBadgesPage({ selectedBadges, unlockedBadgesList, onBack }: ViewAllBadgesPageProps) {
    const [temp, setTemp] = useState(selectedBadges);
    
    // Sort unlocked badges by date earned (newest first)
    const sortedUnlockedBadges = [...unlockedBadgesList].sort((a, b) => 
        new Date(b.dateEarned).getTime() - new Date(a.dateEarned).getTime()
    );
    
    // Badge categories
    const badgeCategories = {
        commitment: {
            title: 'Commitment Milestones',
            color: 'indigo',
            badges: ['10 Hours', '20 Hours', '30 Hours', '50 Hours', '75 Hours', '100 Hours']
        },
        periodic: {
            title: 'Periodic Achievements',
            color: 'purple',
            badges: ['Daily Champion', 'Weekly Champion', 'Monthly Champion', 'Yearly Champion']
        },
        elite: {
            title: 'Elite Achievements',
            color: 'amber',
            badges: ['Grand Champion', 'Royal Champion', 'Super Champion', 'Ultimate Champion']
        },
        contribution: {
            title: 'Contribution & Impact',
            color: 'emerald',
            badges: ['Very Helpful', 'Super Resourceful', 'Lifesaver', 'Celebrity']
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    const UnlockedBadgeButton = ({ badge, dateEarned }: { badge: string, dateEarned: string }) => {
        const isSelected = temp.includes(badge);
        return (
            <button 
              onClick={() => {
                  if (isSelected) {
                      setTemp(temp.filter(x => x !== badge));
                  } else if (temp.length < 8) {
                      setTemp([...temp, badge]);
                  }
              }} 
              className={`border-2 rounded-2xl p-4 transition-all active:scale-95 relative group ${
                isSelected 
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-inner' 
                  : 'border-slate-100 bg-white shadow-premium hover:border-indigo-200'
              }`}
            >
                <div className="flex flex-col items-center">
                    <Award className={`w-10 h-10 mb-2 transition-transform duration-500 ${isSelected ? 'text-indigo-600 scale-110' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                    <span className={`text-[8px] font-black text-center uppercase leading-none tracking-tighter mb-1 ${isSelected ? 'text-indigo-600' : 'text-slate-700'}`}>{badge}</span>
                    <span className="text-[7px] font-semibold text-slate-400 tracking-wide">{formatDate(dateEarned)}</span>
                </div>
                {isSelected && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-[10px]">✓</span>
                    </div>
                )}
            </button>
        );
    };

    const LockedBadgeButton = ({ badge, categoryColor }: { badge: string, categoryColor: string }) => {
        const colorClasses = {
            indigo: 'border-indigo-50 bg-indigo-50/30',
            purple: 'border-purple-50 bg-purple-50/30',
            amber: 'border-amber-50 bg-amber-50/30',
            emerald: 'border-emerald-50 bg-emerald-50/30'
        };
        
        return (
            <div className={`border-2 rounded-2xl p-4 opacity-50 ${colorClasses[categoryColor as keyof typeof colorClasses]}`}>
                <div className="flex flex-col items-center">
                    <Award className="w-10 h-10 mb-2 text-slate-300" />
                    <span className="text-[8px] font-black text-center uppercase leading-none tracking-tighter text-slate-400">{badge}</span>
                    <div className="mt-1 px-2 py-0.5 bg-slate-200/50 rounded-full">
                        <span className="text-[6px] font-bold text-slate-500 uppercase tracking-wider">Locked</span>
                    </div>
                </div>
            </div>
        );
    };

    const unlockedNames = sortedUnlockedBadges.map(b => b.name);

    return (
        <div className="h-full bg-gradient-to-b from-white to-slate-50 flex flex-col">
            <div className="bg-white/80 backdrop-blur-xl border-b-2 border-slate-100 py-6 px-8 flex items-center justify-between sticky top-0 z-20">
                <button 
                  onClick={() => onBack(temp)}
                  className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
                >
                    <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
                </button>
                <div className="text-center">
                    <h1 className="text-[10px] font-black uppercase tracking-[.4em] text-slate-900">Badge Collection</h1>
                    <p className="text-[8px] font-semibold text-slate-500 mt-0.5">{temp.length} / 8 Selected</p>
                </div>
                <div className="w-10"></div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-8 py-8 pb-20">
                <div className="max-w-6xl mx-auto space-y-12">
                    {/* Unlocked Badges Section */}
                    <div className="space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full border border-indigo-100">
                                <Award className="w-4 h-4 text-indigo-600" />
                                <p className="text-[9px] font-black text-indigo-600 uppercase tracking-[.3em]">Unlocked Badges</p>
                                <span className="ml-1 px-2 py-0.5 bg-indigo-600 text-white rounded-full text-[8px] font-black">{sortedUnlockedBadges.length}</span>
                            </div>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                        </div>
                        <div className="grid grid-cols-6 gap-4">
                            {sortedUnlockedBadges.map(badge => (
                                <UnlockedBadgeButton key={badge.name} badge={badge.name} dateEarned={badge.dateEarned} />
                            ))}
                        </div>
                        {sortedUnlockedBadges.length === 0 && (
                            <div className="text-center py-12 px-4">
                                <Award className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                                <p className="text-sm font-black text-slate-400 uppercase tracking-wider">No unlocked badges yet</p>
                                <p className="text-xs text-slate-400 mt-2">Complete activities to earn your first badge!</p>
                            </div>
                        )}
                    </div>

                    {/* Locked Badges - Categorized */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-200">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[.3em]">Locked Badges</span>
                            </div>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                        </div>

                        {Object.entries(badgeCategories).map(([key, category]) => {
                            const lockedInCategory = category.badges.filter(b => !unlockedNames.includes(b));
                            if (lockedInCategory.length === 0) return null;
                            
                            return (
                                <div key={key} className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-[9px] font-black text-slate-700 uppercase tracking-[.25em]">{category.title}</h3>
                                        <div className="h-px flex-1 bg-slate-200"></div>
                                    </div>
                                    <div className="grid grid-cols-6 gap-4">
                                        {lockedInCategory.map(badge => (
                                            <LockedBadgeButton key={badge} badge={badge} categoryColor={category.color} />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="px-8 py-6 border-t-2 border-slate-100 bg-white/80 backdrop-blur-md sticky bottom-0">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Select up to 8 badges to showcase</p>
                    </div>
                    <button 
                        onClick={() => onBack(temp)}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
