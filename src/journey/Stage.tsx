import { useEffect, useRef, type ReactNode } from 'react';
import type { Station, Step } from './stations';

interface StageProps {
  station: Station;
  step: Step | null;
  onStep: (step: Step) => void;
}

function opacityFor(part: Step, step: Step | null) {
  if (!step) return 1;
  return step === part ? 1 : 0.34;
}

export function Stage({ station, step, onStep }: StageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      el.style.setProperty('--p', '1');
      return;
    }
    el.style.setProperty('--p', '0');
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1500);
      const eased = 1 - (1 - t) ** 3;
      el.style.setProperty('--p', eased.toFixed(3));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [station.id]);

  return (
    <div ref={ref} className="stage relative h-full min-h-0">
      <svg
        viewBox="0 0 960 540"
        overflow="hidden"
        className="h-full w-full"
        role="img"
        aria-label={`${station.human} beside ${station.machine}, owned by ${station.owner}`}
      >
        <Scene stationId={station.id} />
      </svg>

      <button
        type="button"
        className="hotspot left-[2%] top-[10%] h-[72%] w-[30%]"
        aria-pressed={step === 'hold'}
        aria-label={`${station.human}: the person who held the skill`}
        onClick={() => onStep('hold')}
      />
      <button
        type="button"
        className="hotspot right-[2%] top-[8%] h-[58%] w-[30%]"
        aria-pressed={step === 'cheapen'}
        aria-label={`${station.machine}: the machine that cheapens the task`}
        onClick={() => onStep('cheapen')}
      />
      <button
        type="button"
        className="hotspot bottom-[7%] right-[3%] h-[24%] w-[24%]"
        aria-pressed={step === 'own'}
        aria-label={`${station.owner}: who owns the machine`}
        onClick={() => onStep('own')}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-[7%] flex justify-between px-[6%] text-[11px] font-medium uppercase tracking-[0.16em]">
        <span style={{ opacity: opacityFor('hold', step) }}>{station.human}</span>
        <span className="text-[var(--brass)]" style={{ opacity: opacityFor('own', step) }}>
          {station.owner}
        </span>
      </div>
      <div
        className="pointer-events-none absolute right-[6%] top-[7%] text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--accent)]"
        style={{ opacity: opacityFor('cheapen', step) }}
      >
        {station.machine}
      </div>

      <div className="absolute left-[34%] top-[34%] flex w-36 flex-col gap-2 sm:left-[38%]">
        {station.tasks.map((task) => {
          const stays = task.to === 'human';
          const active =
            (stays && step === 'rest') ||
            (!stays && task.to === 'machine' && step === 'cheapen') ||
            (task.to === 'owner' && step === 'own');
          return (
            <button
              key={task.label}
              type="button"
              aria-pressed={active}
              onClick={() => onStep(stays ? 'rest' : task.to === 'owner' ? 'own' : 'cheapen')}
              className={`task-pill ${stays ? 'task-stay' : 'task-move'} ${active ? 'task-on' : ''}`}
            >
              {task.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Scene({ stationId }: { stationId: string }) {
  return (
    <>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#221910" />
          <stop offset="1" stopColor="#100e0c" />
        </linearGradient>
        <radialGradient id="glow" cx="30%" cy="45%" r="45%">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.28" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fire" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff5a1f" />
          <stop offset="1" stopColor="#ffd29a" />
        </linearGradient>
      </defs>
      <rect width="960" height="540" fill="url(#sky)" />
      <circle cx="280" cy="250" r="240" fill="url(#glow)" />
      <rect y="468" width="960" height="72" fill="#000" opacity="0.35" />
      {stationId === 'cotton' && <Cotton />}
      {stationId === 'law' && <Law />}
      {stationId === 'steel' && <Steel />}
      {stationId === 'type' && <TypeShop />}
      {stationId === 'line' && <Line />}
      {stationId === 'desk' && <Desk />}
      {stationId === 'model' && <Model />}
    </>
  );
}

function Spin({ cx, cy, children }: { cx: number; cy: number; children: ReactNode }) {
  return (
    <g>
      {children}
      <animateTransform
        attributeName="transform"
        type="rotate"
        from={`0 ${cx} ${cy}`}
        to={`360 ${cx} ${cy}`}
        dur="9s"
        repeatCount="indefinite"
      />
    </g>
  );
}

function Worker({ x, y, coat = '#3e6280', s = 1.35 }: { x: number; y: number; coat?: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="78" rx="26" ry="5" fill="#000" opacity="0.35" />
      <path d="M-16 18 h32 v40 h-32 z" fill={coat} />
      <circle cx="0" cy="-2" r="14" fill="#f3d2b0" />
      <path d="M-16 24 q-26 16 -4 34" stroke="#f3d2b0" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M16 22 q30 4 22 30" stroke="#f3d2b0" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M-10 60 q-4 16 2 20" stroke="#1b2430" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M10 60 q6 16 0 20" stroke="#1b2430" strokeWidth="6" fill="none" strokeLinecap="round" />
    </g>
  );
}

function Owner({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <Worker x={0} y={0} coat="#8a6a2f" />
      <circle cx="34" cy="36" r="7" fill="none" stroke="#e9c46a" strokeWidth="2" />
      <path d="M34 43 v10" stroke="#e9c46a" strokeWidth="2" />
    </g>
  );
}

function Cotton() {
  return (
    <g>
      <path d="M36 168 h150 v210 H36 z" fill="#2a1c14" />
      <rect x="58" y="196" width="46" height="58" fill="#e7c89a" opacity="0.45" />
      <Spin cx={150} cy={300}>
        <circle cx="150" cy="300" r="78" fill="none" stroke="#a56b3c" strokeWidth="10" />
        <circle cx="150" cy="300" r="10" fill="#f0d7b4" />
        {[0, 45, 90, 135].map((deg) => (
          <line
            key={deg}
            x1="150"
            y1="300"
            x2={150 + Math.cos((deg * Math.PI) / 180) * 78}
            y2={300 + Math.sin((deg * Math.PI) / 180) * 78}
            stroke="#a56b3c"
            strokeWidth="4"
          />
        ))}
      </Spin>
      <path d="M70 250 q50 -36 78 8" fill="none" stroke="#f4efe6" strokeWidth="3" strokeDasharray="5 5" />
      <Worker x={48} y={248} s={1.2} />
      <path d="M610 150 l40 -46 40 46 40 -46 40 46 40 -46 40 46 40 -46 42 46 v250 H610 z" fill="#2a231c" />
      <rect x="640" y="250" width="300" height="10" fill="#8a7b6a" />
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i} transform={`translate(${662 + i * 34} 260)`}>
          <rect x="-3" y="0" width="6" height="92" fill="#efe6d6" />
          <ellipse cx="0" cy="28" rx="11" ry="6" fill="var(--accent)" />
        </g>
      ))}
      <path
        d="M240 310 C 360 250, 470 360, 640 280"
        fill="none"
        stroke="#f4efe6"
        strokeWidth="3"
        strokeDasharray="220"
        style={{ strokeDashoffset: 'calc((1 - var(--p)) * 220)' }}
      />
      <Owner x={860} y={300} />
    </g>
  );
}

function Law() {
  return (
    <g>
      <g transform="translate(90 280)">
        <path d="M-46 -8 L46 36" stroke="#c0c6cc" strokeWidth="8" strokeLinecap="round" />
        <path d="M-46 36 L46 -8" stroke="#8d97a1" strokeWidth="8" strokeLinecap="round" />
        <circle cx="0" cy="14" r="7" fill="#e9c46a" />
      </g>
      <path d="M70 400 h28 l-6 28 h-16 z" fill="#6b3f2a" />
      <rect x="80" y="250" width="8" height="150" fill="#8a5a32" />
      <Worker x={210} y={250} />
      <g transform="translate(690 280)">
        <rect x="0" y="40" width="150" height="90" rx="46" fill="#3e474f" />
        <Spin cx={75} cy={85}>
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x="70" y="48" width="10" height="22" fill="#d9d0c3" transform={`rotate(${i * 45} 75 85)`} />
          ))}
        </Spin>
        <rect x="20" y="130" width="110" height="12" fill="#2a3136" />
      </g>
      <g transform="translate(760 150)" style={{ opacity: 'calc(0.35 + var(--p) * 0.65)' }}>
        <rect x="0" y="0" width="70" height="90" rx="3" fill="#efe6d6" />
        <circle cx="58" cy="74" r="8" fill="#9b2335" />
        <path d="M10 18 h50 M10 30 h40 M10 42 h46" stroke="#1a1612" strokeWidth="2" />
      </g>
      <Owner x={640} y={360} />
    </g>
  );
}

