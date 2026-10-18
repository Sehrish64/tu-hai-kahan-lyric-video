import React from 'react';
import {interpolate} from 'remotion';
import {noise2D} from '@remotion/noise';
import {W, H} from './theme';

// clamp ke saath interpolate (chhota naam)
export const ic = (
  v: number,
  inp: [number, number],
  out: [number, number],
  easing?: (t: number) => number,
) =>
  interpolate(v, inp, out, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Dard ka jhatka (shake)
export const shake = (frame: number, amount: number, seed = 'sx') => ({
  x: noise2D(seed + 'x', frame / 3, 0) * amount,
  y: noise2D(seed + 'y', 0, frame / 3) * amount,
});

// HTML overlay ko (x, y) par center karna
export const Abs: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({x, y, children, style}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: 'translate(-50%, -50%)',
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);

// Poori screen ka SVG canvas (1920x1080)
export const Canvas: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg
    width={W}
    height={H}
    viewBox={`0 0 ${W} ${H}`}
    style={{position: 'absolute', inset: 0}}
  >
    {children}
  </svg>
);

// RGB split (glitch)
export const Glitch: React.FC<{on: boolean; children: React.ReactNode}> = ({on, children}) => (
  <div style={{position: 'relative'}}>
    {on && (
      <div style={{position: 'absolute', inset: 0, transform: 'translateX(-7px)', color: '#ff4d6d', mixBlendMode: 'screen'}}>
        {children}
      </div>
    )}
    {on && (
      <div style={{position: 'absolute', inset: 0, transform: 'translateX(7px)', color: '#4dd0ff', mixBlendMode: 'screen'}}>
        {children}
      </div>
    )}
    <div style={{position: 'relative'}}>{children}</div>
  </div>
);

// 0..1 progress between two frames
export const p = (f: number, a: number, b: number) => ic(f, [a, b], [0, 1]);

export const Ground: React.FC = () => (
  <line x1={80} y1={860} x2={1840} y2={860} stroke="#8A93A6" strokeWidth={2} />
);
