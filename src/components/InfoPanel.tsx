import React from 'react';
import { BODY_PARTS, DISEASES, DiseaseType } from '../data';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Activity, AlertCircle } from 'lucide-react';

interface InfoPanelProps {
  selectedPartId: string | null;
  activeDisease: DiseaseType;
}

export default function InfoPanel({ selectedPartId, activeDisease }: InfoPanelProps) {
  const partInfo = selectedPartId ? BODY_PARTS[selectedPartId] : null;
  const diseaseInfo = activeDisease !== 'none' ? DISEASES[activeDisease] : null;

  return (
    <div className="absolute top-6 right-6 w-80 flex flex-col gap-4 pointer-events-none z-20">
      <AnimatePresence>
        {partInfo && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-xl p-5 shadow-2xl pointer-events-auto"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white leading-tight">{partInfo.name}</h3>
                <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                  {partInfo.system} System
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Description</h4>
                <p className="text-sm text-zinc-300 leading-relaxed">{partInfo.description}</p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Function</h4>
                <p className="text-sm text-zinc-300 leading-relaxed">{partInfo.function}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {diseaseInfo && partInfo && diseaseInfo.affectedParts.includes(partInfo.id) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-rose-950/90 backdrop-blur-md border border-rose-900/50 rounded-xl p-5 shadow-2xl pointer-events-auto"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-md font-semibold text-rose-100 leading-tight">Pathology Impact</h3>
            </div>
            <p className="text-sm text-rose-200/80 leading-relaxed">
              The {partInfo.name.toLowerCase()} is directly affected by {diseaseInfo.name.toLowerCase()}.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!partInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-4 text-center pointer-events-auto"
        >
          <Activity className="w-6 h-6 text-zinc-500 mx-auto mb-2" />
          <p className="text-sm text-zinc-400">Select a body part to view details</p>
        </motion.div>
      )}
    </div>
  );
}
