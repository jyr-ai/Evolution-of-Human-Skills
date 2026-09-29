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
    <section className="relative overflow-hidden pt-8 pb-12 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid: Image + Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Visual Showcase (5 columns) */}
          <div className="lg:col-span-5 relative group overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-end min-h-[340px] shadow-2xl">
            {imgLoaded ? (
              <img
                src={era.imagePath}
                alt={`${era.title} documentary scene`}
                referrerPolicy="no-referrer"
                onError={() => setImgLoaded(false)}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 flex items-center justify-center p-6 text-center">
                <span className="text-slate-400 font-serif italic text-lg">{era.title}</span>
              </div>
            )}

            {/* Measured contrast scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-[#080c14]/60 to-transparent" />

            {/* Overlay metadata */}
            <div className="relative z-10 p-6 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-orange-400">
                <span className="px-2 py-0.5 rounded bg-orange-950/70 border border-orange-500/40 font-semibold uppercase tracking-wider">
                  Era {era.romanNumeral}
                </span>
                <span className="text-slate-300 font-semibold">{era.timeframe}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight drop-shadow-sm">
                {era.title}
              </h2>
            </div>
          </div>

          {/* Narrative & Shock (7 columns) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              {/* Tech Shock summary */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>The Core Technological Shock</span>
                </div>
                <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-sans font-normal">
                  {era.coreTechShock}
                </p>
              </div>

              {/* Historical Quote Callout */}
              <div className="mt-6 p-4 rounded-lg bg-slate-900/70 border-l-4 border-orange-500 border-y border-r border-slate-800/80 relative">
                <Quote className="w-6 h-6 text-orange-500/20 absolute right-4 top-4" />
                <p className="text-sm italic font-serif text-slate-300 leading-relaxed">
                  "{era.keyQuote.text}"
                </p>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400 font-sans">
                  <span className="font-semibold text-slate-200">— {era.keyQuote.author}</span>
                  <span className="text-slate-400">{era.keyQuote.context}</span>
                </div>
              </div>

              {/* Core Technologies Unboxed List */}
              <div className="mt-6">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Enabling Technological Inventions:
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {era.coreTechnologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700/80 text-slate-300 font-mono"
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
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md shadow-blue-900/30"
              >
                <span>Inspect Skill Matrix ({era.skills.length} Skills)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onExploreTransitions}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold uppercase tracking-wider transition-all"
              >
                <span>View Transition Benchmark Nodes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Macro Labor Metrics Strip */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
              <Gauge className="w-3.5 h-3.5 text-blue-400" />
              <span>Capital Intensity</span>
            </div>
            <div className="text-base font-bold text-white font-mono">{era.macroMetrics.capitalIntensity}</div>
            <div className="text-xs text-slate-400 mt-1">Scale of physical or compute infrastructure required</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span>Diffusion Speed</span>
            </div>
            <div className="text-base font-bold text-white font-mono">{era.macroMetrics.diffusionSpeedYears}</div>
            <div className="text-xs text-slate-400 mt-1">Time required to penetrate the broad economy</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>Primary Displaced Tier</span>
            </div>
            <div className="text-sm font-semibold text-orange-300 line-clamp-1">
              {era.macroMetrics.primaryDisplacedTier}
            </div>
            <div className="text-xs text-slate-400 mt-1">Occupational group absorbing immediate shock</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Polanyi’s Paradox Status</span>
            </div>
            <div className="text-xs text-slate-300 font-sans line-clamp-2">
              {era.macroMetrics.polanyiParadoxStatus}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
