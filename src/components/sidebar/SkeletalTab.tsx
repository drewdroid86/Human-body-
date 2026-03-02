import * as React from 'react';
import { Bone } from 'lucide-react';

export default function SkeletalTab() {
  return (
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
  );
}
