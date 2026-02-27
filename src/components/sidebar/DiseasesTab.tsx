import * as React from 'react';
import { ShieldAlert } from 'lucide-react';
import { DiseaseType, DISEASES } from '../../data';

interface DiseasesTabProps {
  activeDisease: DiseaseType;
  onDiseaseChange: (disease: DiseaseType) => void;
}

export default function DiseasesTab({ activeDisease, onDiseaseChange }: DiseasesTabProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Conditions & Pathology</h2>
      <DiseaseButton
        active={activeDisease === 'none'}
        onClick={() => onDiseaseChange('none')}
        label="Healthy State"
      />
      {Object.values(DISEASES).map(disease => (
        <DiseaseButton
          key={disease.id}
          active={activeDisease === disease.id as DiseaseType}
          onClick={() => onDiseaseChange(disease.id as DiseaseType)}
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
  );
}

function DiseaseButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
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
}
