import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Canvas, Ground, ic, lerp, p, shake} from '../utils';
import {AmberStar, DrawPath, Ghost, Main} from '../components/Figures';
import {Bubble, Eye, Heart, House, Page, QMark, Pawn, Tear, Waveform} from '../components/Props';
import {UrduAt} from '../components/Urdu';
import {C, GROUND} from '../theme';
import {SceneProps} from './types';

// S06: Khwab, aankh mein - aankh band hoti hai, khwab aansu ban kar girta hai
export const EyeDream: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const open = 1 - T(0.5, 0.75);
  const fall = T(0.75, 1);
  return (
    <AbsoluteFill>
      <Canvas>
        <Eye x={960} y={520} s={1.4} open={open} />
        {open > 0.3 && (
          <g opacity={open}>
            <House x={930} y={566} s={0.16} lit={1} />
            <Ghost x={1010} y={566} s={0.2} />
          </g>
        )}
        {fall > 0 && <Tear x={1010} y={590 + fall * 250} s={1.5} color={C.amber} glow opacity={1 - fall * 0.4} />}
      </Canvas>
      <UrduAt x={960} y={250} text="خواب" start={6} dur={20} size={150} opacity={0.7} />
    </AbsoluteFill>
  );
};

// S07: Sirf yaad - ghost outline reh jati hai, phir yaad ka bubble ban kar uth jati hai
export const GhostToBubble: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const bub = T(0.45, 1);
  const flash = f < 3 ? 0.4 : f > dur * 0.4 && f < dur * 0.4 + 4 ? 0.3 : 0;
  return (
    <AbsoluteFill>
      <Canvas>
        <Ground />
        <Main x={1250} flip />
        <Ghost x={700} opacity={0.35 * (1 - T(0.1, 0.6))} />
        {bub > 0 && <Bubble x={820} y={430 - bub * 190} r={20 + bub * 70} color={C.amber} opacity={Math.min(1, bub * 2)} />}
      </Canvas>
      {bub > 0.4 && <UrduAt x={820} y={430 - bub * 190} text="یاد" start={dur * 0.45 + 14} dur={12} size={90} accent />}
      <AbsoluteFill style={{backgroundColor: '#fff', opacity: flash}} />
    </AbsoluteFill>
  );
};

// S08: Dil ka sawal - seene mein sawalia nishan dhadakta hai
export const QuestionHeart: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const beat = 1 + 0.16 * Math.pow(Math.max(0, Math.sin(f / 4)), 3);
  const q = T(0.15, 0.85);
  return (
    <AbsoluteFill>
      <Canvas>
        <Ground />
        <Main x={960} />
        <Heart x={960} y={GROUND - 128} s={0.5 * beat} glow />
        <QMark x={960} y={GROUND - 300 - q * 150} s={0.8 + q * 2.2} opacity={Math.min(1, q * 3)} />
      </Canvas>
      <UrduAt x={960} y={230} text="سوال" start={dur * 0.4} dur={16} size={160} />
    </AbsoluteFill>
  );
};

// Shared: ghost banta hai (pencil) aur mit jata hai (eraser)
const GW = 300;
export const GhostErase: React.FC<{f: number; x: number; segs: number[]; id: string}> = ({f, x, segs, id}) => {
  let acc = 0;
  let k = 0;
  let q = 1;
  for (; k < segs.length; k++) {
    if (f < acc + segs[k]) {
      q = (f - acc) / segs[k];
      break;
    }
    acc += segs[k];
  }
  if (k >= segs.length) {
    k = segs.length - 1;
    q = 1;
  }
  const drawing = q < 0.5;
  const reveal = drawing ? q * 2 : 1;
  const wipe = drawing ? 0 : (q - 0.5) * 2;
  const x0 = x - GW / 2;
  const clipX = x0 + wipe * GW;
  const clipW = Math.max(0, (reveal - wipe) * GW);
  const edge = x0 + (drawing ? reveal : wipe) * GW;
  return (
    <g>
      <clipPath id={id}>
        <rect x={clipX} y={0} width={clipW} height={1080} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <Ghost x={x} />
      </g>
      {drawing ? (
        <line x1={edge} y1={GROUND - 300} x2={edge + 18} y2={GROUND - 250} stroke={C.amber} strokeWidth={8} strokeLinecap="round" />
      ) : (
        <rect x={edge - 16} y={GROUND - 310} width={34} height={20} rx={4} fill="none" stroke={C.ink} strokeWidth={5} />
      )}
    </g>
  );
};

