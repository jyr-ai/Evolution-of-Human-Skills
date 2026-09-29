import { useCallback, useEffect, useState } from 'react';
import { STATIONS, STEPS, type Step } from './stations';
import { Stage } from './Stage';

export function Journey() {
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState<Step | null>(null);
  const [playing, setPlaying] = useState(false);
  const [record, setRecord] = useState(false);
  const station = STATIONS[index];

  const go = useCallback((next: number) => {
    setIndex((next + STATIONS.length) % STATIONS.length);
    setStep(null);
    setRecord(false);
  }, []);

  const onStep = useCallback((next: Step) => {
    setStep((current) => (current === next ? null : next));
    setRecord(false);
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => go(index + 1), 5400);
    return () => window.clearTimeout(timer);
  }, [playing, index, go]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (event.key === 'ArrowRight') go(index + 1);
      if (event.key === 'ArrowLeft') go(index - 1);
      if (event.key === ' ') {
        event.preventDefault();
        setPlaying((value) => !value);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, index]);

  const line = step ? station.steps[step] : station.move;

  return (
    <div
      data-station={station.id}
      className="grid h-[100dvh] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-[var(--bg)] text-[var(--paper)]"
    >
      <header className="flex items-center gap-3 border-b border-white/10 px-3 py-2 sm:px-5">
        <div className="min-w-0 shrink-0">
          <p className="font-serif text-lg leading-none text-[var(--paper)] sm:text-xl">The Machine</p>
          <p className="mt-1 hidden text-[11px] uppercase tracking-[0.16em] text-[var(--muted)] sm:block">
            How a firm buys a skill
          </p>
        </div>

        <div className="mx-auto grid min-w-0 flex-1 grid-cols-4 gap-1 sm:max-w-xl" role="group" aria-label="The move">
          {STEPS.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={step === item.id}
              onClick={() => onStep(item.id)}
              className={`step-btn ${step === item.id ? 'step-on' : ''}`}
            >
              <span className="step-index">{itemIndex + 1}</span>
              {item.label}
            </button>
          ))}
        </div>

        <p className="hidden font-mono text-[11px] text-[var(--muted)] md:block">
          {String(index + 1).padStart(2, '0')} / {String(STATIONS.length).padStart(2, '0')}
        </p>
      </header>

      <main className="grid min-h-0 md:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.72fr)]">
        <Stage station={station} step={step} onStep={onStep} />

        <section className="flex min-h-0 flex-col justify-center gap-3 border-t border-white/10 px-4 py-3 md:border-t-0 md:border-l md:px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
            {station.year}
            <span className="text-[var(--muted)]"> · {station.place}</span>
          </p>

          <h1 className="font-serif text-[1.65rem] leading-[1.02] text-[var(--paper)] sm:text-[2rem]">
            {station.title}
          </h1>

          {record ? (
            <ul className="space-y-2.5">
              {station.sources.map((source) => (
                <li key={source.title}>
                  <p className="text-[13px] font-medium leading-snug text-[var(--paper)]">{source.title}</p>
                  <p className="mt-0.5 text-[12px] leading-snug text-[var(--muted)]">{source.detail}</p>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <p className="max-w-[36ch] text-[15px] leading-snug text-[var(--paper)]/90">{line}</p>
              <p className="font-serif text-[2rem] leading-none text-[var(--brass)] sm:text-[2.6rem]">{station.stat}</p>
              <p className="max-w-[38ch] text-[12.5px] leading-snug text-[var(--muted)]">{station.note}</p>
            </>
          )}

          <div className="mt-1">
            <button
              type="button"
              aria-pressed={record}
              onClick={() => {
                setRecord((open) => !open);
                setPlaying(false);
              }}
              className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)] underline decoration-white/20 underline-offset-4 hover:text-[var(--paper)]"
            >
              {record ? 'Back to the picture' : 'Record'}
            </button>
          </div>
        </section>
      </main>

      <footer className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-t border-white/10 px-3 py-2 sm:px-4">
        <button type="button" className="nav-arrow" onClick={() => go(index - 1)} aria-label="Previous station">
          ←
        </button>
        <div className="grid grid-cols-7 gap-1" role="tablist" aria-label="Journey">
          {STATIONS.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={itemIndex === index}
              onClick={() => {
                setPlaying(false);
                go(itemIndex);
              }}
              className={`year-btn ${itemIndex === index ? 'year-on' : ''}`}
            >
              <span className="year-mark" />
              <span>{item.nav}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="nav-arrow"
            aria-pressed={playing}
            aria-label={playing ? 'Pause the journey' : 'Play the journey'}
            onClick={() => setPlaying((value) => !value)}
          >
            {playing ? 'Pause' : 'Play'}
          </button>
          <button type="button" className="nav-arrow" onClick={() => go(index + 1)} aria-label="Next station">
            →
          </button>
        </div>
      </footer>
    </div>
  );
}
