import { useState, useRef, useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronDown, BookOpen, GraduationCap, Search, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

interface Module {
  code: string;
  name: string;
  course?: string;
  year?: number;
}

import { Card } from '../ui/card';
import type { PageType, MatchPreferences } from '../../App';

interface ModulesDifficultyProps {
  onNavigate: (page: PageType) => void;
  preferences: MatchPreferences;
  setPreferences: (prefs: MatchPreferences) => void;
  showToast?: (message: string) => void;
}

export function ModulesDifficulty({ onNavigate, preferences, setPreferences, showToast }: ModulesDifficultyProps) {
  const modules: Module[] = [
    { code: 'FOP2', name: 'Fundamental of Programming 2', course: 'DIT', year: 2 },
    { code: 'BED', name: 'Backend Development', course: 'DIT', year: 2 },
    { code: 'DF', name: 'Data Fluency', course: 'DIT', year: 2 },
    { code: 'PDS', name: 'Programming for Data Science', course: 'DIT', year: 2 },
    { code: 'FOP', name: 'Fundamental of Programming', course: 'DIT', year: 1 },
    { code: 'FED', name: 'Frontend Development', course: 'DIT', year: 1 },
    { code: 'FYP', name: 'Final Year Project', course: 'DIT', year: 3 },
  ];

  const [selectedModules, setSelectedModules] = useState<string[]>(preferences.selectedModules);
  const [partnerLevel, setPartnerLevel] = useState(preferences.partnerLevel || 'same');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleModule = (code: string) => {
    setSelectedModules(prev =>
      prev.includes(code) ? prev.filter(m => m !== code) : [...prev, code]
    );
  };

  const filteredModules = modules
    .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.code.toLowerCase().includes(searchTerm.toLowerCase()));

  const groupedModules = filteredModules.reduce<Record<number, Module[]>>((acc, module) => {
    const year = module.year || 0;
    if (!acc[year]) acc[year] = [];
    acc[year].push(module);
    return acc;
  }, {});

  const handleSave = () => {
    setPreferences({
        ...preferences,
        selectedModules,
        partnerLevel
    });
    
    // Use global showToast
    if (showToast) {
        showToast("Module preferences saved");
    }
    onNavigate('preferences');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-60">
      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed top-8 left-0 right-0 z-[1000] flex justify-center pointer-events-none px-4 animate-in slide-in-from-top-4 duration-500">
          <div className="bg-slate-900/95 text-white px-5 py-2 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.2)] border border-white/10 flex items-center gap-2.5 backdrop-blur-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-[10px] font-black tracking-[.2em] uppercase">
              Module Preferences Saved!
            </span>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="px-6 py-5 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
        <button 
          onClick={() => onNavigate('preferences')}
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
        >
          <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
        </button>
        <h1 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em] flex-1 text-center">Modules</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Module Selection */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[.3em] px-1 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            Select Your Modules
          </h3>
          <div className="relative" ref={dropdownRef}>
            <button
              className="w-full h-14 px-6 rounded-2xl bg-white border border-slate-200 shadow-premium flex items-center justify-between transition-all hover:border-indigo-100"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                 </div>
                 <span className="text-[13px] font-bold text-slate-900 truncate max-w-[200px]">
                   {selectedModules.length ? selectedModules.join(', ') : "Select modules..."}
                 </span>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute z-[60] mt-2 w-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 max-h-[400px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-300 no-scrollbar">
                <div className="relative mb-4">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input
                    type="text"
                    placeholder="Search modules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-indigo-600/10"
                  />
                </div>

                <div className="space-y-6">
                  {Object.entries(groupedModules).map(([year, mods]) => (
                    <div key={year} className="space-y-3">
                      <div className="flex items-center gap-2 px-1">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                           Year {year}
                        </span>
                      </div>
                      <div className="grid gap-2">
                        {mods.map(module => (
                          <div 
                            key={module.code} 
                            onClick={() => toggleModule(module.code)}
                            className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                              selectedModules.includes(module.code)
                                ? "bg-indigo-50/50 border-indigo-600 shadow-premium"
                                : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <Checkbox
                              checked={selectedModules.includes(module.code)}
                              className="mt-1 w-5 h-5 rounded-md border-slate-200 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                            />
                            <div className="flex-1">
                              <span className={`block text-xs font-black uppercase tracking-widest ${
                                selectedModules.includes(module.code) ? "text-indigo-600" : "text-slate-900"
                              }`}>
                                {module.code}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400">
                                {module.name}
                              </span>
                            </div>
                            {selectedModules.includes(module.code) && (
                               <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Learning Intensity */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[.3em] px-1 flex items-center gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
            Learning Intensity
          </h3>
          <div className="grid gap-3">
            {[
              { id: "weaker", label: "Mentor Mode", desc: "I can help teach", color: "text-emerald-600", bg: "bg-emerald-50" },
              { id: "same", label: "Peer Mode", desc: "Learn together", color: "text-indigo-600", bg: "bg-indigo-50" },
              { id: "stronger", label: "Scholar Mode", desc: "I need guidance", color: "text-amber-600", bg: "bg-amber-50" },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setPartnerLevel(option.id)}
                className={`w-full flex items-center justify-between p-5 rounded-[2rem] border-2 transition-all ${
                  partnerLevel === option.id
                    ? `bg-white border-indigo-600 shadow-premium`
                    : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    partnerLevel === option.id ? option.bg : "bg-slate-50"
                  }`}>
                    <GraduationCap className={`w-6 h-6 ${partnerLevel === option.id ? option.color : "text-slate-400"}`} />
                  </div>
                  <div className="text-left">
                    <span className={`block text-[11px] font-black uppercase tracking-widest ${
                      partnerLevel === option.id ? "text-slate-900" : "text-slate-400"
                    }`}>
                      {option.label}
                    </span>
                    <span className="text-[10px] font-bold opacity-60">
                      {option.desc}
                    </span>
                  </div>
                </div>
                {partnerLevel === option.id && (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Save Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 p-6 z-50">
          <button
            className="w-full py-5 bg-indigo-600 rounded-2xl text-[11px] font-black text-white uppercase tracking-[.4em] shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSave}
            disabled={selectedModules.length === 0}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
