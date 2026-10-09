import { C } from "../lib/constants";
import type { LStyle } from "../Lyrics";
import type { Cue } from "../cue";
import * as V2 from "../scenes/Verse2";
import * as B from "../scenes/Bridge";

/** Part 3: Verse 2 → chants → bridge → HA! (146.8 – 205.5 s) */

const P = C.paper, R = C.red, K = C.ink, B2 = C.cyan;

export const cues: Cue[] = [
  { at: 146.8, S: V2.Crooked, tr: "slash", trd: 0.35 },
  { at: 149.15, S: V2.FujiMove, tr: "glitch", trd: 0.25 },
  { at: 150.85, S: V2.NoForce, tr: "paper", trd: 0.3 },
  { at: 152.5, S: V2.DreamPocket, tr: "iris", trd: 0.4 },
  { at: 155.3, S: V2.GoldDust, tr: "flash", trd: 0.25 },
  { at: 157.25, S: V2.Lanterns, tr: "pushUp", trd: 0.4 },
  { at: 159.22, S: V2.CrownCut, tr: "spin", trd: 0.35 },
  { at: 161.32, S: V2.RoadHome, tr: "shutter", trd: 0.35 },
  { at: 164.25, S: V2.Chants, tr: "scratch", trd: 0.3 },
  { at: 170.6, S: B.Ripples, tr: "burn", trd: 0.9 },
  { at: 177.0, S: B.Horizon, tr: "blinds", trd: 0.5 },
  { at: 182.3, S: B.HeavenUnder, tr: "drop", trd: 0.6 },
  { at: 187.5, S: B.HearThat, tr: "iris", trd: 0.5 },
  { at: 195.2, S: B.EnsoSpace, tr: "flash", trd: 0.3 },
  { at: 202.0, S: B.HaBlast },
];

/** Lyric typography per line id (see src/data/lyrics.json). */
export const styles: Record<number, LStyle> = {
  37: { s: "crooked", font: "graffiti", y: 720, w: 900, h: 640, color: P, accent: B2, hl: [4, 9] },
  38: { s: "pop", font: "abril", y: 500, w: 900, h: 460, color: P, accent: R, hl: [3, 7] },
  39: { s: "serif", font: "serif", y: 960, size: 104, color: K, accent: R, outline: null, hl: [2, 5] },
  40: { s: "float", font: "caveat", y: 640, w: 900, h: 600, color: P, accent: B2, hl: [11], upper: false },
  41: { s: "outline", font: "abril", y: 800, w: 900, h: 560, color: P, accent: C.gold, hl: [4] },
  42: { s: "float", font: "bungee", y: 900, w: 900, h: 560, color: P, accent: B2, hl: [1] },
  43: { s: "split", font: "anton", y: 300, w: 940, h: 320, color: P, accent: R, hl: [4, 9] },
  44: { s: "karaoke", font: "bebas", y: 560, w: 900, h: 520, color: P, accent: R, hl: [6, 8], lead: 0.4 },
  45: { s: "chant", font: "bungee", y: 960, size: 110, color: P, accent: R, bgColor: K },
  46: { s: "chant", font: "bungee", y: 960, size: 100, color: P, accent: B2, bgColor: K },
  47: { s: "chant", font: "bungee", y: 960, size: 110, color: P, accent: R, bgColor: K },
  48: { s: "zoom", font: "anton", y: 960, w: 660, h: 260, color: P, accent: R, hl: [4] },
  49: { s: "whisper", font: "serif", y: 960, w: 1000, h: 220, size: 70, color: P, upper: false, outline: K },
  50: { s: "whisper", font: "serifI", y: 330, w: 920, h: 300, size: 96, color: P },
  51: { s: "whisper", font: "serifI", y: 960, size: 96, color: P },
  52: { s: "zoom", font: "monoton", y: 600, size: 120, color: R, outline: null },
  53: { s: "zoom", font: "monoton", y: 1320, size: 120, color: B2, outline: null },
  54: { s: "serif", font: "serifI", y: 960, w: 560, h: 360, size: 74, color: K, accent: R, outline: null, hl: [3] },
  55: { s: "slam", font: "climate", y: 880, size: 330, color: P },
};
