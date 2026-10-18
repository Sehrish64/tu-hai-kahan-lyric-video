import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Abs, Canvas, Ground, ic, lerp, p, shake} from '../utils';
import {AmberStar, DrawPath, Ghost, Main} from '../components/Figures';
import {Bubble, Eye, Glow, Heart, Letterbox, Page, QMark, Tear, WeatherIcon} from '../components/Props';
import {UrduAt} from '../components/Urdu';
import {C, GROUND, W, H} from '../theme';
import {SceneProps} from './types';

// S15: Aansu baant lena - dono aansu mil kar ek ho jate hain
export const TearCatch: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const t1 = T(0.08, 0.35);
  const t2 = T(0.45, 0.7);
  const merge = T(0.75, 1);
  return (
    <AbsoluteFill>
      <Canvas>
        <Ground />
        <Main x={800} armsUp={0.3} />
        <Ghost x={1160} />
        {t1 > 0 && t1 < 1 && <Tear x={1160} y={GROUND - 190 + t1 * 150} s={1.3} />}
        {t1 >= 1 && merge === 0 && <Tear x={830} y={GROUND - 100} s={1.1} />}
        {t2 > 0 && t2 < 1 && <Tear x={800} y={GROUND - 190 + t2 * 110} s={1.3} />}
        {merge > 0 && <Tear x={lerp(830, 980, merge)} y={GROUND - 100 - merge * 40} s={1.1 + merge * 0.9} color={C.amber} glow />}
        {merge > 0 && <Tear x={lerp(1130, 980, merge)} y={GROUND - 100 - merge * 40} s={1.1} opacity={1 - merge} />}
      </Canvas>
      {f < dur * 0.5 ? <UrduAt x={960} y={250} text="آنسو" size={160} /> : <UrduAt x={960} y={250} text="رو" start={dur * 0.5} size={170} />}
    </AbsoluteFill>
  );
};

// S16: Tum bas has dena - Main rota hai, ghost ki dashed muskurahat, Main ke khwab bujhte hain
export const GhostSmile: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const stars = [0, 1, 2, 3, 4];
  return (
    <AbsoluteFill>
      <Canvas>
        <Ground />
        <Main x={640} />
        {[0, 1, 2].map((i) => {
          const a = (f + i * 40) % 120;
          return <Tear key={i} x={650} y={GROUND - 170 + a * 1.2} s={1.1} opacity={1 - a / 120} />;
        })}
        {stars.map((i) => {
          const off = T(0.5 + i * 0.09, 0.58 + i * 0.09);
          return <AmberStar key={i} x={430 + i * 90} y={330 + (i % 2) * 40} size={16} opacity={(1 - off) * (0.7 + 0.3 * Math.sin(f / 6 + i))} />;
        })}
        <Ghost x={1240} />
        <circle cx={1240} cy={420} r={115} fill="none" stroke={C.ink} strokeWidth={4} strokeDasharray="10 14" opacity={0.6} />
        <circle cx={1200} cy={395} r={6} fill={C.ink} opacity={0.6} />
        <circle cx={1280} cy={395} r={6} fill={C.ink} opacity={0.6} />
        <DrawPath d="M1180 440 Q1240 505 1300 440" start={dur * 0.12} dur={dur * 0.25} width={6} color={C.amber} />
      </Canvas>
      {f < dur * 0.5 ? <UrduAt x={960} y={220} text="ہنس" size={160} /> : <UrduAt x={960} y={220} text="مسکراہٹ" start={dur * 0.5} size={160} accent />}
    </AbsoluteFill>
  );
};

// S17: Mohabbat ka hisab - ledger ke panne hawa mein ud jate hain
export const LedgerFly: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const sh = shake(f, 4 * T(0.3, 0.8));
  const tally = [0, 1, 2, 3, 4];
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <Canvas>
        <Page x={960} y={520} w={560} h={640} lines={7} />
        {tally.map((i) => (
          <DrawPath key={i} d={`M${760 + i * 70} 340 L${760 + i * 70} 420 M${740 + i * 70} 400 L${800 + i * 70} 360`} start={i * 5} dur={10} width={4} opacity={1 - T(0.55, 0.8)} />
        ))}
        {[0, 1, 2, 3, 4].map((i) => {
          const q = T(0.3 + i * 0.07, 0.8 + i * 0.04);
          if (q <= 0) return null;
          return <Page key={i} x={960 + q * 1100} y={520 - q * (180 + i * 60)} rot={q * (60 + i * 25)} w={560} h={640} s={0.5} opacity={1 - q} />;
        })}
        {[0, 1, 2].map((i) => (
          <line key={'w' + i} x1={300} y1={400 + i * 120} x2={600 + T(0.3, 0.9) * 200} y2={400 + i * 120} stroke={C.rain} strokeWidth={3} strokeDasharray="14 14" opacity={T(0.3, 0.5) * 0.6} />
        ))}
      </Canvas>
      <UrduAt x={960} y={300} text="حساب" size={150} opacity={1 - T(0.4, 0.8)} style={{transform: `translate(calc(-50% + ${T(0.4, 0.9) * 700}px), calc(-50% - ${T(0.4, 0.9) * 120}px))`}} />
    </AbsoluteFill>
  );
};