function Steel() {
  return (
    <g>
      <rect x="70" y="230" width="150" height="170" fill="#2a211c" />
      <rect x="100" y="270" width="90" height="70" fill="#1a0d08" />
      <ellipse cx="145" cy="310" rx="28" ry="40" fill="url(#fire)" style={{ opacity: 'calc(0.4 + var(--p) * 0.6)' }} />
      <path d="M180 300 L340 250" stroke="#5c656d" strokeWidth="6" strokeLinecap="round" />
      <Worker x={200} y={310} />
      <g transform="translate(660 150)">
        <rect x="20" y="250" width="150" height="16" fill="#3a4248" />
        <path
          d="M95 36 C 62 36 48 78 56 120 C 66 176 52 230 40 258 H150 C 138 230 124 176 134 120 C 142 78 128 36 95 36 Z"
          fill="#6a7580"
        />
        <ellipse cx="95" cy="42" rx="16" ry="7" fill="#14181c" />
        <g style={{ transform: 'scaleY(calc(0.25 + var(--p) * 0.75))', transformOrigin: '95px 36px' }}>
          <path d="M86 36 C 78 -8 112 -16 104 36 Z" fill="url(#fire)" />
        </g>
      </g>
      <Owner x={860} y={300} />
    </g>
  );
}

