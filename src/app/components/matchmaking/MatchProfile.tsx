import {
  ArrowLeft,
  ChevronLeft,
  MapPin,
  Clock,
  BookOpen,
  MessageCircle,
  School,
  Award,
  ShieldCheck,
  TrendingUp,
  Check,
  Plus,
  Send,

} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import type { PageType } from "../../App";
import { BottomNav } from "../BottomNav";
import { globalStudents } from "../../App";

interface MatchProfileProps {
  onNavigate: (page: PageType, data?: any) => void;
  student?: any;
  sentRequests?: any[];
  receivedRequests?: any[];
}

export function MatchProfile({
  onNavigate,
  student,
  sentRequests = [],
  receivedRequests = []
}: MatchProfileProps) {
  // Helper to get student avatar
  const getStudentAvatar = (name: string) => {
    const student = globalStudents.find(s => s.name === name);
    return student?.avatar || name[0];
  };

  // If student is passed but incomplete, try to find full data from globalStudents
  const fullStudent = student 
    ? (globalStudents.find(s => s.name === student.name) || student)
    : null;

  // Use full student data or fallback
  const s = fullStudent || {
    name: "Sarah Lim",
    initials: "SL",
    year: 2,
    diploma: "DIT",
    avatar: "👩‍🎓",
    match: 92,
    location: "Library Level 5 & Online",
    about: "Hi! I'm looking for a serious study partner. I prefer morning sessions at the library (Level 5). I use Pomodoro (25/5 min cycles) for maximum focus.",
    goals: "Aiming for an A in FOP2 and improving consistency in BED. Looking for a dedicated partner for weekly reviews.",
    modules: ['FOP2', 'BED', 'PDS', 'DEUI', 'PCDS']
  };

  const isRequestDisabled = (studentName: string) => {
    return [...sentRequests, ...receivedRequests].some(
      (r) => r.name === studentName && (r.status === 'New' || r.status === 'Pending')
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-60">
      {/* Header */}
      <header className="px-6 py-5 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
        <button 
          onClick={() => onNavigate('matchmaking')}
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
        >
          <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
        </button>
        <h1 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em] flex-1 text-center">Partner Profile</h1>
        <div className="w-10"></div>
      </header>

      {/* Hero Section */}
      <div className="relative">
        <div className="h-56 bg-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 via-violet-600/20 to-transparent"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full -mr-64 -mt-64 blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/10 rounded-full -ml-40 -mb-40 blur-[80px]"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
        </div>
        
        <div className="absolute -bottom-20 left-0 right-0 px-8 flex flex-col items-center">
          <div className="w-40 h-40 rounded-[3rem] bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative group">
            <div className="w-full h-full rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-6xl font-black text-indigo-600 shadow-inner relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5"></div>
               <span className="relative z-10">{s.avatar || s.initials}</span>
            </div>
            {s.online && (
              <div className="absolute -bottom-1 -right-1 w-12 h-12 rounded-[1.25rem] bg-emerald-500 border-4 border-white shadow-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
              </div>
            )}
          </div>
          <div className="mt-6 text-center">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{s.name}</h1>
            <div className="flex items-center justify-center gap-2 mt-2">
                <span className="px-3 py-1 bg-indigo-50 rounded-full text-[11px] font-black text-indigo-600 uppercase tracking-widest">Year {s.year}</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Diploma in IT</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-32 px-6 space-y-10">
        {/* Match Statistics Widget */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-600 p-6 rounded-[2.5rem] shadow-xl shadow-indigo-100 flex flex-col justify-between text-white aspect-square relative overflow-hidden group hover:scale-[1.02] transition-transform">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 -translate-y-12 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="w-10 h-10 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                    <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-[.25em] opacity-60 mb-1">Match Rate</p>
                   <h2 className="text-3xl font-black tracking-tighter">{s.match}%</h2>
                </div>
            </div>
            <div className="bg-white p-6 rounded-[2.5rem] shadow-premium border border-slate-200 flex flex-col justify-between aspect-square hover:scale-[1.02] transition-transform">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                    <Clock className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[.25em] mb-1">Active Now</p>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tighter">{Math.floor(Math.random() * 10)}h {Math.floor(Math.random() * 60)}m</h2>
                </div>
            </div>
        </div>

        {/* Quick Details List */}
        <div className="bg-white rounded-[2.5rem] shadow-premium border border-slate-200 divide-y divide-slate-100 overflow-hidden">
             {[
               { icon: MapPin, label: "Location", value: s.location || "Library Level 5 & Online" },
               { icon: Clock, label: "Preferences", value: s.preferredTime ? `${s.preferredTime} Sessions` : "Weekday Evenings" },
               { icon: School, label: "Campus", value: "SP Main Campus" }
             ].map((info, i) => (
                <div key={i} className="flex items-center gap-5 p-6 group">
                   <div className="w-12 h-12 rounded-2xl bg-indigo-50/50 flex items-center justify-center text-indigo-600 border border-indigo-100/50 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                      <info.icon className="w-5 h-5" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{info.label}</p>
                      <p className="text-sm font-bold text-slate-700">{info.value}</p>
                   </div>
                </div>
             ))}
        </div>

        {/* Studying Modules Section */}
        <section className="space-y-5">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[.3em]">Studying Now</h3>
                <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[9px] font-black text-slate-400 uppercase">{s.modules?.length || 0} Modules</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
                {(s.modules || []).map((m: string) => (
                    <div key={m} className="bg-white px-5 py-3.5 rounded-2xl shadow-premium border border-slate-200 flex items-center gap-3 transition-all hover:border-indigo-200 cursor-default group">
                        <span className="text-xs font-black text-indigo-600 tracking-widest">{m}</span>
                        <div className="w-1 h-1 bg-indigo-100 rounded-full group-hover:bg-indigo-200"></div>
                    </div>
                ))}
            </div>
        </section>

        {/* Why You Match Section - The Highlight */}
        <section className="space-y-5">
            <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-xl">
                            <ShieldCheck className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h3 className="text-[11px] font-black text-white uppercase tracking-[.3em]">Smart Compatibility</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            `Focus on ${s.modules?.[0] || 'Core'} Modules`,
                            "Matching Schedule Windows",
                            "High Collaboration Score",
                            "Course Path Alignment"
                        ].map((reason, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 transition-all hover:bg-emerald-500">
                                    <Check className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white" />
                                </div>
                                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{reason}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* About & Goals Cards */}
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-slate-200 space-y-4">
                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[.3em]">Goals</h4>
                <p className="text-sm font-bold text-slate-500 leading-relaxed italic">
                  "{s.goals || "Looking to improve academic performance and stay consistent with study schedules."}"
                </p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-slate-200 space-y-4">
                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[.3em]">About</h4>
                <p className="text-sm font-bold text-slate-500 leading-relaxed">
                  {s.about || "Hi! I'm looking for a motivated study partner to collaborate and share knowledge with."}
                </p>
            </div>
        </div>
      </div>

      {/* Floating Action Header */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-100">
        <div className="w-full">
          <button
            className={`w-full py-5 rounded-3xl text-[13px] font-black uppercase tracking-[0.25em] shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group ${
              isRequestDisabled(s.name) 
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-slate-100' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 shadow-indigo-500/20'
            }`}
            onClick={() => !isRequestDisabled(s.name) && onNavigate("send-request", s)}
            disabled={isRequestDisabled(s.name)}
          >
            {!isRequestDisabled(s.name) && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            )}
            <Send className="w-5 h-5 relative z-10" />
            <span className="relative z-10">{isRequestDisabled(s.name) ? 'Requested' : 'Send Request'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
