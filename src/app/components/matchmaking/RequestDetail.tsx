import {
  Calendar,
  X,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  MessageCircle,
  Check,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { useState } from "react";
import type { PageType, MatchmakingRequest } from "../../App";
import { globalStudents } from "../../App";

interface RequestDetailProps {
  onNavigate: (page: PageType, data?: any) => void;
  request: any;
  onUpdateStatus: (id: string, category: 'sent' | 'received', newStatus: MatchmakingRequest['status']) => void;
}

export function RequestDetail({ onNavigate, request, onUpdateStatus }: RequestDetailProps) {
  // Confirmation State
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    type: string; 
    status: MatchmakingRequest['status'];
    description: string;
  } | null>(null);

  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  const displayRequest: MatchmakingRequest = request || {
    id: 'demo-request',
    name: 'Aiden Koh',
    module: 'BED Assignment Help',
    message: "Hey, I saw you're also doing BED. Want to revise together?",
    time: '20 January 2026, 5:10 PM',
    location: 'Library Level 5',
    status: 'New',
    category: 'received'
  };

  // Helper to get student avatar
  const getStudentAvatar = (name: string) => {
    const student = globalStudents.find(s => s.name === name);
    return student?.avatar || name[0];
  };

  // Get full student data for this request
  const studentData = globalStudents.find(s => s.name === displayRequest.name);

  const handleAction = (newStatus: MatchmakingRequest['status'], message: string) => {
    let description = "Are you sure you want to proceed?";

    if (newStatus === "Accepted") {
        description = "This will schedule the session and notify the student.";
    } else if (newStatus === "Rejected") {
        description = "This request will be permanently removed.";
    } else if (newStatus === "Cancelled") {
        description = "Are you sure you want to cancel this pending request?";
    }

    setConfirmation({
        isOpen: true,
        type: message, 
        status: newStatus, 
        description
    });
  };

  const proceedAction = () => {
      if (confirmation) {
          onUpdateStatus(displayRequest.id, displayRequest.category as 'sent' | 'received', confirmation.status);
          setShowSuccess(confirmation.type);
          setConfirmation(null);
          setTimeout(() => {
              setShowSuccess(null);
              onNavigate("view-all-requests");
          }, 2000);
      }
  };

  const showActions = (displayRequest.category === "received" && displayRequest.status === "New") || 
                      (displayRequest.category === "sent" && displayRequest.status === "Pending");

  return (
      <div className={`min-h-screen bg-slate-50 flex flex-col animate-in slide-in-from-bottom-4 duration-500 ${showActions ? 'pb-60' : ''}`}>
      <header className="px-6 py-5 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-40">
        <button 
          onClick={() => onNavigate('view-all-requests', displayRequest.category === 'sent' ? 'pending' : 'incoming')}
          aria-label="Back to requests"
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
        >
          <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
        </button>
        <h1 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em] flex-1 text-center">Request Details</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 px-6 py-8 space-y-8">
        {/* Profile Info */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-[2rem] bg-indigo-600 flex items-center justify-center shadow-feature shadow-indigo-100 relative">
             <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-[2rem]"></div>
             <span className="text-[2.5rem] font-black text-white relative z-10">
                {getStudentAvatar(displayRequest.name) || displayRequest.name[0]}
             </span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {displayRequest.name}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-1">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{displayRequest.module}</span>
               <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                <div className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                  displayRequest.status === 'New' || displayRequest.status === 'Pending'
                    ? 'bg-amber-100/50 text-amber-600 border-amber-200' 
                    : displayRequest.status === 'Accepted' || displayRequest.status === 'Done'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : 'bg-rose-50 text-rose-500 border-rose-100'
                }`}>
                  {displayRequest.status}
                </div>
            </div>
          </div>
        </div>

        {/* Message Card */}
        <section className="bg-white p-7 rounded-[2rem] shadow-premium border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600"></div>
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Message</h3>
          <p className="text-[15px] font-medium text-slate-600 leading-relaxed italic">
            "{displayRequest.message}"
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</span>
               <p className="text-[13px] font-extrabold text-slate-900">{displayRequest.time.split(',')[0]}</p>
               <p className="text-[11px] font-bold text-slate-500">{displayRequest.time.split(',')[1]}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</span>
               <p className="text-[13px] font-extrabold text-slate-900 truncate">{displayRequest.location}</p>
            </div>
          </div>
        </section>

        {/* Sender Bio */}
        <section className="bg-white p-7 rounded-[2rem] shadow-premium border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              About {displayRequest.name.split(" ")[0]}
            </h3>
            <button 
              className="text-[11px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
              onClick={() => onNavigate("match-profile", studentData || displayRequest)}
            >
              View Profile
            </button>
          </div>
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs">YR</div>
                <p className="text-[13px] font-bold text-slate-600">{studentData?.year ? `Year ${studentData.year}, Diploma in Information Tech` : 'Year 2, Diploma in Information Tech'}</p>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 font-black text-xs">LV</div>
                <p className="text-[13px] font-bold text-slate-600">{studentData?.level || 'Professional'} • {Math.floor(Math.random() * 100) + Math.floor(Math.random() * 10)} Sessions</p>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-xs">SM</div>
                <p className="text-[13px] font-bold text-slate-600">Shared modules: {studentData?.modules?.join(', ') || displayRequest.module}</p>
             </div>
          </div>
        </section>
      </main>

      {/* Footer Actions */}
      {showActions && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 px-6 py-6 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] z-50">
            <div className="w-full flex gap-4">
            {(displayRequest.category === "received" && displayRequest.status === "New") ? (
                <>
                <button 
                    className="flex-[2] py-4 bg-indigo-600 rounded-2xl text-white font-black text-[13px] uppercase tracking-widest shadow-feature shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                    onClick={() => handleAction("Accepted", "Request Accepted")}
                >
                    <Check size={18} />
                    Accept
                </button>
                <button 
                    className="flex-1 py-4 bg-white border-2 border-rose-100 rounded-2xl text-rose-500 flex items-center justify-center transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-100 active:scale-95"
                    onClick={() => handleAction("Rejected", "Request Declined")}
                >
                    <X size={20} />
                </button>
                </>
            ) : (displayRequest.category === "sent" && displayRequest.status === "Pending") ? (
                <button 
                className="flex-1 flex items-center justify-center gap-2 w-full py-4 bg-white border-2 border-rose-100 rounded-2xl text-rose-500 font-black text-[13px] uppercase tracking-widest transition-all hover:bg-red-50 hover:text-red-600 hover:border-red-100 active:scale-95"
                onClick={() => handleAction("Cancelled", "Request Withdrawn")}
                >
                <X size={20} />
                Cancel
                </button>
            ) : null}
            </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setConfirmation(null)}></div>
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative z-10 text-center space-y-6 scale-in-center animate-in zoom-in-95 duration-200">
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto ${
                    confirmation.status === 'Accepted' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
                }`}>
                    {confirmation.status === 'Accepted' ? <Check className="w-10 h-10" /> : <X className="w-10 h-10" />}
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                        {confirmation.status === 'Accepted' ? 'Accept Request?' : confirmation.status === 'Pending' ? 'Cancel Request?' : 'Decline Request?'}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 leading-relaxed px-4">
                        {confirmation.description}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        className="py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest border border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                        onClick={() => setConfirmation(null)}
                    >
                        No, Back
                    </button>
                    <button 
                        className={`py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-white shadow-lg transform transition-all active:scale-95 ${
                            confirmation.status === 'Accepted' 
                            ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' 
                            : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'
                        }`}
                        onClick={proceedAction}
                    >
                        Yes, {confirmation.status === 'Accepted' ? 'Confirm' : 'Proceed'}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"></div>
            <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-[0_20px_70px_rgba(0,0,0,0.3)] relative z-10 text-center space-y-6 scale-in-center animate-in zoom-in-95 duration-300">
                <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mx-auto ring-8 ring-indigo-50/50">
                    <CheckCircle2 className="w-12 h-12 text-indigo-600" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{showSuccess}</h3>
                    <p className="text-sm font-bold text-slate-400">The request status has been updated.</p>
                </div>
            </div>
        </div>
      )}
      </div>
    );
}
