import React, { useState } from 'react';
import { IndustrialEra } from '../types/history';
import { Quote, Gauge, Clock, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';

interface EraHeroProps {
  era: IndustrialEra;
  onExploreSkills: () => void;
  onExploreTransitions: () => void;
}

export const EraHero: React.FC<EraHeroProps> = ({ era, onExploreSkills, onExploreTransitions }) => {
  const [imgLoaded, setImgLoaded] = useState(true);

  return (
    <section className="relative overflow-hidden pt-8 pb-12 bg-white dark:bg-[#0b1120] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid: Image + Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Visual Showcase (5 columns) */}
          <div className="lg:col-span-5 relative group overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 flex flex-col justify-end min-h-[340px] shadow-md">
            {imgLoaded ? (
              <img
                src={era.imagePath}
                alt={`${era.title} documentary scene`}
                referrerPolicy="no-referrer"
                onError={() => setImgLoaded(false)}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#002D72] via-slate-900 to-[#0056B3] flex items-center justify-center p-6 text-center">
                <span className="text-slate-200 font-serif italic text-lg">{era.title}</span>
              </div>
            )}

            {/* Measured contrast scrim (4.5:1+ white text over image) */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-[#080c14]/65 to-transparent" />

            {/* Overlay metadata */}
            <div className="relative z-10 p-6 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#F47E2D]">
                <span className="font-semibold uppercase tracking-wider">
                  Era {era.romanNumeral}
                </span>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="text-slate-200 font-semibold tabular-nums">{era.timeframe}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight drop-shadow-sm text-balance">
                {era.title}
              </h2>
            </div>
          </div>

          {/* Narrative & Shock (7 columns) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              {/* Tech Shock summary */}
              <div className="space-y-2.5">
                <div className="text-xs font-mono font-semibold uppercase tracking-widest text-[#0056B3] dark:text-blue-400">
                  The Core Technological Shock
                </div>
                <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-sans font-normal">
                  {era.coreTechShock}
                </p>
              </div>

              {/* Historical Quote Callout (clean all-around border, no border-l-4) */}
              <div className="mt-6 p-5 rounded-xl bg-slate-50 dark:bg-slate-900/75 border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#F47E2D] to-[#FF6B35]" />
                <Quote className="w-6 h-6 text-[#F47E2D]/30 absolute right-4 top-4" />
                <p className="text-sm italic font-serif text-slate-700 dark:text-slate-200 leading-relaxed pr-6">
                  "{era.keyQuote.text}"
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 font-sans">
                  <span className="font-semibold text-[#002D72] dark:text-slate-100">— {era.keyQuote.author}</span>
                  <span>{era.keyQuote.context}</span>
                </div>
              </div>

              {/* Core Technologies Unboxed List */}
              <div className="mt-6">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-semibold">
                  Enabling Technological Inventions
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {era.coreTechnologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Action Navigation */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreSkills}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg dssg-btn-primary text-xs font-semibold tracking-wide whitespace-nowrap shrink-0"
              >
                <span>Inspect Skill Matrix ({era.skills.length} Skills)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onExploreTransitions}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold tracking-wide transition-colors whitespace-nowrap shrink-0"
              >
                <span>View Transition Benchmark Nodes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Macro Labor Metrics Strip */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 dssg-card-hover">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              <Gauge className="w-3.5 h-3.5 text-[#0056B3] dark:text-blue-400" />
              <span>Capital Intensity</span>
            </div>
            <div className="text-base font-bold text-[#002D72] dark:text-white font-mono tabular-nums">
              {era.macroMetrics.capitalIntensity}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Scale of physical or compute infrastructure required
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 dssg-card-hover">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              <Clock className="w-3.5 h-3.5 text-[#F47E2D]" />
              <span>Diffusion Speed</span>
            </div>
            <div className="text-base font-bold text-[#002D72] dark:text-white font-mono tabular-nums">
              {era.macroMetrics.diffusionSpeedYears}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Time required to penetrate the broad economy
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 dssg-card-hover">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-red-400" />
              <span>Primary Displaced Tier</span>
            </div>
            <div className="text-sm font-semibold text-[#F47E2D] dark:text-orange-300 line-clamp-1">
              {era.macroMetrics.primaryDisplacedTier}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Occupational group absorbing immediate shock
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 dssg-card-hover">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Polanyi’s Paradox Status</span>
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-300 font-sans line-clamp-2">
              {era.macroMetrics.polanyiParadoxStatus}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
