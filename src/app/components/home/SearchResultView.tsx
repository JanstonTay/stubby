import React, { useState } from 'react';
import { ChevronLeft, Sparkles, Copy, ThumbsUp, ThumbsDown, Send, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import type { PageType, ChatMessage } from '../../App';

interface SearchResultViewProps {
  onNavigate: (page: PageType) => void;
  searchQuery?: string;
}

export function SearchResultView({ onNavigate, searchQuery }: SearchResultViewProps) {
  const [followUpValue, setFollowUpValue] = useState("Give me one exam-style example");
  const [feedback, setFeedback] = useState<'helpful' | 'unhelpful' | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const [chatLogs, setChatLogs] = useState<ChatMessage[]>([]);

  const getResultData = () => {
    const query = searchQuery?.toLowerCase() || '';
    if (query.includes('array')) {
      return {
        title: 'Javascript Array',
        topic: 'Web Dev',
        context: 'A JavaScript array is a data structure used to store multiple values in a single variable. Arrays are dynamic, meaning they can grow or shrink in size, and can hold any data type including objects and even other arrays.',
        code: `let fruits = ['apple', 'banana', 'orange'];\nlet numbers = [1, 2, 3, 4, 5];`,
        methods: [
          { name: 'push()', desc: 'Adds element to end of array', usage: 'High' },
          { name: 'pop()', desc: 'Removes last element from array', usage: 'High' },
          { name: 'map()', desc: 'Creates new array with transformed values', usage: 'Critical' },
          { name: 'filter()', desc: 'Creates new array with filtered elements', usage: 'Critical' }
        ]
      };
    } else if (query.includes('loop')) {
      return {
        title: 'Looping over Javascript',
        topic: 'Programming',
        context: 'Loops are used in JavaScript to perform repeated tasks based on a condition. They are essential for iterating through arrays, objects, or repeating a block of code a set number of times.',
        code: `for (let i = 0; i < 5; i++) {\n  console.log(i);\n}\n\n// forEach loop\narray.forEach(item => console.log(item));`,
        methods: [
          { name: 'for loop', desc: 'Standard iteration with index counter', usage: 'High' },
          { name: 'while loop', desc: 'Runs as long as condition is true', usage: 'Medium' },
          { name: 'forEach()', desc: 'Array method for high-level iteration', usage: 'Critical' },
          { name: 'for...of', desc: 'Modern syntax for iterable objects', usage: 'High' }
        ]
      };
    } else if (query.includes('essay') || query.includes('tips')) {
      return {
        title: 'Tips for Essay Writing',
        topic: 'Academic Writing',
        context: 'Academic essay writing requires a clear structure, logical flow, and supported arguments. Focus on developing a strong thesis statement and providing evidence for each claim you make.',
        code: `1. Introduction: Hook + Background + Thesis\n2. Body Paragraphs: Topic Sentence + Evidence + Analysis\n3. Conclusion: Restate Thesis + Summary + Final Thought`,
        methods: [
          { name: 'Thesis Statement', desc: 'The central argument of your essay', usage: 'Critical' },
          { name: 'PEEL Method', desc: 'Point, Evidence, Explanation, Link', usage: 'High' },
          { name: 'Citation', desc: 'Always cite your sources (APA/MLA)', usage: 'Critical' },
          { name: 'Peer Review', desc: 'Get feedback before final submission', usage: 'High' }
        ]
      };
    } else {
      return {
        title: searchQuery || 'AI Analysis',
        topic: 'General Intelligence',
        context: `I've analyzed your search for "${searchQuery}". This topic covers fundamental concepts in current academic curriculum. I recommend focusing on practical applications and peer collaboration for better understanding.`,
        code: `// AI Insight: Exploring ${searchQuery}...\nconst concept = "${searchQuery}";\nconsole.log("Analyzing " + concept);`,
        methods: [
          { name: 'Overview', desc: 'General summary of the concept', usage: 'General' },
          { name: 'Application', desc: 'How to use this in your projects', usage: 'Practical' },
          { name: 'Key Terms', desc: 'Important vocabulary to remember', usage: 'Learning' },
          { name: 'Related Nodes', desc: 'Connected topics in your network', usage: 'Network' }
        ]
      };
    }
  };

  const data = getResultData();

  const handleFollowUp = () => {
    if (!followUpValue.trim()) return;
    
    // Add user message locally
    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        text: followUpValue,
        isMe: true,
        time: 'Just now'
    };
    
    setChatLogs(prev => [...prev, userMsg]);
    const currentQuery = followUpValue; // Capture for closure
    setFollowUpValue("");

    // Simulate AI response
    setTimeout(() => {
        const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: `Here is some more information about "${currentQuery}". Based on the context of ${data.title}, this would typically involve applying the core principles we discussed. Let me know if you need specific examples!`,
            isMe: false,
            time: 'Just now',
            sender: 'AI Tutor'
        };
        setChatLogs(prev => [...prev, aiMsg]);
    }, 1500);
  };

  const handleCopy = () => {
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <header className="px-6 py-5 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
        <button 
          onClick={() => onNavigate('ai-chatbot')}
          aria-label="Back"
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
        >
          <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
        </button>
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em]">
            {searchQuery ? `${searchQuery}` : 'recent results'}
          </h1>
        </div>
        <div className="w-10"></div>
      </header>

      <div className="flex flex-col flex-1 relative">
        {/* Sidebar Removed */}

        {/* Main Content Area */}
        <main className="flex-1 px-8 py-10 space-y-8 overflow-auto pb-48 max-w-3xl mx-auto w-full animate-in fade-in duration-700">
             <div className="space-y-6">
                <div className="flex items-end justify-between items-center mb-2 px-1">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">{data.title}</h2>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>Topic: {data.topic}</span>
                            <span>•</span>
                            <span>Just now</span>
                        </div>
                    </div>
                </div>

                {/* What is Section */}
                <section className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-slate-50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
                    <div className="relative">
                        <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">The Context</h3>
                        <p className="text-sm font-medium text-slate-600 leading-relaxed">
                            {data.context}
                        </p>
                    </div>
                </section>

                {/* Code block */}
                <section className="bg-slate-900 rounded-[2rem] p-6 shadow-2xl border border-slate-800 relative group overflow-hidden">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{data.topic === 'Academic Writing' ? 'Structure Guide' : 'Example Syntax'}</h3>
                        <button 
                            onClick={handleCopy}
                            className={`p-2 rounded-xl transition-all ${hasCopied ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                        >
                            {hasCopied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                    </div>
                    <div className="font-mono text-sm space-y-2 text-slate-300">
                        <pre className="whitespace-pre-wrap">{data.code}</pre>
                    </div>
                </section>

                {/* Methods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.methods.map((m, i) => (
                        <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 hover:border-indigo-100 hover:shadow-premium transition-all group cursor-pointer active:scale-95">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-black text-slate-900 font-mono tracking-tight">{m.name}</span>
                                <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg uppercase tracking-tight">{m.usage}</span>
                            </div>
                            <p className="text-[11px] font-medium text-slate-500 leading-snug">{m.desc}</p>
                        </div>
                    ))}
                </div>
             </div>

             {/* Feedback */}
             <div className="flex items-center gap-6 pt-6 border-t border-slate-100 mt-12 px-2">
                 <button 
                    onClick={handleCopy}
                    className={`flex items-center gap-2 transition-all ${hasCopied ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}
                 >
                    {hasCopied ? <Check size={16} /> : <Copy size={16} />}
                    <span className="text-[10px] font-black uppercase tracking-widest">{hasCopied ? 'Copied' : 'Copy'}</span>
                 </button>
                 <button 
                    onClick={() => setFeedback('helpful')}
                    className={`flex items-center gap-2 transition-all group ${feedback === 'helpful' ? 'text-emerald-600 scale-110' : 'text-slate-400 hover:text-emerald-600'}`}
                 >
                    <ThumbsUp size={18} fill={feedback === 'helpful' ? 'currentColor' : 'none'} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Helpful</span>
                 </button>
                 <button 
                    onClick={() => setFeedback('unhelpful')}
                    className={`flex items-center gap-2 transition-all group ${feedback === 'unhelpful' ? 'text-rose-600 scale-110' : 'text-slate-400 hover:text-rose-600'}`}
                 >
                    <ThumbsDown size={18} fill={feedback === 'unhelpful' ? 'currentColor' : 'none'} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Not Helpful</span>
                 </button>
             </div>

             {/* Chat Logs */}
             {chatLogs.length > 0 && (
                <div className="space-y-6 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">Follow-up Thread</h3>
                    <div className="space-y-4">
                        {chatLogs.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${
                                    msg.isMe 
                                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                                    : 'bg-white border border-slate-200 text-slate-600 rounded-tl-none'
                                }`}>
                                    {!msg.isMe && <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">AI Tutor</p>}
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
             )}
        </main>

        {/* Floating Input Footer - Positioned at bottom */}
        <div className="fixed bottom-0 right-0 left-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-8 py-6 z-40 max-w-md mx-auto">
            <div className="max-w-2xl mx-auto space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Follow-up question</label>
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative group">
                        <Input 
                            value={followUpValue}
                            onChange={(e: any) => setFollowUpValue(e.target.value)}
                            onKeyDown={(e: any) => e.key === 'Enter' && handleFollowUp()}
                            placeholder="Ask a follow-up question..." 
                            className="w-full h-14 pl-6 pr-6 bg-slate-50 border-transparent rounded-[1.25rem] text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/10 transition-all outline-none"
                        />
                    </div>
                    <button 
                        onClick={handleFollowUp}
                        className="w-14 h-14 flex items-center justify-center bg-indigo-600 rounded-[1.25rem] text-white shadow-feature shadow-indigo-100 hover:bg-indigo-700 active:scale-90 transition-all"
                    >
                        <Send size={24} className="-ml-1 translate-y-0.5" />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
