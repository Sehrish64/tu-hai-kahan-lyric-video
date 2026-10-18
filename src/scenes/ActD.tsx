import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Canvas, Ground, ic, lerp, p, shake} from '../utils';
import {AmberStar, DrawPath, Flower, Ghost, Main, Sitter} from '../components/Figures';
import {Bench, Bubble, Clock, Glow, Heart, House, Lantern, Letterbox, Page, Tear, Umbrella} from '../components/Props';
import {UrduAt} from '../components/Urdu';
import {GhostErase} from './ActA';
import {C, GROUND} from '../theme';
import {SceneProps} from './types';

const quad = (a: [number, number], b: [number, number], c: [number, number], t: number): [number, number] => {
  const u = 1 - t;
  return [u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]];
};

// S31: Tum kya ho - kehkashan, pari, Main ke seene se roshni
export const Kehkashan: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const fairy = T(0.5, 1);
  const word = f < dur * 0.33 ? 0 : f < dur * 0.66 ? 1 : 2;
  return (
    <AbsoluteFill>
      <Canvas>
        <Ground />
        <Glow x={700} y={GROUND - 128} r={150 + 30 * Math.sin(f / 6)} id="glowChest" />
        <Main x={700} />
        <Ghost x={1220} />
        {Array.from({length: 44}).map((_, i) => {
          const t = i / 43;
          const [x, y] = quad([300, 360], [960, 90], [1620, 360], t * T(0, 0.45));
          return <circle key={i} cx={x} cy={y + Math.sin(i * 1.3) * 8} r={2 + (i % 3)} fill={C.ink} opacity={0.4 + 0.4 * Math.sin(f / 8 + i)} />;
        })}
        <rect x={1370} y={GROUND - 34} width={90} height={34} fill="none" stroke={C.ink} strokeWidth={4} />
        {fairy > 0 && (
          <g transform={`translate(${1415 + Math.sin(fairy * 8) * 60} ${GROUND - 40 - fairy * 480})`} stroke={C.amber} strokeWidth={4} fill="none" opacity={1 - fairy * 0.4}>
            <circle r={8} />
            <ellipse cx={-16} cy={-6} rx={16} ry={8} transform="rotate(-25 -16 -6)" />
            <ellipse cx={16} cy={-6} rx={16} ry={8} transform="rotate(25 16 -6)" />
          </g>
        )}
      </Canvas>
      {word === 0 && <UrduAt x={960} y={220} text="تم" size={180} accent />}
      {word === 1 && <UrduAt x={960} y={220} text="کہکشاں" start={dur * 0.33} size={170} />}
      {word === 2 && <UrduAt x={960} y={220} text="پریوں" start={dur * 0.66} size={170} />}
    </AbsoluteFill>
  );
};

// S32: Yaqeen ya guman - ghost solid/dashed ke beech jhoolti hai
export const GhostToggle: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const period = f < dur * 0.5 ? 8 : 5;
  const solid = Math.floor(f / period) % 2 === 0;
  const gx = lerp(1250, 860, T(0.1, 0.85));
  const glitch = f % period < 2;
  return (
    <AbsoluteFill>
      <Canvas>
        <Ground />
        <Main x={700} />
        <Heart x={700} y={GROUND - 128} s={0.5} />
        {glitch && <Ghost x={gx + 8} color="#4dd0ff" opacity={0.4} dashed />}
        {glitch && <Ghost x={gx - 8} color="#ff4d6d" opacity={0.4} dashed />}
        <Main x={gx} dashed={!solid} opacity={solid ? 0.9 : 0.35} />
      </Canvas>
      {f < dur * 0.5 ? <UrduAt x={960} y={250} text="تم" size={170} accent /> : <UrduAt x={960} y={250} text="گمان" start={dur * 0.5} size={170} opacity={0.5 + 0.5 * Math.sin(f * 1.7)} />}
    </AbsoluteFill>
  );
};

