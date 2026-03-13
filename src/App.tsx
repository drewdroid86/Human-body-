import * as React from 'react';
import { useState, useCallback } from 'react';
import { SystemType, DiseaseType, TABS, TabType } from './data';
import HumanBodyCanvas from './components/HumanBodyCanvas';
import Sidebar from './components/Sidebar';
import InfoPanel from './components/InfoPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>(TABS.SYSTEMS);
  const [activeSystem, setActiveSystem] = useState<SystemType>('all');
  const [activeDisease, setActiveDisease] = useState<DiseaseType>('none');
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
    setSelectedPartId(null);
    if (tab === TABS.SKELETAL) {
      setActiveSystem('skeletal');
      setActiveDisease('none');
    } else if (tab === TABS.SYSTEMS) {
      setActiveSystem('all');
      setActiveDisease('none');
    } else if (tab === TABS.DISEASES) {
      setActiveSystem('all');
    }
  }, []);

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        activeSystem={activeSystem}
        onSystemChange={setActiveSystem}
        activeDisease={activeDisease}
        onDiseaseChange={setActiveDisease}
      />

      {/* Main 3D View */}
      <div className="flex-1 relative">
        <HumanBodyCanvas 
          activeSystem={activeSystem} 
          activeDisease={activeDisease}
          selectedPartId={selectedPartId}
          onSelectPart={setSelectedPartId}
        />
        
        {/* Info Overlay */}
        <InfoPanel 
          selectedPartId={selectedPartId} 
          activeDisease={activeDisease}
        />
      </div>
    </div>
  );
}
