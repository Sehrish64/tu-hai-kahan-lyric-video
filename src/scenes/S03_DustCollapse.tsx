import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Abs, Canvas, Glitch, ic, shake} from '../utils';
import {DrawPath, Main} from '../components/Figures';
import {DustWord} from '../components/Urdu';
import {C, GROUND} from '../theme';
import {SceneProps} from './types';

const BALL_X = [840, 960, 1080, 900, 1020];

// S03: "Khak" - zameen mein darar, gubbare phat jate hain, sab khak ban jata hai
export const DustCollapse: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const sh = shake(f, f < 30 ? ic(f, [0, 30], [4, 22]) : ic(f, [30, 84], [22, 6]));
  const sink = ic(f, [24, 60], [0, 300]);
  const mainOpacity = 1 - ic(f, [40, 70], [0, 1]);
  const glitchOn = f < 6 || (f >= 28 && f < 34);
  const flash = f < 3 ? 0.5 : 0;
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Canvas>
        <line x1={80} y1={GROUND} x2={1840} y2={GROUND} stroke={C.rain} strokeWidth={2} />
        <DrawPath d={`M960 ${GROUND} L930 ${GROUND + 25} L975 ${GROUND + 50} L940 ${GROUND + 78} L985 ${GROUND + 108} L955 ${GROUND + 140}`} start={6} dur={20} color={C.ink} width={5} />
        <Main x={960} y={GROUND + sink} opacity={mainOpacity} armsUp={ic(f, [0, 14], [0.8, 0])} />
        {BALL_X.map((x, i) => {
          const q = ic(f, [0, 14], [0, 1]);
          return <circle key={i} cx={x} cy={520 - i * 20} r={34 * (1 + q * 0.8)} fill="none" stroke={C.ink} strokeWidth={5} opacity={1 - q} />;
        })}
        {f >= 24 &&
          Array.from({length: 60}).map((_, i) => {
            const t = (f - 24) / 60;
            const ang = (i / 60) * Math.PI * 2;
            const r = 40 + t * (200 + (i % 7) * 40);
            return <circle key={'d' + i} cx={960 + Math.cos(ang) * r} cy={760 + Math.sin(ang) * r * 0.6 + t * 80} r={2 + (i % 4)} fill={C.ink} opacity={0.7 * (1 - t)} />;
          })}
      </Canvas>
      <Abs x={960} y={360}>
        <Glitch on={glitchOn}>
          <DustWord text="خاک" start={18} dur={50} size={230} id="dust-s03" />
        </Glitch>
      </Abs>
      <AbsoluteFill style={{backgroundColor: '#fff', opacity: flash}} />
    </AbsoluteFill>
  );
};
