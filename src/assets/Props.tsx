import React from "react";
import { C } from "../lib/constants";
import { rr } from "../lib/math";
import { useUid } from "./util";

const KANJI_NUM = ["十二", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一"];

/** Wall clock with kanji numerals. Angles in degrees (0 = 12 o'clock). */
export const Clock: React.FC<{ x: number; y: number; R: number; hour: number; minute: number; face?: string; rim?: string; ink?: string; hl?: number }> = ({
  x, y, R, hour, minute, face = C.paper, rim = C.red, ink = C.ink, hl = -1,
}) => (
  <g transform={`translate(${x},${y})`}>
    <circle r={R * 1.1} fill={rim} />
    <circle r={R} fill={face} />
    {Array.from({ length: 60 }).map((_, i) => {
      const a = (i / 60) * Math.PI * 2;
      const big = i % 5 === 0;
      return <line key={i} x1={Math.sin(a) * R * (big ? 0.84 : 0.9)} y1={-Math.cos(a) * R * (big ? 0.84 : 0.9)} x2={Math.sin(a) * R * 0.96} y2={-Math.cos(a) * R * 0.96} stroke={ink} strokeWidth={big ? R * 0.025 : R * 0.008} />;
    })}
    {KANJI_NUM.map((k, i) => {
      const a = (i / 12) * Math.PI * 2;
      const on = i === hl;
      return (
        <text key={k} x={Math.sin(a) * R * 0.68} y={-Math.cos(a) * R * 0.68 + R * 0.06} fontSize={R * (k.length > 1 ? 0.13 : 0.17) * (on ? 1.5 : 1)} textAnchor="middle" fontFamily={`"JS JP Mincho"`} fill={on ? C.blue : ink}>
          {k}
        </text>
      );
    })}
    <g transform={`rotate(${hour})`}>
      <path d={`M-${R * 0.045},${R * 0.1} L0,${-R * 0.5} L${R * 0.045},${R * 0.1} Z`} fill={ink} />
    </g>
    <g transform={`rotate(${minute})`}>
      <path d={`M-${R * 0.03},${R * 0.14} L0,${-R * 0.82} L${R * 0.03},${R * 0.14} Z`} fill={C.red} />
    </g>
    <circle r={R * 0.05} fill={C.blue} />
  </g>
);

export const PocketWatch: React.FC<{ x: number; y: number; s?: number; rot?: number; t: number; open?: boolean }> = ({ x, y, s = 1, rot = 0, t }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0,-118 C -60,-200 60,-260 30,-340" stroke={C.bone} strokeWidth={6} strokeDasharray="10 6" fill="none" />
    <rect x={-14} y={-130} width={28} height={26} rx={6} fill={C.bone} />
    <circle cy={-140} r={14} fill="none" stroke={C.bone} strokeWidth={6} />
    <circle r={106} fill={C.bone} />
    <circle r={92} fill={C.paper} stroke={C.ink} strokeWidth={4} />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <circle key={i} cx={Math.sin(a) * 76} cy={-Math.cos(a) * 76} r={i % 3 ? 4 : 8} fill={C.ink} />;
    })}
    <line x1={0} y1={0} x2={Math.sin(t * 3) * 48} y2={-Math.cos(t * 3) * 48} stroke={C.ink} strokeWidth={8} strokeLinecap="round" />
    <line x1={0} y1={0} x2={Math.sin(t * 11) * 70} y2={-Math.cos(t * 11) * 70} stroke={C.red} strokeWidth={4} strokeLinecap="round" />
    <circle r={7} fill={C.blue} />
  </g>
);

export const Crown: React.FC<{ x: number; y: number; s?: number; rot?: number; fill?: string; gem?: string }> = ({ x, y, s = 1, rot = 0, fill = C.gold, gem = C.red }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-220,80 L-240,-150 L-120,-40 L0,-200 L120,-40 L240,-150 L220,80 Z" fill={fill} stroke={C.ink} strokeWidth={10} strokeLinejoin="round" />
    <rect x={-226} y={70} width={452} height={70} rx={10} fill={fill} stroke={C.ink} strokeWidth={10} />
    {[-140, 0, 140].map((gx) => <circle key={gx} cx={gx} cy={105} r={22} fill={gem} stroke={C.ink} strokeWidth={6} />)}
    {[-240, 0, 240].map((gx, i) => <circle key={i} cx={gx} cy={i === 1 ? -210 : -160} r={20} fill={C.blue} stroke={C.ink} strokeWidth={6} />)}
  </g>
);

