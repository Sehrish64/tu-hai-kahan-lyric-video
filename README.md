# Tu Hai Kahan — Lyric Video

*Ek jazbaati lyric video — minimalist white ink line on dark navy, amber sirf "tum" ke liye.*

An emotional lyric video built with [Remotion](https://www.remotion.dev/) (React + TypeScript): **51 hand-animated scenes (S00–S50)** synced line-by-line to the song, with Urdu Nastaliq typography and a two-character story — a solid white stick figure (**Main**) and a dashed ghost figure (**Tum**, never fully visible).

## The look

- **White-on-dark-navy** minimalist line art, one continuous visual language
- **Amber `#FFC857` accent used ONLY for "tum"-related things** — her star, window light, the flower, the heart-lantern, the word تم, the final rose
- **Urdu Nastaliq typography** for keywords (خاک، تنہا، خواب، یاد، آنسو، خط، تم، امید…) with RTL reveal; Roman handwriting subtitles stay at the bottom
- Empty-bench motif: opens the video, returns in flashback, and closes it — amber star dies, fade to black

## Project structure

```
src/
  lyrics.ts      # 74 lyric lines: Roman + Urdu + highlight word + start/end seconds
  timeline.ts    # 51 scenes (S00–S50) with timecodes, generated from the lyric timings
  theme.ts       # colors, FPS, OUTRO_SECONDS
  fonts.ts       # self-hosted @font-face injection + document.fonts gate
  registry.ts    # scene id → component mapping
  scenes/        # S00–S05 + ActA–F (S06–S50) + Placeholder fallback
  components/    # Urdu, Figures, Props, Stage, Subtitles
public/
  fonts/         # NotoNastaliqUrdu.ttf + Caveat.ttf (self-hosted, full glyph coverage)
```

## Run it

```bash
npm install
npx remotion studio src/index.ts   # preview in Remotion Studio
npx remotion render src/index.ts LyricVideo out/tu-hai-kahan.mp4
```

Composition: `LyricVideo`, 1920×1080, 30 fps.

> **Long renders:** set `TMPDIR` to a roomy disk before rendering (Remotion writes frame
> screenshots there) and render in ≤500-frame chunks with `--frames=` if Chrome runs
> out of memory, then concat the chunks with ffmpeg.

## ⚠️ The song is NOT included

`public/song.mp3` is **intentionally excluded** from this repo (see `.gitignore`) — the
audio is a commercial recording and cannot be redistributed here. To render:

1. Place **your own legally-obtained** copy of the song at `public/song.mp3`
2. Make sure the lyric timings in `src/lyrics.ts` / `src/timeline.ts` match your audio
   (the timeline here ends the last lyric at 254.9s with an 11s outro → 265.9s total;
   if your audio is longer, extend `S50` and `TOTAL_FRAMES` in `src/timeline.ts`)

## Fonts

Urdu uses **Noto Nastaliq Urdu** and subtitles use **Caveat**, both self-hosted as full
TTFs in `public/fonts/` with a `document.fonts` render gate (`src/fonts.ts`). Do **not**
switch back to `@remotion/google-fonts`' loader — it never resolves in headless /
sandboxed renders and leaves Urdu as blank tofu boxes.

## Credits

- Concept & direction: **Sehrish**
- Built with Remotion + React + TypeScript
- Fonts: Noto Nastaliq Urdu & Caveat (SIL Open Font License)

## License

MIT — see [LICENSE](LICENSE).
