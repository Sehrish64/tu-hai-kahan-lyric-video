import React from 'react';
import {C, GROUND} from '../theme';

type G = {x: number; y: number; s?: number; opacity?: number; color?: string; children?: React.ReactNode};

// Amber roshni ka halo
export const Glow: React.FC<{x: number; y: number; r: number; opacity?: number; id?: string}> = ({x, y, r, opacity = 1, id = 'glow1'}) => (
  <g opacity={opacity}>
    <defs>
      <radialGradient id={id}>
        <stop offset="0" stopColor={C.amber} stopOpacity={0.55} />
        <stop offset="1" stopColor={C.amber} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
  </g>
);

export const Eye: React.FC<G & {open?: number}> = ({x, y, s = 1, open = 1, opacity = 1, color = C.ink, children}) => {
  const h = 130 * s * open;
  return (
    <g opacity={opacity} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round">
      <path d={`M${x - 150 * s} ${y} Q${x} ${y - h} ${x + 150 * s} ${y} Q${x} ${y + h} ${x - 150 * s} ${y}`} />
      <g transform={`translate(${x} ${y}) scale(1 ${Math.max(0.01, open)})`}>
        <circle r={48 * s} />
        <circle r={16 * s} fill={color} />
      </g>
      {children}
    </g>
  );
};

export const Tear: React.FC<G & {glow?: boolean}> = ({x, y, s = 1, opacity = 1, color = C.ink, glow}) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M0 -26 C14 -4 20 6 0 18 C-20 6 -14 -4 0 -26Z"
    fill="none"
    stroke={color}
    strokeWidth={5}
    strokeLinejoin="round"
    opacity={opacity}
    style={glow ? {filter: `drop-shadow(0 0 14px ${C.amber})`} : undefined}
  />
);

export const Heart: React.FC<G & {crack?: number; glow?: boolean; crackColor?: string}> = ({x, y, s = 1, opacity = 1, color = C.amber, crack = 0, glow = true, crackColor = C.ink}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity} fill="none" strokeLinejoin="round" strokeLinecap="round" style={glow ? {filter: `drop-shadow(0 0 14px ${color})`} : undefined}>
    <path d="M0 34 C-70 -8 -46 -58 0 -22 C46 -58 70 -8 0 34Z" stroke={color} strokeWidth={6} />
    {crack > 0 && <path d="M4 -26 L-10 -4 L8 8 L-6 28" stroke={crackColor} strokeWidth={5} opacity={crack} />}
  </g>
);

export const Lantern: React.FC<G & {glow?: number}> = ({x, y, s = 1, opacity = 1, glow = 1}) => (
  <g opacity={opacity}>
    <Glow x={x} y={y - 24 * s} r={110 * s * glow} opacity={glow} id="glowLantern" />
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={C.amber} strokeWidth={5} fill="none" strokeLinecap="round">
      <path d="M-10 -48 Q0 -68 10 -48" />
      <rect x={-17} y={-46} width={34} height={42} rx={4} />
      <line x1={-12} y1={-46} x2={-12} y2={-4} opacity={0.5} />
      <line x1={12} y1={-46} x2={12} y2={-4} opacity={0.5} />
      <circle cx={0} cy={-26} r={8} fill={C.amber} />
    </g>
  </g>
);

export const House: React.FC<G & {lit?: number; crack?: number}> = ({x, y, s = 1, opacity = 1, color = C.ink, lit = 0, crack = 0}) => (
  <g opacity={opacity}>
    {lit > 0 && <Glow x={x} y={y - 85 * s} r={170 * s} opacity={lit} id="glowHouse" />}
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={color} strokeWidth={6} fill="none" strokeLinejoin="round" strokeLinecap="round">
      <path d="M-120 0 L-120 -150 L0 -250 L120 -150 L120 0" />
      <rect x={-34} y={-120} width={68} height={68} stroke={lit > 0 ? C.amber : color} fill={lit > 0 ? `rgba(255,200,87,${0.55 * lit})` : 'none'} />
      {lit > 0 && <line x1={0} y1={-120} x2={0} y2={-52} stroke={C.amber} opacity={0.6} />}
      {crack > 0 && <path d="M20 -250 L0 -190 L26 -150 L4 -100 L30 -50" stroke={color} opacity={crack} />}
    </g>
  </g>
);

