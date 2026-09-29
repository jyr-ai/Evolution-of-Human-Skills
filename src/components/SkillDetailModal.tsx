import React, { useEffect } from 'react';
import { SkillItem } from '../types/history';
import { X, Flame, RefreshCw, Zap, BookOpen, Layers, CheckCircle } from 'lucide-react';

interface SkillDetailModalProps {
  skill: SkillItem | null;
  onClose: () => void;
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({ skill, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!skill) return null;

  const isObs = skill.category === 'obsolescent';
  const isTrans = skill.category === 'transformed';
  const isEmg = skill.category === 'emergent';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono mb-2">
          {isObs && (
            <span className="flex items-center gap-1.5 text-orange-400 font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5" />
              <span>Obsolescent / Devalued Craft</span>
            </span>
          )}
          {isTrans && (
            <span className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Transformed / Adapted Trade</span>
            </span>
          )}
          {isEmg && (
            <span className="flex items-center gap-1.5 text-blue-400 font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>Emergent / High-Demand Vocation</span>
            </span>
          )}
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">{skill.craftDomain}</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-serif font-bold text-white tracking-tight mb-4">
          {skill.name}
        </h2>

        {/* Description */}
        <p className="text-sm text-slate-200 leading-relaxed font-sans mb-6">
          {skill.description}
        </p>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 mb-6 text-xs font-mono">
          <div>
            <span className="text-slate-400 block mb-0.5">Dexterity Profile:</span>
            <span className="text-white font-semibold">{skill.dexterityLevel} Manual Dexterity</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Cognitive Load:</span>
            <span className="text-white font-semibold">{skill.cognitiveLoad} Cognitive Demands</span>
          </div>
        </div>

        {/* Tech & Shift */}
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-xs font-mono uppercase tracking-wider text-orange-400 font-semibold block mb-1">
              Displacing or Enabling Machine Apparatus:
            </span>
            <p className="text-slate-200 font-sans">{skill.displacingOrEnablingTech}</p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold block mb-1">
              The Cognitive & Somatic Shift:
            </span>
            <p className="text-slate-200 font-sans">{skill.cognitiveShift}</p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1">
              Historical & Labor Economic Context:
            </span>
            <p className="text-slate-300 font-sans leading-relaxed">{skill.historicalContext}</p>
          </div>

          {skill.scholarNote && (
            <div className="p-3.5 rounded-lg bg-blue-950/20 border border-blue-500/30 flex items-start gap-2.5">
              <BookOpen className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 font-sans">
                <span className="font-mono text-blue-400 uppercase tracking-wider block font-semibold mb-0.5">
                  Academic Citation Note:
                </span>
                {skill.scholarNote}
              </div>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Dismiss Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
