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
import { Network, Waves, Compass, ShieldCheck, ArrowRightLeft, Globe2, Clock } from 'lucide-react';

export type WidgetId = 'constellation' | 'streamgraph' | 'quadrant' | 'radar' | 'simulator' | 'nations' | 'timeline';

interface VisualLabDashboardProps {
  onInspectSkillInDetail?: (roleName: string) => void;
  activeYear?: number;
  onYearChange?: (year: number) => void;
  activeWidget?: WidgetId;
  onWidgetChange?: (widget: WidgetId) => void;
}

export const VisualLabDashboard: React.FC<VisualLabDashboardProps> = ({
  onInspectSkillInDetail,
  activeYear,
  onYearChange,
  activeWidget: controlledWidget,
  onWidgetChange,
}) => {
  const [internalWidget, setInternalWidget] = useState<WidgetId>('constellation');
  const activeWidget = controlledWidget ?? internalWidget;
  const setActiveWidget = (widget: WidgetId) => {
    setInternalWidget(widget);
    if (onWidgetChange) onWidgetChange(widget);
  };
  const [selectedRole, setSelectedRole] = useState<NetworkRole | null>(null);

  const currentEra = React.useMemo(() => {
    if (!activeYear || activeYear >= 2017) return INDUSTRIAL_ERAS[3];
    if (activeYear >= 1969) return INDUSTRIAL_ERAS[2];
    if (activeYear >= 1870) return INDUSTRIAL_ERAS[1];
    return INDUSTRIAL_ERAS[0];
  }, [activeYear]);

  const tabClass = (isActive: boolean, accent: 'orange' | 'blue' = 'blue') => {
    if (isActive) {
      return accent === 'orange'
        ? 'dssg-btn-secondary shadow-sm'
        : 'dssg-btn-primary shadow-sm';
    }
    return 'text-slate-600 dark:text-slate-300 hover:text-[#002D72] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900';
  };

  return (
    <section
      id="visual-lab"
      className="py-6 sm:py-8 bg-slate-50/70 dark:bg-[#080d18] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Widget Mode Segmented Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white dark:bg-slate-950/85 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 shrink-0 px-1">
            <span className="text-xs font-mono font-bold text-[#002D72] dark:text-white uppercase tracking-wider whitespace-nowrap">
              Interactive Visualization Suite
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveWidget('constellation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all ${tabClass(
                activeWidget === 'constellation',
                'orange'
              )}`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Radial Work Map</span>
            </button>

            <button
              onClick={() => setActiveWidget('streamgraph')}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all ${tabClass(
                activeWidget === 'streamgraph',
                'blue'
              )}`}
            >
              <Waves className="w-3.5 h-3.5" />
              <span>Task Streamgraph</span>
            </button>

            <button
              onClick={() => setActiveWidget('quadrant')}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all ${tabClass(
                activeWidget === 'quadrant',
                'orange'
              )}`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Cognitive Quadrant</span>
            </button>

            <button
              onClick={() => setActiveWidget('radar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all ${tabClass(
                activeWidget === 'radar',
                'blue'
              )}`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Polanyi Radar</span>
            </button>

            <button
              onClick={() => setActiveWidget('nations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all ${tabClass(
                activeWidget === 'nations',
                'blue'
              )}`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>Wealth of Nations Plot</span>
            </button>

            <button
              onClick={() => setActiveWidget('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all ${tabClass(
                activeWidget === 'timeline',
                'orange'
              )}`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Inventions & Unrest Timeline</span>
            </button>

            <button
              onClick={() => setActiveWidget('simulator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all ${tabClass(
                activeWidget === 'simulator',
                'blue'
              )}`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Transition Benchmark</span>
            </button>
          </div>
        </div>

        {/* Dynamic Display of Active Widget */}
        <div>
          {activeWidget === 'constellation' && (
            <SkillConstellationWeb
              onSelectRoleDetailed={(role) => {
                setSelectedRole(role);
                if (onInspectSkillInDetail && selectedRole?.id === role.id) {
                  onInspectSkillInDetail(role.name);
                }
              }}
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