export const Throne: React.FC<{ x: number; y: number; s?: number; rot?: number; fill?: string; trim?: string }> = ({ x, y, s = 1, rot = 0, fill = C.blood, trim = C.gold }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-170,-40 L-160,-640 Q0,-760 160,-640 L170,-40 Z" fill={fill} stroke={trim} strokeWidth={12} />
    <path d="M-110,-120 L-100,-560 Q0,-640 100,-560 L110,-120 Z" fill={C.red} opacity={0.6} />
    <rect x={-230} y={-60} width={460} height={90} rx={14} fill={fill} stroke={trim} strokeWidth={12} />
    <rect x={-250} y={-240} width={60} height={200} rx={20} fill={fill} stroke={trim} strokeWidth={10} />
    <rect x={190} y={-240} width={60} height={200} rx={20} fill={fill} stroke={trim} strokeWidth={10} />
    {[-200, 200].map((lx) => <rect key={lx} x={lx - 18} y={30} width={36} height={160} fill={fill} stroke={trim} strokeWidth={8} />)}
  </g>
);

export const Woofer: React.FC<{ x: number; y: number; R: number; pump: number; cone?: string; ring?: string }> = ({ x, y, R, pump, cone = C.ink, ring = C.blue }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r={R} fill={C.coal} stroke={ring} strokeWidth={R * 0.08} />
    <circle r={R * 0.86} fill={cone} />
    <g transform={`scale(${1 + pump * 0.12})`}>
      {[0.78, 0.66, 0.54].map((k) => <circle key={k} r={R * k} fill="none" stroke="#2c2526" strokeWidth={R * 0.03} />)}
      <circle r={R * 0.32} fill={ring} />
      <circle r={R * 0.18} fill={C.ink} opacity={0.4} />
    </g>
  </g>
);

export const Boombox: React.FC<{ x: number; y: number; s?: number; pumpL: number; pumpR: number; t: number; body?: string }> = ({ x, y, s = 1, pumpL, pumpR, t, body = C.red }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-300,-330 Q-300,-420 -200,-420 L200,-420 Q300,-420 300,-330" stroke={C.ink} strokeWidth={30} fill="none" />
    <line x1={250} y1={-300} x2={420} y2={-700} stroke={C.bone} strokeWidth={8} />
    <rect x={-480} y={-300} width={960} height={560} rx={50} fill={body} stroke={C.ink} strokeWidth={14} />
    <rect x={-450} y={-270} width={900} height={70} rx={14} fill={C.ink} />
    {Array.from({ length: 16 }).map((_, i) => <rect key={i} x={-420 + i * 52} y={-252} width={32} height={34} rx={4} fill={i % 4 === 0 ? C.cyan : C.bone} opacity={0.8} />)}
    <Woofer x={-290} y={40} R={170} pump={pumpL} />
    <Woofer x={290} y={40} R={170} pump={pumpR} />
    <rect x={-100} y={-140} width={200} height={130} rx={12} fill={C.ink} stroke={C.bone} strokeWidth={6} />
    {[-50, 50].map((cx) => (
      <g key={cx} transform={`translate(${cx},-75) rotate(${t * 360})`}>
        <circle r={30} fill={C.bone} />
        {[0, 60, 120, 180, 240, 300].map((a) => <rect key={a} x={-4} y={-28} width={8} height={14} fill={C.ink} transform={`rotate(${a})`} />)}
      </g>
    ))}
    {Array.from({ length: 5 }).map((_, i) => <rect key={i} x={-95 + i * 40} y={20} width={30} height={60} rx={6} fill={C.ink} />)}
    {Array.from({ length: 5 }).map((_, i) => <rect key={`e${i}`} x={-95 + i * 40} y={170 - 60 * Math.abs(Math.sin(t * 9 + i))} width={30} height={60 * Math.abs(Math.sin(t * 9 + i))} fill={C.cyan} />)}
  </g>
);

