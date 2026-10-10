import React from "react";
import { C } from "../lib/constants";
import { n2, poly, rnd, rr } from "../lib/math";
import { Tomoe } from "./Vinyl";
import { useUid } from "./util";

export const Torii: React.FC<{ x: number; y: number; s?: number; fill?: string; top?: string; opacity?: number }> = ({ x, y, s = 1, fill = C.red, top = C.ink, opacity = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={opacity}>
    <path d="M-150,0 L-128,0 L-118,-330 L-142,-330 Z" fill={fill} />
    <path d="M150,0 L128,0 L118,-330 L142,-330 Z" fill={fill} />
    <rect x={-190} y={-290} width={380} height={26} fill={fill} />
    <rect x={-12} y={-340} width={24} height={52} fill={fill} />
    <path d="M-215,-345 Q0,-330 215,-345 L208,-372 Q0,-356 -208,-372 Z" fill={fill} />
    <path d="M-235,-372 Q0,-358 235,-372 L240,-400 Q0,-382 -240,-400 Z" fill={top} />
    <rect x={-156} y={-8} width={44} height={10} fill={top} />
    <rect x={112} y={-8} width={44} height={10} fill={top} />
  </g>
);

export const Pagoda: React.FC<{ x: number; y: number; s?: number; tiers?: number; fill?: string; glow?: string | null }> = ({ x, y, s = 1, tiers = 5, fill = C.ink, glow = null }) => {
  const parts = [];
  let yy = 0;
  for (let i = 0; i < tiers; i++) {
    const w = 120 - i * 14;
    const h = 46 - i * 2;
    parts.push(<rect key={`b${i}`} x={-w * 0.55} y={yy - h} width={w * 1.1} height={h} fill={fill} />);
    if (glow) parts.push(<rect key={`g${i}`} x={-w * 0.3} y={yy - h * 0.7} width={w * 0.6} height={h * 0.32} fill={glow} opacity={0.85} />);
    yy -= h;
    const rw = w * 1.45;
    parts.push(<path key={`r${i}`} d={`M${-rw},${yy + 4} Q${-rw * 0.6},${yy - 6} ${-w * 0.45},${yy - 26} L${w * 0.45},${yy - 26} Q${rw * 0.6},${yy - 6} ${rw},${yy + 4} Q0,${yy - 8} ${-rw},${yy + 4} Z`} fill={fill} />);
    yy -= 26;
  }
  parts.push(<rect key="sp" x={-4} y={yy - 110} width={8} height={110} fill={fill} />);
  for (let k = 0; k < 6; k++) parts.push(<ellipse key={`k${k}`} cx={0} cy={yy - 20 - k * 14} rx={11} ry={3} fill={fill} />);
  return <g transform={`translate(${x},${y}) scale(${s})`}>{parts}</g>;
};

const SIGNS = ["侍", "夜", "酒", "音", "粋", "渋", "夢", "月", "鬼", "龍"];

/** Seeded skyline mixing towers, pagodas and vertical neon signs. Baseline at y. */
export const City: React.FC<{ y: number; seed: number; fill?: string; win?: string; win2?: string; scale?: number; offset?: number; neon?: boolean; t?: number; density?: number }> = ({
  y, seed, fill = C.ink, win = C.red, win2 = C.cyan, scale = 1, offset = 0, neon = true, t = 0, density = 1,
}) => {
  const items: React.ReactNode[] = [];
  let x = -200 - (offset % 2400);
  let i = 0;
  while (x < 1280 + 2400) {
    const kind = rnd(seed, i * 3);
    const w = rr(seed, i * 3 + 1, 90, 200) * scale;
    const h = rr(seed, i * 3 + 2, 260, 900) * scale;
    if (kind < 0.22) {
      items.push(<Pagoda key={i} x={x + w / 2} y={y} s={scale * rr(seed, i + 9, 0.9, 1.5)} tiers={3 + Math.floor(rnd(seed, i + 7) * 3)} fill={fill} glow={rnd(seed, i + 3) > 0.5 ? win : null} />);
    } else {
      items.push(<rect key={i} x={x} y={y - h} width={w} height={h} fill={fill} />);
      if (rnd(seed, i + 40) > 0.6) items.push(<rect key={`a${i}`} x={x + w * 0.45} y={y - h - 80 * scale} width={5 * scale} height={80 * scale} fill={fill} />);
      const cols = Math.max(2, Math.floor(w / (26 * scale)));
      const rows = Math.floor((h * 0.85) / (34 * scale));
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const k = rnd(seed + i, r * 31 + c);
          if (k < 0.62 * density) continue;
          const flick = n2(`w${seed}`, i * 3 + r, c + t * 0.6) > 0.55;
          items.push(<rect key={`w${i}-${r}-${c}`} x={x + 8 * scale + c * (w - 16 * scale) / cols} y={y - h + 20 * scale + r * 34 * scale} width={10 * scale} height={14 * scale} fill={k > 0.93 ? win2 : win} opacity={flick ? 0.25 : 0.9} />);
        }
      }
      if (neon && rnd(seed, i + 77) > 0.62) {
        const ch = SIGNS[Math.floor(rnd(seed, i + 5) * SIGNS.length)];
        const col = rnd(seed, i + 6) > 0.5 ? C.cyan : C.hot;
        const on = n2(`n${seed}`, i, t * 2) > -0.6;
        items.push(
          <g key={`n${i}`} opacity={on ? 1 : 0.3}>
            <rect x={x + w - 14 * scale} y={y - h * 0.8} width={54 * scale} height={190 * scale} fill={C.ink} stroke={col} strokeWidth={4 * scale} rx={6} />
            <text x={x + w + 13 * scale} y={y - h * 0.8 + 120 * scale} fontSize={64 * scale} fill={col} textAnchor="middle" fontFamily={`"JS JP Dela"`}>{ch}</text>
          </g>,
        );
      }
    }
    x += w + rr(seed, i + 99, 0, 40) * scale;
    i++;
  }
  return <g>{items}</g>;
};

