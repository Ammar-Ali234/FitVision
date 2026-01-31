
import React, { useState, useRef } from 'react';
import { Camera, RefreshCw, CheckCircle2, Loader2, Download, FileText, Ruler, Upload, X } from 'lucide-react';
import { analyzeBodyMeasurements } from '../services/geminiService';
import { BodyMeasurements } from '../types';

const MeasurementTool: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BodyMeasurements | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResults(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const base64Data = image.split(',')[1];
      const data = await analyzeBodyMeasurements(base64Data);
      setResults(data);
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Please ensure your photo is clear and shows your full body.");
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!results) return;
    const reportText = `
FITVISION AR - PRECISION BODY ANALYTICS
Generated: ${new Date().toLocaleString()}
-----------------------------------------
VITAL METRICS:
Height:    ${results.height || '--'} ${results.unit}
Chest:     ${results.chest || '--'} ${results.unit}
Waist:     ${results.waist || '--'} ${results.unit}
Hips:      ${results.hips || '--'} ${results.unit}

UPPER BODY:
Neck:      ${results.neck || '--'} ${results.unit}
Shoulders: ${results.shoulders || '--'} ${results.unit}
Arm Length: ${results.armLength || '--'} ${results.unit}
Wrist:     ${results.wrist || '--'} ${results.unit}

LOWER BODY:
Inseam:    ${results.inseam || '--'} ${results.unit}
Thigh:     ${results.thigh || '--'} ${results.unit}
Calve:     ${results.calve || '--'} ${results.unit}
Ankle:     ${results.ankle || '--'} ${results.unit}

-----------------------------------------
Precision AI Estimated Measurements v2.5
FitVision AR Global Network
`.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FitVision_Report_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setImage(null);
    setResults(null);
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Whole Body Analysis</h2>
        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black">Precision Tailoring Suite</p>
      </div>

      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-[3/4] border border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-zinc-900/30 transition-all group bg-zinc-950 shadow-inner"
        >
          <div className="w-20 h-20 rounded-full bg-blue-500/5 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-500 border border-blue-500/10 shadow-2xl">
            <Upload size={36} />
          </div>
          <div className="text-center space-y-1 px-10">
            <p className="font-bold text-sm">Upload Body Silhouette</p>
            <p className="text-[10px] text-zinc-500 leading-relaxed italic">Stand in a clear space with form-fitting attire for maximum accuracy.</p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-zinc-950 border border-white/5 shadow-2xl group">
            <img src={image} className="w-full h-full object-contain" alt="Silhouette Preview" />
            
            {!results && !loading && (
              <button 
                onClick={reset}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10 text-zinc-400 hover:text-white transition-all z-30"
              >
                <X size={20} />
              </button>
            )}

            {loading && (
              <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
                <div className="absolute inset-x-0 h-1 bg-blue-500/80 shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-scan"></div>
                <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-[2px] flex flex-col items-center justify-center text-center">
                  <div className="p-6 rounded-3xl bg-black/70 backdrop-blur-xl border border-white/10 space-y-3">
                    <Loader2 className="animate-spin text-blue-500 mx-auto" size={40} />
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Extracting Metrics</p>
                      <p className="text-[8px] text-zinc-500 italic">Mapping skeletal anchors...</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!results && !loading && (
            <div className="flex gap-4">
              <button 
                onClick={reset}
                className="flex-1 h-14 rounded-2xl glass-panel font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/5 border border-white/10 text-zinc-400"
              >
                <RefreshCw size={16} /> Retake
              </button>
              <button 
                onClick={startAnalysis}
                className="flex-[2] h-14 rounded-2xl bg-white text-black font-bold text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-lg shadow-white/10"
              >
                <Ruler size={16} /> Run AI Analysis
              </button>
            </div>
          )}
        </div>
      )}

      {results && (
        <div className="space-y-10 animate-in slide-in-from-bottom-12 duration-1000 fill-mode-forwards pb-10">
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                <CheckCircle2 size={24} />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold tracking-tight">Profile Ready</h3>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Precision Mapping v2.5</p>
              </div>
            </div>
            <button 
              onClick={downloadReport}
              className="h-12 px-6 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/30"
            >
              <Download size={16} /> Export
            </button>
          </div>

          <div className="space-y-8">
            <SectionGroup title="Core Dimensions">
              <ResultCard label="Height" value={results.height} unit={results.unit} />
              <ResultCard label="Chest" value={results.chest} unit={results.unit} />
              <ResultCard label="Waist" value={results.waist} unit={results.unit} />
              <ResultCard label="Hips" value={results.hips} unit={results.unit} />
            </SectionGroup>

            <SectionGroup title="Upper Extremities">
              <ResultCard label="Neck" value={results.neck} unit={results.unit} />
              <ResultCard label="Shoulders" value={results.shoulders} unit={results.unit} />
              <ResultCard label="Arm Length" value={results.armLength} unit={results.unit} />
              <ResultCard label="Wrist" value={results.wrist} unit={results.unit} />
            </SectionGroup>

            <SectionGroup title="Lower Extremities">
              <ResultCard label="Inseam" value={results.inseam} unit={results.unit} />
              <ResultCard label="Thigh" value={results.thigh} unit={results.unit} />
              <ResultCard label="Calve" value={results.calve} unit={results.unit} />
              <ResultCard label="Ankle" value={results.ankle} unit={results.unit} />
            </SectionGroup>
          </div>

          <div className="flex gap-4 pt-6 border-t border-white/5">
            <button 
              onClick={reset}
              className="flex-1 h-16 rounded-2xl border border-zinc-800 text-zinc-500 font-bold text-xs hover:bg-zinc-900/50 transition-colors"
            >
              New Scan
            </button>
            <button 
              className="flex-1 h-16 rounded-2xl bg-zinc-100 text-black font-bold text-xs flex items-center justify-center gap-2 hover:bg-white transition-all active:scale-[0.98] shadow-lg"
            >
              <FileText size={18} /> Sync to Cloud
            </button>
          </div>
          
          <p className="text-center text-[9px] text-zinc-600 italic px-10 leading-relaxed">
            AI-estimated values for high-precision tailoring. Actual physical measurements may vary by ±1.5%.
          </p>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .animate-scan {
          position: absolute;
          width: 100%;
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

const SectionGroup = ({ title, children }: any) => (
  <div className="space-y-4">
    <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 border-l-2 border-blue-600 pl-4">{title}</h4>
    <div className="grid grid-cols-2 gap-3">
      {children}
    </div>
  </div>
);

const ResultCard = ({ label, value, unit }: any) => (
  <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/[0.03] hover:border-white/10 transition-all flex flex-col gap-1.5 group">
    <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-black text-white">{value || '--'}</span>
      <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider">{unit}</span>
    </div>
  </div>
);

export default MeasurementTool;
