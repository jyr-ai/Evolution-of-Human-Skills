import React, { useState } from 'react';
import { STREAM_DATA, StreamDataPoint } from '../data/skillsNetworkData';
import { Waves, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SkillStreamgraphProps {
  activeYear?: number;
  onYearChange?: (year: number) => void;
}

export const SkillStreamgraph: React.FC<SkillStreamgraphProps> = ({ activeYear, onYearChange }) => {
  const { isDark } = useTheme();
  const initialPoint = activeYear
    ? STREAM_DATA.reduce((prev, curr) =>
        Math.abs(curr.year - activeYear) < Math.abs(prev.year - activeYear) ? curr : prev
      )
    : STREAM_DATA[STREAM_DATA.length - 2];

  const [hoveredPoint, setHoveredPoint] = useState<StreamDataPoint>(initialPoint);

  React.useEffect(() => {
    if (activeYear) {
      const match = STREAM_DATA.reduce((prev, curr) =>
        Math.abs(curr.year - activeYear) < Math.abs(prev.year - activeYear) ? curr : prev
      );
      setHoveredPoint(match);
    }
  }, [activeYear]);

  const width = 860;
  const height = 340;
  const padding = { top: 20, right: 30, bottom: 40, left: 45 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const getX = (index: number) => {
    return padding.left + (index / (STREAM_DATA.length - 1)) * graphWidth;
  };

  const getY = (valPercent: number) => {
    return padding.top + graphHeight - (valPercent / 100) * graphHeight;
  };

  const buildPath = (
    getBottom: (d: StreamDataPoint) => number,
    getTop: (d: StreamDataPoint) => number
  ) => {
    const topPoints = STREAM_DATA.map((d, i) => `${getX(i)},${getY(getTop(d))}`);
    const bottomPoints = [...STREAM_DATA]
      .reverse()
      .map((d, i) => `${getX(STREAM_DATA.length - 1 - i)},${getY(getBottom(d))}`);
    return `M ${topPoints.join(' L ')} L ${bottomPoints.join(' L ')} Z`;
  };

  const pathObsolescent = buildPath(
    () => 0,
    (d) => d.obsolescent
  );

  const pathTransformed = buildPath(
    (d) => d.obsolescent,
    (d) => d.obsolescent + d.transformed
  );

  const pathEmergent = buildPath(
    (d) => d.obsolescent + d.transformed,
    (d) => d.obsolescent + d.transformed + d.emergent
  );

  const pathEnduring = buildPath(
    (d) => d.obsolescent + d.transformed + d.emergent,
    () => 100
  );

  return (
    <div className="w-full bg-white dark:bg-[#070b13] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg dark:shadow-2xl space-y-4 transition-colors duration-200">
      {/* Header and Live Inspection Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#F47E2D] uppercase tracking-widest">
            <Waves className="w-3.5 h-3.5" />
            <span>Macro Skill Streamgraph (1760 – 2030)</span>
          </div>
          <h3 className="text-lg font-serif font-bold text-[#002D72] dark:text-white mt-0.5">
            The Shifting Composition of Human Economic Tasks
          </h3>
        </div>

        {/* Live Hover Scrubber Info */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 px-3.5 py-1.5 rounded-lg flex items-center gap-3 text-xs font-mono">
          <div className="font-bold text-[#002D72] dark:text-white text-sm tabular-nums">
            {hoveredPoint.label}
          </div>
          <div className="flex items-center gap-2.5 text-[11px]">
            <span className="text-[#F47E2D]">
              Obs: <strong>{hoveredPoint.obsolescent}%</strong>
            </span>
            <span className="text-amber-600 dark:text-amber-400">
              Trans: <strong>{hoveredPoint.transformed}%</strong>
            </span>
            <span className="text-[#0056B3] dark:text-sky-400">
              Emg: <strong>{hoveredPoint.emergent}%</strong>
            </span>
            <span className="text-[#002D72] dark:text-white">
              Core: <strong>{hoveredPoint.enduring}%</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Shock Event Kicker */}
      <div className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-[#0056B3] dark:text-blue-400 shrink-0" />
        <span>
          <strong className="text-[#F47E2D]">Milestone Shock at {hoveredPoint.label}:</strong>{' '}
          {hoveredPoint.shockEvent}
        </span>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full overflow-x-auto bg-slate-50/70 dark:bg-transparent rounded-xl p-2 border border-slate-100 dark:border-transparent">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64 sm:h-72 select-none">
          <defs>
            <linearGradient id="obsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F47E2D" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="transGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.72" />
            </linearGradient>
            <linearGradient id="emgGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? '#38bdf8' : '#0056B3'} stopOpacity="0.88" />
              <stop offset="100%" stopColor={isDark ? '#0284c7' : '#003d82'} stopOpacity="0.78" />
            </linearGradient>
            <linearGradient id="endureGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? '#ffffff' : '#002D72'} stopOpacity={isDark ? '0.8' : '0.85'} />
              <stop offset="100%" stopColor={isDark ? '#cbd5e1' : '#1e3a8a'} stopOpacity={isDark ? '0.5' : '0.65'} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((pct) => (
            <g key={pct}>
              <line
                x1={padding.left}
                y1={getY(pct)}
                x2={width - padding.right}
                y2={getY(pct)}
                stroke={isDark ? '#1e293b' : '#cbd5e1'}
                strokeDasharray="2 4"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={getY(pct) + 4}
                fill={isDark ? '#64748b' : '#475569'}
                fontSize="10"
                fontFamily="monospace"
                textAnchor="end"
              >
                {pct}%
              </text>
            </g>
          ))}

          {/* Stream Layers */}
          <path d={pathEnduring} fill="url(#endureGrad)" opacity="0.85" />
          <path d={pathEmergent} fill="url(#emgGrad)" opacity="0.88" />
          <path d={pathTransformed} fill="url(#transGrad)" opacity="0.88" />
          <path d={pathObsolescent} fill="url(#obsGrad)" opacity="0.92" />

          {/* Era boundaries vertical lines */}
          {[
            { idx: 0, label: 'Era I (Steam)' },
            { idx: 4, label: 'Era II (Electric)' },
            { idx: 8, label: 'Era III (Digital)' },
            { idx: 12, label: 'Era IV (AI)' },
          ].map((eraLine, i) => (
            <g key={i}>
              <line
                x1={getX(eraLine.idx)}
                y1={padding.top}
                x2={getX(eraLine.idx)}
                y2={height - padding.bottom}
                stroke={isDark ? '#475569' : '#64748b'}
                strokeWidth="1.2"
                strokeDasharray="4 2"
              />
              <text
                x={getX(eraLine.idx) + 4}
                y={padding.top + 12}
                fill={isDark ? '#cbd5e1' : '#ffffff'}
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {eraLine.label}
              </text>
            </g>
          ))}

          {/* X Axis Years */}
          {STREAM_DATA.map((d, i) => {
            const x = getX(i);
            const isHovered = hoveredPoint.year === d.year;
            return (
              <g
                key={d.year}
                onMouseEnter={() => {
                  setHoveredPoint(d);
                  if (onYearChange) onYearChange(d.year);
                }}
                onClick={() => onYearChange && onYearChange(d.year)}
                className="cursor-pointer"
              >
                <rect
                  x={x - 15}
                  y={padding.top}
                  width="30"
                  height={graphHeight}
                  fill="transparent"
                />

                {isHovered && (
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={height - padding.bottom}
                    stroke={isDark ? '#ffffff' : '#002D72'}
                    strokeWidth="2"
                  />
                )}

                <circle
                  cx={x}
                  cy={height - padding.bottom}
                  r={isHovered ? 4 : 2.5}
                  fill={isHovered ? (isDark ? '#ffffff' : '#002D72') : '#64748b'}
                />

                <text
                  x={x}
                  y={height - padding.bottom + 18}
                  fill={isHovered ? (isDark ? '#ffffff' : '#002D72') : isDark ? '#94a3b8' : '#475569'}
                  fontSize={isHovered ? '11' : '9'}
                  fontFamily="monospace"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                  textAnchor="middle"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Color Key */}
      <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/80 gap-2">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#F47E2D] inline-block" />
            <span className="text-slate-700 dark:text-slate-300">Obsolescent Tasks</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
            <span className="text-slate-700 dark:text-slate-300">Transformed Hybrid Tasks</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#0056B3] dark:bg-sky-500 inline-block" />
            <span className="text-slate-700 dark:text-slate-300">Emergent Technological Tasks</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#002D72] dark:bg-white inline-block shadow-xs" />
            <span className="text-slate-700 dark:text-slate-300">Enduring Human Core</span>
          </span>
        </div>
        <div className="text-[11px] text-slate-500">Scrub cursor across timeline to inspect shocks</div>
      </div>
    </div>
  );
};
