import React, { useState } from 'react';
import { ChevronLeft, Upload, FolderPlus, Download, FileText, Folder, MoreVertical, Plus, X } from 'lucide-react';
import type { PageType } from '../../../App';

interface SharedNotesProps {
  onNavigate: (page: PageType) => void;
  chat?: any;
  items: any[];
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
}

export function SharedNotes({ onNavigate, chat = { name: 'Sarah Johnson' }, items, setItems }: SharedNotesProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<number | null>(null);


  const handleAddFolder = () => {
    if (!folderName.trim()) return;
    const newFolder = {
      id: Date.now(),
      type: 'folder',
      name: folderName,
      count: 0
    };
    setItems([newFolder, ...items]);
    setFolderName('');
    setShowNewFolderModal(false);
  };

  const handleSelectFile = () => {
    setIsUploading(true);
    setTimeout(() => {
      setSelectedFileName(`Mock_File_${Math.floor(Math.random() * 1000)}.pdf`);
      setIsUploading(false);
    }, 1500);
  };

  const handleConfirmUpload = () => {
    if (!selectedFileName) return;
    const newFile = {
      id: Date.now(),
      type: 'file',
      name: selectedFileName,
      size: '1.2 MB',
      parentId: currentFolder
    };
    if (currentFolder) {
      setItems(items.map(item => {
        if (item.id === currentFolder && item.type === 'folder') {
          return {
            ...item,
            files: [newFile, ...(item.files || [])],
            count: (item.count || 0) + 1
          };
        }
        return item;
      }));
    } else {
      setItems([newFile, ...items]);
    }
    setSelectedFileName(null);
    setShowUploadModal(false);
  };

  const getCurrentItems = () => {
    if (currentFolder === null) {
      return items.filter(item => !item.parentId);
    }
    const folder = items.find(item => item.id === currentFolder);
    return folder?.files || [];
  };

  const handleFolderClick = (folderId: number) => {
    setCurrentFolder(folderId);
  };

  const handleBackClick = () => {
    if (currentFolder !== null) {
      setCurrentFolder(null);
    } else {
      onNavigate('chat');
    }
  };

  const currentFolderName = currentFolder ? items.find(i => i.id === currentFolder)?.name : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 bg-white border-b border-slate-100 flex items-center gap-4 sticky top-0 z-40">
        <button 
          onClick={handleBackClick}
          aria-label="Back"
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group"
        >
          <ChevronLeft size={20} className="text-slate-900 group-hover:text-indigo-600 transition-colors" />
        </button>
        <div className="flex-1">
          <h1 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">
            {currentFolderName || 'Shared Notes'}
          </h1>
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="w-4 h-4 rounded-full bg-indigo-50 flex items-center justify-center text-[8px] font-black text-indigo-600 border border-indigo-100">
              {chat?.name?.charAt(0) || 'S'}
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              {currentFolderName ? 'Folder' : chat?.name || 'Sarah Johnson'}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6 pb-32 overflow-y-auto">
        {/* Actions */}
        <div className="flex gap-3">
          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex-1 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center gap-2 text-xs font-black hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
          >
            <Upload size={16} />
            <span>Upload File</span>
          </button>
          <button 
            onClick={() => setShowNewFolderModal(true)}
            className="flex-1 h-12 bg-white border-2 border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center gap-2 text-xs font-black hover:bg-indigo-50 transition-all active:scale-95"
          >
            <FolderPlus size={16} />
            <span>New Folder</span>
          </button>
        </div>

        {/* Item List */}
        <div className="space-y-3">
          {getCurrentItems().map((item: any) => (
            <div 
              key={item.id}
              onClick={() => item.type === 'folder' && handleFolderClick(item.id)}
              className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-indigo-100 hover:shadow-md transition-all cursor-pointer animate-in slide-in-from-top-2"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                item.type === 'folder' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
              }`}>
                {item.type === 'folder' ? <Folder size={20} fill="currentColor" fillOpacity={0.2} /> : <FileText size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {item.type === 'folder' ? `${item.count} items` : item.size}
                </p>
              </div>
              {item.type === 'file' && (
                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                >
                  <Download size={18} />
                </button>
              )}
              {item.type === 'folder' && (
                <button className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                  <ChevronLeft size={18} className="rotate-180" />
                </button>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Upload Modal (6.1.5a) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowUploadModal(false)}></div>
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-premium relative z-10 animate-in zoom-in-95 duration-300 p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Upload Files</h3>
              <button onClick={() => setShowUploadModal(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100">
                <X size={16} />
              </button>
            </div>
            
            <div 
              onClick={!isUploading ? handleSelectFile : undefined}
              className={`border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group ${
                selectedFileName ? 'border-emerald-200 bg-emerald-50/30' : 'border-indigo-100 bg-indigo-50/30 hover:bg-indigo-50'
              } ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
            >
              <div className={`w-14 h-14 rounded-3xl border flex items-center justify-center transition-all shadow-sm ${
                selectedFileName ? 'bg-white border-emerald-100 text-emerald-500' : 'bg-white border-indigo-100 text-indigo-300 group-hover:text-indigo-600 group-hover:scale-110 group-hover:rotate-6'
              }`}>
                {isUploading ? (
                  <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                ) : selectedFileName ? (
                  <FileText size={24} />
                ) : (
                  <Upload size={24} />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-slate-700">
                  {isUploading ? 'Scanning Files...' : selectedFileName || 'Choose Files'}
                </p>
                <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${selectedFileName ? 'text-emerald-500' : 'text-indigo-400'}`}>
                  {selectedFileName ? 'File Ready' : 'Select files from your device'}
                </p>
              </div>
            </div>

            <button 
              onClick={handleConfirmUpload}
              disabled={!selectedFileName || isUploading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-indigo-100 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:shadow-none"
            >
              Confirm Upload
            </button>
          </div>
        </div>
      )}

      {/* New Folder Modal (6.1.5b) */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowNewFolderModal(false)}></div>
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-premium relative z-10 animate-in zoom-in-95 duration-300 p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">New Folder</h3>
              <button onClick={() => setShowNewFolderModal(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100">
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-4">
              <input 
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Enter folder name..."
                className="w-full h-14 px-5 bg-indigo-50/50 border-2 border-indigo-50 rounded-2xl text-sm font-black text-slate-900 placeholder:text-indigo-200 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                autoFocus
              />
              <button 
                onClick={handleAddFolder}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-indigo-100 active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none"
                disabled={!folderName.trim()}
              >
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
