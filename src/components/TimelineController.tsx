import React, { useState, useRef, useMemo, useEffect } from 'react';
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
  Layers,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { STREAM_DATA } from '../data/skillsNetworkData';
import { HISTORICAL_TIMELINE_EVENTS } from '../data/historicalTimelineData';
import { HistoricalTimelineEvent, TimelineCategory } from '../types/historicalTimeline';

interface TimelineControllerProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenFullTimeline?: () => void;
}

export const TimelineController: React.FC<TimelineControllerProps> = ({
  currentYear,
  onYearChange,
  isPlaying,
  onTogglePlay,
  onOpenFullTimeline,
}) => {
  const [hoveredEvent, setHoveredEvent] = useState<HistoricalTimelineEvent | null>(null);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; percent: number } | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<TimelineCategory | 'all'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);

  const years = STREAM_DATA.map((d) => d.year);
  const minYear = years[0]; // 1760
  const maxYear = years[years.length - 1]; // 2030

  // Filtered timeline events
  const filteredEvents = useMemo(() => {
    if (activeCategoryFilter === 'all') return HISTORICAL_TIMELINE_EVENTS;
    return HISTORICAL_TIMELINE_EVENTS.filter((e) => e.category === activeCategoryFilter);
  }, [activeCategoryFilter]);

  // Find closest stream data point for current stats
  const currentData = useMemo(() => {
    return (
      STREAM_DATA.reduce((prev, curr) =>
        Math.abs(curr.year - currentYear) < Math.abs(prev.year - currentYear) ? curr : prev
      ) || STREAM_DATA[0]
    );
  }, [currentYear]);

  // Find verified historical events at or nearest current active year
  const activeEventsAtYear = useMemo(() => {
    return HISTORICAL_TIMELINE_EVENTS.filter((e) => Math.abs(e.year - currentYear) <= 2);
  }, [currentYear]);

  const getEraBadge = (era: number) => {
    switch (era) {
      case 1:
        return {
          label: 'Era I · Steam & Loom (1760-1840)',
          color: 'text-orange-400 border-orange-500/40 bg-orange-950/40',
          icon: <Flame className="w-3.5 h-3.5 text-orange-400" />,
        };
      case 2:
        return {
          label: 'Era II · Electricity & Line (1870-1914)',
          color: 'text-amber-400 border-amber-500/40 bg-amber-950/40',
          icon: <Zap className="w-3.5 h-3.5 text-amber-400" />,
        };
      case 3:
        return {
          label: 'Era III · Silicon & Internet (1947-2010)',
          color: 'text-blue-400 border-blue-500/40 bg-blue-950/40',
          icon: <Cpu className="w-3.5 h-3.5 text-blue-400" />,
        };
      case 4:
        return {
          label: 'Era IV · Foundation AI (2017-2026+)',
          color: 'text-sky-300 border-sky-500/40 bg-sky-950/40',
          icon: <Sparkles className="w-3.5 h-3.5 text-sky-300" />,
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
          color: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
          dotColor: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
          icon: <Lightbulb className="w-3.5 h-3.5 text-amber-400" />,
        };
      case 'unrest':
        return {
          label: 'Social Unrest & Revolt',
          color: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
          dotColor: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />,
        };
      case 'reaction':
        return {
          label: 'Worker Reaction & Strike',
          color: 'text-orange-400 bg-orange-500/15 border-orange-500/30',
          dotColor: 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]',
          icon: <Users className="w-3.5 h-3.5 text-orange-400" />,
        };
      case 'policy':
        return {
          label: 'Policy & Legislation',
          color: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
          dotColor: 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]',
          icon: <Scale className="w-3.5 h-3.5 text-blue-400" />,
        };
      case 'economic':
        return {
          label: 'Market Shock & Panic',
          color: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
          dotColor: 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]',
          icon: <Building2 className="w-3.5 h-3.5 text-purple-400" />,
        };
      default:
        return {
          label: 'Historical Milestone',
          color: 'text-slate-400 bg-slate-500/15 border-slate-500/30',
          dotColor: 'bg-slate-400',
          icon: <Calendar className="w-3.5 h-3.5 text-slate-400" />,
        };
    }
  };

  const eraInfo = getEraBadge(currentData.era);

  // Track hover handling
  const handleTrackMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = x / rect.width;
    const year = Math.round(minYear + percent * (maxYear - minYear));
    setHoveredYear(year);
    setHoverPosition({ x, percent });

    // Find closest event within ±4 years
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

  // Milestone quick jump pins
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
    <div className="w-full bg-[#080d18] border-y border-slate-800 py-3 px-4 sm:px-6 shadow-2xl sticky top-16 z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto space-y-2">
        {/* ROW 1: Playback Controls + Current Year + Task HUD + Category Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          {/* Left: Controls & Current Year */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onYearChange(minYear)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset to 1760 (Cottage Craft)"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onTogglePlay}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all shadow-md ${
                isPlaying
                  ? 'bg-orange-600 text-white ring-1 ring-orange-400'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Play Timeline'}</span>
            </button>

            <button
              onClick={() => onYearChange(maxYear)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Jump to 2030 (AI Frontier)"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            {/* Current Active Year Badge */}
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 shadow-inner">
              <span className="text-slate-400">Year:</span>
              <span className="text-base font-bold text-white tabular-nums tracking-wider text-orange-400">
                {currentYear}
              </span>
            </div>

            {/* Active Era Tag */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-bold ${eraInfo.color}`}
            >
              {eraInfo.icon}
              <span>{eraInfo.label}</span>
            </div>
          </div>

          {/* Right: Task Metrics HUD & Quick Filter Toggles */}
          <div className="flex items-center gap-2">
            {/* Live Task Distribution Meters */}
            <div className="hidden lg:flex items-center gap-2.5 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-800/80 text-[11px]">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                <span className="text-slate-400">Obsolescent:</span>
                <span className="font-bold text-orange-400 tabular-nums">{currentData.obsolescent}%</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                <span className="text-slate-400">Transformed:</span>
                <span className="font-bold text-amber-300 tabular-nums">{currentData.transformed}%</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
                <span className="text-slate-400">Emergent:</span>
                <span className="font-bold text-sky-300 tabular-nums">{currentData.emergent}%</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-white inline-block shadow-sm" />
                <span className="text-slate-400">Core:</span>
                <span className="font-bold text-white tabular-nums">{currentData.enduring}%</span>
              </div>
            </div>

            {/* Event Category Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px]">
              <button
                onClick={() => setActiveCategoryFilter('all')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  activeCategoryFilter === 'all'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Show all verified historical events"
              >
                All ({HISTORICAL_TIMELINE_EVENTS.length})
              </button>
              <button
                onClick={() => setActiveCategoryFilter('invention')}
                className={`px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
                  activeCategoryFilter === 'invention'
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-600/40 font-bold'
                    : 'text-slate-400 hover:text-amber-300'
                }`}
                title="Major Inventions & Technological Breakthroughs"
              >
                <Lightbulb className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">Inventions</span>
              </button>
              <button
                onClick={() => setActiveCategoryFilter('unrest')}
                className={`px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
                  activeCategoryFilter === 'unrest'
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-600/40 font-bold'
                    : 'text-slate-400 hover:text-rose-300'
                }`}
                title="Social Unrest, Machine-Breaking, Riots & Rebellions"
              >
                <ShieldAlert className="w-3 h-3 text-rose-400" />
                <span className="hidden sm:inline">Unrest</span>
              </button>
              <button
                onClick={() => setActiveCategoryFilter('reaction')}
                className={`px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
                  activeCategoryFilter === 'reaction'
                    ? 'bg-orange-950/80 text-orange-300 border border-orange-600/40 font-bold'
                    : 'text-slate-400 hover:text-orange-300'
                }`}
                title="Worker Strikes, Boycotts & Union Formation"
              >
                <Users className="w-3 h-3 text-orange-400" />
                <span className="hidden sm:inline">Reactions</span>
              </button>
              <button
                onClick={() => setActiveCategoryFilter('policy')}
                className={`px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
                  activeCategoryFilter === 'policy'
                    ? 'bg-blue-950/80 text-blue-300 border border-blue-600/40 font-bold'
                    : 'text-slate-400 hover:text-blue-300'
                }`}
                title="Landmark Legislation, Acts & Inquiries"
              >
                <Scale className="w-3 h-3 text-blue-400" />
                <span className="hidden sm:inline">Policy</span>
              </button>
            </div>
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
          <div className="absolute top-3.5 left-0 right-0 h-2.5 rounded-full overflow-hidden flex opacity-40 pointer-events-none">
            <div className="bg-orange-600 h-full" style={{ width: '29.6%' }} title="Era I (1760-1840)" />
            <div className="bg-amber-600 h-full" style={{ width: '27.4%' }} title="Era II (1870-1914)" />
            <div className="bg-blue-600 h-full" style={{ width: '26.7%' }} title="Era III (1947-2010)" />
            <div className="bg-sky-500 h-full" style={{ width: '16.3%' }} title="Era IV (2017-2026+)" />
          </div>

          {/* Main Range Slider Input */}
          <input
            type="range"
            min={minYear}
            max={maxYear}
            step={1}
            value={currentYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="w-full h-2.5 bg-transparent rounded-lg appearance-none cursor-pointer accent-orange-500 relative z-20 focus:outline-none"
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
                    className={`w-2.5 h-2.5 rounded-full border border-slate-950 transition-all ${
                      meta.dotColor
                    } ${
                      isHovered || isEventActive
                        ? 'scale-150 ring-2 ring-white z-30'
                        : 'opacity-85 hover:opacity-100 hover:scale-125'
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
              {/* Pointer Triangle */}
              <div className="w-0 h-0 border-x-6 border-x-transparent border-b-6 border-b-slate-800 mx-auto" />

              {/* Hover Box Content Card */}
              <div className="w-[330px] sm:w-[380px] bg-[#0b1220]/95 backdrop-blur-xl border border-slate-700 rounded-xl p-4 shadow-2xl text-slate-100 text-xs space-y-2.5 ring-1 ring-orange-500/20">
                {hoveredEvent ? (
                  <>
                    {/* Header Row: Date & Category Tag */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-1.5 text-orange-400 font-mono font-bold text-sm">
                        <Calendar className="w-4 h-4 text-orange-400" />
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

                    {/* Event Title & Location */}
                    <div>
                      <h4 className="text-sm font-serif font-bold text-white leading-snug">
                        {hoveredEvent.title}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{hoveredEvent.location}</span>
                      </div>
                    </div>

                    {/* Headline Punchline */}
                    <p className="text-[11px] font-semibold text-slate-200 bg-slate-900/80 p-2 rounded border border-slate-800">
                      {hoveredEvent.headline}
                    </p>

                    {/* Detailed Fact-Checked Description */}
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {hoveredEvent.description}
                    </p>

                    {/* Labor & Skill Impact */}
                    <div className="bg-orange-950/25 border border-orange-500/30 rounded p-2 text-[10px]">
                      <span className="font-mono font-bold text-orange-300 uppercase tracking-wider block mb-0.5">
                        Labor & Skill Impact:
                      </span>
                      <span className="text-slate-300">{hoveredEvent.laborSkillImpact}</span>
                    </div>

                    {/* Key Historical Figures */}
                    {hoveredEvent.keyFigures.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pt-0.5">
                        <span className="text-[10px] font-mono text-slate-400 mr-1">Figures:</span>
                        {hoveredEvent.keyFigures.map((fig, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono"
                          >
                            {fig}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Primary Source Quote (if available) */}
                    {hoveredEvent.primarySourceQuote && (
                      <div className="border-l-2 border-orange-500/80 pl-2 text-[10px] italic text-slate-300 bg-slate-950/60 p-1.5 rounded-r">
                        <div className="flex items-start gap-1">
                          <Quote className="w-3 h-3 text-orange-400 shrink-0 mt-0.5" />
                          <div>
                            "{hoveredEvent.primarySourceQuote.text}"
                            <div className="text-[9px] font-mono not-italic text-slate-400 text-right mt-0.5">
                              — {hoveredEvent.primarySourceQuote.author} (
                              {hoveredEvent.primarySourceQuote.year})
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Click Action to Jump */}
                    <button
                      onClick={() => onYearChange(hoveredEvent.year)}
                      className="w-full mt-1 py-1.5 bg-orange-600/90 hover:bg-orange-500 text-white rounded font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md"
                    >
                      <span>Jump Scrubber to Year {hoveredEvent.year}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  /* When hovering over year with no immediate registered landmark */
                  <div className="p-1 space-y-2 text-center">
                    <div className="text-sm font-mono font-bold text-orange-400">
                      Hovering Year: {hoveredYear}
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      Move closer to colored dots to inspect fact-checked inventions, strikes, machine-wrecking rebellions, and legislation.
                    </p>
                    <button
                      onClick={() => hoveredYear && onYearChange(hoveredYear)}
                      className="py-1 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] font-mono"
                    >
                      Set Timeline to {hoveredYear}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Jump Timeline Anchor Labels */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1.5 overflow-x-auto scrollbar-none gap-2">
            {milestoneAnchors.map((m) => {
              const isSelected = Math.abs(currentYear - m.year) < 3;
              return (
                <button
                  key={m.year}
                  onClick={() => onYearChange(m.year)}
                  className={`transition-colors whitespace-nowrap hover:text-white ${
                    isSelected ? 'text-orange-400 font-bold underline' : ''
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ROW 3: REAL-TIME CONTEXT TICKER FOR CURRENT YEAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-850 gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-orange-400 uppercase tracking-wider font-bold shrink-0">
              Verified Shock at {currentData.year}:
            </span>
            <span className="truncate text-slate-200 font-medium">{currentData.shockEvent}</span>
          </div>

          {activeEventsAtYear.length > 0 ? (
            <div className="flex items-center gap-1.5 shrink-0 text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30 text-[10px]">
              <Lightbulb className="w-3 h-3 text-amber-400" />
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