// S33: Aashiyan, musafir, makan - Main ghar ki taraf chalta hai
export const TravelerHouse: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const q = p(f, 0, dur);
  const mx = lerp(200, 1180, q);
  const zoom = 1 + 0.25 * q;
  return (
    <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '1500px 700px'}}>
      <Canvas>
        <Ground />
        <DrawPath d="M150 884 L1300 884" start={0} dur={dur * 0.8} color={C.amber} width={5} opacity={0.8} />
        <House x={1500} y={GROUND} s={1.5} lit={1} />
        <Glow x={1500} y={GROUND - 130} r={200 + 25 * Math.sin(f / 5)} id="glowHome" opacity={0.6} />
        <Main x={mx} phase={f * 0.4} />
        <rect x={mx - 40} y={GROUND - 170} width={32} height={50} fill="none" stroke={C.ink} strokeWidth={5} />
      </Canvas>
      {f < dur * 0.5 ? <UrduAt x={1500} y={300} text="آشیاں" size={150} accent /> : <UrduAt x={mx} y={420} text="مسافر" start={dur * 0.5} size={130} />}
    </AbsoluteFill>
  );
};

// S34: Ek hi raasta - sab raaste ek jagah milte hain, dil akela dhoondne nikalta hai
export const PathsConverge: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const starts: [number, number][] = [[100, 300], [100, 700], [500, 1040], [1400, 1040], [1820, 700], [1820, 300]];
  const leave = T(0.65, 1);
  const [hx, hy] = quad([960, 740], [1300, 400], [1750, 600], leave);
  return (
    <AbsoluteFill>
      <Canvas>
        {starts.map(([sx, sy], i) => (
          <DrawPath key={i} d={`M${sx} ${sy} Q${(sx + 960) / 2} ${(sy + 640) / 2 - 80} 960 640`} start={i * 9} dur={dur * 0.35} color={i % 2 ? C.ink : C.amber} width={5} opacity={0.85} />
        ))}
        <Main x={960} y={880} s={0.9} />
        <Heart x={hx} y={leave > 0 ? hy : 740} s={0.5} />
      </Canvas>
      {f < dur * 0.5 ? <UrduAt x={960} y={220} text="راستہ" size={170} /> : <UrduAt x={960} y={220} text="کہاں" start={dur * 0.5} size={170} />}
    </AbsoluteFill>
  );
};

// S35: Barish ruk jati hai - boondein thehr jati hain, chhata khulta hai (umeed)
export const RainStops: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const open = T(0.2, 0.5);
  return (
    <AbsoluteFill>
      <Canvas>
        <Ground />
        <Glow x={960} y={GROUND - 340} r={260 * open + 10} opacity={open} id="glowUmb" />
        <Main x={960} />
        <Umbrella x={960} y={GROUND - 250} s={1.2} open={open} />
        <Tear x={985} y={GROUND - 168} s={1.1} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Tear key={i} x={560 + i * 160} y={300 + ((i * 97) % 300)} s={0.7} opacity={0.35 + 0.25 * Math.sin(f / 10 + i)} color={C.rain} />
        ))}
      </Canvas>
      <UrduAt x={960} y={220} text="آنسو" size={160} opacity={0.5 + 0.2 * Math.sin(f / 12)} />
    </AbsoluteFill>
  );
};

