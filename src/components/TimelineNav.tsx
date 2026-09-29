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
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 2:
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 3:
        return <Cpu className="w-4 h-4 text-blue-400" />;
      case 4:
        return <Sparkles className="w-4 h-4 text-sky-300" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-[#0b1120] border-y border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {eras.map((era) => {
            const isSelected = era.id === selectedEraId;
            return (
              <button
                key={era.id}
                onClick={() => onSelectEra(era.id)}
                className={`group flex-1 min-w-[220px] text-left p-3.5 rounded-lg border transition-all relative ${
                  isSelected
                    ? 'bg-slate-900/90 border-orange-500/80 shadow-[0_0_20px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/50'
                    : 'bg-slate-950/40 border-slate-800/70 hover:border-slate-700 hover:bg-slate-900/40'
                }`}
              >
                {/* Active marker indicator */}
                {isSelected && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full" />
                )}

                <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                  <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-300">
                    {getEraIcon(era.number)}
                    <span>Era {era.romanNumeral}</span>
                  </span>
                  <span className="text-slate-400 tabular-nums">{era.timeframe}</span>
                </div>

                <h3
                  className={`text-sm font-semibold tracking-tight transition-colors ${
                    isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  }`}
                >
                  {era.title}
                </h3>

                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
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
