import React from 'react';
import { SCHOLAR_CITATIONS } from '../data/synthesisData';
import { BookOpen, GraduationCap, ExternalLink, Bookmark } from 'lucide-react';

export const ScholarReferences: React.FC = () => {
  return (
    <section id="scholar-references" className="py-12 border-b border-slate-800 bg-[#080c14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-widest mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Economic History & Scholarly Grounding</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Academic Bibliography & Research Grounding
          </h2>
          <p className="text-sm text-slate-400 max-w-3xl mt-1">
            Grounded in peer-reviewed economic history and labor economics literature mapping technological displacement, skill-biased change, and the task-based framework.
          </p>
        </div>

        {/* Citations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SCHOLAR_CITATIONS.map((citation, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span className="font-semibold text-slate-300">{citation.author}</span>
                  <span className="tabular-nums">({citation.year})</span>
                </div>

                <h3 className="text-sm font-serif font-bold text-white leading-snug">
                  "{citation.title}"
                </h3>

                <div className="text-xs text-blue-400/90 font-mono mt-1">
                  {citation.journal}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider block">
                  Core Theoretical Takeaway:
                </span>
                <p className="leading-relaxed font-sans text-slate-300">
                  {citation.keyTakeaway}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
