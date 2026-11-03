import {
  Calendar,
  X,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Check,
  Clock,
  MapPin,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { type PageType, type MatchmakingRequest, globalStudents } from "../../App";
import { BottomNav } from "../BottomNav";

const activeMatches = [
  {
    id: "match1",
    name: "Marcus Tan",
    connectedAt: "3 hours ago",
  },
  {
    id: "match2",
    name: "Emily Wong",
    connectedAt: "2 days ago",
  },
  {
    id: "match3",
    name: "Zara Teo",
    connectedAt: "1 week ago",
  },
];

const upcomingSessions = [
  {
    id: "session1",
    name: "Marcus Tan",
    title: "MAD Project Discussion",
    time: "Friday, 3:00 PM • Online (Zoom)",
  },
  {
    id: "session2",
    name: "Emily Wong",
    title: "PRG2 Mock Test Prep",
    time: "Next Monday, 10:00 AM • Library Level 6",
  },
];

interface MatchStatusProps {
  onNavigate: (page: PageType, data?: any) => void;
  sentRequests: MatchmakingRequest[];
  receivedRequests: MatchmakingRequest[];
  onUpdateStatus: (id: string, category: 'sent' | 'received', newStatus: MatchmakingRequest['status']) => void;
  activeMatches?: any[];
  upcomingSessions?: any[];
}

export function MatchStatus({ 
  onNavigate, 
  receivedRequests: propReceived, 
  sentRequests: propSent, 
  onUpdateStatus,
  activeMatches: propActive, 
  upcomingSessions: propUpcoming 
}: MatchStatusProps) {
  // Confirmation State
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    type: 'accept' | 'decline' | 'cancel';
    id: string;
    reqType: 'sent' | 'received';
    status: MatchmakingRequest['status'];
    description: string;
    successMsg: string;
  } | null>(null);
  
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  const getStudentAvatar = (name: string) => {
    const student = globalStudents.find(s => s.name === name);
    return student?.avatar || name[0];
  };

  const handleAction = (id: string, category: 'sent' | 'received', newStatus: MatchmakingRequest['status'], message: string) => {
    // Determine details for confirmation
    let type: 'accept' | 'decline' | 'cancel' = 'accept';
    let description = "Are you sure you want to proceed?";

    if (newStatus === 'Accepted') {
        type = 'accept';
        description = "This will add the session to your calendar.";
    } else if (newStatus === 'Rejected' && category === 'received') {
        type = 'decline';
        description = "You are about to decline this request. This action cannot be undone.";
    } else if (category === 'sent') { // Cancel
        type = 'cancel';
        description = "Are you sure you want to cancel this request? The recipient will be notified.";
    }

    setConfirmation({
        isOpen: true,
        type,
        id,
        reqType: category,
        status: newStatus,
        description,
        successMsg: message
    });
  };

  const proceedAction = () => {
      if (confirmation) {
          onUpdateStatus(confirmation.id, confirmation.reqType, confirmation.status);
          setShowSuccess(confirmation.successMsg);
          setConfirmation(null);
          setTimeout(() => {
              setShowSuccess(null);
          }, 2500);
      }
  };

  const recReq = propReceived;
  const penReq = propSent;
  const actMat = propActive || activeMatches;
  const upcSess = propUpcoming || upcomingSessions;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 animate-in fade-in duration-700">
      <div className="px-6 py-8 pb-32 space-y-10">
      {/* ---------------- Incoming Requests ---------------- */}
      <section className="space-y-4">
        <div className="flex items-end justify-between px-1">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Incoming Requests
            </h2>
          </div>
          <button
            onClick={() => onNavigate("view-all-requests", "incoming")}
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
          >
            See All
          </button>
        </div>

        {recReq.filter(r => r.status === 'New').length === 0 ? (
          <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-[2rem] p-8 text-center">
            <p className="text-xs font-bold text-slate-400">
              No new requests.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recReq.filter(r => r.status === 'New').map((req) => (
              <div
                key={req.id}
                className="bg-white p-7 rounded-[2.5rem] shadow-[0_8px_20px_rgb(67_56_202_/_0.15)] border-2 border-indigo-200 hover:shadow-[0_12px_24px_rgb(67_56_202_/_0.2)] transition-all hover:-translate-y-1 active:scale-[0.98] group cursor-pointer relative overflow-hidden"
                onClick={() => onNavigate("request-detail", req)}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-[1.2rem] bg-indigo-50 border border-indigo-300 flex items-center justify-center text-2xl shadow-sm">
                      {getStudentAvatar(req.name)}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900 tracking-tight">{req.name}</h4>
                      <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                          <Calendar className="w-3 h-3" />
                          <p className="text-[10px] font-bold uppercase tracking-widest">{req.time}</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-amber-100/50 text-amber-600 text-[9px] font-black uppercase tracking-widest border border-amber-200">
                    New
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-xl text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-100">
                    <MessageSquare className="w-3 h-3" />
                    {req.module}
                  </div>
                  <p className="text-[13px] font-medium text-slate-500 leading-relaxed italic">
                    "{req.message}"
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button 
                    className="flex-1 py-4 bg-indigo-600 rounded-2xl text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                    onClick={(e) => { e.stopPropagation(); handleAction(req.id, 'received', 'Accepted', "Request Accepted"); }}
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </button>
                  <button
                    className="flex-1 py-4 bg-white border-2 border-rose-100 rounded-2xl text-rose-500 font-black text-[11px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                    onClick={(e) => { e.stopPropagation(); handleAction(req.id, 'received', 'Rejected', "Request Declined"); }}
                  >
                    <X className="w-4 h-4" />
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---------------- PENDING REQUESTS ---------------- */}
      <section className="space-y-4">
        <div className="flex items-end justify-between px-1">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Sent Requests
            </h2>
          </div>
          <button
            onClick={() => onNavigate("view-all-requests", "pending")}
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
          >
            See All
          </button>
        </div>

        {penReq.filter(r => r.status === 'Pending').length === 0 ? (
          <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-[2rem] p-8 text-center">
            <p className="text-xs font-bold text-slate-400">
              You have no pending requests.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {penReq.filter(r => r.status === 'Pending').map((req) => (
              <div
                key={req.id}
                className="bg-white p-7 rounded-[2.5rem] shadow-[0_8px_20px_rgb(67_56_202_/_0.15)] border-2 border-indigo-200 hover:shadow-[0_12px_24px_rgb(67_56_202_/_0.2)] transition-all hover:-translate-y-1 active:scale-[0.98] group cursor-pointer relative overflow-hidden"
                onClick={() => onNavigate("request-detail", req)}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-[1.2rem] bg-indigo-50 border border-indigo-300 flex items-center justify-center text-2xl shadow-sm">
                      {getStudentAvatar(req.name)}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900 tracking-tight">{req.name}</h4>
                      <div className="inline-flex items-center gap-2 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <MessageSquare className="w-3 h-3" />
                          <p>{req.module}</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-amber-100/50 text-amber-600 border-amber-200 text-[9px] font-black uppercase tracking-widest border">
                    Pending
                  </div>
                </div>

                {/* Content - Mapped as requested: Title->Date/Time, Message->Location */}
                <div className="mb-6 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    <Calendar className="w-3 h-3 text-gray-700" />
                    {req.time}
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    <MapPin className="w-4 h-4 text-gray-700" />
                    {req.location}
                  </div>
                </div>

                {/* Actions */}
                <button
                  className="flex-1 flex items-center justify-center gap-2 w-full py-4 bg-white border-2 border-rose-100 rounded-2xl text-[11px] font-black text-rose-500 uppercase tracking-widest transition-all hover:bg-rose-50 hover:border-rose-200 active:scale-95 shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction(req.id, 'sent', 'Cancelled', "Request Withdrawn");
                  }}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---------------- Confirmation Modal ---------------- */}
      {confirmation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setConfirmation(null)}></div>
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative z-10 text-center space-y-6 scale-in-center animate-in zoom-in-95 duration-200">
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto ${
                    confirmation.type === 'accept' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
                }`}>
                    {confirmation.type === 'accept' ? <Check className="w-10 h-10" /> : <X className="w-10 h-10" />}
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                        {confirmation.type === 'accept' ? 'Accept Request?' : confirmation.type === 'cancel' ? 'Cancel Request?' : 'Decline Request?'}
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
                            confirmation.type === 'accept' 
                            ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' 
                            : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'
                        }`}
                        onClick={proceedAction}
                    >
                        Yes, {confirmation.type === 'accept' ? 'Confirm' : 'Proceed'}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* ---------------- Success Modal ---------------- */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"></div>
            <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-[0_20px_70px_rgba(0,0,0,0.3)] relative z-10 text-center space-y-6 scale-in-center animate-in zoom-in-95 duration-300">
                <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mx-auto ring-8 ring-indigo-50/50">
                    <CheckCircle2 className="w-12 h-12 text-indigo-600" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{showSuccess}</h3>
                    <p className="text-sm font-bold text-slate-400">The request status has been updated successfully.</p>
                </div>
                <button 
                  onClick={() => setShowSuccess(null)}
                  className="w-full py-4 bg-indigo-600 rounded-2xl text-xs font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95"
                >
                  Got It
                </button>
            </div>
        </div>
      )}
      </div>
    </div>
  );
}