/** Wireframe globe; spin in radians. */
export const Globe: React.FC<{ x: number; y: number; R: number; spin: number; stroke?: string; fill?: string; tilt?: number }> = ({ x, y, R, spin, stroke = C.cyan, fill = C.navy, tilt = -18 }) => {
  const lons = [];
  for (let i = 0; i < 12; i++) {
    const a = spin + (i / 12) * Math.PI;
    const rx = Math.abs(Math.cos(a)) * R;
    lons.push(<ellipse key={i} rx={rx} ry={R} fill="none" stroke={stroke} strokeWidth={Math.cos(a) > 0 ? 4 : 2} opacity={Math.cos(a) > 0 ? 0.95 : 0.35} />);
  }
  const lats = [];
  for (let j = -4; j <= 4; j++) {
    const yy = (j / 5) * R;
    const rx = Math.sqrt(R * R - yy * yy);
    lats.push(<ellipse key={j} cy={yy} rx={rx} ry={rx * 0.16} fill="none" stroke={stroke} strokeWidth={3} opacity={0.8} />);
  }
  return (
    <g transform={`translate(${x},${y}) rotate(${tilt})`}>
      <circle r={R} fill={fill} />
      {lats}
      {lons}
      <circle r={R} fill="none" stroke={stroke} strokeWidth={6} />
    </g>
  );
};

/** Geta (wooden sandal) footprint. */
export const Footprint: React.FC<{ x: number; y: number; rot?: number; s?: number; fill?: string; opacity?: number; left?: boolean }> = ({ x, y, rot = 0, s = 1, fill = C.ink, opacity = 1, left = true }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${left ? -s : s},${s})`} opacity={opacity}>
    <rect x={-55} y={-120} width={110} height={240} rx={40} fill={fill} />
    <rect x={-60} y={-80} width={120} height={22} rx={8} fill={C.paper} opacity={0.7} />
    <rect x={-60} y={50} width={120} height={22} rx={8} fill={C.paper} opacity={0.7} />
    <path d="M0,-100 L-30,-40 M0,-100 L30,-40" stroke={C.red} strokeWidth={8} />
  </g>
);

/** Electric piano keys in perspective-free front view; pressed: map index->0..1 */
export const Keys: React.FC<{ x: number; y: number; w: number; h: number; n?: number; pressed: (i: number) => number; white?: string; black?: string; hot?: string }> = ({
  x, y, w, h, n = 14, pressed, white = C.paper, black = C.ink, hot = C.cyan,
}) => {
  const kw = w / n;
  const blacks = [1, 2, 4, 5, 6];
  return (
    <g transform={`translate(${x},${y})`}>
      {Array.from({ length: n }).map((_, i) => {
        const p = pressed(i);
        return <rect key={i} x={i * kw + 2} y={p * 14} width={kw - 4} height={h} rx={8} fill={p > 0.3 ? hot : white} />;
      })}
      {Array.from({ length: n - 1 }).map((_, i) => {
        if (!blacks.includes((i % 7) + 1)) return null;
        const p = pressed(100 + i);
        return <rect key={`b${i}`} x={(i + 1) * kw - kw * 0.3} y={p * 10} width={kw * 0.6} height={h * 0.6} rx={6} fill={p > 0.3 ? C.red : black} />;
      })}
    </g>
  );
};

/** Perspective road into a vanishing point at (vx,vy); travel in px scroll. */
export const Road: React.FC<{ vx: number; vy: number; travel: number; road?: string; line?: string; edge?: string }> = ({ vx, vy, travel, road = C.ink, line = C.paper, edge = C.red }) => {
  const dashes = [];
  for (let i = 0; i < 14; i++) {
    const z = ((i / 14 + travel / 1400) % 1);
    const z2 = z + 0.03;
    const p = (q: number) => vy + (1920 - vy) * Math.pow(q, 2.2);
    const wdt = (q: number) => 6 + 40 * Math.pow(q, 2.2);
    dashes.push(<path key={i} d={`M${vx - wdt(z) / 2},${p(z)} L${vx + wdt(z) / 2},${p(z)} L${vx + wdt(z2) / 2},${p(z2)} L${vx - wdt(z2) / 2},${p(z2)} Z`} fill={line} />);
  }
  return (
    <g>
      <path d={`M${vx - 8},${vy} L${vx + 8},${vy} L1500,1920 L-420,1920 Z`} fill={road} />
      <path d={`M${vx - 6},${vy} L-380,1920`} stroke={edge} strokeWidth={14} />
      <path d={`M${vx + 6},${vy} L1460,1920`} stroke={edge} strokeWidth={14} />
      {dashes}
    </g>
  );
};

/** Thick bass strings across the frame; plucks: per-string amplitude 0..1 */
export const BassStrings: React.FC<{ t: number; amps: number[]; y0?: number; gap?: number; color?: string; wound?: string; angle?: number; n?: number; thick?: number }> = ({
  t, amps, y0 = 700, gap = 150, color = C.bone, wound = "#8f8478", angle = -12, n = 4, thick = 26,
}) => {
  const uid = useUid("bs");
  return (
    <g transform={`rotate(${angle} 540 960)`}>
      <defs>
        <pattern id={uid} width="8" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
          <rect width="8" height="40" fill={color} />
          <rect width="3" height="40" fill={wound} />
        </pattern>
      </defs>
      {Array.from({ length: n }).map((_, i) => {
        const a = amps[i] ?? 0;
        const pts: string[] = [];
        for (let k = 0; k <= 40; k++) {
          const u = k / 40;
          const x = -300 + u * 1680;
          const disp = Math.sin(u * Math.PI) * Math.sin(t * 70 + i) * a * 46;
          pts.push(`${k ? "L" : "M"}${x.toFixed(1)},${(y0 + i * gap + disp).toFixed(1)}`);
        }
        const tk = thick * (1 - i * 0.13);
        return (
          <g key={i}>
            <path d={pts.join(" ")} stroke="#000" strokeOpacity={0.5} strokeWidth={tk + 10} fill="none" transform="translate(10,22)" />
            <path d={pts.join(" ")} stroke={`url(#${uid})`} strokeWidth={tk} fill="none" />
            {a > 0.15 && <path d={pts.join(" ")} stroke={C.cyan} strokeWidth={tk * 0.35} fill="none" opacity={a} />}
          </g>
        );
      })}
    </g>
  );
};

