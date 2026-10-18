import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Canvas, Ground, ic, lerp, p, shake} from '../utils';
import {AmberStar, DrawPath, Ghost, Main, Sitter} from '../components/Figures';
import {Bench, Clock, Glow, Heart, House, Lantern, Page, SKY_N, Skyline, skyRank} from '../components/Props';
import {UrduAt, UrduInk} from '../components/Urdu';
import {C, GROUND} from '../theme';
import {SceneProps} from './types';

const HOUSE_PTS: [number, number][] = [[1084, 860], [1084, 590], [1300, 410], [1516, 590], [1516, 860]];

// S39: Khwab ka ghar, darar - taare ghar banate hain, magar dil aur ghar mein darar
export const DreamHouseCrack: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const sh = shake(f, 14 * (T(0.55, 0.62) > 0 && T(0.55, 0.75) < 1 ? 1 : 0));
  const crackPain = f >= dur * 0.55 && f < dur * 0.55 + 12;
  const gather = T(0.05, 0.4);
  const starFrom: [number, number][] = [[200, 200], [900, 120], [1700, 180], [300, 700], [1800, 650]];
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Canvas>
        <Ground />
        <Main x={560} />
        <Heart x={560} y={GROUND - 128} s={0.5} crack={T(0.55, 0.65)} crackColor={crackPain ? C.pain : C.ink} />
        <DrawPath d="M1084 860 L1084 590 L1300 410 L1516 590 L1516 860" start={dur * 0.3} dur={dur * 0.3} color={C.ink} width={6} />
        {HOUSE_PTS.map(([x, y], i) => (
          <AmberStar key={i} x={lerp(starFrom[i][0], x, gather)} y={lerp(starFrom[i][1], y, gather)} size={18} opacity={0.4 + 0.6 * gather} />
        ))}
        <DrawPath d="M1320 410 L1300 500 L1326 590 L1304 680 L1330 770" start={dur * 0.58} dur={dur * 0.15} color={crackPain ? C.pain : C.ink} width={5} />
      </Canvas>
      {f < dur * 0.5 ? <UrduAt x={960} y={230} text="خواب" size={160} /> : <UrduAt x={960} y={230} text="دل" start={dur * 0.5} size={170} style={{transform: `translate(calc(-50% + ${crackPain ? 8 : 0}px), -50%)`}} />}
    </AbsoluteFill>
  );
};

// S40: Shehar chhodna - Main peeth karke chal deta hai, khidkiyon ki roshni bujhti jati hai
export const LeaveCity: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const off = T(0.1, 0.9);
  const count = Math.floor((1 - off) * SKY_N * 0.4);
  const mx = lerp(1000, 320, T(0, 1));
  return (
    <AbsoluteFill style={{transform: `scale(${1 - T(0, 1) * 0.08})`, transformOrigin: '1700px 800px'}}>
      <AbsoluteFill style={{transform: 'translateX(-420px)'}}>
        <Canvas>
          <Skyline lit={(i) => skyRank(i) < count} />
        </Canvas>
      </AbsoluteFill>
      <Canvas>
        <Main x={mx} flip phase={f * 0.5} />
      </Canvas>
      <UrduAt x={1300} y={250} text="شہر" size={170} opacity={1 - off * 0.7} />
    </AbsoluteFill>
  );
};

const HOUSE_PTS_B: [number, number][] = [[744, 860], [744, 590], [960, 410], [1176, 590], [1176, 860]];
const SEGS: {x: number; y: number; a: number}[] = [];
for (let s = 0; s < 4; s++) {
  for (let k = 0; k < 6; k++) {
    const [x0, y0] = HOUSE_PTS_B[s];
    const [x1, y1] = HOUSE_PTS_B[s + 1];
    const t = (k + 0.5) / 6;
    SEGS.push({x: lerp(x0, x1, t), y: lerp(y0, y1, t), a: Math.atan2(y1 - y0, x1 - x0)});
  }
}

// S41: Makan toot jate hain - tukde raakh ki tarah uth kar taare ban jate hain
export const MakanToStars: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const sh = shake(f, 12 * T(0.15, 0.5) * (1 - T(0.5, 0.6)));
  const t2 = T(0.45, 1);
  const split = T(0.45, 0.9);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Canvas>
        <Ground />
        {t2 === 0 && <House x={960} y={GROUND} s={1.8} lit={0.6} crack={T(0.1, 0.4)} />}
        {t2 > 0 &&
          SEGS.map((s, i) => {
            const dy = -t2 * (200 + (i % 5) * 120);
            const dx = (((i * 37) % 11) - 5) * 30 * t2;
            const rot = t2 * (i % 7) * 40;
            const len = 36 * (1 - t2 * 0.6);
            const c = t2 > 0.5 ? C.amber : C.ink;
            const cx = s.x + dx;
            const cy = s.y + dy;
            const ang = s.a + (rot * Math.PI) / 180;
            return <line key={i} x1={cx - Math.cos(ang) * len / 2} y1={cy - Math.sin(ang) * len / 2} x2={cx + Math.cos(ang) * len / 2} y2={cy + Math.sin(ang) * len / 2} stroke={c} strokeWidth={6} strokeLinecap="round" opacity={1 - t2 * 0.25} style={t2 > 0.5 ? {filter: `drop-shadow(0 0 8px ${C.amber})`} : undefined} />;
          })}
        {t2 > 0 &&
          Array.from({length: 30}).map((_, i) => (
            <circle key={'a' + i} cx={780 + ((i * 53) % 360) + Math.sin(f / 6 + i) * 10} cy={800 - t2 * (200 + (i % 6) * 90)} r={2 + (i % 3)} fill={t2 > 0.5 ? C.amber : C.ink} opacity={0.8 * (1 - t2 * 0.4)} />
          ))}
      </Canvas>
      {split === 0 ? (
        <UrduAt x={960} y={260} text="مکان" size={200} />
      ) : (
        <>
          <UrduAt x={960} y={260} text="مکان" start={0} dur={1} size={200} accent opacity={1 - split * 0.6} style={{clipPath: 'inset(0 50% 0 0)', transform: `translate(calc(-50% - ${split * 160}px), calc(-50% - ${split * 200}px)) rotate(${-split * 20}deg)`}} />
          <UrduAt x={960} y={260} text="مکان" start={0} dur={1} size={200} accent opacity={1 - split * 0.6} style={{clipPath: 'inset(0 0 0 50%)', transform: `translate(calc(-50% + ${split * 160}px), calc(-50% - ${split * 240}px)) rotate(${split * 24}deg)`}} />
        </>
      )}
    </AbsoluteFill>
  );
};

