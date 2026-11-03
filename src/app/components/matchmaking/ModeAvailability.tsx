import { useState } from "react";
import { ArrowLeft, ChevronLeft, Monitor, MapPin, Layers, Clock, Calendar, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";
import type { PageType, MatchPreferences } from "../../App";

interface ModeAvailabilityProps {
  onNavigate: (page: PageType) => void;
  preferences: MatchPreferences;
  setPreferences: (prefs: MatchPreferences) => void;
  showToast?: (message: string) => void;
}

export function ModeAvailability({ onNavigate, preferences, setPreferences, showToast }: ModeAvailabilityProps) {
  const [selectedModes, setSelectedModes] = useState<string[]>(preferences.selectedModes || []);
  const [selectedTimes, setSelectedTimes] = useState<string[]>(preferences.selectedTimes || []);
  const [days, setDays] = useState<string[]>(preferences.availabilityDaysArray || []);
  const [showCustomDays, setShowCustomDays] = useState(
    (preferences.availabilityDaysArray || []).length > 0 && 
    (preferences.availabilityDaysArray || []).length !== 5 && 
    (preferences.availabilityDaysArray || []).length !== 7
  );
  const [additionalDetails, setAdditionalDetails] = useState(preferences.additionalDetails || "");
  const [showNotification, setShowNotification] = useState(false);

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const weekends = ["Saturday", "Sunday"];

  const toggleSelection = (
    value: string,
    current: string[],
    setter: (val: string[]) => void
  ) => {
    if (current.includes(value)) {
      setter(current.filter((v) => v !== value));
    } else {
      setter([...current, value]);
    }
  };

  const isGroupSelected = (group: string[]) =>
    group.every((day) => days.includes(day));

  const toggleGroup = (group: string[]) => {
    if (isGroupSelected(group)) {
      setDays((prev) => prev.filter((d) => !group.includes(d)));
    } else {
      setDays((prev) => [...new Set([...prev, ...group])]);
    }
  };

  const handleSave = () => {
    const isWeekdays = days.length === 5 && weekdays.every(d => days.includes(d));
    const isAnytime = days.length === 7;
    
    let summary = "Not Set";
    if (isAnytime) summary = "Anytime";
    else if (isWeekdays) summary = "Weekdays";
    else if (days.length > 0) summary = `${days.length} Days`;

    setPreferences({
        ...preferences,
        selectedModes,
        selectedTimes,
        availabilityDays: summary,
        availabilityDaysArray: days,
        scheduleSet: days.length > 0 || selectedModes.length > 0 || selectedTimes.length > 0,
        additionalDetails
    });
    
    // Use global showToast
    if (showToast) {
        showToast("Availability updated");
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
              Availability Preferences Saved!
            </span>
          </div>
        </div>
      )}
      <header className="px-6 py-5 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
        <button 
          onClick={() => onNavigate('preferences')}
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
        >
          <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
        </button>
        <h1 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em] flex-1 text-center">Availability</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Study Mode */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[.3em] px-1 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            Study Mode
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "online", label: "Online", icon: <Monitor className="w-4 h-4" /> },
              { id: "campus", label: "On Campus", icon: <MapPin className="w-4 h-4" /> },
              { id: "hybrid", label: "Hybrid", icon: <Layers className="w-4 h-4" /> },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedModes([mode.id])}
                className={`flex flex-col items-center justify-center p-4 rounded-[1.5rem] border-2 transition-all duration-300 ${
                  selectedModes.includes(mode.id)
                    ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100 scale-[1.02]"
                    : "bg-white border-slate-200 text-slate-400 hover:border-indigo-100 shadow-sm"
                }`}
              >
                <div className={`mb-2 ${selectedModes.includes(mode.id) ? "text-white" : "text-slate-400"}`}>
                  {mode.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  selectedModes.includes(mode.id) ? "text-white" : "text-slate-600"
                }`}>
                  {mode.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Time Slots */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[.3em] px-1 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            Preferred Time
          </h3>
          <div className="space-y-3">
            {[
              { id: "morning", label: "Morning", range: "9am - 12pm" },
              { id: "afternoon", label: "Afternoon", range: "12pm - 6pm" },
              { id: "evening", label: "Evening", range: "6pm - 10pm" },
            ].map((time) => (
              <button
                key={time.id}
                onClick={() => toggleSelection(time.id, selectedTimes, setSelectedTimes)}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                    selectedTimes.includes(time.id)
                      ? "bg-indigo-50/50 border-indigo-600 text-indigo-600 shadow-premium"
                      : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 shadow-sm"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedTimes.includes(time.id) ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-400"
                  }`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[11px] font-black text-slate-900 uppercase tracking-widest">
                      {time.label}
                    </span>
                    <span className="text-[10px] text-gray-600 font-bold opacity-60">
                      {time.range}
                    </span>
                  </div>
                </div>
                {selectedTimes.includes(time.id) && (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Available Days */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[.3em] px-1 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            Available Days
          </h3>
          <Card className="p-6 rounded-[2rem] border-slate-200 bg-white shadow-premium space-y-6">
            <div className="flex gap-3">
              <button
                onClick={() => toggleGroup(weekdays)}
                className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                  isGroupSelected(weekdays)
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
                    : "bg-slate-50 border-slate-100 text-slate-400"
                }`}
              >
                Weekdays
              </button>
              <button
                onClick={() => toggleGroup(weekends)}
                className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                  isGroupSelected(weekends)
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
                    : "bg-slate-50 border-slate-100 text-slate-400"
                }`}
              >
                Weekends
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setShowCustomDays(!showCustomDays)}
                className="w-full flex items-center justify-between text-[11px] font-black text-slate-900 uppercase tracking-widest group"
              >
                <span>Customise per day</span>
                <div className={`transition-transform duration-300 ${showCustomDays ? 'rotate-180' : ''}`}>
                  <ArrowLeft className="w-4 h-4 rotate-[270deg]" />
                </div>
              </button>

              {showCustomDays && (
                <div className="flex flex-wrap gap-2 animate-in fade-in zoom-in duration-300">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleSelection(day, days, setDays)}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${
                        days.includes(day)
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </section>

        {/* Additional Notes */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[.3em] px-1 flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
            Additional Details
          </h3>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-premium">
            <Textarea
              placeholder="e.g., I prefer studying at the library, quiet environment, etc."
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              className="min-h-[120px] rounded-2xl border-none bg-slate-50 font-bold text-slate-500 focus-visible:ring-indigo-600/20 p-4 resize-none"
            />
          </div>
        </section>

        {/* Action Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 p-6 z-50">
          <button
            className="w-full py-5 bg-indigo-600 rounded-2xl text-[11px] font-black text-white uppercase tracking-[.4em] shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95 flex items-center justify-center gap-2"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
