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
  Sparkles,
  Flame,
  Zap,
  Cpu,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { HISTORICAL_TIMELINE_EVENTS } from '../data/historicalTimelineData';
import { TimelineCategory } from '../types/historicalTimeline';

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
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  const getCategoryMeta = (category: TimelineCategory) => {
    switch (category) {
      case 'invention':
        return {
          label: 'Invention & Breakthrough',
          color:
            'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-500/40',
          topBar: 'from-amber-500 to-amber-400',
          icon: <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
        };
      case 'unrest':
        return {
          label: 'Social Unrest & Revolt',
          color:
            'text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-500/40',
          topBar: 'from-rose-600 to-rose-400',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />,
        };
      case 'reaction':
        return {
          label: 'Worker Reaction & Strike',
          color:
            'text-orange-800 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-500/40',
          topBar: 'from-[#F47E2D] to-[#FF6B35]',
          icon: <Users className="w-3.5 h-3.5 text-[#F47E2D]" />,
        };
      case 'policy':
        return {
          label: 'Policy & Legislation',
          color:
            'text-[#002D72] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-500/40',
          topBar: 'from-[#002D72] to-[#0056B3]',
          icon: <Scale className="w-3.5 h-3.5 text-[#0056B3] dark:text-blue-400" />,
        };
      case 'economic':
        return {
          label: 'Economic Shock & Panic',
          color:
            'text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-500/40',
          topBar: 'from-purple-600 to-indigo-500',
          icon: <Building2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />,
        };
      default:
        return {
          label: 'Milestone',
          color: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700',
          topBar: 'from-slate-500 to-slate-400',
          icon: <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />,
        };
    }
  };

  const getEraMeta = (era: number) => {
    switch (era) {
      case 1:
        return { title: 'Era I · Mechanized Workshop (1760-1840)', icon: <Flame className="w-3.5 h-3.5 text-[#F47E2D]" /> };
      case 2:
        return { title: 'Era II · Electrified Line (1870-1914)', icon: <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> };
      case 3:
        return { title: 'Era III · Silicon Mind (1947-2010)', icon: <Cpu className="w-3.5 h-3.5 text-[#0056B3] dark:text-blue-400" /> };
      case 4:
        return { title: 'Era IV · Foundation AI (2017-2026+)', icon: <Sparkles className="w-3.5 h-3.5 text-[#002D72] dark:text-sky-400" /> };
      default:
        return { title: '', icon: null };
    }
  };

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

  const categoryCounts = useMemo(() => {
    const counts = { all: HISTORICAL_TIMELINE_EVENTS.length, invention: 0, unrest: 0, reaction: 0, policy: 0, economic: 0 };
    HISTORICAL_TIMELINE_EVENTS.forEach((e) => {
      counts[e.category]++;
    });
    return counts;
  }, []);

  return (
    <div
      id="interactive-timeline"
      className="w-full bg-slate-50 dark:bg-[#070b14] border-t border-slate-200 dark:border-slate-800 py-10 px-4 sm:px-6 lg:px-8 rounded-2xl transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#F47E2D] uppercase tracking-widest mb-1.5">
              <Clock className="w-3.5 h-3.5 text-[#F47E2D]" />
              <span>Exhaustive Historical Chronicle · Fact-Checked Dates (1764–2026)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#002D72] dark:text-white tracking-tight">
              Inventions, Unrest, Worker Rebellions & State Policies
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl mt-1.5 leading-relaxed">
              Every epochal technological shock in modern economic history sparked virulent machine-breaking, worker strikes, state repression, and landmark regulatory pushback. Hover over any historical node or scrub the timeline to inspect the exact dates, displaced trades, and primary records.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono shadow-xs shrink-0">
            <span className="text-slate-500 dark:text-slate-400">Viewing:</span>
            <span className="font-bold text-[#F47E2D] text-sm">{filteredEvents.length}</span>
            <span className="text-slate-500">/ {HISTORICAL_TIMELINE_EVENTS.length} Verified Events</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-slate-950/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inventions, strikes, laws, people (e.g. 'Luddite', 'Bessemer', 'WGA', 'Watt', 'Taylor')..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0056B3] dark:focus:border-orange-500/80 transition-colors font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-[#002D72] dark:hover:text-white font-mono"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 md:pb-0 text-xs font-mono">
              <button
                onClick={() => setSelectedEra('all')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  selectedEra === 'all'
                    ? 'bg-[#002D72] dark:bg-slate-800 text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#002D72] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                All Eras
              </button>
              <button
                onClick={() => setSelectedEra(1)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  selectedEra === 1
                    ? 'bg-orange-100 dark:bg-orange-950/80 text-orange-900 dark:text-orange-300 border border-orange-300 dark:border-orange-500/50 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#F47E2D] hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-[#F47E2D]" />
                <span>Era I (1760-1840)</span>
              </button>
              <button
                onClick={() => setSelectedEra(2)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  selectedEra === 2
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-500/50 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span>Era II (1870-1914)</span>
              </button>
              <button
                onClick={() => setSelectedEra(3)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  selectedEra === 3
                    ? 'bg-blue-100 dark:bg-blue-950/80 text-[#002D72] dark:text-blue-300 border border-blue-300 dark:border-blue-500/50 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#0056B3] dark:hover:text-blue-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-[#0056B3] dark:text-blue-400" />
                <span>Era III (1947-2010)</span>
              </button>
              <button
                onClick={() => setSelectedEra(4)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  selectedEra === 4
                    ? 'bg-sky-100 dark:bg-sky-950/80 text-sky-900 dark:text-sky-300 border border-sky-300 dark:border-sky-500/50 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-sky-700 dark:hover:text-sky-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#002D72] dark:text-sky-300" />
                <span>Era IV (2017-2026+)</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1 text-xs font-mono">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#002D72] dark:bg-slate-800 text-white font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#002D72] dark:hover:text-white bg-slate-100 dark:bg-slate-900'
              }`}
            >
              All Types ({categoryCounts.all})
            </button>
            <button
              onClick={() => setSelectedCategory('invention')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                selectedCategory === 'invention'
                  ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-500/60 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-300 bg-slate-100 dark:bg-slate-900'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>Inventions ({categoryCounts.invention})</span>
            </button>
            <button
              onClick={() => setSelectedCategory('unrest')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                selectedCategory === 'unrest'
                  ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-500/60 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-300 bg-slate-100 dark:bg-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
              <span>Social Unrest & Rebellions ({categoryCounts.unrest})</span>
            </button>
            <button
              onClick={() => setSelectedCategory('reaction')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                selectedCategory === 'reaction'
                  ? 'bg-orange-100 dark:bg-orange-900/60 text-orange-900 dark:text-orange-200 border border-orange-300 dark:border-orange-500/60 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#F47E2D] bg-slate-100 dark:bg-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#F47E2D]" />
              <span>Worker Reactions & Strikes ({categoryCounts.reaction})</span>
            </button>
            <button
              onClick={() => setSelectedCategory('policy')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                selectedCategory === 'policy'
                  ? 'bg-blue-100 dark:bg-blue-900/60 text-[#002D72] dark:text-blue-200 border border-blue-300 dark:border-blue-500/60 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#0056B3] dark:hover:text-blue-300 bg-slate-100 dark:bg-slate-900'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-[#0056B3] dark:text-blue-400" />
              <span>Policy & Legislation ({categoryCounts.policy})</span>
            </button>
            <button
              onClick={() => setSelectedCategory('economic')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                selectedCategory === 'economic'
                  ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 border border-purple-300 dark:border-purple-500/60 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-300 bg-slate-100 dark:bg-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Market Shocks ({categoryCounts.economic})</span>
            </button>
          </div>
        </div>

        {/* Master Timeline Chronological Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event) => {
            const isHovered = hoveredEventId === event.id;
            const isYearActive = Math.abs(currentYear - event.year) <= 1;
            const meta = getCategoryMeta(event.category);
            const eraMeta = getEraMeta(event.era);

            return (
              <div
                key={event.id}
                onMouseEnter={() => setHoveredEventId(event.id)}
                onMouseLeave={() => setHoveredEventId(null)}
                className={`group relative rounded-xl border p-5 transition-all duration-200 flex flex-col justify-between overflow-hidden dssg-card-hover ${
                  isYearActive
                    ? 'bg-white dark:bg-slate-900/95 border-[#F47E2D] shadow-xl ring-1 ring-[#F47E2D]/50'
                    : isHovered
                    ? 'bg-white dark:bg-slate-900/90 border-[#0056B3]/50 dark:border-slate-600 shadow-lg'
                    : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 shadow-sm'
                }`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${meta.topBar}`} />

                {isYearActive && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-[#F47E2D] text-white font-mono text-[9px] uppercase tracking-wider font-bold shadow-xs">
                    Active Year
                  </span>
                )}

                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 font-mono font-bold text-[#F47E2D]">
                      <Calendar className="w-3.5 h-3.5 text-[#F47E2D]" />
                      <span className="text-sm">{event.exactDate}</span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 border ${meta.color}`}
                    >
                      {meta.icon}
                      <span>{meta.label}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-serif font-bold text-[#002D72] dark:text-white group-hover:text-[#F47E2D] dark:group-hover:text-orange-300 transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/90 p-2 rounded-lg border border-slate-200 dark:border-slate-800/90 leading-tight">
                    {event.headline}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {event.description}
                  </p>

                  {event.keyFigures.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Key Figures:</span>
                      {event.keyFigures.map((fig, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-700 dark:text-slate-300"
                        >
                          {fig}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-500/30 rounded-lg p-2.5 text-[11px] space-y-1">
                    <div className="text-[10px] font-mono font-bold text-[#F47E2D] uppercase tracking-wider flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-[#F47E2D]" />
                      <span>Labor & Skill Impact</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-normal">{event.laborSkillImpact}</p>
                    {event.displacedOrAffectedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {event.displacedOrAffectedSkills.map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-white dark:bg-orange-950/50 border border-orange-200 dark:border-orange-500/20 text-[9px] font-mono text-orange-800 dark:text-orange-300"
                          >
                            Displaced: {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {event.primarySourceQuote && (
                    <div className="border border-slate-200 dark:border-slate-800 text-[11px] italic text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/70 p-2.5 rounded-lg">
                      <div className="flex items-start gap-1.5">
                        <Quote className="w-3.5 h-3.5 text-[#F47E2D] shrink-0 mt-0.5" />
                        <div>
                          "{event.primarySourceQuote.text}"
                          <div className="text-[10px] font-mono not-italic text-slate-500 dark:text-slate-400 text-right mt-1">
                            — {event.primarySourceQuote.author} ({event.primarySourceQuote.year})
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                    {eraMeta.icon}
                    <span>{event.eraName.split('·')[0].trim()}</span>
                  </div>

                  <button
                    onClick={() => onSelectYear && onSelectYear(event.year)}
                    className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-[#F47E2D] text-[#002D72] dark:text-slate-200 hover:text-white font-mono text-[10px] font-bold flex items-center gap-1 transition-colors"
                  >
                    <span>Jump to {event.year}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-serif font-bold text-[#002D72] dark:text-white">No historical events found</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Try searching with a broader keyword (e.g. "strike", "loom", "steam", "AI", "patent", "act") or select "All Eras".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedEra('all');
              }}
              className="px-4 py-2 dssg-btn-primary rounded font-mono text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
