import React, { useEffect } from 'react';
import { SkillItem } from '../types/history';
import { SkillMotionDemonstrator } from './SkillMotionDemonstrator';
import { X, Flame, RefreshCw, Zap, BookOpen, Users, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';

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

  const prevalence = skill.workforcePrevalence;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-[#090e1a] border border-slate-700/80 rounded-2xl shadow-2xl p-5 sm:p-7 overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Zone: Category Indicator */}
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
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mb-2">
          {skill.name}
        </h2>

        {/* Description Deck */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans mb-5">
          {skill.description}
        </p>

        {/* SECTION 1: KINETIC MOTION DEMONSTRATOR / VISUAL PLATE (GIF & IMAGE) */}
        <div className="mb-6">
          <SkillMotionDemonstrator
            archetype={skill.demonstratorArchetype}
            imagePath={skill.imagePath}
            skillName={skill.name}
            category={skill.category}
          />
        </div>

        {/* SECTION 2: WORKFORCE PREVALENCE ESTIMATE (Research Grounded) */}
        {prevalence ? (
          <div className="mb-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-semibold uppercase tracking-wider">
                  Historical Workforce Prevalence Estimate
                </span>
              </div>
              <span className="text-orange-400 font-bold tabular-nums">
                Peak: {prevalence.peakEraYear}
              </span>
            </div>

            {/* Prevalence Meter Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Share of Relevant Working Population:</span>
                <span className="text-base font-bold text-white tabular-nums">
                  {prevalence.percentage}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                <div
                  className={`h-full rounded-full ${
                    isObs ? 'bg-orange-500' : isTrans ? 'bg-amber-400' : 'bg-sky-400'
                  }`}
                  style={{ width: `${Math.min(prevalence.percentage * 3.5, 100)}%` }}
                />
              </div>
            </div>

            {/* Demographic Count & Census Source */}
            <div className="pt-2 border-t border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
              <div className="text-slate-200">
                Demographic Volume: <strong className="text-white font-normal">{prevalence.populationDescription}</strong>
              </div>
              <div className="text-[11px] text-slate-400 shrink-0 italic">
                Source: {prevalence.censusSource}
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Estimated Sector Prevalence: ~1.0% - 3.5% of specialized occupational cohort</span>
            <span className="text-slate-500">Census Model Est.</span>
          </div>
        )}

        {/* SECTION 3: Dexterity & Cognitive Load Profile */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 mb-5 text-xs font-mono">
          <div>
            <span className="text-slate-400 block mb-0.5">Dexterity Profile:</span>
            <span className="text-white font-semibold">{skill.dexterityLevel} Manual Dexterity</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Cognitive Load:</span>
            <span className="text-white font-semibold">{skill.cognitiveLoad} Cognitive Demands</span>
          </div>
        </div>

        {/* SECTION 4: Machine Displacement Vector & Labor Economic Context */}
        <div className="space-y-3.5 text-xs sm:text-sm">
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
