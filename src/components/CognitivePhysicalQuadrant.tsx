import React, { useState } from 'react';
import { NETWORK_ROLES, NetworkRole } from '../data/skillsNetworkData';
import { Compass, Play, Pause, ChevronRight, Sparkles } from 'lucide-react';

interface CognitivePhysicalQuadrantProps {
  activeYear?: number;
}

export const CognitivePhysicalQuadrant: React.FC<CognitivePhysicalQuadrantProps> = ({ activeYear }) => {
  const derivedEra = React.useMemo(() => {
    if (!activeYear) return 'all';
    if (activeYear <= 1860) return 1;
    if (activeYear <= 1945) return 2;
    if (activeYear <= 2016) return 3;
    return 4;
  }, [activeYear]);

  const [selectedEra, setSelectedEra] = useState<number | 'all'>(derivedEra);

  React.useEffect(() => {
    if (activeYear) {
      setSelectedEra(derivedEra);
    }
  }, [activeYear, derivedEra]);
  const [selectedRole, setSelectedRole] = useState<NetworkRole | null>(NETWORK_ROLES[NETWORK_ROLES.length - 1]);
  const [filterTrajectory, setFilterTrajectory] = useState<'all' | 'obsolescent' | 'transformed' | 'emergent' | 'enduring'>('all');

  const width = 640;
  const height = 480;
  const padding = 55;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;

  // Convert 0-100 to canvas coords
  // X: Physical Load (0 = left, 100 = right)
  // Y: Cognitive Load (0 = bottom, 100 = top)
  const getCoords = (physical: number, cognitive: number) => {
    const x = padding + (physical / 100) * plotWidth;
    const y = padding + plotHeight - (cognitive / 100) * plotHeight;
    return { x, y };
  };

  const filteredRoles = NETWORK_ROLES.filter((role) => {
    const matchEra = selectedEra === 'all' || role.era === selectedEra;
    const matchTraj = filterTrajectory === 'all' || role.category === filterTrajectory;
    return matchEra && matchTraj;
  });

  const getBubbleColor = (category: string) => {
    switch (category) {
      case 'obsolescent':
        return '#f97316';
      case 'transformed':
        return '#f59e0b';
      case 'emergent':
        return '#38bdf8';
      case 'enduring':
        return '#ffffff';
      default:
        return '#94a3b8';
    }
  };

  return (
    <div className="w-full bg-[#070b13] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5" />
            <span>2D Load Migration Quadrant</span>
          </div>
          <h3 className="text-lg font-serif font-bold text-white mt-0.5">
            Cognitive vs. Physical Load Displacement Matrix
          </h3>
        </div>

        {/* Era Segmented Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          {(['all', 1, 2, 3, 4] as const).map((eraVal) => (
            <button
              key={eraVal}
              onClick={() => setSelectedEra(eraVal)}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedEra === eraVal
                  ? 'bg-slate-800 text-white font-bold ring-1 ring-orange-500/60'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {eraVal === 'all' ? 'All' : `Era ${eraVal === 1 ? 'I' : eraVal === 2 ? 'II' : eraVal === 3 ? 'III' : 'IV'}`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Quadrant Chart + Live Role Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* The 2D Quadrant SVG (7 cols) */}
        <div className="lg:col-span-8 relative bg-slate-950/70 rounded-xl border border-slate-800/80 p-2 overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
            {/* Quadrant Background Tints */}
            {/* Top-Left: Pure Cognitive */}
            <rect
              x={padding}
              y={padding}
              width={plotWidth / 2}
              height={plotHeight / 2}
              fill="#38bdf8"
              opacity="0.04"
            />
            {/* Top-Right: High-Acuity Hybrid & Resilient Trades */}
            <rect
              x={padding + plotWidth / 2}
              y={padding}
              width={plotWidth / 2}
              height={plotHeight / 2}
              fill="#ffffff"
              opacity="0.03"
            />
            {/* Bottom-Right: Muscle & Manual Sweat */}
            <rect
              x={padding + plotWidth / 2}
              y={padding + plotHeight / 2}
              width={plotWidth / 2}
              height={plotHeight / 2}
              fill="#f97316"
              opacity="0.04"
            />
            {/* Bottom-Left: Routine Clerical / Low Physical */}
            <rect
              x={padding}
              y={padding + plotHeight / 2}
              width={plotWidth / 2}
              height={plotHeight / 2}
              fill="#f59e0b"
              opacity="0.03"
            />

            {/* Quadrant Axis Dividers (50% lines) */}
            <line
              x1={padding + plotWidth / 2}
              y1={padding}
              x2={padding + plotWidth / 2}
              y2={padding + plotHeight}
              stroke="#334155"
              strokeDasharray="4 4"
              strokeWidth="1.2"
            />
            <line
              x1={padding}
              y1={padding + plotHeight / 2}
              x2={padding + plotWidth}
              y2={padding + plotHeight / 2}
              stroke="#334155"
              strokeDasharray="4 4"
              strokeWidth="1.2"
            />

            {/* Quadrant Watermark Labels */}
            <text
              x={padding + 12}
              y={padding + 22}
              fill="#38bdf8"
              opacity="0.5"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              QUADRANT II: PURE SYMBOLIC COGNITION (AI CONTESTED)
            </text>
            <text
              x={padding + plotWidth - 12}
              y={padding + 22}
              fill="#ffffff"
              opacity="0.6"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="end"
            >
              QUADRANT I: HIGH-ACUITY SOMATIC (MORAVEC IMMUNITY)
            </text>
            <text
              x={padding + 12}
              y={padding + plotHeight - 12}
              fill="#f59e0b"
              opacity="0.5"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              QUADRANT III: ROUTINE CLERICAL (AUTOMATED IN ERA 3)
            </text>
            <text
              x={padding + plotWidth - 12}
              y={padding + plotHeight - 12}
              fill="#f97316"
              opacity="0.5"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="end"
            >
              QUADRANT IV: MANUAL STAMINA (STEAM/FORDIAN TARGET)
            </text>

            {/* Axis Labels */}
            <text
              x={padding + plotWidth / 2}
              y={height - 12}
              fill="#94a3b8"
              fontSize="11"
              fontFamily="monospace"
              textAnchor="middle"
            >
              PHYSICAL / MUSCULAR LOAD (0% → 100%)
            </text>
            <text
              x={16}
              y={padding + plotHeight / 2}
              fill="#94a3b8"
              fontSize="11"
              fontFamily="monospace"
              textAnchor="middle"
              transform={`rotate(-90 16 ${padding + plotHeight / 2})`}
            >
              COGNITIVE / SYMBOLIC LOAD (0% → 100%)
            </text>

            {/* Outer Plot Box */}
            <rect
              x={padding}
              y={padding}
              width={plotWidth}
              height={plotHeight}
              fill="none"
              stroke="#1e293b"
              strokeWidth="1.5"
            />

            {/* Role Bubbles */}
            {filteredRoles.map((role) => {
              const { x, y } = getCoords(role.physicalLoad, role.cognitiveLoad);
              const isSelected = selectedRole?.id === role.id;
              const color = getBubbleColor(role.category);

              return (
                <g
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  {/* Outer pulse if selected */}
                  {isSelected && (
                    <circle
                      cx={x}
                      cy={y}
                      r={14}
                      fill="none"
                      stroke={color}
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}
                  {/* Bubble body */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 8 : 6}
                    fill={color}
                    fillOpacity={isSelected ? 1 : 0.8}
                    stroke="#080d17"
                    strokeWidth="1.5"
                  />
                  {/* Mini role label */}
                  <text
                    x={x + 9}
                    y={y + 3}
                    fill={isSelected ? '#ffffff' : '#cbd5e1'}
                    fontSize={isSelected ? '10' : '8'}
                    fontFamily="sans-serif"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    className="pointer-events-none drop-shadow"
                  >
                    {role.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Live Role Inspector Card (5 cols) */}
        <div className="lg:col-span-4 p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-4">
          {selectedRole ? (
            <>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: getBubbleColor(selectedRole.category) }}
                  />
                  <span className="font-bold uppercase text-white tracking-wider">
                    {selectedRole.category}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">Era {selectedRole.era}</span>
              </div>

              <div>
                <h4 className="text-base font-serif font-bold text-white">
                  {selectedRole.name}
                </h4>
                <div className="text-xs text-slate-300 font-sans mt-1">
                  Displacing Machine / Tech:{' '}
                  <strong className="text-orange-400 font-normal">{selectedRole.displacingTech}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Physical Load:</span>
                  <span className="text-base font-bold text-orange-400">{selectedRole.physicalLoad}%</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Cognitive Load:</span>
                  <span className="text-base font-bold text-sky-400">{selectedRole.cognitiveLoad}%</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Deconstructed Micro-Tasks:
                </span>
                <div className="space-y-1">
                  {selectedRole.tasks.map((t, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs p-1 rounded bg-slate-950/60 border border-slate-800"
                    >
                      <span className="text-slate-300 truncate">{t.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0 font-bold ml-1">
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-xs text-slate-500 font-mono">
              Click any bubble in the quadrant to inspect its load profile.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
