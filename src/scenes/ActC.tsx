import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Abs, Canvas, Ground, ic, lerp, p, shake} from '../utils';
import {AmberStar, DrawPath, Ghost, Main, Sitter} from '../components/Figures';
import {Bench, Bubble, Clock, Glow, Heart, House, Lantern, Page, SKY_N, Skyline, skyRank} from '../components/Props';
import {UrduAt} from '../components/Urdu';
import {C, GROUND} from '../theme';
import {SceneProps} from './types';

// S23: Khidkiyon ka shehar - ek ek khidki ki roshni on hoti hai, camera pan karta hai
export const WindowsCity: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const count = Math.floor(T(0.1, 0.85) * SKY_N * 0.4);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `translateX(${-T(0, 1) * 380}px)`}}>
        <Canvas>
          <Skyline lit={(i) => skyRank(i) < count} />
        </Canvas>
      </AbsoluteFill>
      <UrduAt x={960} y={230} text="تو ہے کہاں، خوابوں کے اس شہر میں" start={8} dur={54} size={96} />
    </AbsoluteFill>
  );
};

// S24: Lantern ka safar - dil lantern ban jata hai, Main talaash par chalta hai
export const LanternWalk: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const mx = lerp(380, 1500, T(0, 1));
  const whip = ic(f, [0, 6], [1, 0]);
  const swap = T(0.15, 0.4);
  return (
    <AbsoluteFill style={{transform: `translateX(${whip * 120 - T(0, 1) * 120}px)`, filter: `blur(${whip * 6}px)`}}>
      <Canvas>
        <Ground />
        <Main x={mx} phase={f * 0.7} />
        {swap < 1 && <Heart x={mx} y={GROUND - 128 - swap * 20} s={0.5} opacity={1 - swap} />}
        <Lantern x={mx + 62} y={GROUND - 74} s={1.3} opacity={swap} glow={0.8 + 0.2 * Math.sin(f / 3)} />
      </Canvas>
      <UrduAt x={960} y={250} text="ڈھونڈتا" start={4} dur={12} size={110 + T(0.4, 1) * 90} />
    </AbsoluteFill>
  );
};

// S25: Calendar ke panne - waqt guzarta jata hai
export const CalendarFly: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const mx = lerp(500, 900, p(f, 0, dur));
  return (
    <AbsoluteFill>
      <Canvas>
        <Ground />
        {Array.from({length: 12}).map((_, i) => {
          const q = ic(f - i * 6, [0, 34], [0, 1]);
          if (q <= 0 || q >= 1) return null;
          return <Page key={i} x={lerp(2000, -150, q)} y={340 + (i % 4) * 110} rot={q * 40 - 20} w={150} h={190} lines={4} s={1} opacity={0.75 * (1 - i / 16)} />;
        })}
        <Main x={mx} phase={f * 0.4} />
      </Canvas>
      <UrduAt x={960} y={230} text="عرصہ" size={170} />
    </AbsoluteFill>
  );
};

// S26: Chhup gaya - khidki mein ghost ki jhalak, parda band, roshan bujh jati hai
export const WindowHide: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const mx = lerp(380, 1130, T(0, 0.6));
  const lit = 1 - T(0.65, 0.9);
  const curtain = T(0.58, 0.7);
  const sh = shake(f, 5 * (T(0.58, 0.7) > 0 && T(0.58, 0.7) < 1 ? 1 : 0));
  const sink = T(0.72, 1);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Canvas>
        <Ground />
        <House x={1440} y={GROUND} s={1.6} lit={lit} />
        {T(0.15, 0.35) > 0 && curtain < 1 && <Ghost x={1440} y={GROUND - 130} s={0.3} opacity={0.5 * Math.sin(T(0.15, 0.55) * Math.PI)} />}
        {curtain > 0 && <rect x={1385} y={GROUND - 192} width={110} height={curtain * 110} fill="rgba(5,10,20,0.95)" stroke={C.ink} strokeWidth={3} />}
        <Main x={mx} phase={T(0, 0.6) < 1 ? f * 0.6 : 0} />
        <Lantern x={mx + 62} y={GROUND - 74} s={1.3} glow={0.6 + 0.2 * Math.sin(f / 2)} />
      </Canvas>
      <UrduAt x={960} y={250 + sink * 90} text="چھپ گیا" size={150} opacity={1 - sink} style={{filter: `blur(${sink * 8}px)`}} />
    </AbsoluteFill>
  );
};

