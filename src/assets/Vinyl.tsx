import React from "react";
import { C } from "../lib/constants";
import { deg } from "../lib/math";
import { useUid } from "./util";

/** Three-comma tomoe crest. Origin center, radius R. */
export const Tomoe: React.FC<{ x?: number; y?: number; R: number; rot?: number; fill?: string; ring?: string | null; count?: number }> = ({
  x = 0, y = 0, R, rot = 0, fill = C.ink, ring = null, count = 3,
}) => {
  const comma = (a0: number) => {
    const head = [Math.cos(a0) * R * 0.4, Math.sin(a0) * R * 0.4] as const;
    const outer: string[] = [];
    const inner: string[] = [];
    const N = 30;
    for (let i = 0; i <= N; i++) {
      const s = i / N;
      const a = a0 + s * 2.35;
      const rc = R * (0.4 + 0.52 * Math.pow(s, 0.8));
      const w = R * 0.29 * Math.pow(1 - s, 1.15);
      outer.push(`${(Math.cos(a) * (rc + w)).toFixed(1)},${(Math.sin(a) * (rc + w)).toFixed(1)}`);
      inner.push(`${(Math.cos(a) * (rc - w)).toFixed(1)},${(Math.sin(a) * (rc - w)).toFixed(1)}`);
    }
    return (
      <g>
        <circle cx={head[0]} cy={head[1]} r={R * 0.29} fill={fill} />
        <path d={`M${outer.join(" L")} L${inner.reverse().join(" L")} Z`} fill={fill} />
      </g>
    );
  };
  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      {ring && <circle r={R * 1.02} fill="none" stroke={ring} strokeWidth={R * 0.08} />}
      {Array.from({ length: count }).map((_, i) => (
        <g key={i}>{comma((i * 2 * Math.PI) / count)}</g>
      ))}
    </g>
  );
};

/** Circular text along a ring. */
export const RingText: React.FC<{ r: number; text: string; size: number; fill: string; font: string; rot?: number; spacing?: number }> = ({ r, text, size, fill, font, rot = 0, spacing = 4 }) => {
  const uid = useUid("ring");
  return (
    <g transform={`rotate(${rot})`}>
      <defs>
        <path id={uid} d={`M0,${-r} A${r},${r} 0 1,1 -0.01,${-r} Z`} />
      </defs>
      <text fontFamily={font} fontSize={size} fill={fill} letterSpacing={spacing}>
        <textPath href={`#${uid}`}>{text}</textPath>
      </text>
    </g>
  );
};