// S18: Khali aankh, khali haath - jawab nahi
export const EmptyEye: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const phase = f < dur * 0.33 ? 0 : f < dur * 0.66 ? 1 : 2;
  return (
    <AbsoluteFill>
      <Canvas>
        <Ground />
        <Main x={640} armsUp={phase === 1 ? 0.5 : phase === 2 ? 0.35 : 0} />
        <Ghost x={1280} />
        {phase === 0 && (
          <g>
            <Eye x={1280} y={440} s={0.9} />
            <circle cx={1280} cy={440} r={30} fill="none" stroke={C.ink} strokeWidth={3} strokeDasharray="6 10" opacity={0.5} />
          </g>
        )}
        {phase === 1 &&
          Array.from({length: 14}).map((_, i) => {
            const q = ((f - dur * 0.33 + i * 6) % 70) / 70;
            return <circle key={i} cx={760 + Math.sin(i * 2.1 + f / 8) * 30} cy={GROUND - 300 - q * 220} r={3 + (i % 3)} fill={C.ink} opacity={0.7 * (1 - q)} />;
          })}
        {phase === 2 && (
          <g>
            <Heart x={820} y={GROUND - 250} s={0.6} />
            <line x1={680} y1={GROUND - 135} x2={780} y2={GROUND - 235} stroke={C.ink} strokeWidth={5} opacity={0} />
            <line x1={1230} y1={GROUND - 140} x2={1180} y2={GROUND - 160} stroke={C.ink} strokeWidth={5} strokeDasharray="8 10" opacity={0.4} />
          </g>
        )}
      </Canvas>
      {phase === 0 && <UrduAt x={1280} y={250} text="خواب" size={140} opacity={0.35} />}
      {phase === 1 && <UrduAt x={640} y={250} text="غمزدہ" start={dur * 0.33} size={140} />}
      {phase === 2 && <UrduAt x={1280} y={250} text="جواب" start={dur * 0.66} size={140} opacity={0.3} />}
    </AbsoluteFill>
  );
};

// S19: Khat jo nahi aaya - letterbox andar se khali
export const LetterboxScene: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const pile = Math.floor(T(0, 0.45) * 8);
  const plane = T(0.7, 1);
  return (
    <AbsoluteFill>
      <Canvas>
        <Ground />
        <Main x={420} />
        {Array.from({length: pile}).map((_, i) => (
          <rect key={i} x={560 + (i % 3) * 6} y={GROUND - 14 - i * 12} width={90} height={12} fill="rgba(5,10,20,0.9)" stroke={C.ink} strokeWidth={3} />
        ))}
        <Letterbox x={1300} y={700} s={1.3} open={T(0.45, 0.65)} />
        {plane > 0 && (
          <path
            transform={`translate(${lerp(1000, 1750, plane)} ${lerp(560, 260, plane) + Math.sin(plane * 9) * 24}) rotate(${-20 + Math.sin(plane * 9) * 12})`}
            d="M0 0 L60 -14 L22 6 Z M22 6 L30 24 L12 8"
            fill="none"
            stroke={C.ink}
            strokeWidth={4}
            strokeLinejoin="round"
          />
        )}
      </Canvas>
      <UrduAt x={960} y={260} text="خط" size={190} />
    </AbsoluteFill>
  );
};