/** Red Fuji (Hokusai's Fine Wind, Clear Morning), base centered at x,y. */
export const Fuji: React.FC<{ x: number; y: number; s?: number; body?: string; snow?: string; shade?: string }> = ({ x, y, s = 1, body = C.red2, snow = C.paper, shade = C.blood }) => {
  const mtn = "M-700,0 C-430,-120 -260,-380 -110,-640 L-70,-660 L-30,-648 L10,-664 L60,-650 L104,-640 C250,-380 430,-120 700,0 Z";
  const cap = "M-110,-640 L-70,-660 L-30,-648 L10,-664 L60,-650 L104,-640 C130,-590 150,-560 168,-530 L140,-540 L130,-500 L104,-528 L84,-470 L60,-520 L36,-480 L12,-530 L-14,-462 L-36,-520 L-60,-490 L-80,-538 L-108,-506 L-120,-546 L-160,-520 C-140,-570 -125,-610 -110,-640 Z";
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d={mtn} fill={body} />
      {Array.from({ length: 34 }).map((_, i) => {
        const xx = -560 + i * 34;
        return <path key={i} d={`M${xx},0 Q${xx * 0.6},${-200 - (i % 3) * 30} ${xx * 0.2},${-460 - (i % 4) * 20}`} stroke={shade} strokeWidth={5} fill="none" opacity={0.5} />;
      })}
      <path d={cap} fill={snow} />
      {Array.from({ length: 10 }).map((_, i) => (
        <path key={`c${i}`} d={`M${-90 + i * 22},${-640 + (i % 2) * 6} L${-96 + i * 24},${-560 + (i % 3) * 20}`} stroke="#b9c4d6" strokeWidth={4} opacity={0.6} />
      ))}
    </g>
  );
};

