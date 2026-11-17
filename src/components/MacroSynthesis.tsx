import React, { useState } from 'react';
import { COMMON_THREAD_SYNTHESIS, ENDURING_HUMAN_CORE } from '../data/synthesisData';
import { Shield, Sparkles, Scale, RefreshCw, Compass, CheckCircle2, ChevronRight } from 'lucide-react';

export const MacroSynthesis: React.FC = () => {
  const [selectedCoreId, setSelectedCoreId] = useState(ENDURING_HUMAN_CORE[0].id);
  const [selectedEraTab, setSelectedEraTab] = useState<'era1' | 'era2' | 'era3' | 'era4'>('era4');

  const activeCoreSkill =
    ENDURING_HUMAN_CORE.find((item) => item.id === selectedCoreId) || ENDURING_HUMAN_CORE[0];

  return (
    <section
      id="macro-synthesis"
      className="py-14 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b12] transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* SUBSECTION 1: THE COMMON THREAD & COGNITIVE INVERSION */}
        <div>
          <div className="text-xs font-mono font-semibold text-[#F47E2D] uppercase tracking-widest mb-1">
            Section 3.1 · Macro Comparative Synthesis
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#002D72] dark:text-white tracking-tight text-balance">
            {COMMON_THREAD_SYNTHESIS.headline}
          </h2>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-4xl mt-3 leading-relaxed">
            {COMMON_THREAD_SYNTHESIS.summary}
          </p>

          {/* Polanyi's Paradox Callout */}
          <div className="mt-6 relative overflow-hidden p-5 rounded-xl bg-white dark:bg-gradient-to-r dark:from-blue-950/40 dark:via-slate-900 dark:to-orange-950/20 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#002D72] via-[#0056B3] to-[#F47E2D]" />
            <div className="flex items-start gap-3 pt-1">
              <Scale className="w-5 h-5 text-[#0056B3] dark:text-blue-400 shrink-0 mt-1" />
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-[#0056B3] dark:text-blue-400 font-semibold">
                  The Polanyi Inversion & Moravec’s Paradox
                </span>
                <p className="text-xs sm:text-sm italic font-serif text-slate-700 dark:text-slate-300 leading-relaxed">
                  {COMMON_THREAD_SYNTHESIS.inversionQuote}
                </p>
              </div>
            </div>
          </div>

          {/* 5-Dimensional Comparison Table */}
          <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 font-mono uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-semibold w-1/4">Structural Dimension</th>
                    <th className="py-3.5 px-4 font-semibold w-1/3 text-[#002D72] dark:text-slate-300">
                      Eras 1 – 3 (1760 – 2010)
                    </th>
                    <th className="py-3.5 px-4 font-semibold w-1/3 text-[#F47E2D]">
                      Era 4: Generative AI (Present+)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 font-sans">
                  {COMMON_THREAD_SYNTHESIS.points.map((pt, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#002D72] dark:text-white">
                        {pt.dimension}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                        {pt.eras1to3}
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 dark:text-orange-200/90 leading-relaxed bg-orange-50/70 dark:bg-orange-950/15">
                        {pt.era4AI}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SUBSECTION 2: THE ENDURING HUMAN CORE */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="mb-8">
            <div className="text-xs font-mono font-semibold text-[#0056B3] dark:text-blue-400 uppercase tracking-widest mb-1">
              Section 3.2 · The Invariant Core
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#002D72] dark:text-white tracking-tight text-balance">
              The Enduring Human Core: 5 Invariant Meta-Skills
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl mt-1">
              Across 250 years of mechanization, electrification, digitization, and machine intelligence, these five fundamental human capabilities have consistently maintained premium economic and social value.
            </p>
          </div>

          {/* Interactive Core Skill Selector & Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* List of 5 Skills (5 columns) */}
            <div className="lg:col-span-5 space-y-2.5">
              {ENDURING_HUMAN_CORE.map((item, idx) => {
                const isSelected = item.id === selectedCoreId;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedCoreId(item.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 border-[#0056B3] dark:border-blue-500/80 ring-1 ring-[#0056B3]/30 dark:ring-blue-500/50 shadow-md'
                        : 'bg-white/70 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900/40'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tabular-nums">
                        Invariant Core 0{idx + 1}
                      </div>
                      <h3
                        className={`text-sm font-semibold transition-colors ${
                          isSelected ? 'text-[#002D72] dark:text-white' : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {item.name}
                      </h3>
                      <div className="text-xs font-mono text-[#0056B3] dark:text-blue-400 mt-1">{item.archetype}</div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 mt-1 shrink-0 transition-transform ${
                        isSelected ? 'text-[#0056B3] dark:text-blue-400 translate-x-0.5' : 'text-slate-400 dark:text-slate-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Deep-Dive Inspection Card (7 columns) */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-lg flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#0056B3] dark:text-blue-400 font-semibold">
                      {activeCoreSkill.archetype}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#002D72] dark:text-white mt-1">
                      {activeCoreSkill.name}
                    </h3>
                  </div>
                </div>

                {/* Why Enduring */}
                <div className="mt-4 space-y-1.5">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Why It Endures Across All Technological Paradigms:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {activeCoreSkill.whyEnduring}
                  </p>
                </div>

                {/* Historical Manifestation Era Tabs */}
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#F47E2D] font-semibold">
                      Historical Manifestation Across Eras:
                    </span>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 mb-4">
                    <button
                      onClick={() => setSelectedEraTab('era1')}
                      className={`flex-1 py-1.5 px-2 text-xs font-mono rounded transition-colors whitespace-nowrap shrink-0 ${
                        selectedEraTab === 'era1'
                          ? 'bg-white dark:bg-slate-800 text-[#002D72] dark:text-white font-semibold shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      Era I (1780)
                    </button>
                    <button
                      onClick={() => setSelectedEraTab('era2')}
                      className={`flex-1 py-1.5 px-2 text-xs font-mono rounded transition-colors whitespace-nowrap shrink-0 ${
                        selectedEraTab === 'era2'
                          ? 'bg-white dark:bg-slate-800 text-[#002D72] dark:text-white font-semibold shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      Era II (1900)
                    </button>
                    <button
                      onClick={() => setSelectedEraTab('era3')}
                      className={`flex-1 py-1.5 px-2 text-xs font-mono rounded transition-colors whitespace-nowrap shrink-0 ${
                        selectedEraTab === 'era3'
                          ? 'bg-white dark:bg-slate-800 text-[#002D72] dark:text-white font-semibold shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      Era III (1980)
                    </button>
                    <button
                      onClick={() => setSelectedEraTab('era4')}
                      className={`flex-1 py-1.5 px-2 text-xs font-mono rounded transition-colors whitespace-nowrap shrink-0 ${
                        selectedEraTab === 'era4'
                          ? 'dssg-btn-primary font-semibold shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      Era IV (AI Era)
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-sans min-h-[90px] flex items-center">
                    {selectedEraTab === 'era1' && activeCoreSkill.manifestationInEra1}
                    {selectedEraTab === 'era2' && activeCoreSkill.manifestationInEra2}
                    {selectedEraTab === 'era3' && activeCoreSkill.manifestationInEra3}
                    {selectedEraTab === 'era4' && activeCoreSkill.manifestationInEra4}
                  </div>
                </div>
              </div>

              {/* AI Immunity Rationale Box */}
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-500/40 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#0056B3] dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[#002D72] dark:text-blue-400 font-semibold">
                    The Algorithmic Immunity Rationale:
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                    {activeCoreSkill.aiImmunityRationale}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
