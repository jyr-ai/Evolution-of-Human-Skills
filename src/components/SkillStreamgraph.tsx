import React, { useState } from 'react';
import { STREAM_DATA, StreamDataPoint } from '../data/skillsNetworkData';
import { Waves, TrendingUp, Info } from 'lucide-react';

interface SkillStreamgraphProps {
  activeYear?: number;
  onYearChange?: (year: number) => void;
}

export const SkillStreamgraph: React.FC<SkillStreamgraphProps> = ({ activeYear, onYearChange }) => {
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

  // X coordinate calculation
  const getX = (index: number) => {
    return padding.left + (index / (STREAM_DATA.length - 1)) * graphWidth;
  };

  // Stacked areas calculation
  // Base is Y = 0 (bottom) to 100% (top)
  const getY = (valPercent: number) => {
    return padding.top + graphHeight - (valPercent / 100) * graphHeight;
  };

  // Generate SVG polygon paths for each layer
  // Layer 1: Obsolescent (0 to obsolescent)
  // Layer 2: Transformed (obsolescent to obsolescent + transformed)
  // Layer 3: Emergent (obsolescent + transformed to ... + emergent)
  // Layer 4: Enduring (the remainder to 100%)

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
    <div className="w-full bg-[#070b13] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header and Live Inspection Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-widest">
            <Waves className="w-3.5 h-3.5" />
            <span>Macro Skill Streamgraph (1760 – 2030)</span>
          </div>
          <h3 className="text-lg font-serif font-bold text-white mt-0.5">
            The Shifting Composition of Human Economic Tasks
          </h3>
        </div>

        {/* Live Hover Scrubber Info */}
        <div className="bg-slate-900 border border-slate-700/80 px-3.5 py-1.5 rounded-lg flex items-center gap-3 text-xs font-mono">
          <div className="font-bold text-white text-sm tabular-nums">
            {hoveredPoint.label}
          </div>
          <div className="flex items-center gap-2.5 text-[11px]">
            <span className="text-orange-400">
              Obs: <strong>{hoveredPoint.obsolescent}%</strong>
            </span>
            <span className="text-amber-400">
              Trans: <strong>{hoveredPoint.transformed}%</strong>
            </span>
            <span className="text-sky-400">
              Emg: <strong>{hoveredPoint.emergent}%</strong>
            </span>
            <span className="text-white">
              Core: <strong>{hoveredPoint.enduring}%</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Shock Event Kicker */}
      <div className="text-xs font-mono text-slate-300 bg-slate-950/60 px-3 py-1.5 rounded border border-slate-800 flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span>
          <strong className="text-orange-400">Milestone Shock at {hoveredPoint.label}:</strong>{' '}
          {hoveredPoint.shockEvent}
        </span>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64 sm:h-72 select-none">
          <defs>
            <linearGradient id="obsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ea580c" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#c2410c" stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id="transGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="emgGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id="endureGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.5" />
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
                stroke="#1e293b"
                strokeDasharray="2 4"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={getY(pct) + 4}
                fill="#64748b"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="end"
              >
                {pct}%
              </text>
            </g>
          ))}

          {/* Stream Layers */}
          <path d={pathEnduring} fill="url(#endureGrad)" opacity="0.8" />
          <path d={pathEmergent} fill="url(#emgGrad)" opacity="0.85" />
          <path d={pathTransformed} fill="url(#transGrad)" opacity="0.85" />
          <path d={pathObsolescent} fill="url(#obsGrad)" opacity="0.9" />

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
                stroke="#475569"
                strokeWidth="1.2"
                strokeDasharray="4 2"
              />
              <text
                x={getX(eraLine.idx) + 4}
                y={padding.top + 12}
                fill="#94a3b8"
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
                {/* Invisible hover trigger column */}
                <rect
                  x={x - 15}
                  y={padding.top}
                  width="30"
                  height={graphHeight}
                  fill="transparent"
                />

                {/* Scrubber vertical bar on hover */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={height - padding.bottom}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                )}

                {/* Tick dot */}
                <circle
                  cx={x}
                  cy={height - padding.bottom}
                  r={isHovered ? 4 : 2}
                  fill={isHovered ? '#ffffff' : '#64748b'}
                />

                {/* Year Label */}
                <text
                  x={x}
                  y={height - padding.bottom + 18}
                  fill={isHovered ? '#ffffff' : '#94a3b8'}
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
      <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-orange-600 inline-block" />
            <span className="text-slate-300">Obsolescent Tasks</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
            <span className="text-slate-300">Transformed Hybrid Tasks</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-sky-500 inline-block" />
            <span className="text-slate-300">Emergent Technological Tasks</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-white inline-block shadow-sm" />
            <span className="text-slate-300">Enduring Human Core</span>
          </span>
        </div>
        <div className="text-[11px] text-slate-500">Scrub cursor across timeline to inspect shocks</div>
      </div>
    </div>
  );
};