/** Thin guitar strings with an audio-ish oscillation. */
export const GuitarStrings: React.FC<{ t: number; amp: number; x0?: number; x1?: number; y0?: number; gap?: number; color?: string; n?: number }> = ({
  t, amp, x0 = -100, x1 = 1180, y0 = 800, gap = 50, color = C.bone, n = 6,
}) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const pts: string[] = [];
      for (let k = 0; k <= 60; k++) {
        const u = k / 60;
        const x = x0 + u * (x1 - x0);
        const y = y0 + i * gap + Math.sin(u * Math.PI) * (Math.sin(u * 23 + t * 40 + i) * 0.6 + Math.sin(u * 9 - t * 31) * 0.4) * amp * 26 * (1 + i * 0.1);
        pts.push(`${k ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`);
      }
      return <path key={i} d={pts.join(" ")} stroke={color} strokeWidth={2 + i * 1.3} fill="none" />;
    })}
  </g>
);

/** Black hole with accretion disk + lensing ring. spin in radians. */
export const BlackHole: React.FC<{ x: number; y: number; R: number; spin: number; tilt?: number; pull?: number }> = ({ x, y, R, spin, tilt = -14, pull = 0 }) => {
  const uid = useUid("bh");
  const disk = (front: boolean) =>
    Array.from({ length: 16 }).map((_, i) => {
      const k = 1.25 + i * 0.16;
      const rx = R * k, ry = R * k * 0.24;
      const col = i % 3 === 0 ? C.cyan : i % 3 === 1 ? C.red : C.hot;
      const circ = Math.PI * (rx + ry);
      return (
        <ellipse
          key={i} rx={rx} ry={ry} fill="none" stroke={col} strokeWidth={R * 0.07 * (1 - i / 20)}
          strokeDasharray={`${circ * 0.12} ${circ * 0.05}`} strokeDashoffset={(-spin * circ * (1.5 - i * 0.05)) / 2}
          opacity={0.9 - i * 0.04} clipPath={`url(#${uid}${front ? "f" : "k"})`}
        />
      );
    });
  return (
    <g transform={`translate(${x},${y}) rotate(${tilt})`}>
      <defs>
        <clipPath id={`${uid}f`}><rect x={-R * 5} y={0} width={R * 10} height={R * 5} /></clipPath>
        <clipPath id={`${uid}k`}><rect x={-R * 5} y={-R * 5} width={R * 10} height={R * 5} /></clipPath>
        <radialGradient id={`${uid}g`}>
          <stop offset="0.45" stopColor={C.hot} stopOpacity="0.0" />
          <stop offset="0.52" stopColor={C.hot} stopOpacity="0.9" />
          <stop offset="0.6" stopColor={C.cyan} stopOpacity="0.5" />
          <stop offset="1" stopColor={C.cyan} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle r={R * 2.1} fill={`url(#${uid}g)`} />
      {disk(false)}
      <ellipse cy={-R * 0.1} rx={R * 1.22} ry={R * 1.12} fill="none" stroke={C.paper} strokeWidth={R * 0.05} opacity={0.85} />
      <circle r={R * (1 + pull * 0.2)} fill="#000" />
      {disk(true)}
      {Array.from({ length: 30 }).map((_, i) => {
        const a0 = rr(9, i, 0, Math.PI * 2) + spin * 1.6;
        const r0 = R * rr(9, i + 50, 1.6, 4.2) * (1 - ((spin * 0.3 + i * 0.13) % 1) * 0.5);
        const a1 = a0 + 0.5;
        return <path key={i} d={`M${Math.cos(a0) * r0},${Math.sin(a0) * r0 * 0.4} A${r0},${r0 * 0.4} 0 0,1 ${Math.cos(a1) * r0 * 0.9},${Math.sin(a1) * r0 * 0.36}`} stroke={i % 2 ? C.paper : C.cyan} strokeWidth={3} fill="none" opacity={0.7} />;
      })}
    </g>
  );
};

