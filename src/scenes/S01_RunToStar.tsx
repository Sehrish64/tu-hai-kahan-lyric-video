import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame} from 'remotion';
import {Abs, Canvas, ic, shake} from '../utils';
import {AmberStar, DrawPath, Main} from '../components/Figures';
import {UrduInk} from '../components/Urdu';
import {C, GROUND} from '../theme';
import {SceneProps} from './types';

// S01: "Had se aage" - Main taare ki taraf daudta hai aur "had" ki lakeer paar kar jata hai
export const RunToStar: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const whip = ic(f, [0, 8], [1, 0], Easing.out(Easing.cubic));
  const sh = shake(f, 5);
  const mainX = ic(f, [0, 80], [-60, 1500], Easing.in(Easing.quad));
  const HAD_X = 1100;
  const crossed = mainX >= HAD_X;
  const fc = Math.round(((1100 + 60) / 1560) ** 0.5 * 80); // taqreeban paar karne ka frame
  const hadOpacity = crossed ? 1 - ic(f, [fc, fc + 10], [0, 1]) : ic(f, [4, 14], [0, 1]);
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${whip * 220 + sh.x}px, ${sh.y}px)`,
        filter: `blur(${whip * 8}px)`,
      }}
    >
      <Canvas>
        <line x1={80} y1={GROUND} x2={1840} y2={GROUND} stroke={C.rain} strokeWidth={2} />
        <DrawPath d={`M${HAD_X} 560 L${HAD_X} ${GROUND}`} start={0} dur={14} color={C.rain} width={5} opacity={hadOpacity} />
        {/* speed lines */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const y = GROUND - 40 - i * 34;
          const x2 = mainX - 70 - ((f * 30 + i * 53) % 60);
          return <line key={i} x1={x2 - 130} y1={y} x2={x2} y2={y} stroke={C.ink} strokeWidth={3} opacity={0.3} />;
        })}
        <AmberStar x={1560} y={300} size={ic(f, [0, 80], [40, 58])} pulse={1 + 0.1 * Math.sin(f / 4)} />
        <Main x={mainX} phase={f * 0.55} armsUp={ic(f, [50, 80], [0, 0.5])} />
      </Canvas>
      <Abs x={HAD_X} y={430} style={{opacity: crossed ? 1 - ic(f, [fc, fc + 8], [0, 1]) : 1}}>
        <div style={{transform: crossed ? `translate(${(f - fc) * 6}px, ${(f - fc) * -4}px) rotate(${(f - fc) * 3}deg)` : undefined}}>
          <UrduInk text="حد" start={4} dur={14} size={170} />
        </div>
      </Abs>
    </AbsoluteFill>
  );
};
