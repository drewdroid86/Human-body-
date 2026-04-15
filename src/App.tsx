import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import HumanBodyCanvas from './components/HumanBodyCanvas';
import { SystemType, DiseaseType } from './models/anatomy';

type TabType = 'systems' | 'skeletal' | 'diseases';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('systems');
  const [activeSystem, setActiveSystem] = useState<SystemType>('all');
  const [activeDisease, setActiveDisease] = useState<DiseaseType>('none');
  const [showShell, setShowShell] = useState(true);

  // Derive layer visibility based on state
  const layers = useMemo(() => {
    // If we're in skeletal mode, focus on skeleton
    if (activeTab === 'skeletal') {
      return { skin: false, muscles: false, skeleton: true };
    }

    // Default layer logic
    return {
      skin: showShell && activeSystem === 'all' && activeDisease === 'none',
      muscles: activeSystem === 'all' || activeSystem === 'circulatory' || activeSystem === 'respiratory',
      skeleton: activeSystem === 'all' || activeSystem === 'skeletal' || activeDisease === 'broken_bone'
    };
  }, [activeTab, activeSystem, activeDisease, showShell]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-slate-200">
      <Sidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeSystem={activeSystem}
        onSystemChange={setActiveSystem}
        activeDisease={activeDisease}
        onDiseaseChange={setActiveDisease}
        showShell={showShell}
        onToggleShell={() => setShowShell(!showShell)}
      />
      
      <main className="flex-1 relative">
        <HumanBodyCanvas layers={layers} />
        
        {/* HUD Overlay */}
        <div className="absolute top-6 right-6 pointer-events-none">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl shadow-2xl">
            <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">Current View</h3>
            <p className="text-lg font-medium text-white capitalize">
              {activeTab === 'systems' ? `${activeSystem} system` : activeTab}
            </p>
            {activeDisease !== 'none' && (
              <div className="mt-2 pt-2 border-t border-slate-700/50">
                <span className="text-[10px] font-bold uppercase text-rose-400 block mb-0.5">Active Condition</span>
                <span className="text-sm text-rose-200 font-medium">Pathology: {activeDisease.replace('_', ' ')}</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
