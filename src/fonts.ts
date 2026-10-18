// Self-hosted fonts (replaces @remotion/google-fonts, whose loader never resolves
// in the headless sandbox and left Urdu rendering as tofu/blank).
// Full TTFs live in public/fonts/; rendering is gated on document.fonts in LyricVideo.
import {staticFile} from 'remotion';

export const URDU_FONT = 'Noto Nastaliq Urdu';
export const HAND_FONT = 'Caveat';

let injected = false;
export const ensureFontCss = () => {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const css =
    `@font-face{font-family:'${URDU_FONT}';` +
    `src:url('${staticFile('fonts/NotoNastaliqUrdu.ttf')}') format('truetype');` +
    `font-weight:400 700;font-style:normal;font-display:block;}` +
    `@font-face{font-family:'${HAND_FONT}';` +
    `src:url('${staticFile('fonts/Caveat.ttf')}') format('truetype');` +
    `font-weight:400 700;font-style:normal;font-display:block;}`;
  const el = document.createElement('style');
  el.textContent = css;
  document.head.appendChild(el);
};

// Resolves when both fonts are actually usable for canvas/DOM measurement.
export const waitForFonts = async (): Promise<void> => {
  ensureFontCss();
  if (typeof document === 'undefined' || !document.fonts) return;
  try {
    await Promise.all([
      document.fonts.load(`64px "${URDU_FONT}"`, 'گاہیں خاک تم امید'),
      document.fonts.load(`64px "${HAND_FONT}"`, 'Tu Hai Kahan'),
    ]);
    await document.fonts.ready;
  } catch {
    // If the FontFace API fails, continue anyway — worst case is fallback glyphs,
    // never a hung render.
  }
};
