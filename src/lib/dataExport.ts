import { INDUSTRIAL_ERAS } from '../data/industrialErasData';

const csvCell = (v: unknown) => {
  const s = v == null ? '' : Array.isArray(v) ? v.join('; ') : typeof v === 'object' ? JSON.stringify(v) : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const download = (name: string, body: string, type: string) => {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

/** One row per skill per era, built from the bundled dataset. No sign-in needed. */
export const downloadSkillsCsv = () => {
  const rows = INDUSTRIAL_ERAS.flatMap((era) =>
    era.skills.map((s) => ({ era: era.title, timeframe: era.timeframe, ...s }))
  );
  const cols = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => csvCell((r as Record<string, unknown>)[c])).join(','))].join('\n');
  download('evolution-of-human-skills.csv', csv, 'text/csv;charset=utf-8');
};
