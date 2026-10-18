import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Abs, Canvas, ic, lerp} from '../utils';
import {DrawPath, Flower} from '../components/Figures';
import {UrduInk} from '../components/Urdu';
import {C} from '../theme';
import {SceneProps} from './types';

const P: [number, number][] = [[260, 760], [520, 700], [760, 640], [1080, 520]];
const bez = (t: number): [number, number] => {
  const u = 1 - t;
  return [
    u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0],
    u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1],
  ];
};
const D = 'M260 760 C520 700 760 640 1080 520';
const TS = [0.18, 0.34, 0.5, 0.66, 0.82, 0.96];
const FLOWERS = TS.map((t) => {
  const [x, y] = bez(t);
  return {x, y: y - 28};
});
const LAST = FLOWERS[5];
const pickFrame = (i: number) => 36 + i * 15;
const slot = (i: number): [number, number] => [1440 + i * 30, 800];

// S05: "Phool aur shakh" - ghost haath phool todta hai, shakh par ek akela amber phool reh jata hai
export const FlowerBranch: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const cam = ic(f, [0, 150], [1, 1.1]);
  const fall = f - 108;
  return (
    <AbsoluteFill style={{transform: `scale(${cam})`, transformOrigin: `${LAST.x}px ${LAST.y}px`}}>
      <Canvas>
        <DrawPath d={D} start={0} dur={30} width={7} />
        <DrawPath d="M1380 770 Q1500 900 1620 770" start={20} dur={20} width={5} />
        {FLOWERS.map((fl, i) => {
          const isLast = i === 5;
          if (isLast) {
            const amber = f >= 100;
            return (
              <Flower
                key={i}
                x={fl.x}
                y={fl.y}
                color={amber ? C.amber : C.ink}
                glow={amber}
                opacity={ic(f, [20 + i * 3, 30 + i * 3], [0, 1])}
              />
            );
          }
          const pf = pickFrame(i);
          const q = ic(f, [pf, pf + 14], [0, 1]);
          const [sx, sy] = slot(i);
          const x = lerp(fl.x, sx, q);
          const y = lerp(fl.y, sy, q) - Math.sin(q * Math.PI) * 120;
          return (
            <Flower key={i} x={x} y={y} scale={lerp(1, 0.6, q)} opacity={ic(f, [20 + i * 3, 30 + i * 3], [0, 1])} />
          );
        })}
        {/* ghost haath: dashed lakeer upar se phool tak */}
        {FLOWERS.slice(0, 5).map((fl, i) => {
          const pf = pickFrame(i);
          const o = Math.min(ic(f, [pf - 10, pf - 2], [0, 0.45]), 1 - ic(f, [pf + 8, pf + 16], [0, 1]));
          if (o <= 0) return null;
          const q = ic(f, [pf, pf + 14], [0, 1]);
          const tx = lerp(fl.x, slot(i)[0], q);
          const ty = lerp(fl.y, slot(i)[1], q) - Math.sin(q * Math.PI) * 120;
          return (
            <g key={'h' + i} opacity={o}>
              <line x1={1750} y1={100} x2={tx} y2={ty - 20} stroke={C.ink} strokeWidth={6} strokeDasharray="10 14" strokeLinecap="round" />
              <circle cx={tx} cy={ty - 20} r={10} fill="none" stroke={C.ink} strokeWidth={5} />
            </g>
          );
        })}
        {/* girti hui pankhuri */}
        {fall > 0 && (
          <ellipse
            cx={LAST.x + Math.sin(fall / 9) * 34}
            cy={LAST.y + fall * 5.2}
            rx={8}
            ry={14}
            fill="none"
            stroke={C.amber}
            strokeWidth={3}
            transform={`rotate(${fall * 3} ${LAST.x + Math.sin(fall / 9) * 34} ${LAST.y + fall * 5.2})`}
            opacity={0.9 - ic(fall, [20, 42], [0, 0.9])}
          />
        )}
      </Canvas>
      <Abs x={900} y={250} style={{opacity: 1 - ic(f, [70, 82], [0, 1])}}>
        <UrduInk text="پھول" start={4} dur={18} size={170} />
      </Abs>
      <Abs x={LAST.x} y={LAST.y - 200} style={{opacity: ic(f, [87, 95], [0, 1])}}>
        <UrduInk text="شاخ" start={87} dur={18} size={150} accent />
      </Abs>
    </AbsoluteFill>
  );
};
