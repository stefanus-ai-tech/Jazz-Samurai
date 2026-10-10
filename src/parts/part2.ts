import { C } from "../lib/constants";
import type { LStyle } from "../Lyrics";
import type { Cue } from "../cue";
import * as CH from "../scenes/Chorus";
import * as D from "../scenes/Duel";

/** Part 2: Pre-chorus → chorus 1 → BOOM—CHA → instrumental duel (83.5 – 146.8 s) */

const P = C.paper, R = C.red, K = C.ink, B2 = C.cyan;

export const cues: Cue[] = [
  { at: 83.55, S: CH.WorldSpin, tr: "scratch", trd: 0.35 },
  { at: 86.35, S: CH.FreezeFrame, tr: "flash", trd: 0.2 },
  { at: 89.0, S: CH.DanceSteps, tr: "paper", trd: 0.45 },
  { at: 91.6, S: CH.VinylCrack, tr: "iris", trd: 0.4 },
  { at: 95.3, S: CH.ToriiDive, tr: "zoom", trd: 0.3 },
  { at: 97.7, S: CH.DeepDepth, tr: "ink", trd: 0.45 },
  { at: 100.35, S: CH.Strata, tr: "blinds", trd: 0.35 },
  { at: 103.05, S: CH.BlackHoleScene, tr: "iris", trd: 0.4 },
  { at: 107.0, S: CH.Breathe, tr: "flash", trd: 0.3 },
  { at: 113.95, S: CH.Shuffle, tr: "slash", trd: 0.3 },
  { at: 116.75, S: CH.BoomCha },
  { at: 124.4, S: D.DuelWide, tr: "burn", trd: 0.8 },
  { at: 129.6, S: D.DuelClose },
  { at: 134.8, S: D.BambooEQ, tr: "shoji", trd: 0.5 },
  { at: 140.0, S: D.DuelCharge, tr: "push", trd: 0.3 },
  { at: 144.92, S: D.Aftermath },
];

/** Lyric typography per line id (see src/data/lyrics.json). */
export const styles: Record<number, LStyle> = {
  20: { s: "slam", font: "anton", y: 820, w: 900, h: 600, color: P, accent: R, hl: [7] },
  21: { s: "hand", font: "marker", y: 360, w: 920, h: 340, color: P, accent: R, hl: [4] },
  22: { s: "stamp", font: "blackops", y: 470, w: 920, h: 460, color: K, accent: R, outline: null, size: 92 },
  23: { s: "wave", font: "anton", upper: true, y: 330, w: 940, h: 380, color: P, accent: R, hl: [2, 7] },
  24: { s: "drop", font: "anton", y: 900, w: 900, h: 700, color: P, accent: B2, hl: [0, 1, 2] },
  25: { s: "zoom", font: "rubikmono", y: 700, w: 900, h: 600, color: P, accent: B2, hl: [2] },
  26: { s: "sink", font: "anton", y: 480, w: 900, h: 400, color: P, accent: R, hl: [2] },
  27: { s: "spiral", font: "bungee", x: 540, y: 900, size: 92, color: P },
  28: { s: "whisper", font: "serifI", y: 760, size: 120, color: P },
  29: { s: "whisper", font: "serifI", y: 1160, size: 120, color: B2 },
  30: { s: "stamp", font: "blackops", y: 520, size: 120, color: P, accent: K, bgColor: R },
  31: { s: "stamp", font: "blackops", y: 780, w: 940, size: 104, color: P, accent: K, bgColor: R, seed: 4 },
  32: { s: "comic", font: "bangers", y: 400, size: 200, color: P, rot: -6 },
  33: { s: "comic", font: "bangers", y: 420, size: 170, color: B2, rot: 5 },
  34: { s: "comic", font: "bangers", y: 400, size: 200, color: P, rot: -3 },
  35: { s: "comic", font: "bangers", y: 420, size: 170, color: R, rot: 6 },
  36: { s: "comic", font: "bangers", y: 400, size: 210, color: P, rot: -8 },
};