// S42: Sukoon ke pal - pehli baar poora frame warm, barish nahi
export const WarmFlashback: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const fade = Math.min(ic(f, [0, 10], [0, 1]), ic(f, [dur - 10, dur], [1, 0]));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{backgroundColor: '#0e0b09', opacity: fade}} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 70%, rgba(255,200,87,0.22), rgba(255,200,87,0) 60%)', opacity: fade}} />
      <Canvas>
        <g opacity={fade}>
          <Ground />
          <Bench x={960} y={GROUND} s={1.4} />
          <Sitter x={845} s={1.2} />
          <Sitter x={1035} s={1.2} dashed opacity={0.85} color={C.amber} />
          {Array.from({length: 18}).map((_, i) => (
            <circle key={i} cx={300 + ((i * 97) % 1300) + Math.sin(f / 20 + i) * 20} cy={820 - ((f * (0.6 + (i % 4) * 0.3) + i * 60) % 560)} r={3} fill={C.amber} opacity={0.7} />
          ))}
        </g>
      </Canvas>
      <UrduAt x={960} y={250} text="سکوں" size={160} accent opacity={0.85 * fade} />
    </AbsoluteFill>
  );
};

// S43: Aakhri milna - gale milte hain, phir ghost hawa mein ghul jati hai
export const LastHug: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const come = T(0.1, 0.35);
  const vanish = T(0.6, 0.85);
  const mx = lerp(840, 925, come);
  const gx = lerp(1080, 995, come);
  const sy = GROUND - 150;
  const drop = vanish * 70;
  return (
    <AbsoluteFill>
      <Canvas>
        <Ground />
        <Main x={mx} />
        {vanish < 1 && <Ghost x={gx} opacity={0.5 * (1 - vanish)} />}
        <line x1={mx} y1={sy} x2={gx + 28} y2={sy + 30 + drop} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
        {vanish < 1 && <line x1={gx} y1={sy} x2={mx - 28} y2={sy + 30} stroke={C.ink} strokeWidth={6} strokeLinecap="round" strokeDasharray="10 14" opacity={0.5 * (1 - vanish)} />}
        {vanish > 0 &&
          Array.from({length: 26}).map((_, i) => (
            <circle key={i} cx={gx + Math.sin(i * 2.3) * 60 + vanish * 40} cy={GROUND - 150 - (i % 9) * 16 - vanish * (40 + (i % 5) * 30)} r={2 + (i % 3)} fill={C.ink} opacity={0.7 * (1 - vanish)} />
          ))}
      </Canvas>
      <UrduAt x={960} y={250} text="نہیں ملو گے" size={150} opacity={1 - vanish * 0.8} style={{filter: `blur(${vanish * 6}px)`}} />
      <AbsoluteFill style={{backgroundColor: '#fff', opacity: f >= dur * 0.6 && f < dur * 0.6 + 4 ? 0.35 : 0}} />
    </AbsoluteFill>
  );
};

// S44: Khali bench - akela Main, saath wali jagah khali
export const EmptyBench: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const q = p(f, 0, dur);
  return (
    <AbsoluteFill style={{transform: `scale(${1 - q * 0.2})`, transformOrigin: '960px 560px'}}>
      <Canvas>
        <Ground />
        <Bench x={960} y={GROUND} s={1.4} />
        <Sitter x={880} s={1.2} />
        <Sitter x={1060} s={1.2} dashed opacity={0.18} />
      </Canvas>
      {f < dur * 0.45 ? <UrduAt x={1060} y={520} text="ساتھ" size={120} opacity={0.35} /> : <UrduAt x={960} y={250} text="اکیلے" start={dur * 0.45} size={170} />}
    </AbsoluteFill>
  );
};

// S45: Taare gin gin ke subah - taare bujhte hain, subah ka arc ubharta hai
export const CountStars: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const xs = [560, 720, 880, 1040, 1200, 1360, 1500];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{backgroundColor: `rgba(60,100,160,${T(0.3, 1) * 0.28})`}} />
      <Canvas>
        <Ground />
        <DrawPath d="M460 860 A500 500 0 0 1 1460 860" start={dur * 0.35} dur={dur * 0.6} color={C.amber} width={6} />
        {xs.map((x, i) => (
          <AmberStar key={i} x={x} y={220 + (i % 3) * 50} size={20} opacity={1 - T(0.1 + i * 0.09, 0.16 + i * 0.09)} />
        ))}
        <Bench x={960} y={GROUND} s={1.2} />
        <Sitter x={890} s={1} />
      </Canvas>
      {f < dur * 0.5 ? <UrduAt x={960} y={140} text="تارے" size={110} /> : <UrduAt x={960} y={420} text="صبح" start={dur * 0.5} size={150} accent />}
    </AbsoluteFill>
  );
};