// S20: Gaana, khabar nahi - awaaz khali sadak mein kho jati hai
export const SingToRoad: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const singing = f < dur * 0.5;
  const cam = 1 + 0.08 * T(0.5, 1);
  return (
    <AbsoluteFill style={{transform: `scale(${cam})`, transformOrigin: '1500px 560px'}}>
      <Canvas>
        <Ground />
        <Main x={380} />
        <path d="M700 860 L1500 580 M1000 860 L1560 580" stroke={C.rain} strokeWidth={4} fill="none" opacity={0.6} />
        {singing &&
          [0, 1, 2, 3, 4].map((i) => {
            const age = (f + i * 14) % 70;
            const r = 20 + age * 5;
            return <path key={i} d={`M${470 + age * 6} ${GROUND - 190 - r * 0.6} A${r} ${r} 0 0 1 ${470 + age * 6} ${GROUND - 190 + r * 0.6}`} fill="none" stroke={C.ink} strokeWidth={4} opacity={0.7 * (1 - age / 70) * (age > 54 ? 0.4 : 1)} />;
          })}
        <circle cx={1530} cy={570} r={4 + T(0.5, 1) * 6} fill="none" stroke={C.rain} strokeWidth={2} opacity={0.6} />
      </Canvas>
      {singing ? <UrduAt x={700} y={250} text="موسیقی" size={150} /> : <UrduAt x={1300} y={300} text="خبر" start={dur * 0.5} size={150} opacity={0.6} />}
    </AbsoluteFill>
  );
};

// S21: Mausamon se poochna - tez montage, har ek na mein sar hilata hai
export const WeatherMontage: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const cut = Math.min(4, Math.floor(f / 16));
  const lf = f - cut * 16;
  const lastGap = f >= 80;
  const slide = ic(lf, [0, 5], [260, 0]);
  const blur = ic(lf, [0, 5], [8, 0]);
  const shakeRot = Math.sin(lf * 1.6) * 8 * ic(lf, [4, 16], [1, 0.4]);
  return (
    <AbsoluteFill>
      <Canvas>
        <Ground />
        <Main x={520} armsUp={0.5 + 0.2 * Math.sin(f / 2)} />
        {!lastGap && (
          <g transform={`translate(${slide} 0) rotate(${shakeRot} 1300 520)`} style={{filter: `blur(${blur}px)`}}>
            <WeatherIcon kind={cut} x={1300} y={520} s={2.4} />
          </g>
        )}
      </Canvas>
      <UrduAt x={960} y={230} text="موسموں" start={0} dur={6} size={160} opacity={lf < 3 ? 1 : 0.55} />
      <AbsoluteFill style={{backgroundColor: '#fff', opacity: lf < 2 ? 0.22 : 0}} />
    </AbsoluteFill>
  );
};

// S22: Thakaan aur pehli umeed - aansu bhi khatam, phir door se amber roshni
export const ThakaanPukar: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const T = (a: number, b: number) => p(f, a * dur, b * dur);
  const glow = T(0.72, 1);
  const flick = [0.32, 0.38, 0.44, 0.5].map((a) => f >= a * dur && f < a * dur + 5);
  const ghostXs = [300, 1500, 700, 1300];
  const mx = 960 + Math.sin(T(0.25, 0.5) * 12) * 120 * (f >= dur * 0.25 && f < dur * 0.5 ? 1 : 0);
  const stage = f < dur * 0.25 ? 0 : f < dur * 0.5 ? 1 : f < dur * 0.72 ? 2 : 3;
  return (
    <AbsoluteFill>
      <Canvas>
        <Ground />
        {stage === 0 && <Eye x={960} y={500} s={1.3} open={0.35} />}
        {stage >= 1 && <Main x={stage === 3 ? 620 : mx} flip={stage === 1 && Math.sin(T(0.25, 0.5) * 12) < 0} armsUp={stage === 3 ? 1 : 0} />}
        {stage === 1 && flick.map((on, i) => (on ? <Ghost key={i} x={ghostXs[i]} /> : null))}
        {stage === 2 && <Heart x={960} y={GROUND - 128} s={0.5} />}
        {stage === 3 && (
          <g>
            <Glow x={1700} y={GROUND} r={120 + glow * 380 + Math.sin(f / 5) * 12} opacity={glow} id="glowHorizon" />
            <circle cx={1700} cy={GROUND - 6} r={10 + glow * 10} fill={C.amber} opacity={glow} />
          </g>
        )}
      </Canvas>
      {stage === 0 && <UrduAt x={960} y={250} text="آنسو" size={150} opacity={0.6} />}
      {stage === 1 && <UrduAt x={960} y={250} text="کہاں" start={dur * 0.25} size={160} />}
      {stage === 2 && <UrduAt x={960} y={250} text="دل" start={dur * 0.5} size={170} />}
      {stage === 3 && <UrduAt x={960} y={250} text="چلے آؤ" start={dur * 0.72} dur={26} size={170} accent />}
    </AbsoluteFill>
  );
};
