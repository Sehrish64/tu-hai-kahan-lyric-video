import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Abs} from '../utils';
import {UrduInk} from '../components/Urdu';
import {C} from '../theme';
import {SceneProps} from './types';

// Jab tak kisi scene ki apni animation nahi bani, ye Urdu keyword dikhata hai
// taake poori video start se end tak render ho sake.
export const Placeholder: React.FC<SceneProps> = ({id, urdu, dur}) => {
  const f = useCurrentFrame();
  const n = Math.max(1, urdu.length);
  const idx = Math.min(n - 1, Math.floor(f / (dur / n)));
  const word = urdu[idx];
  const local = f - idx * (dur / n);
  const accent = word === 'تم' || word === 'امید' || word === 'تو ہے کہاں';
  return (
    <AbsoluteFill>
      <Abs x={960} y={470}>
        <UrduInk key={idx} text={word} start={0} dur={18} size={170} accent={accent} opacity={0.85 - Math.min(0.5, local / 200)} />
      </Abs>
      <div style={{position: 'absolute', left: 40, top: 30, color: C.rain, opacity: 0.35, fontSize: 24, fontFamily: 'monospace'}}>
        {id}
      </div>
    </AbsoluteFill>
  );
};