/** Hokusai-style curling wave breaking to the right. Anchored bottom-left at (x,y). t animates foam. */
export const GreatWave: React.FC<{ x: number; y: number; s?: number; t: number; body?: string; deep?: string; foam?: string }> = ({ x, y, s = 1, t, body = C.blue2, deep = C.navy, foam = C.paper }) => {
  const cx = 600, cy = -820, R = 300;
  const P = (a: number, r: number) => [cx + Math.cos(a) * r, cy - Math.sin(a) * r] as const;
  const a0 = Math.PI * 1.08, a1 = -Math.PI * 0.18;
  const outer: string[] = [];
  const N = 40;
  for (let i = 0; i <= N; i++) {
    const a = a0 + (a1 - a0) * (i / N);
    const [px, py] = P(a, R);
    outer.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  const inner: string[] = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const a = a1 + (Math.PI * 0.75 - a1) * u;
    const [px, py] = P(a, R * (0.6 - 0.22 * u));
    inner.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  const [lx, ly] = P(a0, R);
  const lip = P(a1, R * 0.8);
  const crescent = `M${outer.join(" L")} Q${lip[0] + 40},${lip[1] + 30} ${inner[0]} L${inner.join(" L")} Q${cx - 40},${cy + 40} ${cx - 120},${cy + 160} L${lx},${ly + 80} Z`;
  const bodyPath = `M-220,40 L-220,-200 C 60,-260 ${lx - 140},${ly + 380} ${lx},${ly} L${lx},${ly + 80} Q${cx - 60},${cy + 330} ${cx + 120},${cy + 470} C ${cx + 260},${cy + 560} 1100,-260 1320,-220 L1320,40 Z`;
  const claws: React.ReactNode[] = [];
  for (let i = 0; i < 16; i++) {
    const u = i / 15;
    const a = Math.PI * 0.62 + (a1 - Math.PI * 0.62) * u;
    const [px, py] = P(a, R + 6);
    const n = Math.cos(a), m = -Math.sin(a);
    const len = 46 + 22 * Math.sin(i * 1.9 + t * 5);
    const tx = px + n * len + m * len * 0.6, ty = py + m * len - n * len * 0.6;
    claws.push(<path key={i} d={`M${px - m * 14},${py + n * 14} Q${px + n * len * 0.9},${py + m * len * 0.9} ${tx},${ty} Q${px + n * len * 0.35},${py + m * len * 0.35} ${px + m * 14},${py - n * 14} Z`} fill={foam} />);
    claws.push(<circle key={`d${i}`} cx={tx} cy={ty} r={6 + (i % 3) * 3} fill={foam} />);
  }
  const lines: React.ReactNode[] = [];
  for (let k = 1; k <= 7; k++) {
    const o = k * 26;
    lines.push(<path key={k} d={`M-220,${-150 + o * 0.6} C 60,${-220 + o * 0.5} ${lx - 140 + o},${ly + 380 + o * 0.2} ${lx + o * 0.9},${ly + o * 0.5}`} stroke={k % 2 ? C.cyan : foam} strokeWidth={k % 2 ? 5 : 7} fill="none" opacity={0.6} />);
  }
  for (let k = 1; k <= 4; k++) {
    const pts: string[] = [];
    for (let i = 0; i <= 30; i++) {
      const a = a0 + (a1 - a0) * (i / 30);
      const [px, py] = P(a, R * (1 - k * 0.075));
      pts.push(`${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`);
    }
    lines.push(<path key={`c${k}`} d={pts.join(" ")} stroke={k % 2 ? foam : C.cyan} strokeWidth={6} fill="none" opacity={0.7} />);
  }
  const spray: React.ReactNode[] = [];
  for (let i = 0; i < 46; i++) {
    const px = cx + 120 + rr(3, i, -200, 420) + Math.sin(t * 2 + i) * 20;
    const py = cy - 200 + rr(4, i, -200, 300) + ((t * 140 + i * 40) % 260);
    spray.push(<circle key={i} cx={px} cy={py} r={rr(5, i, 3, 11)} fill={foam} opacity={0.9} />);
  }
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d={bodyPath} fill={body} />
      <path d={crescent} fill={C.blue} />
      {lines}
      {claws}
      {spray}
      <path d="M-220,40 L-220,-110 C 240,-170 700,-150 1320,-90 L1320,40 Z" fill={deep} />
      <path d="M-220,-110 C 240,-170 700,-150 1320,-90" stroke={foam} strokeWidth={8} fill="none" opacity={0.7} />
    </g>
  );
};

