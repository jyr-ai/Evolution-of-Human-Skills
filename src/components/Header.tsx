import React from 'react';
import { BookOpen, Network, Layers, Sparkles } from 'lucide-react';

export type NavTab = 'visual-lab' | 'timeline' | 'matrix' | 'transitions' | 'societal' | 'synthesis' | 'scholars';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenBrief: () => void;
  mainMode: 'visuals' | 'archive';
  onChangeMainMode: (mode: 'visuals' | 'archive') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenBrief,
  mainMode,
  onChangeMainMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#080c14]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('visual-lab');
            }}
            className="text-base sm:text-lg font-serif tracking-tight font-semibold text-white hover:text-orange-400 transition-colors flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            THE GREAT DISPLACEMENT
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-mono uppercase tracking-wider text-slate-300">
          <button
            onClick={() => {
              onChangeMainMode('visuals');
              onSelectTab('visual-lab');
            }}
            className={`flex items-center gap-1.5 transition-colors text-left hover:text-white ${
              mainMode === 'visuals' ? 'text-orange-400 font-bold border-b-2 border-orange-500 pb-0.5' : ''
            }`}
          >
            <Network className="w-3.5 h-3.5 text-orange-400" />
            <span>Interactive Work Map & Lab</span>
          </button>

          <button
            onClick={() => {
              onChangeMainMode('archive');
              onSelectTab('matrix');
            }}
            className={`transition-colors text-left hover:text-white ${
              mainMode === 'archive' && activeTab === 'matrix' ? 'text-orange-400 font-bold border-b-2 border-orange-500 pb-0.5' : ''
            }`}
          >
            Skill Matrix
          </button>

          <button
            onClick={() => {
              onChangeMainMode('archive');
              onSelectTab('transitions');
            }}
            className={`transition-colors text-left hover:text-white ${
              activeTab === 'transitions' ? 'text-orange-400 font-bold border-b-2 border-orange-500 pb-0.5' : ''
            }`}
          >
            Transition Nodes
          </button>

          <button
            onClick={() => {
              onChangeMainMode('archive');
              onSelectTab('synthesis');
            }}
            className={`transition-colors text-left hover:text-white ${
              activeTab === 'synthesis' ? 'text-orange-400 font-bold border-b-2 border-orange-500 pb-0.5' : ''
            }`}
          >
            AI Inversion & Core
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenBrief}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-orange-500/60 rounded-md transition-all whitespace-nowrap shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Research Brief</span>
            <span className="sm:hidden">Brief</span>
          </button>
        </div>
      </div>
    </header>
  );
};
