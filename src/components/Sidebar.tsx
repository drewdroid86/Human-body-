import * as React from 'react';
import { SystemType, DiseaseType } from '../data';
import { Activity, Bone, Heart, Stethoscope } from 'lucide-react';
import SystemsTab from './sidebar/SystemsTab';
import SkeletalTab from './sidebar/SkeletalTab';
import DiseasesTab from './sidebar/DiseasesTab';

interface SidebarProps {
  activeTab: 'systems' | 'skeletal' | 'diseases';
  onTabChange: (tab: 'systems' | 'skeletal' | 'diseases') => void;
  activeSystem: SystemType;
  onSystemChange: (system: SystemType) => void;
  activeDisease: DiseaseType;
  onDiseaseChange: (disease: DiseaseType) => void;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  activeSystem,
  onSystemChange,
  activeDisease,
  onDiseaseChange
}: SidebarProps) {
  return (
    <div className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col z-10">
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-xl font-semibold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-emerald-400" />
          Anatomy Explorer
        </h1>
        <p className="text-zinc-400 text-sm mt-2">Interactive 3D Human Body</p>
      </div>

      <div className="flex p-2 gap-1 bg-zinc-950/50 border-b border-zinc-800">
        <TabButton 
          active={activeTab === 'systems'} 
          onClick={() => onTabChange('systems')}
          icon={<Heart className="w-4 h-4" />}
          label="Systems"
        />
        <TabButton 
          active={activeTab === 'skeletal'} 
          onClick={() => onTabChange('skeletal')}
          icon={<Bone className="w-4 h-4" />}
          label="Skeletal"
        />
        <TabButton 
          active={activeTab === 'diseases'} 
          onClick={() => onTabChange('diseases')}
          icon={<Stethoscope className="w-4 h-4" />}
          label="Diseases"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'systems' && (
          <SystemsTab
            activeSystem={activeSystem}
            onSystemChange={onSystemChange}
          />
        )}

        {activeTab === 'skeletal' && (
          <SkeletalTab />
        )}

        {activeTab === 'diseases' && (
          <DiseasesTab
            activeDisease={activeDisease}
            onDiseaseChange={onDiseaseChange}
          />
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
        active 
          ? 'bg-zinc-800 text-white shadow-sm' 
          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
