import React, { useState, useEffect } from 'react';
import { Header, NavTab, MainMode } from './components/Header';
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
import { VisualLabDashboard, WidgetId } from './components/VisualLabDashboard';
import { WealthOfNationsScatterChart } from './components/WealthOfNationsScatterChart';
import { InteractiveTimelineExplorer } from './components/InteractiveTimelineExplorer';
import { INDUSTRIAL_ERAS } from './data/industrialErasData';
import { STREAM_DATA } from './data/skillsNetworkData';
import { SkillItem } from './types/history';
import { ArrowUp, BookOpen, Layers, FileSpreadsheet, Code2, GraduationCap } from 'lucide-react';
import { GoogleSheetsIntegrationModal } from './components/GoogleSheetsIntegrationModal';
import { EmbedCodeModal } from './components/EmbedCodeModal';

const VALID_WIDGETS: WidgetId[] = [
  'constellation',
  'streamgraph',
  'quadrant',
  'radar',
  'simulator',
  'nations',
  'timeline',
];

const ERA_DEFAULT_YEARS: Record<string, number> = {
  'era-1': 1815,
  'era-2': 1913,
  'era-3': 1995,
  'era-4': 2024,
};

function getInitialEmbedParams() {
  if (typeof window === 'undefined') {
    return {
      isEmbedded: false,
      hideControls: false,
      initialYear: 2024,
      initialWidget: 'constellation' as WidgetId,
      initialMode: 'visuals' as MainMode,
    };
  }
  const params = new URLSearchParams(window.location.search);
  const isEmbedded = params.get('embed') === 'true';
  const hideControls = params.get('controls') === 'false';
  const widgetParam = params.get('widget') as WidgetId | null;
  const eraParam = params.get('era');
  const yearParam = params.get('year');
  const modeParam = params.get('mode');

  let initialYear = 2024;
  if (eraParam && ERA_DEFAULT_YEARS[eraParam]) {
    initialYear = ERA_DEFAULT_YEARS[eraParam];
  }
  if (yearParam) {
    const parsed = Number(yearParam);
    if (!Number.isNaN(parsed)) {
      initialYear = Math.max(1760, Math.min(2030, Math.round(parsed)));
    }
  }

  const initialWidget: WidgetId =
    widgetParam && VALID_WIDGETS.includes(widgetParam) ? widgetParam : 'constellation';
  const initialMode: MainMode =
    modeParam === 'archive'
      ? 'archive'
      : modeParam === 'bibliography'
      ? 'bibliography'
      : 'visuals';

  return { isEmbedded, hideControls, initialYear, initialWidget, initialMode };
}

