import React from 'react';
import { BookOpen, Network, FileSpreadsheet, Code2, Sun, Moon, GraduationCap, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export type NavTab = 'visual-lab' | 'timeline' | 'matrix' | 'transitions' | 'societal' | 'nations' | 'synthesis' | 'scholars';
export type MainMode = 'visuals' | 'archive' | 'bibliography';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenBrief: () => void;
  onOpenSheets: () => void;
  sheetsEnabled?: boolean;
  onOpenEmbed: () => void;
  mainMode: MainMode;
  onChangeMainMode: (mode: MainMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenBrief,
  onOpenSheets,
  sheetsEnabled = false,
  onOpenEmbed,
  mainMode,
  onChangeMainMode,
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0b1120]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onChangeMainMode('visuals');
              onSelectTab('visual-lab');
            }}
            className="text-base sm:text-lg font-serif tracking-tight font-bold text-[#002D72] dark:text-white hover:text-[#F47E2D] dark:hover:text-[#F47E2D] transition-colors whitespace-nowrap shrink-0"
          >
            Evolution of Human Skills
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-5 text-xs font-sans font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => {
              onChangeMainMode('visuals');
              onSelectTab('visual-lab');
            }}
            className={`flex items-center gap-1.5 py-1 transition-colors text-left whitespace-nowrap shrink-0 ${
              mainMode === 'visuals'
                ? 'text-[#002D72] dark:text-[#F47E2D] font-semibold border-b-2 border-[#F47E2D]'
                : 'hover:text-[#002D72] dark:hover:text-white'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-[#F47E2D]" />
            <span>Work Map &amp; Lab</span>
          </button>

          <button
            onClick={() => {
              onChangeMainMode('archive');
              onSelectTab('timeline');
            }}
            className={`py-1 transition-colors text-left whitespace-nowrap shrink-0 ${
              mainMode === 'archive' && activeTab === 'timeline'
                ? 'text-[#002D72] dark:text-[#F47E2D] font-semibold border-b-2 border-[#F47E2D]'
                : 'hover:text-[#002D72] dark:hover:text-white'
            }`}
          >
            Timeline
          </button>

          <button
            onClick={() => {
              onChangeMainMode('archive');
              onSelectTab('matrix');
            }}
            className={`py-1 transition-colors text-left whitespace-nowrap shrink-0 ${
              mainMode === 'archive' && activeTab === 'matrix'
                ? 'text-[#002D72] dark:text-[#F47E2D] font-semibold border-b-2 border-[#F47E2D]'
                : 'hover:text-[#002D72] dark:hover:text-white'
            }`}
          >
            Skill Matrix
          </button>

          <button
            onClick={() => {
              onChangeMainMode('archive');
              onSelectTab('nations');
            }}
            className={`py-1 transition-colors text-left whitespace-nowrap shrink-0 ${
              mainMode === 'archive' && activeTab === 'nations'
                ? 'text-[#002D72] dark:text-[#F47E2D] font-semibold border-b-2 border-[#F47E2D]'
                : 'hover:text-[#002D72] dark:hover:text-white'
            }`}
          >
            Nations GDP
          </button>

          <button
            onClick={() => {
              onChangeMainMode('archive');
              onSelectTab('transitions');
            }}
            className={`py-1 transition-colors text-left whitespace-nowrap shrink-0 ${
              mainMode === 'archive' && activeTab === 'transitions'
                ? 'text-[#002D72] dark:text-[#F47E2D] font-semibold border-b-2 border-[#F47E2D]'
                : 'hover:text-[#002D72] dark:hover:text-white'
            }`}
          >
            Transitions
          </button>

          <button
            onClick={() => {
              onChangeMainMode('archive');
              onSelectTab('synthesis');
            }}
            className={`py-1 transition-colors text-left whitespace-nowrap shrink-0 ${
              mainMode === 'archive' && activeTab === 'synthesis'
                ? 'text-[#002D72] dark:text-[#F47E2D] font-semibold border-b-2 border-[#F47E2D]'
                : 'hover:text-[#002D72] dark:hover:text-white'
            }`}
          >
            AI Core
          </button>

          <button
            onClick={() => {
              onChangeMainMode('bibliography');
              onSelectTab('scholars');
            }}
            className={`flex items-center gap-1.5 py-1 transition-colors text-left whitespace-nowrap shrink-0 ${
              mainMode === 'bibliography' || (mainMode === 'archive' && activeTab === 'scholars')
                ? 'text-[#002D72] dark:text-[#F47E2D] font-semibold border-b-2 border-[#F47E2D]'
                : 'hover:text-[#002D72] dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#0056B3] dark:text-blue-400" />
            <span>Bibliography</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Light/Dark Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenEmbed}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#002D72] dark:text-blue-300 bg-slate-100 dark:bg-blue-950/70 hover:bg-slate-200 dark:hover:bg-blue-900 border border-slate-200 dark:border-blue-700/60 rounded-lg transition-all whitespace-nowrap shrink-0"
            title="Get HTML/CSS/JS Embed Code"
          >
            <Code2 className="w-3.5 h-3.5 text-[#0056B3] dark:text-blue-400" />
            <span className="hidden sm:inline">Embed</span>
          </button>

          <button
            onClick={onOpenSheets}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-700/60 rounded-lg transition-all whitespace-nowrap shrink-0"
            title={sheetsEnabled ? 'Open Google Sheets Integration' : 'Download the dataset as CSV'}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden xl:inline">{sheetsEnabled ? 'Google Sheets' : 'Download CSV'}</span>
            <span className="xl:hidden">{sheetsEnabled ? 'Sheets' : 'CSV'}</span>
          </button>

          <button
            onClick={onOpenBrief}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg dssg-btn-primary whitespace-nowrap shrink-0 shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Research Brief</span>
            <span className="xl:hidden">Brief</span>
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-[#0056B3] dark:hover:border-[#F47E2D] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all whitespace-nowrap shrink-0"
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#F47E2D]" />
                <span className="hidden md:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#002D72]" />
                <span className="hidden md:inline">Dark</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Responsive Mobile/Tablet Navigation Strip */}
      <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-[#080d17]/95 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => {
            onChangeMainMode('visuals');
            onSelectTab('visual-lab');
          }}
          className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
            mainMode === 'visuals'
              ? 'dssg-btn-primary font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:text-[#002D72] dark:hover:text-white'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          <span>Work Map &amp; Lab</span>
        </button>

        <button
          onClick={() => {
            onChangeMainMode('archive');
            onSelectTab('timeline');
          }}
          className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
            mainMode === 'archive'
              ? 'dssg-btn-primary font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:text-[#002D72] dark:hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Historical Dossier</span>
        </button>

        <button
          onClick={() => {
            onChangeMainMode('bibliography');
            onSelectTab('scholars');
          }}
          className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
            mainMode === 'bibliography'
              ? 'dssg-btn-secondary font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:text-[#002D72] dark:hover:text-white'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Bibliography</span>
        </button>
      </div>
    </header>
  );
};

