import React, { useState, useEffect } from 'react';
import { Header, NavTab } from './components/Header';
import { TimelineController } from './components/TimelineController';
import { TimelineNav } from './components/TimelineNav';
import { EraHero } from './components/EraHero';
import { SkillMatrix } from './components/SkillMatrix';
import { TransitionNodeBenchmark } from './components/TransitionNodeBenchmark';
import { WinnersLosersSection } from './components/WinnersLosersSection';
import { MacroSynthesis } from './components/MacroSynthesis';
import { CrossEraComparison } from './components/CrossEraComparison';
import { ScholarReferences } from './components/ScholarReferences';
import { SkillDetailModal } from './components/SkillDetailModal';
import { ResearchBriefModal } from './components/ResearchBriefModal';
import { VisualLabDashboard } from './components/VisualLabDashboard';
import { INDUSTRIAL_ERAS } from './data/industrialErasData';
import { STREAM_DATA } from './data/skillsNetworkData';
import { SkillItem } from './types/history';
import { ArrowUp, BookOpen, Network, Layers, Sparkles } from 'lucide-react';

export default function App() {
  const [currentYear, setCurrentYear] = useState<number>(2024);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavTab>('visual-lab');
  const [mainMode, setMainMode] = useState<'visuals' | 'archive'>('visuals');
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [isBriefOpen, setIsBriefOpen] = useState<boolean>(false);

  // Derive current era from currentYear
  const selectedEraId = React.useMemo(() => {
    if (currentYear >= 2017) return 'era-4';
    if (currentYear >= 1969) return 'era-3';
    if (currentYear >= 1870) return 'era-2';
    return 'era-1';
  }, [currentYear]);

  const currentEra = INDUSTRIAL_ERAS.find((era) => era.id === selectedEraId) || INDUSTRIAL_ERAS[3];

  // Timeline Autoplay Engine
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentYear((prev) => {
        // Find next milestone year or loop
        const years = STREAM_DATA.map((d) => d.year);
        const currentIndex = years.indexOf(prev);
        if (currentIndex === -1 || currentIndex === years.length - 1) {
          return years[0];
        }
        return years[currentIndex + 1];
      });
    }, 2400);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'visual-lab') {
      setMainMode('visuals');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setMainMode('archive');
      if (tab === 'timeline') {
        const el = document.getElementById('era-hero');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (tab === 'matrix') {
        const el = document.getElementById('skill-matrix');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (tab === 'transitions') {
        const el = document.getElementById('transition-nodes');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (tab === 'societal') {
        const el = document.getElementById('societal-impact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (tab === 'synthesis') {
        const el = document.getElementById('macro-synthesis');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (tab === 'scholars') {
        const el = document.getElementById('scholar-references');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* 3-Zone Top Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenBrief={() => setIsBriefOpen(true)}
        mainMode={mainMode}
        onChangeMainMode={(mode) => setMainMode(mode)}
      />

      {/* Scrubbable Timeline Controller Bar (Input Timeline directly at the top) */}
      <TimelineController
        currentYear={currentYear}
        onYearChange={(year) => setCurrentYear(year)}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
      />

      <main className="flex-1">
        {mainMode === 'visuals' ? (
          /* PRIMARY VISUALIZATION SUITE: LESS WORDS, LESS SCROLLING, MORE ENGAGING WIDGETS */
          <div className="space-y-6">
            <VisualLabDashboard
              activeYear={currentYear}
              onYearChange={(year) => setCurrentYear(year)}
              onInspectSkillInDetail={(name) => {
                const found = currentEra.skills.find((s) => s.name.toLowerCase().includes(name.toLowerCase()));
                if (found) setSelectedSkill(found);
              }}
            />

            {/* Quick Visual Metric Cards (Minimal Words, Maximum Graphical Density) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] mb-1">
                    <span>TECHNOLOGY BREAKTHROUGH</span>
                    <span className="text-orange-400">{currentEra.timeframe}</span>
                  </div>
                  <div className="text-sm font-serif font-bold text-white mb-1">
                    {currentEra.title}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentEra.coreTechnologies.slice(0, 3).map((tech, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/70 border border-orange-950/60 text-xs">
                  <div className="flex items-center justify-between text-orange-400 font-mono text-[11px] mb-1">
                    <span>DISPLACED COHORT</span>
                    <span className="text-orange-300 font-bold">SHOCK ZONE</span>
                  </div>
                  <div className="text-sm font-serif font-bold text-white mb-1">
                    {currentEra.macroMetrics.primaryDisplacedTier}
                  </div>
                  <p className="text-slate-400 text-[11px] line-clamp-2">
                    {currentEra.losers[0]?.whyAffected}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/70 border border-blue-950/60 text-xs">
                  <div className="flex items-center justify-between text-blue-400 font-mono text-[11px] mb-1">
                    <span>ASCENDANT COHORT</span>
                    <span className="text-blue-300 font-bold">CAPITAL LEVERAGE</span>
                  </div>
                  <div className="text-sm font-serif font-bold text-white mb-1">
                    {currentEra.macroMetrics.primaryAscendantTier}
                  </div>
                  <p className="text-slate-400 text-[11px] line-clamp-2">
                    {currentEra.winners[0]?.whyAffected}
                  </p>
                </div>
              </div>

              {/* Seamless Jump to Full Historical Records Button */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => {
                    setMainMode('archive');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  <span>View Complete Historical Dossier & Records (Long-form)</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* DEEP HISTORICAL DOSSIER & ARCHIVE VIEW */
          <div>
            {/* Era Timeline Selector */}
            <TimelineNav
              eras={INDUSTRIAL_ERAS}
              selectedEraId={selectedEraId}
              onSelectEra={(id) => {
                const found = INDUSTRIAL_ERAS.find((e) => e.id === id);
                if (found) {
                  if (found.number === 1) setCurrentYear(1815);
                  if (found.number === 2) setCurrentYear(1914);
                  if (found.number === 3) setCurrentYear(1985);
                  if (found.number === 4) setCurrentYear(2024);
                }
              }}
            />

            <div id="era-hero">
              <EraHero
                era={currentEra}
                onExploreSkills={() => handleSelectTab('matrix')}
                onExploreTransitions={() => handleSelectTab('transitions')}
              />
            </div>

            <SkillMatrix
              skills={currentEra.skills}
              eraTitle={currentEra.title}
              onSelectSkill={(skill) => setSelectedSkill(skill)}
            />

            <TransitionNodeBenchmark
              transitions={currentEra.transitions}
              eraTitle={currentEra.title}
            />

            <WinnersLosersSection
              losers={currentEra.losers}
              winners={currentEra.winners}
              eraTitle={currentEra.title}
            />

            <CrossEraComparison
              onSelectEra={(id) => {
                const found = INDUSTRIAL_ERAS.find((e) => e.id === id);
                if (found) {
                  if (found.number === 1) setCurrentYear(1815);
                  if (found.number === 2) setCurrentYear(1914);
                  if (found.number === 3) setCurrentYear(1985);
                  if (found.number === 4) setCurrentYear(2024);
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <MacroSynthesis />

            <ScholarReferences />
          </div>
        )}
      </main>

      {/* Detail Inspection Modal for Skills */}
      <SkillDetailModal
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
      />

      {/* Full Research Brief & Dataset Export Modal */}
      <ResearchBriefModal
        isOpen={isBriefOpen}
        onClose={() => setIsBriefOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#060910] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-slate-300">The Great Displacement</span>
            <span className="text-slate-600">·</span>
            <span>Interactive Industrial Skills Web & Econometric Visualizer</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsBriefOpen(true)}
              className="text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Dataset Export</span>
            </button>
            <span className="text-slate-600">·</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Top</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
