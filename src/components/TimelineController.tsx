import React, { useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Flame, Zap, Cpu, Sparkles } from 'lucide-react';
import { STREAM_DATA, StreamDataPoint } from '../data/skillsNetworkData';

interface TimelineControllerProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const TimelineController: React.FC<TimelineControllerProps> = ({
  currentYear,
  onYearChange,
  isPlaying,
  onTogglePlay,
}) => {
  const years = STREAM_DATA.map((d) => d.year);
  const minYear = years[0];
  const maxYear = years[years.length - 1];

  // Find closest stream data point for current stats
  const currentData =
    STREAM_DATA.reduce((prev, curr) =>
      Math.abs(curr.year - currentYear) < Math.abs(prev.year - currentYear) ? curr : prev
    ) || STREAM_DATA[0];

  const getEraBadge = (era: number) => {
    switch (era) {
      case 1:
        return { label: 'Era I · Steam & Loom', color: 'text-orange-400 border-orange-500/40 bg-orange-950/40', icon: <Flame className="w-3.5 h-3.5 text-orange-400" /> };
      case 2:
        return { label: 'Era II · Electricity & Line', color: 'text-amber-400 border-amber-500/40 bg-amber-950/40', icon: <Zap className="w-3.5 h-3.5 text-amber-400" /> };
      case 3:
        return { label: 'Era III · Silicon & Internet', color: 'text-blue-400 border-blue-500/40 bg-blue-950/40', icon: <Cpu className="w-3.5 h-3.5 text-blue-400" /> };
      case 4:
        return { label: 'Era IV · Generative AI', color: 'text-sky-300 border-sky-500/40 bg-sky-950/40', icon: <Sparkles className="w-3.5 h-3.5 text-sky-300" /> };
      default:
        return { label: '', color: '', icon: null };
    }
  };

  const eraInfo = getEraBadge(currentData.era);

  // Milestone jump shortcuts
  const milestones = [
    { year: 1785, label: '1785 Power Loom' },
    { year: 1840, label: '1840 Railways' },
    { year: 1914, label: '1914 Moving Line' },
    { year: 1969, label: '1969 Microprocessor' },
    { year: 1985, label: '1985 Office PC' },
    { year: 2024, label: '2024 AI Agents' },
  ];

  return (
    <div className="w-full bg-[#080d18] border-y border-slate-800 py-3.5 px-4 sm:px-6 shadow-xl sticky top-16 z-30 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto space-y-2.5">
        {/* Row 1: Player controls + Year Indicator + Live Micro HUD */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onYearChange(minYear)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset to 1760"
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
              title="Jump to 2030"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            {/* Current Year Badge */}
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
              <span className="text-slate-400">Year:</span>
              <span className="text-base font-bold text-white tabular-nums tracking-wider">
                {currentYear}
              </span>
            </div>

            {/* Era Tag */}
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-bold ${eraInfo.color}`}>
              {eraInfo.icon}
              <span>{eraInfo.label}</span>
            </div>
          </div>

          {/* Live Task Distribution Meters (Visual, Minimal Words) */}
          <div className="flex items-center gap-3 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-800/80 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
              <span className="text-slate-400">Obs:</span>
              <span className="font-bold text-orange-400 tabular-nums">{currentData.obsolescent}%</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span className="text-slate-400">Trans:</span>
              <span className="font-bold text-amber-300 tabular-nums">{currentData.transformed}%</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
              <span className="text-slate-400">Emg:</span>
              <span className="font-bold text-sky-300 tabular-nums">{currentData.emergent}%</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white inline-block shadow-sm" />
              <span className="text-slate-400">Core:</span>
              <span className="font-bold text-white tabular-nums">{currentData.enduring}%</span>
            </div>
          </div>
        </div>

        {/* Row 2: Interactive Timeline Range Scrubber Input */}
        <div className="relative pt-1">
          {/* Era color bands background on the slider track */}
          <div className="absolute top-3.5 left-0 right-0 h-2 rounded-full overflow-hidden flex opacity-60 pointer-events-none">
            <div className="bg-orange-500 h-full" style={{ width: '29%' }} title="Era I (1760-1840)" />
            <div className="bg-amber-500 h-full" style={{ width: '27%' }} title="Era II (1870-1914)" />
            <div className="bg-blue-500 h-full" style={{ width: '26%' }} title="Era III (1969-2010)" />
            <div className="bg-sky-400 h-full" style={{ width: '18%' }} title="Era IV (2017-2030)" />
          </div>

          <input
            type="range"
            min={minYear}
            max={maxYear}
            step={1}
            value={currentYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer accent-orange-500 relative z-10 focus:outline-none"
          />

          {/* Milestone Quick Jump Pins */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
            {milestones.map((m) => {
              const isSelected = Math.abs(currentYear - m.year) < 10;
              return (
                <button
                  key={m.year}
                  onClick={() => onYearChange(m.year)}
                  className={`transition-colors hover:text-white ${
                    isSelected ? 'text-orange-400 font-bold underline' : ''
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Single-line punchy shock ticker (Minimal words, maximum context) */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 bg-slate-950 px-2.5 py-1 rounded border border-slate-850">
          <span className="text-orange-400 uppercase tracking-wider font-semibold shrink-0 mr-2">
            Technological Shock at {currentData.year}:
          </span>
          <span className="truncate text-slate-200">{currentData.shockEvent}</span>
        </div>
      </div>
    </div>
  );
};