// S09: Bhool jaun ya yaad karoon - tez loop: banao, mitao, banao, mitao
export const EraserLoop: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const segs = [32, 22, 14, 10, 8, 8, 8, 8, 8, 8, 8, 8];
  let acc = 0;
  let q = 0;
  for (const s of segs) {
    if (f < acc + s) {
      q = (f - acc) / s;
      break;
    }
    acc += s;
  }
  const drawing = q < 0.5;
  const startFlash = segs.some((_, i) => {
    const a = segs.slice(0, i).reduce((x, y) => x + y, 0);
    return f >= a && f < a + 2;
  });
  return (
    <AbsoluteFill>
      <Canvas>
        <Ground />
        <Main x={560} />
        <GhostErase f={f} x={1180} segs={segs} id="eraserClip" />
      </Canvas>
      {drawing ? <UrduAt x={1180} y={250} text="یاد" start={0} dur={4} size={170} accent /> : <UrduAt x={1180} y={250} text="بھول" start={0} dur={4} size={170} />}
      <AbsoluteFill style={{backgroundColor: '#fff', opacity: startFlash ? 0.16 : 0}} />
    </AbsoluteFill>
  );
};

// S10: Likhna - copy par jazbaat likhte hain
export const WritingNotebook: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const lineD = (i: number) => {
    const y = 360 + i * 62;
    let d = `M740 ${y}`;
    for (let k = 1; k <= 9; k++) d += ` Q${740 + k * 48 - 22} ${y - 18 + ((i + k) % 3) * 14} ${740 + k * 48} ${y + ((i * k) % 2) * 4}`;
    return d;
  };
  const fly = T(0.4, 0.58);
  const qm = T(0.82, 1);
  return (
    <AbsoluteFill>
      <Canvas>
        <Ground />
        <Main x={330} />
        {fly > 0 && <Page x={960 + fly * 900} y={520 - fly * 300} rot={fly * 70} w={760} h={520} opacity={1 - fly} />}
        <Page x={960} y={520} w={760} h={520} lines={0} rot={-2} />
        {[0, 1, 2, 3, 4].map((i) => (
          <DrawPath key={i} d={lineD(i)} start={dur * (0.05 + i * 0.13)} dur={dur * 0.12} width={4} color={i === 2 || i === 4 ? C.amber : C.ink} opacity={0.9} />
        ))}
        {qm > 0 && <QMark x={960} y={250} s={1.6 * qm} opacity={qm} />}
      </Canvas>
      {f < dur * 0.55 ? <UrduAt x={420} y={230} text="لکھتا" size={150} /> : <UrduAt x={1500} y={230} text="سوال" start={dur * 0.55} size={150} />}
    </AbsoluteFill>
  );
};

// S11: Gham se bejaan khushi - barish phool ban kar murjha jati hai
export const RainToFlower: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const grow = T(0.25, 0.5);
  const wilt = T(0.58, 0.85);
  return (
    <AbsoluteFill>
      <Canvas>
        <Ground />
        {f < dur * 0.45 &&
          Array.from({length: 18}).map((_, i) => {
            const x = 700 + i * 36;
            const y = ((f * 14 + i * 71) % 520) + 80;
            return <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 34} stroke={C.rain} strokeWidth={3} opacity={0.6} />;
          })}
        <line x1={960} y1={GROUND} x2={960} y2={GROUND - 150 * grow + wilt * 60} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
        <g transform={`rotate(${wilt * 38} 960 ${GROUND - 150 * grow + wilt * 60})`}>
          <g transform={`translate(960 ${GROUND - 150 * grow + wilt * 60}) scale(${grow * 2.2})`} opacity={1 - wilt * 0.55}>
            <circle r={8} fill="none" stroke={wilt > 0.4 ? C.rain : C.ink} strokeWidth={3} />
            {[0, 1, 2, 3, 4].map((i) => {
              const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
              return <circle key={i} cx={Math.cos(a) * 17} cy={Math.sin(a) * 17} r={10} fill="none" stroke={wilt > 0.4 ? C.rain : C.ink} strokeWidth={3} />;
            })}
          </g>
        </g>
      </Canvas>
      {f < dur * 0.5 ? <UrduAt x={560} y={300} text="غم" size={170} /> : <UrduAt x={1360} y={300} text="بے جان" start={dur * 0.5} size={150} opacity={0.6} />}
    </AbsoluteFill>
  );
};

