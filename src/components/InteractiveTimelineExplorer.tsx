import React, { useState, useMemo } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Quote,
  Lightbulb,
  ShieldAlert,
  Scale,
  Building2,
  Search,
  Filter,
  Sparkles,
  Flame,
  Zap,
  Cpu,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { HISTORICAL_TIMELINE_EVENTS } from '../data/historicalTimelineData';
import { HistoricalTimelineEvent, TimelineCategory } from '../types/historicalTimeline';

interface InteractiveTimelineExplorerProps {
  currentYear?: number;
  onSelectYear?: (year: number) => void;
}

export const InteractiveTimelineExplorer: React.FC<InteractiveTimelineExplorerProps> = ({
  currentYear = 1815,
  onSelectYear,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TimelineCategory | 'all'>('all');
  const [selectedEra, setSelectedEra] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeExpandedId, setActiveExpandedId] = useState<string | null>(null);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  // Category metadata helper
  const getCategoryMeta = (category: TimelineCategory) => {
    switch (category) {
      case 'invention':
        return {
          label: 'Invention & Breakthrough',
          color: 'text-amber-400 bg-amber-950/40 border-amber-500/40',
          badgeColor: 'bg-amber-500 text-slate-950 font-bold',
          icon: <Lightbulb className="w-3.5 h-3.5 text-amber-400" />,
        };
      case 'unrest':
        return {
          label: 'Social Unrest & Revolt',
          color: 'text-rose-400 bg-rose-950/40 border-rose-500/40',
          badgeColor: 'bg-rose-500 text-white font-bold',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />,
        };
      case 'reaction':
        return {
          label: 'Worker Reaction & Strike',
          color: 'text-orange-400 bg-orange-950/40 border-orange-500/40',
          badgeColor: 'bg-orange-500 text-white font-bold',
          icon: <Users className="w-3.5 h-3.5 text-orange-400" />,
        };
      case 'policy':
        return {
          label: 'Policy & Legislation',
          color: 'text-blue-400 bg-blue-950/40 border-blue-500/40',
          badgeColor: 'bg-blue-500 text-white font-bold',
          icon: <Scale className="w-3.5 h-3.5 text-blue-400" />,
        };
      case 'economic':
        return {
          label: 'Economic Shock & Panic',
          color: 'text-purple-400 bg-purple-950/40 border-purple-500/40',
          badgeColor: 'bg-purple-500 text-white font-bold',
          icon: <Building2 className="w-3.5 h-3.5 text-purple-400" />,
        };
      default:
        return {
          label: 'Milestone',
          color: 'text-slate-400 bg-slate-900 border-slate-700',
          badgeColor: 'bg-slate-700 text-white',
          icon: <Calendar className="w-3.5 h-3.5 text-slate-400" />,
        };
    }
  };

  // Era helper
  const getEraMeta = (era: number) => {
    switch (era) {
      case 1:
        return { title: 'Era I · Mechanized Workshop (1760-1840)', icon: <Flame className="w-3.5 h-3.5 text-orange-400" /> };
      case 2:
        return { title: 'Era II · Electrified Line (1870-1914)', icon: <Zap className="w-3.5 h-3.5 text-amber-400" /> };
      case 3:
        return { title: 'Era III · Silicon Mind (1947-2010)', icon: <Cpu className="w-3.5 h-3.5 text-blue-400" /> };
      case 4:
        return { title: 'Era IV · Foundation AI (2017-2026+)', icon: <Sparkles className="w-3.5 h-3.5 text-sky-400" /> };
      default:
        return { title: '', icon: null };
    }
  };

  // Filter events
  const filteredEvents = useMemo(() => {
    return HISTORICAL_TIMELINE_EVENTS.filter((ev) => {
      if (selectedCategory !== 'all' && ev.category !== selectedCategory) return false;
      if (selectedEra !== 'all' && ev.era !== selectedEra) return false;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const inTitle = ev.title.toLowerCase().includes(query);
        const inDesc = ev.description.toLowerCase().includes(query);
        const inLoc = ev.location.toLowerCase().includes(query);
        const inHeadline = ev.headline.toLowerCase().includes(query);
        const inFigures = ev.keyFigures.some((f) => f.toLowerCase().includes(query));
        const inImpact = ev.laborSkillImpact.toLowerCase().includes(query);
        if (!inTitle && !inDesc && !inLoc && !inHeadline && !inFigures && !inImpact) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, selectedEra, searchQuery]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    const counts = { all: HISTORICAL_TIMELINE_EVENTS.length, invention: 0, unrest: 0, reaction: 0, policy: 0, economic: 0 };
    HISTORICAL_TIMELINE_EVENTS.forEach((e) => {
      counts[e.category]++;
    });
    return counts;
  }, []);

  return (
    <div id="interactive-timeline" className="w-full bg-[#070b14] border-t border-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-widest mb-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span>Exhaustive Historical Chronicle · Fact-Checked Dates (1764–2026)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Inventions, Unrest, Worker Rebellions & State Policies
            </h2>
            <p className="text-sm text-slate-400 max-w-3xl mt-1.5 leading-relaxed">
              Every epochal technological shock in modern economic history sparked virulent machine-breaking, worker strikes, state repression, and landmark regulatory pushback. Hover over any historical node or scrub the timeline to inspect the exact dates, displaced trades, and primary records.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">Viewing:</span>
            <span className="font-bold text-orange-400 text-sm">{filteredEvents.length}</span>
            <span className="text-slate-500">/ {HISTORICAL_TIMELINE_EVENTS.length} Verified Events</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 shadow-lg space-y-3.5">
          {/* Top Row: Search input + Era selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inventions, strikes, laws, people (e.g. 'Luddite', 'Bessemer', 'WGA', 'Watt', 'Taylor')..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/80 transition-colors font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white font-mono"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Era Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 md:pb-0 text-xs font-mono">
              <button
                onClick={() => setSelectedEra('all')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  selectedEra === 'all'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                All Eras
              </button>
              <button
                onClick={() => setSelectedEra(1)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  selectedEra === 1
                    ? 'bg-orange-950/80 text-orange-300 border border-orange-500/50 font-bold'
                    : 'text-slate-400 hover:text-orange-300 hover:bg-slate-900'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>Era I (1760-1840)</span>
              </button>
              <button
                onClick={() => setSelectedEra(2)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  selectedEra === 2
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-500/50 font-bold'
                    : 'text-slate-400 hover:text-amber-300 hover:bg-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Era II (1870-1914)</span>
              </button>
              <button
                onClick={() => setSelectedEra(3)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  selectedEra === 3
                    ? 'bg-blue-950/80 text-blue-300 border border-blue-500/50 font-bold'
                    : 'text-slate-400 hover:text-blue-300 hover:bg-slate-900'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                <span>Era III (1947-2010)</span>
              </button>
              <button
                onClick={() => setSelectedEra(4)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  selectedEra === 4
                    ? 'bg-sky-950/80 text-sky-300 border border-sky-500/50 font-bold'
                    : 'text-slate-400 hover:text-sky-300 hover:bg-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                <span>Era IV (2017-2026+)</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: Category Toggles */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1 text-xs font-mono">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-slate-800 text-white font-bold ring-1 ring-slate-600'
                  : 'text-slate-400 hover:text-white bg-slate-900'
              }`}
            >
              All Types ({categoryCounts.all})
            </button>
            <button
              onClick={() => setSelectedCategory('invention')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                selectedCategory === 'invention'
                  ? 'bg-amber-900/60 text-amber-200 border border-amber-500/60 font-bold'
                  : 'text-slate-400 hover:text-amber-300 bg-slate-900'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Inventions ({categoryCounts.invention})</span>
            </button>
            <button
              onClick={() => setSelectedCategory('unrest')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                selectedCategory === 'unrest'
                  ? 'bg-rose-900/60 text-rose-200 border border-rose-500/60 font-bold'
                  : 'text-slate-400 hover:text-rose-300 bg-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Social Unrest & Rebellions ({categoryCounts.unrest})</span>
            </button>
            <button
              onClick={() => setSelectedCategory('reaction')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                selectedCategory === 'reaction'
                  ? 'bg-orange-900/60 text-orange-200 border border-orange-500/60 font-bold'
                  : 'text-slate-400 hover:text-orange-300 bg-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-orange-400" />
              <span>Worker Reactions & Strikes ({categoryCounts.reaction})</span>
            </button>
            <button
              onClick={() => setSelectedCategory('policy')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                selectedCategory === 'policy'
                  ? 'bg-blue-900/60 text-blue-200 border border-blue-500/60 font-bold'
                  : 'text-slate-400 hover:text-blue-300 bg-slate-900'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-blue-400" />
              <span>Policy & Legislation ({categoryCounts.policy})</span>
            </button>
            <button
              onClick={() => setSelectedCategory('economic')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                selectedCategory === 'economic'
                  ? 'bg-purple-900/60 text-purple-200 border border-purple-500/60 font-bold'
                  : 'text-slate-400 hover:text-purple-300 bg-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Market Shocks ({categoryCounts.economic})</span>
            </button>
          </div>
        </div>

        {/* Master Timeline Chronological Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => {
            const isHovered = hoveredEventId === event.id;
            const isExpanded = activeExpandedId === event.id;
            const isYearActive = Math.abs(currentYear - event.year) <= 1;
            const meta = getCategoryMeta(event.category);
            const eraMeta = getEraMeta(event.era);

            return (
              <div
                key={event.id}
                onMouseEnter={() => setHoveredEventId(event.id)}
                onMouseLeave={() => setHoveredEventId(null)}
                className={`group relative rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                  isYearActive
                    ? 'bg-slate-900/95 border-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.2)] ring-1 ring-orange-500/60'
                    : isHovered
                    ? 'bg-slate-900/90 border-slate-600 shadow-xl'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Active Year Ribbon */}
                {isYearActive && (
                  <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-orange-600 text-white font-mono text-[9px] uppercase tracking-wider font-bold shadow-md">
                    Active Scrubber Year
                  </span>
                )}

                <div className="space-y-2.5">
                  {/* Top Bar: Exact Date + Category Badge */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 font-mono font-bold text-orange-400">
                      <Calendar className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-sm">{event.exactDate}</span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 border ${meta.color}`}
                    >
                      {meta.icon}
                      <span>{meta.label}</span>
                    </span>
                  </div>

                  {/* Title & Location */}
                  <div>
                    <h3 className="text-base font-serif font-bold text-white group-hover:text-orange-300 transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {/* Punchy Headline Banner */}
                  <div className="text-[11px] font-semibold text-slate-200 bg-slate-900/90 p-2 rounded-lg border border-slate-800/90 leading-tight">
                    {event.headline}
                  </div>

                  {/* Fact-Checked Narrative Description */}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Key Figures */}
                  {event.keyFigures.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      <span className="text-[10px] font-mono text-slate-400">Key Figures:</span>
                      {event.keyFigures.map((fig, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300"
                        >
                          {fig}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Labor & Skill Displacement Breakdown */}
                  <div className="bg-orange-950/20 border border-orange-500/30 rounded-lg p-2.5 text-[11px] space-y-1">
                    <div className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-orange-400" />
                      <span>Labor & Skill Impact</span>
                    </div>
                    <p className="text-slate-300 leading-normal">{event.laborSkillImpact}</p>
                    {event.displacedOrAffectedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {event.displacedOrAffectedSkills.map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-orange-950/50 border border-orange-500/20 text-[9px] font-mono text-orange-300"
                          >
                            Displaced: {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Primary Source Quote */}
                  {event.primarySourceQuote && (
                    <div className="border-l-2 border-orange-500/80 pl-2 text-[11px] italic text-slate-300 bg-slate-950/70 p-2 rounded-r">
                      <div className="flex items-start gap-1.5">
                        <Quote className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                        <div>
                          "{event.primarySourceQuote.text}"
                          <div className="text-[10px] font-mono not-italic text-slate-400 text-right mt-1">
                            — {event.primarySourceQuote.author} ({event.primarySourceQuote.year})
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer: Jump to Scrubber Year */}
                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                    {eraMeta.icon}
                    <span>{event.eraName.split('·')[0].trim()}</span>
                  </div>

                  <button
                    onClick={() => onSelectYear && onSelectYear(event.year)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-orange-600 text-slate-200 hover:text-white font-mono text-[10px] font-bold flex items-center gap-1 transition-colors"
                  >
                    <span>Jump to {event.year}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Search State */}
        {filteredEvents.length === 0 && (
          <div className="p-12 text-center bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-base font-serif font-bold text-white">No historical events found</h3>
            <p className="text-xs text-slate-400">
              Try searching with a broader keyword (e.g. "strike", "loom", "steam", "AI", "patent", "act") or select "All Eras".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedEra('all');
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-mono text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
