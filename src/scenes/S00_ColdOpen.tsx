import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Abs, Canvas, ic, lerp} from '../utils';
import {AmberStar} from '../components/Figures';
import {UrduInk} from '../components/Urdu';
import {SceneProps} from './types';

// S00: andhera, ek chingari (amber zarra), title likha jata hai
export const ColdOpen: React.FC<SceneProps> = ({dur}) => {
  const f = useCurrentFrame();
  const spark = ic(f, [50, 110], [0, 1]);
  const pulse = 1 + 0.15 * Math.sin(f / 9);
  const exit = ic(f, [dur - 60, dur], [0, 1]);
  // aakhir mein zarra S01 ke taare ki jagah (1560, 300) par chala jata hai
  const sx = lerp(960, 1560, exit);
  const sy = lerp(470, 300, exit);
  const size = lerp(14, 40, exit);
  const titleOpacity = 1 - ic(f, [dur - 90, dur - 50], [0, 1]);
  return (
    <AbsoluteFill>
      <Canvas>
        <AmberStar x={sx} y={sy} size={size} pulse={pulse} opacity={spark} />
      </Canvas>
      <Abs x={960} y={640} style={{opacity: titleOpacity}}>
        <UrduInk text="تو ہے کہاں" start={120} dur={60} accent size={150} />
      </Abs>
    </AbsoluteFill>
  );
};
