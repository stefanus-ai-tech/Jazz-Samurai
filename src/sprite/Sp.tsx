import React from "react";
import { Img, staticFile } from "remotion";
import SIZES from "../data/sprites.json";
import { clamp, easeOut, easeOutBack, rr } from "../lib/math";

/** Every sprite cut from assets/{1..6}.png by tools/cut_sprites.py (name → [w, h] in px). */
export type SpriteName = keyof typeof SIZES;
export const SPRITE_SIZE = SIZES as Record<SpriteName, [number, number]>;
export const spriteSrc = (n: SpriteName) => staticFile(`sprites/${n}.webp`);

export type SpProps = {
  n: SpriteName;
  /** anchor position (px, 1080×1920 frame) */
  x: number;
  y: number;
  /** display width; or give h; default: native size */
  w?: number;
  h?: number;
  /** extra uniform scale */
  s?: number;
  /** squash & stretch */
  sx?: number;
  sy?: number;
  /** rotation (deg) */
  r?: number;
  o?: number;
  /** anchor inside the sprite (0..1), default centre */
  ax?: number;
  ay?: number;
  flip?: boolean;
  skew?: number;
  blend?: React.CSSProperties["mixBlendMode"];
  filter?: string;
  /** coloured glow behind the sprite */
  glow?: string;
  glowR?: number;
  style?: React.CSSProperties;
};

const place = ({ n, x, y, w, h, s = 1, sx = 1, sy = 1, r = 0, ax = 0.5, ay = 0.5, flip, skew = 0 }: SpProps): React.CSSProperties => {
  const [nw, nh] = SPRITE_SIZE[n];
  const W = w ?? (h ? (h * nw) / nh : nw);
  const H = h ?? (W * nh) / nw;
  return {
    position: "absolute", left: x - W * ax, top: y - H * ay, width: W, height: H,
    transformOrigin: `${ax * 100}% ${ay * 100}%`,
    transform: `rotate(${r}deg) skewX(${skew}deg) scale(${s * sx * (flip ? -1 : 1)}, ${s * sy})`,
  };
};

/** One illustrated sprite, positioned by its anchor. */
export const Sp: React.FC<SpProps> = (p) => {
  const { n, s = 1, o = 1, blend, filter, glow, glowR = 30, style } = p;
  if (o <= 0.001 || s <= 0.001) return null;
  const f = [filter, glow ? `drop-shadow(0 0 ${glowR}px ${glow})` : ""].filter(Boolean).join(" ");
  return <Img src={spriteSrc(n)} style={{ ...place(p), opacity: Math.min(1, o), mixBlendMode: blend, filter: f || undefined, ...style }} />;
};

/** A light sweep across a sprite (p 0→1), clipped to the sprite's own shape. Same props as the sprite it shines on. */
export const Glint: React.FC<SpProps & { p: number; color?: string; width?: number }> = ({ p, color = "#fff", width = 10, ...sp }) => {
  if (p <= 0 || p >= 1) return null;
  const pos = -20 + p * 140;
  const m = `url(${spriteSrc(sp.n)})`;
  return (
    <div
      style={{
        ...place(sp), opacity: sp.o ?? 1, mixBlendMode: "screen",
        WebkitMaskImage: m, maskImage: m, WebkitMaskSize: "100% 100%", maskSize: "100% 100%",
        background: `linear-gradient(110deg, transparent ${pos - width}%, ${color} ${pos}%, transparent ${pos + width}%)`,
      }}
    />
  );
};

/* ---------- timing helpers (t in seconds) ---------- */

/** 0 before `at`, overshooting pop to 1 over d */
export const pop = (t: number, at: number, d = 0.3, k = 1.9) => (t < at ? 0 : Math.max(0, easeOutBack(clamp((t - at) / d), k)));
/** 0 → 1 ease-out over [at, at+d] */
export const ein = (t: number, at: number, d = 0.4) => easeOut(clamp((t - at) / d));
/** stamp: big → 1 with a quick settle */
export const stamp = (t: number, at: number, d = 0.14) => (t < at ? 0 : 2.4 - 1.4 * easeOut(clamp((t - at) / d)));
/** gentle idle sway */
export const sway = (T: number, amp = 1, sp = 1, seed = 0) => Math.sin(T * sp * 1.7 + seed * 2.1) * amp;

/* ---------- sprite particle systems ---------- */

type Many = { names: SpriteName[]; n: number; seed?: number; size?: [number, number]; o?: number; glow?: string; blend?: React.CSSProperties["mixBlendMode"] };