/** Seigaiha (blue ocean wave) pattern fill over a rect. */
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

export const Lantern: React.FC<{ x: number; y: number; s?: number; rot?: number; body?: string; ch?: string; glow?: number }> = ({ x, y, s = 1, rot = 0, body = C.red, ch = "音", glow = 1 }) => {
  const uid = useUid("lan");
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <defs>
        <radialGradient id={uid}>
          <stop offset="0" stopColor={C.hot} stopOpacity={0.55 * glow} />
          <stop offset="1" stopColor={C.hot} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle r={190} fill={`url(#${uid})`} />
      <line x1={0} y1={-190} x2={0} y2={-120} stroke={C.ink} strokeWidth={4} />
      <rect x={-46} y={-124} width={92} height={18} rx={4} fill={C.ink} />
      <ellipse rx={92} ry={112} fill={body} />
      {[-80, -54, -27, 0, 27, 54, 80].map((yy) => (
        <ellipse key={yy} cx={0} cy={yy} rx={92 * Math.sqrt(1 - (yy / 112) ** 2)} ry={4} fill="none" stroke={C.blood} strokeWidth={3} />
      ))}
      <text y={34} fontSize={92} textAnchor="middle" fontFamily={`"JS JP Yuji"`} fill={C.ink}>{ch}</text>
      <rect x={-46} y={106} width={92} height={18} rx={4} fill={C.ink} />
      <line x1={0} y1={124} x2={0} y2={170} stroke={C.ink} strokeWidth={5} />
    </g>
  );
};

/** Koi swimming toward +x in local space; body undulates with t. */
export const Koi: React.FC<{ x: number; y: number; rot: number; s?: number; t: number; body?: string; patch?: string; seed?: number }> = ({ x, y, rot, s = 1, t, body = C.paper, patch = C.red, seed = 1 }) => {
  const uid = useUid("koi");
  const L = 320;
  const top: [number, number][] = [];
  const bot: [number, number][] = [];
  const spine = (u: number) => Math.sin(u * 3.2 - t * 7) * 22 * u;
  for (let i = 0; i <= 24; i++) {
    const u = i / 24;
    const xx = L * (0.5 - u);
    const w = 54 * Math.pow(Math.sin(Math.min(1, u * 1.25 + 0.06) * Math.PI), 0.7) * (1 - u * 0.55);
    top.push([xx, spine(u) - w]);
    bot.push([xx, spine(u) + w]);
  }
  const tailY = spine(1);
  const outline = poly([...top, ...bot.reverse()]);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <defs><clipPath id={uid}><path d={outline} /></clipPath></defs>
      <path d={`M${-L * 0.45},${tailY} L${-L * 0.82},${tailY - 80 + Math.sin(t * 7) * 18} Q${-L * 0.68},${tailY} ${-L * 0.82},${tailY + 80 + Math.sin(t * 7) * 18} Z`} fill={patch} opacity={0.9} />
      <ellipse cx={L * 0.18} cy={spine(0.32) - 58} rx={44} ry={16} transform={`rotate(-30 ${L * 0.18} ${spine(0.32) - 58})`} fill={patch} opacity={0.75} />
      <ellipse cx={L * 0.18} cy={spine(0.32) + 58} rx={44} ry={16} transform={`rotate(30 ${L * 0.18} ${spine(0.32) + 58})`} fill={patch} opacity={0.75} />
      <path d={outline} fill={body} />
      <g clipPath={`url(#${uid})`}>
        {[0.1, 0.35, 0.62].map((u, k) => (
          <circle key={k} cx={L * (0.5 - u) + rr(seed, k, -20, 20)} cy={spine(u) + rr(seed, k + 4, -30, 30)} r={rr(seed, k + 8, 34, 62)} fill={patch} />
        ))}
      </g>
      <circle cx={L * 0.42} cy={spine(0.08) - 22} r={6} fill={C.ink} />
      <circle cx={L * 0.42} cy={spine(0.08) + 22} r={6} fill={C.ink} />
    </g>
  );
};