export const Bench: React.FC<G> = ({x, y, s = 1, opacity = 1, color = C.ink}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round">
    <line x1={-170} y1={-90} x2={170} y2={-90} />
    <line x1={-170} y1={-170} x2={170} y2={-170} />
    <line x1={-150} y1={-90} x2={-150} y2={-170} />
    <line x1={150} y1={-90} x2={150} y2={-170} />
    <line x1={-140} y1={-90} x2={-140} y2={0} />
    <line x1={140} y1={-90} x2={140} y2={0} />
  </g>
);

// Skyline: buildings + windows
const BLD: {x: number; w: number; h: number}[] = [];
{
  let cx = -200;
  const ws = [140, 110, 170, 120, 150];
  const hs = [300, 420, 260, 380, 340, 450];
  for (let i = 0; cx < 2700; i++) {
    const w = ws[i % ws.length];
    BLD.push({x: cx, w, h: hs[i % hs.length]});
    cx += w + 14;
  }
}
const WINS: {x: number; y: number; i: number}[] = [];
BLD.forEach((b) => {
  const rows = Math.floor(b.h / 70) - 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < 3; c++) {
      WINS.push({x: b.x + 18 + c * ((b.w - 36) / 3) + 4, y: GROUND - b.h + 26 + r * 66, i: WINS.length});
    }
  }
});
export const SKY_N = WINS.length;
export const skyRank = (i: number) => (i * 37) % SKY_N;

export const Skyline: React.FC<{lit: (i: number) => boolean; opacity?: number}> = ({lit, opacity = 1}) => (
  <g opacity={opacity}>
    {BLD.map((b, k) => (
      <path key={'b' + k} d={`M${b.x} ${GROUND} L${b.x} ${GROUND - b.h} L${b.x + b.w} ${GROUND - b.h} L${b.x + b.w} ${GROUND}`} fill="none" stroke={C.rain} strokeWidth={3} opacity={0.5} />
    ))}
    {WINS.map((w) => {
      const on = lit(w.i);
      return (
        <rect
          key={'w' + w.i}
          x={w.x}
          y={w.y}
          width={26}
          height={34}
          fill={on ? C.amber : 'none'}
          stroke={on ? C.amber : C.rain}
          strokeWidth={2}
          opacity={on ? 0.95 : 0.25}
          style={on ? {filter: `drop-shadow(0 0 8px ${C.amber})`} : undefined}
        />
      );
    })}
  </g>
);

export const Cloud: React.FC<G> = ({x, y, s = 1, opacity = 1, color = C.ink}) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M-70 20 Q-90 -10 -50 -14 Q-40 -50 0 -40 Q40 -60 56 -20 Q96 -14 80 20 Z" fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" opacity={opacity} />
);

export const WeatherIcon: React.FC<{kind: number; x: number; y: number; s?: number; opacity?: number}> = ({kind, x, y, s = 2, opacity = 1}) => {
  const k = kind % 5;
  return (
    <g opacity={opacity}>
      {k === 0 && <Cloud x={x} y={y} s={s} />}
      {k === 1 && (
        <g transform={`translate(${x} ${y}) scale(${s})`} stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round">
          <circle r={28} />
          {Array.from({length: 8}).map((_, i) => {
            const a = (i * Math.PI) / 4;
            return <line key={i} x1={Math.cos(a) * 40} y1={Math.sin(a) * 40} x2={Math.cos(a) * 58} y2={Math.sin(a) * 58} />;
          })}
        </g>
      )}
      {k === 2 && (
        <g transform={`translate(${x} ${y}) scale(${s})`} stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round">
          <path d="M-70 -20 Q-20 -40 20 -20 Q50 -8 40 10" />
          <path d="M-70 10 Q0 -10 50 14" />
          <path d="M-50 40 Q0 24 36 44" />
        </g>
      )}
      {k === 3 && (
        <g>
          <Cloud x={x} y={y - 20 * s} s={s} />
          {[-40, 0, 40].map((dx, i) => (
            <line key={i} x1={x + dx * s - 6} y1={y + 20 * s} x2={x + dx * s - 16} y2={y + 56 * s} stroke={C.rain} strokeWidth={5} strokeLinecap="round" />
          ))}
        </g>
      )}
      {k === 4 && <path transform={`translate(${x} ${y}) scale(${s * 0.8})`} d="M20 -50 A50 50 0 1 0 20 50 A38 38 0 1 1 20 -50Z" fill="none" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />}
    </g>
  );
};

