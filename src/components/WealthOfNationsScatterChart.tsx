import React, { useState, useMemo } from 'react';
import { WEALTH_OF_NATIONS_ERAS_DATA } from '../data/wealthOfNationsData';
import { CountryShiftTrajectory } from '../types/wealthOfNations';
import {
  Globe2,
  TrendingUp,
  AlertTriangle,
  Cpu,
  Brain,
  Wrench,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  DollarSign,
  Maximize2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface WealthOfNationsScatterChartProps {
  eraId: string; // 'era-1' | 'era-2' | 'era-3' | 'era-4'
  className?: string;
}

export const WealthOfNationsScatterChart: React.FC<WealthOfNationsScatterChartProps> = ({
  eraId,
  className = '',
}) => {
  const eraData = WEALTH_OF_NATIONS_ERAS_DATA[eraId] || WEALTH_OF_NATIONS_ERAS_DATA['era-1'];

  // State
  // timeProgress: 0.0 = Start of Era, 1.0 = End of Era
  const [timeProgress, setTimeProgress] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryShiftTrajectory | null>(
    eraData.countries[0] || null
  );
  const [hoveredCountry, setHoveredCountry] = useState<CountryShiftTrajectory | null>(null);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [colorMode, setColorMode] = useState<'gdp' | 'risk' | 'region'>('risk');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high_cognitive' | 'high_manual'>('all');

  // Animation engine for scrub/play
  React.useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimeProgress((prev) => {
        if (prev >= 1.0) {
          return 0.0;
        }
        return Math.min(1.0, +(prev + 0.04).toFixed(3));
      });
    }, 80);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Keep selected country valid when eraId changes
  React.useEffect(() => {
    if (eraData.countries.length > 0) {
      setSelectedCountry(eraData.countries[0]);
    }
  }, [eraId]);

  // Dimensions for responsive SVG canvas
  const width = 760;
  const height = 480;
  const padding = { top: 35, right: 40, bottom: 65, left: 75 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Max and Min for GDP scaling in this era
  const { maxGdp, minGdp } = useMemo(() => {
    let max = 0;
    let min = Infinity;
    eraData.countries.forEach((c) => {
      const gdpAtStart = c.startGdpPerCapita;
      const gdpAtEnd = c.endGdpPerCapita;
      max = Math.max(max, gdpAtStart, gdpAtEnd);
      min = Math.min(min, gdpAtStart, gdpAtEnd);
    });
    return { maxGdp: max, minGdp: min };
  }, [eraData]);

  // Compute interpolated point for a country at current timeProgress
  const getCountryPosition = (country: CountryShiftTrajectory, progress: number) => {
    const xVal =
      country.startSkillDiversity +
      (country.endSkillDiversity - country.startSkillDiversity) * progress;
    const yVal =
      country.startTechMight + (country.endTechMight - country.startTechMight) * progress;
    const gdpVal =
      country.startGdpPerCapita +
      (country.endGdpPerCapita - country.startGdpPerCapita) * progress;

    // Convert to SVG coordinates
    // X axis: 0 to 100
    const cx = padding.left + (xVal / 100) * plotWidth;
    // Y axis: 0 to 100 (inverted SVG y)
    const cy = padding.top + plotHeight - (yVal / 100) * plotHeight;

    // Bubble radius scaled by GDP per capita (sqrt scale between 7px and 24px)
    const normalizedGdp = (gdpVal - minGdp) / (maxGdp - minGdp || 1);
    const radius = 7 + Math.sqrt(Math.max(0, normalizedGdp)) * 17;

    return { cx, cy, radius, xVal, yVal, gdpVal };
  };

  // Color mapper based on selected visualization lens
  const getBubbleColor = (country: CountryShiftTrajectory) => {
    if (colorMode === 'region') {
      switch (country.region) {
        case 'North America':
          return '#38bdf8'; // Sky blue
        case 'Western Europe':
          return '#a855f7'; // Purple
        case 'East Asia':
          return '#f97316'; // Orange
        default:
          return '#10b981'; // Emerald
      }
    }

    if (colorMode === 'gdp') {
      const currentGdp =
        country.startGdpPerCapita +
        (country.endGdpPerCapita - country.startGdpPerCapita) * timeProgress;
      const ratio = (currentGdp - minGdp) / (maxGdp - minGdp || 1);
      if (ratio > 0.75) return '#10b981'; // Emerald wealthy
      if (ratio > 0.45) return '#38bdf8'; // Sky blue
      if (ratio > 0.2) return '#fbbf24'; // Amber
      return '#f43f5e'; // Rose
    }

    // Risk of replacement mode
    // Highlights manual vs cognitive exposure
    const { manualReplacementRisk, cognitiveReplacementRisk } = country.riskSummary;
    if (cognitiveReplacementRisk >= 70 && manualReplacementRisk >= 60) {
      return '#ec4899'; // Dual risk (Hot Pink)
    }
    if (cognitiveReplacementRisk > manualReplacementRisk) {
      return '#a855f7'; // Cognitive risk dominant (Purple / AI)
    }
    if (manualReplacementRisk >= 60) {
      return '#f97316'; // Manual mechanization dominant (Orange / Machinery)
    }
    return '#3b82f6'; // Moderate exposure (Blue)
  };

  // Current year representation
  const displayedYear = Math.round(
    eraData.startYear + (eraData.endYear - eraData.startYear) * timeProgress
  );

  const activeInspection = hoveredCountry || selectedCountry || eraData.countries[0];

  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-gradient-to-b from-[#080d1a] to-[#04070f] p-4 sm:p-6 shadow-2xl ${className}`}
    >
      {/* Top Header & Framing */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-orange-400">
            <Globe2 className="w-4 h-4 text-orange-400" />
            <span>Macro Frontier · Wealth of Nations Scatter Matrix</span>
            <span className="text-slate-600">·</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700/80 text-slate-300 font-semibold">
              Era {eraData.eraNumber} ({eraData.timeRange})
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <span>Technological Might vs. Skill Diversity Spectrum</span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl mt-1 leading-relaxed">
            {eraData.historicalThesis}
          </p>
        </div>

        {/* Dynamic Scrubbing & Shift Engine */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 self-start lg:self-center shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-lg font-mono text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isPlaying
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-orange-600 hover:bg-orange-500 text-white shadow-md'
              }`}
              title={isPlaying ? 'Pause shift timeline' : 'Animate era shift'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Play Shift'}</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setTimeProgress((p) => (p === 0 ? 1 : 0));
              }}
              className="px-2.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono transition-colors flex items-center gap-1"
              title="Toggle Start / End of Era"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>{timeProgress > 0.5 ? 'View Start' : 'View End'}</span>
            </button>
          </div>

          {/* Time Scrubber */}
          <div className="flex items-center gap-2 min-w-[170px]">
            <span className="text-[11px] font-mono text-slate-400 tabular-nums">
              {eraData.startYear}
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={timeProgress}
              onChange={(e) => {
                setIsPlaying(false);
                setTimeProgress(parseFloat(e.target.value));
              }}
              className="w-24 sm:w-28 accent-orange-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-orange-400 tabular-nums min-w-[42px]">
              {displayedYear}
            </span>
          </div>
        </div>
      </div>

      {/* Control Strip & Interactive Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 pb-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-slate-400 text-[11px] uppercase tracking-wider">
            Color Lens:
          </span>
          <button
            onClick={() => setColorMode('risk')}
            className={`px-2.5 py-1 rounded-md font-mono transition-all text-[11px] ${
              colorMode === 'risk'
                ? 'bg-rose-950/80 text-rose-300 border border-rose-600/60 font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            ⚡ Machine Replacement Risk
          </button>
          <button
            onClick={() => setColorMode('gdp')}
            className={`px-2.5 py-1 rounded-md font-mono transition-all text-[11px] ${
              colorMode === 'gdp'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/60 font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            💰 GDP per Capita Tier
          </button>
          <button
            onClick={() => setColorMode('region')}
            className={`px-2.5 py-1 rounded-md font-mono transition-all text-[11px] ${
              colorMode === 'region'
                ? 'bg-blue-950/80 text-blue-300 border border-blue-600/60 font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            🌍 Geographic Region
          </button>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Trajectory Vector Toggle */}
          <button
            onClick={() => setShowVectors(!showVectors)}
            className={`px-2.5 py-1 rounded-md font-mono transition-all text-[11px] flex items-center gap-1 ${
              showVectors
                ? 'bg-orange-950/70 text-orange-300 border border-orange-600/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            <TrendingUp className="w-3 h-3 text-orange-400" />
            <span>Shift Vectors ({showVectors ? 'ON' : 'OFF'})</span>
          </button>
        </div>

        {/* Legend Quick Reference */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500 border border-white/40" />
            <span>Bubble Size = GDP per Capita</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            <span>Arrow = {eraData.startYear} → {eraData.endYear} Trajectory</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Scatter Plot Canvas (left 7 cols) + In-Depth Country Dossier (right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2 items-start">
        {/* SVG Scatter Plot Container */}
        <div className="lg:col-span-7 bg-[#050811] rounded-xl border border-slate-800/90 p-2 sm:p-3 relative overflow-hidden flex flex-col justify-between shadow-inner">
          {/* Subtle Grid Canvas Background */}
          <div className="w-full relative">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto select-none"
              style={{ maxHeight: '520px' }}
            >
              <defs>
                {/* Arrow markers for shift trajectory vectors */}
                <marker
                  id={`arrowhead-${eraId}`}
                  markerWidth="8"
                  markerHeight="6"
                  refX="7"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 8 3, 0 6" fill="#f97316" fillOpacity="0.85" />
                </marker>
                <marker
                  id={`arrowhead-faint-${eraId}`}
                  markerWidth="6"
                  markerHeight="5"
                  refX="5"
                  refY="2.5"
                  orient="auto"
                >
                  <polygon points="0 0, 6 2.5, 0 5" fill="#64748b" fillOpacity="0.5" />
                </marker>

                {/* Radar glow filters */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Quadrant Background Tints */}
              {/* Top-Right: High Might & Diversified Skills (The Superpowers) */}
              <rect
                x={padding.left + plotWidth * 0.5}
                y={padding.top}
                width={plotWidth * 0.5}
                height={plotHeight * 0.5}
                fill="#38bdf8"
                fillOpacity="0.03"
              />
              {/* Bottom-Left: Agrarian / Mono-craft low-might (Vulnerability Zone) */}
              <rect
                x={padding.left}
                y={padding.top + plotHeight * 0.5}
                width={plotWidth * 0.5}
                height={plotHeight * 0.5}
                fill="#f43f5e"
                fillOpacity="0.02"
              />

              {/* Grid Lines (20% steps) */}
              {[0, 20, 40, 60, 80, 100].map((tick) => {
                const x = padding.left + (tick / 100) * plotWidth;
                const y = padding.top + plotHeight - (tick / 100) * plotHeight;
                return (
                  <g key={tick}>
                    {/* Vertical Grid Line */}
                    <line
                      x1={x}
                      y1={padding.top}
                      x2={x}
                      y2={padding.top + plotHeight}
                      stroke="#1e293b"
                      strokeDasharray={tick === 50 ? '3 3' : '2 4'}
                      strokeWidth={tick === 50 ? '1.5' : '1'}
                    />
                    {/* Horizontal Grid Line */}
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={padding.left + plotWidth}
                      y2={y}
                      stroke="#1e293b"
                      strokeDasharray={tick === 50 ? '3 3' : '2 4'}
                      strokeWidth={tick === 50 ? '1.5' : '1'}
                    />

                    {/* X Axis Value Labels */}
                    <text
                      x={x}
                      y={padding.top + plotHeight + 18}
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {tick}
                    </text>

                    {/* Y Axis Value Labels */}
                    <text
                      x={padding.left - 10}
                      y={y + 3}
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {tick}
                    </text>
                  </g>
                );
              })}

              {/* Diagonal Frontier Guide (Technological Parity Line) */}
              <line
                x1={padding.left}
                y1={padding.top + plotHeight}
                x2={padding.left + plotWidth}
                y2={padding.top}
                stroke="#334155"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padding.left + plotWidth * 0.8}
                y={padding.top + plotHeight * 0.23}
                fill="#475569"
                fontSize="8"
                fontFamily="monospace"
                transform={`rotate(-28, ${padding.left + plotWidth * 0.8}, ${
                  padding.top + plotHeight * 0.23
                })`}
              >
                Frontier Parity Line (Skills ↔ Might Sync)
              </text>

              {/* Axes Border Lines */}
              <line
                x1={padding.left}
                y1={padding.top}
                x2={padding.left}
                y2={padding.top + plotHeight}
                stroke="#475569"
                strokeWidth="1.5"
              />
              <line
                x1={padding.left}
                y1={padding.top + plotHeight}
                x2={padding.left + plotWidth}
                y2={padding.top + plotHeight}
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* Axis Titles */}
              {/* Y Axis Title */}
              <text
                x={-(padding.top + plotHeight / 2)}
                y={padding.left - 48}
                transform="rotate(-90)"
                fill="#94a3b8"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
                fontWeight="600"
                letterSpacing="0.05em"
              >
                ▲ Y-AXIS: {eraData.yAxisLabel.toUpperCase()}
              </text>

              {/* X Axis Title */}
              <text
                x={padding.left + plotWidth / 2}
                y={padding.top + plotHeight + 42}
                fill="#94a3b8"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
                fontWeight="600"
                letterSpacing="0.05em"
              >
                X-AXIS: {eraData.xAxisLabel.toUpperCase()} ▶
              </text>

              {/* Quadrant Callout Watermarks */}
              <text
                x={padding.left + plotWidth - 12}
                y={padding.top + 20}
                fill="#38bdf8"
                fillOpacity="0.4"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="end"
              >
                GLOBAL TECHNOLOGICAL SUMMIT
              </text>
              <text
                x={padding.left + 12}
                y={padding.top + plotHeight - 16}
                fill="#f43f5e"
                fillOpacity="0.4"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="start"
              >
                LOW-COMPLEXITY / COMMODITY EXPOSURE
              </text>

              {/* Shift Trajectory Vectors (Start -> End) */}
              {showVectors &&
                eraData.countries.map((country) => {
                  const startCoords = getCountryPosition(country, 0);
                  const endCoords = getCountryPosition(country, 1);
                  const isSelected = selectedCountry?.countryCode === country.countryCode;

                  return (
                    <g key={`vector-${country.countryCode}`}>
                      {/* Trail path line */}
                      <line
                        x1={startCoords.cx}
                        y1={startCoords.cy}
                        x2={endCoords.cx}
                        y2={endCoords.cy}
                        stroke={isSelected ? '#f97316' : '#64748b'}
                        strokeOpacity={isSelected ? 0.9 : 0.35}
                        strokeWidth={isSelected ? 2.5 : 1.2}
                        strokeDasharray={isSelected ? undefined : '3 3'}
                        markerEnd={`url(#${isSelected ? `arrowhead-${eraId}` : `arrowhead-faint-${eraId}`})`}
                      />

                      {/* Small Start Point Marker */}
                      <circle
                        cx={startCoords.cx}
                        cy={startCoords.cy}
                        r={3}
                        fill="#64748b"
                        fillOpacity={0.6}
                      />
                      <text
                        cx={startCoords.cx}
                        cy={startCoords.cy}
                        x={startCoords.cx}
                        y={startCoords.cy - 5}
                        fill="#64748b"
                        fontSize="7"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {country.startYear}
                      </text>
                    </g>
                  );
                })}

              {/* Render Animated Country Bubbles */}
              {eraData.countries.map((country) => {
                const { cx, cy, radius } = getCountryPosition(country, timeProgress);
                const isSelected = selectedCountry?.countryCode === country.countryCode;
                const isHovered = hoveredCountry?.countryCode === country.countryCode;
                const bubbleColor = getBubbleColor(country);

                // Risk of replacement indicator
                // High risk renders a dashed pulsing outer aura ring
                const highRisk = country.riskSummary.compositeAutomationExposure >= 60;
                const highCognitive = country.riskSummary.cognitiveReplacementRisk >= 70;

                return (
                  <g
                    key={country.countryCode}
                    className="cursor-pointer transition-all duration-150"
                    onClick={() => setSelectedCountry(country)}
                    onMouseEnter={() => setHoveredCountry(country)}
                    onMouseLeave={() => setHoveredCountry(null)}
                  >
                    {/* Automation Risk Glow Aura */}
                    {highRisk && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={radius + 6}
                        fill="none"
                        stroke={highCognitive ? '#ec4899' : '#f97316'}
                        strokeWidth="1.2"
                        strokeDasharray="2 3"
                        strokeOpacity={0.6}
                        className="animate-spin-slow"
                      />
                    )}

                    {/* Selected Highlight Ring */}
                    {(isSelected || isHovered) && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={radius + (isSelected ? 9 : 5)}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth={isSelected ? 2 : 1.5}
                        strokeDasharray={isSelected ? '4 2' : undefined}
                      />
                    )}

                    {/* Main Bubble Body */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius}
                      fill={bubbleColor}
                      fillOpacity={isSelected || isHovered ? 0.95 : 0.75}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? 2 : 1}
                      filter={isSelected ? 'url(#glow)' : undefined}
                    />

                    {/* Flag / Code Text Label inside or beside bubble */}
                    <text
                      x={cx}
                      y={cy + 3.5}
                      fill="#ffffff"
                      fontSize={radius > 13 ? '10' : '8'}
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      {country.countryCode}
                    </text>

                    {/* Country Name Tag above bubble */}
                    <text
                      x={cx}
                      y={cy - radius - 4}
                      fill={isSelected ? '#f97316' : '#cbd5e1'}
                      fontSize="9"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      fontFamily="sans-serif"
                      textAnchor="middle"
                      className="drop-shadow-sm pointer-events-none"
                    >
                      {country.flagEmoji} {country.countryName}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Footnote on Plot Dimensions */}
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-orange-400" />
              <span>
                Year: <strong className="text-white">{displayedYear}</strong> (Progress:{' '}
                {Math.round(timeProgress * 100)}%)
              </span>
            </div>
            <div className="text-slate-400">
              Maddison Historical Dataset (PPP 1990/2011 Int$) · Click any country dot for dossier
            </div>
          </div>
        </div>

        {/* Right Dossier Panel: Country Breakdown, GDP Growth & Automation Risk Analysis */}
        <div className="lg:col-span-5 space-y-4">
          {activeInspection ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
              {/* Country Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{activeInspection.flagEmoji}</span>
                    <h4 className="text-lg font-serif font-bold text-white">
                      {activeInspection.countryName}
                    </h4>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                      {activeInspection.region}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-orange-400 mt-0.5">
                    Era {eraData.eraNumber} Trajectory: {activeInspection.startYear} →{' '}
                    {activeInspection.endYear}
                  </div>
                </div>

                {/* Automation Exposure Badge */}
                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    Machine Exposure Risk
                  </div>
                  <div
                    className={`text-sm font-mono font-bold ${
                      activeInspection.riskSummary.compositeAutomationExposure >= 65
                        ? 'text-rose-400'
                        : activeInspection.riskSummary.compositeAutomationExposure >= 45
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {activeInspection.riskSummary.compositeAutomationExposure}% Shock
                  </div>
                </div>
              </div>

              {/* Metrics Comparison Matrix: Start vs End */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 text-xs font-mono">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Skill Diversity</div>
                  <div className="text-slate-300 text-xs mt-1">
                    {activeInspection.startSkillDiversity} ➔{' '}
                    <strong className="text-orange-400">
                      {activeInspection.endSkillDiversity}
                    </strong>
                  </div>
                  <div className="text-[10px] text-emerald-400">
                    +{activeInspection.endSkillDiversity - activeInspection.startSkillDiversity} pts
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Tech Might</div>
                  <div className="text-slate-300 text-xs mt-1">
                    {activeInspection.startTechMight} ➔{' '}
                    <strong className="text-sky-400">{activeInspection.endTechMight}</strong>
                  </div>
                  <div className="text-[10px] text-emerald-400">
                    +{activeInspection.endTechMight - activeInspection.startTechMight} pts
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 uppercase">GDP Per Capita</div>
                  <div className="text-slate-300 text-xs mt-1 truncate">
                    ${activeInspection.startGdpPerCapita.toLocaleString()} ➔{' '}
                    <strong className="text-emerald-400">
                      ${activeInspection.endGdpPerCapita.toLocaleString()}
                    </strong>
                  </div>
                  <div className="text-[10px] text-emerald-400">
                    {Math.round(
                      ((activeInspection.endGdpPerCapita - activeInspection.startGdpPerCapita) /
                        activeInspection.startGdpPerCapita) *
                        100
                    )}
                    % Surge
                  </div>
                </div>
              </div>

              {/* SPECIFIC MACHINE REPLACEMENT RISK BREAKDOWN (Manual vs Cognitive) */}
              <div className="space-y-2 bg-slate-950/90 p-3.5 rounded-xl border border-rose-950/70">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-rose-400 flex items-center gap-1.5 font-semibold">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    Skills At Risk of Machine Replacement
                  </span>
                  <span className="text-slate-400 text-[10px]">Both Cognitive & Manual</span>
                </div>

                {/* Manual Risk Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Wrench className="w-3 h-3 text-orange-400" /> Manual & Physical Automation
                    </span>
                    <span className="text-orange-400 font-bold">
                      {activeInspection.riskSummary.manualReplacementRisk}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${activeInspection.riskSummary.manualReplacementRisk}%` }}
                    />
                  </div>
                </div>

                {/* Cognitive Risk Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Brain className="w-3 h-3 text-purple-400" /> Cognitive & Analytical
                      Automation
                    </span>
                    <span className="text-purple-400 font-bold">
                      {activeInspection.riskSummary.cognitiveReplacementRisk}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${activeInspection.riskSummary.cognitiveReplacementRisk}%` }}
                    />
                  </div>
                </div>

                {/* Sector vulnerabilities */}
                <div className="pt-2 text-[11px] space-y-1 font-mono border-t border-slate-800/80">
                  <div className="flex items-start gap-1.5">
                    <span className="text-rose-400 font-semibold shrink-0">Vulnerable:</span>
                    <span className="text-slate-300">
                      {activeInspection.riskSummary.mostVulnerableSector}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-semibold shrink-0">Ascendant:</span>
                    <span className="text-slate-300">
                      {activeInspection.riskSummary.safestOrAscendantSector}
                    </span>
                  </div>
                </div>
              </div>

              {/* Historical Context Narrative */}
              <div className="space-y-1.5 text-xs">
                <div className="font-mono text-slate-400 uppercase tracking-wider text-[10px]">
                  Historical Shock Dynamics:
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {activeInspection.historicalContext}
                </p>
              </div>

              {/* Economic Mechanism */}
              <div className="space-y-1.5 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <div className="font-mono text-orange-400 uppercase tracking-wider text-[10px]">
                  Economic Mechanism (Wealth of Nations):
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {activeInspection.economicMechanism}
                </p>
              </div>

              {/* Academic Source */}
              <div className="text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
                <span>Source: {activeInspection.academicSource}</span>
                <span className="text-slate-400">Click dot to inspect</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800 font-mono text-xs">
              Select or hover on any nation to inspect its economic trajectory and automation
              exposure.
            </div>
          )}

          {/* Era Synthesis Key Takeaways Box */}
          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 space-y-2">
            <div className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Era {eraData.eraNumber} Macro Takeaways</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {eraData.eraKeyInsights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-orange-400 font-mono text-[11px] shrink-0 font-bold">
                    0{idx + 1}.
                  </span>
                  <span className="leading-relaxed">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