// S27: Pul - do cliffs ke beech faasla line line se band hota hai
export const BridgeBuild: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const gap = T(0.25, 0.8);
  return (
    <AbsoluteFill>
      <Canvas>
        <path d="M0 700 L700 700 L700 1080" fill="none" stroke={C.ink} strokeWidth={6} />
        <path d="M1220 1080 L1220 700 L1920 700" fill="none" stroke={C.ink} strokeWidth={6} />
        <Main x={620} y={700} armsUp={0.3 + gap * 0.3} />
        <Ghost x={1300} y={700} armsUp={0.3} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <DrawPath key={i} d={`M${740 + i * 62} 700 L${740 + i * 62} 740`} start={dur * (0.25 + i * 0.06)} dur={8} width={4} color={C.rain} />
        ))}
        <DrawPath d="M700 700 Q960 760 1220 700" start={dur * 0.25} dur={dur * 0.55} width={6} color={C.amber} />
      </Canvas>
      <UrduAt x={960} y={330} text="فاصلے" size={170 - gap * 90} opacity={1 - gap * 0.9} />
    </AbsoluteFill>
  );
};

// S28: Raasta khud draw hota hai - dono saath chalte hain
export const RoadDraws: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const q = p(f, 0, dur);
  const mx = lerp(500, 1000, q);
  return (
    <AbsoluteFill style={{transform: `translateX(${-q * 120}px)`}}>
      <Canvas>
        <Ground />
        <DrawPath d="M300 884 L2000 884" start={0} dur={dur * 0.9} color={C.amber} width={6} />
        <Main x={mx} phase={f * 0.45} />
        <Ghost x={mx - 120} phase={f * 0.45 + 1} />
      </Canvas>
      <UrduAt x={960 + q * 120} y={300} text="منزلوں" size={160} opacity={0.5} style={{transform: `translate(calc(-50% - ${q * 220}px), -50%)`}} />
    </AbsoluteFill>
  );
};

const CONSTELLATION = 'M560 300 L720 220 L900 260 L1010 180 L1160 250 L1330 210 L1420 320 L1250 340 L1080 300 L900 360 L700 340 Z';

// S29: Taaron ke tale - constellation, ghadi thehar jati hai
export const Constellation: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const hand = 360 * T(0, 0.55) * 2;
  return (
    <AbsoluteFill>
      <Canvas>
        <Ground />
        <DrawPath d={CONSTELLATION} start={dur * 0.15} dur={dur * 0.5} color={C.amber} width={3} opacity={0.8} />
        {[[560, 300], [720, 220], [900, 260], [1010, 180], [1160, 250], [1330, 210], [1420, 320], [1250, 340], [1080, 300], [900, 360], [700, 340]].map(([x, y], i) => (
          <AmberStar key={i} x={x} y={y} size={14} opacity={0.5 + 0.5 * Math.sin(f / 9 + i)} />
        ))}
        <Bench x={960} y={GROUND} s={1.2} />
        <Sitter x={850} s={1} />
        <Sitter x={1010} s={1} dashed opacity={0.5} />
        <Clock x={1650} y={200} r={64} angle={hand} />
      </Canvas>
      {f < dur * 0.5 ? <UrduAt x={960} y={130} text="تاروں" size={120} /> : <UrduAt x={960} y={130} text="صبح" start={dur * 0.5} size={120} />}
    </AbsoluteFill>
  );
};

// S30: Baatein jo nahi hui - khali bubble, dil mein dhadkan
export const EmptyBubbles: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const beat = 1 + 0.14 * Math.pow(Math.max(0, Math.sin(f / 4.5)), 3);
  const grow = T(0.1, 0.4);
  const drift = T(0.4, 1);
  return (
    <AbsoluteFill>
      <Canvas>
        <Ground />
        <Main x={700} />
        <Ghost x={1220} />
        <Heart x={700} y={GROUND - 128} s={0.45 * beat} />
        <Heart x={1220} y={GROUND - 128} s={0.45 * beat} opacity={0.5} />
        <Bubble x={720} y={GROUND - 330 - drift * 60} r={60 * grow} dashed opacity={1 - drift * 0.6} />
        <Bubble x={1240} y={GROUND - 330 - drift * 60} r={60 * grow} dashed opacity={0.6 - drift * 0.4} color={C.rain} />
      </Canvas>
      <UrduAt x={960} y={600} text="باتیں" size={80} opacity={0.5} />
    </AbsoluteFill>
  );
};
