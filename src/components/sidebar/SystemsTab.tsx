import * as React from 'react';
import { Activity, Heart, Brain, Coffee, Wind } from 'lucide-react';
import { SystemType } from '../../data';

interface SystemsTabProps {
  activeSystem: SystemType;
  onSystemChange: (system: SystemType) => void;
}

export default function SystemsTab({ activeSystem, onSystemChange }: SystemsTabProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Organ Systems</h2>
      <SystemButton
        id="all"
        active={activeSystem === 'all'}
        onClick={onSystemChange}
        icon={Activity}
        label="Full Body"
      />
      <SystemButton
        id="circulatory"
        active={activeSystem === 'circulatory'}
        onClick={onSystemChange}
        icon={Heart}
        iconColor="text-rose-400"
        label="Circulatory System"
      />
      <SystemButton
        id="nervous"
        active={activeSystem === 'nervous'}
        onClick={onSystemChange}
        icon={Brain}
        iconColor="text-yellow-400"
        label="Nervous System"
      />
      <SystemButton
        id="digestive"
        active={activeSystem === 'digestive'}
        onClick={onSystemChange}
        icon={Coffee}
        iconColor="text-orange-400"
        label="Digestive System"
      />
      <SystemButton
        id="respiratory"
        active={activeSystem === 'respiratory'}
        onClick={onSystemChange}
        icon={Wind}
        iconColor="text-sky-400"
        label="Respiratory System"
      />
    </div>
  );
}

const SystemButton = React.memo(({ id, active, onClick, icon: Icon, iconColor, label }: { id: SystemType, active: boolean, onClick: (id: SystemType) => void, icon: React.ElementType<{ className?: string }>, iconColor?: string, label: string }) => {
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
        <Icon className={`w-5 h-5 ${iconColor || ''}`} />
      </div>
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
});
