import React from "react";
import { AbsoluteFill } from "remotion";

export type SP = { t: number; d: number; T: number };
export type SceneFC = React.FC<SP>;

export const Svg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...style }}>
    {children}
  </svg>
);

export const Fill: React.FC<{ bg?: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ bg, children, style }) => (
  <AbsoluteFill style={{ background: bg, overflow: "hidden", ...style }}>{children}</AbsoluteFill>
);

/** camera wrapper: zoom/rotate/translate around a pivot */
export const Cam: React.FC<{ z?: number; r?: number; x?: number; y?: number; px?: number; py?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ z = 1, r = 0, x = 0, y = 0, px = 540, py = 960, children, style }) => (
  <AbsoluteFill style={{ transformOrigin: `${px}px ${py}px`, transform: `translate(${x}px,${y}px) rotate(${r}deg) scale(${z})`, ...style }}>{children}</AbsoluteFill>
);

export const Glow: React.FC<{ cx: number; cy: number; r: number; color: string; o?: number; id: string }> = ({ cx, cy, r, color, o = 0.6, id }) => (
  <>
    <defs>
      <radialGradient id={id}>
        <stop offset="0" stopColor={color} stopOpacity={o} />
        <stop offset="1" stopColor={color} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} />
  </>
);
