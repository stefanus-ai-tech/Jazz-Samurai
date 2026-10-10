import React from "react";
import { C } from "../lib/constants";
import { useUid } from "./util";

/**
 * Detailed katana, horizontal, origin at the tsuba (guard). Blade points to +x.
 * `sheath` 0 = fully drawn, 1 = fully sheathed (blade slides into a saya that sits on +x).
 * `glint` 0..1 sweeps a highlight along the blade.
 */
export const Katana: React.FC<{
  x?: number; y?: number; rot?: number; s?: number; L?: number;
  glint?: number; sheath?: number; showSaya?: boolean; wrap?: string; edge?: string;
}> = ({ x = 0, y = 0, rot = 0, s = 1, L = 760, glint = -1, sheath = 0, showSaya = false, wrap = C.red, edge = C.cyan }) => {
  const uid = useUid("kat");
  const sori = 26;
  const N = 24;
  const spine: string[] = [];
  const edgeP: string[] = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const xx = 30 + u * (L - 70);
    const yy = -sori * u * u;
    const w = 36 - 10 * u;
    spine.push(`${xx.toFixed(1)},${(yy - w / 2).toFixed(1)}`);
    edgeP.push(`${xx.toFixed(1)},${(yy + w / 2).toFixed(1)}`);
  }
  const tipY = -sori;
  const blade = `M${spine.join(" L")} L${L},${tipY - 10} L${edgeP[N]} L${edgeP.slice().reverse().join(" L")} Z`;
  const hamon = Array.from({ length: 40 }, (_, i) => {
    const u = i / 39;
    const xx = 34 + u * (L - 90);
    const yy = -sori * u * u + 6 + Math.sin(u * 46) * 3.2;
    return `${i ? "L" : "M"}${xx.toFixed(1)},${yy.toFixed(1)}`;
  }).join(" ");
  const off = sheath * (L - 40);
  const gx = 30 + glint * (L + 200) - 100;
  const sayaPath = `M40,-24 Q${L / 2},${-sori * 0.25 - 26} ${L + 6},${-sori - 22} L${L + 34},${-sori - 6} L${L + 10},${-sori + 18} Q${L / 2},${-sori * 0.25 + 22} 40,22 Z`;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <defs>
        <linearGradient id={uid + "b"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9dde6" />
          <stop offset="0.45" stopColor="#8d96a8" />
          <stop offset="0.55" stopColor="#f4f6fb" />
          <stop offset="1" stopColor="#b6bdcc" />
        </linearGradient>
        <linearGradient id={uid + "g"} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={uid + "c"}><path d={blade} /></clipPath>
        <pattern id={uid + "w"} width="34" height="40" patternUnits="userSpaceOnUse" x="0" y="-20">
          <rect width="34" height="40" fill={C.ink} />
          <path d="M0,20 L17,2 L34,20 L17,38 Z" fill={wrap} />
          <path d="M17,6 L28,20 L17,34 L6,20 Z" fill={C.ink} opacity="0.55" />
        </pattern>
      </defs>
      <g transform={`translate(${off},0)`}>
        <path d={blade} fill={`url(#${uid}b)`} />
        <path d={hamon} stroke={edge} strokeWidth={2.5} fill="none" opacity={0.75} />
        {glint >= 0 && glint <= 1 && (
          <g clipPath={`url(#${uid}c)`}>
            <rect x={gx} y={-80} width={200} height={140} fill={`url(#${uid}g)`} transform="skewX(-30)" />
          </g>
        )}
        <rect x={14} y={-22} width={26} height={42} rx={4} fill={C.red2} />
        <ellipse cx={4} cy={-1} rx={16} ry={62} fill={C.ink} stroke={C.red} strokeWidth={5} />
        <ellipse cx={4} cy={-1} rx={6} ry={30} fill={C.coal} />
        <rect x={-250} y={-22} width={244} height={42} rx={14} fill={`url(#${uid}w)`} />
        <rect x={-266} y={-24} width={26} height={46} rx={10} fill={C.ink} stroke={C.red} strokeWidth={3} />
        <circle cx={-80} cy={-1} r={9} fill={C.gold} opacity={0.8} />
      </g>
      {showSaya && (
        <g transform={`translate(${L - 40 + 8},0)`}>
          <path d={sayaPath} fill={C.ink} stroke={C.red} strokeWidth={4} />
          <rect x={52} y={-26} width={36} height={50} rx={5} fill={C.red} />
          <rect x={L * 0.35} y={-24} width={18} height={46} fill={C.blue} opacity={0.9} />
        </g>
      )}
    </g>
  );
};
