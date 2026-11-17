import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Code2,
  Copy,
  Check,
  Eye,
  Sliders,
  ExternalLink,
  Terminal,
  FileCode2,
  Globe,
  Maximize2,
} from 'lucide-react';
import type { WidgetId } from './VisualLabDashboard';

interface EmbedCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWidget: WidgetId;
  currentEraId: string;
  currentYear: number;
}

const PUBLISHED_URL = 'https://ais-pre-ishopl677qbt6o55rifhvo-585790079879.us-east1.run.app';

const WIDGET_OPTIONS: { id: WidgetId; label: string }[] = [
  { id: 'constellation', label: 'Radial Work Map' },
  { id: 'streamgraph', label: 'Task Streamgraph' },
  { id: 'quadrant', label: 'Cognitive Quadrant' },
  { id: 'radar', label: 'Polanyi Radar' },
  { id: 'nations', label: 'Wealth of Nations Plot' },
  { id: 'timeline', label: 'Inventions & Unrest Timeline' },
  { id: 'simulator', label: 'Transition Benchmark' },
];

const ERA_OPTIONS = [
  { id: 'era-1', label: 'Era I · Steam & Loom (1760–1840)' },
  { id: 'era-2', label: 'Era II · Electricity & Assembly (1870–1914)' },
  { id: 'era-3', label: 'Era III · Silicon & Computing (1947–2016)' },
  { id: 'era-4', label: 'Era IV · AI & Cognitive Inversion (2017–2026+)' },
];

