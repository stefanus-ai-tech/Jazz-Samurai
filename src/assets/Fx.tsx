import React from "react";
import { staticFile } from "remotion";
import { C } from "../lib/constants";
import { ff, FontKey } from "../lib/fonts";
import { rr } from "../lib/math";
import { useUid } from "./util";

/* ---------- SVG fx (use inside a 1080x1920 svg) ---------- */

export const Rays: React.FC<{ cx?: number; cy?: number; n?: number; rot?: number; c1?: string; c2?: string; R?: number }> = ({ cx = 540, cy = 960, n = 28, rot = 0, c1 = C.red, c2 = C.ink, R = 2400 }) => (
  <g transform={`translate(${cx},${cy}) rotate(${rot})`}>
    <circle r={R} fill={c2} />
    {Array.from({ length: n }).map((_, i) => {
      const a0 = (i / n) * Math.PI * 2;
      const a1 = a0 + Math.PI / n;
      return <path key={i} d={`M0,0 L${Math.cos(a0) * R},${Math.sin(a0) * R} L${Math.cos(a1) * R},${Math.sin(a1) * R} Z`} fill={c1} />;
    })}
  </g>
);

export const SpeedLines: React.FC<{ cx?: number; cy?: number; n?: number; inner?: number; color?: string; seed?: number; t?: number; opacity?: number }> = ({
  cx = 540, cy = 960, n = 90, inner = 420, color = C.ink, seed = 1, t = 0, opacity = 1,
}) => {
  const fr = Math.floor(t * 12);
  return (
    <g transform={`translate(${cx},${cy})`} opacity={opacity}>
      {Array.from({ length: n }).map((_, i) => {
        const a = rr(seed + fr, i, 0, Math.PI * 2);
        const w = rr(seed + fr, i + 300, 0.004, 0.018);
        const r0 = inner * rr(seed + fr, i + 600, 0.85, 1.6);
        const R = 2000;
        return <path key={i} d={`M${Math.cos(a) * r0},${Math.sin(a) * r0} L${Math.cos(a - w) * R},${Math.sin(a - w) * R} L${Math.cos(a + w) * R},${Math.sin(a + w) * R} Z`} fill={color} />;
      })}
    </g>
  );
};

export const Stars: React.FC<{ n?: number; seed?: number; t?: number; color?: string; h?: number; stretch?: number }> = ({ n = 120, seed = 3, t = 0, color = C.paper, h = 1920, stretch = 0 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const x = rr(seed, i, 0, 1080), y = rr(seed, i + 500, 0, h);
      const tw = 0.5 + 0.5 * Math.sin(t * rr(seed, i + 900, 1, 5) + i);
      const r = rr(seed, i + 1300, 1, 3.6);
      if (stretch > 0) {
        const dx = x - 540, dy = y - 960;
        const L = Math.hypot(dx, dy) + 1;
        return <line key={i} x1={x} y1={y} x2={x + (dx / L) * stretch * L * 0.5} y2={y + (dy / L) * stretch * L * 0.5} stroke={i % 5 ? color : C.cyan} strokeWidth={r} opacity={0.8} />;
      }
      return <circle key={i} cx={x} cy={y} r={r} fill={i % 7 ? color : C.cyan} opacity={0.3 + tw * 0.7} />;
    })}
  </g>
);

export const Rain: React.FC<{ t: number; n?: number; color?: string; angle?: number; speed?: number; seed?: number; len?: number }> = ({ t, n = 120, color = C.cyan, angle = 14, speed = 2400, seed = 8, len = 90 }) => (
  <g transform={`rotate(${angle} 540 960)`}>
    {Array.from({ length: n }).map((_, i) => {
      const x = rr(seed, i, -300, 1380);
      const y = ((rr(seed, i + 300, 0, 2400) + t * speed * rr(seed, i + 600, 0.7, 1.3)) % 2400) - 240;
      return <line key={i} x1={x} y1={y} x2={x} y2={y + len} stroke={color} strokeWidth={rr(seed, i + 900, 1.5, 4)} opacity={0.6} />;
    })}
  </g>
);

export const Embers: React.FC<{ t: number; n?: number; seed?: number; colors?: string[]; rise?: number; size?: number }> = ({ t, n = 50, seed = 11, colors = [C.hot, C.red, C.cyan], rise = 160, size = 1 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const x = rr(seed, i, 0, 1080) + Math.sin(t * 1.3 + i) * 30;
      const y = 1980 - ((rr(seed, i + 100, 0, 2100) + t * rise * rr(seed, i + 200, 0.6, 1.6)) % 2100);
      return <circle key={i} cx={x} cy={y} r={rr(seed, i + 300, 2, 7) * size} fill={colors[i % colors.length]} opacity={0.4 + 0.6 * Math.abs(Math.sin(t * 3 + i))} />;
    })}
  </g>
);

export const Shock: React.FC<{ cx: number; cy: number; p: number; R?: number; color?: string; width?: number }> = ({ cx, cy, p, R = 900, color = C.paper, width = 40 }) =>
  p <= 0 || p >= 1 ? null : <circle cx={cx} cy={cy} r={R * p} fill="none" stroke={color} strokeWidth={width * (1 - p)} opacity={1 - p} />;

