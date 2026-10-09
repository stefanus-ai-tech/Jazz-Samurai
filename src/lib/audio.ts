import data from "../data/audio.json";
import { FPS } from "./constants";

type AudioData = {
  fps: number; frames: number; duration: number;
  bass: number[]; hat: number[]; mid: number[]; rms: number[]; vocal: number[]; onset: number[];
  beats: number[]; downbeats: number[]; bassOnsets: number[]; hits: number[];
};
export const AUDIO = data as AudioData;

const at = (arr: number[], t: number) => {
  const f = t * FPS;
  const i = Math.max(0, Math.min(AUDIO.frames - 2, Math.floor(f)));
  const k = Math.max(0, Math.min(1, f - i));
  return (arr[i] * (1 - k) + arr[i + 1] * k) / 99;
};
/** smoothed sample over a small window (attack/release feel) */
const sm = (arr: number[], t: number, back = 0.1) => {
  let m = 0;
  for (let k = 0; k <= 3; k++) m = Math.max(m, at(arr, t - (back * k) / 3) * (1 - k * 0.18));
  return m;
};
export const bass = (t: number) => sm(AUDIO.bass, t);
export const hat = (t: number) => at(AUDIO.hat, t);
export const mid = (t: number) => sm(AUDIO.mid, t);
export const rms = (t: number) => sm(AUDIO.rms, t, 0.2);
export const vocal = (t: number) => sm(AUDIO.vocal, t);
export const onset = (t: number) => at(AUDIO.onset, t);

/** index of last event <= t (or -1) */
export const lastIdx = (list: number[], t: number) => {
  let lo = 0, hi = list.length - 1, ans = -1;
  while (lo <= hi) {
    const m = (lo + hi) >> 1;
    if (list[m] <= t) { ans = m; lo = m + 1; } else hi = m - 1;
  }
  return ans;
};
export const since = (list: number[], t: number) => {
  const i = lastIdx(list, t);
  return i < 0 ? 999 : t - list[i];
};
/** decaying pulse at each event in list */
export const pulse = (list: number[], t: number, k = 0.18) => Math.exp(-since(list, t) / k);
export const beatPulse = (t: number, k = 0.16) => pulse(AUDIO.beats, t, k);
export const barPulse = (t: number, k = 0.3) => pulse(AUDIO.downbeats, t, k);
export const bassHit = (t: number, k = 0.2) => pulse(AUDIO.bassOnsets, t, k);
export const hitPulse = (t: number, k = 0.12) => pulse(AUDIO.hits, t, k);
export const beatCount = (t: number) => lastIdx(AUDIO.beats, t);
export const barCount = (t: number) => lastIdx(AUDIO.downbeats, t);
/** beat phase 0..1 within current beat */
export const beatPhase = (t: number) => {
  const i = lastIdx(AUDIO.beats, t);
  if (i < 0 || i >= AUDIO.beats.length - 1) return 0;
  return (t - AUDIO.beats[i]) / (AUDIO.beats[i + 1] - AUDIO.beats[i]);
};
