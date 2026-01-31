import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MeasurementTool from './components/MeasurementTool';
import TryOnTool from './components/TryOnTool';
import Visualizer from './components/Visualizer';
import { AppTab } from './types';
import { User, Bell, Shield, HelpCircle, Palette } from 'lucide-react';

// FIX: Explicitly type SettingItem to ensure consistent property handling in JSX
const SettingItem = ({ icon, label, right }: { icon: React.ReactNode, label: string, right?: string }) => (
  <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
    <div className="flex items-center gap-3">
      <div className="text-zinc-400">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </div>
    {right && <span className="text-xs text-blue-500 font-bold uppercase">{right}</span>}
  </button>
);

// FIX: Made 'children' optional in the type definition. This resolves the TypeScript error 
// where the JSX parser intermittently fails to recognize nested elements as the 'children' prop 
// when only 'label' is explicitly provided in the attribute list.
const Section = ({ label, children }: { label: string, children?: React.ReactNode }) => (
  <div className="space-y-2">
    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">{label}</h3>
    <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
      {children}
    </div>
  </div>
);

const SettingsView = () => (
  <div className="p-4 space-y-6">
    <div className="text-center space-y-2">
      <h2 className="text-2xl font-bold">Settings</h2>
      <p className="text-sm text-zinc-400">Manage your profile and preferences.</p>
    </div>

    <div className="space-y-4">
      <Section label="Account">
        <SettingItem icon={<User size={18}/>} label="Personal Profile" />
        <SettingItem icon={<Palette size={18}/>} label="App Theme" right="Dark" />
        <SettingItem icon={<Bell size={18}/>} label="Notifications" />
      </Section>

      <Section label="App Preferences">
        <SettingItem icon={<Shield size={18}/>} label="Privacy & Security" />
        <SettingItem icon={<HelpCircle size={18}/>} label="Help & Support" />
      </Section>

      <div className="p-4 glass-panel rounded-2xl text-center space-y-1">
        <p className="text-xs text-zinc-500 font-medium">FitVision AR v2.4.0</p>
        <p className="text-[10px] text-zinc-600">© 2024 FitVision Technologies Inc.</p>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'measure':
        return <MeasurementTool />;
      case 'try-on':
        return <TryOnTool />;
      case 'ar':
        return <Visualizer />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;