export const Page: React.FC<G & {w?: number; h?: number; rot?: number; lines?: number}> = ({x, y, w = 300, h = 400, rot = 0, lines = 6, opacity = 1, color = C.ink, s = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={opacity} stroke={color} strokeWidth={4} fill="rgba(5,10,20,0.85)" strokeLinejoin="round" strokeLinecap="round">
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} />
    {Array.from({length: lines}).map((_, i) => (
      <line key={i} x1={-w / 2 + 28} y1={-h / 2 + 60 + i * ((h - 100) / Math.max(1, lines))} x2={w / 2 - 28} y2={-h / 2 + 60 + i * ((h - 100) / Math.max(1, lines))} opacity={0.35} />
    ))}
  </g>
);

export const Letterbox: React.FC<G & {open?: number}> = ({x, y, s = 1, open = 0, opacity = 1, color = C.ink}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <line x1={0} y1={0} x2={0} y2={160} />
    <path d="M-100 0 L-100 -90 Q-100 -140 0 -140 Q100 -140 100 -90 L100 0 Z" />
    <ellipse cx={0} cy={-60} rx={64} ry={42} fill={open > 0 ? 'rgba(0,0,0,0.6)' : 'none'} opacity={open > 0 ? 1 : 0} />
    <line x1={-64} y1={-60} x2={-64 - 50 * open} y2={-60 + 30 * open} />
  </g>
);

export const Umbrella: React.FC<G & {open?: number}> = ({x, y, s = 1, open = 1, opacity = 1, color = C.ink}) => {
  const o = Math.max(0.05, open);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${-140 * o} 0 Q0 ${-170 * o} ${140 * o} 0 Q${70 * o} -34 0 0 Q${-70 * o} -34 ${-140 * o} 0`} />
      <path d={`M${-140 * o} 0 Q0 ${-170 * o} ${140 * o} 0`} stroke={C.amber} opacity={0.9} />
      <path d="M0 0 L0 150 Q0 176 -24 168" />
    </g>
  );
};

export const Clock: React.FC<G & {r?: number; angle?: number}> = ({x, y, r = 60, angle = 0, opacity = 1, color = C.ink}) => (
  <g transform={`translate(${x} ${y})`} opacity={opacity} stroke={color} strokeWidth={5} fill="none" strokeLinecap="round">
    <circle r={r} />
    <line x1={0} y1={0} x2={0} y2={-r * 0.75} transform={`rotate(${angle})`} />
    <line x1={0} y1={0} x2={0} y2={-r * 0.45} transform={`rotate(${angle / 12})`} />
  </g>
);

export const Pawn: React.FC<G> = ({x, y, s = 1, opacity = 1, color = C.ink}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity} stroke={color} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx={0} cy={-72} r={17} />
    <line x1={-11} y1={-52} x2={11} y2={-52} />
    <path d="M-14 -50 Q-26 -10 -36 0 L36 0 Q26 -10 14 -50" />
  </g>
);

export const QMark: React.FC<G> = ({x, y, s = 1, opacity = 1, color = C.ink}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round">
    <path d="M-22 -40 Q-22 -70 4 -70 Q30 -70 30 -44 Q30 -26 4 -14 Q-2 -8 -2 6" />
    <circle cx={-2} cy={30} r={3} fill={color} />
  </g>
);

export const Waveform: React.FC<{x: number; y: number; w: number; amp: number; f: number; speed?: number; opacity?: number}> = ({x, y, w, amp, f, speed = 0.3, opacity = 1}) => {
  const n = 80;
  const pts = Array.from({length: n + 1}, (_, i) => {
    const t = i / n;
    const env = Math.sin(Math.PI * t);
    return `${x - w / 2 + t * w},${y + Math.sin(i * 0.55 + f * speed) * amp * env}`;
  }).join(' ');
  return <polyline points={pts} fill="none" stroke={C.ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={opacity} />;
};

export const Bubble: React.FC<G & {r?: number; dashed?: boolean}> = ({x, y, r = 70, opacity = 1, color = C.ink, dashed}) => (
  <g opacity={opacity} stroke={color} strokeWidth={5} fill="none" strokeDasharray={dashed ? '10 12' : undefined}>
    <circle cx={x} cy={y} r={r} />
    <circle cx={x - r * 0.7} cy={y + r * 1.15} r={r * 0.16} />
    <circle cx={x - r * 0.95} cy={y + r * 1.5} r={r * 0.08} />
  </g>
);
