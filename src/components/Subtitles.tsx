import React from 'react';
import {useCurrentFrame} from 'remotion';
import {HAND_FONT} from '../fonts';
import {C, FPS} from '../theme';
import {lyrics} from '../lyrics';
import {ic} from '../utils';

const fontFamily = `"${HAND_FONT}", cursive`;

// Neeche Roman handwriting subtitle: lafz ba lafz roshan hota hai (poori video par, global frame)
export const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const line = lyrics.find((l) => t >= l.start && t < l.end);
  if (!line) return null;
  const dur = line.end - line.start;
  const local = t - line.start;
  const words = line.roman.split(' ');
  const shown = ic(local, [0, dur * 0.6], [0, words.length]);
  const fade = Math.min(ic(local, [0, 0.15], [0, 1]), ic(local, [dur - 0.15, dur], [1, 0]));
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 64,
        textAlign: 'center',
        fontFamily,
        fontSize: 58,
        color: C.ink,
        opacity: fade,
      }}
    >
      {words.map((w, i) => (
        <span key={i} style={{opacity: ic(shown - i, [0, 1], [0.2, 1]), marginRight: 14}}>
          {w}
        </span>
      ))}
    </div>
  );
};
