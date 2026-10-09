import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { C } from "./lib/constants";
import { clamp, easeIn, easeInOut, easeOut, easeOutBounce, hash } from "./lib/math";

export type Tr =
  | "cut" | "flash" | "slash" | "ink" | "iris" | "shutter" | "blinds" | "shoji" | "zoom" | "spin"
  | "drop" | "glitch" | "scratch" | "paper" | "push" | "pushUp" | "burn";

const L: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <AbsoluteFill style={{ overflow: "hidden", ...style }}>{children}</AbsoluteFill>
);

export const TransitionView: React.FC<{ kind: Tr; p: number; A: React.ReactNode; B: React.ReactNode; T: number }> = ({ kind, p: p0, A, B, T }) => {
  const p = clamp(p0);
  const e = easeInOut(p);
  switch (kind) {
    case "flash":
      return (
        <>
          <L>{B}</L>
          <AbsoluteFill style={{ background: C.paper, opacity: 1 - easeOut(p) }} />
        </>
      );
    case "slash": {
      const off = easeIn(p) * 900;
      const line = "polygon(0 0, 100% 0, 100% 43%, 0 57%)";
      const line2 = "polygon(0 57%, 100% 43%, 100% 100%, 0 100%)";
      return (
        <>
          <L>{B}</L>
          <L style={{ clipPath: line, transform: `translate(${-off * 0.6}px, ${-off}px)` }}>{A}</L>
          <L style={{ clipPath: line2, transform: `translate(${off * 0.6}px, ${off}px)` }}>{A}</L>
          <AbsoluteFill style={{ opacity: 1 - p }}>
            <div style={{ position: "absolute", left: -200, top: 960 - 8, width: 1500, height: 16, background: C.paper, transform: "rotate(-14.6deg)", boxShadow: `0 0 40px ${C.cyan}` }} />
          </AbsoluteFill>
        </>
      );
    }
    case "ink": {
      const s = easeIn(p) * 420;
      const m = `url(${staticFile("tex/splat2.png")})`;
      return (
        <>
          <L>{A}</L>
          <L style={{ WebkitMaskImage: m, maskImage: m, WebkitMaskSize: `${s}%`, maskSize: `${s}%`, WebkitMaskPosition: "center", maskPosition: "center", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat" }}>{B}</L>
        </>
      );
    }
    case "iris":
      return (
        <>
          <L>{A}</L>
          <L style={{ clipPath: `circle(${easeIn(p) * 120}% at 50% 48%)` }}>{B}</L>
        </>
      );
    case "shutter":
    case "blinds": {
      const n = 12;
      const dir = kind === "shutter" ? "180deg" : "90deg";
      const band = kind === "shutter" ? 1920 / n : 1080 / n;
      const g = `repeating-linear-gradient(${dir}, #000 0 ${e * band}px, transparent ${e * band}px ${band}px)`;
      return (
        <>
          <L>{A}</L>
          <L style={{ WebkitMaskImage: g, maskImage: g }}>{B}</L>
        </>
      );
    }
    case "shoji": {
      const o = easeInOut(p) * 560;
      return (
        <>
          <L>{B}</L>
          <L style={{ clipPath: "inset(0 50% 0 0)", transform: `translateX(${-o}px)` }}>{A}</L>
          <L style={{ clipPath: "inset(0 0 0 50%)", transform: `translateX(${o}px)` }}>{A}</L>
        </>
      );
    }
    case "zoom":
      return (
        <>
          <L style={{ transform: `scale(${0.6 + 0.4 * easeOut(p)})`, opacity: easeOut(p) }}>{B}</L>
          <L style={{ transform: `scale(${1 + easeIn(p) * 2.5})`, opacity: 1 - easeIn(p) }}>{A}</L>
        </>
      );
    case "spin":
      return p < 0.5 ? (
        <L style={{ transform: `rotate(${e * 180}deg) scale(${1 - p * 1.4})`, background: C.ink }}>{A}</L>
      ) : (
        <L style={{ transform: `rotate(${(e - 1) * 180}deg) scale(${(p - 0.5) * 1.4 + 0.3})` }}>{B}</L>
      );
    case "drop":
      return (
        <>
          <L>{A}</L>
          <L style={{ transform: `translateY(${-(1 - easeOutBounce(p)) * 1920}px)` }}>{B}</L>
        </>
      );
    case "glitch": {
      const fr = Math.floor(T * 30);
      const showB = hash(fr) < p * 1.2;
      const g = `repeating-linear-gradient(180deg, #000 0 ${20 + hash(fr + 1) * 80}px, transparent 0 ${60 + hash(fr + 2) * 120}px)`;
      return (
        <>
          <L>{showB ? B : A}</L>
          <L style={{ WebkitMaskImage: g, maskImage: g, transform: `translateX(${(hash(fr + 3) - 0.5) * 120}px)`, filter: "contrast(1.5) saturate(1.7) brightness(1.15)" }}>{showB ? A : B}</L>
        </>
      );
    }
    case "scratch": {
      const w = Math.sin(p * Math.PI * 3);
      const showA = w > 0 && p < 0.8;
      return (
        <L style={{ transform: `translateX(${w * 90 * (1 - p)}px) skewX(${w * 6 * (1 - p)}deg)`, filter: p < 0.8 ? "contrast(1.3) saturate(1.4)" : undefined }}>
          {showA ? A : B}
        </L>
      );
    }
    case "paper": {
      const y = (1 - easeInOut(p)) * 2050;
      const pts: string[] = [];
      for (let i = 0; i <= 24; i++) pts.push(`${(i / 24) * 100}% ${y + (hash(i * 7) - 0.5) * 60}px`);
      return (
        <>
          <L>{A}</L>
          <L style={{ clipPath: `polygon(${pts.join(",")}, 100% 100%, 0 100%)` }}>{B}</L>
        </>
      );
    }
    case "push":
      return (
        <>
          <L style={{ transform: `translateX(${-e * 1080}px)` }}>{A}</L>
          <L style={{ transform: `translateX(${(1 - e) * 1080}px)` }}>{B}</L>
        </>
      );
    case "pushUp":
      return (
        <>
          <L style={{ transform: `translateY(${-e * 1920}px)` }}>{A}</L>
          <L style={{ transform: `translateY(${(1 - e) * 1920}px)` }}>{B}</L>
        </>
      );
    case "burn": {
      const r = easeIn(p) * 1500;
      const g = `radial-gradient(circle at 50% 55%, #000 ${r}px, transparent ${r + 160}px)`;
      return (
        <>
          <L>{A}</L>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, transparent ${r}px, ${C.hot} ${r + 40}px, ${C.red} ${r + 120}px, transparent ${r + 200}px)`, mixBlendMode: "screen" }} />
          <L style={{ WebkitMaskImage: g, maskImage: g }}>{B}</L>
        </>
      );
    }
    default:
      return <L>{B}</L>;
  }
};
