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
    <section id="societal-impact" className="py-12 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10">
          <div className="text-xs font-mono text-orange-400 uppercase tracking-widest mb-1">
            Section C · Societal Impact
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Economic Asymmetry: Winners vs. Losers ({eraTitle})
          </h2>
          <p className="text-sm text-slate-400 max-w-3xl mt-1">
            Technological revolutions never distribute their bounty evenly. Every productivity surge devalues entrenched human labor while concentrating capital and leverage in ascendant cohorts.
          </p>
        </div>

        {/* 2-Column Battleground Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* THE LOSERS (Displaced Groups) */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-orange-900/60">
              <ShieldAlert className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-serif font-bold text-orange-200">
                The Displaced & Devalued ("Losers")
              </h3>
            </div>

            <div className="space-y-5">
              {losers.map((group, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-orange-950/70 bg-gradient-to-b from-slate-900/90 to-orange-950/10 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-orange-400 uppercase tracking-wider font-semibold">
                      0{idx + 1} · {group.roleType}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">Displaced Cohort</span>
                  </div>

                  <h4 className="text-base font-semibold text-white font-serif">
                    {group.name}
                  </h4>

                  {/* Why they lost */}
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      The Disruption Mechanism:
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      {group.whyAffected}
                    </p>
                  </div>

                  {/* Historical Reaction */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-1">
                    <div className="text-xs font-mono text-orange-300 uppercase tracking-wider">
                      Resistance & Labor Reaction:
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {group.reactionOrLeverage}
                    </p>
                  </div>

                  {/* Long-Term Outcome & Incident */}
                  <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 space-y-1">
                    <div>
                      <strong className="text-slate-300">Long-Term Outcome:</strong> {group.longTermOutcome}
                    </div>
                    <div className="flex items-start gap-1.5 pt-1 text-[11px] text-slate-400 font-mono">
                      <History className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                      <span>{group.historicalIncident}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* THE WINNERS (Ascendant Groups) */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-blue-900/60">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-serif font-bold text-blue-200">
                The Ascendant & Capitalized ("Winners")
              </h3>
            </div>

            <div className="space-y-5">
              {winners.map((group, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-blue-950/70 bg-gradient-to-b from-slate-900/90 to-blue-950/10 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-blue-400 uppercase tracking-wider font-semibold">
                      0{idx + 1} · {group.roleType}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">Ascendant Cohort</span>
                  </div>

                  <h4 className="text-base font-semibold text-white font-serif">
                    {group.name}
                  </h4>

                  {/* Why they won */}
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      Value Capture & Leverage:
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      {group.whyAffected}
                    </p>
                  </div>

                  {/* Reaction / Strategic Leverage */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-1">
                    <div className="text-xs font-mono text-blue-300 uppercase tracking-wider">
                      Strategic Capital Leverage:
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {group.reactionOrLeverage}
                    </p>
                  </div>

                  {/* Long-Term Outcome & Incident */}
                  <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 space-y-1">
                    <div>
                      <strong className="text-slate-300">Long-Term Outcome:</strong> {group.longTermOutcome}
                    </div>
                    <div className="flex items-start gap-1.5 pt-1 text-[11px] text-slate-400 font-mono">
                      <Zap className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
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
