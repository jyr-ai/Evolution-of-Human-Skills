import React, { useState, useMemo } from 'react';
import { NETWORK_ROLES, NetworkRole } from '../data/skillsNetworkData';
import { Compass, Filter } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface CognitivePhysicalQuadrantProps {
  activeYear?: number;
}

type QuadrantId = 'q1' | 'q2' | 'q3' | 'q4';

export const CognitivePhysicalQuadrant: React.FC<CognitivePhysicalQuadrantProps> = ({ activeYear }) => {
  const { isDark } = useTheme();

  const derivedEra = useMemo(() => {
    if (!activeYear) return 'all';
    if (activeYear <= 1860) return 1;
    if (activeYear <= 1945) return 2;
    if (activeYear <= 2016) return 3;
    return 4;
  }, [activeYear]);

  const [selectedEra, setSelectedEra] = useState<number | 'all'>(derivedEra);
  const [selectedRole, setSelectedRole] = useState<NetworkRole | null>(NETWORK_ROLES[NETWORK_ROLES.length - 1]);
  const [filterTrajectory, setFilterTrajectory] = useState<'all' | 'obsolescent' | 'transformed' | 'emergent' | 'enduring'>('all');
  const [focusedQuadrant, setFocusedQuadrant] = useState<QuadrantId | 'all'>('all');

  React.useEffect(() => {
    if (activeYear) {
      setSelectedEra(derivedEra);
    }
  }, [activeYear, derivedEra]);

  const width = 680;
  const height = 480;
  const padding = 55;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;

  const getCoords = (physical: number, cognitive: number) => {
    const inset = 16;
    const effectiveWidth = plotWidth - inset * 2;
    const effectiveHeight = plotHeight - inset * 2;
    const x = padding + inset + (physical / 100) * effectiveWidth;
    const y = padding + inset + effectiveHeight - (cognitive / 100) * effectiveHeight;
    return { x, y };
  };

  const getRoleQuadrant = (physical: number, cognitive: number): QuadrantId => {
    if (physical >= 50 && cognitive >= 50) return 'q1';
    if (physical < 50 && cognitive >= 50) return 'q2';
    if (physical < 50 && cognitive < 50) return 'q3';
    return 'q4';
  };

  const filteredRoles = useMemo(() => {
    return NETWORK_ROLES.filter((role) => {
      const matchEra = selectedEra === 'all' || role.era === selectedEra;
      const matchTraj = filterTrajectory === 'all' || role.category === filterTrajectory;
      const quad = getRoleQuadrant(role.physicalLoad, role.cognitiveLoad);
      const matchQuad = focusedQuadrant === 'all' || quad === focusedQuadrant;
      return matchEra && matchTraj && matchQuad;
    });
  }, [selectedEra, filterTrajectory, focusedQuadrant]);

  const quadrantCounts = useMemo(() => {
    const baseList = NETWORK_ROLES.filter((role) => {
      const matchEra = selectedEra === 'all' || role.era === selectedEra;
      const matchTraj = filterTrajectory === 'all' || role.category === filterTrajectory;
      return matchEra && matchTraj;
    });

    return {
      q1: baseList.filter((r) => getRoleQuadrant(r.physicalLoad, r.cognitiveLoad) === 'q1').length,
      q2: baseList.filter((r) => getRoleQuadrant(r.physicalLoad, r.cognitiveLoad) === 'q2').length,
      q3: baseList.filter((r) => getRoleQuadrant(r.physicalLoad, r.cognitiveLoad) === 'q3').length,
      q4: baseList.filter((r) => getRoleQuadrant(r.physicalLoad, r.cognitiveLoad) === 'q4').length,
    };
  }, [selectedEra, filterTrajectory]);

  const getBubbleColor = (category: string) => {
    switch (category) {
      case 'obsolescent':
        return '#F47E2D';
      case 'transformed':
        return '#f59e0b';
      case 'emergent':
        return isDark ? '#38bdf8' : '#0056B3';
      case 'enduring':
        return isDark ? '#ffffff' : '#002D72';
      default:
        return '#64748b';
    }
  };

  const plotBg = isDark ? '#050811' : '#f8fafc';

  return (
    <div className="w-full bg-white dark:bg-[#070b13] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg dark:shadow-2xl space-y-4 transition-colors duration-200">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#F47E2D] uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5" />
            <span>2D Load Migration Quadrant</span>
          </div>
          <h3 className="text-lg font-serif font-bold text-[#002D72] dark:text-white mt-0.5">
            Cognitive vs. Physical Load Displacement Matrix
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {focusedQuadrant !== 'all' && (
            <button
              onClick={() => setFocusedQuadrant('all')}
              className="px-2.5 py-1 rounded bg-orange-50 dark:bg-orange-950/70 border border-orange-300 dark:border-orange-500/50 text-[#F47E2D] text-xs font-mono font-semibold hover:bg-orange-100 dark:hover:bg-orange-900/80 transition-colors"
            >
              Reset Quadrant Filter
            </button>
          )}

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono">
            {(['all', 1, 2, 3, 4] as const).map((eraVal) => (
              <button
                key={eraVal}
                onClick={() => setSelectedEra(eraVal)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  selectedEra === eraVal
                    ? 'bg-[#002D72] dark:bg-slate-800 text-white font-bold ring-1 ring-[#0056B3] dark:ring-orange-500/60'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#002D72] dark:hover:text-white'
                }`}
              >
                {eraVal === 'all' ? 'All' : `Era ${eraVal === 1 ? 'I' : eraVal === 2 ? 'II' : eraVal === 3 ? 'III' : 'IV'}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trajectory Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-500 dark:text-slate-400 text-[11px] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" /> Filter:
          </span>
          {(['all', 'obsolescent', 'transformed', 'emergent', 'enduring'] as const).map((traj) => (
            <button
              key={traj}
              onClick={() => setFilterTrajectory(traj)}
              className={`px-2.5 py-1 rounded-md text-[11px] capitalize transition-all ${
                filterTrajectory === traj
                  ? 'bg-[#002D72] dark:bg-slate-800 text-white font-semibold'
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-[#002D72] dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {traj}
            </button>
          ))}
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400">
          Showing <span className="text-[#002D72] dark:text-white font-bold">{filteredRoles.length}</span> roles mapped
        </div>
      </div>

      {/* Main Grid: Quadrant Chart + Live Role Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-2.5">
          {/* TOP EXTERNAL CARDS: QUADRANT II (LEFT) & QUADRANT I (RIGHT) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Top-Left Card: Quadrant II */}
            <div
              onClick={() => setFocusedQuadrant(focusedQuadrant === 'q2' ? 'all' : 'q2')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                focusedQuadrant === 'q2'
                  ? 'bg-blue-50 dark:bg-sky-950/60 border-[#0056B3] dark:border-sky-400 ring-2 ring-[#0056B3]/30 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-900/70 border-slate-200 dark:border-sky-500/25 hover:border-[#0056B3] dark:hover:border-sky-400/50 hover:bg-white dark:hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0056B3] dark:text-sky-400 tracking-wide">
                  QUADRANT II · SYMBOLIC COGNITION
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-sky-950 text-[#002D72] dark:text-sky-300 border border-blue-200 dark:border-sky-800/50">
                  {quadrantCounts.q2} roles
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                <strong className="text-[#002D72] dark:text-sky-300 font-semibold">High Cognitive, Low Physical</strong> · AI Contested (Code, Law, Analysis, Creative Synthesis)
              </p>
            </div>

            {/* Top-Right Card: Quadrant I */}
            <div
              onClick={() => setFocusedQuadrant(focusedQuadrant === 'q1' ? 'all' : 'q1')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                focusedQuadrant === 'q1'
                  ? 'bg-slate-100 dark:bg-slate-800/80 border-[#002D72] dark:border-slate-300 ring-2 ring-[#002D72]/25 dark:ring-white/30 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-900/70 border-slate-200 dark:border-slate-700 hover:border-[#002D72] dark:hover:border-slate-500 hover:bg-white dark:hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#002D72] dark:text-white tracking-wide">
                  QUADRANT I · HIGH-ACUITY SOMATIC
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                  {quadrantCounts.q1} roles
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                <strong className="text-slate-900 dark:text-white font-semibold">High Somatic & Cognitive</strong> · Moravec Immunity (Precision Surgery, Electrician, Specialized Care)
              </p>
            </div>
          </div>

          {/* 2D QUADRANT SVG PLOT CANVAS */}
          <div className="relative bg-slate-50 dark:bg-[#050811] rounded-xl border border-slate-200 dark:border-slate-800/90 p-2 overflow-hidden shadow-inner">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
              <rect
                x={padding}
                y={padding}
                width={plotWidth / 2}
                height={plotHeight / 2}
                fill={isDark ? '#38bdf8' : '#0056B3'}
                opacity={focusedQuadrant === 'q2' ? 0.1 : 0.04}
              />
              <rect
                x={padding + plotWidth / 2}
                y={padding}
                width={plotWidth / 2}
                height={plotHeight / 2}
                fill={isDark ? '#ffffff' : '#002D72'}
                opacity={focusedQuadrant === 'q1' ? 0.09 : 0.03}
              />
              <rect
                x={padding + plotWidth / 2}
                y={padding + plotHeight / 2}
                width={plotWidth / 2}
                height={plotHeight / 2}
                fill="#F47E2D"
                opacity={focusedQuadrant === 'q4' ? 0.12 : 0.05}
              />
              <rect
                x={padding}
                y={padding + plotHeight / 2}
                width={plotWidth / 2}
                height={plotHeight / 2}
                fill="#f59e0b"
                opacity={focusedQuadrant === 'q3' ? 0.1 : 0.04}
              />

              {/* Crosshair Lines */}
              <line
                x1={padding + plotWidth / 2}
                y1={padding}
                x2={padding + plotWidth / 2}
                y2={padding + plotHeight}
                stroke={isDark ? '#334155' : '#94a3b8'}
                strokeDasharray="4 4"
                strokeWidth="1.2"
              />
              <line
                x1={padding}
                y1={padding + plotHeight / 2}
                x2={padding + plotWidth}
                y2={padding + plotHeight / 2}
                stroke={isDark ? '#334155' : '#94a3b8'}
                strokeDasharray="4 4"
                strokeWidth="1.2"
              />

              {/* Watermark Roman Numerals */}
              <text
                x={padding + 16}
                y={padding + 28}
                fill={isDark ? '#38bdf8' : '#0056B3'}
                opacity="0.22"
                fontSize="22"
                fontFamily="monospace"
                fontWeight="bold"
                className="pointer-events-none select-none"
              >
                II
              </text>
              <text
                x={padding + plotWidth - 16}
                y={padding + 28}
                textAnchor="end"
                fill={isDark ? '#ffffff' : '#002D72'}
                opacity="0.22"
                fontSize="22"
                fontFamily="monospace"
                fontWeight="bold"
                className="pointer-events-none select-none"
              >
                I
              </text>
              <text
                x={padding + 16}
                y={padding + plotHeight - 16}
                fill="#d97706"
                opacity="0.22"
                fontSize="22"
                fontFamily="monospace"
                fontWeight="bold"
                className="pointer-events-none select-none"
              >
                III
              </text>
              <text
                x={padding + plotWidth - 16}
                y={padding + plotHeight - 16}
                textAnchor="end"
                fill="#F47E2D"
                opacity="0.25"
                fontSize="22"
                fontFamily="monospace"
                fontWeight="bold"
                className="pointer-events-none select-none"
              >
                IV
              </text>

              {/* Outer Axis Labels */}
              <text
                x={padding + plotWidth / 2}
                y={height - 12}
                fill={isDark ? '#94a3b8' : '#475569'}
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
              >
                PHYSICAL / MUSCULAR LOAD (0% → 100%)
              </text>
              <text
                x={16}
                y={padding + plotHeight / 2}
                fill={isDark ? '#94a3b8' : '#475569'}
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
                transform={`rotate(-90 16 ${padding + plotHeight / 2})`}
              >
                COGNITIVE / SYMBOLIC LOAD (0% → 100%)
              </text>

              <rect
                x={padding}
                y={padding}
                width={plotWidth}
                height={plotHeight}
                fill="none"
                stroke={isDark ? '#1e293b' : '#cbd5e1'}
                strokeWidth="1.5"
              />

              {/* Role Bubbles */}
              {filteredRoles.map((role) => {
                const { x, y } = getCoords(role.physicalLoad, role.cognitiveLoad);
                const isSelected = selectedRole?.id === role.id;
                const color = getBubbleColor(role.category);
                const isNearRight = x > padding + plotWidth - 95;
                const textX = isNearRight ? x - 10 : x + 10;
                const textAnchor = isNearRight ? 'end' : 'start';

                return (
                  <g
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className="cursor-pointer transition-transform hover:scale-110"
                  >
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r={15}
                        fill="none"
                        stroke={color}
                        strokeWidth="1.8"
                        strokeDasharray="3 3"
                        className="animate-spin"
                        style={{ transformOrigin: `${x}px ${y}px`, animationDuration: '6s' }}
                      />
                    )}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 8 : 6}
                      fill={color}
                      fillOpacity={isSelected ? 1 : 0.88}
                      stroke={plotBg}
                      strokeWidth="1.8"
                    />
                    <text
                      x={textX}
                      y={y + 3.5}
                      textAnchor={textAnchor}
                      fill={isSelected ? (isDark ? '#ffffff' : '#002D72') : isDark ? '#e2e8f0' : '#1e293b'}
                      fontSize={isSelected ? '10' : '8.5'}
                      fontFamily="sans-serif"
                      fontWeight={isSelected ? 'bold' : '500'}
                      stroke={plotBg}
                      strokeWidth="3"
                      paintOrder="stroke fill"
                      className="pointer-events-none select-none"
                    >
                      {role.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* BOTTOM EXTERNAL CARDS: QUADRANT III (LEFT) & QUADRANT IV (RIGHT) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => setFocusedQuadrant(focusedQuadrant === 'q3' ? 'all' : 'q3')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                focusedQuadrant === 'q3'
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 dark:border-amber-400 ring-2 ring-amber-500/30 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-900/70 border-slate-200 dark:border-amber-500/25 hover:border-amber-500 dark:hover:border-amber-400/50 hover:bg-white dark:hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 tracking-wide">
                  QUADRANT III · ROUTINE CLERICAL
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                  {quadrantCounts.q3} roles
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                <strong className="text-amber-900 dark:text-amber-300 font-semibold">Low Physical, Low Cognitive</strong> · Era 3 Displaced (Bookkeeping, Routine Typist, Switchboard)
              </p>
            </div>

            <div
              onClick={() => setFocusedQuadrant(focusedQuadrant === 'q4' ? 'all' : 'q4')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                focusedQuadrant === 'q4'
                  ? 'bg-orange-50 dark:bg-orange-950/60 border-[#F47E2D] ring-2 ring-[#F47E2D]/30 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-900/70 border-slate-200 dark:border-orange-500/25 hover:border-[#F47E2D] hover:bg-white dark:hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#F47E2D] tracking-wide">
                  QUADRANT IV · MANUAL STAMINA
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800/50">
                  {quadrantCounts.q4} roles
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                <strong className="text-orange-900 dark:text-orange-300 font-semibold">High Muscular, Low Cognitive</strong> · Steam & Fordian Mechanization (Assembly, Manual Hauling)
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Live Role Inspector Card */}
        <div className="lg:col-span-4 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 space-y-4 shadow-md">
          {selectedRole ? (
            <>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: getBubbleColor(selectedRole.category) }}
                  />
                  <span className="font-bold uppercase text-[#002D72] dark:text-white tracking-wider">
                    {selectedRole.category}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Era {selectedRole.era}</span>
              </div>

              <div>
                <h4 className="text-base font-serif font-bold text-[#002D72] dark:text-white">
                  {selectedRole.name}
                </h4>
                <div className="text-xs text-slate-600 dark:text-slate-300 font-sans mt-1">
                  Displacing Machine / Tech:{' '}
                  <strong className="text-[#F47E2D] font-semibold">{selectedRole.displacingTech}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Physical Load:</span>
                  <span className="text-base font-bold text-[#F47E2D]">{selectedRole.physicalLoad}%</span>
                </div>
                <div className="p-2.5 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Cognitive Load:</span>
                  <span className="text-base font-bold text-[#0056B3] dark:text-sky-400">{selectedRole.cognitiveLoad}%</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Deconstructed Micro-Tasks:
                </span>
                <div className="space-y-1">
                  {selectedRole.tasks.map((t, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs p-1.5 rounded bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800"
                    >
                      <span className="text-slate-700 dark:text-slate-300 truncate">{t.name}</span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 shrink-0 font-bold ml-1">
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Quadrant:</span>
                <span className="text-[#002D72] dark:text-white font-semibold">
                  {getRoleQuadrant(selectedRole.physicalLoad, selectedRole.cognitiveLoad).toUpperCase()}
                </span>
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
