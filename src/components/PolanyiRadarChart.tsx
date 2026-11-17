import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface RadarAxis {
  label: string;
  angle: number;
}

const AXES: RadarAxis[] = [
  { label: 'Rule Codifiability', angle: -Math.PI / 2 },
  { label: 'Symbolic Reasoning', angle: -Math.PI / 2 + (2 * Math.PI) / 5 },
  { label: 'Tactile Dexterity', angle: -Math.PI / 2 + (4 * Math.PI) / 5 },
  { label: 'Moral Accountability', angle: -Math.PI / 2 + (6 * Math.PI) / 5 },
  { label: 'Empathy & Persuasion', angle: -Math.PI / 2 + (8 * Math.PI) / 5 },
];

export const PolanyiRadarChart: React.FC = () => {
  const { isDark } = useTheme();
  const [activeEras, setActiveEras] = useState<number[]>([1, 4]);

  const eraRadarData: Record<number, { name: string; color: string; values: number[] }> = {
    1: {
      name: 'Era I: Steam & Mechanization',
      color: '#F47E2D',
      values: [85, 20, 15, 10, 10],
    },
    2: {
      name: 'Era II: Fordism & Electrification',
      color: '#d97706',
      values: [92, 40, 25, 12, 12],
    },
    3: {
      name: 'Era III: Digital Computation',
      color: '#0056B3',
      values: [98, 75, 45, 15, 15],
    },
    4: {
      name: 'Era IV: Generative AI & Agents',
      color: isDark ? '#38bdf8' : '#002D72',
      values: [99, 94, 55, 20, 20],
    },
  };

  const size = 360;
  const center = size / 2;
  const radius = size * 0.36;

  const toggleEra = (eraNum: number) => {
    if (activeEras.includes(eraNum)) {
      if (activeEras.length > 1) setActiveEras(activeEras.filter((e) => e !== eraNum));
    } else {
      setActiveEras([...activeEras, eraNum]);
    }
  };

  const getPoint = (axisIndex: number, valuePct: number) => {
    const axis = AXES[axisIndex];
    const r = (valuePct / 100) * radius;
    const x = center + Math.cos(axis.angle) * r;
    const y = center + Math.sin(axis.angle) * r;
    return { x, y };
  };

  const generatePolygonPath = (values: number[]) => {
    const points = values.map((val, idx) => {
      const { x, y } = getPoint(idx, val);
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')} Z`;
  };

  return (
    <div className="w-full bg-white dark:bg-[#070b13] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg dark:shadow-2xl space-y-4 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#F47E2D] uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>The Polanyi-Moravec Radar</span>
          </div>
          <h3 className="text-lg font-serif font-bold text-[#002D72] dark:text-white mt-0.5">
            Machine Displacement Reach vs. Human Boundary
          </h3>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono">
          {[1, 2, 3, 4].map((eraNum) => {
            const isChecked = activeEras.includes(eraNum);
            return (
              <button
                key={eraNum}
                onClick={() => toggleEra(eraNum)}
                className={`px-2.5 py-1 rounded transition-all font-bold ${
                  isChecked
                    ? 'bg-white dark:bg-slate-800 shadow-xs ring-1'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
                style={{
                  borderColor: isChecked ? eraRadarData[eraNum].color : undefined,
                  color: isChecked ? eraRadarData[eraNum].color : undefined,
                }}
              >
                Era {eraNum === 1 ? 'I' : eraNum === 2 ? 'II' : eraNum === 3 ? 'III' : 'IV'}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Radar SVG Viewport */}
        <div className="md:col-span-7 flex justify-center py-2 bg-slate-50/70 dark:bg-transparent rounded-xl border border-slate-100 dark:border-transparent">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[380px] h-auto select-none">
            {[20, 40, 60, 80, 100].map((level) => {
              const points = AXES.map((_, idx) => {
                const { x, y } = getPoint(idx, level);
                return `${x},${y}`;
              });
              return (
                <polygon
                  key={level}
                  points={points.join(' ')}
                  fill="none"
                  stroke={isDark ? '#1e293b' : '#cbd5e1'}
                  strokeWidth="1"
                  strokeDasharray="2 4"
                />
              );
            })}

            {AXES.map((_, idx) => {
              const { x, y } = getPoint(idx, 100);
              return (
                <line
                  key={idx}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke={isDark ? '#334155' : '#94a3b8'}
                  strokeWidth="1"
                />
              );
            })}

            {activeEras.map((eraNum) => {
              const data = eraRadarData[eraNum];
              const path = generatePolygonPath(data.values);
              return (
                <g key={eraNum}>
                  <path
                    d={path}
                    fill={data.color}
                    fillOpacity="0.2"
                    stroke={data.color}
                    strokeWidth="2.2"
                    className="transition-all duration-300"
                  />
                  {data.values.map((val, idx) => {
                    const { x, y } = getPoint(idx, val);
                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r={3.5}
                        fill={data.color}
                        stroke={isDark ? '#070b13' : '#ffffff'}
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </g>
              );
            })}

            {AXES.map((axis, idx) => {
              const { x, y } = getPoint(idx, 120);
              return (
                <text
                  key={idx}
                  x={x}
                  y={y}
                  fill={isDark ? '#cbd5e1' : '#0f172a'}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="600"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {axis.label}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Narrative & Explanation Wing */}
        <div className="md:col-span-5 space-y-3 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[#F47E2D] font-bold uppercase tracking-wider block">
              The Cognitive Inversion Boundary:
            </span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans text-xs">
              Notice how <strong>Era I & II</strong> machines expanded along the top spoke (rigid rule codification), while <strong>Era IV AI</strong> surges rightward into high-level symbolic synthesis (94%), yet halts abruptly at the bottom and left spokes: moral accountability and genuine emotional cohesion cannot be delegated to statistical weight matrices.
            </p>
          </div>

          <div className="space-y-1.5">
            {activeEras.map((eraNum) => (
              <div
                key={eraNum}
                className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: eraRadarData[eraNum].color }}
                  />
                  <span className="text-[#002D72] dark:text-white font-bold font-sans">
                    {eraRadarData[eraNum].name}
                  </span>
                </div>
                <span className="text-slate-600 dark:text-slate-400">
                  Symbolic: {eraRadarData[eraNum].values[1]}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
