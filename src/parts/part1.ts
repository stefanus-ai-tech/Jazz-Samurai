import { C } from "../lib/constants";
import type { LStyle } from "../Lyrics";
import type { Cue } from "../cue";
import * as I from "../scenes/Intro";
import * as V1 from "../scenes/Verse1";

/** Part 1: Intro → verse 1 → "get down" (0 – 83.5 s) */

const P = C.paper, R = C.red, K = C.ink, B2 = C.cyan;

export const cues: Cue[] = [
  { at: 0, S: I.VinylIntro },
  { at: 8.4, S: I.BassIntro, tr: "iris", trd: 0.5 },
  { at: 12.8, S: I.DumComic, tr: "slash", trd: 0.35 },
  { at: 16.1, S: I.TaikoBeat, tr: "shutter", trd: 0.4 },
  { at: 22.6, S: I.VoiceSeated, tr: "ink", trd: 0.8 },
  { at: 31.92, S: I.WahBlast },
  { at: 33.4, S: I.Montage, tr: "flash", trd: 0.2 },
  { at: 38.6, S: I.WalkCity, tr: "push", trd: 0.5 },
  { at: 46.0, S: I.HatEyesScene, tr: "blinds", trd: 0.5 },
  { at: 52.6, S: V1.Midnight, tr: "iris", trd: 0.4 },
  { at: 55.33, S: V1.JazzSoul, tr: "glitch", trd: 0.3 },
  { at: 58.2, S: V1.BladeDraw, tr: "slash", trd: 0.35 },
  { at: 60.85, S: V1.FeverSmoke, tr: "ink", trd: 0.5 },
  { at: 63.2, S: V1.TideWave, tr: "pushUp", trd: 0.4 },
  { at: 65.9, S: V1.SlowCity, tr: "shoji", trd: 0.5 },
  { at: 68.5, S: V1.ClockScene, tr: "spin", trd: 0.45 },
  { at: 71.25, S: V1.RainingWatches, tr: "drop", trd: 0.5 },
  { at: 75.6, S: V1.GetDown, tr: "zoom", trd: 0.35 },
];

/** Lyric typography per line id (see src/data/lyrics.json). */
export const styles: Record<number, LStyle> = {
  0: { s: "comic", font: "bangers", y: 900, size: 150, color: P, accent: R },
  1: { s: "comic", font: "bangers", y: 900, size: 160, color: P, accent: B2, hl: [2] },
  2: { s: "stamp", font: "blackops", y: 960, size: 110, color: P, accent: R, bgColor: K },
  3: { s: "stamp", font: "blackops", y: 960, size: 120, color: P, accent: B2, bgColor: K, seed: 9 },
  4: { s: "whisper", font: "serifI", y: 520, size: 140, color: P },
  5: { s: "serif", font: "serifI", y: 440, size: 140, color: P, accent: B2, hl: [1] },
  6: { s: "serif", font: "serifI", y: 440, size: 120, color: P, accent: R, hl: [3] },
  7: { s: "serif", font: "serifI", y: 440, size: 116, color: P, accent: R, hl: [4] },
  8: { s: "slam", font: "shrikhand", y: 880, size: 300, color: P, rot: -6 },
  9: { s: "stack", font: "anton", y: 820, w: 860, h: 1000, color: P, accent: B2, hl: [4] },
  10: { s: "neon", font: "righteous", y: 820, w: 800, h: 460, accent: B2 },
  11: { s: "split", font: "anton", y: 1360, w: 920, h: 300, color: P, accent: R, hl: [7, 8] },
  12: { s: "wave", font: "caveat", y: 1080, w: 900, h: 500, color: P, size: 150 },
  13: { s: "crooked", font: "bungee", y: 640, w: 900, h: 500, color: P, accent: R, hl: [0, 2] },
  14: { s: "stretch", font: "bebas", y: 620, w: 820, h: 600, color: P },
  15: { s: "type", font: "typewriter", y: 380, w: 940, h: 300, color: P, accent: R, hl: [2, 7] },
  16: { s: "glitch", font: "anton", y: 900, w: 920, h: 620, color: P, accent: B2, hl: [4, 5, 6] },
  17: { s: "drop", font: "bungee", y: 560, w: 900, h: 400, color: B2, size: 120 },
  18: { s: "echo", font: "shrikhand", y: 560, w: 900, h: 420, color: P, accent: B2 },
  19: { s: "drop", font: "londrina", y: 560, w: 900, h: 400, color: P, accent: R, hl: [1, 3], size: 150 },
};