/** Vinyl record seen from the top. rot in degrees. Sheen stays fixed while the disc spins. */
export const Vinyl: React.FC<{
  x?: number; y?: number; R: number; rot: number; label?: string; label2?: string; disc?: string; groove?: string;
  title?: string; font?: string; crack?: number; warp?: number;
}> = ({ x = 0, y = 0, R, rot, label = C.red, label2 = C.blue, disc = "#0d0b0c", groove = "#2a2526", title = "JAZZ SAMURAI • SIDE A • 侍 • ", font = "JS Bungee", crack = 0, warp = 0 }) => {
  const uid = useUid("vin");
  const rings = [];
  for (let k = 0; k < 46; k++) {
    const r = R * (0.36 + 0.61 * (k / 45));
    rings.push(<circle key={k} r={r} fill="none" stroke={k % 9 === 0 ? "#050404" : groove} strokeWidth={k % 9 === 0 ? 3 : 1.2} opacity={0.9} />);
  }
  const cracks = [];
  if (crack > 0) {
    for (let i = 0; i < 7; i++) {
      const a = i * 0.9 + 0.3;
      let px = Math.cos(a) * R * 0.34, py = Math.sin(a) * R * 0.34;
      let d = `M${px.toFixed(1)},${py.toFixed(1)}`;
      const segs = 7;
      for (let j = 1; j <= segs * crack; j++) {
        const rr = R * (0.34 + (0.66 * j) / segs);
        const aa = a + Math.sin(i * 7 + j * 3.1) * 0.12;
        px = Math.cos(aa) * rr; py = Math.sin(aa) * rr;
        d += ` L${px.toFixed(1)},${py.toFixed(1)}`;
      }
      cracks.push(<path key={i} d={d} stroke={C.cyan} strokeWidth={5} fill="none" strokeLinejoin="bevel" />);
    }
  }
  return (
    <g transform={`translate(${x},${y})`}>
      <defs>
        <radialGradient id={uid + "s"} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.3" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.75" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={`scale(1,${1 - warp * 0.25}) skewX(${warp * 8})`}>
        <circle r={R} fill={disc} />
        <g transform={`rotate(${rot})`}>
          {rings}
          <circle r={R * 0.34} fill={label} />
          <circle r={R * 0.34} fill="none" stroke={label2} strokeWidth={R * 0.03} />
          <Tomoe R={R * 0.15} fill={C.ink} rot={0} />
          <RingText r={R * 0.255} text={title.repeat(2)} size={R * 0.045} fill={C.paper} font={font} spacing={R * 0.006} />
          <circle r={R * 0.022} fill={C.paper} />
          <circle cx={R * 0.8} cy={0} r={R * 0.012} fill="#3b3434" />
        </g>
        {/* fixed sheen wedges */}
        <path d={`M0,0 L${R * Math.cos(-0.9)},${R * Math.sin(-0.9)} A${R},${R} 0 0,1 ${R * Math.cos(-0.5)},${R * Math.sin(-0.5)} Z`} fill={`url(#${uid}s)`} />
        <path d={`M0,0 L${R * Math.cos(2.24)},${R * Math.sin(2.24)} A${R},${R} 0 0,1 ${R * Math.cos(2.64)},${R * Math.sin(2.64)} Z`} fill={`url(#${uid}s)`} />
        {cracks}
      </g>
    </g>
  );
};

/** Tonearm with pivot at (px,py); arm angle in degrees (0 = pointing down). */
export const Tonearm: React.FC<{ px: number; py: number; angle: number; s?: number; color?: string }> = ({ px, py, angle, s = 1, color = C.bone }) => (
  <g transform={`translate(${px},${py}) scale(${s}) rotate(${angle})`}>
    <circle r={46} fill={C.coal} stroke={color} strokeWidth={6} />
    <circle r={20} fill={color} />
    <rect x={-9} y={-110} width={18} height={70} rx={6} fill={C.coal} />
    <path d="M0,0 L0,420 Q0,470 -40,500" stroke={color} strokeWidth={14} fill="none" strokeLinecap="round" />
    <rect x={-74} y={488} width={64} height={34} rx={6} fill={color} transform="rotate(-38 -40 500)" />
    <rect x={-60} y={512} width={14} height={18} fill={C.red} transform="rotate(-38 -40 500)" />
  </g>
);

/** Top-down turntable deck. */
export const Turntable: React.FC<{ x: number; y: number; s?: number; rot: number; arm?: number; body?: string; label?: string }> = ({ x, y, s = 1, rot, arm = 22, body = C.coal, label = C.red }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-470} y={-380} width={940} height={760} rx={36} fill={body} stroke="#000" strokeWidth={6} />
    <rect x={-450} y={-360} width={900} height={720} rx={28} fill="none" stroke="#3a3030" strokeWidth={3} />
    <circle cx={-60} cy={0} r={345} fill="#1b1617" />
    <Vinyl x={-60} y={0} R={330} rot={rot} label={label} />
    <Tonearm px={330} py={-250} angle={arm} s={0.95} />
    <rect x={360} y={80} width={40} height={230} rx={10} fill="#140f10" />
    <rect x={364} y={170 + Math.sin(deg(rot) * 0.0001) * 10} width={32} height={30} rx={4} fill={C.bone} />
    <circle cx={-400} cy={310} r={30} fill={C.red} />
    <circle cx={-320} cy={318} r={18} fill={C.blue} />
  </g>
);
