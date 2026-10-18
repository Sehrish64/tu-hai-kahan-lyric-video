import React from 'react';
import {Composition} from 'remotion';
import {LyricVideo} from './LyricVideo';
import {TOTAL_FRAMES} from './timeline';
import {FPS, H, W} from './theme';

export const Root: React.FC = () => (
  <Composition
    id="LyricVideo"
    component={LyricVideo}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={W}
    height={H}
  />
);
