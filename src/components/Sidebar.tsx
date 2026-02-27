import * as React from 'react';
import { SystemType, DiseaseType, DISEASES } from '../data';
import { Activity, Bone, Heart, Brain, Stethoscope, Wind, Coffee, ShieldAlert } from 'lucide-react';

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
          id="systems"
          active={activeTab === 'systems'} 
          onClick={onTabChange}
          icon={<Heart className="w-4 h-4" />}
          label="Systems"
        />
        <TabButton 
          id="skeletal"
          active={activeTab === 'skeletal'} 
          onClick={onTabChange}
          icon={<Bone className="w-4 h-4" />}
          label="Skeletal"
        />
        <TabButton 
          id="diseases"
          active={activeTab === 'diseases'} 
          onClick={onTabChange}
          icon={<Stethoscope className="w-4 h-4" />}
          label="Diseases"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'systems' && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Organ Systems</h2>
            <SystemButton 
              id="all"
              active={activeSystem === 'all'} 
              onClick={onSystemChange}
              icon={<Activity className="w-5 h-5" />}
              label="Full Body"
            />
            <SystemButton 
              id="circulatory"
              active={activeSystem === 'circulatory'} 
              onClick={onSystemChange}
              icon={<Heart className="w-5 h-5 text-rose-400" />}
              label="Circulatory System"
            />
            <SystemButton 
              id="nervous"
              active={activeSystem === 'nervous'} 
              onClick={onSystemChange}
              icon={<Brain className="w-5 h-5 text-yellow-400" />}
              label="Nervous System"
            />
            <SystemButton 
              id="digestive"
              active={activeSystem === 'digestive'} 
              onClick={onSystemChange}
              icon={<Coffee className="w-5 h-5 text-orange-400" />}
              label="Digestive System"
            />
            <SystemButton 
              id="respiratory"
              active={activeSystem === 'respiratory'} 
              onClick={onSystemChange}
              icon={<Wind className="w-5 h-5 text-sky-400" />}
              label="Respiratory System"
            />
          </div>
        )}

        {activeTab === 'skeletal' && (
          <div className="space-y-4">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Skeletal System</h2>
            <p className="text-sm text-zinc-400 px-2">
              Explore the human skeleton. Click on individual bones and joints in the 3D view to learn their names, structure, and functions.
            </p>
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
              <div className="flex items-center gap-3 text-emerald-400 mb-2">
                <Bone className="w-5 h-5" />
                <span className="font-medium">Interactive Mode</span>
              </div>
              <p className="text-xs text-zinc-400">
                Hover over bones to highlight them. Click to view detailed information.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'diseases' && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Conditions & Pathology</h2>
            <DiseaseButton 
              id="none"
              active={activeDisease === 'none'} 
              onClick={onDiseaseChange}
              label="Healthy State"
            />
            {Object.values(DISEASES).map(disease => (
              <DiseaseButton 
                key={disease.id}
                id={disease.id as DiseaseType}
                active={activeDisease === disease.id as DiseaseType} 
                onClick={onDiseaseChange}
                label={disease.name}
              />
            ))}
            
            {activeDisease !== 'none' && (
              <div className="mt-6 bg-rose-500/10 rounded-lg p-4 border border-rose-500/20">
                <div className="flex items-center gap-2 text-rose-400 mb-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="font-medium text-sm">Pathology Active</span>
                </div>
                <p className="text-xs text-zinc-300">
                  {DISEASES[activeDisease as keyof typeof DISEASES].description}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const TabButton = React.memo(function TabButton({
  id,
  active,
  onClick,
  icon,
  label
}: {
  id: 'systems' | 'skeletal' | 'diseases',
  active: boolean,
  onClick: (id: 'systems' | 'skeletal' | 'diseases') => void,
  icon: React.ReactNode,
  label: string
}) {
  return (
    <button
      onClick={() => onClick(id)}
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
});

const SystemButton = React.memo(function SystemButton({
  id,
  active,
  onClick,
  icon,
  label
}: {
  id: SystemType,
  active: boolean,
  onClick: (id: SystemType) => void,
  icon: React.ReactNode,
  label: string
}) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
        active 
          ? 'bg-zinc-800 text-white border border-zinc-700' 
          : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'
      }`}
    >
      <div className={`p-2 rounded-md ${active ? 'bg-zinc-900' : 'bg-zinc-800'}`}>
        {icon}
      </div>
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
});

const DiseaseButton = React.memo(function DiseaseButton({
  id,
  active,
  onClick,
  label
}: {
  id: DiseaseType,
  active: boolean,
  onClick: (id: DiseaseType) => void,
  label: string
}) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all ${
        active 
          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
          : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'
      }`}
    >
      <span className="font-medium text-sm">{label}</span>
      {active && <div className="w-2 h-2 rounded-full bg-rose-500" />}
    </button>
  );
});
