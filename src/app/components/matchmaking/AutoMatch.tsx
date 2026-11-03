import { ArrowLeft, ChevronLeft, Zap, RefreshCcw, Layers, Timer, Globe, Users, Star } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Switch } from "../ui/switch";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useState } from "react";
import type { PageType, MatchPreferences } from "../../App";

interface AutoMatchProps {
  onNavigate: (page: PageType) => void;
  preferences: MatchPreferences;
  setPreferences: (prefs: MatchPreferences) => void;
  showToast?: (message: string) => void;
}

export function AutoMatch({ onNavigate, preferences, setPreferences, showToast }: AutoMatchProps) {
  const [autoMatchEnabled, setAutoMatchEnabled] = useState(preferences.autoMatchEnabled || false);
  const [matchRate, setMatchRate] = useState(preferences.matchRate || "");
  const [duration, setDuration] = useState([preferences.duration || 60]);
  const [priority, setPriority] = useState<number[]>([preferences.priority || 50]);
  const [selectedModes, setSelectedModes] = useState<string[]>(preferences.selectedModes || []);
  const [selectedTimes, setSelectedTimes] = useState<string[]>(preferences.selectedTimes || []);
  
  // Fix initialization to handle comma-separated strings
  const [selectedStyles, setSelectedStyles] = useState<string[]>(preferences.style ? preferences.style.toLowerCase().split(", ").map(s => s.trim()) : []);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(preferences.language ? preferences.language.toLowerCase().split(", ").map(s => s.trim()) : []);
  const [genderPref, setGenderPref] = useState(preferences.genderPref || "");
  const [showNotification, setShowNotification] = useState(false);

  const toggleCheckbox = (
    value: string,
    list: string[],
    setter: (v: string[]) => void,
  ) => {
    if (list.includes(value))
      setter(list.filter((m) => m !== value));
    else setter([...list, value]);
  };

  const handleSave = () => {
    setPreferences({
        ...preferences,
        autoMatchEnabled,
        matchRate,
        duration: duration[0],
        priority: priority[0],
        selectedModes,
        selectedTimes,
        style: selectedStyles.length > 0 ? selectedStyles.join(", ") : "discussion",
        language: selectedLanguages.length > 0 ? selectedLanguages.join(", ") : "English",
        genderPref
    });
    
    // Use global showToast
    if (showToast) {
        showToast("Auto-match settings updated");
    }
    onNavigate("preferences");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-60">
      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed top-8 left-0 right-0 z-[1000] flex justify-center pointer-events-none px-4 animate-in slide-in-from-top-4 duration-500">
          <div className="bg-slate-900/95 text-white px-5 py-2 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.2)] border border-white/10 flex items-center gap-2.5 backdrop-blur-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-[10px] font-black tracking-[.2em] uppercase">
              Auto-Match Settings Saved!
            </span>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="px-6 py-5 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
        <button 
          onClick={() => onNavigate('preferences')}
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
        >
          <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
        </button>
        <h1 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em] flex-1 text-center">Auto-Match Settings</h1>
        <div className="w-10"></div>
      </header>

      <div className="px-6 py-8 space-y-6 animate-in fade-in duration-500">
        {/* Enable Auto Match */}
        <div className="bg-white p-7 rounded-[2.5rem] shadow-premium border border-slate-200 flex items-center justify-between group transition-all hover:shadow-2xl">
          <div className="flex-1 pr-6">
            <h3 className="text-[17px] font-black text-slate-900 tracking-tight mb-1 flex items-center gap-2">
              <Zap size={18} className="text-amber-500 fill-amber-500" />
              Enable Auto-Match
            </h3>
            <p className="text-[13px] font-medium text-slate-400 leading-relaxed">
              Automatically find study partners based on your preferences
            </p>
          </div>
          <Switch
            checked={autoMatchEnabled}
            onCheckedChange={setAutoMatchEnabled}
            className="data-[state=checked]:bg-indigo-600 scale-125"
          />
        </div>

        {autoMatchEnabled && (
          <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
            {/* Refresh Frequency */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-slate-200">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[.2em] mb-6 flex items-center gap-2">
                <RefreshCcw size={14} className="text-indigo-500" />
                Match Refresh Rate
              </h3>
              <RadioGroup
                value={matchRate}
                onValueChange={setMatchRate}
                className="grid grid-cols-1 gap-4"
              >
                {[
                  { value: "daily", label: "Daily Refresh" },
                  { value: "weekly", label: "Weekly Batch" },
                  { value: "manual", label: "Manual Sync Only" },
                ].map((opt) => (
                  <Label
                    key={opt.value}
                    htmlFor={opt.value}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                      matchRate === opt.value
                        ? 'bg-indigo-50 border-indigo-200 ring-4 ring-indigo-500/5'
                        : 'bg-slate-50 border-transparent hover:border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem
                        value={opt.value}
                        id={opt.value}
                        className="border-slate-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <span className={`text-[13px] font-black uppercase tracking-widest ${matchRate === opt.value ? 'text-indigo-600' : 'text-slate-400'}`}>
                        {opt.label}
                      </span>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {/* Study Style */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-slate-200">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[.2em] mb-6 flex items-center gap-2">
                <Layers size={14} className="text-indigo-500" />
                Study Style
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { value: "quiet", label: "Quiet / Independent" },
                  { value: "discussion", label: "Discussion Focused" },
                  { value: "group", label: "Group Collaboration" },
                ].map((s) => (
                  <Label
                    key={s.value}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                      selectedStyles.includes(s.value)
                        ? 'bg-indigo-50 border-indigo-200'
                        : 'bg-slate-50 border-transparent hover:border-slate-100'
                    }`}
                  >
                    <span className={`text-[13px] font-black uppercase tracking-widest ${selectedStyles.includes(s.value) ? 'text-indigo-600' : 'text-slate-500'}`}>
                      {s.label}
                    </span>
                    <Checkbox
                      id={s.value}
                      checked={selectedStyles.includes(s.value)}
                      onCheckedChange={() =>
                        toggleCheckbox(
                          s.value,
                          selectedStyles,
                          setSelectedStyles,
                        )
                      }
                      className="w-5 h-5 rounded-lg border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                    />
                  </Label>
                ))}
              </div>
            </div>

            {/* Session Duration */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-slate-200">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[.2em] flex items-center gap-2">
                  <Timer size={14} className="text-indigo-500" />
                  Session Length
                </h3>
                <span className="px-3 py-1 bg-indigo-50 rounded-lg text-[11px] font-black text-indigo-600">{duration}m</span>
              </div>
              <Slider
                value={duration}
                onValueChange={setDuration}
                min={30}
                max={180}
                step={30}
                className="py-4 text-indigo-600"
              />
            </div>

            {/* Preferred Language */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-slate-200">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[.2em] mb-6 flex items-center gap-2">
                <Globe size={14} className="text-indigo-500" />
                Preferred Language
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {["english", "malay", "chinese", "tamil"].map((lang) => (
                  <Label
                    key={lang}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                      selectedLanguages.includes(lang)
                        ? 'bg-indigo-50 border-indigo-200'
                        : 'bg-slate-50 border-transparent hover:border-slate-100'
                    }`}
                  >
                    <span className={`text-[11px] font-black uppercase tracking-widest ${selectedLanguages.includes(lang) ? 'text-indigo-600' : 'text-slate-500'}`}>
                      {lang}
                    </span>
                    <Checkbox
                      id={lang}
                      checked={selectedLanguages.includes(lang)}
                      onCheckedChange={() =>
                        toggleCheckbox(
                          lang,
                          selectedLanguages,
                          setSelectedLanguages,
                        )
                      }
                      className="w-4 h-4 rounded-lg border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                    />
                  </Label>
                ))}
              </div>
            </div>

            {/* Gender Preference */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-slate-200">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[.2em] mb-6 flex items-center gap-2">
                <Users size={14} className="text-indigo-500" />
                Gender Preference
              </h3>
              <RadioGroup
                value={genderPref}
                onValueChange={setGenderPref}
                className="grid grid-cols-3 gap-3"
              >
                {["any", "male", "female"].map((g) => (
                  <Label
                    key={g}
                    htmlFor={g}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer text-center ${
                      genderPref === g
                        ? 'bg-indigo-50 border-indigo-200'
                        : 'bg-slate-50 border-transparent hover:border-slate-100'
                    }`}
                  >
                    <RadioGroupItem
                      value={g}
                      id={g}
                      className="sr-only"
                    />
                    <span className={`text-[11px] font-black uppercase tracking-widest ${genderPref === g ? 'text-indigo-600' : 'text-slate-500'}`}>
                      {g}
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {/* Priority Slider */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-slate-200">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[.2em] flex items-center gap-2">
                  <Star size={14} className="text-indigo-500" />
                  Match Priority
                </h3>
                <div className="flex gap-2">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">{priority}% Modules</span>
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-50/50 px-2 py-0.5 rounded-md">{100 - priority[0]}% Time</span>
                </div>
              </div>
              <Slider
                value={priority}
                onValueChange={setPriority}
                max={100}
                step={1}
                className="py-4"
              />
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 p-6 z-50">
          <button
            onClick={handleSave}
            className="w-full py-5 bg-indigo-600 rounded-2xl text-[13px] font-black text-white uppercase tracking-[.25em] shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95 flex items-center justify-center gap-2"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