export default function App() {
  const initialConfig = React.useMemo(() => getInitialEmbedParams(), []);

  const [currentYear, setCurrentYear] = useState<number>(initialConfig.initialYear);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavTab>('visual-lab');
  const [activeWidget, setActiveWidget] = useState<WidgetId>(initialConfig.initialWidget);
  const [mainMode, setMainMode] = useState<MainMode>(initialConfig.initialMode);
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [isBriefOpen, setIsBriefOpen] = useState<boolean>(false);
  const [isSheetsOpen, setIsSheetsOpen] = useState<boolean>(false);
  const [isEmbedOpen, setIsEmbedOpen] = useState<boolean>(false);
  const isEmbedded = initialConfig.isEmbedded;
  const hideControls = initialConfig.hideControls;

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

  // Two-way iframe postMessage Bridge (Auto-resize & Host Commands)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const notifyHeight = () => {
      if (window.parent !== window) {
        window.parent.postMessage(
          { type: 'RESIZE_FRAME', height: document.documentElement.scrollHeight },
          '*'
        );
      }
    };

    notifyHeight();
    const observer = new ResizeObserver(() => notifyHeight());
    observer.observe(document.body);

    const handleHostMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'SET_YEAR' && typeof data.year === 'number') {
        setCurrentYear(Math.max(1760, Math.min(2030, Math.round(data.year))));
      } else if (data.type === 'SET_ERA' && typeof data.eraId === 'string' && ERA_DEFAULT_YEARS[data.eraId]) {
        setCurrentYear(ERA_DEFAULT_YEARS[data.eraId]);
      } else if (data.type === 'SET_WIDGET' && typeof data.widget === 'string' && VALID_WIDGETS.includes(data.widget as WidgetId)) {
        setMainMode('visuals');
        setActiveWidget(data.widget as WidgetId);
      }
    };

    window.addEventListener('message', handleHostMessage);
    return () => {
      observer.disconnect();
      window.removeEventListener('message', handleHostMessage);
    };
  }, []);

  // Notify host website when user selects a skill dossier
  useEffect(() => {
    if (selectedSkill && typeof window !== 'undefined' && window.parent !== window) {
      window.parent.postMessage(
        {
          type: 'SKILL_SELECTED',
          skillName: selectedSkill.name,
          category: selectedSkill.category,
          eraId: selectedEraId,
        },
        '*'
      );
    }
  }, [selectedSkill, selectedEraId]);

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'visual-lab') {
      setMainMode('visuals');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (tab === 'scholars') {
      setMainMode('bibliography');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setMainMode('archive');
    setTimeout(() => {
      const targetId =
        tab === 'timeline'
          ? 'interactive-timeline'
          : tab === 'matrix'
          ? 'skill-matrix'
          : tab === 'transitions'
          ? 'transition-nodes'
          : tab === 'societal'
          ? 'societal-impact'
          : tab === 'nations'
          ? 'wealth-of-nations'
          : tab === 'synthesis'
          ? 'macro-synthesis'
          : 'era-hero';
      const el = document.getElementById(targetId) || document.getElementById('era-hero');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#0b1120] dark:text-slate-100 flex flex-col font-sans selection:bg-[#F47E2D]/20 selection:text-[#002D72] dark:selection:bg-[#F47E2D]/30 dark:selection:text-orange-200 transition-colors duration-200">
      {/* 3-Zone Top Navigation (hidden when ?embed=true) */}
      {!isEmbedded && (
        <Header
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          onOpenBrief={() => setIsBriefOpen(true)}
          onOpenSheets={() => setIsSheetsOpen(true)}
          onOpenEmbed={() => setIsEmbedOpen(true)}
          mainMode={mainMode}
          onChangeMainMode={(mode) => setMainMode(mode)}
        />
      )}

      {/* Scrubbable Timeline Controller Bar (hidden when ?controls=false or in dedicated Bibliography view) */}
      {!hideControls && mainMode !== 'bibliography' && (
        <TimelineController
          currentYear={currentYear}
          onYearChange={(year) => setCurrentYear(year)}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onOpenFullTimeline={() => handleSelectTab('timeline')}
          isEmbedded={isEmbedded}
        />
      )}

      <main className="flex-1">
        {mainMode === 'bibliography' ? (
          <ScholarReferences
            isStandaloneTab
            onBackToVisuals={() => handleSelectTab('visual-lab')}
            onOpenArchive={() => handleSelectTab('timeline')}
          />
        ) : mainMode === 'visuals' ? (
          /* PRIMARY VISUALIZATION SUITE: DSSG NYC CLEAN BANDS + LIGHT/DARK PARITY */
          <div className="space-y-6">
            <VisualLabDashboard
              activeYear={currentYear}
              onYearChange={(year) => setCurrentYear(year)}
              activeWidget={activeWidget}
              onWidgetChange={(w) => setActiveWidget(w)}
              onInspectSkillInDetail={(name) => {
                const found = currentEra.skills.find((s) => s.name.toLowerCase().includes(name.toLowerCase()));
                if (found) setSelectedSkill(found);
              }}
            />

            {/* Quick Visual Metric Cards with DSSG NYC top accent stripe */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="relative overflow-hidden p-5 rounded-xl bg-white dark:bg-slate-900/75 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl dssg-card-hover text-xs">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#002D72] to-[#0056B3]" />
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-mono text-[11px] mb-1.5">
                    <span>TECHNOLOGY BREAKTHROUGH</span>
                    <span className="text-[#F47E2D] font-semibold">{currentEra.timeframe}</span>
                  </div>
                  <div className="text-base font-serif font-bold text-[#002D72] dark:text-white mb-2">
                    {currentEra.title}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentEra.coreTechnologies.slice(0, 3).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative overflow-hidden p-5 rounded-xl bg-white dark:bg-slate-900/75 border border-slate-200 dark:border-orange-950/60 shadow-sm hover:shadow-xl dssg-card-hover text-xs">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F47E2D] to-[#FF6B35]" />
                  <div className="flex items-center justify-between text-[#F47E2D] font-mono text-[11px] mb-1.5">
                    <span>DISPLACED COHORT</span>
                    <span className="font-bold">SHOCK ZONE</span>
                  </div>
                  <div className="text-base font-serif font-bold text-[#002D72] dark:text-white mb-1.5">
                    {currentEra.macroMetrics.primaryDisplacedTier}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-2">
                    {currentEra.losers[0]?.whyAffected}
                  </p>
                </div>

                <div className="relative overflow-hidden p-5 rounded-xl bg-white dark:bg-slate-900/75 border border-slate-200 dark:border-blue-950/60 shadow-sm hover:shadow-xl dssg-card-hover text-xs">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0056B3] to-[#38bdf8]" />
                  <div className="flex items-center justify-between text-[#0056B3] dark:text-blue-400 font-mono text-[11px] mb-1.5">
                    <span>ASCENDANT COHORT</span>
                    <span className="font-bold">CAPITAL LEVERAGE</span>
                  </div>
                  <div className="text-base font-serif font-bold text-[#002D72] dark:text-white mb-1.5">
                    {currentEra.macroMetrics.primaryAscendantTier}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-2">
                    {currentEra.winners[0]?.whyAffected}
                  </p>
                </div>
              </div>

              {/* Seamless Jump to Full Historical Records, Google Sheets & Embed Buttons */}
              {!isEmbedded && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setIsEmbedOpen(true)}
                    className="px-4 py-2.5 text-xs font-semibold rounded-lg dssg-btn-primary flex items-center gap-2 shadow-sm"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Embed on Website (HTML/CSS/JS)</span>
                  </button>

                  <button
                    onClick={() => setIsSheetsOpen(true)}
                    className="px-4 py-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-700/80 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Google Sheets Sync & Export</span>
                  </button>

                  <button
                    onClick={() => {
                      setMainMode('archive');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2.5 text-xs font-semibold rounded-lg dssg-btn-secondary flex items-center gap-2 shadow-sm"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>View Complete Historical Dossier & Records</span>
                  </button>
                </div>
              )}
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

            {/* Exhaustive Interactive Timeline: Inventions, Reactions, Social Unrest & Policy */}
            <InteractiveTimelineExplorer
              currentYear={currentYear}
              onSelectYear={(year) => setCurrentYear(year)}
            />

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

            {/* Leading Country Chart Explaining Wealth of Nations & GDP at End of Each Era */}
            <div
              id="wealth-of-nations"
              className="py-12 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090f1d] transition-colors duration-200"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-mono font-semibold text-[#F47E2D] uppercase tracking-widest">
                      Section D · Macroeconomic Wealth of Nations
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#002D72] dark:text-white tracking-tight mt-1">
                      Leading Country Matrix: {currentEra.title}
                    </h2>
                  </div>
                  <div className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 self-start sm:self-auto shadow-xs">
                    GDP Scaling · Technological Might vs. Skill Diversity Spectrum
                  </div>
                </div>

                <WealthOfNationsScatterChart eraId={currentEra.id} />
              </div>
            </div>

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

      {/* Google Sheets Live Integration & Export Modal */}
      <GoogleSheetsIntegrationModal
        isOpen={isSheetsOpen}
        onClose={() => setIsSheetsOpen(false)}
      />

      {/* HTML/CSS/JS Embed Code Generator Modal */}
      <EmbedCodeModal
        isOpen={isEmbedOpen}
        onClose={() => setIsEmbedOpen(false)}
        currentWidget={activeWidget}
        currentEraId={selectedEraId}
        currentYear={currentYear}
      />

      {/* DSSG NYC Signature Brand Gradient Footer (hidden when ?embed=true) */}
      {!isEmbedded && (
        <footer className="bg-[linear-gradient(135deg,#002D72_0%,#0056B3_100%)] dark:bg-[linear-gradient(135deg,#071124_0%,#002154_100%)] text-white py-8 px-4 sm:px-6 lg:px-8 border-t border-[#002D72]/20 dark:border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-serif font-bold text-base tracking-tight text-white">
                Evolution of Human Skills
              </span>
              <span className="text-blue-200/70">·</span>
              <span className="text-blue-100/90 font-sans">
                Interactive Industrial Skills Web & Econometric Visualizer
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 font-medium">
              <button
                onClick={() => handleSelectTab('scholars')}
                className="text-blue-100 hover:text-[#F47E2D] transition-colors flex items-center gap-1.5"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Bibliography</span>
              </button>
              <span className="text-blue-300/40">·</span>
              <button
                onClick={() => setIsEmbedOpen(true)}
                className="text-blue-100 hover:text-[#F47E2D] transition-colors flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Embed</span>
              </button>
              <span className="text-blue-300/40">·</span>
              <button
                onClick={() => setIsSheetsOpen(true)}
                className="text-blue-100 hover:text-[#F47E2D] transition-colors flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Google Sheets</span>
              </button>
              <span className="text-blue-300/40">·</span>
              <button
                onClick={() => setIsBriefOpen(true)}
                className="text-blue-100 hover:text-[#F47E2D] transition-colors flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Dataset Export</span>
              </button>
              <span className="text-blue-300/40">·</span>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-white hover:text-[#F47E2D] transition-colors flex items-center gap-1"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Top</span>
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