export const EmbedCodeModal: React.FC<EmbedCodeModalProps> = ({
  isOpen,
  onClose,
  currentWidget,
  currentEraId,
  currentYear,
}) => {
  const defaultOrigin =
    typeof window !== 'undefined' && !window.location.hostname.includes('localhost')
      ? window.location.origin
      : PUBLISHED_URL;

  const [baseUrl, setBaseUrl] = useState<string>(defaultOrigin);
  const [embedClean, setEmbedClean] = useState<boolean>(true);
  const [hideControls, setHideControls] = useState<boolean>(false);
  const [selectedWidget, setSelectedWidget] = useState<WidgetId>(currentWidget);
  const [selectedEra, setSelectedEra] = useState<string>(currentEraId);
  const [useCustomYear, setUseCustomYear] = useState<boolean>(false);
  const [customYear, setCustomYear] = useState<number>(currentYear);

  useEffect(() => {
    if (isOpen) {
      setSelectedWidget(currentWidget);
      setSelectedEra(currentEraId);
      setCustomYear(currentYear);
    }
  }, [isOpen, currentWidget, currentEraId, currentYear]);
  const [frameHeight, setFrameHeight] = useState<number>(820);
  const [maxWidth, setMaxWidth] = useState<string>('1280px');
  const [borderRadius, setBorderRadius] = useState<number>(12);
  const [embedTheme, setEmbedTheme] = useState<'light' | 'dark'>('light');
  const [includeAutoResize, setIncludeAutoResize] = useState<boolean>(true);

  const [activeCodeTab, setActiveCodeTab] = useState<'html' | 'js' | 'selfhost'>('html');
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('code');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (embedClean) params.set('embed', 'true');
    if (hideControls) params.set('controls', 'false');
    params.set('theme', embedTheme);
    params.set('widget', selectedWidget);
    params.set('era', selectedEra);
    if (useCustomYear) params.set('year', String(customYear));
    return params.toString();
  }, [embedClean, hideControls, embedTheme, selectedWidget, selectedEra, useCustomYear, customYear]);

  const cleanBaseUrl = baseUrl.trim().replace(/\/+$/, '') || PUBLISHED_URL;
  const fullEmbedUrl = `${cleanBaseUrl}?${queryParams}`;
  const localPreviewUrl =
    typeof window !== 'undefined' ? `${window.location.origin}?${queryParams}` : fullEmbedUrl;

  const htmlCssSnippet = useMemo(() => {
    const widthRule = maxWidth === '100%' ? '100%' : maxWidth;
    const containerBg = embedTheme === 'light' ? '#ffffff' : '#0b1120';
    const containerBorder = embedTheme === 'light' ? '#e2e8f0' : '#1e293b';
    const containerShadow =
      embedTheme === 'light'
        ? '0 20px 40px -15px rgba(0, 45, 114, 0.14)'
        : '0 20px 40px -15px rgba(0, 0, 0, 0.65)';
    return `<!-- Evolution of Human Skills Embed -->
<div class="skills-app-container">
  <iframe
    id="evolution-skills-frame"
    src="${fullEmbedUrl}"
    title="Evolution of Human Skills - Industrial Revolution Benchmark"
    loading="lazy"
    allow="clipboard-write"
    frameborder="0"
    allowfullscreen
  ></iframe>
</div>

<style>
  .skills-app-container {
    position: relative;
    width: 100%;
    max-width: ${widthRule};
    margin: 0 auto;
    height: ${frameHeight}px;
    border-radius: ${borderRadius}px;
    overflow: hidden;
    box-shadow: ${containerShadow};
    border: 1px solid ${containerBorder};
    background-color: ${containerBg};
  }

  .skills-app-container iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }

  @media (max-width: 768px) {
    .skills-app-container {
      height: ${Math.max(580, Math.round(frameHeight * 0.85))}px;
      border-radius: ${Math.min(8, borderRadius)}px;
    }
  }
</style>`;
  }, [fullEmbedUrl, frameHeight, maxWidth, borderRadius, embedTheme]);

  const jsBridgeSnippet = useMemo(() => {
    return `<script>
  const skillsFrame = document.getElementById('evolution-skills-frame');

  // 1. Listen for events sent FROM the embedded app
  window.addEventListener('message', (event) => {
    // Verify message origin in production
    // if (event.origin !== '${cleanBaseUrl}') return;

    const data = event.data;
    if (!data || typeof data !== 'object') return;
${
  includeAutoResize
    ? `
    // Automatically resize container height to match embedded content
    if (data.type === 'RESIZE_FRAME' && typeof data.height === 'number') {
      const container = document.querySelector('.skills-app-container');
      if (container) {
        container.style.height = Math.max(520, data.height) + 'px';
      }
    }
`
    : ''
}
    // React when a user opens a skill dossier inside the embed
    if (data.type === 'SKILL_SELECTED') {
      console.log('User inspected skill:', data.skillName, 'Era:', data.eraId);
    }
  });

  // 2. Control the embedded app FROM your website's buttons or scroll events
  function switchEmbeddedWidget(widgetId) {
    skillsFrame?.contentWindow?.postMessage(
      { type: 'SET_WIDGET', widget: widgetId },
      '*'
    );
  }

  function jumpToIndustrialYear(year) {
    skillsFrame?.contentWindow?.postMessage(
      { type: 'SET_YEAR', year: year },
      '*'
    );
  }

  function setEmbeddedTheme(theme) {
    skillsFrame?.contentWindow?.postMessage(
      { type: 'SET_THEME', theme: theme }, // 'light' | 'dark'
      '*'
    );
  }
</script>`;
  }, [cleanBaseUrl, includeAutoResize]);

  const combinedSnippet = includeAutoResize
    ? `${htmlCssSnippet}\n\n${jsBridgeSnippet}`
    : htmlCssSnippet;

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback textarea copy
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 w-full bg-gradient-to-r from-[#002D72] via-[#0056B3] to-[#F47E2D]" />

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080d17]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-[#0056B3] dark:text-blue-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#002D72] dark:text-white tracking-wide">
                Embed in HTML / CSS / JavaScript
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-sans">
                Configure an iframe embed or JS bridge to place this interactive platform on your website
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-slate-200/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
              <button
                onClick={() => setViewMode('code')}
                className={`px-3 py-1.5 text-xs font-mono rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                  viewMode === 'code'
                    ? 'dssg-btn-primary font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>Code & Config</span>
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 text-xs font-mono rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                  viewMode === 'preview'
                    ? 'dssg-btn-primary font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Close embed modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'code' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Configuration */}
              <div className="lg:col-span-5 space-y-5">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#002D72] dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-2 font-semibold">
                  <Sliders className="w-3.5 h-3.5 text-[#0056B3] dark:text-blue-400" />
                  <span>Embed Options</span>
                </div>

                {/* Base Host URL */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-slate-700 dark:text-slate-300 font-medium">
                      Hosted App URL
                    </label>
                    <button
                      onClick={() => setBaseUrl(PUBLISHED_URL)}
                      className="text-[11px] font-mono text-[#0056B3] dark:text-blue-400 hover:underline font-medium"
                    >
                      Use Shared URL
                    </button>
                  </div>
                  <input
                    type="url"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:border-[#0056B3]"
                    placeholder={PUBLISHED_URL}
                  />
                </div>

                {/* Embed Theme Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-700 dark:text-slate-300 block font-medium">
                    Embed Color Theme (?theme={embedTheme})
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setEmbedTheme('light')}
                      className={`py-1.5 px-3 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        embedTheme === 'light'
                          ? 'bg-white dark:bg-slate-800 text-[#002D72] dark:text-white font-semibold shadow-xs border border-slate-200 dark:border-slate-700'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Light (Editorial)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmbedTheme('dark')}
                      className={`py-1.5 px-3 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        embedTheme === 'dark'
                          ? 'bg-white dark:bg-slate-800 text-[#002D72] dark:text-white font-semibold shadow-xs border border-slate-200 dark:border-slate-700'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Dark (Night Slate)
                    </button>
                  </div>
                </div>

                {/* Starting Widget */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-700 dark:text-slate-300 block font-medium">
                    Initial Visualization Widget
                  </label>
                  <select
                    value={selectedWidget}
                    onChange={(e) => setSelectedWidget(e.target.value as WidgetId)}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:border-[#0056B3]"
                  >
                    {WIDGET_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Initial Era */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-700 dark:text-slate-300 block font-medium">
                    Starting Industrial Era
                  </label>
                  <select
                    value={selectedEra}
                    onChange={(e) => setSelectedEra(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:border-[#0056B3]"
                  >
                    {ERA_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Chrome & Layout Toggles */}
                <div className="space-y-2.5 pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={embedClean}
                      onChange={(e) => setEmbedClean(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-[#0056B3] focus:ring-[#0056B3]"
                    />
                    <div className="text-xs">
                      <span className="text-slate-800 dark:text-slate-200 font-medium block">
                        Clean Embed Mode (embed=true)
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Hides top navigation header & footer for seamless article integration
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hideControls}
                      onChange={(e) => setHideControls(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-[#0056B3] focus:ring-[#0056B3]"
                    />
                    <div className="text-xs">
                      <span className="text-slate-800 dark:text-slate-200 font-medium block">
                        Hide Timeline Scrubber Bar (controls=false)
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Show only the chosen chart canvas without the top year slider
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useCustomYear}
                      onChange={(e) => setUseCustomYear(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-[#0056B3] focus:ring-[#0056B3]"
                    />
                    <div className="text-xs flex-1">
                      <span className="text-slate-800 dark:text-slate-200 font-medium block">
                        Pin Specific Year (year={customYear})
                      </span>
                      {useCustomYear && (
                        <input
                          type="number"
                          min={1760}
                          max={2030}
                          value={customYear}
                          onChange={(e) =>
                            setCustomYear(Math.max(1760, Math.min(2030, Number(e.target.value) || 2024)))
                          }
                          className="mt-1.5 w-28 px-2 py-1 text-xs font-mono tabular-nums bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-[#F47E2D] font-semibold"
                        />
                      )}
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeAutoResize}
                      onChange={(e) => setIncludeAutoResize(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-[#0056B3] focus:ring-[#0056B3]"
                    />
                    <div className="text-xs">
                      <span className="text-slate-800 dark:text-slate-200 font-medium block">
                        Include postMessage Auto-Resize Script
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Automatically adjusts iframe height as users switch widgets
                      </span>
                    </div>
                  </label>
                </div>

                {/* Container Geometry */}
                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="text-[11px] font-mono text-slate-600 dark:text-slate-400 block mb-1">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      min={480}
                      max={1400}
                      step={20}
                      value={frameHeight}
                      onChange={(e) => setFrameHeight(Number(e.target.value) || 820)}
                      className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-slate-600 dark:text-slate-400 block mb-1">
                      Max Width
                    </label>
                    <select
                      value={maxWidth}
                      onChange={(e) => setMaxWidth(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-200"
                    >
                      <option value="100%">100% Full</option>
                      <option value="1280px">1280px</option>
                      <option value="960px">960px</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-slate-600 dark:text-slate-400 block mb-1">
                      Radius (px)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={24}
                      value={borderRadius}
                      onChange={(e) => setBorderRadius(Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Generated Code Tabs */}
              <div className="lg:col-span-7 flex flex-col space-y-3">
                {/* Direct URL bar */}
                <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                    <span className="text-xs font-mono text-[#0056B3] dark:text-blue-300 truncate">
                      {fullEmbedUrl}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopy(fullEmbedUrl, 'url')}
                      className="px-2.5 py-1 text-[11px] font-mono bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                    >
                      {copiedId === 'url' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>
                    <a
                      href={localPreviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-[#002D72] dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded transition-colors"
                      title="Open embed URL in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Code Mode Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1 overflow-x-auto">
                    <button
                      onClick={() => setActiveCodeTab('html')}
                      className={`px-3 py-2 text-xs font-mono border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                        activeCodeTab === 'html'
                          ? 'border-[#0056B3] dark:border-blue-500 text-[#002D72] dark:text-blue-400 font-semibold'
                          : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      HTML + CSS Snippet
                    </button>
                    <button
                      onClick={() => setActiveCodeTab('js')}
                      className={`px-3 py-2 text-xs font-mono border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                        activeCodeTab === 'js'
                          ? 'border-[#0056B3] dark:border-blue-500 text-[#002D72] dark:text-blue-400 font-semibold'
                          : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      JS Two-Way Bridge
                    </button>
                    <button
                      onClick={() => setActiveCodeTab('selfhost')}
                      className={`px-3 py-2 text-xs font-mono border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                        activeCodeTab === 'selfhost'
                          ? 'border-[#0056B3] dark:border-blue-500 text-[#002D72] dark:text-blue-400 font-semibold'
                          : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      Self-Hosting Guide
                    </button>
                  </div>

                  {activeCodeTab !== 'selfhost' && (
                    <button
                      onClick={() =>
                        handleCopy(
                          activeCodeTab === 'html' ? combinedSnippet : jsBridgeSnippet,
                          'code'
                        )
                      }
                      className="px-3 py-1.5 mb-1 text-xs font-mono font-semibold dssg-btn-primary rounded-md flex items-center gap-1.5 whitespace-nowrap shrink-0"
                    >
                      {copiedId === 'code' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied Snippet</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy {activeCodeTab === 'html' ? 'Full Embed' : 'JS Bridge'}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Code Output / Self-Host Guide */}
                {activeCodeTab === 'html' && (
                  <pre className="flex-1 p-4 bg-slate-50 dark:bg-[#070b12] border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-mono text-slate-800 dark:text-slate-300 overflow-auto max-h-[380px] leading-relaxed">
                    <code>{combinedSnippet}</code>
                  </pre>
                )}

                {activeCodeTab === 'js' && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Use the browser's native{' '}
                      <code className="text-[#0056B3] dark:text-blue-300 font-mono">postMessage</code> API so your host website can auto-resize the iframe height, track inspected skills, or drive era/widget/theme changes from external HTML buttons.
                    </p>
                    <pre className="p-4 bg-slate-50 dark:bg-[#070b12] border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-mono text-slate-800 dark:text-slate-300 overflow-auto max-h-[340px] leading-relaxed">
                      <code>{jsBridgeSnippet}</code>
                    </pre>
                  </div>
                )}

                {activeCodeTab === 'selfhost' && (
                  <div className="p-5 bg-slate-50 dark:bg-[#070b12] border border-slate-200 dark:border-slate-800 rounded-lg space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <div className="flex items-center gap-2 text-[#002D72] dark:text-white font-semibold text-sm">
                      <Terminal className="w-4 h-4 text-[#0056B3] dark:text-blue-400" />
                      <span>Alternative: Host the Static Build on Your Own Website</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                      Because this application compiles into static HTML, CSS, and JavaScript files via Vite, you can also host it directly on your own domain or subfolder (e.g.,{' '}
                      <code className="text-slate-900 dark:text-slate-200 font-mono">yoursite.com/skills/</code>):
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
                      <li>
                        Run{' '}
                        <code className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-mono text-[#0056B3] dark:text-blue-300">
                          npm run build
                        </code>{' '}
                        to generate the self-contained{' '}
                        <code className="font-mono text-slate-900 dark:text-slate-200">dist/</code> directory.
                      </li>
                      <li>
                        Upload the contents of{' '}
                        <code className="font-mono text-slate-900 dark:text-slate-200">dist/</code> to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, S3, or an Apache/Nginx subfolder).
                      </li>
                      <li>
                        Embed it anywhere on your site with the iframe snippet above using your domain as the{' '}
                        <strong className="text-[#002D72] dark:text-white">Hosted App URL</strong>, keeping CSS and React completely isolated from your host site's styles.
                      </li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Live Interactive Iframe Preview */
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2 min-w-0">
                  <Maximize2 className="w-3.5 h-3.5 text-[#0056B3] dark:text-blue-400 shrink-0" />
                  <span className="shrink-0">Live Iframe Render:</span>
                  <span className="text-[#0056B3] dark:text-blue-300 truncate">{localPreviewUrl}</span>
                </div>
                <button
                  onClick={() => handleCopy(combinedSnippet, 'preview-copy')}
                  className="px-3 py-1.5 dssg-btn-primary rounded flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  {copiedId === 'preview-copy' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied HTML/CSS/JS</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy This Embed Code</span>
                    </>
                  )}
                </button>
              </div>

              <div
                className={`w-full mx-auto overflow-hidden border shadow-xl ${
                  embedTheme === 'light'
                    ? 'border-slate-200 bg-white'
                    : 'border-slate-700 bg-[#0b1120]'
                }`}
                style={{
                  maxWidth: maxWidth === '100%' ? '100%' : maxWidth,
                  height: `${Math.min(frameHeight, 620)}px`,
                  borderRadius: `${borderRadius}px`,
                }}
              >
                <iframe
                  key={localPreviewUrl}
                  src={localPreviewUrl}
                  title="Live Embed Preview"
                  className="w-full h-full border-0 block"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080d17] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>Supports responsive iframe, query params, theme switch, and window.postMessage</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
