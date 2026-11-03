import React, { useState } from 'react';
import { Settings, Search, Star, Clock, MapPin, Send, X, Check, Sparkles, Languages, Target, GraduationCap, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import type { PageType, MatchmakingRequest, Student, UserData, MatchPreferences } from '../../App';

interface TabletMatchmakingProps {
  onNavigate: (page: PageType, data?: any) => void;
  sentRequests: MatchmakingRequest[];
  receivedRequests: MatchmakingRequest[];
  onUpdateStatus: (id: string, category: 'sent' | 'received', newStatus: MatchmakingRequest['status']) => void;
  defaultTab?: "browse" | "requests";
  userData: UserData;
  matchPreferences: MatchPreferences;
  students: Student[];
  darkMode?: boolean;
}

export function TabletMatchmaking({
  onNavigate,
  sentRequests,
  receivedRequests,
  onUpdateStatus,
  defaultTab = "browse",
  userData,
  matchPreferences,
  students,
  darkMode = false
}: TabletMatchmakingProps) {
  const [activeTab, setActiveTab] = useState<"browse" | "requests">(defaultTab);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [selectedProfiles, setSelectedProfiles] = useState<Student[]>([]);

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.diploma.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.modules.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesModule = selectedModule === "all" || student.modules.includes(selectedModule);
    const matchesOnline = !onlineOnly || student.online;
    const notSelected = !selectedProfiles.some(p => p.name === student.name);
    return matchesSearch && matchesModule && matchesOnline && notSelected;
  }).sort((a, b) => b.match - a.match);

  const allModules = Array.from(new Set(students.flatMap(s => s.modules))).sort();

  // Get new requests count
  const newRequestsCount = receivedRequests.filter(r => r.status === 'New').length;

  const handleSelectProfile = (student: Student) => {
    if (selectedProfiles.length < 2) {
      setSelectedProfiles([...selectedProfiles, student]);
    }
  };

  const handleRemoveProfile = (studentName: string) => {
    setSelectedProfiles(selectedProfiles.filter(p => p.name !== studentName));
  };

  const getGridHeights = () => {
    switch (selectedProfiles.length) {
      case 0:
        return { profileHeight: '0%', browseHeight: '100%' };
      case 1:
        return { profileHeight: '45%', browseHeight: '55%' };
      case 2:
        return { profileHeight: '45%', browseHeight: '55%' };
      default:
        return { profileHeight: '0%', browseHeight: '100%' };
    }
  };

  const heights = getGridHeights();

  // Check if profile and preferences are complete
  const isProfileComplete = userData.hasCompletedQuiz;
  const isPreferencesComplete = matchPreferences?.selectedModules?.length > 0;

  // Profile Card Component for selected profiles
  const ProfileCard = ({ student }: { student: Student }) => (
    <div className={`relative h-full border-2 rounded-2xl shadow-lg flex flex-col ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      {/* Close Button */}
      <button
        onClick={() => handleRemoveProfile(student.name)}
        className="absolute top-2 right-2 z-10 w-7 h-7 bg-slate-900/80 hover:bg-red-600 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg group"
      >
        <X className="w-3.5 h-3.5 text-white" />
      </button>

      <div className="flex-1 overflow-hidden p-4 flex flex-col">
        {/* Header - Compact */}
        <div className="flex items-start gap-3 mb-3">
          <div className="relative flex-shrink-0">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-md ${darkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-indigo-100 to-purple-100'}`}>
              {student.avatar}
            </div>
            {student.online && (
              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 rounded-full shadow-md ${darkMode ? 'border-slate-800' : 'border-white'}`}></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={`text-base font-black mb-1 truncate pr-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{student.name}</h3>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Badge className="bg-indigo-600 text-white font-bold text-xs px-2 py-0">
                {student.match}%
              </Badge>
              {student.online && (
                <Badge className={`text-[10px] px-1.5 py-0 ${darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                  Online
                </Badge>
              )}
            </div>
            <p className={`text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Yr {student.year} • {student.diploma}
            </p>
          </div>
        </div>

        {/* Modules - Compact */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <GraduationCap className={`w-3 h-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <h4 className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Modules</h4>
          </div>
          <div className="flex flex-wrap gap-1">
            {student.modules.slice(0, 4).map((module) => (
              <Badge key={module} variant="outline" className={`font-semibold text-[10px] px-1.5 py-0 ${darkMode ? 'border-slate-700 text-indigo-400' : 'border-indigo-200 text-indigo-700'}`}>
                {module}
              </Badge>
            ))}
            {student.modules.length > 4 && (
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${darkMode ? 'border-slate-700 text-slate-500' : ''}`}>
                +{student.modules.length - 4}
              </Badge>
            )}
          </div>
        </div>

        {/* Languages - Compact */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Languages className={`w-3 h-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <h4 className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Languages</h4>
          </div>
          <div className="flex flex-wrap gap-1">
            {student.languages.map((lang) => (
              <Badge key={lang} variant="outline" className={`capitalize text-[10px] px-1.5 py-0 ${darkMode ? 'border-slate-700 text-slate-400' : 'border-slate-200'}`}>
                {lang}
              </Badge>
            ))}
          </div>
        </div>

        {/* Details - Compact */}
        <div className="flex gap-4 mb-3 text-xs">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className={`font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{student.preferredTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className={`font-medium truncate ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{student.location}</span>
          </div>
        </div>

        {/* About - Compact, truncated */}
        <div className="mb-3 flex-1 overflow-hidden">
          <div className="flex items-center gap-1.5 mb-1">
            <Target className={`w-3 h-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <h4 className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>About & Goals</h4>
          </div>
          <p className={`text-xs leading-relaxed line-clamp-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{student.about} {student.goals}</p>
        </div>

        {/* Send Request Button - Compact */}
        <Button
          size="sm"
          className="w-full bg-indigo-600 hover:bg-indigo-700 h-8 text-xs"
          onClick={() => onNavigate('send-request', student)}
        >
          <Send className="w-3 h-3 mr-1.5" />
          Send Request
        </Button>
      </div>
    </div>
  );

  return (
    <div className={`h-full flex flex-col overflow-hidden ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Selected Profiles Section - Dynamic Height */}
      {selectedProfiles.length > 0 && (
        <div 
          className={`border-b-4 overflow-hidden ${darkMode ? 'border-slate-800 bg-slate-850' : 'border-slate-300 bg-gradient-to-b from-white to-slate-50'}`}
          style={{ height: heights.profileHeight }}
        >
          <div 
            className={`h-full p-4 grid gap-4 ${
              selectedProfiles.length === 1 ? 'grid-cols-1' :
              selectedProfiles.length === 2 ? 'grid-cols-2' :
              'grid-cols-3'
            }`}
          >
            {selectedProfiles.map((student) => (
              <ProfileCard key={student.name} student={student} />
            ))}
          </div>
        </div>
      )}

      {/* Browse Section - Dynamic Height */}
      <div 
        className="flex-1 overflow-hidden"
        style={{ height: heights.browseHeight }}
      >
        <div className="h-full max-w-4xl mx-auto px-6 py-4 flex flex-col">
          {/* Header - Compact */}
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <div>
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Find Study Partners</h2>
              <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                Connect with DIT students
                {selectedProfiles.length > 0 && (
                  <span className={`ml-2 font-semibold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    • {selectedProfiles.length}/2 selected
                  </span>
                )}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('preferences')}
              className={`h-8 w-8 ${darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : ''}`}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {/* Tabs - Compact */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "browse" | "requests")} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className={`w-full grid grid-cols-2 mb-3 h-9 flex-shrink-0 ${darkMode ? 'bg-slate-800' : ''}`}>
              <TabsTrigger value="browse" className={`text-xs ${darkMode ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-white' : ''}`}>Browse</TabsTrigger>
              <TabsTrigger value="requests" className={`relative text-xs ${darkMode ? 'data-[state=active]:bg-slate-700 data-[state=active]:text-white' : ''}`}>
                Requests
                {newRequestsCount > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white px-1.5 py-0 text-[10px]">
                    {newRequestsCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Browse Tab Content */}
            <TabsContent value="browse" className="flex-1 flex flex-col overflow-hidden mt-0">
              {!isProfileComplete || !isPreferencesComplete ? (
                /* Locked State */
                <div className="flex flex-col items-center justify-center flex-1 text-center space-y-6 py-12 animate-in fade-in duration-700">
                  <div className={`w-20 h-20 border-2 rounded-[2rem] flex items-center justify-center shadow-sm relative ${darkMode ? 'bg-slate-800 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100/50 text-indigo-600'}`}>
                    <Users size={32} />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 rounded-full border-4 border-white flex items-center justify-center">
                      <span className="text-[10px] text-white font-black">!</span>
                    </div>
                  </div>
                  <div className="space-y-2 max-w-[350px]">
                    <h3 className={`text-lg font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Recommendations Locked</h3>
                    <p className={`text-xs font-bold leading-relaxed tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      To unlock your study partners, please complete your study profile quiz and set match preferences first.
                    </p>
                  </div>
                  <div className="flex flex-col w-full max-w-[350px] gap-3 pt-4">
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
                        className={`w-full py-4 border-2 rounded-2xl text-[10px] font-black uppercase tracking-[.2em] active:scale-95 transition-all ${
                          darkMode ? 'bg-slate-800 border-indigo-500/20 text-indigo-400 hover:bg-slate-700' : 'bg-white border-indigo-100 text-indigo-600 hover:bg-indigo-50'
                        }`}
                      >
                        Set Preferences
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
              {/* Search and Filters - Compact */}
              <Card className={`p-3 mb-3 flex-shrink-0 ${darkMode ? 'bg-slate-800 border-slate-700' : 'border-slate-200'}`}>
                <div className="space-y-2">
                  <div className="relative">
                    <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                    <Input
                      type="text"
                      placeholder="Search by name or module..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`pl-8 h-8 text-xs ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500' : ''}`}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedModule}
                      onChange={(e) => setSelectedModule(e.target.value)}
                      className={`flex-1 px-2.5 py-1.5 border rounded-lg text-xs h-8 outline-none ${
                        darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <option value="all">All Modules</option>
                      {allModules.map(module => (
                        <option key={module} value={module}>{module}</option>
                      ))}
                    </select>

                    <Button
                      variant={onlineOnly ? "default" : "outline"}
                      size="sm"
                      onClick={() => setOnlineOnly(!onlineOnly)}
                      className={`h-8 text-xs px-3 ${darkMode && !onlineOnly ? 'border-slate-600 text-slate-400 hover:bg-slate-700' : ''}`}
                    >
                      Online
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className={`w-full h-8 text-xs ${darkMode ? 'border-slate-600 text-slate-400 hover:bg-slate-700' : ''}`}
                    onClick={() => onNavigate('auto-match')}
                  >
                    <Sparkles className="w-3 h-3 mr-1.5" />
                    Auto Match
                  </Button>
                </div>
              </Card>

              {/* Max Selection Warning - Compact */}
              {selectedProfiles.length === 2 && (
                <Card className={`p-2.5 border-amber-200 bg-amber-50 mb-3 flex-shrink-0 ${darkMode ? 'bg-amber-900/20 border-amber-500/20' : ''}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">⚠️</span>
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${darkMode ? 'text-amber-400' : 'text-amber-900'}`}>Maximum Reached</p>
                      <p className={`text-[10px] ${darkMode ? 'text-amber-500/70' : 'text-amber-700'}`}>Remove one to select another</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Students Grid - Compact, scrollable if needed */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="grid grid-cols-2 gap-3">
                  {filteredStudents.map((student) => {
                    const isDisabled = selectedProfiles.length >= 2;
                    
                    return (
                      <Card
                        key={student.name}
                        className={`p-3 transition-all ${
                          darkMode ? 'bg-slate-800 border-slate-700' : 'border-slate-200'
                        } ${
                          isDisabled 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:shadow-lg hover:border-indigo-300 cursor-pointer'
                        }`}
                        onClick={() => !isDisabled && handleSelectProfile(student)}
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <div className="relative flex-shrink-0">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${darkMode ? 'bg-slate-700' : 'bg-indigo-100'}`}>
                              {student.avatar}
                            </div>
                            {student.online && (
                              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 rounded-full ${darkMode ? 'border-slate-800' : 'border-white'}`}></div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <h4 className={`font-semibold truncate text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>{student.name}</h4>
                              <Badge className={`text-[10px] ml-2 px-1.5 py-0 ${darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`}>
                                {student.match}%
                              </Badge>
                            </div>
                            <p className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                              Yr {student.year} • {student.diploma}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {student.modules.slice(0, 2).map((module) => (
                            <Badge key={module} variant="outline" className={`text-[9px] px-1.5 py-0 ${darkMode ? 'border-slate-700 text-slate-400' : ''}`}>
                              {module}
                            </Badge>
                          ))}
                          {student.modules.length > 2 && (
                            <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${darkMode ? 'border-slate-700 text-slate-500' : ''}`}>
                              +{student.modules.length - 2}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-2">
                          <Clock className="w-2.5 h-2.5" />
                          <span className="truncate">{student.preferredTime}</span>
                        </div>

                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className={`flex-1 h-7 text-[10px] px-2 ${darkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-700' : ''}`}
                            disabled={isDisabled}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isDisabled) handleSelectProfile(student);
                            }}
                          >
                            Compare
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 h-7 text-[10px] px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate('send-request', student);
                            }}
                          >
                            <Send className="w-2.5 h-2.5 mr-1" />
                            Request
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {filteredStudents.length === 0 && (
                  <Card className={`p-8 text-center ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-500' : 'border-slate-200 text-slate-500'}`}>
                    <p className="text-xs">No students found</p>
                  </Card>
                )}
              </div>
                </>
              )}
            </TabsContent>

            {/* Requests Tab Content - Compact */}
            <TabsContent value="requests" className="flex-1 overflow-y-auto mt-0">
              <div className="space-y-4">
                {/* Received Requests */}
                <div>
                  <h3 className={`font-semibold mb-2 flex items-center gap-2 text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Received
                    {newRequestsCount > 0 && (
                      <Badge className="bg-red-500 text-white text-[10px] px-1.5 py-0">{newRequestsCount}</Badge>
                    )}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {receivedRequests.length > 0 ? (
                      receivedRequests.map((request) => (
                        <Card
                          key={request.id}
                          className={`p-3 cursor-pointer hover:shadow-md transition-shadow ${
                            darkMode ? 'bg-slate-800' : ''
                          } ${
                            request.status === 'New' 
                              ? (darkMode ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-indigo-200 bg-indigo-50/50') 
                              : (darkMode ? 'border-slate-700' : 'border-slate-200')
                          }`}
                          onClick={() => onNavigate('request-detail', request)}
                        >
                          <div className="flex items-start justify-between mb-1.5">
                            <div>
                              <h4 className={`font-semibold text-xs ${darkMode ? 'text-white' : 'text-slate-900'}`}>{request.name}</h4>
                              <p className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{request.module}</p>
                            </div>
                            <Badge
                              className={`text-[9px] px-1.5 py-0 ${
                                request.status === 'New'
                                  ? 'bg-indigo-100 text-indigo-700'
                                  : request.status === 'Accepted'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {request.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-2">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{request.time}</span>
                          </div>
                          {request.status === 'New' && (
                            <div className="flex gap-1.5">
                              <Button
                                size="sm"
                                className="flex-1 h-7 text-[10px]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUpdateStatus(request.id, 'received', 'Accepted');
                                }}
                              >
                                <Check className="w-2.5 h-2.5 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className={`h-7 px-2 ${darkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-700' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUpdateStatus(request.id, 'received', 'Rejected');
                                }}
                              >
                                <X className="w-2.5 h-2.5" />
                              </Button>
                            </div>
                          )}
                        </Card>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 text-center py-6 col-span-2">No received requests</p>
                    )}
                  </div>
                </div>

                {/* Sent Requests */}
                <div>
                  <h3 className={`font-semibold mb-2 text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>Sent</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {sentRequests.length > 0 ? (
                      sentRequests.map((request) => (
                        <Card
                          key={request.id}
                          className={`p-3 cursor-pointer hover:shadow-md transition-shadow ${darkMode ? 'bg-slate-800 border-slate-700' : 'border-slate-200'}`}
                          onClick={() => onNavigate('request-detail', request)}
                        >
                          <div className="flex items-start justify-between mb-1.5">
                            <div>
                              <h4 className={`font-semibold text-xs ${darkMode ? 'text-white' : 'text-slate-900'}`}>{request.name}</h4>
                              <p className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{request.module}</p>
                            </div>
                            <Badge
                              className={`text-[9px] px-1.5 py-0 ${
                                request.status === 'Pending'
                                  ? 'bg-amber-100 text-amber-700'
                                  : request.status === 'Accepted'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : request.status === 'Cancelled'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {request.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{request.time}</span>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 text-center py-6 col-span-2">No sent requests</p>
                    )}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className={`w-full h-8 text-xs ${darkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-700' : ''}`}
                  onClick={() => onNavigate('view-all-requests')}
                >
                  View All Requests History
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
