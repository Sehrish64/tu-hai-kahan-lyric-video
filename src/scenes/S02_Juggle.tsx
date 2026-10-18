import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Abs, Canvas, ic} from '../utils';
import {Main} from '../components/Figures';
import {UrduInk} from '../components/Urdu';
import {C, GROUND} from '../theme';
import {SceneProps} from './types';

// S02: "Mazak" - Main gubbare/sikke hawa mein uchhalta hai, be-parwai hansi
export const BALLS = [0, 1, 2, 3, 4];

export const Juggle: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const out = ic(f, [dur - 6, dur], [1, 0.92]);
  return (
    <AbsoluteFill style={{transform: `scale(${out})`}}>
      <Canvas>
        <line x1={80} y1={GROUND} x2={1840} y2={GROUND} stroke={C.rain} strokeWidth={2} />
        <Main x={960} phase={0} armsUp={0.55 + 0.45 * Math.sin(f / 3)} />
        {BALLS.map((i) => {
          const p = f / 10 + i * 1.26;
          const x = 960 + (i - 2) * 120 + Math.sin(p) * 40;
          const y = 520 - Math.abs(Math.sin(p * 0.8)) * 230;
          return <circle key={i} cx={x} cy={y} r={34} fill="none" stroke={C.ink} strokeWidth={5} opacity={0.9} />;
        })}
      </Canvas>
      <Abs x={960} y={200} style={{transform: `translate(-50%, calc(-50% + ${Math.sin(f / 3) * 14}px))`}}>
        <UrduInk text="مذاق" start={0} dur={12} size={150} />
      </Abs>
    </AbsoluteFill>
  );
};
