import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FPS, W, H, RAIN_KEYS, RAIN_FROZEN} from '../theme';

const STARS: [number, number][] = [
  [150, 140], [420, 90], [760, 160], [1080, 100], [1330, 190], [1620, 120],
  [1800, 260], [250, 330], [900, 300], [1470, 330], [60, 520], [1860, 480],
];

const rainLevel = (t: number) => {
  for (let i = 0; i < RAIN_KEYS.length - 1; i++) {
    const [t0, v0] = RAIN_KEYS[i];
    const [t1, v1] = RAIN_KEYS[i + 1];
    if (t >= t0 && t <= t1) return v0 + ((v1 - v0) * (t - t0)) / (t1 - t0);
  }
  return 0;
};

// Peeche ka hissa: navy background, taare, barish (global, poori video mein)
export const StageBack: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const frozen = t >= RAIN_FROZEN[0] && t <= RAIN_FROZEN[1];
  const rf = frozen ? Math.round(RAIN_FROZEN[0] * FPS) : f; // frozen = boondein ruki hui
  const level = rainLevel(t);
  const count = Math.round(level * 70);
  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
        {STARS.map(([x, y], i) => {
          const tw = 0.35 + 0.35 * Math.sin(f / 18 + i * 1.7);
          return (
            <path
              key={'s' + i}
              d={`M${x} ${y - 14} L${x + 5} ${y - 5} L${x + 14} ${y} L${x + 5} ${y + 5} L${x} ${y + 14} L${x - 5} ${y + 5} L${x - 14} ${y} L${x - 5} ${y - 5} Z`}
              fill="none"
              stroke={C.rain}
              strokeWidth={2}
              opacity={tw}
            />
          );
        })}
        {Array.from({length: count}).map((_, i) => {
          const x = ((i * 97 + (i % 7) * 13) % (W + 80)) - 40;
          const v = 12 + (i % 5) * 3;
          const y = ((i * 211 + rf * v) % (H + 240)) - 120;
          return (
            <line
              key={'r' + i}
              x1={x}
              y1={y}
              x2={x - 8}
              y2={y + 36}
              stroke={C.rain}
              strokeWidth={2}
              opacity={0.22 + 0.12 * (i % 3)}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// Upar ka hissa: vignette + film grain
export const StageFront: React.FC = () => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2) % 50;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}}
      />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: 0.07, mixBlendMode: 'overlay'}}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={2} seed={seed} />
        </filter>
        <rect width={W} height={H} filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};
