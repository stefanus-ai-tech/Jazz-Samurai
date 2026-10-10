import { C } from "../lib/constants";
import type { LStyle } from "../Lyrics";
import type { Cue } from "../cue";
import * as S from "../scenes/Scat";
import * as F from "../scenes/Final";
import * as CH from "../scenes/Chorus";

/** Part 4: Scat → solo → final chorus → outro (205.5 – 353.1 s) */

const P = C.paper, R = C.red, K = C.ink, B2 = C.cyan;

export const cues: Cue[] = [
  { at: 205.45, S: S.ComicPanels, tr: "shutter", trd: 0.3 },
  { at: 213.4, S: S.TurntableScene, tr: "spin", trd: 0.4 },
  { at: 218.6, S: S.Rewind, tr: "glitch", trd: 0.3, montage: true },
  { at: 223.8, S: S.ShamisenScene, tr: "scratch", trd: 0.35 },
  { at: 229.0, S: S.NeonAlley, tr: "shoji", trd: 0.5 },
  { at: 233.2, S: S.WooferFeed, tr: "zoom", trd: 0.3 },
  { at: 244.5, S: S.RhodesKeys, tr: "ink", trd: 0.6 },
  { at: 250.4, S: S.KoiPond, tr: "iris", trd: 0.5 },
  { at: 256.3, S: S.BoomboxScene, tr: "glitch", trd: 0.3 },
  { at: 264.3, S: F.Rooftops, tr: "push", trd: 0.5 },
  { at: 271.6, S: F.MoonLeap, tr: "flash", trd: 0.3 },
  { at: 278.2, S: F.HypnoChorus },
  { at: 286.5, S: CH.BlackHoleScene, tr: "iris", trd: 0.4 },
  { at: 289.6, S: F.Hyperspace, tr: "zoom", trd: 0.4 },
  { at: 297.0, S: F.JazzClub, tr: "flash", trd: 0.25 },
  { at: 311.55, S: F.BassOutro, tr: "slash", trd: 0.35 },
  { at: 318.2, S: F.Sheath, tr: "ink", trd: 0.5 },
  { at: 324.0, S: F.Sunrise, tr: "burn", trd: 0.9 },
  { at: 333.0, S: F.Recap, tr: "flash", trd: 0.2, montage: true },
  { at: 346.8, S: F.Bwoow, montage: true },
  { at: 350.6, S: F.VinylStop, tr: "ink", trd: 0.5 },
];

/** Lyric typography per line id (see src/data/lyrics.json). */
export const styles: Record<number, LStyle> = {
  56: { s: "bubble", font: "bangers", x: 290, y: 420, w: 440, size: 64, color: K },
  57: { s: "bubble", font: "bangers", x: 790, y: 420, w: 440, size: 60, color: K, rot: 3 },
  58: { s: "bubble", font: "bangers", x: 540, y: 900, w: 640, size: 74, color: K },
  59: { s: "bubble", font: "bangers", x: 540, y: 1330, w: 900, size: 80, color: K, bgColor: C.cyan },
  60: { s: "bubble", font: "bangers", x: 790, y: 1330, w: 440, size: 60, color: K },
  61: { s: "bubble", font: "bangers", x: 290, y: 420, w: 440, size: 58, color: K, rot: -4 },
  62: { s: "bubble", font: "bangers", x: 790, y: 420, w: 440, size: 58, color: K, rot: 4 },
  63: { s: "slam", font: "bungeeshade", y: 420, w: 940, size: 96, color: P },
  64: { s: "slam", font: "shrikhand", y: 1380, w: 940, size: 96, color: B2 },
  65: { s: "slam", font: "faster", y: 420, w: 940, size: 100, color: R },
  66: { s: "bubble", font: "bangers", y: 1380, w: 900, size: 84, color: K },
  67: { s: "pop", font: "zendots", y: 420, w: 940, size: 78, color: P },
  68: { s: "pop", font: "wetpaint", y: 1380, w: 940, size: 92, color: R },
  69: { s: "pop", font: "rocksalt", y: 420, w: 940, size: 72, color: B2, upper: false },
  70: { s: "bubble", font: "bangers", y: 1380, w: 900, size: 84, color: K, bgColor: C.cyan },
  71: { s: "comic", font: "bangers", y: 470, size: 150, color: P, accent: R, rot: -5 },
  72: { s: "comic", font: "bangers", y: 470, size: 150, color: B2, rot: 4 },
  73: { s: "comic", font: "bangers", y: 470, size: 130, color: R, rot: -3 },
  74: { s: "tunnel", font: "anton", y: 960, w: 900, size: 140, color: P, accent: B2 },
  75: { s: "ticker", font: "bebas", y: 960, size: 150, color: P, bgColor: C.blue2, rot: -9 },
  76: { s: "sink", font: "climate", y: 640, w: 940, h: 500, color: P, accent: R, hl: [2] },
  77: { s: "spiral", font: "bungee", x: 540, y: 900, size: 96, color: P },
  78: { s: "echo", font: "anton", y: 700, size: 170, color: P, accent: B2 },
  79: { s: "neon", font: "righteous", y: 960, size: 140, accent: R },
  80: { s: "echo", font: "anton", y: 1220, size: 170, color: P, accent: R },
  81: { s: "scramble", font: "rubikmono", y: 420, size: 92, color: P, accent: R },
  82: { s: "serif", font: "serifI", y: 380, size: 104, color: P, accent: R, hl: [3] },
  83: { s: "serif", font: "serifI", y: 380, size: 104, color: P, accent: R, hl: [3] },
  84: { s: "whisper", font: "serifI", y: 380, size: 104, color: P },
  85: { s: "pop", font: "shrikhand", y: 380, w: 940, size: 100, color: P, accent: R, hl: [4] },
  86: { s: "zoom", font: "monoton", y: 420, size: 120, color: P, outline: null },
  87: { s: "zoom", font: "monoton", y: 1360, size: 110, color: C.red, outline: null },
  88: { s: "serif", font: "serifI", y: 520, w: 900, size: 98, color: P, accent: R, hl: [4] },
  89: { s: "serif", font: "serifI", y: 1300, w: 900, size: 98, color: P, accent: B2, hl: [3] },
  90: { s: "melt", font: "faster", y: 760, size: 150, color: P, tail: 0.6 },
};
