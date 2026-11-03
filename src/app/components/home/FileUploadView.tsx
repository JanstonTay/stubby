import { useState } from 'react';
import { ChevronLeft, Sparkles, Music, FileText, Video, Upload, X, Check } from 'lucide-react';
import { Button } from '../ui/button';
import type { PageType } from '../../App';

interface FileUploadViewProps {
  onNavigate: (page: PageType) => void;
  type: 'audio' | 'document' | 'video';
}

export function FileUploadView({ onNavigate, type }: FileUploadViewProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success'>('idle');
  const [hasFile, setHasFile] = useState(true);
  
  const isAudio = type === 'audio';
  const isVideo = type === 'video';
  const isDoc = type === 'document';
  
  let title = "Upload Document";
  let icon = <FileText size={24} className="text-indigo-600" />;
  let headerIcon = <FileText size={18} className="text-indigo-600" />;
  let formats = "PDF, DOCX, TXT, RTF";

  if (isAudio) {
    title = "Upload Audio File";
    icon = <Music size={24} className="text-indigo-600" />;
    headerIcon = <Music size={18} className="text-indigo-600" />;
    formats = "MP3, WAV, M4A, OGG";
  } else if (isVideo) {
    title = "Upload Video";
    icon = <Video size={24} className="text-indigo-600" />;
    headerIcon = <Video size={18} className="text-indigo-600" />;
    formats = "MP4, AVI, MOV, MKV";
  }

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
        setIsUploading(false);
        setUploadStatus('success');
        // Auto navigate to results after success feedback
        setTimeout(() => onNavigate('search-result', type === 'audio' ? 'Lecture Audio' : (type === 'video' ? 'Class Recording' : 'Study Notes')), 1000);
    }, 1500);
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
          {headerIcon}
          <h1 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em]">{type}</h1>
        </div>
        <div className="w-10"></div>
      </header>

      <div className="flex flex-col flex-1">
        <main className="flex-1 p-8 space-y-10 overflow-auto max-w-2xl mx-auto w-full pb-32">
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
                <p className="text-sm font-medium text-slate-400">Add content to provide more context to the AI.</p>
            </div>
            
            <div 
                onClick={() => setHasFile(true)}
                className={`border-4 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center space-y-6 transition-all group cursor-pointer shadow-premium relative overflow-hidden ${
                hasFile ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/30'
            }`}>
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-transform shadow-inner relative z-10 ${
                hasFile ? 'bg-indigo-600 text-white animate-bounce-slow' : 'bg-indigo-50 text-indigo-600 group-hover:scale-110'
              }`}>
                {hasFile ? <Check size={32} /> : icon}
              </div>
              <div className="text-center space-y-2 relative z-10">
                <p className="text-sm font-bold text-slate-600">
                  {hasFile ? 'File selected!' : `Drag and drop ${type} file here`}
                </p>
                {!hasFile && <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">or</p>}
              </div>
              <Button 
                variant="default" 
                onClick={(e) => { e.stopPropagation(); setHasFile(true); }}
                className={`${hasFile ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'} font-black px-10 h-12 rounded-2xl shadow-lg shadow-indigo-100 relative z-10`}
              >
                {hasFile ? 'Change File' : 'Browse Files'}
              </Button>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-100 rounded-[2rem] p-6 space-y-3 shadow-sm">
                <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-indigo-600" />
                    <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Supported formats</p>
                </div>
                <p className="text-xs font-bold text-indigo-400/80">{formats}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Uploaded Files</h3>
              {hasFile ? (
                <div className="bg-white border border-indigo-100 p-5 rounded-3xl flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                            {icon}
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-sm font-bold text-slate-900">university_lecture_{type}.{formats.split(', ')[0].toLowerCase()}</p>
                            {/* <p className="text-[10px] font-medium text-slate-400 underline cursor-pointer hover:text-indigo-600">Preview file</p> */}
                        </div>
                    </div>
                    <button onClick={() => setHasFile(false)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                        <X size={18} />
                    </button>
                </div>
              ) : (
                <div className="border border-slate-100 rounded-[2rem] p-12 flex flex-col items-center justify-center text-sm font-bold text-slate-300 bg-white shadow-sm italic text-center">
                    No files uploaded yet
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-6">
              <Button 
                variant="outline" 
                className="flex-1 h-14 border-2 border-slate-200 font-black rounded-2xl hover:bg-slate-50 text-[11px] uppercase tracking-widest"
                onClick={() => onNavigate('ai-chatbot')}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpload}
                disabled={isUploading || !hasFile}
                className={`flex-1 h-14 font-black rounded-2xl shadow-xl transition-all text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 ${
                    !hasFile ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' :
                    uploadStatus === 'success' 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-100' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
                }`}
              >
                {isUploading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : uploadStatus === 'success' ? (
                    <>
                        <Check size={18} />
                        <span>Uploaded</span>
                    </>
                ) : (
                    <>
                        <Upload size={18} />
                        <span>Upload</span>
                    </>
                )}
              </Button>
            </div>
          </main>
        </div>
      </div>
  );
}