// S12: Jaal aur chaal - shatranj ka jaal, ghost mohra aage badhata hai, Main pehchan leta hai
export const NetChess: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const move = T(0.45, 0.7);
  const ring = T(0.74, 0.95);
  return (
    <AbsoluteFill>
      <Canvas>
        <Ground />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <DrawPath key={'v' + i} d={`M${560 + i * 160} 420 L${560 + i * 160} ${GROUND}`} start={i * 6} dur={30} width={3} color={C.rain} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <DrawPath key={'h' + i} d={`M560 ${440 + i * 140} L1360 ${440 + i * 140}`} start={10 + i * 6} dur={30} width={3} color={C.rain} />
        ))}
        <Main x={400} armsUp={T(0.7, 0.9) * 0.4} />
        <Pawn x={960} y={GROUND - 4} s={1.3} />
        <Ghost x={lerp(1560, 1180, move)} s={0.9} />
        {ring > 0 && <circle cx={1180} cy={GROUND - 100} r={30 + ring * 150} fill="none" stroke={C.amber} strokeWidth={5} opacity={1 - ring} />}
      </Canvas>
      {f < dur * 0.55 ? <UrduAt x={960} y={260} text="جال" size={170} /> : <UrduAt x={1180} y={260} text="پہچان" start={dur * 0.6} size={170} accent />}
    </AbsoluteFill>
  );
};

// S13: Mehfil, sirf ek naam - sab ke bubble mein shor, Main ke bubble mein amber taara
export const CrowdName: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const xs = [160, 340, 520, 700, 1220, 1400, 1580, 1760];
  return (
    <AbsoluteFill>
      <Canvas>
        <Ground />
        {xs.map((x, i) => (
          <g key={i}>
            <Main x={x} s={0.45} phase={f * 0.12 + i} opacity={0.55} />
            <Bubble x={x + 10} y={GROUND - 190 + Math.sin(f / 6 + i) * 6} r={34} color={C.rain} opacity={0.5} />
            <line x1={x - 14} y1={GROUND - 190 + Math.sin(f / 6 + i) * 6} x2={x + 20} y2={GROUND - 190 + Math.sin(f / 6 + i) * 6} stroke={C.rain} strokeWidth={4} opacity={0.5} />
          </g>
        ))}
        <Main x={960} />
        <Bubble x={1010} y={GROUND - 290} r={70} color={C.amber} opacity={p(f, 8, 26)} />
        <AmberStar x={1010} y={GROUND - 290} size={34} pulse={1 + 0.1 * Math.sin(f / 5)} opacity={p(f, 14, 34)} />
      </Canvas>
      <UrduAt x={960} y={230} text="نام" start={6} size={170} accent />
    </AbsoluteFill>
  );
};

// S14: Khamoshi aur ruki hui saans - wave flat ho jati hai, saans ka dhuan ruk jata hai
export const FlatWave: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const amp = 70 * (1 - T(0.15, 0.55));
  const fade = 1 - T(0.85, 1) * 0.92;
  const puffs = Array.from({length: 8}).map((_, i) => {
    const start = i * 12;
    const age = f - start;
    return {age, ok: age >= 0 && age < 50 && start < dur * 0.55};
  });
  return (
    <AbsoluteFill style={{opacity: fade}}>
      <Canvas>
        <Ground />
        <Main x={560} />
        {puffs.map((pf, i) =>
          pf.ok ? <circle key={i} cx={600 + pf.age * 3} cy={GROUND - 190 - pf.age * 1.2} r={8 + pf.age * 0.4} fill="none" stroke={C.ink} strokeWidth={3} opacity={0.5 * (1 - pf.age / 50)} /> : null,
        )}
        <Waveform x={1190} y={500} w={1000} amp={amp} f={f} />
      </Canvas>
      <UrduAt x={960} y={250} text="خاموشیاں" start={dur * 0.2} dur={24} size={160} opacity={1 - T(0.6, 0.9) * 0.7} />
    </AbsoluteFill>
  );
};
