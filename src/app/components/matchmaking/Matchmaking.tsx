import { useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  Settings,
  Star,
  Zap,
  Users,
  Home,
  Search as SearchIcon,
  Bot,
  MessageCircle,
  Calendar,
  ChevronDown,
  ClipboardList,
  Filter,
  ArrowDown,
  ArrowUp,
  HomeIcon,
  BookOpen,
  User,
  Plus,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { type PageType, type MatchmakingRequest, type Student, globalStudents, type UserData, type MatchPreferences } from "../../App";
import { MatchStatus } from "./MatchStatus";

interface SearchProps {
  onNavigate: (page: PageType) => void;
}

interface MatchmakingProps {
  onNavigate: (page: PageType, data?: any) => void;
  sentRequests: MatchmakingRequest[];
  receivedRequests: MatchmakingRequest[];
  onUpdateStatus: (id: string, category: 'sent' | 'received', newStatus: MatchmakingRequest['status']) => void;
  defaultTab?: "browse" | "requests";
  userData: UserData;
  matchPreferences: MatchPreferences;
}

export function Search({ onNavigate }: SearchProps) {
  return <div>Search Page</div>;
}

export function Matchmaking({ 
  onNavigate, 
  sentRequests: sentRequestsProp, 
  receivedRequests: receivedRequestsProp,
  onUpdateStatus,
  defaultTab = "browse",
  userData,
  matchPreferences
}: MatchmakingProps) {
  const [selectedModules, setSelectedModules] = useState<
    string[]
  >([]);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [availableNow, setAvailableNow] = useState(false);
  const [matchMyTime, setMatchMyTime] = useState(false);
  const [thisWeek, setThisWeek] = useState(false);
  const [showModulesDropdown, setShowModulesDropdown] =
    useState(false);
  const [currentPage, setCurrentPage] =
    useState<PageType>("matchmaking");
  const [unreadMessages, setUnreadMessages] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<string>("match");
  const [showSortDropdown, setShowSortDropdown] =
    useState(false);
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc"
  >("desc");
  const [activeTab, setActiveTab] = useState<
    "browse" | "requests"
  >(defaultTab);
  const [expanded, setExpanded] = useState(false);
  const [expandedCard, setExpandedCard] = useState<
    string | null
  >(null);

  const activeMatches = [
    {
      id: "match1",
      name: "Marcus Tan",
      connectedAt: "2 days ago",
    },
    {
      id: "match2",
      name: "Emily Wong",
      connectedAt: "1 week ago",
    },
    {
      id: "match3",
      name: "Zara Teo",
      connectedAt: "3 hours ago",
    },
  ];

  const upcomingSessions = [
    {
      id: "session1",
      name: "Marcus Tan",
      title: "BED Project Discussion",
      time: "Friday, 3:00 PM • Online (Zoom)",
    },
    {
      id: "session2",
      name: "Emily Wong",
      title: "FOP2 Mock Test Prep",
      time: "Next Monday, 10:00 AM • Library Level 6",
    },
  ];

  // Use modules from user preferences, or fallback to all modules if preferences not set
  const modules = matchPreferences.selectedModules && matchPreferences.selectedModules.length > 0 
    ? matchPreferences.selectedModules 
    : ["FOP2", "BED", "PDS", "DF", "FOP"];

  const students = globalStudents;

  const isRequestDisabled = (studentName: string) => {
    return [...sentRequestsProp, ...receivedRequestsProp].some(
      (r) => r.name === studentName && (r.status === 'New' || r.status === 'Pending')
    );
  };

  const toggleModule = (module: string) => {
    setSelectedModules((prev) =>
      prev.includes(module)
        ? prev.filter((m) => m !== module)
        : [...prev, module],
    );
  };

  const calculateMatch = (student: Student) => {
    let score = 0;
    
    // 1. Module Match (25%)
    const sharedModules = student.modules.filter(m => matchPreferences.selectedModules.includes(m));
    if (matchPreferences.selectedModules.length > 0) {
      score += (sharedModules.length / Math.max(matchPreferences.selectedModules.length, 1)) * 25;
    }

    // 2. Study Field (Diploma) Match (15%)
    if (student.diploma === "DIT") {
      score += 15;
    } else {
      score += 5;
    }

    // 3. Level/Year Match (15%)
    const userYear = userData.year || 2;
    const yearDiff = Math.abs(student.year - userYear);
    if (yearDiff === 0) score += 15;
    else if (yearDiff === 1) score += 7;
    else score += 2;

    // 4. Availability Match (15%)
    if (matchPreferences.selectedTimes && matchPreferences.selectedTimes.length > 0) {
      const studentTime = student.preferredTime.toLowerCase();
      if (matchPreferences.selectedTimes.includes(studentTime)) {
        score += 15;
      } else {
        score += 5;
      }
    } else {
      score += 7;
    }

    // 5. Mode Preference Match (10%)
    const userPrefersOnline = matchPreferences.selectedModes.includes("online");
    const userPrefersOnCampus = matchPreferences.selectedModes.includes("campus");
    
    if (student.online && userPrefersOnline) score += 10;
    else if (!student.online && userPrefersOnCampus) score += 10;
    else if (matchPreferences.selectedModes.includes("hybrid")) score += 8;
    else score += 3;

    // 6. Study Style Match (10%) - NEW
    if (matchPreferences.style) {
      const styleMatch = student.name.length % 3; // Simulated style compatibility
      if (matchPreferences.style === "discussion" && styleMatch === 0) score += 10;
      else if (matchPreferences.style === "quiet" && styleMatch === 1) score += 10;
      else if (matchPreferences.style === "collaborative" && styleMatch === 2) score += 10;
      else score += 5;
    } else {
      score += 5;
    }

    // 7. Partner Level Preference (5%) - NEW
    if (matchPreferences.partnerLevel) {
      if (matchPreferences.partnerLevel === "same" && yearDiff === 0) score += 5;
      else if (matchPreferences.partnerLevel === "higher" && student.year > userYear) score += 5;
      else if (matchPreferences.partnerLevel === "lower" && student.year < userYear) score += 5;
      else score += 2;
    } else {
      score += 2;
    }

    // 8. Natural Divergence Factor (5%)
    const variance = ((student.name.length + student.name.charCodeAt(0)) % 5);
    score += variance;

    // Language Filter/Bonus (Implicit since language is string in preferences)
    // If we want to strictly filter or boost
    if (matchPreferences.language && matchPreferences.language !== "English") {
        const prefLangs = matchPreferences.language.split(',').map(l => l.trim().toLowerCase());
        // Check if student has ANY of the preferred languages
        // For now assuming student might have languages property if we added it, 
        // else fallback to name check assumption or just small bonus
        if (student.languages) {
             const hasLang = student.languages.some(l => prefLangs.includes(l.toLowerCase()));
             if (hasLang) score += 5;
        } else {
             // Fallback for demo if data missing
             if (matchPreferences.language.includes("English")) score += 2;
        }
    }

    return Math.min(Math.round(score), 100);
  };

  const isProfileComplete = userData.profileText && userData.profileText.length > 0;
  const isPreferencesComplete = 
    matchPreferences.selectedModules && 
    matchPreferences.selectedModules.length > 0 &&
    matchPreferences.scheduleSet === true;

  const filteredStudents = students
    .map(s => {
      const calculatedMatch = calculateMatch(s);
      // Update the match in globalStudents to persist across navigation
      const globalStudent = globalStudents.find(gs => gs.name === s.name);
      if (globalStudent) {
        globalStudent.match = calculatedMatch;
      }
      return { ...s, match: calculatedMatch };
    })
    .filter((s) => {
      // Hide very low matches (divergence & relevance)
      // Apply threshold only for the 'browse' tab. Always show in 'requests' tab.
      if (activeTab === 'browse' && s.match < 30) return false;

      if (searchTerm && !s.name.toLowerCase().includes(searchTerm.toLowerCase()) && !s.modules.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()))) return false;
      if (
        selectedModules.length &&
        !s.modules.some((m) => selectedModules.includes(m))
      )
        return false;
      if (availableNow && !s.online) return false;
      if (onlineOnly && !s.online) return false;
      
      // Match My Time filter - check if student's preferred time matches user's selected times
      if (matchMyTime && matchPreferences.selectedTimes && matchPreferences.selectedTimes.length > 0) {
        const studentTime = s.preferredTime.toLowerCase();
        // Check if student's time matches ANY of the user's selected times
        if (!matchPreferences.selectedTimes.includes(studentTime)) {
          return false;
        }
      }
      
      return true;
    });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let comparison = 0;
    switch (sortOption) {
      case "match":
        comparison = b.match - a.match;
        break;
      case "availability":
        comparison = Number(b.online) - Number(a.online);
        break;
      case "level":
        comparison = b.year - a.year; // assumption: higher year is 'higher level'
        break;
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
    }
    return sortDirection === "desc" ? comparison : -comparison;
  });

  const bestMatch = sortedStudents[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="flex items-center justify-between px-6 py-5">
          <button 
            onClick={() => onNavigate('home')}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
          >
            <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
          </button>
          <h1 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em] flex-1 text-center">Study Partner Matchmaking</h1>
          <button 
            onClick={() => onNavigate('preferences')}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
          >
            <Settings size={18} className="text-slate-600 group-hover:text-indigo-600 transition-colors" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-slate-50">
          <button
            className={`flex-1 pb-3 text-sm font-extrabold transition-all relative ${
              activeTab === "browse"
                ? "text-indigo-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
            onClick={() => setActiveTab("browse")}
          >
            Browse Matches
            {activeTab === "browse" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full animate-in zoom-in"></div>
            )}
          </button>
          <button
            className={`flex-1 pb-3 text-sm font-extrabold transition-all relative ${
              activeTab === "requests"
                ? "text-indigo-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
            onClick={() => setActiveTab("requests")}
          >
            My Requests
            {activeTab === "requests" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full animate-in zoom-in"></div>
            )}
          </button>
        </div>
      </div>

      {activeTab === "browse" && (
        <div className="flex flex-col animate-in fade-in duration-500">
          {/* Filter Bar */}
          <div className="bg-white px-6 py-4 space-y-4 shadow-premium border-b border-slate-200 relative z-30">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <SearchIcon className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search by name or module..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl text-sm font-extrabold text-slate-900 placeholder:text-slate-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-indigo-50/5 focus:border-indigo-500/10 border"
              />
            </div>

            <div className="flex flex-wrap gap-2 pb-1">
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-5 py-3 bg-indigo-600 rounded-2xl text-white text-[11px] font-black shadow-lg shadow-indigo-100 shrink-0 transition-transform active:scale-95 tracking-widest"
                  onClick={() => setShowModulesDropdown(!showModulesDropdown)}
                >
                  {selectedModules.length === 0
                    ? "All Modules"
                    : selectedModules.length === 1
                    ? selectedModules[0]
                    : `${selectedModules[0]} +${selectedModules.length - 1}`}
                  <ChevronDown className={`w-4 h-4 opacity-70 transition-transform ${showModulesDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showModulesDropdown && (
                  <div className="absolute top-full mt-3 left-0 w-64 bg-white rounded-3xl shadow-2xl border border-slate-200 p-3 z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 gap-1">
                      {modules.map((m) => (
                        <button
                          key={m}
                          onClick={() => toggleModule(m)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                            selectedModules.includes(m)
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <span className="text-xs font-black uppercase tracking-wider">{m}</span>
                          {selectedModules.includes(m) && (
                            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setAvailableNow(!availableNow)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all border ${
                  availableNow 
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              >
                Available Now
              </button>

              <button
                onClick={() => setMatchMyTime(!matchMyTime)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all border ${
                  matchMyTime 
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              >
                Match My Time
              </button>

            </div>

            <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border transition-all ${
                    showSortDropdown || sortOption !== 'match'
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-wider">Sort Results</span>
                  </div>
                  <span className="text-xs font-black">
                    {{
                      match: 'Best Match',
                      availability: 'Online First',
                      level: 'Year',
                      name: 'Name'
                    }[sortOption] || 'Sort'}
                  </span>
                </button>
                
                {showSortDropdown && (
                  <div className="absolute top-full mt-3 right-0 left-0 bg-white rounded-3xl shadow-2xl border border-slate-200 p-3 z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[.2em] px-4 py-2 mb-1">
                      Sort By
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {[
                        { id: 'match', label: 'Best Match' },
                        { id: 'availability', label: 'Online First' },
                        { id: 'level', label: 'Year' },
                        { id: 'name', label: 'Name (A-Z)' }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setSortOption(opt.id);
                            setShowSortDropdown(false);
                          }}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                            sortOption === opt.id
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <span className="text-xs font-black uppercase tracking-wider">{opt.label}</span>
                          {sortOption === opt.id && (
                            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="px-6 py-6 space-y-8">
            {!isProfileComplete || !isPreferencesComplete ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in fade-in duration-700">
                <div className="w-20 h-20 bg-indigo-50 border-2 border-indigo-100/50 rounded-[2rem] flex items-center justify-center text-indigo-600 shadow-sm relative">
                   <Users size={32} />
                   <div className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 rounded-full border-4 border-white flex items-center justify-center">
                      <span className="text-[10px] text-white font-black">!</span>
                   </div>
                </div>
                <div className="space-y-2 max-w-[280px]">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Recommendations Locked</h3>
                  <p className="text-xs font-bold text-slate-400 leading-relaxed tracking-widest">
                    To unlock your study partners, please complete your study profile quiz and set match preferences first.
                  </p>
                </div>
                <div className="flex flex-col w-full gap-3 pt-4">
                   {!isProfileComplete && (
                     <button 
                       onClick={() => onNavigate('profile')}
                       className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[.2em] shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
                     >
                       Complete Quiz
                     </button>
                   )}
                   {!isPreferencesComplete && (
                     <button 
                       onClick={() => onNavigate('preferences')}
                       className="w-full py-4 bg-white border-2 border-indigo-100 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-[.2em] hover:bg-indigo-50 active:scale-95 transition-all"
                     >
                       Set Preferences
                     </button>
                   )}
                </div>
              </div>
            ) : (
              <>
                {/* Best Match */}
                {bestMatch && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <div className="p-1 px-3 bg-amber-50 rounded-full flex items-center gap-2 border border-amber-100 shadow-sm">
                        <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                        <span className="text-[11px] font-black text-amber-600 uppercase tracking-widest leading-none">
                          Best Match
                        </span>
                      </div>
                    </div>

                    <div
                      className="relative overflow-hidden bg-white p-8 rounded-[2.5rem] shadow-premium border border-indigo-200 cursor-pointer group transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl active:scale-[0.99]"
                      onClick={() => onNavigate("match-profile", bestMatch)}
                    >
                      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500 opacity-[0.05] rounded-full -mr-24 -mt-24 blur-3xl"></div>
                      
                      <div className="relative flex items-start justify-between mb-8">
                        <div className="flex items-center gap-5">
                          <div className="relative">
                            <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center border-4 border-white shadow-premium overflow-hidden transition-all group-hover:scale-110 group-hover:rotate-3">
                               <span className="text-4xl font-black relative z-10">
                                  {bestMatch.avatar}
                               </span>
                            </div>
                            {bestMatch.online && (
                              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-4 border-white ring-4 ring-emerald-500/5 animate-pulse"></span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                              {bestMatch.name}
                            </h3>
                            <p className="text-[13px] font-black text-slate-400 uppercase tracking-widest mt-1">
                              {bestMatch.diploma} • Year {bestMatch.year}
                            </p>
                          </div>
                        </div>
                        <div className="px-4 py-2 bg-indigo-600 rounded-[1.25rem] shadow-lg shadow-indigo-100">
                           <span className="text-xs font-black text-white">{bestMatch.match}%</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2.5 mb-8">
                        {bestMatch.modules.map((m) => (
                          <span
                            className="px-4 py-2 bg-slate-50 border border-slate-200 text-[10px] font-black text-indigo-600/80 rounded-xl uppercase tracking-[.15em] transition-colors group-hover:bg-indigo-50"
                            key={m}
                          >
                            {m}
                          </span>
                        ))}
                      </div>

                      <p className="text-sm font-bold text-slate-500 leading-relaxed mb-8 italic">
                        "Looking for a partner for <span className="text-indigo-600 font-black">{bestMatch.modules[0]}</span> mock exams. Available mostly in the mornings."
                      </p>

                      <div className="flex gap-3 relative z-10">
                          <button
                            className="flex-1 py-4.5 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-black text-slate-600 transition-all hover:bg-slate-100 hover:border-indigo-100 active:scale-95"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate("match-profile", bestMatch);
                          }}
                        >
                          View Profile
                        </button>
                        <button
                          className="flex-[2] py-4.5 bg-indigo-600 rounded-2xl text-[13px] font-black text-white shadow-lg shadow-indigo-100 transition-all hover:shadow-indigo-200 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group/btn relative overflow-hidden"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate("send-request", bestMatch);
                          }}
                          disabled={isRequestDisabled(bestMatch.name)}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-700 opacity-100 ${isRequestDisabled(bestMatch.name) ? 'grayscale opacity-50' : ''}`}></div>
                          <span className="relative z-10 uppercase tracking-[.25em]">{isRequestDisabled(bestMatch.name) ? 'Requested' : 'Send Request'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* More Matches */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">
                        Recommended
                     </h3>
                     <span className="text-[11px] font-bold text-slate-400">{sortedStudents.length > 0 ? sortedStudents.length - (bestMatch ? 1 : 0) : 0} found</span>
                  </div>
                  
                  <div className="space-y-3">
                    {sortedStudents.slice(bestMatch ? 1 : 0).map((s) => (
                      <div
                        key={s.name}
                        className="bg-white p-5 rounded-3xl border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] cursor-pointer transition-all hover:shadow-premium hover:-translate-y-0.5 active:scale-[0.98] group"
                        onClick={() => onNavigate("match-profile", s)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-200 shadow-sm group-hover:bg-white transition-colors">
                                <span className="text-2xl">
                                  {s.avatar}
                                </span>
                              </div>
                              {s.online && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
                              )}
                            </div>
                            <div>
                              <h4 className="text-[15px] font-extrabold text-slate-900">
                                {s.name}
                              </h4>
                              <p className="text-xs font-bold text-slate-400">
                                Year {s.year} • {s.diploma}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                             <div className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                               {s.match}%
                             </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {s.modules.map((m) => (
                            <span
                              className="px-2.5 py-1 bg-slate-50 text-[10px] font-black text-slate-500 rounded-lg uppercase tracking-tight"
                              key={m}
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="py-8 text-center space-y-2">
                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full mx-auto"></div>
                    <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">
                      End of search results
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === "requests" && (
        !isProfileComplete || !isPreferencesComplete ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center space-y-8 animate-in fade-in duration-700">
            <div className="relative">
              <div className="w-24 h-24 bg-indigo-50 border-2 border-indigo-100/50 rounded-[2.5rem] flex items-center justify-center text-indigo-600 shadow-sm">
                <Users size={40} />
              </div>
              <div className="absolute -top-1 -right-1 w-7 h-7 bg-rose-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                <span className="text-[12px] text-white font-black">!</span>
              </div>
            </div>
            
            <div className="space-y-3 max-w-[280px]">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Setup Required</h3>
              <p className="text-sm font-bold text-slate-400 leading-relaxed">
                To see your study requests, please complete your study profile quiz and set match preferences first.
              </p>
            </div>

            <div className="flex flex-col w-full max-w-[280px] gap-4 pt-4">
              {!isProfileComplete ? (
                <button 
                  onClick={() => onNavigate('profile')}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[.25em] shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  Complete Quiz
                </button>
              ) : null}
              <button 
                onClick={() => onNavigate('preferences')}
                className={`w-full py-5 bg-white border-2 rounded-2xl text-[11px] font-black uppercase tracking-[.25em] active:scale-95 transition-all shadow-premium
                  ${!isProfileComplete ? 'border-indigo-100 text-indigo-600 hover:bg-indigo-50' : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'}
                `}
              >
                Set Preferences
              </button>
            </div>
          </div>
        ) : (
          <MatchStatus
            onNavigate={onNavigate}
            receivedRequests={receivedRequestsProp}
            sentRequests={sentRequestsProp}
            onUpdateStatus={onUpdateStatus}
            activeMatches={activeMatches}
            upcomingSessions={upcomingSessions}
          />
        )
      )}
    </div>
  );
}
