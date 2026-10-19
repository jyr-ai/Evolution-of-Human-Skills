import React, { useState } from 'react';
import { SkillConstellationWeb } from './SkillConstellationWeb';
import { SkillStreamgraph } from './SkillStreamgraph';
import { CognitivePhysicalQuadrant } from './CognitivePhysicalQuadrant';
import { PolanyiRadarChart } from './PolanyiRadarChart';
import { TransitionNodeBenchmark } from './TransitionNodeBenchmark';
import { WealthOfNationsScatterChart } from './WealthOfNationsScatterChart';
import { InteractiveTimelineExplorer } from './InteractiveTimelineExplorer';
import { INDUSTRIAL_ERAS } from '../data/industrialErasData';
import { NetworkRole } from '../data/skillsNetworkData';
import { Network, Waves, Compass, ShieldCheck, ArrowRightLeft, Sparkles, Globe2, Clock } from 'lucide-react';

interface VisualLabDashboardProps {
  onInspectSkillInDetail?: (roleName: string) => void;
  activeYear?: number;
  onYearChange?: (year: number) => void;
}

export const VisualLabDashboard: React.FC<VisualLabDashboardProps> = ({
  onInspectSkillInDetail,
  activeYear,
  onYearChange,
}) => {
  const [activeWidget, setActiveWidget] = useState<'constellation' | 'streamgraph' | 'quadrant' | 'radar' | 'simulator' | 'nations' | 'timeline'>('constellation');
  const [selectedRole, setSelectedRole] = useState<NetworkRole | null>(null);

  // Pick era matching activeYear
  const currentEra = React.useMemo(() => {
    if (!activeYear || activeYear >= 2017) return INDUSTRIAL_ERAS[3];
    if (activeYear >= 1969) return INDUSTRIAL_ERAS[2];
    if (activeYear >= 1870) return INDUSTRIAL_ERAS[1];
    return INDUSTRIAL_ERAS[0];
  }, [activeYear]);

  return (
    <section id="visual-lab" className="py-6 sm:py-8 bg-[#060a12] border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Widget Mode Segmented Switcher (Zero-pill, high-craft buttons) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#f97316]" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Interactive Visualization Suite
            </span>
          </div>

          {/* Segmented Buttons for the 5 interactive visualization widgets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveWidget('constellation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeWidget === 'constellation'
                  ? 'bg-orange-600 text-white shadow-md ring-1 ring-orange-400/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Radial Work Map</span>
            </button>

            <button
              onClick={() => setActiveWidget('streamgraph')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeWidget === 'streamgraph'
                  ? 'bg-blue-600 text-white shadow-md ring-1 ring-blue-400/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              <span>Task Streamgraph</span>
            </button>

            <button
              onClick={() => setActiveWidget('quadrant')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeWidget === 'quadrant'
                  ? 'bg-amber-600 text-white shadow-md ring-1 ring-amber-400/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Cognitive Quadrant</span>
            </button>

            <button
              onClick={() => setActiveWidget('radar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeWidget === 'radar'
                  ? 'bg-sky-600 text-white shadow-md ring-1 ring-sky-400/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Polanyi Radar</span>
            </button>

            <button
              onClick={() => setActiveWidget('nations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeWidget === 'nations'
                  ? 'bg-emerald-600 text-white shadow-md ring-1 ring-emerald-400/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>Wealth of Nations Plot</span>
            </button>

            <button
              onClick={() => setActiveWidget('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeWidget === 'timeline'
                  ? 'bg-orange-600 text-white shadow-md ring-1 ring-orange-400/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Inventions & Unrest Timeline</span>
            </button>

            <button
              onClick={() => setActiveWidget('simulator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeWidget === 'simulator'
                  ? 'bg-slate-800 text-white shadow-md ring-1 ring-slate-600'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Transition Benchmark</span>
            </button>
          </div>
        </div>

        {/* Dynamic Display of Active Widget (Compact, engaging, no extra scrolling) */}
        <div>
          {activeWidget === 'constellation' && (
            <SkillConstellationWeb
              onSelectRoleDetailed={(role) => setSelectedRole(role)}
              activeYear={activeYear}
              onYearChange={onYearChange}
            />
          )}

          {activeWidget === 'streamgraph' && (
            <SkillStreamgraph
              activeYear={activeYear}
              onYearChange={onYearChange}
            />
          )}

          {activeWidget === 'quadrant' && (
            <CognitivePhysicalQuadrant
              activeYear={activeYear}
            />
          )}

          {activeWidget === 'radar' && <PolanyiRadarChart />}

          {activeWidget === 'nations' && (
            <WealthOfNationsScatterChart eraId={currentEra.id} />
          )}

          {activeWidget === 'timeline' && (
            <InteractiveTimelineExplorer
              currentYear={activeYear}
              onSelectYear={onYearChange}
            />
          )}

          {activeWidget === 'simulator' && (
            <TransitionNodeBenchmark
              transitions={currentEra.transitions}
              eraTitle={currentEra.title}
            />
          )}
        </div>
      </div>
    </section>
  );
};
