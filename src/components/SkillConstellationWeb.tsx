import React, { useState, useRef, useMemo, useEffect } from 'react';
import { NETWORK_DOMAINS, NETWORK_ROLES, NetworkRole } from '../data/skillsNetworkData';
import { ZoomIn, ZoomOut, RotateCcw, Play, Pause, X, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SkillConstellationWebProps {
  onSelectRoleDetailed?: (role: NetworkRole) => void;
  activeYear?: number;
  onYearChange?: (year: number) => void;
}

export const SkillConstellationWeb: React.FC<SkillConstellationWebProps> = ({
  onSelectRoleDetailed,
  activeYear,
}) => {
  const { isDark } = useTheme();

  const derivedEra = useMemo(() => {
    if (!activeYear) return 'all';
    if (activeYear <= 1860) return 1;
    if (activeYear <= 1945) return 2;
    if (activeYear <= 2016) return 3;
    return 4;
  }, [activeYear]);

  const [selectedEra, setSelectedEra] = useState<number | 'all'>(derivedEra);

  useEffect(() => {
    if (activeYear) {
      setSelectedEra(derivedEra);
    }
  }, [activeYear, derivedEra]);

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'obsolescent' | 'transformed' | 'emergent' | 'enduring'>('all');
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
  const [hoveredRole, setHoveredRole] = useState<NetworkRole | null>(null);
  const [activeRole, setActiveRole] = useState<NetworkRole | null>(NETWORK_ROLES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPlayingEra, setIsPlayingEra] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgWidth = 900;
  const svgHeight = 780;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const maxRadius = Math.min(centerX, centerY) - 80;

  useEffect(() => {
    if (!isPlayingEra) return;
    const timer = setInterval(() => {
      setSelectedEra((prev) => {
        if (prev === 'all' || prev === 4) return 1;
        return (prev + 1) as number;
      });
    }, 2800);
    return () => clearInterval(timer);
  }, [isPlayingEra]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const filteredRoles = useMemo(() => {
    return NETWORK_ROLES.filter((role) => {
      const matchEra = selectedEra === 'all' || role.era === selectedEra;
      const matchCat = selectedCategory === 'all' || role.category === selectedCategory;
      const matchDomain = !hoveredDomain || role.domainId === hoveredDomain;
      const matchSearch =
        !searchQuery ||
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.tasks.some((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchEra && matchCat && matchDomain && matchSearch;
    });
  }, [selectedEra, selectedCategory, hoveredDomain, searchQuery]);

  const getRolePosition = (role: NetworkRole) => {
    const domain = NETWORK_DOMAINS.find((d) => d.id === role.domainId) || NETWORK_DOMAINS[0];
    const hash = role.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const angleOffset = ((hash % 11) - 5) * 0.04;
    const angle = domain.angle + angleOffset;
    const r = maxRadius * role.distanceFactor;
    return {
      x: centerX + Math.cos(angle) * r,
      y: centerY + Math.sin(angle) * r,
      angle,
      r,
    };
  };

  const getColorByCategory = (category: string) => {
    switch (category) {
      case 'obsolescent':
        return '#F47E2D'; // DSSG Orange
      case 'transformed':
        return '#d97706'; // Amber
      case 'emergent':
        return isDark ? '#38bdf8' : '#0056B3'; // Sky dark / DSSG Blue light
      case 'enduring':
        return isDark ? '#ffffff' : '#002D72'; // Crisp White dark / DSSG Deep Blue light
      default:
        return '#64748b';
    }
  };

  const canvasBg = isDark ? '#080d17' : '#f8fafc';
  const ringStroke = isDark ? '#1e293b' : '#cbd5e1';
  const hubFill = isDark ? '#0b1222' : '#ffffff';
  const nodeInnerBg = isDark ? '#080d17' : '#ffffff';

  return (
    <div className="w-full bg-white dark:bg-[#070b13] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg dark:shadow-2xl relative flex flex-col transition-colors duration-200">
      {/* Top Interactive Controls Toolbar */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono z-20">
        {/* Left: Era Scrubber & Player */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setIsPlayingEra(!isPlayingEra)}
            className={`px-2.5 py-1 rounded flex items-center gap-1 font-bold transition-colors ${
              isPlayingEra
                ? 'bg-[#F47E2D] text-white'
                : 'text-slate-700 dark:text-slate-300 hover:text-[#002D72] dark:hover:text-white'
            }`}
            title="Autoplay historical progression"
          >
            {isPlayingEra ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPlayingEra ? 'Pause' : 'Play Era'}</span>
          </button>

          <span className="text-slate-300 dark:text-slate-700">|</span>

          {(['all', 1, 2, 3, 4] as const).map((eraVal) => {
            const isSelected = selectedEra === eraVal;
            return (
              <button
                key={eraVal}
                onClick={() => setSelectedEra(eraVal)}
                className={`px-2.5 py-1 rounded transition-all ${
                  isSelected
                    ? 'bg-[#002D72] dark:bg-slate-800 text-white font-bold ring-1 ring-[#0056B3] dark:ring-orange-500/60 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#002D72] dark:hover:text-slate-200'
                }`}
              >
                {eraVal === 'all' ? 'All Eras' : `Era ${eraVal === 1 ? 'I' : eraVal === 2 ? 'II' : eraVal === 3 ? 'III' : 'IV'}`}
              </button>
            );
          })}
        </div>

        {/* Middle: Trajectory Segmented Filter */}
        <div className="hidden lg:flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#002D72] dark:bg-slate-800 text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#002D72] dark:hover:text-white'
            }`}
          >
            All States
          </button>
          <button
            onClick={() => setSelectedCategory('obsolescent')}
            className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors ${
              selectedCategory === 'obsolescent'
                ? 'bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 ring-1 ring-[#F47E2D]/60 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#F47E2D]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#F47E2D] inline-block" />
            <span>Obsolescent</span>
          </button>
          <button
            onClick={() => setSelectedCategory('transformed')}
            className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors ${
              selectedCategory === 'transformed'
                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 ring-1 ring-amber-500/50 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span>Transformed</span>
          </button>
          <button
            onClick={() => setSelectedCategory('emergent')}
            className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors ${
              selectedCategory === 'emergent'
                ? 'bg-blue-100 dark:bg-blue-950/80 text-[#002D72] dark:text-blue-300 ring-1 ring-[#0056B3]/50 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#0056B3] dark:hover:text-blue-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#0056B3] dark:bg-sky-400 inline-block" />
            <span>Emergent</span>
          </button>
          <button
            onClick={() => setSelectedCategory('enduring')}
            className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors ${
              selectedCategory === 'enduring'
                ? 'bg-[#002D72] dark:bg-slate-800 text-white ring-1 ring-[#002D72] dark:ring-white/60 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#002D72] dark:hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#002D72] dark:bg-white inline-block" />
            <span>Enduring Core</span>
          </button>
        </div>

        {/* Right: Search & Zoom */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search job or task..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-36 sm:w-44 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-[#0056B3] dark:focus:ring-orange-500"
          />

          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-0.5 rounded border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.2, 2.2))}
              className="p-1 text-slate-500 dark:text-slate-400 hover:text-[#002D72] dark:hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
              className="p-1 text-slate-500 dark:text-slate-400 hover:text-[#002D72] dark:hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="p-1 text-slate-500 dark:text-slate-400 hover:text-[#002D72] dark:hover:text-white"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Work Map Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="relative w-full h-[580px] sm:h-[680px] overflow-hidden cursor-grab active:cursor-grabbing bg-slate-50 dark:bg-[#080d17] select-none transition-colors duration-200"
      >
        {/* Top-Left Legend Overlay */}
        <div className="absolute top-4 left-4 z-10 p-3.5 bg-white/90 dark:bg-slate-950/85 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 max-w-[290px] shadow-lg pointer-events-none">
          <div className="text-xs font-bold text-[#002D72] dark:text-white mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F47E2D]" />
            <span>Industrial Skills Web</span>
          </div>
          <div className="space-y-1 text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border border-[#F47E2D] inline-block" />
              <span className="w-2.5 h-2.5 rotate-45 border border-[#0056B3] dark:border-sky-400 inline-block" />
              <span>shape = job / task benchmark</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-800 text-[10px] flex-wrap">
              <span className="text-[#F47E2D] font-semibold">● Obsolescent</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">● Transformed</span>
              <span className="text-[#0056B3] dark:text-sky-400 font-semibold">● Emergent</span>
              <span className="text-[#002D72] dark:text-white font-semibold">● Core</span>
            </div>
          </div>
        </div>

        {/* Bottom Interaction Instruction Hint */}
        <div className="absolute bottom-3 left-4 z-10 text-[11px] font-mono text-slate-600 dark:text-slate-400 pointer-events-none bg-white/85 dark:bg-slate-950/75 px-3 py-1 rounded-md border border-slate-200 dark:border-slate-800 shadow-xs">
          hover a group or role to isolate it · drag = pan · click node = inspect
        </div>

        {/* SVG Graph Viewport */}
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          <defs>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={isDark ? '#3b82f6' : '#0056B3'} stopOpacity={isDark ? '0.3' : '0.18'} />
              <stop offset="70%" stopColor="#F47E2D" stopOpacity={isDark ? '0.1' : '0.06'} />
              <stop offset="100%" stopColor={canvasBg} stopOpacity="0" />
            </radialGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Concentric Guide Rings */}
          {[0.25, 0.45, 0.65, 0.85].map((factor, i) => (
            <circle
              key={i}
              cx={centerX}
              cy={centerY}
              r={maxRadius * factor}
              fill="none"
              stroke={ringStroke}
              strokeDasharray="3 6"
              strokeWidth="1"
              opacity={isDark ? '0.45' : '0.8'}
            />
          ))}

          {/* Radial Domain Spokes */}
          {NETWORK_DOMAINS.map((domain) => {
            const isHovered = hoveredDomain === domain.id;
            const x2 = centerX + Math.cos(domain.angle) * (maxRadius * 0.95);
            const y2 = centerY + Math.sin(domain.angle) * (maxRadius * 0.95);

            return (
              <g
                key={domain.id}
                onMouseEnter={() => setHoveredDomain(domain.id)}
                onMouseLeave={() => setHoveredDomain(null)}
                className="cursor-pointer"
              >
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={x2}
                  y2={y2}
                  stroke={isHovered ? domain.color : ringStroke}
                  strokeWidth={isHovered ? 2 : 1}
                  opacity={hoveredDomain && !isHovered ? 0.15 : isDark ? 0.6 : 0.85}
                  style={{ transition: 'stroke 0.2s ease, stroke-width 0.2s ease' }}
                />

                <text
                  x={centerX + Math.cos(domain.angle) * (maxRadius + 18)}
                  y={centerY + Math.sin(domain.angle) * (maxRadius + 18)}
                  fill={isHovered ? (isDark ? '#ffffff' : '#002D72') : isDark ? domain.color : '#334155'}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight={isHovered ? 'bold' : '600'}
                  textAnchor={Math.cos(domain.angle) > 0 ? 'start' : 'end'}
                  dominantBaseline="middle"
                  className="transition-colors"
                >
                  {domain.name}
                </text>
              </g>
            );
          })}

          {/* Central Hub: HUMAN WORK */}
          <circle cx={centerX} cy={centerY} r={80} fill="url(#centerGlow)" />
          <circle
            cx={centerX}
            cy={centerY}
            r={38}
            fill={hubFill}
            stroke="#F47E2D"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
          <text
            x={centerX}
            y={centerY - 6}
            fill={isDark ? '#ffffff' : '#002D72'}
            fontSize="10"
            fontFamily="serif"
            fontWeight="bold"
            textAnchor="middle"
            letterSpacing="0.08em"
          >
            HUMAN
          </text>
          <text
            x={centerX}
            y={centerY + 8}
            fill="#F47E2D"
            fontSize="10"
            fontFamily="serif"
            fontWeight="bold"
            textAnchor="middle"
            letterSpacing="0.08em"
          >
            WORK
          </text>

          {/* Role Nodes & Connecting Filaments */}
          {filteredRoles.map((role) => {
            const { x, y, angle } = getRolePosition(role);
            const isHovered = hoveredRole?.id === role.id;
            const isActive = activeRole?.id === role.id;
            const color = getColorByCategory(role.category);
            const isDimmed =
              (hoveredDomain && role.domainId !== hoveredDomain) ||
              (hoveredRole && hoveredRole.id !== role.id);

            return (
              <g
                key={role.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveRole(role);
                  if (onSelectRoleDetailed) onSelectRoleDetailed(role);
                }}
                onMouseEnter={() => setHoveredRole(role)}
                onMouseLeave={() => setHoveredRole(null)}
                className="cursor-pointer transition-opacity"
                opacity={isDimmed ? 0.2 : 1}
              >
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={x}
                  y2={y}
                  stroke={color}
                  strokeWidth={isActive ? 1.5 : 0.8}
                  strokeDasharray="2 3"
                  opacity={isActive || isHovered ? 0.85 : isDark ? 0.3 : 0.45}
                />

                {role.tasks.map((task, tIdx) => {
                  const taskAngle = angle + ((tIdx - (role.tasks.length - 1) / 2) * 0.12);
                  const taskR = maxRadius * (role.distanceFactor + 0.08);
                  const tx = centerX + Math.cos(taskAngle) * taskR;
                  const ty = centerY + Math.sin(taskAngle) * taskR;
                  const isTaskReplaced = task.status === 'replaced';

                  return (
                    <g key={tIdx}>
                      <line
                        x1={x}
                        y1={y}
                        x2={tx}
                        y2={ty}
                        stroke={isTaskReplaced ? '#F47E2D' : isDark ? '#38bdf8' : '#0056B3'}
                        strokeWidth={0.6}
                        opacity={isActive || isHovered ? 0.75 : 0.35}
                      />
                      {isTaskReplaced ? (
                        <rect
                          x={tx - 2.5}
                          y={ty - 2.5}
                          width="5"
                          height="5"
                          transform={`rotate(45 ${tx} ${ty})`}
                          fill="#F47E2D"
                          opacity={0.85}
                        />
                      ) : (
                        <circle
                          cx={tx}
                          cy={ty}
                          r={task.status === 'enduring' ? 3 : 2}
                          fill={
                            task.status === 'enduring'
                              ? isDark
                                ? '#ffffff'
                                : '#002D72'
                              : isDark
                              ? '#38bdf8'
                              : '#0056B3'
                          }
                          opacity={0.9}
                        />
                      )}
                    </g>
                  );
                })}

                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 10 : 7}
                  fill={nodeInnerBg}
                  stroke={color}
                  strokeWidth={isActive ? 2.5 : 1.75}
                  filter={isDark && (isActive || isHovered) ? 'url(#glow)' : undefined}
                />
                <circle cx={x} cy={y} r={isActive ? 4 : 2.5} fill={color} />

                <text
                  x={x + (Math.cos(angle) >= 0 ? 12 : -12)}
                  y={y + 3}
                  fill={
                    isActive
                      ? isDark
                        ? '#ffffff'
                        : '#002D72'
                      : isHovered
                      ? isDark
                        ? '#f1f5f9'
                        : '#0f172a'
                      : isDark
                      ? '#cbd5e1'
                      : '#334155'
                  }
                  fontSize={isActive ? '11' : '9'}
                  fontFamily="sans-serif"
                  fontWeight={isActive ? '700' : '500'}
                  stroke={canvasBg}
                  strokeWidth="2.5"
                  paintOrder="stroke fill"
                  textAnchor={Math.cos(angle) >= 0 ? 'start' : 'end'}
                  className="pointer-events-none"
                >
                  {role.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Live Role Inspection Drawer */}
        {activeRole && (
          <div className="absolute top-4 right-4 z-20 w-80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xl space-y-3 animate-in fade-in slide-in-from-right-2 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: getColorByCategory(activeRole.category) }}
                />
                <span className="font-bold text-[#002D72] dark:text-white uppercase tracking-wider">
                  {activeRole.category}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500 dark:text-slate-400">Era {activeRole.era}</span>
              </div>
              <button
                onClick={() => setActiveRole(null)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h4 className="text-base font-serif font-bold text-[#002D72] dark:text-white">
                {activeRole.name}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-sans mt-0.5">
                Displaced or Shaped By: <strong className="text-slate-900 dark:text-slate-200">{activeRole.displacingTech}</strong>
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs font-mono">
              <div>
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  <span>Physical Muscular Load:</span>
                  <span className="text-[#F47E2D] font-bold">{activeRole.physicalLoad}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#F47E2D] h-full rounded-full"
                    style={{ width: `${activeRole.physicalLoad}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  <span>Cognitive / Symbolic Load:</span>
                  <span className="text-[#0056B3] dark:text-sky-400 font-bold">{activeRole.cognitiveLoad}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0056B3] dark:bg-sky-400 h-full rounded-full"
                    style={{ width: `${activeRole.cognitiveLoad}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Deconstructed Tasks & Exposure:
              </div>
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {activeRole.tasks.map((task, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs p-1.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/60"
                  >
                    <span className="text-slate-800 dark:text-slate-200 truncate">{task.name}</span>
                    <span
                      className={`text-[10px] font-mono font-bold shrink-0 ml-2 px-1.5 py-0.5 rounded ${
                        task.status === 'replaced'
                          ? 'bg-orange-100 dark:bg-orange-950 text-[#F47E2D]'
                          : task.status === 'created'
                          ? 'bg-blue-100 dark:bg-blue-950 text-[#0056B3] dark:text-sky-400'
                          : task.status === 'enduring'
                          ? 'bg-[#002D72] dark:bg-slate-800 text-white'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
