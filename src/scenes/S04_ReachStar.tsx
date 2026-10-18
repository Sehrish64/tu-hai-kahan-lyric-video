import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame} from 'remotion';
import {Abs, Canvas, ic} from '../utils';
import {AmberStar, DrawPath, Main} from '../components/Figures';
import {UrduInk} from '../components/Urdu';
import {C, GROUND} from '../theme';
import {SceneProps} from './types';

// Pahadi ka arc: (900,860) -> control (1300,480) -> (1700,860)
const hill = (u: number): [number, number] => {
  const a = (1 - u) * (1 - u);
  const b = 2 * u * (1 - u);
  const c = u * u;
  return [a * 900 + b * 1300 + c * 1700, a * GROUND + b * 480 + c * GROUND];
};

// S04: "Manzil aur tanhai" - taare ko chhoota hai, taara dhundla, Main akela wapas
export const ReachStar: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const STAR_Y = 360;
  // 0-25: zameen par chalna, 25-55: pahadi par chadhna, 58: taara chhoota hai, 70-108: wapas
  let mx: number;
  let my: number;
  let flip = false;
  let phase = f * 0.5;
  let armsUp = 0;
  if (f < 25) {
    mx = ic(f, [0, 25], [300, 900]);
    my = GROUND;
  } else if (f < 58) {
    const u = ic(f, [25, 55], [0, 0.5], Easing.out(Easing.quad));
    [mx, my] = hill(u);
    armsUp = ic(f, [45, 58], [0, 1]);
  } else if (f < 70) {
    [mx, my] = hill(0.5);
    armsUp = 1 - ic(f, [62, 70], [0, 1]);
    phase = 0;
  } else {
    const u = ic(f, [70, 108], [0.5, 0.15]);
    [mx, my] = hill(u);
    flip = true;
  }
  const dim = ic(f, [58, 76], [0, 1]);
  const camScale = ic(f, [60, 108], [1, 0.9]);
  // wapsi ke nishan (chhote dots)
  const trail = f >= 70 ? Array.from({length: 8}).map((_, k) => {
    const u = ic(f, [70, 108], [0.5, 0.15]) + (k + 1) * 0.03;
    return {p: hill(Math.min(0.5, u)), o: 0.5 - k * 0.06};
  }) : [];
  return (
    <AbsoluteFill style={{transform: `scale(${camScale})`, transformOrigin: '960px 540px'}}>
      <Canvas>
        <line x1={80} y1={GROUND} x2={1840} y2={GROUND} stroke={C.rain} strokeWidth={2} />
        <DrawPath d={`M900 ${GROUND} Q1300 480 1700 ${GROUND}`} start={0} dur={20} color={C.ink} width={6} />
        <AmberStar x={1300} y={STAR_Y} size={46} dim={dim} pulse={1 + 0.1 * Math.sin(f / 4) * (1 - dim)} />
        {f >= 56 && f < 62 && <circle cx={1300} cy={STAR_Y} r={ic(f, [56, 62], [30, 120])} fill="none" stroke={C.amber} strokeWidth={4} opacity={1 - ic(f, [56, 62], [0, 1])} />}
        {trail.map((t, i) => (
          <circle key={i} cx={t.p[0]} cy={t.p[1]} r={4} fill={C.ink} opacity={Math.max(0, t.o)} />
        ))}
        <Main x={mx} y={my} phase={phase} flip={flip} armsUp={armsUp} />
      </Canvas>
      <Abs x={520} y={380} style={{opacity: ic(f, [62, 70], [0, 0.9])}}>
        <UrduInk text="تنہا" start={62} dur={24} size={200} />
      </Abs>
    </AbsoluteFill>
  );
};
