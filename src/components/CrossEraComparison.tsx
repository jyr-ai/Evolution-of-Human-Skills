import React from 'react';
import { INDUSTRIAL_ERAS } from '../data/industrialErasData';
import { ArrowRight, Layers, Flame, Zap, Cpu, Sparkles } from 'lucide-react';

interface CrossEraComparisonProps {
  onSelectEra: (eraId: string) => void;
}

export const CrossEraComparison: React.FC<CrossEraComparisonProps> = ({ onSelectEra }) => {
  return (
    <section className="py-12 border-b border-slate-800 bg-[#080c14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="text-xs font-mono text-orange-400 uppercase tracking-widest mb-1">
            Macro Horizon · Longitudinal View
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Four Revolutions at a Glance
          </h2>
          <p className="text-sm text-slate-400 max-w-3xl mt-1">
            Track how technology shifted from mechanical replacement of muscles to electrical coordination of factories, digital automation of calculation, and algorithmic synthesis of human thought.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {INDUSTRIAL_ERAS.map((era) => {
            const isEra1 = era.number === 1;
            const isEra2 = era.number === 2;
            const isEra3 = era.number === 3;
            const isEra4 = era.number === 4;

            return (
              <div
                key={era.id}
                className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span
                      className={`font-bold uppercase tracking-wider ${
                        isEra1
                          ? 'text-orange-400'
                          : isEra2
                          ? 'text-amber-400'
                          : isEra3
                          ? 'text-blue-400'
                          : 'text-sky-300'
                      }`}
                    >
                      Era {era.romanNumeral}
                    </span>
                    <span className="text-slate-400 tabular-nums">{era.timeframe}</span>
                  </div>

                  <h3 className="text-base font-serif font-bold text-white mb-2">
                    {era.title}
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-mono text-slate-400 block text-[11px] uppercase">
                        Primary Shock:
                      </span>
                      <p className="text-slate-300 line-clamp-2 mt-0.5">
                        {era.coreTechnologies.slice(0, 3).join(', ')}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="font-mono text-orange-400 block text-[11px] uppercase">
                        Displaced Class:
                      </span>
                      <p className="text-slate-300 line-clamp-2 mt-0.5">
                        {era.macroMetrics.primaryDisplacedTier}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="font-mono text-blue-400 block text-[11px] uppercase">
                        Ascendant Class:
                      </span>
                      <p className="text-slate-300 line-clamp-2 mt-0.5">
                        {era.macroMetrics.primaryAscendantTier}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    {era.skills.length} skills analyzed
                  </span>
                  <button
                    onClick={() => onSelectEra(era.id)}
                    className="flex items-center gap-1 text-xs font-mono text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
