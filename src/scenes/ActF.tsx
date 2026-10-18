import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Canvas, Ground, ic, lerp, p} from '../utils';
import {AmberStar, Ghost, Main} from '../components/Figures';
import {Bench, Clock, Glow, House, Lantern, Page, Skyline} from '../components/Props';
import {UrduAt, UrduInk} from '../components/Urdu';
import {C, GROUND} from '../theme';
import {SceneProps} from './types';

const DAWN = 'rgba(60,100,160,0.28)';

// S46: Wahi shehar, ab sirf ek khidki roshan
export const CityOneWindow: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const q = p(f, 0, dur);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{backgroundColor: DAWN}} />
      <AbsoluteFill style={{transform: `translateX(${-300 + q * 100}px)`}}>
        <Canvas>
          <Skyline lit={(i) => i === 57} />
          <Glow x={-300 + 0} y={0} r={1} opacity={0} id="glowNone" />
        </Canvas>
      </AbsoluteFill>
      <UrduAt x={960} y={250} text="تو ہے کہاں" start={6} dur={28} size={150} accent />
    </AbsoluteFill>
  );
};

// S47: Lantern phir chalti hai - ghari ki tik tik ke saath
export const LanternAgain: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const q = p(f, 0, dur);
  const mx = lerp(300, 1100, q);
  return (
    <AbsoluteFill style={{transform: `translateX(${-q * 100}px)`}}>
      <AbsoluteFill style={{backgroundColor: DAWN}} />
      <Canvas>
        <Ground />
        <House x={1600} y={GROUND} s={1.5} lit={1} />
        <Main x={mx} phase={f * 0.4} />
        <Lantern x={mx + 62} y={GROUND - 74} s={1.3} glow={0.8 + 0.15 * Math.sin(f / 3)} />
        <Clock x={q * 100 + 220} y={200} r={50} angle={f * 12} opacity={0.6} />
      </Canvas>
      <UrduAt x={960 + q * 100} y={260} text="ڈھونڈتا" size={140} opacity={0.8} />
    </AbsoluteFill>
  );
};

// S48: Arsa hua - thaka hua Main, ek akela panna hawa mein
export const ArsaHua: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const q = p(f, 0, dur);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{backgroundColor: DAWN}} />
      <Canvas>
        <Ground />
        <House x={1650} y={GROUND} s={1.4} lit={0.9} />
        <Main x={lerp(760, 880, q)} phase={f * 0.22} />
        <Lantern x={lerp(760, 880, q) + 62} y={GROUND - 74} s={1.3} glow={0.4} />
        <Page x={1000 + Math.sin(q * 5) * 60} y={380 + q * 140} rot={f * 5} w={150} h={190} lines={4} opacity={0.8} />
      </Canvas>
      <UrduAt x={960} y={250} text="عرصہ" size={160} />
    </AbsoluteFill>
  );
};

// S49: Chhup gaya - khidki ki roshni aur amber taara bujh jate hain, camera peeche hat-ta hai
export const GhostGone: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const lit = 1 - T(0.3, 0.8);
  const sink = T(0.5, 1);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `scale(${1 - T(0, 1) * 0.22})`, transformOrigin: '960px 560px'}}>
        <Canvas>
          <Ground />
          <House x={1600} y={GROUND} s={1.5} lit={lit} />
          {T(0.1, 0.4) < 1 && <Ghost x={1600} y={GROUND - 130} s={0.3} opacity={0.5 * (1 - T(0.2, 0.4))} />}
          <AmberStar x={1260} y={300} size={44} dim={T(0.4, 0.9)} />
          <Bench x={420} y={GROUND} s={1.2} opacity={0.7} />
          <Main x={720} s={0.9} />
          <Lantern x={776} y={GROUND - 66} s={1.1} glow={0.5 * lit} opacity={lit} />
        </Canvas>
        <UrduAt x={960} y={250 + sink * 100} text="چھپ گیا" size={150} opacity={1 - sink} style={{filter: `blur(${sink * 8}px)`}} />
      </AbsoluteFill>
      <AbsoluteFill style={{backgroundColor: C.bg, opacity: T(0.82, 1)}} />
    </AbsoluteFill>
  );
};

// S50: Umeed ka zarra - andhera, phir ek chhota amber zarra
export const AmberSpark: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const spark = ic(f, [50, 120], [0, 1]);
  const pulse = 1 + 0.2 * Math.pow(Math.max(0, Math.sin(f / 14)), 3);
  const r = ic(f, [150, 215], [1400, 46]);
  const end = ic(f, [dur - 18, dur], [0, 1]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{backgroundColor: C.bg}} />
      <Canvas>
        <AmberStar x={960} y={520} size={16 + spark * 8} pulse={pulse} opacity={spark} />
      </Canvas>
      <UrduAt x={960} y={720} text="امید" start={120} dur={30} size={96} accent opacity={ic(f, [170, 200], [1, 0])} />
      <AbsoluteFill style={{background: `radial-gradient(circle at 960px 520px, rgba(0,0,0,0) ${r}px, #000 ${r + 3}px)`}} />
      <AbsoluteFill style={{backgroundColor: '#000', opacity: end}} />
    </AbsoluteFill>
  );
};
