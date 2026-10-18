import React from 'react';
import {useCurrentFrame} from 'remotion';
import {URDU_FONT} from '../fonts';
import {C} from '../theme';
import {Abs, ic} from '../utils';

const fontFamily = `"${URDU_FONT}", serif`;
export const urduFont = fontFamily;

// Right-to-left ink reveal (Urdu lafz / line)
export const UrduInk: React.FC<{
  text: string;
  start?: number;
  dur?: number;
  accent?: boolean;
  size?: number;
  opacity?: number;
}> = ({text, start = 0, dur = 24, accent, size = 140, opacity = 1}) => {
  const f = useCurrentFrame();
  const p = ic(f, [start, start + dur], [0, 100]);
  const mask = `linear-gradient(to left, #000 ${p}%, transparent ${p + 12}%)`;
  return (
    <div
      dir="rtl"
      style={{
        fontFamily,
        fontSize: size,
        lineHeight: 2.1,
        color: accent ? C.amber : C.ink,
        opacity,
        whiteSpace: 'nowrap',
        WebkitMaskImage: mask,
        maskImage: mask,
        textShadow: accent ? '0 0 24px rgba(255,200,87,.6)' : 'none',
      }}
    >
      {text}
    </div>
  );
};

// Lafz mitti ke zarron mein ghul jata hai (khak, dard)
export const DustWord: React.FC<{
  text: string;
  start: number;
  dur?: number;
  size?: number;
  id?: string;
  color?: string;
}> = ({text, start, dur = 40, size = 160, id = 'dust', color}) => {
  const f = useCurrentFrame();
  const t = ic(f, [start, start + dur], [0, 1]);
  return (
    <>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={2} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={t * 180} />
        </filter>
      </svg>
      <div
        dir="rtl"
        style={{
          fontFamily,
          fontSize: size,
          lineHeight: 2.1,
          color: color ?? C.ink,
          whiteSpace: 'nowrap',
          filter: `url(#${id})`,
          opacity: 1 - t * t,
        }}
      >
        {text}
      </div>
    </>
  );
};

// Urdu lafz ko (x, y) par ink reveal ke saath dikhana
export const UrduAt: React.FC<{
  x: number;
  y: number;
  text: string;
  start?: number;
  dur?: number;
  size?: number;
  accent?: boolean;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({x, y, text, start = 0, dur = 18, size = 150, accent, opacity = 1, style}) => (
  <Abs x={x} y={y} style={style}>
    <UrduInk text={text} start={start} dur={dur} size={size} accent={accent} opacity={opacity} />
  </Abs>
);
