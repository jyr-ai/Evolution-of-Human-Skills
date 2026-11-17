import React, { useState, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Flame,
  Zap,
  Cpu,
  Sparkles,
  Lightbulb,
  ShieldAlert,
  Users,
  Scale,
  Building2,
  Calendar,
  MapPin,
  Quote,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { STREAM_DATA } from '../data/skillsNetworkData';
import { HISTORICAL_TIMELINE_EVENTS } from '../data/historicalTimelineData';
import { HistoricalTimelineEvent, TimelineCategory } from '../types/historicalTimeline';
import { useTheme } from '../context/ThemeContext';

interface TimelineControllerProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenFullTimeline?: () => void;
  isEmbedded?: boolean;
}

export const TimelineController: React.FC<TimelineControllerProps> = ({
  currentYear,
  onYearChange,
  isPlaying,
  onTogglePlay,
  isEmbedded = false,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const [hoveredEvent, setHoveredEvent] = useState<HistoricalTimelineEvent | null>(null);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; percent: number } | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<TimelineCategory | 'all'>('all');

  const trackRef = useRef<HTMLDivElement>(null);

  const years = STREAM_DATA.map((d) => d.year);
  const minYear = years[0]; // 1760
  const maxYear = years[years.length - 1]; // 2030

  const filteredEvents = useMemo(() => {
    if (activeCategoryFilter === 'all') return HISTORICAL_TIMELINE_EVENTS;
    return HISTORICAL_TIMELINE_EVENTS.filter((e) => e.category === activeCategoryFilter);
  }, [activeCategoryFilter]);

  const currentData = useMemo(() => {
    return (
      STREAM_DATA.reduce((prev, curr) =>
        Math.abs(curr.year - currentYear) < Math.abs(prev.year - currentYear) ? curr : prev
      ) || STREAM_DATA[0]
    );
  }, [currentYear]);

  const activeEventsAtYear = useMemo(() => {
    return HISTORICAL_TIMELINE_EVENTS.filter((e) => Math.abs(e.year - currentYear) <= 2);
  }, [currentYear]);

  const getEraBadge = (era: number) => {
    switch (era) {
      case 1:
        return {
          label: 'Era I · Steam & Loom (1760-1840)',
          color:
            'text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-500/40 bg-orange-50 dark:bg-orange-950/40',
          icon: <Flame className="w-3.5 h-3.5 text-[#F47E2D]" />,
        };
      case 2:
        return {
          label: 'Era II · Electricity & Line (1870-1914)',
          color:
            'text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/40',
          icon: <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
        };
      case 3:
        return {
          label: 'Era III · Silicon & Internet (1947-2010)',
          color:
            'text-[#002D72] dark:text-blue-300 border-blue-200 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-950/40',
          icon: <Cpu className="w-3.5 h-3.5 text-[#0056B3] dark:text-blue-400" />,
        };
      case 4:
        return {
          label: 'Era IV · Foundation AI (2017-2026+)',
          color:
            'text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-500/40 bg-sky-50 dark:bg-sky-950/40',
          icon: <Sparkles className="w-3.5 h-3.5 text-[#0056B3] dark:text-sky-300" />,
        };
      default:
        return { label: '', color: '', icon: null };
    }
  };

  const getCategoryMeta = (category: TimelineCategory) => {
    switch (category) {
      case 'invention':
        return {
          label: 'Major Invention',
          color:
            'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/15 border-amber-200 dark:border-amber-500/30',
          dotColor: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]',
          icon: <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
        };
      case 'unrest':
        return {
          label: 'Social Unrest & Revolt',
          color:
            'text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/15 border-rose-200 dark:border-rose-500/30',
          dotColor: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />,
        };
      case 'reaction':
        return {
          label: 'Worker Reaction & Strike',
          color:
            'text-orange-800 dark:text-orange-300 bg-orange-50 dark:bg-orange-500/15 border-orange-200 dark:border-orange-500/30',
          dotColor: 'bg-[#F47E2D] shadow-[0_0_8px_rgba(244,126,45,0.75)]',
          icon: <Users className="w-3.5 h-3.5 text-[#F47E2D]" />,
        };
      case 'policy':
        return {
          label: 'Policy & Legislation',
          color:
            'text-[#002D72] dark:text-blue-300 bg-blue-50 dark:bg-blue-500/15 border-blue-200 dark:border-blue-500/30',
          dotColor: 'bg-[#0056B3] dark:bg-blue-400 shadow-[0_0_8px_rgba(0,86,179,0.7)]',
          icon: <Scale className="w-3.5 h-3.5 text-[#0056B3] dark:text-blue-400" />,
        };
      case 'economic':
        return {
          label: 'Market Shock & Panic',
          color:
            'text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-500/15 border-purple-200 dark:border-purple-500/30',
          dotColor: 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.7)]',
          icon: <Building2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />,
        };
      default:
        return {
          label: 'Historical Milestone',
          color: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-500/15 border-slate-200 dark:border-slate-500/30',
          dotColor: 'bg-slate-400',
          icon: <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />,
        };
    }
  };

  const eraInfo = getEraBadge(currentData.era);

  const handleTrackMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = x / rect.width;
    const year = Math.round(minYear + percent * (maxYear - minYear));
    setHoveredYear(year);
    setHoverPosition({ x, percent });

    const closest = filteredEvents.reduce<HistoricalTimelineEvent | null>((best, ev) => {
      const dist = Math.abs(ev.year - year);
      if (!best) return dist <= 5 ? ev : null;
      return dist < Math.abs(best.year - year) ? ev : best;
    }, null);

    setHoveredEvent(closest);
  };

  const handleTrackMouseLeave = () => {
    setHoveredEvent(null);
    setHoveredYear(null);
    setHoverPosition(null);
  };

  const milestoneAnchors = [
    { year: 1764, label: '1764 Spinning Jenny' },
    { year: 1811, label: '1811 Luddites' },
    { year: 1833, label: '1833 Factory Act' },
    { year: 1856, label: '1856 Bessemer Steel' },
    { year: 1886, label: '1886 Haymarket' },
    { year: 1913, label: '1913 Moving Line' },
    { year: 1947, label: '1947 Transistor' },
    { year: 1971, label: '1971 Microchip' },
    { year: 1984, label: '1984 Miners Strike' },
    { year: 2007, label: '2007 iPhone' },
    { year: 2022, label: '2022 ChatGPT' },
    { year: 2023, label: '2023 Hollywood Strike' },
    { year: 2024, label: '2024 EU AI Act & Agents' },
  ];

  return (
    <div
      className={`w-full bg-slate-50/95 dark:bg-[#0b1120]/95 border-y border-slate-200 dark:border-slate-800 py-3 px-4 sm:px-6 shadow-sm dark:shadow-2xl sticky ${
        isEmbedded ? 'top-0' : 'top-16'
      } z-40 backdrop-blur-md transition-colors duration-200`}
    >
      <div className="max-w-7xl mx-auto space-y-2">
        {/* ROW 1: Playback Controls + Current Year + Task HUD + Category Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onYearChange(minYear)}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-[#002D72] dark:hover:text-white hover:border-[#0056B3] transition-colors"
              title="Reset to 1760 (Cottage Craft)"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onTogglePlay}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-sans font-semibold transition-all shadow-sm whitespace-nowrap shrink-0 ${
                isPlaying ? 'dssg-btn-secondary' : 'dssg-btn-primary'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Play Timeline'}</span>
            </button>

            <button
              onClick={() => onYearChange(maxYear)}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-[#002D72] dark:hover:text-white hover:border-[#0056B3] transition-colors"
              title="Jump to 2030 (AI Frontier)"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            {/* Current Active Year Badge */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-950 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-slate-500 dark:text-slate-400">Year:</span>
              <span className="text-base font-bold tabular-nums tracking-wider text-[#F47E2D]">
                {currentYear}
              </span>
            </div>

            {/* Active Era Tag */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-semibold font-sans ${eraInfo.color}`}
            >
              {eraInfo.icon}
              <span>{eraInfo.label}</span>
            </div>
          </div>

          {/* Right: Task Metrics HUD & Quick Filter Toggles */}
          <div className="flex items-center gap-2">
            {/* Live Task Distribution Meters */}
            <div className="hidden lg:flex items-center gap-2.5 bg-white dark:bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px]">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#F47E2D] inline-block" />
                <span className="text-slate-500 dark:text-slate-400">Obsolescent:</span>
                <span className="font-bold text-[#F47E2D] tabular-nums">{currentData.obsolescent}%</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                <span className="text-slate-500 dark:text-slate-400">Transformed:</span>
                <span className="font-bold text-amber-600 dark:text-amber-300 tabular-nums">{currentData.transformed}%</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#0056B3] dark:bg-sky-400 inline-block" />
                <span className="text-slate-500 dark:text-slate-400">Emergent:</span>
                <span className="font-bold text-[#0056B3] dark:text-sky-300 tabular-nums">{currentData.emergent}%</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#002D72] dark:bg-white inline-block shadow-xs" />
                <span className="text-slate-500 dark:text-slate-400">Core:</span>
                <span className="font-bold text-[#002D72] dark:text-white tabular-nums">{currentData.enduring}%</span>
              </div>
            </div>

            {/* Event Category Filter Buttons */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px]">
              <button
                onClick={() => setActiveCategoryFilter('all')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  activeCategoryFilter === 'all'
                    ? 'bg-[#002D72] text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#002D72] dark:hover:text-white'
                }`}
                title="Show all verified historical events"
              >
                All ({HISTORICAL_TIMELINE_EVENTS.length})
              </button>
              <button
                onClick={() => setActiveCategoryFilter('invention')}
                className={`px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
                  activeCategoryFilter === 'invention'
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-600/40 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-300'
                }`}
                title="Major Inventions & Technological Breakthroughs"
              >
                <Lightbulb className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                <span className="hidden sm:inline">Inventions</span>
              </button>
              <button
                onClick={() => setActiveCategoryFilter('unrest')}
                className={`px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
                  activeCategoryFilter === 'unrest'
                    ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-600/40 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-300'
                }`}
                title="Social Unrest, Machine-Breaking, Riots & Rebellions"
              >
                <ShieldAlert className="w-3 h-3 text-rose-500 dark:text-rose-400" />
                <span className="hidden sm:inline">Unrest</span>
              </button>
              <button
                onClick={() => setActiveCategoryFilter('reaction')}
                className={`px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
                  activeCategoryFilter === 'reaction'
                    ? 'bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 border border-orange-300 dark:border-orange-600/40 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#F47E2D]'
                }`}
                title="Worker Strikes, Boycotts & Union Formation"
              >
                <Users className="w-3 h-3 text-[#F47E2D]" />
                <span className="hidden sm:inline">Reactions</span>
              </button>
              <button
                onClick={() => setActiveCategoryFilter('policy')}
                className={`px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
                  activeCategoryFilter === 'policy'
                    ? 'bg-blue-100 dark:bg-blue-950/80 text-[#002D72] dark:text-blue-300 border border-blue-300 dark:border-blue-600/40 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#0056B3] dark:hover:text-blue-300'
                }`}
                title="Landmark Legislation, Acts & Inquiries"
              >
                <Scale className="w-3 h-3 text-[#0056B3] dark:text-blue-400" />
                <span className="hidden sm:inline">Policy</span>
              </button>
            </div>

            {/* Compact Theme Switcher for Embedded Views */}
            {isEmbedded && (
              <button
                onClick={toggleTheme}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#0056B3]"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun className="w-3.5 h-3.5 text-[#F47E2D]" /> : <Moon className="w-3.5 h-3.5 text-[#002D72]" />}
              </button>
            )}
          </div>
        </div>

        {/* ROW 2: SCRUBBABLE TIMELINE TRACK WITH VERIFIED EVENT PINS & DYNAMIC HOVER BOX */}
        <div
          ref={trackRef}
          onMouseMove={handleTrackMouseMove}
          onMouseLeave={handleTrackMouseLeave}
          className="relative pt-1 pb-1 cursor-crosshair select-none"
        >
          {/* Era Color Bands in the Track Background */}
          <div className="absolute top-3.5 left-0 right-0 h-2.5 rounded-full overflow-hidden flex opacity-55 dark:opacity-45 pointer-events-none">
            <div className="bg-[#F47E2D] h-full" style={{ width: '29.6%' }} title="Era I (1760-1840)" />
            <div className="bg-amber-500 h-full" style={{ width: '27.4%' }} title="Era II (1870-1914)" />
            <div className="bg-[#0056B3] h-full" style={{ width: '26.7%' }} title="Era III (1947-2010)" />
            <div className="bg-[#002D72] dark:bg-sky-400 h-full" style={{ width: '16.3%' }} title="Era IV (2017-2026+)" />
          </div>

          {/* Main Range Slider Input */}
          <input
            type="range"
            min={minYear}
            max={maxYear}
            step={1}
            value={currentYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="w-full h-2.5 bg-transparent rounded-lg appearance-none cursor-pointer accent-[#F47E2D] relative z-20 focus:outline-none"
          />

          {/* FACT-CHECKED HISTORICAL EVENT PINS ON THE TIMELINE */}
          <div className="absolute top-2.5 left-0 right-0 h-4 pointer-events-none z-10">
            {filteredEvents.map((ev) => {
              const leftPercent = ((ev.year - minYear) / (maxYear - minYear)) * 100;
              const isEventActive = Math.abs(currentYear - ev.year) <= 1;
              const isHovered = hoveredEvent?.id === ev.id;
              const meta = getCategoryMeta(ev.category);

              return (
                <div
                  key={ev.id}
                  style={{ left: `${leftPercent}%` }}
                  className="absolute -translate-x-1/2 -top-0.5 flex flex-col items-center group/pin"
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full border border-white dark:border-slate-950 transition-all ${
                      meta.dotColor
                    } ${
                      isHovered || isEventActive
                        ? 'scale-150 ring-2 ring-[#002D72] dark:ring-white z-30'
                        : 'opacity-90 hover:opacity-100 hover:scale-125'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* DYNAMIC HOVER BOX AS THE USER HOVERS OVER THE TIMELINE */}
          {hoverPosition && (
            <div
              style={{
                left: `${Math.max(12, Math.min(88, hoverPosition.percent * 100))}%`,
              }}
              className="absolute top-8 -translate-x-1/2 z-50 pointer-events-auto transition-transform duration-75 ease-out"
            >
              {/* Hover Box Content Card */}
              <div className="w-[330px] sm:w-[380px] bg-white/95 dark:bg-[#0b1220]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-2xl text-slate-800 dark:text-slate-100 text-xs space-y-2.5 ring-1 ring-[#002D72]/10 dark:ring-orange-500/20">
                {hoveredEvent ? (
                  <>
                    <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                      <div className="flex items-center gap-1.5 text-[#F47E2D] font-mono font-bold text-sm">
                        <Calendar className="w-4 h-4 text-[#F47E2D]" />
                        <span>{hoveredEvent.exactDate}</span>
                      </div>

                      <div
                        className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase border ${
                          getCategoryMeta(hoveredEvent.category).color
                        }`}
                      >
                        {getCategoryMeta(hoveredEvent.category).icon}
                        <span>{getCategoryMeta(hoveredEvent.category).label}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-serif font-bold text-[#002D72] dark:text-white leading-snug">
                        {hoveredEvent.title}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{hoveredEvent.location}</span>
                      </div>
                    </div>

                    <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/80 p-2 rounded border border-slate-200 dark:border-slate-800">
                      {hoveredEvent.headline}
                    </p>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                      {hoveredEvent.description}
                    </p>

                    <div className="bg-orange-50 dark:bg-orange-950/25 border border-orange-200 dark:border-orange-500/30 rounded p-2 text-[10px]">
                      <span className="font-mono font-bold text-[#F47E2D] uppercase tracking-wider block mb-0.5">
                        Labor & Skill Impact:
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">{hoveredEvent.laborSkillImpact}</span>
                    </div>

                    {hoveredEvent.keyFigures.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pt-0.5">
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mr-1">Figures:</span>
                        {hoveredEvent.keyFigures.map((fig, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-700 dark:text-slate-300 font-mono"
                          >
                            {fig}
                          </span>
                        ))}
                      </div>
                    )}

                    {hoveredEvent.primarySourceQuote && (
                      <div className="border border-slate-200 dark:border-slate-800 text-[10px] italic text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-2 rounded-lg">
                        <div className="flex items-start gap-1.5">
                          <Quote className="w-3 h-3 text-[#F47E2D] shrink-0 mt-0.5" />
                          <div>
                            "{hoveredEvent.primarySourceQuote.text}"
                            <div className="text-[9px] font-mono not-italic text-slate-500 dark:text-slate-400 text-right mt-0.5">
                              — {hoveredEvent.primarySourceQuote.author} ({hoveredEvent.primarySourceQuote.year})
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => onYearChange(hoveredEvent.year)}
                      className="w-full mt-1 py-1.5 dssg-btn-secondary rounded font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>Jump Scrubber to Year {hoveredEvent.year}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="p-1 space-y-2 text-center">
                    <div className="text-sm font-mono font-bold text-[#F47E2D]">
                      Hovering Year: {hoveredYear}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] font-sans">
                      Move closer to colored dots to inspect fact-checked inventions, strikes, machine-wrecking rebellions, and legislation.
                    </p>
                    <button
                      onClick={() => hoveredYear && onYearChange(hoveredYear)}
                      className="py-1 px-3 bg-[#002D72] hover:bg-[#0056B3] text-white rounded text-[10px] font-mono transition-colors"
                    >
                      Set Timeline to {hoveredYear}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Jump Timeline Anchor Labels */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-1.5 overflow-x-auto scrollbar-none gap-2">
            {milestoneAnchors.map((m) => {
              const isSelected = Math.abs(currentYear - m.year) < 3;
              return (
                <button
                  key={m.year}
                  onClick={() => onYearChange(m.year)}
                  className={`transition-colors whitespace-nowrap hover:text-[#002D72] dark:hover:text-white ${
                    isSelected ? 'text-[#F47E2D] font-bold underline' : ''
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ROW 3: REAL-TIME CONTEXT TICKER FOR CURRENT YEAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-[#F47E2D] uppercase tracking-wider font-bold shrink-0">
              Verified Shock at {currentData.year}:
            </span>
            <span className="truncate text-slate-800 dark:text-slate-200 font-medium">{currentData.shockEvent}</span>
          </div>

          {activeEventsAtYear.length > 0 ? (
            <div className="flex items-center gap-1.5 shrink-0 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-500/30 text-[10px]">
              <Lightbulb className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>
                {activeEventsAtYear[0].title} ({activeEventsAtYear[0].exactDate})
              </span>
            </div>
          ) : (
            <div className="text-[10px] text-slate-500 hidden md:block">
              Hover along timeline bar to inspect fact-checked inventions, strikes & laws
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
