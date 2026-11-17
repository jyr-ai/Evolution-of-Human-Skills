import React from 'react';
import { SocietalGroup } from '../types/history';
import { ShieldAlert, TrendingUp, History, Zap } from 'lucide-react';

interface WinnersLosersSectionProps {
  losers: SocietalGroup[];
  winners: SocietalGroup[];
  eraTitle: string;
}

export const WinnersLosersSection: React.FC<WinnersLosersSectionProps> = ({
  losers,
  winners,
  eraTitle,
}) => {
  return (
    <section
      id="societal-impact"
      className="py-12 bg-white dark:bg-[#0b1120] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10">
          <div className="text-xs font-mono font-semibold text-[#F47E2D] uppercase tracking-widest mb-1">
            Section C · Societal Impact
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#002D72] dark:text-white tracking-tight text-balance">
            Economic Asymmetry: Winners vs. Losers ({eraTitle})
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl mt-1">
            Technological revolutions never distribute their bounty evenly. Every productivity surge devalues entrenched human labor while concentrating capital and leverage in ascendant cohorts.
          </p>
        </div>

        {/* 2-Column Battleground Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* THE LOSERS (Displaced Groups) */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-orange-200 dark:border-orange-900/60">
              <ShieldAlert className="w-5 h-5 text-[#F47E2D]" />
              <h3 className="text-lg font-serif font-bold text-[#c2410c] dark:text-orange-200">
                The Displaced & Devalued ("Losers")
              </h3>
            </div>

            <div className="space-y-5">
              {losers.map((group, idx) => (
                <div
                  key={idx}
                  className="relative overflow-hidden p-5 rounded-xl border border-slate-200 dark:border-orange-950/70 bg-slate-50/70 dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-orange-950/10 shadow-xs hover:shadow-lg dssg-card-hover space-y-3"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F47E2D] to-[#FF6B35]" />

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-mono text-[#F47E2D] uppercase tracking-wider font-semibold">
                      0{idx + 1} · {group.roleType}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">Displaced Cohort</span>
                  </div>

                  <h4 className="text-base font-bold text-[#002D72] dark:text-white font-serif">
                    {group.name}
                  </h4>

                  {/* Why they lost */}
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      The Disruption Mechanism:
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
                      {group.whyAffected}
                    </p>
                  </div>

                  {/* Historical Reaction */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-1">
                    <div className="text-xs font-mono text-[#c2410c] dark:text-orange-300 uppercase tracking-wider font-semibold">
                      Resistance & Labor Reaction:
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {group.reactionOrLeverage}
                    </p>
                  </div>

                  {/* Long-Term Outcome & Incident */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Long-Term Outcome:</strong>{' '}
                      {group.longTermOutcome}
                    </div>
                    <div className="flex items-start gap-1.5 pt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <History className="w-3.5 h-3.5 text-[#F47E2D] shrink-0 mt-0.5" />
                      <span>{group.historicalIncident}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* THE WINNERS (Ascendant Groups) */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-blue-200 dark:border-blue-900/60">
              <TrendingUp className="w-5 h-5 text-[#0056B3] dark:text-blue-400" />
              <h3 className="text-lg font-serif font-bold text-[#002D72] dark:text-blue-200">
                The Ascendant & Capitalized ("Winners")
              </h3>
            </div>

            <div className="space-y-5">
              {winners.map((group, idx) => (
                <div
                  key={idx}
                  className="relative overflow-hidden p-5 rounded-xl border border-slate-200 dark:border-blue-950/70 bg-slate-50/70 dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-blue-950/10 shadow-xs hover:shadow-lg dssg-card-hover space-y-3"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#002D72] to-[#0056B3]" />

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-mono text-[#0056B3] dark:text-blue-400 uppercase tracking-wider font-semibold">
                      0{idx + 1} · {group.roleType}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">Ascendant Cohort</span>
                  </div>

                  <h4 className="text-base font-bold text-[#002D72] dark:text-white font-serif">
                    {group.name}
                  </h4>

                  {/* Why they won */}
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Value Capture & Leverage:
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
                      {group.whyAffected}
                    </p>
                  </div>

                  {/* Reaction / Strategic Leverage */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-1">
                    <div className="text-xs font-mono text-[#0056B3] dark:text-blue-300 uppercase tracking-wider font-semibold">
                      Strategic Capital Leverage:
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {group.reactionOrLeverage}
                    </p>
                  </div>

                  {/* Long-Term Outcome & Incident */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Long-Term Outcome:</strong>{' '}
                      {group.longTermOutcome}
                    </div>
                    <div className="flex items-start gap-1.5 pt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <Zap className="w-3.5 h-3.5 text-[#0056B3] dark:text-blue-400 shrink-0 mt-0.5" />
                      <span>{group.historicalIncident}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
