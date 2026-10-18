import React from 'react';
import {Easing, useCurrentFrame} from 'remotion';
import {evolvePath} from '@remotion/paths';
import {C, GROUND} from '../theme';
import {ic} from '../utils';

// Haath se bani hui lakeer (stroke draw)
export const DrawPath: React.FC<{
  d: string;
  start: number;
  dur: number;
  color?: string;
  width?: number;
  opacity?: number;
}> = ({d, start, dur, color = C.ink, width = 6, opacity = 1}) => {
  const f = useCurrentFrame();
  const p = ic(f, [start, start + dur], [0, 1], Easing.bezier(0.4, 0, 0.2, 1));
  const {strokeDasharray, strokeDashoffset} = evolvePath(p, d);
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={strokeDasharray}
      strokeDashoffset={strokeDashoffset}
      opacity={opacity}
    />
  );
};

// MAIN: solid stick figure. (x, y) = pairon ka point. Ghost ke liye dashed=true, opacity=0.35
export const Main: React.FC<{
  x: number;
  y?: number;
  s?: number;
  phase?: number; // chalne ka phase
  flip?: boolean; // ulta mudna
  armsUp?: number; // 0..1 haath upar
  opacity?: number;
  dashed?: boolean;
  color?: string;
}> = ({x, y = GROUND, s = 1, phase = 0, flip = false, armsUp = 0, opacity = 1, dashed = false, color = C.ink}) => {
  const hip = -95 * s;
  const sh = -150 * s;
  const a = Math.sin(phase) * 0.55;
  const legEnd = (ang: number): [number, number] => [Math.sin(ang) * 95 * s, hip + Math.cos(ang) * 95 * s];
  const [lx, ly] = legEnd(a);
  const [rx, ry] = legEnd(-a);
  const armBase = Math.sin(phase + Math.PI) * 0.6;
  const bL = -armBase * (1 - armsUp) + -2.5 * armsUp;
  const bR = armBase * (1 - armsUp) + 2.5 * armsUp;
  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}
      opacity={opacity}
      stroke={color}
      strokeWidth={6}
      strokeLinecap="round"
      fill="none"
      strokeDasharray={dashed ? '10 14' : undefined}
    >
      <circle cx={0} cy={-196 * s} r={26 * s} />
      <line x1={0} y1={-170 * s} x2={0} y2={hip} />
      <line x1={0} y1={hip} x2={lx} y2={ly} />
      <line x1={0} y1={hip} x2={rx} y2={ry} />
      <line x1={0} y1={sh} x2={Math.sin(bL) * 70 * s} y2={sh + Math.cos(bL) * 70 * s} />
      <line x1={0} y1={sh} x2={Math.sin(bR) * 70 * s} y2={sh + Math.cos(bR) * 70 * s} />
    </g>
  );
};

// TUM: ghost figure (dashed, halki)
export const Ghost: React.FC<React.ComponentProps<typeof Main>> = (props) => (
  <Main opacity={0.35} dashed {...props} />
);

// Umeed ka amber taara. dim=0 roshan, dim=1 bujha hua (grey)
export const AmberStar: React.FC<{
  x: number;
  y: number;
  size?: number;
  dim?: number;
  pulse?: number;
  opacity?: number;
}> = ({x, y, size = 40, dim = 0, pulse = 1, opacity = 1}) => {
  const pts = Array.from({length: 10}, (_, i) => {
    const r = (i % 2 === 0 ? size : size * 0.45) * pulse;
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    return `${x + Math.cos(ang) * r},${y + Math.sin(ang) * r}`;
  }).join(' ');
  return (
    <g opacity={opacity}>
      <polygon
        points={pts}
        fill="none"
        stroke={C.amber}
        strokeWidth={6}
        strokeLinejoin="round"
        opacity={1 - dim}
        style={{filter: `drop-shadow(0 0 ${22 * (1 - dim)}px ${C.amber})`}}
      />
      <polygon points={pts} fill="none" stroke={C.rain} strokeWidth={6} strokeLinejoin="round" opacity={dim} />
    </g>
  );
};

// Phool (5 pankhuriyan)
export const Flower: React.FC<{
  x: number;
  y: number;
  r?: number;
  color?: string;
  glow?: boolean;
  scale?: number;
  opacity?: number;
}> = ({x, y, r = 26, color = C.ink, glow = false, scale = 1, opacity = 1}) => (
  <g
    transform={`translate(${x} ${y}) scale(${scale})`}
    opacity={opacity}
    stroke={color}
    strokeWidth={4}
    fill="none"
    style={glow ? {filter: `drop-shadow(0 0 16px ${C.amber})`} : undefined}
  >
    <circle r={r * 0.3} />
    {[0, 1, 2, 3, 4].map((i) => {
      const ang = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      return <circle key={i} cx={Math.cos(ang) * r * 0.65} cy={Math.sin(ang) * r * 0.65} r={r * 0.38} />;
    })}
  </g>
);

// Baithi hui figure (bench ke liye). y = zameen, seat height = y - 90*s
export const Sitter: React.FC<{
  x: number;
  y?: number;
  s?: number;
  flip?: boolean;
  opacity?: number;
  dashed?: boolean;
  color?: string;
}> = ({x, y = GROUND, s = 1, flip = false, opacity = 1, dashed = false, color = C.ink}) => (
  <g
    transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}
    opacity={opacity}
    stroke={color}
    strokeWidth={6}
    strokeLinecap="round"
    fill="none"
    strokeDasharray={dashed ? '10 14' : undefined}
  >
    <circle cx={0} cy={-196 * s} r={26 * s} />
    <line x1={0} y1={-170 * s} x2={0} y2={-90 * s} />
    <line x1={0} y1={-90 * s} x2={70 * s} y2={-90 * s} />
    <line x1={70 * s} y1={-90 * s} x2={70 * s} y2={0} />
    <line x1={0} y1={-150 * s} x2={50 * s} y2={-105 * s} />
  </g>
);