export const Bamboo: React.FC<{ x: number; base: number; h: number; w?: number; fill?: string; node?: string; sway?: number }> = ({ x, base, h, w = 46, fill = C.ink, node = C.red, sway = 0 }) => {
  const segs = Math.max(1, Math.floor(h / 150));
  const seg = h / segs;
  return (
    <g transform={`translate(${x},${base}) rotate(${sway})`}>
      {Array.from({ length: segs }).map((_, i) => (
        <g key={i}>
          <rect x={-w / 2} y={-(i + 1) * seg + 6} width={w} height={seg - 6} rx={w * 0.3} fill={fill} />
          <rect x={-w / 2 - 4} y={-(i + 1) * seg} width={w + 8} height={8} rx={4} fill={node} />
        </g>
      ))}
      <path d={`M0,${-h} q 60,-30 140,-10 q -70,20 -140,10 Z`} fill={fill} />
      <path d={`M0,${-h + 40} q -60,-40 -150,-20 q 80,26 150,20 Z`} fill={fill} />
    </g>
  );
};

/** Shamisen front view with 3 vibrating strings. vib 0..1 */
export const Shamisen: React.FC<{ x: number; y: number; s?: number; rot?: number; vib: number; t: number }> = ({ x, y, s = 1, rot = 0, vib, t }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-24} y={-1100} width={48} height={1060} rx={8} fill={C.ink} />
    <path d="M-34,-1180 L34,-1180 L28,-1090 L-28,-1090 Z" fill={C.ink} />
    {[-1160, -1130, -1100].map((py, i) => (
      <rect key={i} x={i % 2 ? 24 : -74} y={py - 8} width={50} height={16} rx={8} fill={C.red} />
    ))}
    <rect x={-170} y={-60} width={340} height={340} rx={40} fill={C.ink} />
    <rect x={-150} y={-40} width={300} height={300} rx={30} fill={C.paper} />
    <Tomoe x={0} y={110} R={70} fill={C.red} rot={t * 20} />
    {[-14, 0, 14].map((sx, i) => {
      const amp = vib * 10 * Math.sin(t * 60 + i * 2);
      return <path key={i} d={`M${sx},-1090 Q${sx + amp},-560 ${sx},-30 L${sx},250`} stroke={C.bone} strokeWidth={3} fill="none" />;
    })}
    <rect x={-40} y={-40} width={80} height={14} fill={C.blue} />
  </g>
);

/** Taiko drum skin seen from above. hit 0..1 flexes the skin. */
export const Taiko: React.FC<{ x: number; y: number; R: number; hit: number; rot?: number; skin?: string; tomoe?: string }> = ({ x, y, R, hit, rot = 0, skin = C.paper, tomoe = C.red }) => (
  <g transform={`translate(${x},${y}) scale(${1 - hit * 0.06})`}>
    <circle r={R * 1.12} fill={C.blood} />
    <circle r={R * 1.04} fill={C.ink} />
    <circle r={R} fill={skin} />
    {Array.from({ length: 28 }).map((_, i) => {
      const a = (i / 28) * Math.PI * 2;
      return <circle key={i} cx={Math.cos(a) * R * 1.07} cy={Math.sin(a) * R * 1.07} r={R * 0.025} fill={C.bone} />;
    })}
    <Tomoe R={R * 0.55} rot={rot} fill={tomoe} />
    {hit > 0.05 && <circle r={R * (1.1 + (1 - hit) * 0.9)} fill="none" stroke={C.cyan} strokeWidth={R * 0.04 * hit} opacity={hit} />}
  </g>
);