/** Japanese wave-scale (seigaiha) pattern */
export const Seigaiha: React.FC<{ w?: number; h?: number; r?: number; c1?: string; c2?: string; bg?: string; dx?: number; dy?: number; opacity?: number }> = ({
  w = 1080, h = 1920, r = 60, c1 = C.blue, c2 = C.paper, bg = C.navy, dx = 0, dy = 0, opacity = 1,
}) => {
  const uid = useUid("sei");
  const rings = [1, 0.78, 0.56, 0.34];
  const scallop = (cx: number, cy: number, k: number) => (
    <g key={`${cx}-${cy}-${k}`}>
      {rings.map((q, j) => (
        <circle key={j} cx={cx} cy={cy} r={r * q} fill={j % 2 ? bg : c1} stroke={c2} strokeWidth={r * 0.05} />
      ))}
    </g>
  );
  return (
    <g opacity={opacity}>
      <defs>
        <pattern id={uid} width={r * 2} height={r} patternUnits="userSpaceOnUse" x={dx} y={dy}>
          <rect width={r * 2} height={r} fill={bg} />
          {scallop(r, 0, 0)}
          {scallop(0, r * 0.5, 1)}
          {scallop(r * 2, r * 0.5, 2)}
          {scallop(r, r, 3)}
        </pattern>
      </defs>
      <rect width={w} height={h} fill={`url(#${uid})`} />
    </g>
  );
};

/* ---------- HTML texture layers (absolute) ---------- */

type TexProps = { src: string; color: string; x: number; y: number; w: number; h: number; rot?: number; opacity?: number; blend?: React.CSSProperties["mixBlendMode"]; clip?: string; style?: React.CSSProperties };

/** Colored shape from a white/alpha PNG mask in public/tex. (x,y) = center. */
export const Tex: React.FC<TexProps> = ({ src, color, x, y, w, h, rot = 0, opacity = 1, blend, clip, style }) => (
  <div
    style={{
      position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, opacity,
      transform: `rotate(${rot}deg)`, mixBlendMode: blend, clipPath: clip,
      ...style,
    }}
  >
    <div
      style={{
        width: "100%", height: "100%", backgroundColor: color,
        WebkitMaskImage: `url(${staticFile(`tex/${src}`)})`, maskImage: `url(${staticFile(`tex/${src}`)})`,
        WebkitMaskSize: "100% 100%", maskSize: "100% 100%",
      }}
    />
  </div>
);

export const Smoke: React.FC<{ t: number; n?: number; color?: string; seed?: number; opacity?: number; y?: number; spread?: number; size?: number; rise?: number }> = ({
  t, n = 6, color = C.blue, seed = 1, opacity = 0.5, y = 1300, spread = 600, size = 900, rise = 40,
}) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const x = 540 + rr(seed, i, -spread, spread) + Math.sin(t * 0.3 + i) * 80;
      const yy = y + rr(seed, i + 10, -spread * 0.6, spread * 0.6) - t * rise * rr(seed, i + 20, 0.5, 1.5);
      const s = size * rr(seed, i + 30, 0.7, 1.4) * (1 + t * 0.03);
      return <Tex key={i} src={`smoke${i % 3}.png`} color={color} x={x} y={yy} w={s} h={s} rot={t * rr(seed, i + 40, -12, 12) + i * 60} opacity={opacity * rr(seed, i + 50, 0.5, 1)} />;
    })}
  </>
);

/** Ensō drawn clockwise as p goes 0..1 */
export const Enso: React.FC<{ x: number; y: number; size: number; color: string; p: number; rot?: number }> = ({ x, y, size, color, p, rot = 0 }) => (
  <div
    style={{
      position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, transform: `rotate(${rot}deg)`,
      WebkitMaskImage: `conic-gradient(#000 ${p * 360}deg, transparent ${p * 360 + 0.5}deg)`,
      maskImage: `conic-gradient(#000 ${p * 360}deg, transparent ${p * 360 + 0.5}deg)`,
    }}
  >
    <Tex src="enso.png" color={color} x={size / 2} y={size / 2} w={size} h={size} />
  </div>
);

export const Kanji: React.FC<{ ch: string; x: number; y: number; size: number; color: string; font?: FontKey; opacity?: number; rot?: number; vertical?: boolean; stroke?: string; blur?: number; spacing?: number; scaleX?: number }> = ({
  ch, x, y, size, color, font = "jpBrush", opacity = 1, rot = 0, vertical = false, stroke, blur = 0, spacing = 0, scaleX = 1,
}) => (
  <div
    style={{
      position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scaleX(${scaleX})`,
      fontFamily: ff(font), fontSize: size, lineHeight: 1, color: stroke ? "transparent" : color, opacity,
      writingMode: vertical ? "vertical-rl" : undefined, whiteSpace: "nowrap", letterSpacing: spacing,
      WebkitTextStroke: stroke ? `${Math.max(2, size * 0.012)}px ${stroke}` : undefined,
      filter: blur ? `blur(${blur}px)` : undefined,
    }}
  >
    {ch}
  </div>
);

export const Paper: React.FC<{ opacity?: number; blend?: React.CSSProperties["mixBlendMode"] }> = ({ opacity = 1, blend = "multiply" }) => (
  <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${staticFile("tex/paper.jpg")})`, backgroundSize: "1024px 1024px", opacity, mixBlendMode: blend }} />
);

export const Halftone: React.FC<{ color?: string; size?: number; dot?: number; opacity?: number; fade?: string; angle?: number }> = ({ color = C.ink, size = 18, dot = 32, opacity = 1, fade, angle = 0 }) => (
  <div
    style={{
      position: "absolute", inset: -200, opacity, transform: `rotate(${angle}deg)`,
      backgroundImage: `radial-gradient(circle, ${color} ${dot}%, transparent ${dot + 2}%)`, backgroundSize: `${size}px ${size}px`,
      WebkitMaskImage: fade, maskImage: fade,
    }}
  />
);
