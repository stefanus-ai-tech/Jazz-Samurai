import { noise2D, noise3D } from "@remotion/noise";

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const easeIn = (t: number) => Math.pow(clamp(t), 3);
export const easeInOut = (t: number) => {
  const x = clamp(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
export const easeOutBack = (t: number, s = 1.70158) => {
  const x = clamp(t) - 1;
  return 1 + (s + 1) * x * x * x + s * x * x;
};
export const easeOutElastic = (t: number) => {
  const x = clamp(t);
  if (x === 0 || x === 1) return x;
  return Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
};
export const easeOutBounce = (t: number) => {
  let x = clamp(t);
  const n1 = 7.5625, d1 = 2.75;
  if (x < 1 / d1) return n1 * x * x;
  if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
  if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
  return n1 * (x -= 2.625 / d1) * x + 0.984375;
};
/** 0→1→0 bump over [a,b] */
export const bump = (t: number, a: number, b: number) => {
  const x = prog(t, a, b);
  return Math.sin(x * Math.PI);
};
/** exponential decay after t0 (0 before) */
export const decay = (t: number, t0: number, k = 0.25) => (t < t0 ? 0 : Math.exp(-(t - t0) / k));

/** deterministic hash → [0,1) */
export const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
};
export const rnd = (seed: number, i: number) => hash(seed * 1013.37 + i * 7.13);
export const rr = (seed: number, i: number, a: number, b: number) => a + (b - a) * rnd(seed, i);

export const n2 = (seed: string, x: number, y: number) => noise2D(seed, x, y);
export const n3 = (seed: string, x: number, y: number, z: number) => noise3D(seed, x, y, z);

export const deg = (r: number) => (r * 180) / Math.PI;
export const rad = (d: number) => (d * Math.PI) / 180;
export const pt = (cx: number, cy: number, r: number, a: number) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
export const poly = (pts: ReadonlyArray<readonly [number, number] | number[]>) =>
  pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ") + " Z";