export const Sunflower: React.FC<{ x: number; y: number; s?: number; rot?: number; petal?: string; disc?: string; stem?: string; t?: number }> = ({ x, y, s = 1, rot = 0, petal = C.red, disc = C.ink, stem = C.ink, t = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d={`M0,0 Q${20 + Math.sin(t) * 10},300 0,900`} stroke={stem} strokeWidth={22} fill="none" />
    <path d="M6,320 q 120,-60 200,10 q -110,40 -200,-10 Z" fill={stem} />
    <path d="M-4,520 q -130,-50 -200,20 q 120,30 200,-20 Z" fill={stem} />
    <g transform={`rotate(${rot})`}>
      {Array.from({ length: 22 }).map((_, i) => (
        <ellipse key={i} cx={0} cy={-150} rx={32} ry={88} fill={i % 2 ? petal : C.hot} transform={`rotate(${(i / 22) * 360})`} />
      ))}
      <circle r={110} fill={disc} />
      {Array.from({ length: 120 }).map((_, i) => {
        const a = i * 2.39996;
        const r = 9.6 * Math.sqrt(i);
        return <circle key={`s${i}`} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={3.5} fill={i % 3 ? C.blood : C.blue} />;
      })}
    </g>
  </g>
);

export const Petal: React.FC<{ x: number; y: number; s?: number; rot?: number; fill?: string; flip?: number }> = ({ x, y, s = 1, rot = 0, fill = C.red, flip = 1 }) => (
  <path transform={`translate(${x},${y}) rotate(${rot}) scale(${s * flip},${s})`} d="M0,-24 C18,-22 26,4 0,26 C-26,4 -18,-22 0,-24 Z M0,-24 L-5,-30 L0,-21 L5,-30 Z" fill={fill} />
);

/** Field of petals falling with wind; time-driven, seeded. */
export const PetalStorm: React.FC<{ t: number; n?: number; seed?: number; colors?: string[]; wind?: number; speed?: number; size?: number; freeze?: number }> = ({
  t, n = 40, seed = 1, colors = [C.red, C.paper, C.hot], wind = 120, speed = 220, size = 1, freeze,
}) => {
  const tt = freeze ?? t;
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const x0 = rr(seed, i, -200, 1280);
        const y0 = rr(seed, i + 100, -400, 1920);
        const sp = speed * rr(seed, i + 200, 0.6, 1.4);
        const yy = ((y0 + tt * sp) % 2300) - 200;
        const xx = x0 + tt * wind * rr(seed, i + 300, 0.5, 1.5) + Math.sin(tt * 1.6 + i) * 40;
        const xm = ((xx % 1480) + 1480) % 1480 - 200;
        return <Petal key={i} x={xm} y={yy} s={size * rr(seed, i + 400, 0.7, 1.5)} rot={tt * rr(seed, i + 500, -200, 200) + i * 40} fill={colors[i % colors.length]} flip={Math.cos(tt * 3 + i)} />;
      })}
    </g>
  );
};

export const Grass: React.FC<{ t: number; y: number; n?: number; h?: number; fill?: string; wind?: number; seed?: number }> = ({ t, y, n = 160, h = 220, fill = C.ink, wind = 1, seed = 4 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const x = (i / n) * 1240 - 80 + rr(seed, i, -6, 6);
      const hh = h * rr(seed, i + 50, 0.5, 1.3);
      const bend = (n2("grass", i * 0.05, t * 0.6) * 0.6 + 0.5) * wind * 80;
      return <path key={i} d={`M${x - 7},${y} Q${x + bend * 0.3},${y - hh * 0.6} ${x + bend},${y - hh} Q${x + bend * 0.25 + 4},${y - hh * 0.55} ${x + 7},${y} Z`} fill={fill} />;
    })}
  </g>
);
