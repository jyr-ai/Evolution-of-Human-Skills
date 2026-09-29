import React, { useState } from 'react';
import { INDUSTRIAL_ERAS } from '../data/industrialErasData';
import { COMMON_THREAD_SYNTHESIS, ENDURING_HUMAN_CORE, SCHOLAR_CITATIONS } from '../data/synthesisData';
import { X, Copy, Check, FileText, Code2, Download } from 'lucide-react';

interface ResearchBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResearchBriefModal: React.FC<ResearchBriefModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<'markdown' | 'json'>('markdown');

  if (!isOpen) return null;

  const generateMarkdown = () => {
    return `# The Great Displacement: Skill Evolution Across Four Industrial Revolutions
Historical & Labor Economics Dataset Grounded in Scholar Literature

## Synthesis & Common Thread
${COMMON_THREAD_SYNTHESIS.summary}

Quote: "${COMMON_THREAD_SYNTHESIS.inversionQuote}"

${INDUSTRIAL_ERAS.map(
  (era) => `
### Era ${era.romanNumeral}: ${era.title} (${era.timeframe})
**Tech Shock:** ${era.coreTechShock}
**Key Quote:** "${era.keyQuote.text}" — ${era.keyQuote.author} (${era.keyQuote.context})

#### Obsolescent Skills:
${era.skills
  .filter((s) => s.category === 'obsolescent')
  .map((s) => `- **${s.name}** (${s.craftDomain}): Displaced by ${s.displacingOrEnablingTech}. ${s.description}`)
  .join('\n')}

#### Transformed Skills:
${era.skills
  .filter((s) => s.category === 'transformed')
  .map((s) => `- **${s.name}** (${s.craftDomain}): Evolved via ${s.displacingOrEnablingTech}. ${s.description}`)
  .join('\n')}

#### Emergent Skills:
${era.skills
  .filter((s) => s.category === 'emergent')
  .map((s) => `- **${s.name}** (${s.craftDomain}): Created by ${s.displacingOrEnablingTech}. ${s.description}`)
  .join('\n')}

#### Losers vs. Winners:
**Losers:**
${era.losers.map((l) => `- *${l.name}*: ${l.whyAffected} Reaction: ${l.reactionOrLeverage}`).join('\n')}

**Winners:**
${era.winners.map((w) => `- *${w.name}*: ${w.whyAffected} Outcome: ${w.longTermOutcome}`).join('\n')}
`
).join('\n')}

## The Enduring Human Core
${ENDURING_HUMAN_CORE.map(
  (c, i) => `${i + 1}. **${c.name}** (${c.archetype}): ${c.whyEnduring}\n   *AI Immunity:* ${c.aiImmunityRationale}`
).join('\n\n')}
`;
  };

  const getFullContent = () => {
    if (format === 'json') {
      return JSON.stringify(
        {
          meta: {
            title: 'The Great Displacement Dataset',
            erasCount: INDUSTRIAL_ERAS.length,
            enduringCoreCount: ENDURING_HUMAN_CORE.length,
          },
          eras: INDUSTRIAL_ERAS,
          synthesis: COMMON_THREAD_SYNTHESIS,
          enduringCore: ENDURING_HUMAN_CORE,
          scholarCitations: SCHOLAR_CITATIONS,
        },
        null,
        2
      );
    }
    return generateMarkdown();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFullContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-[#0b0f19] border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs font-mono text-orange-400 uppercase tracking-wider">
              Research Dataset & Export
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-0.5">
              Comprehensive Curriculum & Narrative Framework
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector & Actions */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setFormat('markdown')}
              className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors ${
                format === 'markdown' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Markdown</span>
            </button>
            <button
              onClick={() => setFormat('json')}
              className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors ${
                format === 'json' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>JSON Structured</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-mono font-semibold transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Full Dataset</span>
              </>
            )}
          </button>
        </div>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
          {getFullContent()}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Grounded in Google Scholar labor economics literature</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 text-white hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
