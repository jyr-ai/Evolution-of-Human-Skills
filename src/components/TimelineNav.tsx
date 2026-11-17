import React from 'react';
import { IndustrialEra } from '../types/history';
import { Flame, Zap, Cpu, Sparkles } from 'lucide-react';

interface TimelineNavProps {
  eras: IndustrialEra[];
  selectedEraId: string;
  onSelectEra: (id: string) => void;
}

export const TimelineNav: React.FC<TimelineNavProps> = ({
  eras,
  selectedEraId,
  onSelectEra,
}) => {
  const getEraIcon = (num: number) => {
    switch (num) {
      case 1:
        return <Flame className="w-4 h-4 text-[#F47E2D]" />;
      case 2:
        return <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />;
      case 3:
        return <Cpu className="w-4 h-4 text-[#0056B3] dark:text-blue-400" />;
      case 4:
        return <Sparkles className="w-4 h-4 text-[#002D72] dark:text-sky-300" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-[#0b1120] border-y border-slate-200 dark:border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {eras.map((era) => {
            const isSelected = era.id === selectedEraId;
            return (
              <button
                key={era.id}
                onClick={() => onSelectEra(era.id)}
                className={`group flex-1 min-w-[220px] text-left p-4 rounded-xl border transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-[#0056B3] dark:border-[#F47E2D] shadow-lg ring-1 ring-[#0056B3]/25 dark:ring-[#F47E2D]/40'
                    : 'bg-white/70 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/70 hover:border-[#0056B3]/50 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900/50 hover:-translate-y-0.5'
                }`}
              >
                {/* Top accent bar */}
                {isSelected && (
                  <span className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#002D72] to-[#F47E2D]" />
                )}

                <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                  <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#002D72] dark:text-slate-300">
                    {getEraIcon(era.number)}
                    <span>Era {era.romanNumeral}</span>
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 tabular-nums">{era.timeframe}</span>
                </div>

                <h3
                  className={`text-sm font-serif font-bold tracking-tight transition-colors ${
                    isSelected
                      ? 'text-[#002D72] dark:text-white'
                      : 'text-slate-800 dark:text-slate-300 group-hover:text-[#002D72] dark:group-hover:text-white'
                  }`}
                >
                  {era.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-1 font-sans">
                  {era.number === 1 && 'Steam, Power Loom, Wrought Iron'}
                  {era.number === 2 && 'Electricity, Assembly Line, Steel'}
                  {era.number === 3 && 'Silicon, Internet, CNC Robotics'}
                  {era.number === 4 && 'LLMs, Autonomous Agents, Synthetic Bio'}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
