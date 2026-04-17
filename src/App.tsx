import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import HumanBodyCanvas from './components/HumanBodyCanvas';
import InfoPanel from './components/InfoPanel';
import { SystemType, DiseaseType } from './models/anatomy';

type TabType = 'systems' | 'skeletal' | 'diseases';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('systems');
  const [activeSystem, setActiveSystem] = useState<SystemType>('all');
  const [activeDisease, setActiveDisease] = useState<DiseaseType>('none');
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [showShell, setShowShell] = useState(true);

  const handleTabChange = (tab: TabType) => {
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
    <div className="flex h-screen w-screen overflow-hidden bg-black text-slate-200">
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        activeSystem={activeSystem}
        onSystemChange={setActiveSystem}
        activeDisease={activeDisease}
        onDiseaseChange={setActiveDisease}
        showShell={showShell}
        onToggleShell={() => setShowShell(!showShell)}
      />

      <main className="flex-1 relative">
        <HumanBodyCanvas
          activeSystem={activeSystem}
          activeDisease={activeDisease}
          selectedPartId={selectedPartId}
          onSelectPart={setSelectedPartId}
          showShell={showShell}
        />

        {/* Info Overlay */}
        <InfoPanel
          selectedPartId={selectedPartId}
          activeDisease={activeDisease}
        />

        {/* HUD Overlay */}
        <div className="absolute bottom-6 left-6 pointer-events-none">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl shadow-2xl">
            <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">Status Report</h3>
            <p className="text-lg font-medium text-white capitalize">
              {activeTab === 'systems' ? `${activeSystem} system` : activeTab}
            </p>
            {activeDisease !== 'none' && (
              <div className="mt-2 pt-2 border-t border-slate-700/50">
                <span className="text-[10px] font-bold uppercase text-rose-400 block mb-0.5">Active Pathology</span>
                <span className="text-sm text-rose-200 font-medium">{activeDisease.replace('_', ' ')}</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
