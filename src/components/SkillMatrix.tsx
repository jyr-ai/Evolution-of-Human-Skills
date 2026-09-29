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
    <section id="skill-matrix" className="py-12 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono text-orange-400 uppercase tracking-widest mb-1">
              Section B · The Skill Matrix
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Human Skill Breakdown: {eraTitle}
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mt-1">
              Rigorously mapped into three evolutionary trajectories: obsolescent craft, hybrid human-machine adaptations, and emergent technological vocations.
            </p>
          </div>

          {/* Interactive Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skills, crafts, tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls (Segmented Tabs) */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/80 border border-slate-800 rounded-lg mb-8">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              filterCategory === 'all'
                ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>All Trajectories</span>
            <span className="font-mono text-slate-500 tabular-nums">({counts.all})</span>
          </button>

          <button
            onClick={() => setFilterCategory('obsolescent')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              filterCategory === 'obsolescent'
                ? 'bg-orange-950/80 text-orange-200 ring-1 ring-orange-500/60 shadow-sm'
                : 'text-slate-400 hover:text-orange-300'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Obsolescent / Devalued</span>
            <span className="font-mono text-orange-400/70 tabular-nums">({counts.obsolescent})</span>
          </button>

          <button
            onClick={() => setFilterCategory('transformed')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              filterCategory === 'transformed'
                ? 'bg-amber-950/70 text-amber-200 ring-1 ring-amber-500/60 shadow-sm'
                : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Transformed / Adapted</span>
            <span className="font-mono text-amber-400/70 tabular-nums">({counts.transformed})</span>
          </button>

          <button
            onClick={() => setFilterCategory('emergent')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              filterCategory === 'emergent'
                ? 'bg-blue-950/80 text-blue-200 ring-1 ring-blue-500/60 shadow-sm'
                : 'text-slate-400 hover:text-blue-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span>Emergent / High-Demand</span>
            <span className="font-mono text-blue-400/70 tabular-nums">({counts.emergent})</span>
          </button>
        </div>

        {/* Skill Card Grid */}
        {filteredSkills.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
            <Filter className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No skills match the current search or category filter.</p>
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
                  className={`group cursor-pointer p-5 rounded-xl border bg-slate-900/60 hover:bg-slate-900 transition-all flex flex-col justify-between relative shadow-sm hover:shadow-lg ${
                    isObs
                      ? 'border-orange-950/60 hover:border-orange-500/50'
                      : isTrans
                      ? 'border-amber-950/60 hover:border-amber-500/50'
                      : 'border-blue-950/60 hover:border-blue-500/50'
                  }`}
                >
                  <div>
                    {/* Header Zone: Unboxed Metadata */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2 font-mono text-slate-400">
                        <span
                          className={`font-semibold ${
                            isObs ? 'text-orange-400' : isTrans ? 'text-amber-400' : 'text-blue-400'
                          }`}
                        >
                          {isObs && 'Obsolescent'}
                          {isTrans && 'Transformed'}
                          {isEmg && 'Emergent'}
                        </span>
                        <span aria-hidden="true" className="text-slate-600">
                          ·
                        </span>
                        <span>{skill.craftDomain}</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                    </div>

                    {/* Skill Title */}
                    <h3 className="text-base font-semibold text-white group-hover:text-slate-100 transition-colors">
                      {skill.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-300 leading-relaxed mt-2 line-clamp-3">
                      {skill.description}
                    </p>
                  </div>

                  {/* Displacing Tech & Shift */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex items-start gap-1.5">
                      <span className="text-slate-400 font-mono shrink-0">Tech Vector:</span>
                      <span className="text-slate-300 font-sans line-clamp-1">
                        {skill.displacingOrEnablingTech}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                      <span>Dexterity: <strong className="text-slate-300">{skill.dexterityLevel}</strong></span>
                      <span aria-hidden="true" className="text-slate-700">·</span>
                      <span>Cognitive: <strong className="text-slate-300">{skill.cognitiveLoad}</strong></span>
                    </div>
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