/** Stage: curtains + spotlight cone + mic stand. */
export const Stage: React.FC<{ t: number; open: number; beam: number; curtain?: string }> = ({ t, open, beam, curtain = C.red2 }) => {
  const uid = useUid("stg");
  const folds = (side: number) =>
    Array.from({ length: 9 }).map((_, i) => {
      const w = 70;
      const x0 = side < 0 ? -40 + i * w * (1 - open * 0.75) : 1120 - (i + 1) * w * (1 - open * 0.75);
      const sway = Math.sin(t * 1.3 + i) * 6;
      return <path key={`${side}${i}`} d={`M${x0},0 Q${x0 + w / 2 + sway},960 ${x0},1920 L${x0 + w},1920 Q${x0 + w / 2 + sway},960 ${x0 + w},0 Z`} fill={i % 2 ? curtain : C.blood} />;
    });
  return (
    <g>
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.paper} stopOpacity={0.55 * beam} />
          <stop offset="1" stopColor={C.paper} stopOpacity={0.05 * beam} />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill={C.ink} />
      <ellipse cx={540} cy={1480} rx={360} ry={70} fill={C.paper} opacity={0.22 * beam} />
      <path d="M470,-20 L610,-20 L940,1500 L140,1500 Z" fill={`url(#${uid})`} />
      <g stroke={C.bone} strokeWidth={12} strokeLinecap="round" fill="none">
        <line x1={540} y1={1480} x2={540} y2={980} />
        <line x1={540} y1={1480} x2={460} y2={1530} />
        <line x1={540} y1={1480} x2={620} y2={1530} />
        <line x1={540} y1={1480} x2={540} y2={1540} />
        <line x1={540} y1={1000} x2={620} y2={930} />
      </g>
      <rect x={600} y={870} width={56} height={110} rx={28} fill={C.ink} stroke={C.bone} strokeWidth={6} transform="rotate(40 628 925)" />
      {folds(-1)}
      {folds(1)}
      <rect x={0} y={0} width={1080} height={120} fill={C.blood} />
      {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M${i * 90},120 Q${i * 90 + 45},200 ${i * 90 + 90},120 Z`} fill={C.blood} />)}
    </g>
  );
};
