export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const GROUND = 860; // zameen ki line (y)

export const C = {
  bg: '#050A14', // raat ka navy
  ink: '#F5F1E6', // kagaz jaisa safed (Main, lines, text)
  rain: '#8A93A6', // barish, door ki cheezein
  amber: '#FFC857', // sirf "Tum" se judi cheezein: umeed
  pain: '#E5484D', // dard ka laal (bahut kam)
};

// Barish ka level (seconds, level). 0 = barish nahi, 1.5 = tez barish.
export const RAIN_KEYS: [number, number][] = [
  [0, 0], [18, 0], [22, 0.5], [60, 0.6], [120, 0.9], [141, 0.7],
  [190, 0.5], [193.6, 0.45], [198.5, 0.45], [199.5, 0.9], [224, 1.2],
  [237.7, 1.5], [241.5, 1.5], [244.1, 0.3], [247.2, 0], [300, 0],
];
// S35: barish ruk jati hai (boondein hawa mein thehr jati hain)
export const RAIN_FROZEN: [number, number] = [193.6, 198.5];
export const OUTRO_SECONDS = 11;
