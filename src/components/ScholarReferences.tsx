import React, { useMemo, useState } from 'react';
import {
  BIBLIOGRAPHY_SOURCES,
  BIBLIOGRAPHY_CATEGORY_META,
  BibliographyCategory,
  BibliographySource,
  EraTag,
} from '../data/bibliographyData';
import {
  GraduationCap,
  Search,
  Copy,
  Check,
  Download,
  BookOpen,
  Layers,
  Network,
  RotateCcw,
} from 'lucide-react';

interface ScholarReferencesProps {
  isStandaloneTab?: boolean;
  onBackToVisuals?: () => void;
  onOpenArchive?: () => void;
}

const ERA_FILTERS: ('All' | EraTag)[] = ['All', 'Era I', 'Era II', 'Era III', 'Era IV'];

const CATEGORY_KEYS: BibliographyCategory[] = [
  'economics-ai',
  'economic-history',
  'census-archives',
  'industry-global',
];

function renderHarvardFormatted(source: BibliographySource) {
  if (!source.isBookOrStandalone) {
    // Journal article or book chapter: Authors (Year) 'Title', Journal, Vol/Pages.
    // Handle edited chapter phrasing cleanly
    const isInEditedBook = source.journalOrPublisher.startsWith('in ');
    return (
      <>
        <span className="font-semibold text-slate-900 dark:text-white">{source.authors}</span>{' '}
        <span className="tabular-nums text-slate-800 dark:text-slate-200">({source.year})</span>{' '}
        <span className="text-slate-900 dark:text-slate-100">‘{source.title}’,</span>{' '}
        {isInEditedBook ? (
          <>
            <span>{source.journalOrPublisher}</span>
            {source.publicationLocationOrIssue ? `, ${source.publicationLocationOrIssue}.` : '.'}
          </>
        ) : (
          <>
            <em className="italic text-slate-900 dark:text-slate-100">
              {source.journalOrPublisher}
            </em>
            {source.publicationLocationOrIssue ? `, ${source.publicationLocationOrIssue}.` : '.'}
          </>
        )}
      </>
    );
  }

  // Book, working paper, statute, report, or archival series:
  // Authors (Year) Italicized Title. Place/Series: Publisher.
  return (
    <>
      <span className="font-semibold text-slate-900 dark:text-white">{source.authors}</span>{' '}
      <span className="tabular-nums text-slate-800 dark:text-slate-200">({source.year})</span>{' '}
      <em className="italic text-slate-900 dark:text-slate-100">{source.title}.</em>{' '}
      {source.publicationLocationOrIssue ? `${source.publicationLocationOrIssue}: ` : ''}
      <span>{source.journalOrPublisher}.</span>
    </>
  );
}

