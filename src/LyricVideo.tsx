import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  continueRender,
  delayRender,
  staticFile,
} from 'remotion';
import {scenes} from './timeline';
import {getScene} from './registry';
import {StageBack, StageFront} from './components/Stage';
import {Subtitles} from './components/Subtitles';
import {waitForFonts} from './fonts';

export const LyricVideo: React.FC = () => {
  const [handle] = useState(() => delayRender('waiting for self-hosted fonts'));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Safety timeout: never hang the render longer than 15s on fonts.
    const timer = setTimeout(() => {
      if (!cancelled) {
        continueRender(handle);
        setReady(true);
      }
    }, 15000);
    waitForFonts().then(() => {
      if (!cancelled) {
        clearTimeout(timer);
        continueRender(handle);
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [handle]);

  if (!ready) return null;

  return (
    <AbsoluteFill>
      {/* gaana public/song.mp3 mein rakhein */}
      <Audio src={staticFile('song.mp3')} />
      <StageBack />
      {scenes.map((s) => {
        const Comp = getScene(s.comp);
        return (
          <Sequence key={s.id} name={s.id + ' ' + s.title} from={s.from} durationInFrames={s.durationInFrames}>
            <Comp id={s.id} urdu={s.urdu} dur={s.durationInFrames} />
          </Sequence>
        );
      })}
      <Subtitles />
      <StageFront />
    </AbsoluteFill>
  );
};
