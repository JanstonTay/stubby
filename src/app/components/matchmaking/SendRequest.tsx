import { ChevronLeft, User, MessageCircle, Calendar, MapPin, Layers, Send, BookOpen, Info, CheckCircle2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import type { PageType, MatchmakingRequest } from "../../App";

interface SendRequestProps {
  onNavigate: (page: PageType, data?: any) => void;
  recipient?: any;
  onSendRequest: (request: Omit<MatchmakingRequest, 'id' | 'status'>) => void;
}

export function SendRequest({ onNavigate, recipient, onSendRequest }: SendRequestProps) {
  const [selectedRecipient, setSelectedRecipient] = useState(recipient?.id || "1");
  const [topic, setTopic] = useState("FOP2 Array Revision");
  const [date, setDate] = useState("2026-01-24");
  const [time, setTime] = useState("14:00");
  const [location, setLocation] = useState("Library Level 5");
  const [mode, setMode] = useState<'one-on-one' | 'group'>("one-on-one");
  const [note, setNote] = useState("Hi, I am revising arrays and tutorial Q1-Q3. Want to study together?");
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = () => {
    // Validation
    if (!topic || !date || !time || !location) {
        setValidationError("Please fill in all required fields (Topic, Date, Time, Location).");
        return;
    }
    setValidationError(null);

    // Format Date
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Basic mapping for recipient names (in a real app this would come from the recipient object)
    const names: Record<string, string> = {
        "1": "Sarah Lim",
        "2": "Marcus Tan",
        "3": "Daniel Ng",
        "4": "Alicia Goh"
    };

    const recipientName = recipient ? recipient.name : (names[selectedRecipient] || "Unknown");

    onSendRequest({
        name: recipientName,
        module: topic || "General Study",
        time: `${formattedDate}, ${time}`,
        location: location || "To be decided",
        type: mode,
        message: note,
        category: 'sent'
    });

    setShowSuccess(true);
    setTimeout(() => {
        onNavigate("view-all-requests", "pending");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-in fade-in duration-700">
      <header className="px-6 py-5 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
        <button 
          onClick={() => onNavigate('matchmaking')}
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
        >
          <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
        </button>
        <h1 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em] flex-1 text-center">Send Request</h1>
        <div className="w-10"></div>
      </header>

      <div className="px-6 py-8 space-y-10 pb-60">
        {/* Recipient Selection */}
        <div className="space-y-5">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[.3em] flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-indigo-500" />
                    Recipient
                </h3>
            </div>
            <div className="relative group">
                <div className="absolute inset-0 bg-indigo-600/5 rounded-[2.5rem] blur-xl group-hover:bg-indigo-600/10 transition-colors"></div>
                <div className="relative bg-white p-3 rounded-[2.5rem] shadow-premium border border-slate-200">
                    {recipient ? (
                        <div className="h-16 rounded-[2rem] bg-slate-50 font-black text-slate-900 px-8 flex items-center border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl border border-indigo-100">
                                    {recipient.avatar || recipient.initials}
                                </div>
                                <span>{recipient.name}</span>
                            </div>
                        </div>
                    ) : (
                        <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                            <SelectTrigger className="h-16 rounded-[2rem] border-none bg-slate-50 font-black text-slate-900 px-8 focus:ring-4 focus:ring-indigo-500/5 transition-all">
                                <SelectValue placeholder="Select partner" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[1.5rem] border-slate-100 shadow-2xl overflow-hidden p-2">
                                <SelectItem value="1" className="font-black py-4 px-4 rounded-xl focus:bg-indigo-50 focus:text-indigo-600">Sarah Lim</SelectItem>
                                <SelectItem value="2" className="font-black py-4 px-4 rounded-xl focus:bg-indigo-50 focus:text-indigo-600">Marcus Tan</SelectItem>
                                <SelectItem value="3" className="font-black py-4 px-4 rounded-xl focus:bg-indigo-50 focus:text-indigo-600">Daniel Ng</SelectItem>
                                <SelectItem value="4" className="font-black py-4 px-4 rounded-xl focus:bg-indigo-50 focus:text-indigo-600">Alicia Goh</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </div>
        </div>

        {/* Study Topic */}
        <div className="space-y-5">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[.3em] flex items-center gap-2 px-2">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                Study Topic <span className="text-rose-500">*</span>
            </h3>
            <div className="bg-white p-3 rounded-[2.5rem] shadow-premium border border-slate-200">
                <div className="relative">
                    <Input 
                      placeholder="e.g., BED Unit 5 – Web Services" 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="h-16 px-8 rounded-[2rem] border-none bg-slate-50 font-bold text-slate-900 focus-visible:ring-4 focus-visible:ring-indigo-500/5 transition-all text-sm" 
                    />
                </div>
            </div>
        </div>

        {/* Temporal Matrix */}
        <div className="space-y-5">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[.3em] flex items-center gap-2 px-2">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                Schedule <span className="text-rose-500">*</span>
            </h3>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-slate-200 grid grid-cols-2 gap-8 ring-1 ring-slate-100/50">
                <div className="space-y-3">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Date</Label>
                    <Input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="h-12 rounded-2xl bg-slate-50 border-none font-black text-slate-900 focus-visible:ring-4 focus-visible:ring-indigo-500/5 transition-all text-xs px-4" 
                    />
                </div>
                <div className="space-y-3">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Time</Label>
                    <Input 
                        type="time" 
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="h-12 rounded-2xl bg-slate-50 border-none font-black text-slate-900 focus-visible:ring-4 focus-visible:ring-indigo-500/5 transition-all text-xs px-4" 
                    />
                </div>
            </div>
        </div>

        {/* Location & Session Type */}
        <div className="grid grid-cols-1 gap-10">
            <div className="space-y-5">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[.3em] flex items-center gap-2 px-2">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    Preferred Location <span className="text-rose-500">*</span>
                </h3>
                <div className="bg-white p-3 rounded-[2.5rem] shadow-premium border border-slate-200">
                    <Input 
                      placeholder="e.g., Library (Level 5)" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-16 px-8 rounded-[2rem] border-none bg-slate-50 font-bold text-slate-900 focus-visible:ring-4 focus-visible:ring-indigo-500/5 transition-all text-sm" 
                    />
                </div>
            </div>

            <div className="space-y-5">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[.3em] flex items-center gap-2 px-2">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
                    Session Mode
                </h3>
                <RadioGroup value={mode} onValueChange={(v: any) => setMode(v)} className="grid grid-cols-2 gap-5">
                  <div className="relative">
                    <RadioGroupItem value="one-on-one" id="one-on-one" className="peer sr-only" />
                    <Label
                      htmlFor="one-on-one"
                      className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-[2.5rem] cursor-pointer shadow-premium transition-all peer-data-[state=checked]:border-indigo-600 peer-data-[state=checked]:bg-indigo-50/50 peer-data-[state=checked]:shadow-[0_10px_30px_rgba(79,70,229,0.1)] group hover:bg-slate-50"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform peer-data-[state=checked]:bg-white">
                        <User className="w-6 h-6 text-indigo-600" />
                      </div>
                      <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Personal</span>
                    </Label>
                  </div>

                  <div className="relative">
                    <RadioGroupItem value="group" id="group" className="peer sr-only" />
                    <Label
                      htmlFor="group"
                      className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-[2.5rem] cursor-pointer shadow-premium transition-all peer-data-[state=checked]:border-indigo-600 peer-data-[state=checked]:bg-indigo-50/50 peer-data-[state=checked]:shadow-[0_10px_30px_rgba(79,70,229,0.1)] group hover:bg-slate-50"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform peer-data-[state=checked]:bg-white">
                        <Layers className="w-6 h-6 text-indigo-600" />
                      </div>
                      <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Group</span>
                    </Label>
                  </div>
                </RadioGroup>
            </div>
        </div>

        {/* Message Input */}
        <div className="space-y-5">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[.3em] flex items-center gap-2 px-2">
                <MessageCircle className="w-3.5 h-3.5 text-indigo-500" />
                Note to Partner
            </h3>
            <div className="bg-white p-8 rounded-[3rem] shadow-premium border border-slate-200 ring-1 ring-slate-100/50">
                <Textarea 
                    placeholder="Hi! I'd love to collaborate on..." 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="min-h-[160px] rounded-[2rem] bg-slate-50/50 border-none font-bold text-slate-900 focus-visible:ring-4 focus-visible:ring-indigo-500/10 resize-none p-6 text-sm leading-relaxed"
                />
            </div>
        </div>

        {/* Guidelines Helper */}
        <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-[2rem] flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                <Info className="w-4 h-4 text-white" />
            </div>
            <p className="text-[11px] font-bold text-indigo-900/60 leading-relaxed">
                Requests are sent instantly. Partners can accept, reschedule, or decline based on their availability.
            </p>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-100">
        <div className="max-w-md mx-auto space-y-4">
            {validationError && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-rose-500 animate-in fade-in slide-in-from-bottom-2">
                    <p className="text-xs font-bold">{validationError}</p>
                </div>
            )}
            <button
                className="w-full py-5 bg-indigo-600 rounded-[2rem] text-[13px] font-black text-white uppercase tracking-[.4em] shadow-[0_20px_40px_rgba(79,70,229,0.3)] transition-all hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4 group relative overflow-hidden"
                onClick={handleSubmit}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <Send className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="relative z-10">Send Request</span>
            </button>
        </div>
      </div>
      
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"></div>
            <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-[0_20px_70px_rgba(0,0,0,0.3)] relative z-10 text-center space-y-6 scale-in-center animate-in zoom-in-95 duration-300">
                <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mx-auto ring-8 ring-indigo-50/50">
                    <CheckCircle2 className="w-12 h-12 text-indigo-600" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Request Sent!</h3>
                    <p className="text-sm font-bold text-slate-400">Your partner has been notified.</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