export const ScholarReferences: React.FC<ScholarReferencesProps> = ({
  isStandaloneTab = false,
  onBackToVisuals,
  onOpenArchive,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | BibliographyCategory>('all');
  const [selectedEra, setSelectedEra] = useState<'All' | EraTag>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const sortedSources = useMemo(() => {
    return [...BIBLIOGRAPHY_SOURCES].sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<BibliographyCategory, number> = {
      'economics-ai': 0,
      'economic-history': 0,
      'census-archives': 0,
      'industry-global': 0,
    };
    sortedSources.forEach((src) => {
      counts[src.category] += 1;
    });
    return counts;
  }, [sortedSources]);

  const filteredSources = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sortedSources.filter((src) => {
      if (selectedCategory !== 'all' && src.category !== selectedCategory) return false;
      if (selectedEra !== 'All' && !src.erasCovered.includes(selectedEra)) return false;
      if (!q) return true;
      return (
        src.authors.toLowerCase().includes(q) ||
        src.title.toLowerCase().includes(q) ||
        src.year.toLowerCase().includes(q) ||
        src.journalOrPublisher.toLowerCase().includes(q) ||
        src.harvardCitation.toLowerCase().includes(q) ||
        src.dataPulledSummary.toLowerCase().includes(q) ||
        src.whereUsedInApp.some((loc) => loc.toLowerCase().includes(q))
      );
    });
  }, [sortedSources, selectedCategory, selectedEra, searchQuery]);

  const handleCopySingle = (id: string, harvardText: string) => {
    navigator.clipboard.writeText(harvardText);
    setCopiedId(id);
    setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 2000);
  };

  const handleCopyAllFiltered = () => {
    const header = `EVOLUTION OF HUMAN SKILLS — COMPLETE HARVARD BIBLIOGRAPHY (${filteredSources.length} SOURCES)\n`;
    const divider = '='.repeat(78) + '\n\n';
    const body = filteredSources
      .map(
        (src, idx) =>
          `${idx + 1}. ${src.harvardCitation}\n   Applied in: ${src.whereUsedInApp.join('; ')}\n   Data pulled: ${src.dataPulledSummary}`
      )
      .join('\n\n');
    navigator.clipboard.writeText(header + divider + body);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2200);
  };

  const handleDownloadTxt = () => {
    const header = `EVOLUTION OF HUMAN SKILLS — HARVARD BIBLIOGRAPHY\nCompiled Sources: ${filteredSources.length}\nFormat: Harvard Citation Standard\n\n`;
    const body = filteredSources
      .map(
        (src) =>
          `${src.harvardCitation}\n  [Category] ${BIBLIOGRAPHY_CATEGORY_META[src.category].label}\n  [Eras] ${src.erasCovered.join(', ')}\n  [Used In] ${src.whereUsedInApp.join(' | ')}\n  [Notes] ${src.dataPulledSummary}`
      )
      .join('\n\n');
    const blob = new Blob([header + body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'evolution-of-human-skills-harvard-bibliography.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedEra('All');
    setSearchQuery('');
  };

  return (
    <section
      id="scholar-references"
      className={`${
        isStandaloneTab ? 'py-10 sm:py-12 min-h-[80vh]' : 'py-14 border-b border-slate-200 dark:border-slate-800'
      } bg-white dark:bg-[#080c14] transition-colors duration-200`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Navigation Context (only when opened as dedicated Bibliography tab) */}
        {isStandaloneTab && (onBackToVisuals || onOpenArchive) && (
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800 text-xs">
            <div className="font-mono text-slate-500 dark:text-slate-400">
              Archive Index · Harvard Reference Standard · Full Platform Provenance
            </div>
            <div className="flex items-center gap-2">
              {onBackToVisuals && (
                <button
                  onClick={onBackToVisuals}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[#002D72] dark:text-slate-200 hover:border-[#0056B3] font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
                >
                  <Network className="w-3.5 h-3.5 text-[#F47E2D]" />
                  <span>Work Map & Lab</span>
                </button>
              )}
              {onOpenArchive && (
                <button
                  onClick={onOpenArchive}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[#002D72] dark:text-slate-200 hover:border-[#0056B3] font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-[#0056B3] dark:text-blue-400" />
                  <span>Historical Dossier</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Editorial Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#F47E2D] uppercase tracking-widest">
              <GraduationCap className="w-4 h-4" />
              <span>Harvard Reference Bibliography · Complete Source Registry</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#002D72] dark:text-white tracking-tight text-balance">
              Sources, Censuses &amp; Scholarly Bibliography
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Every peer-reviewed paper, economic history monograph, parliamentary return, decennial census series, trade union ledger, and macroeconomic dataset drawn upon across the four industrial revolutions—formatted in strict alphabetical{' '}
              <strong className="text-[#002D72] dark:text-white font-semibold">Harvard Citation</strong> style with module-level traceability.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleCopyAllFiltered}
              className="px-3.5 py-2 rounded-lg dssg-btn-primary text-xs font-mono font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied {filteredSources.length} Citations</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Filtered ({filteredSources.length})</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadTxt}
              className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#002D72] dark:text-slate-200 text-xs font-mono font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#0056B3] dark:text-blue-400" />
              <span>Export .txt</span>
            </button>
          </div>
        </div>

        {/* Summary Quantitative Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative overflow-hidden p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#002D72] dark:bg-blue-500" />
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Verified Sources
            </div>
            <div className="text-2xl font-serif font-bold text-[#002D72] dark:text-white mt-1 tabular-nums">
              {sortedSources.length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Alphabetical A–Z Harvard Index
            </div>
          </div>

          <div className="relative overflow-hidden p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#F47E2D]" />
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Labor &amp; AI Economics
            </div>
            <div className="text-2xl font-serif font-bold text-[#002D72] dark:text-white mt-1 tabular-nums">
              {categoryCounts['economics-ai']}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Task-based, Polanyi &amp; LLM papers
            </div>
          </div>

          <div className="relative overflow-hidden p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#0056B3]" />
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Economic History
            </div>
            <div className="text-2xl font-serif font-bold text-[#002D72] dark:text-white mt-1 tabular-nums">
              {categoryCounts['economic-history']}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Monographs &amp; primary treatises
            </div>
          </div>

          <div className="relative overflow-hidden p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50">
            <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600 dark:bg-emerald-500" />
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Censuses, Statutes &amp; Data
            </div>
            <div className="text-2xl font-serif font-bold text-[#002D72] dark:text-white mt-1 tabular-nums">
              {categoryCounts['census-archives'] + categoryCounts['industry-global']}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Official archives &amp; macro series
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  selectedCategory === 'all'
                    ? 'dssg-btn-primary shadow-xs'
                    : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-[#0056B3]'
                }`}
              >
                All Sources ({sortedSources.length})
              </button>

              {CATEGORY_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap shrink-0 transition-colors ${
                    selectedCategory === key
                      ? 'dssg-btn-secondary shadow-xs'
                      : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-[#F47E2D]'
                  }`}
                >
                  {BIBLIOGRAPHY_CATEGORY_META[key].shortLabel} ({categoryCounts[key]})
                </button>
              ))}
            </div>

            {/* Era Filter */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 self-start md:self-auto shrink-0">
              {ERA_FILTERS.map((era) => (
                <button
                  key={era}
                  onClick={() => setSelectedEra(era)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors whitespace-nowrap shrink-0 ${
                    selectedEra === era
                      ? 'bg-[#002D72] dark:bg-blue-600 text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-[#002D72] dark:hover:text-white'
                  }`}
                >
                  {era}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar + Active Filter Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by author (e.g. Acemoglu, Allen, Polanyi), year, title, skill, or country..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#0056B3] dark:focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-mono text-slate-600 dark:text-slate-400 shrink-0">
              <span className="tabular-nums">
                Showing <strong className="text-[#002D72] dark:text-white">{filteredSources.length}</strong> of{' '}
                {sortedSources.length} entries
              </span>
              {(selectedCategory !== 'all' || selectedEra !== 'All' || searchQuery.trim() !== '') && (
                <button
                  onClick={resetFilters}
                  className="text-[#F47E2D] hover:underline font-semibold flex items-center gap-1 whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Alphabetical Harvard Bibliography List */}
        {filteredSources.length === 0 ? (
          <div className="p-10 text-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-2">
            <BookOpen className="w-6 h-6 text-slate-400 mx-auto" />
            <p className="text-sm font-serif font-semibold text-[#002D72] dark:text-white">
              No matching bibliography entries found
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Try clearing your search query or switching the Era / Category filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-[#0b1120] shadow-xs overflow-hidden">
            {filteredSources.map((source, idx) => {
              const catMeta = BIBLIOGRAPHY_CATEGORY_META[source.category];
              const isCopied = copiedId === source.id;

              return (
                <article
                  key={source.id}
                  className="p-5 sm:p-6 hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-3 flex-1 min-w-0">
                      {/* Unboxed Metadata Strip (Zero-Pill Discipline) */}
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        <span className="font-bold text-[#002D72] dark:text-slate-200 tabular-nums">
                          [{String(idx + 1).padStart(2, '0')}]
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">·</span>
                        <span className="font-semibold text-[#F47E2D] uppercase tracking-wider">
                          {catMeta.shortLabel}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">·</span>
                        <span className="text-[#0056B3] dark:text-blue-400 font-medium">
                          {source.erasCovered.join(' · ')}
                        </span>
                      </div>

                      {/* Formal Harvard Hanging-Indent Reference Line */}
                      <p className="pl-6 -indent-6 text-sm sm:text-[15px] font-serif text-slate-900 dark:text-slate-100 leading-relaxed">
                        {renderHarvardFormatted(source)}
                      </p>

                      {/* Detailed Annotation & Module Provenance */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-1 text-xs">
                        <div className="lg:col-span-7 text-slate-700 dark:text-slate-300 leading-relaxed">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
                            Data Pulled &amp; Empirical Contribution
                          </span>
                          {source.dataPulledSummary}
                        </div>

                        <div className="lg:col-span-5 text-slate-700 dark:text-slate-300 leading-relaxed lg:border-l lg:border-slate-200 dark:lg:border-slate-800 lg:pl-4">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-[#0056B3] dark:text-blue-400 block mb-0.5 font-semibold">
                            Referenced Across App Modules
                          </span>
                          <ul className="space-y-0.5 text-xs text-slate-700 dark:text-slate-300">
                            {source.whereUsedInApp.map((loc, locIdx) => (
                              <li key={locIdx} className="leading-snug">
                                <span className="text-[#F47E2D] mr-1.5">›</span>
                                {loc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* One-Click Copy Harvard Action */}
                    <div className="shrink-0 sm:pt-1">
                      <button
                        onClick={() => handleCopySingle(source.id, source.harvardCitation)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                          isCopied
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#0056B3] hover:text-[#002D72] dark:hover:text-white'
                        }`}
                        title="Copy Harvard citation string"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Harvard</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
