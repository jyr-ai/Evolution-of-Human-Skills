import React, { useState, useMemo } from 'react';
import { SkillItem, SkillCategory } from '../types/history';
import { Search, Flame, RefreshCw, Zap, ArrowUpRight, Filter } from 'lucide-react';

interface SkillMatrixProps {
  skills: SkillItem[];
  eraTitle: string;
  onSelectSkill: (skill: SkillItem) => void;
}

export const SkillMatrix: React.FC<SkillMatrixProps> = ({ skills, eraTitle, onSelectSkill }) => {
  const [filterCategory, setFilterCategory] = useState<'all' | SkillCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSkills = useMemo(() => {
    return skills.filter((item) => {
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.craftDomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.displacingOrEnablingTech.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [skills, filterCategory, searchQuery]);

  // Group counts for segmented buttons
  const counts = useMemo(() => {
    return {
      all: skills.length,
      obsolescent: skills.filter((s) => s.category === 'obsolescent').length,
      transformed: skills.filter((s) => s.category === 'transformed').length,
      emergent: skills.filter((s) => s.category === 'emergent').length,
    };
  }, [skills]);

  return (
    <section
      id="skill-matrix"
      className="py-12 bg-white dark:bg-[#0b1120] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono font-semibold text-[#F47E2D] uppercase tracking-widest mb-1">
              Section B · The Skill Matrix
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#002D72] dark:text-white tracking-tight text-balance">
              Human Skill Breakdown: {eraTitle}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mt-1">
              Rigorously mapped into three evolutionary trajectories: obsolescent craft, hybrid human-machine adaptations, and emergent technological vocations.
            </p>
          </div>

          {/* Interactive Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skills, crafts, tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-12 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0056B3]/40 focus:border-[#0056B3] transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-[#002D72] dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls (Segmented Tabs) */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl mb-8">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              filterCategory === 'all'
                ? 'bg-white dark:bg-slate-800 text-[#002D72] dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span>All Trajectories</span>
            <span className="font-mono text-slate-400 dark:text-slate-500 tabular-nums">({counts.all})</span>
          </button>

          <button
            onClick={() => setFilterCategory('obsolescent')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              filterCategory === 'obsolescent'
                ? 'bg-orange-50 dark:bg-orange-950/80 text-[#c2410c] dark:text-orange-200 ring-1 ring-[#F47E2D]/50 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#F47E2D] dark:hover:text-orange-300'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#F47E2D] dark:text-orange-400" />
            <span>Obsolescent / Devalued</span>
            <span className="font-mono text-[#F47E2D] dark:text-orange-400/80 tabular-nums">({counts.obsolescent})</span>
          </button>

          <button
            onClick={() => setFilterCategory('transformed')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              filterCategory === 'transformed'
                ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 ring-1 ring-amber-500/50 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-300'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Transformed / Adapted</span>
            <span className="font-mono text-amber-600 dark:text-amber-400/80 tabular-nums">({counts.transformed})</span>
          </button>

          <button
            onClick={() => setFilterCategory('emergent')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              filterCategory === 'emergent'
                ? 'bg-blue-50 dark:bg-blue-950/80 text-[#002D72] dark:text-blue-200 ring-1 ring-[#0056B3]/50 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#0056B3] dark:hover:text-blue-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#0056B3] dark:text-blue-400" />
            <span>Emergent / High-Demand</span>
            <span className="font-mono text-[#0056B3] dark:text-blue-400/80 tabular-nums">({counts.emergent})</span>
          </button>
        </div>

        {/* Skill Card Grid */}
        {filteredSkills.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
            <Filter className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No skills match the current search or category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSkills.map((skill) => {
              const isObs = skill.category === 'obsolescent';
              const isTrans = skill.category === 'transformed';
              const isEmg = skill.category === 'emergent';

              return (
                <div
                  key={skill.id}
                  onClick={() => onSelectSkill(skill)}
                  className={`group cursor-pointer p-5 rounded-xl border bg-slate-50/70 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 transition-all flex flex-col justify-between relative overflow-hidden shadow-xs hover:shadow-xl dssg-card-hover ${
                    isObs
                      ? 'border-slate-200 dark:border-orange-950/60 hover:border-[#F47E2D]/70 dark:hover:border-orange-500/50'
                      : isTrans
                      ? 'border-slate-200 dark:border-amber-950/60 hover:border-amber-500/70 dark:hover:border-amber-500/50'
                      : 'border-slate-200 dark:border-blue-950/60 hover:border-[#0056B3]/70 dark:hover:border-blue-500/50'
                  }`}
                >
                  {/* Top DSSG category accent line */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 ${
                      isObs
                        ? 'bg-gradient-to-r from-[#F47E2D] to-[#FF6B35]'
                        : isTrans
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                        : 'bg-gradient-to-r from-[#002D72] to-[#0056B3]'
                    }`}
                  />

                  <div className="pt-1">
                    {/* Header Zone: Unboxed Metadata */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2 font-mono text-slate-500 dark:text-slate-400">
                        <span
                          className={`font-semibold ${
                            isObs
                              ? 'text-[#F47E2D]'
                              : isTrans
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-[#0056B3] dark:text-blue-400'
                          }`}
                        >
                          {isObs && 'Obsolescent'}
                          {isTrans && 'Transformed'}
                          {isEmg && 'Emergent'}
                        </span>
                        <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
                          ·
                        </span>
                        <span className="truncate max-w-[160px]">{skill.craftDomain}</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-[#002D72] dark:group-hover:text-white transition-colors shrink-0" />
                    </div>

                    {/* Skill Title */}
                    <h3 className="text-base font-serif font-bold text-[#002D72] dark:text-white group-hover:text-[#0056B3] dark:group-hover:text-slate-100 transition-colors">
                      {skill.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2 line-clamp-3">
                      {skill.description}
                    </p>
                  </div>

                  {/* Displacing Tech & Shift */}
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex items-start gap-1.5">
                      <span className="text-slate-500 dark:text-slate-400 font-mono shrink-0">Tech Vector:</span>
                      <span className="text-slate-700 dark:text-slate-300 font-sans line-clamp-1">
                        {skill.displacingOrEnablingTech}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1">
                      <span>
                        Dexterity: <strong className="text-slate-800 dark:text-slate-200">{skill.dexterityLevel}</strong>
                      </span>
                      <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                      <span>
                        Cognitive: <strong className="text-slate-800 dark:text-slate-200">{skill.cognitiveLoad}</strong>
                      </span>
                    </div>

                    {skill.workforcePrevalence && (
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-slate-800/60 text-[10px] font-mono">
                        <span className="text-slate-500 dark:text-slate-400">
                          Est. Workforce:{' '}
                          <strong className="text-[#002D72] dark:text-white tabular-nums">
                            {skill.workforcePrevalence.percentage}%
                          </strong>
                        </span>
                        <span className="text-[#0056B3] dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                          Open Dossier →
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
