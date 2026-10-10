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

export const HalftoneRect: React.FC<{ x?: number; y?: number; w?: number; h?: number; r?: number; gap?: number; color?: string; angle?: number; opacity?: number }> = ({
  x = 0, y = 0, w = 1080, h = 1920, r = 7, gap = 22, color = C.ink, angle = 30, opacity = 1,
}) => {
  const uid = useUid("ht");
  return (
    <g opacity={opacity}>
      <defs>
        <pattern id={uid} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
          <circle cx={gap / 2} cy={gap / 2} r={r} fill={color} />
        </pattern>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${uid})`} />
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

export const Starburst: React.FC<{ cx: number; cy: number; r1: number; r2: number; n?: number; fill?: string; stroke?: string; rot?: number; seed?: number }> = ({ cx, cy, r1, r2, n = 18, fill = C.paper, stroke = C.ink, rot = 0, seed = 2 }) => {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2;
    const r = i % 2 ? r1 : r2 * rr(seed, i, 0.8, 1.15);
    pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`);
  }
  return <polygon transform={`translate(${cx},${cy}) rotate(${rot})`} points={pts.join(" ")} fill={fill} stroke={stroke} strokeWidth={10} strokeLinejoin="round" />;
};

/** Hypnotic op-art rings */
export const Hypno: React.FC<{ cx?: number; cy?: number; rot: number; n?: number; c1?: string; c2?: string; zoom?: number }> = ({ cx = 540, cy = 960, rot, n = 26, c1 = C.red, c2 = C.ink, zoom = 0 }) => (
  <g transform={`translate(${cx},${cy}) rotate(${rot})`}>
    {Array.from({ length: n }).map((_, i) => {
      const k = n - i;
      const r = ((k + (zoom % 1)) / n) * 1500;
      return <circle key={i} cx={Math.sin(k * 0.6 + rot * 0.02) * 18} cy={0} r={r} fill={k % 2 ? c1 : c2} />;
    })}
  </g>
);

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

/** Brush stroke revealed left→right (reveal 0..1). */
export const Brush: React.FC<{ x: number; y: number; w: number; h: number; color: string; reveal?: number; rot?: number; variant?: number; opacity?: number; flip?: boolean }> = ({
  x, y, w, h, color, reveal = 1, rot = 0, variant = 0, opacity = 1, flip = false,
}) => (
  <Tex
    src={`brush${variant % 3}.png`} color={color} x={x} y={y} w={w} h={h} rot={rot} opacity={opacity}
    clip={`inset(0 ${flip ? 0 : (1 - reveal) * 100}% 0 ${flip ? (1 - reveal) * 100 : 0}%)`}
    style={flip ? { transform: `rotate(${rot}deg) scaleX(-1)` } : undefined}
  />
);

export const Splat: React.FC<{ x: number; y: number; size: number; color: string; v?: number; rot?: number; p?: number; opacity?: number }> = ({ x, y, size, color, v = 0, rot = 0, p = 1, opacity = 1 }) => {
  const k = Math.min(1, p);
  const s = size * (0.2 + 0.8 * (1 - Math.pow(1 - k, 4)));
  return <Tex src={`splat${v % 4}.png`} color={color} x={x} y={y} w={s} h={s} rot={rot} opacity={opacity} />;
};

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