/** Sprites falling and tumbling through the frame (clocks, petals, notes…). */
export const SpRain: React.FC<Many & { t: number; speed?: number; wind?: number; spin?: number; x0?: number; x1?: number }> = ({
  names, n, t, seed = 1, size = [120, 260], speed = 520, wind = 0, spin = 120, o = 1, glow, blend, x0 = -60, x1 = 1140,
}) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const sp = speed * rr(seed, i, 0.6, 1.4);
      const y = ((rr(seed, i + 50, 0, 2400) + t * sp) % 2400) - 240;
      const x = rr(seed, i + 100, x0, x1) + t * wind * rr(seed, i + 150, 0.5, 1.5) + Math.sin(t * 1.3 + i) * 30;
      return <Sp key={i} n={names[i % names.length]} x={x} y={y} w={rr(seed, i + 200, size[0], size[1])} r={rr(seed, i + 250, 0, 360) + t * spin * rr(seed, i + 300, -1, 1)} o={o} glow={glow} blend={blend} />;
    })}
  </>
);

/** Sprites rising / drifting slowly (lanterns, bubbles, petals going up). */
export const SpDrift: React.FC<Many & { t: number; rise?: number; wind?: number; spin?: number; y0?: number; y1?: number }> = ({
  names, n, t, seed = 2, size = [80, 180], rise = 80, wind = 20, spin = 20, o = 1, glow, blend, y0 = -200, y1 = 2120,
}) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const span = y1 - y0;
      const y = y1 - ((((rr(seed, i, 0, span) + t * rise * rr(seed, i + 40, 0.6, 1.4)) % span) + span) % span);
      const x = rr(seed, i + 80, -40, 1120) + Math.sin(t * 0.7 + i * 1.7) * 60 + t * wind;
      const xm = ((x % 1240) + 1240) % 1240 - 80;
      return <Sp key={i} n={names[i % names.length]} x={xm} y={y} w={rr(seed, i + 120, size[0], size[1])} r={Math.sin(t + i) * spin} o={o} glow={glow} blend={blend} />;
    })}
  </>
);

/** Sprites orbiting a centre and (with pull>0) spiralling into it. */
export const SpOrbit: React.FC<Many & { t: number; cx?: number; cy?: number; R?: [number, number]; speed?: number; pull?: number; tilt?: number }> = ({
  names, n, t, seed = 3, size = [90, 200], cx = 540, cy = 960, R = [260, 620], speed = 0.6, pull = 0, tilt = 0.55, o = 1, glow, blend,
}) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const life = (rr(seed, i, 0, 1) + t * pull * 0.25) % 1;
      const rad = pull > 0 ? R[1] * (1 - life) + R[0] * 0.05 : rr(seed, i + 20, R[0], R[1]);
      const a = rr(seed, i + 40, 0, Math.PI * 2) + t * speed * (1.6 - rad / R[1]) * 2;
      const k = pull > 0 ? clamp((1 - life) * 3) : 1;
      return (
        <Sp key={i} n={names[i % names.length]} x={cx + Math.cos(a) * rad} y={cy + Math.sin(a) * rad * tilt} w={rr(seed, i + 60, size[0], size[1]) * (0.35 + 0.65 * (pull > 0 ? 1 - life : 1))} r={(a * 180) / Math.PI + rr(seed, i + 80, 0, 360)} o={o * k} glow={glow} blend={blend} />
      );
    })}
  </>
);

/** Sparkles that pop at seeded spots, one per event (beats, hats…). */
export const SpTwinkle: React.FC<Omit<Many, "n"> & { T: number; events: number[]; life?: number; area?: [number, number, number, number] }> = ({
  names, T, events, seed = 4, size = [60, 140], life = 0.45, o = 1, glow, blend, area = [80, 260, 1000, 1500],
}) => {
  const out: React.ReactNode[] = [];
  for (let i = events.length - 1; i >= 0 && out.length < 8; i--) {
    const dt = T - events[i];
    if (dt < 0) continue;
    if (dt > life) break;
    const p = dt / life;
    const sc = Math.sin(Math.min(1, p * 1.6) * Math.PI * 0.5) * (1 - p * p);
    out.push(
      <Sp key={i} n={names[i % names.length]} x={rr(seed, i, area[0], area[2])} y={rr(seed, i + 7, area[1], area[3])} w={rr(seed, i + 3, size[0], size[1])} s={sc} r={p * 90} o={o} glow={glow} blend={blend} />,
    );
  }
  return <>{out}</>;
};

/** Full-frame backdrop from one sprite: cover the frame, optional spin / zoom. */
export const SpCover: React.FC<{ n: SpriteName; r?: number; z?: number; o?: number; x?: number; y?: number; blend?: React.CSSProperties["mixBlendMode"]; filter?: string }> = ({
  n, r = 0, z = 1, o = 1, x = 540, y = 960, blend, filter,
}) => {
  const [nw, nh] = SPRITE_SIZE[n];
  const spin = r !== 0;
  // a spinning backdrop has to cover the frame diagonal
  const need = spin ? Math.hypot(1080, 1920) : 0;
  const k = spin ? need / Math.min(nw, nh) : Math.max(1080 / nw, 1920 / nh);
  return <Sp n={n} x={x} y={y} w={nw * k * 1.02} s={z} r={r} o={o} blend={blend} filter={filter} />;
};
