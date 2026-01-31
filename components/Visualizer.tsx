
import React, { useState, useEffect, useRef } from 'react';
import { Box, Scan, Target, Maximize, Share2 } from 'lucide-react';

const Visualizer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamActive, setStreamActive] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }, 
          audio: false 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      } catch (err) {
        console.error("Camera access denied", err);
      }
    };

    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return (
    <div className="h-full w-full relative bg-zinc-950 overflow-hidden">
      {/* Viewport */}
      <div className="absolute inset-0">
        {streamActive ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
            <Scan size={64} className="text-zinc-800 animate-pulse" />
            <p className="text-zinc-500">Accessing Camera for AR Visualization...</p>
          </div>
        )}
      </div>

      {/* AR Overlays */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
        {/* Reticle */}
        <div className="relative w-64 h-64 border-2 border-white/20 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="absolute inset-0 border-t-4 border-blue-500/50 rounded-full animate-spin duration-[3000ms]"></div>
          
          {/* Mock floating measurement tags */}
          <div className="absolute top-0 -translate-y-12 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 text-[10px] font-bold">
            WIDTH: 42.4cm
          </div>
          <div className="absolute bottom-0 translate-y-12 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 text-[10px] font-bold">
            DEPTH: 18.2cm
          </div>
        </div>

        {/* Floating UI Elements */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col gap-4">
           {[1, 2, 3].map(i => (
             <div key={i} className="w-10 h-10 rounded-full glass-panel flex items-center justify-center border border-white/20 shadow-lg">
                <div className="w-1 h-4 bg-blue-500/50 rounded-full"></div>
             </div>
           ))}
        </div>
      </div>

      {/* AR Controls */}
      <div className="absolute bottom-10 inset-x-0 flex flex-col items-center gap-6 px-6">
        <div className="glass-panel w-full p-4 rounded-3xl border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Box size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-zinc-400 tracking-tighter">Surface Mode</p>
              <p className="text-sm font-semibold">Placing: Slim Fit Tux</p>
            </div>
          </div>
          <button className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors">
            <Target size={20} />
          </button>
        </div>

        <div className="flex gap-4">
           <button className="w-16 h-16 rounded-full glass-panel border-4 border-white/20 flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group">
              <div className="w-12 h-12 rounded-full bg-white group-active:bg-zinc-200"></div>
           </button>
        </div>
      </div>

      {/* Tools */}
      <div className="absolute top-4 right-4 flex flex-col gap-3">
        <button className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center border border-white/10">
          <Maximize size={20} />
        </button>
        <button className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center border border-white/10">
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default Visualizer;