function TypeShop() {
  return (
    <g>
      <rect x="70" y="230" width="150" height="180" fill="#3a2a1c" />
      {Array.from({ length: 48 }, (_, i) => (
        <rect
          key={i}
          x={84 + (i % 8) * 16}
          y={246 + Math.floor(i / 8) * 22}
          width="12"
          height="16"
          fill={i % 5 === 0 ? '#e9c46a' : '#efe6d6'}
          opacity="0.85"
        />
      ))}
      <Worker x={230} y={320} />
      <g transform="translate(640 180)">
        <rect x="30" y="0" width="120" height="250" rx="6" fill="#4a5560" />
        <rect x="48" y="24" width="84" height="70" fill="#1c2126" />
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={52 + (i % 4) * 20} y={36 + Math.floor(i / 4) * 16} width="14" height="8" rx="2" fill="#d9d0c3" />
        ))}
        <rect x="55" y="120" width="70" height="18" fill="#e9c46a" style={{ opacity: 'calc(0.2 + var(--p))' }} />
        <path d="M10 210 h160" stroke="#2a3136" strokeWidth="10" />
      </g>
      <g style={{ opacity: 'calc(var(--p))' }}>
        <rect x="500" y="300" width="90" height="14" fill="#e9c46a" />
      </g>
      <Owner x={820} y={360} />
    </g>
  );
}

function Line() {
  return (
    <g>
      <g style={{ opacity: 'calc(1 - var(--p) * 0.7)' }}>
        <Worker x={70} y={230} />
        <path d="M150 330 h130 l18 -36 h60 l14 36 h24 v36 H150 z" fill="#1f6f8b" />
        <circle cx="190" cy="368" r="16" fill="#1a1612" stroke="#d9d0c3" strokeWidth="4" />
        <circle cx="330" cy="368" r="16" fill="#1a1612" stroke="#d9d0c3" strokeWidth="4" />
      </g>
      <rect x="520" y="400" width="380" height="10" fill="#6d6256" />
      <g style={{ transform: 'translateX(calc(var(--p) * 80px))' }}>
        <rect x="560" y="360" width="120" height="28" fill="#8ecae6" />
        <circle cx="590" cy="396" r="12" fill="#1a1612" stroke="#d9d0c3" strokeWidth="3" />
        <circle cx="660" cy="396" r="12" fill="#1a1612" stroke="#d9d0c3" strokeWidth="3" />
      </g>
      {[0, 1, 2, 3].map((i) => (
        <Worker key={i} x={600 + i * 70} y={300} />
      ))}
      <g transform="translate(860 250)">
        <circle cx="0" cy="0" r="22" fill="none" stroke="#e9c46a" strokeWidth="3" />
        <path d="M0 0 L0 -12" stroke="#e9c46a" strokeWidth="2" />
        <path d="M0 0 L8 6" stroke="#e9c46a" strokeWidth="2" />
      </g>
      <Owner x={860} y={300} />
    </g>
  );
}

function Desk() {
  return (
    <g>
      <rect x="60" y="300" width="220" height="16" fill="#6b3f2a" />
      <rect x="80" y="230" width="100" height="70" fill="#efe6d6" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M92 ${248 + i * 10} h76`} stroke="#1a1612" strokeWidth="2" opacity="0.6" />
      ))}
      <path d="M250 180 L300 300 H200 Z" fill="#e9c46a" opacity="0.18" />
      <Worker x={200} y={250} />
      <g transform="translate(650 200)">
        <rect x="0" y="0" width="180" height="130" rx="8" fill="#c5d5de" />
        <rect x="12" y="12" width="156" height="90" fill="#10221b" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x="24" y={28 + i * 16} width={90 - i * 12} height="6" fill="#9eebc4" opacity="0.85" />
        ))}
        <rect x="70" y="130" width="40" height="28" fill="#8aa0aa" />
      </g>
      <Owner x={860} y={330} />
    </g>
  );
}

function Model() {
  return (
    <g>
      <rect x="70" y="200" width="120" height="150" fill="#efe6d6" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M86 ${222 + i * 16} h88`} stroke="#1a1612" strokeWidth="2" opacity="0.55" />
      ))}
      <g style={{ opacity: 'calc(1 - var(--p) * 0.55)' }}>
        <Worker x={210} y={280} />
      </g>
      <g transform="translate(120 390)">
        <circle cx="0" cy="0" r="10" fill="#f0c9a0" />
        <path d="M-8 12 h16 v22 h-16 z" fill="#245c4a" />
        <path d="M8 18 L34 28" stroke="#d9d0c3" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g transform="translate(640 150)">
        <rect x="0" y="0" width="200" height="230" rx="10" fill="#17191c" stroke="#e9c46a" strokeWidth="3" />
        {Array.from({ length: 63 }, (_, i) => (
          <circle
            key={i}
            cx={22 + (i % 9) * 18}
            cy={24 + Math.floor(i / 9) * 28}
            r="4"
            fill="var(--accent)"
            opacity={0.35 + (i % 4) * 0.15}
          />
        ))}
      </g>
      <Owner x={860} y={340} />
    </g>
  );
}
