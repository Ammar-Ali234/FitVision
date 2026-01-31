
import React from 'react';
import { Ruler, Shirt, Box, ChevronRight, Sparkles } from 'lucide-react';
import { AppTab } from '../types';

interface DashboardProps {
  onNavigate: (tab: AppTab) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="p-8 space-y-12 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <div className="space-y-4 pt-4">
        <div className="h-1 w-12 bg-blue-600 rounded-full mb-6 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
        <h2 className="text-4xl font-bold tracking-tight leading-[1.1] text-white">
          The Future of <br />
          <span className="text-zinc-500 font-medium">Personal Fitting.</span>
        </h2>
        <p className="text-zinc-500 text-[13px] max-w-[280px] leading-relaxed font-medium">
          Professional-grade AI body analytics and immersive virtual stylings for the modern wardrobe.
        </p>
      </div>

      {/* Primary Actions */}
      <div className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-white/[0.05] pb-2">
          <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">Intelligence Suite</h3>
          <span className="text-[8px] font-bold text-blue-500 uppercase tracking-widest">v2.5 Live</span>
        </div>
        
        <div className="grid gap-4">
          <ActionButton 
            onClick={() => onNavigate('measure')}
            icon={<Ruler className="text-blue-500" size={20} />}
            title="Digital Measurement"
            description="Extract 12+ whole-body metrics."
          />
          
          <ActionButton 
            onClick={() => onNavigate('try-on')}
            icon={<Shirt className="text-purple-500" size={20} />}
            title="Virtual Fitting Room"
            description="Preview luxury looks instantly."
          />

          <ActionButton 
            onClick={() => onNavigate('ar')}
            icon={<Box className="text-zinc-400" size={20} />}
            title="Visualizer Studio"
            description="AR furniture & asset placement."
          />
        </div>
      </div>

      {/* Feature Highlight */}
      <div className="p-10 rounded-[3rem] bg-zinc-950 border border-white/[0.05] relative overflow-hidden group shadow-2xl">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none group-hover:bg-blue-600/10 transition-all duration-1000"></div>
        <div className="relative z-10 space-y-5">
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
             <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">System Status: Optimal</span>
          </div>
          <h4 className="font-bold text-2xl leading-tight tracking-tight">Precision Mapping.</h4>
          <p className="text-xs text-zinc-600 leading-relaxed font-medium">
            Our updated A-Pose detection allows for sub-centimeter accuracy in neck, wrist, and ankle measurements.
          </p>
          <button 
            onClick={() => onNavigate('measure')}
            className="h-12 px-8 rounded-full bg-white text-black text-[11px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 shadow-xl"
          >
            Start Scan
          </button>
        </div>
      </div>

      <div className="pt-4 text-center">
        <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest">FitVision Global Network © 2025</p>
      </div>
    </div>
  );
};

const ActionButton = ({ onClick, icon, title, description }: any) => (
  <button 
    onClick={onClick}
    className="group w-full p-6 rounded-[2.2rem] bg-zinc-900/20 flex items-center gap-6 text-left hover:bg-zinc-900/40 transition-all border border-white/[0.03] active:scale-[0.99]"
  >
    <div className="w-12 h-12 rounded-2xl bg-white/[0.02] flex items-center justify-center border border-white/[0.05] transition-all group-hover:bg-white/5 group-hover:scale-105">
      {icon}
    </div>
    <div className="flex-1">
      <div className="font-bold text-zinc-100 text-sm tracking-tight mb-0.5">{title}</div>
      <div className="text-[10px] text-zinc-600 font-medium">{description}</div>
    </div>
    <ChevronRight size={14} className="text-zinc-800 group-hover:text-zinc-500 transition-colors" />
  </button>
);

export default Dashboard;
