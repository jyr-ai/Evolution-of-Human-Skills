import React, { useState } from 'react';
import { ShieldCheck, Eye, Layers } from 'lucide-react';

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

const ERA_RADAR_DATA: Record<number, { name: string; color: string; values: number[] }> = {
  1: {
    name: 'Era I: Steam & Mechanization',
    color: '#ea580c',
    values: [85, 20, 15, 10, 10], // High rule codifiability of rotation, negligible cognitive/dexterity
  },
  2: {
    name: 'Era II: Fordism & Electrification',
    color: '#f59e0b',
    values: [92, 40, 25, 12, 12], // Standardized assembly jigs and line speed
  },
  3: {
    name: 'Era III: Digital Computation',
    color: '#0284c7',
    values: [98, 75, 45, 15, 15], // Routine calculation, databases, basic robotics
  },
  4: {
    name: 'Era IV: Generative AI & Agents',
    color: '#38bdf8',
    values: [99, 94, 55, 20, 20], // Massive breakthrough in symbolic reasoning, still struggles with accountability & empathy
  },
};

export const PolanyiRadarChart: React.FC = () => {
  const [activeEras, setActiveEras] = useState<number[]>([1, 4]); // default compare Era 1 vs Era 4

  const size = 360;
  const center = size / 2;
  const radius = size * 0.38;

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
    <div className="w-full bg-[#070b13] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>The Polanyi-Moravec Radar</span>
          </div>
          <h3 className="text-lg font-serif font-bold text-white mt-0.5">
            Machine Displacement Reach vs. Human Boundary
          </h3>
        </div>

        {/* Era Comparison Toggles */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          {[1, 2, 3, 4].map((eraNum) => {
            const isChecked = activeEras.includes(eraNum);
            return (
              <button
                key={eraNum}
                onClick={() => toggleEra(eraNum)}
                className={`px-2.5 py-1 rounded transition-all font-bold ${
                  isChecked
                    ? 'bg-slate-800 text-white shadow-sm ring-1'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                style={{
                  borderColor: isChecked ? ERA_RADAR_DATA[eraNum].color : undefined,
                  color: isChecked ? ERA_RADAR_DATA[eraNum].color : undefined,
                }}
              >
                Era {eraNum === 1 ? 'I' : eraNum === 2 ? 'II' : eraNum === 3 ? 'III' : 'IV'}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Radar SVG Viewport (7 cols) */}
        <div className="md:col-span-7 flex justify-center py-2">
          <svg width={size} height={size} className="select-none">
            {/* Concentric Guide Webs */}
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
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="2 4"
                />
              );
            })}

            {/* Radial Spokes */}
            {AXES.map((axis, idx) => {
              const { x, y } = getPoint(idx, 100);
              return (
                <line
                  key={idx}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="1"
                />
              );
            })}

            {/* Active Polygons */}
            {activeEras.map((eraNum) => {
              const data = ERA_RADAR_DATA[eraNum];
              const path = generatePolygonPath(data.values);
              return (
                <g key={eraNum}>
                  <path
                    d={path}
                    fill={data.color}
                    fillOpacity="0.2"
                    stroke={data.color}
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />
                  {/* Point dots */}
                  {data.values.map((val, idx) => {
                    const { x, y } = getPoint(idx, val);
                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r={3.5}
                        fill={data.color}
                        stroke="#070b13"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </g>
              );
            })}

            {/* Axis Labels */}
            {AXES.map((axis, idx) => {
              const { x, y } = getPoint(idx, 118);
              return (
                <text
                  key={idx}
                  x={x}
                  y={y}
                  fill="#cbd5e1"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {axis.label}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Narrative & Explanation Wing (5 cols) */}
        <div className="md:col-span-5 space-y-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-orange-400 font-bold uppercase tracking-wider block">
              The Cognitive Inversion Boundary:
            </span>
            <p className="text-slate-300 leading-relaxed font-sans text-xs">
              Notice how <strong>Era I & II</strong> machines expanded along the top spoke (rigid rule codification), while <strong>Era IV AI</strong> surges rightward into high-level symbolic synthesis (94%), yet halts abruptly at the bottom and left spokes: moral accountability and genuine emotional cohesion cannot be delegated to statistical weight matrices.
            </p>
          </div>

          <div className="space-y-1.5">
            {activeEras.map((eraNum) => (
              <div
                key={eraNum}
                className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: ERA_RADAR_DATA[eraNum].color }}
                  />
                  <span className="text-white font-bold">{ERA_RADAR_DATA[eraNum].name}</span>
                </div>
                <span className="text-slate-400">
                  Symbolic: {ERA_RADAR_DATA[eraNum].values[1]}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