// S36: Har lamhe - 12 tez flash-cuts (yaadon ka hamla)
export const MemoryMontage: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const len = dur / 12;
  const k = Math.min(11, Math.floor(f / len));
  const lf = f - k * len;
  const jx = (((k * 53) % 7) - 3) * 4;
  const spots: [number, number][] = [[560, 320], [1400, 300], [800, 760], [1300, 700], [400, 500], [1500, 520], [960, 300], [700, 440], [1200, 400], [500, 700], [1450, 740], [960, 520]];
  const scene = () => {
    switch (k) {
      case 0: return <g><Bench x={960} y={GROUND} s={1.4} /><Sitter x={850} s={1.2} /><Sitter x={1030} s={1.2} dashed opacity={0.6} /></g>;
      case 1: return <g><Main x={760} armsUp={0.2} /><Ghost x={1160} armsUp={0.2} /><circle cx={960} cy={GROUND - 150} r={8} fill={C.amber} /></g>;
      case 2: return <g><circle cx={960} cy={500} r={150} fill="none" stroke={C.ink} strokeWidth={6} /><circle cx={910} cy={470} r={10} fill={C.ink} /><circle cx={1010} cy={470} r={10} fill={C.ink} /><path d="M880 540 Q960 620 1040 540" fill="none" stroke={C.amber} strokeWidth={7} strokeLinecap="round" /></g>;
      case 3: return <g><Main x={800} phase={f * 0.6} /><Ghost x={1000} phase={f * 0.6} /></g>;
      case 4: return <g><Page x={960} y={520} w={460} h={340} lines={5} rot={-4} /><Letterbox x={1400} y={760} s={0.9} /></g>;
      case 5: return <g><Flower x={960} y={520} r={100} color={C.amber} glow /><line x1={960} y1={640} x2={960} y2={GROUND} stroke={C.ink} strokeWidth={6} /></g>;
      case 6: return <AmberStar x={960} y={500} size={150} />;
      case 7: return <g><Main x={960} /><Umbrella x={960} y={GROUND - 250} s={1.2} /></g>;
      case 8: return <g><Main x={900} armsUp={0.6} /><Ghost x={1020} armsUp={0.6} /></g>;
      case 9: return <Clock x={960} y={500} r={170} angle={f * 14} />;
      case 10: return <House x={960} y={GROUND} s={1.8} lit={1} />;
      default: return <Ghost x={960} s={1.5} />;
    }
  };
  return (
    <AbsoluteFill style={{transform: `translateX(${jx}px)`}}>
      <Canvas>{scene()}</Canvas>
      <UrduAt x={spots[k][0]} y={spots[k][1]} text="یاد" start={0} dur={3} size={200} accent opacity={0.45} />
      <AbsoluteFill style={{backgroundColor: '#fff', opacity: ic(lf, [0, 3], [0.5, 0])}} />
    </AbsoluteFill>
  );
};

// S37: Zindagi ki do lakeerein - paas hoke bhi kabhi nahi milti
export const ParallelLines: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const q = p(f, 0, dur);
  const x = lerp(300, 1500, q);
  return (
    <AbsoluteFill>
      <Canvas>
        <DrawPath d="M100 560 Q960 520 1820 560" start={0} dur={dur * 0.5} />
        <DrawPath d="M100 740 Q960 780 1820 740" start={8} dur={dur * 0.5} color={C.rain} />
        <Main x={x} y={560 + Math.sin(q * Math.PI) * -20} s={0.7} phase={f * 0.35} />
        <Ghost x={x} y={740 + Math.sin(q * Math.PI) * 20} s={0.7} phase={f * 0.35} />
      </Canvas>
      <UrduAt x={960} y={270} text="زندگی" size={130} />
      <UrduAt x={960} y={900} text="زندگی" start={10} size={100} opacity={0.5} />
    </AbsoluteFill>
  );
};

// S38: Haath chhoone se pehle - eraser loop, phir ungliyan chhoone se pehle ruk jati hain
export const AlmostTouch: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const reach = T(0.45, 0.82);
  const sy = GROUND - 150;
  const mh = lerp(730, 944, reach);
  const gh = lerp(1190, 976, reach);
  const spark = reach >= 1 ? 0.4 + 0.6 * Math.abs(Math.sin(f / 4)) : 0;
  const beat = reach >= 1 ? 1 : 1 + 0.16 * Math.pow(Math.max(0, Math.sin(f / 4)), 3);
  return (
    <AbsoluteFill>
      <Canvas>
        <Ground />
        {f < dur * 0.4 ? (
          <g>
            <Main x={600} />
            <GhostErase f={f} x={1200} segs={[50, 40, 36]} id="eraserClip2" />
          </g>
        ) : (
          <g>
            <Main x={700} />
            <Ghost x={1220} />
            <line x1={700} y1={sy} x2={mh} y2={sy + 8} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
            <line x1={1220} y1={sy} x2={gh} y2={sy + 8} stroke={C.ink} strokeWidth={6} strokeLinecap="round" strokeDasharray="10 14" opacity={0.6} />
            <Heart x={700} y={GROUND - 128} s={0.4 * beat} />
            <circle cx={960} cy={sy + 8} r={6} fill={C.amber} opacity={spark} />
          </g>
        )}
      </Canvas>
      {f < dur * 0.4 ? <UrduAt x={960} y={250} text="بھول" size={160} /> : <UrduAt x={960} y={250} text="مل ہی نہ" start={dur * 0.4} size={150} />}
    </AbsoluteFill>
  );
};
