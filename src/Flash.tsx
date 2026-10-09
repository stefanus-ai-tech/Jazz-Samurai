import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { C } from "./lib/constants";
import { clamp, decay, n2 } from "./lib/math";
import { AUDIO, barPulse, bass, lastIdx, rms } from "./lib/audio";

/** Biggest hits get an anime-style impact frame (2 frames inverted, then an exposure blast). */
export const STRONG_IMPACTS = [15.38, 31.92, 116.8, 118.7, 120.2, 121.0, 123.0, 144.92, 202.0, 333.02];

const since = (list: number[], T: number) => {
  const i = lastIdx(list, T);
  return i < 0 ? 999 : T - list[i];
};

/** CSS filter for the scene layer at time T (impact frames). */
export const impactFilter = (T: number) => {
  const s = since(STRONG_IMPACTS, T);
  if (s < 1 / 15) return "grayscale(1) contrast(4) invert(1)";
  if (s < 0.2) return `contrast(${1.5 - s * 2}) saturate(${1.7 - s * 3}) brightness(${1.35 - s * 1.5})`;
  return undefined;
};

/** How strongly lyrics should split into red/cyan right now (0..1). */
export const aberration = (T: number, impacts: number[]) => clamp(decay(T, impacts[Math.max(0, lastIdx(impacts, T))] ?? -9, 0.12) * 1.4);

/** Bright, high-energy stretches where flares/leaks run hotter. */
const HOT: [number, number][] = [[31.9, 52.6], [95.3, 107], [116.7, 124.4], [140, 146.8], [202, 213.4], [233.2, 244.5], [278.2, 289.6], [333, 346.8]];
const hotness = (T: number) => (HOT.some(([a, b]) => T >= a && T < b) ? 1 : 0);

const Flare: React.FC<{ y: number; p: number; color: string }> = ({ y, p, color }) => {
  if (p <= 0 || p >= 1) return null;
  const o = Math.sin(p * Math.PI);
  return (
    <>
      <div style={{ position: "absolute", left: -200, right: -200, top: y - 3, height: 6, background: `linear-gradient(90deg, transparent, ${color} 30%, #fff 50%, ${color} 70%, transparent)`, opacity: o, mixBlendMode: "screen", transform: `scaleX(${0.6 + p * 0.8})` }} />
      <div style={{ position: "absolute", left: -200, right: -200, top: y - 40, height: 80, background: `radial-gradient(ellipse closest-side, ${color}, transparent)`, opacity: o * 0.45, mixBlendMode: "screen" }} />
      <div style={{ position: "absolute", left: 540 - 90, top: y - 90, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, #fff 0%, ${color} 25%, transparent 70%)`, opacity: o * 0.8, mixBlendMode: "screen" }} />
    </>
  );
};

/** Global flash layer: downbeat exposure pops, drifting light leaks, anamorphic flares on hits. */
export const FlashLayer: React.FC<{ T: number; impacts: number[] }> = ({ T, impacts }) => {
  const hot = hotness(T);
  const pop = barPulse(T, 0.16) * (0.08 + 0.12 * hot);
  const leakA = 0.12 + 0.25 * rms(T) + 0.15 * hot;
  const lx = 300 + n2("lkx", 0, T * 0.07) * 500, ly = 500 + n2("lky", 0, T * 0.05) * 700;
  const lx2 = 700 + n2("lkx2", 1, T * 0.06) * 500, ly2 = 1300 + n2("lky2", 1, T * 0.05) * 600;
  const ii = lastIdx(impacts, T);
  const fp = ii >= 0 ? (T - impacts[ii]) / 0.45 : -1;
  const fy = ii >= 0 ? 520 + ((ii * 397) % 880) : 0;
  const di = lastIdx(AUDIO.downbeats, T);
  const dp = hot && di >= 0 ? (T - AUDIO.downbeats[di]) / 0.5 : -1;
  const dy = di >= 0 ? 600 + ((di * 211) % 700) : 0;
  const leak = (x: number, y: number, col: string, o: number, size: number) => (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, opacity: o, mixBlendMode: "screen",
      backgroundColor: col, WebkitMaskImage: `url(${staticFile("tex/leak.png")})`, maskImage: `url(${staticFile("tex/leak.png")})`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" }} />
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {leak(lx, ly, C.hot, leakA, 1500)}
      {leak(lx2, ly2, C.cyan, leakA * 0.8, 1300)}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(255,240,220,${pop.toFixed(3)}), transparent 70%)`, mixBlendMode: "screen" }} />
      <Flare y={fy} p={fp} color={C.cyan} />
      {dp > 0 && dp < 1 && <Flare y={dy} p={dp} color={C.hot} />}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, transparent 52%, rgba(0,0,0,${(0.15 + bass(T) * 0.2).toFixed(3)}) 100%)` }} />
    </AbsoluteFill>
  );
};
