import { useState } from "react";
import { ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import type { PageType, MatchPreferences } from "../../App";

interface PreferencesProps {
  onNavigate: (page: PageType) => void;
  preferences: MatchPreferences;
  setPreferences: (prefs: MatchPreferences) => void;
}

interface PreferenceCardProps {
  title: string;
  description: string;
  onClick: () => void;
  completed?: boolean; // optional visual cue for completion
}

function PreferenceCard({
  title,
  description,
  onClick,
  completed,
}: PreferenceCardProps) {
  return (
    <button
      type="button"
      aria-label={title}
      className={`w-full text-left p-6 rounded-3xl cursor-pointer transition-all duration-300 border bg-white group active:scale-[0.98] ${
        completed ? "border-indigo-100 shadow-premium" : "border-slate-200 shadow-premium"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
             <h3 className="font-black text-slate-900 tracking-tight">{title}</h3>
             {completed && (
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></div>
             )}
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{description}</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </button>
  );
}

export function Preferences({ onNavigate, preferences, setPreferences }: PreferencesProps) {
  // Example state: you can replace with real data later
  const [showResetModal, setShowResetModal] = useState(false);
  const [showResetSuccess, setShowResetSuccess] = useState(false);
  
  const resetPreferences = () => {
    setPreferences({
        selectedModules: [],
        scheduleSet: false,
        autoMatchEnabled: false,
        availabilityDays: "",
        availabilityDaysArray: [],
        selectedModes: [],
        selectedTimes: [],
        startTime: "6:00 PM",
        endTime: "10:00 PM",
        matchRate: "daily",
        style: "discussion",
        language: "English",
        duration: 60,
        priority: 50,
        genderPref: "any",
        partnerLevel: "same",
        additionalDetails: "",
    });
    setShowResetModal(false);
    setShowResetSuccess(true);
    setTimeout(() => setShowResetSuccess(false), 2000);
  };

  const {
    selectedModules,
    scheduleSet,
    autoMatchEnabled,
    availabilityDays,
    selectedTimes,
    startTime,
    endTime,
    matchRate,
    style,
    language
  } = preferences;

  // Helper to format selected times for display
  const formatSelectedTimes = () => {
    if (!selectedTimes || selectedTimes.length === 0) return "Not set";
    
    const timeRanges: { [key: string]: string } = {
      morning: "9am-12pm",
      afternoon: "12pm-6pm",
      evening: "6pm-10pm"
    };
    
    return selectedTimes.map(t => `${t.charAt(0).toUpperCase() + t.slice(1)} (${timeRanges[t]})`).join(", ");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24 animate-in fade-in duration-700">
      {/* Header */}
      <header className="px-6 py-5 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
        <button 
          onClick={() => onNavigate('matchmaking')}
          aria-label="Back"
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
        >
          <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
        </button>
        <h1 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em] flex-1 text-center">Match Preferences</h1>
        <div className="w-10"></div>
      </header>

      {/* Summary Card */}
      <div className="p-6">
        <div className="p-10 rounded-[2.5rem] bg-slate-900 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500 opacity-20 rounded-full -mr-24 -mt-24 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          
          <div className="space-y-6 relative z-10">
            <div className="space-y-1 text-center">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[.3em]">
                  {selectedModules.length ? "Current Preferences" : "No preferences selected yet"}
                </p>
                <h2 className="text-3xl font-black text-white tracking-tight"> 
                  {selectedModules.length} Module{selectedModules.length !== 1 && "s"} Selected
                </h2>
            </div>
      
            <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Availability</p>
                    <p className="text-xs font-black text-indigo-100">
                      {scheduleSet
                        ? formatSelectedTimes()
                        : "Not set"}
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Auto-match</p>
                    <p className="text-xs font-black text-indigo-100">
                      {autoMatchEnabled
                        ? `${matchRate} refresh · ${style} style · ${language}`
                        : "Disabled"}
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preference Options */}
      <div className="px-6 space-y-4">
        <PreferenceCard
          title="Modules"
          description="Select modules and level"
          onClick={() => onNavigate("modules-difficulty")}
          completed={selectedModules.length > 0}
        />
        <PreferenceCard
          title="Availability"
          description="Update schedule"
          onClick={() => onNavigate("mode-availability")}
          completed={scheduleSet}
        />
        <PreferenceCard
          title="Auto-Match Settings"
          description="Adjust matching rules"
          onClick={() => onNavigate("auto-match")}
          completed={autoMatchEnabled}
        />
      </div>

      <div className="px-6 py-10">
        <button
          className="w-full py-4.5 border border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-[.3em] transition-all hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 active:scale-95"
          onClick={() => setShowResetModal(true)}
        >
          Reset Configuration
        </button>
      </div>

      {/* Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 animate-in fade-in zoom-in duration-300">
          <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-sm space-y-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
             
             <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Reset Preferences?
                </h3>
                <p className="text-sm font-bold text-slate-400">
                  This action will clear all current matchmaking filters and schedules.
                </p>
             </div>

            <div className="flex flex-col gap-3">
              <button
                className="w-full py-4.5 bg-rose-600 rounded-2xl text-[11px] font-black text-white uppercase tracking-[.3em] shadow-lg shadow-rose-100 transition-all hover:bg-rose-700 active:scale-95"
                onClick={resetPreferences}
              >
                Confirm Reset
              </button>
              <button
                className="w-full py-4.5 bg-slate-50 rounded-2xl text-[11px] font-black text-slate-400 uppercase tracking-widest transition-all hover:bg-slate-100 active:scale-95"
                onClick={() => setShowResetModal(false)}
              >
                No, Keep Them
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showResetSuccess && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowResetSuccess(false)}></div>
          <div className="bg-white w-full max-w-[280px] rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 p-8 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-black text-slate-900 tracking-tight">Reset Complete!</h4>
              <p className="text-xs font-bold text-slate-400">Your preferences have been cleared.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
