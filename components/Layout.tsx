
import React from 'react';
import { Home, Ruler, Shirt, Box, Settings } from 'lucide-react';
import { AppTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-black text-white relative overflow-hidden shadow-2xl border-x border-zinc-800">
      {/* Header */}
      <header className="p-4 glass-panel sticky top-0 z-50 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold italic">F</div>
          <h1 className="text-xl font-bold tracking-tight">FitVision <span className="text-blue-500">AR</span></h1>
        </div>
        <div className="flex gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        {children}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md glass-panel border-t border-white/10 px-4 py-3 flex justify-around items-center z-50">
        <NavButton 
          icon={<Home size={22} />} 
          label="Home" 
          active={activeTab === 'dashboard'} 
          onClick={() => onTabChange('dashboard')} 
        />
        <NavButton 
          icon={<Ruler size={22} />} 
          label="Measure" 
          active={activeTab === 'measure'} 
          onClick={() => onTabChange('measure')} 
        />
        <NavButton 
          icon={<Shirt size={22} />} 
          label="Try-On" 
          active={activeTab === 'try-on'} 
          onClick={() => onTabChange('try-on')} 
        />
        <NavButton 
          icon={<Box size={22} />} 
          label="Visual" 
          active={activeTab === 'ar'} 
          onClick={() => onTabChange('ar')} 
        />
        <NavButton 
          icon={<Settings size={22} />} 
          label="Settings" 
          active={activeTab === 'settings'} 
          onClick={() => onTabChange('settings')} 
        />
      </nav>
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-blue-500 scale-110' : 'text-zinc-500 hover:text-white'}`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default Layout;
