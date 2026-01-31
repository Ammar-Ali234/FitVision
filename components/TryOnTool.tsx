
import React, { useState, useRef } from 'react';
import { Shirt, ArrowRight, Loader2, Sparkles, Upload, Download, RefreshCw, X, Image as ImageIcon } from 'lucide-react';
import { virtualTryOn } from '../services/geminiService';

const TryOnTool: React.FC = () => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateTryOn = async (p?: string) => {
    const finalPrompt = p || prompt;
    if (!userImage || !finalPrompt) return;
    setLoading(true);
    try {
      const base64Data = userImage.split(',')[1];
      const result = await virtualTryOn(base64Data, finalPrompt);
      setResultImage(result);
    } catch (err) {
      console.error(err);
      alert("Style synthesis failed. Please try a different garment description.");
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `FitVision_TryOn_${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Virtual Fitting Room</h2>
        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black">AI Style Synthesis</p>
      </div>

      <div className="space-y-6">
        {!resultImage ? (
          <div className="relative aspect-[3/4] bg-zinc-950 rounded-[2.5rem] overflow-hidden border border-zinc-900 shadow-2xl group">
            {userImage ? (
              <>
                <img src={userImage} className="w-full h-full object-contain" alt="Target Silhouette" />
                <button 
                  onClick={() => { setUserImage(null); setResultImage(null); }}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10 text-white hover:bg-red-500 transition-colors z-30 shadow-lg"
                >
                  <X size={18} />
                </button>
              </>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-zinc-900/40 transition-all p-10 text-center"
              >
                <div className="w-20 h-20 rounded-[2.5rem] bg-purple-500/5 flex items-center justify-center text-purple-500 border border-purple-500/10 shadow-2xl">
                  <Upload size={32} />
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-sm">Upload Base Silhouette</p>
                  <p className="text-[10px] text-zinc-500 leading-relaxed italic max-w-[200px] mx-auto">Upload a clear full-body photo for the most realistic AI synthesis.</p>
                </div>
              </div>
            )}
            
            {loading && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center gap-6 text-center z-20">
                <div className="relative">
                   <div className="absolute inset-0 blur-[40px] bg-purple-500/40 animate-pulse rounded-full"></div>
                   <Loader2 className="animate-spin text-purple-500 relative" size={56} />
                   <Sparkles className="absolute -top-3 -right-3 text-white animate-bounce" size={20} />
                </div>
                <div className="space-y-3 px-10">
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white">Synthesizing Look</h3>
                  <div className="w-48 h-1 bg-zinc-800 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-purple-500 w-1/3 animate-shimmer"></div>
                  </div>
                  <p className="text-[10px] text-zinc-500 italic">Adjusting fabric physics to your digital twin...</p>
                </div>
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
          </div>
        ) : (
          <div className="space-y-8 animate-in zoom-in-95 duration-700">
            <div className="relative aspect-[3/4] bg-zinc-950 rounded-[2.5rem] overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-500/10">
              <img src={resultImage} className="w-full h-full object-contain" alt="Fitting Result" />
              <div className="absolute bottom-6 inset-x-6 flex justify-between items-center bg-black/60 backdrop-blur-xl border border-white/10 p-5 rounded-[1.8rem]">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/20">
                     <ImageIcon size={20} />
                   </div>
                   <div className="space-y-1 max-w-[140px]">
                     <p className="text-[11px] font-black text-white uppercase tracking-tight truncate">
                       {prompt}
                     </p>
                     <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">AI Master Fitting</p>
                   </div>
                </div>
                <button 
                  onClick={downloadResult}
                  className="w-14 h-14 rounded-[1.2rem] bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-all active:scale-90 shadow-2xl"
                >
                  <Download size={24} />
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => { setResultImage(null); setPrompt(""); }}
                className="flex-1 h-16 rounded-2xl glass-panel text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/5 border border-white/10 text-zinc-400"
              >
                <RefreshCw size={18} /> New Fitting
              </button>
              <button 
                className="flex-1 h-16 rounded-2xl bg-zinc-100 text-black text-xs font-bold hover:bg-white transition-all active:scale-[0.98] shadow-lg"
              >
                Share Look
              </button>
            </div>
          </div>
        )}

        {!resultImage && (
          <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-1000">
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-500 transition-transform group-focus-within:scale-110">
                <Shirt size={22} />
              </div>
              <input 
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Black Double-Breasted Velvet Tuxedo"
                className="w-full h-18 bg-zinc-900/40 border border-zinc-800 rounded-3xl pl-16 pr-16 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-sm font-medium placeholder:text-zinc-700 focus:bg-zinc-900/80"
              />
              <button 
                disabled={!prompt || !userImage || loading}
                onClick={() => generateTryOn()}
                className="absolute right-3 top-3 bottom-3 w-12 bg-purple-600 rounded-2xl flex items-center justify-center hover:bg-purple-500 disabled:opacity-20 disabled:bg-zinc-800 transition-all active:scale-95 shadow-xl shadow-purple-600/20"
              >
                <ArrowRight size={22} className="text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 px-1">Trending Collections</h4>
              <div className="grid grid-cols-2 gap-3">
                {["Italian Wool Suit", "Silk Evening Gown", "Techwear Jacket", "Classic Trench Coat"].map(p => (
                  <button 
                    key={p}
                    onClick={() => { setPrompt(p); generateTryOn(p); }}
                    disabled={!userImage || loading}
                    className="px-5 py-5 rounded-[1.5rem] bg-zinc-900/40 border border-white/[0.03] text-[10px] font-bold text-zinc-500 hover:text-white hover:border-purple-500/40 hover:bg-zinc-900 transition-all text-left truncate flex items-center justify-between group"
                  >
                    {p}
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TryOnTool;
