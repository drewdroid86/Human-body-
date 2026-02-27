import * as React from 'react';
import { useState } from 'react';
import { SystemType, DiseaseType, BODY_PARTS, DISEASES } from './data';
import HumanBodyCanvas from './components/HumanBodyCanvas';
import Sidebar from './components/Sidebar';
import InfoPanel from './components/InfoPanel';
import { Activity, Bone, Heart, Brain, Stethoscope, Wind, Coffee } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'systems' | 'skeletal' | 'diseases'>('systems');
  const [activeSystem, setActiveSystem] = useState<SystemType>('all');
  const [activeDisease, setActiveDisease] = useState<DiseaseType>('none');
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);

  const handleTabChange = (tab: 'systems' | 'skeletal' | 'diseases') => {
    setActiveTab(tab);
    setSelectedPartId(null);
    if (tab === 'skeletal') {
      setActiveSystem('skeletal');
      setActiveDisease('none');
    } else if (tab === 'systems') {
      setActiveSystem('all');
      setActiveDisease('none');
    } else if (tab === 'diseases') {
      setActiveSystem('all');
    }
  };

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
