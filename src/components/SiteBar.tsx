import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { RESEARCH_URL, SITE_URL } from '../lib/features';

/** Slim bar tying the app back to the Data Diplomats site it is served from. */
export const SiteBar: React.FC = () => (
  <div className="bg-[#002D72] dark:bg-[#04070d] border-b border-[#002D72] dark:border-slate-800 text-[11px] font-mono">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between gap-3">
      <a href={RESEARCH_URL} className="flex items-center gap-1.5 text-blue-100 dark:text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-3 h-3" />
        <span>Data Diplomats Research</span>
      </a>
      <a href={SITE_URL} className="text-blue-200/70 dark:text-slate-500 hover:text-white transition-colors hidden sm:inline">
        datadiplomats.org
      </a>
    </div>
  </div>
);
