import React from "react";
import { C, W } from "./lib/constants";
import { ff, fitSize, FontKey, FONTS } from "./lib/fonts";
import { clamp, easeOut, easeOutBack, easeOutBounce, hash, rnd, rr, lerp } from "./lib/math";
import { hat, beatPulse } from "./lib/audio";
import { Line, LINES } from "./lib/lyrics";
import { Sp, SpriteName } from "./sprite/Sp";

export type StyleName =
  | "pop" | "slam" | "rise" | "drop" | "type" | "scramble" | "neon" | "wave" | "stretch" | "karaoke" | "stack"
  | "vertical" | "spiral" | "float" | "crooked" | "split" | "echo" | "glitch" | "stamp" | "whisper" | "melt"
  | "outline" | "bubble" | "ticker" | "tunnel" | "comic" | "serif" | "hand" | "chant" | "scatter" | "sink" | "zoom";

export type LStyle = {
  s: StyleName; font?: FontKey; x?: number; y?: number; w?: number; h?: number; size?: number;
  color?: string; accent?: string; outline?: string | null; upper?: boolean; rot?: number;
  align?: "center" | "left" | "right"; hl?: number[]; bg?: "none" | "box" | "band"; bgColor?: string;
  lead?: number; exit?: "fade" | "cut" | "up" | "down" | "zoom" | "slash"; spacing?: number; lh?: number; seed?: number;
  shadow?: string; tail?: number;
  /** hero word index (bigger, accent, glow, spark burst). Default: auto (longest word). false = none */
  hero?: number | false;
  /** soft dark shade behind the text block for legibility (default "shade" for flowing text) */
  plate?: "shade" | "none";
  /** bubble style: draw this illustrated speech bubble (sprite) behind the words instead of the CSS box */
  sprite?: SpriteName;
  /** bubble sprite width as a multiple of w (default 1.3), height stretch (default 1), text offset inside it */
  spriteW?: number;
  spriteH?: number;
  dy?: number;
  /** the scene shows this line itself (illustrated word art), so the lyric layer skips it */
  hide?: boolean;
};

const NO_HERO: StyleName[] = ["spiral", "ticker", "tunnel", "scatter", "neon", "chant", "stamp", "whisper", "bubble", "comic", "vertical"];
const NO_PLATE: StyleName[] = ["bubble", "chant", "stamp", "ticker", "tunnel", "spiral", "scatter", "comic"];

const autoHero = (ws: { w: string }[]) => {
  let best = -1, bl = 2;
  ws.forEach((wd, i) => {
    const L = wd.w.replace(/[^A-Za-z]/g, "").length;
    if (L >= bl) { best = i; bl = L; }
  });
  return best;
};

/** spark burst for a hero word landing (0..0.45s) */
const Sparks: React.FC<{ wt: number; fs: number; c1: string; c2: string }> = ({ wt, fs, c1, c2 }) => {
  if (wt < 0 || wt > 0.45) return null;
  const p = wt / 0.45;
  const r = easeOut(p) * fs * 1.15;
  return (
    <>
      {Array.from({ length: 8 }).map((_, k) => {
        const a = (k / 8) * Math.PI * 2 + 0.3;
        const sz = fs * 0.16 * (1 - p);
        return (
          <svg key={k} width={sz * 2} height={sz * 2} viewBox="-1 -1 2 2" style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(${Math.cos(a) * r * 1.4 - sz}px, ${Math.sin(a) * r * 0.8 - sz}px)`, overflow: "visible" }}>
            <path d="M0,-1 L0.22,-0.22 L1,0 L0.22,0.22 L0,1 L-0.22,0.22 L-1,0 L-0.22,-0.22 Z" fill={k % 2 ? c1 : c2} />
          </svg>
        );
      })}
    </>
  );
};

const outlineShadow = (col: string, px: number, drop?: string) => {
  const s: string[] = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    s.push(`${(Math.cos(a) * px).toFixed(1)}px ${(Math.sin(a) * px).toFixed(1)}px 0 ${col}`);
  }
  if (drop) s.push(drop);
  return s.join(",");
};

const GLYPHS = "ABCDEFGHJKLMNOPQRSTUVWXYZ#%&@侍音夢刀ジャズ";

type Ctx = { wt: number; wdur: number; i: number; n: number; lt: number; ex: number; T: number; fs: number; st: Required<Pick<LStyle, "color" | "accent">> & LStyle; hl: boolean; text: string; lineDur: number };

const letters = (text: string, fn: (ch: string, j: number) => React.CSSProperties, content?: (ch: string, j: number) => string) => (
  <>
    {text.split("").map((ch, j) => (
      <span key={j} style={{ display: "inline-block", whiteSpace: "pre", ...fn(ch, j) }}>{content ? content(ch, j) : ch}</span>
    ))}
  </>
);

function renderWord(c: Ctx): { style: React.CSSProperties; inner: React.ReactNode; wrap?: React.CSSProperties } {
  const { wt, wdur, i, T, fs, st, text } = c;
  const seed = (st.seed ?? 3) + i * 17;
  const vis = wt >= -0.03;
  const k = (d: number) => clamp(wt / d);
  const base: React.CSSProperties = { opacity: vis ? 1 : 0, display: "inline-block", whiteSpace: "nowrap" };
  switch (st.s) {
    case "pop": {
      const s = easeOutBack(k(0.22), 2.2);
      return { style: { ...base, filter: wt < 0.12 ? `blur(${(1 - k(0.12)) * 6}px)` : undefined, transform: `translateY(${(1 - s) * 30}px) scale(${Math.max(0, s)})` }, inner: text };
    }
    case "slam": {
      const q = k(0.13);
      return { style: { ...base, opacity: vis ? clamp(q * 3) : 0, transform: `scale(${2.8 - 1.8 * easeOut(q)}) rotate(${(1 - q) * (rnd(seed, 2) - 0.5) * 30}deg)` }, inner: text };
    }
    case "zoom": {
      const q = easeOut(k(0.28));
      return { style: { ...base, opacity: vis ? q : 0, transform: `scale(${0.15 + 0.85 * q}) translateY(${(1 - q) * -80}px)` }, inner: text };
    }
    case "rise": {
      const q = easeOut(k(0.32));
      return { wrap: { overflow: "hidden", paddingBottom: fs * 0.08 }, style: { ...base, transform: `translateY(${(1 - q) * 110}%)` }, inner: text };
    }
    case "drop": {
      const q = easeOutBounce(k(0.55));
      return { style: { ...base, transform: `translateY(${-(1 - q) * 900}px) rotate(${(1 - q) * 20}deg)` }, inner: text };
    }
    case "sink": {
      const q = easeOut(k(0.22));
      const sink = Math.max(0, c.lt - 0.3) * fs * 0.35 + (1 - q) * -fs * 0.8;
      return { style: { ...base, opacity: vis ? q : 0, transform: `translateY(${sink}px)` }, inner: text };
    }
    case "type": {
      const dur = Math.max(0.05, Math.min(0.45, wdur * 0.8));
      const shown = vis ? Math.ceil(clamp(wt / dur) * text.length) : 0;
      return { style: { ...base, opacity: 1 }, inner: <>{text.slice(0, shown)}<span style={{ opacity: 0 }}>{text.slice(shown)}</span></> };
    }
    case "scramble": {
      const fr = Math.floor(T * 30);
      return {
        style: { ...base },
        inner: letters(text, () => ({}), (ch, j) => {
          const res = wt > 0.06 * j + 0.12;
          return res || ch === " " ? ch : GLYPHS[Math.floor(hash(fr * 13 + j * 7 + i) * GLYPHS.length)];
        }),
      };
    }
    case "neon": {
      const on = vis && (wt > 0.3 || hash(Math.floor(wt * 30) + i * 3) > 0.45) && !(hat(T) > 0.85 && hash(Math.floor(T * 30) + i) > 0.7);
      const glow = st.accent;
      return {
        style: { ...base, WebkitTextStroke: "0px transparent", color: on ? "#fff" : "rgba(255,255,255,0.12)", textShadow: on ? `0 0 ${fs * 0.06}px ${glow}, 0 0 ${fs * 0.16}px ${glow}, 0 0 ${fs * 0.35}px ${glow}` : "none" },
        inner: text,
      };
    }
    case "wave": {
      const q = k(0.4);
      return {
        style: { ...base, opacity: vis ? q : 0, filter: `blur(${(1 - q) * 6}px)` },
        inner: letters(text, (_, j) => ({ transform: `translateY(${Math.sin(T * 4 + j * 0.6 + i) * fs * 0.045}px)` })),
      };
    }
    case "stretch": {
      const q = clamp(c.lt / c.lineDur);
      return { style: { ...base, opacity: vis ? k(0.3) : 0, letterSpacing: `${lerp(-0.02, 0.22, q) * fs}px`, transform: `scaleY(${1 - q * 0.25})` }, inner: text };
    }
    case "karaoke": {
      const p = clamp(wt / Math.max(0.12, wdur * 0.9)) * 100;
      return {
        style: {
          ...base, opacity: 1, color: "transparent", WebkitBackgroundClip: "text", backgroundClip: "text", textShadow: "none",
          filter: `drop-shadow(0 ${fs * 0.05}px 0 ${C.ink}) drop-shadow(0 0 ${fs * 0.03}px ${C.ink})`,
          backgroundImage: `linear-gradient(90deg, ${c.hl ? st.accent : st.color} ${p}%, rgba(255,255,255,0.18) ${p + 0.01}%)`,
          transform: `scale(${1 + 0.08 * Math.exp(-Math.max(0, wt) / 0.15) * (vis ? 1 : 0)})`,
        },
        inner: text,
      };
    }
    case "stack": {
      const q = easeOut(k(0.25));
      const dir = i % 2 ? 1 : -1;
      return { style: { ...base, transform: `translateX(${dir * (1 - q) * 700}px) skewX(${dir * (1 - q) * -20}deg)` }, inner: text };
    }
    case "vertical": {
      const q = easeOut(k(0.3));
      return { style: { ...base, opacity: vis ? q : 0, transform: `translateY(${-(1 - q) * 240}px)` }, inner: text };
    }
    case "float": {
      const q = easeOut(k(0.5));
      return { style: { ...base, opacity: vis ? q : 0, transform: `translateY(${(1 - q) * 120 - Math.max(0, wt) * 40 + Math.sin(T * 2.2 + i) * 14}px) rotate(${Math.sin(T * 1.7 + i * 2) * 7}deg)` }, inner: text };
    }
    case "crooked": {
      const s = easeOutBack(k(0.2), 2.5);
      return { style: { ...base, transform: `translateY(${rr(seed, 5, -10, 10)}px) rotate(${rr(seed, 6, -5, 5)}deg) scale(${Math.max(0, s)})` }, inner: text };
    }
    case "split": {
      const q = easeOut(k(0.18));
      const off = (1 - q) * 180;
      return {
        style: { ...base, position: "relative" },
        inner: (
          <span style={{ position: "relative", display: "inline-block" }}>
            <span style={{ visibility: "hidden" }}>{text}</span>
            <span style={{ position: "absolute", left: 0, top: 0, clipPath: "polygon(0 0,100% 0,100% 45%,0 60%)", transform: `translateX(${-off}px)` }}>{text}</span>
            <span style={{ position: "absolute", left: 0, top: 0, clipPath: "polygon(0 60%,100% 45%,100% 100%,0 100%)", transform: `translateX(${off}px)`, color: st.accent }}>{text}</span>
          </span>
        ),
      };
    }
    case "echo": {
      const q = easeOut(k(0.25));
      return {
        style: { ...base, position: "relative", opacity: vis ? q : 0 },
        inner: (
          <span style={{ position: "relative", display: "inline-block" }}>
            {[3, 2, 1].map((e) => (
              <span key={e} style={{ position: "absolute", left: 0, top: 0, color: "transparent", WebkitTextStroke: `3px ${st.accent}`, textShadow: "none", opacity: 0.55 / e, transform: `translate(${e * 10 * (0.4 + q)}px, ${e * 12 * (0.4 + q)}px)` }}>{text}</span>
            ))}
            <span style={{ position: "relative" }}>{text}</span>
          </span>
        ),
      };
    }
    case "glitch": {
      const fr = Math.floor(T * 30);
      const g = wt < 0.16 && vis;
      const dx = g ? (hash(fr * 3 + i) - 0.5) * fs * 0.25 : 0;
      return {
        style: { ...base, position: "relative" },
        inner: (
          <span style={{ position: "relative", display: "inline-block", transform: `translateX(${dx}px)` }}>
            {g && <span style={{ position: "absolute", left: -fs * 0.05, top: 0, color: C.red, opacity: 0.85, textShadow: "none" }}>{text}</span>}
            {g && <span style={{ position: "absolute", left: fs * 0.05, top: 0, color: C.cyan, opacity: 0.85, textShadow: "none" }}>{text}</span>}
            <span style={{ position: "relative", clipPath: g ? `inset(${hash(fr) * 40}% 0 ${hash(fr + 1) * 30}% 0)` : undefined }}>{text}</span>
          </span>
        ),
      };
    }
    case "stamp": {
      const q = k(0.1);
      return {
        style: {
          ...base, transform: `scale(${1.7 - 0.7 * easeOut(q)}) rotate(${rr(seed, 7, -7, 7)}deg)`, opacity: vis ? clamp(q * 4) : 0,
          border: `${Math.max(4, fs * 0.06)}px solid ${st.accent}`, padding: `0 ${fs * 0.12}px`, background: st.bgColor ?? "transparent", lineHeight: 1.05,
        },
        inner: text,
      };
    }
    case "whisper": {
      const q = clamp(wt / 0.6);
      return { style: { ...base, opacity: vis ? q * 0.92 : 0, filter: `blur(${(1 - q) * 9}px)`, transform: `translateY(${(1 - q) * 16}px)` }, inner: text };
    }
    case "melt": {
      const q = easeOut(k(0.2));
      return {
        style: { ...base, opacity: vis ? q : 0 },
        inner: letters(text, (_, j) => {
          const m = Math.max(0, wt - 0.6 - rnd(seed, j) * 0.3) * 0.6;
          return { transformOrigin: "top", transform: `scaleY(${1 + m * (0.3 + rnd(seed, j + 9) * 0.7)}) translateY(${m * 8}px)` };
        }),
      };
    }
    case "outline": {
      const p = clamp(wt / 0.35) * 100;
      return {
        style: {
          ...base, color: "transparent", WebkitTextStroke: `${Math.max(3, fs * 0.025)}px ${st.color}`, textShadow: "none",
          backgroundImage: `linear-gradient(0deg, ${c.hl ? st.accent : st.color} ${p}%, transparent ${p + 0.01}%)`, WebkitBackgroundClip: "text", backgroundClip: "text",
        },
        inner: text,
      };
    }
    case "comic":
    case "bubble": {
      const s = easeOutBack(k(0.18), 3);
      return { style: { ...base, transform: `scale(${Math.max(0, s)}) rotate(${rr(seed, 3, -6, 6)}deg)` }, inner: text };
    }
    case "serif": {
      const q = easeOut(k(0.45));
      return { style: { ...base, opacity: vis ? q : 0, transform: `translateY(${(1 - q) * 22}px)`, letterSpacing: `${(1 - q) * 0.15 * fs}px` }, inner: text };
    }
    case "hand": {
      const q = clamp(wt / Math.max(0.12, Math.min(0.5, wdur * 0.85)));
      return { style: { ...base, clipPath: `inset(-20% ${(1 - q) * 100}% -20% 0)` }, inner: text };
    }
    case "chant": {
      const q = easeOut(k(0.22));
      const bgc = i % 2 ? st.accent : st.bgColor ?? C.ink;
      return {
        style: { ...base, background: bgc, padding: `${fs * 0.04}px ${fs * 0.16}px`, margin: fs * 0.04, transform: `perspective(800px) rotateX(${(1 - q) * 90}deg) scale(${1 + beatPulse(T) * 0.05})`, transformOrigin: "50% 100%" },
        inner: text,
      };
    }
    case "scatter": {
      const s = easeOutBack(k(0.2), 2);
      return { style: { ...base, transform: `scale(${Math.max(0, s)}) rotate(${rr(seed, 8, -12, 12)}deg)` }, inner: text };
    }
    default:
      return { style: base, inner: text };
  }
}

const LyricLine: React.FC<{ line: Line; st: LStyle; T: number }> = ({ line, st: st0, T }) => {
  const st = { color: C.paper, accent: C.red, ...st0 };
  const font: FontKey = st.font ?? "anton";
  const upper = st.upper ?? !["serif", "whisper", "hand", "wave"].includes(st.s);
  const x = st.x ?? 540, y = st.y ?? 900, w = st.w ?? 900, h = st.h ?? 560;
  const words = line.words.map((wd) => ({ ...wd, w: upper ? wd.w.toUpperCase() : wd.w }));
  const text = words.map((wd) => wd.w).join(" ");
  const lineDur = Math.max(0.3, line.end - line.start);
  const lt = T - line.start;
  const tail = st.tail ?? 0.28;
  const ex = clamp((T - line.end) / tail);
  const lh = st.lh ?? (FONTS[font][2] < 0.5 ? 0.95 : 1.08);
  let fs = st.size ?? fitSize(text, font, w, h, 230, upper);
  if (st.s === "stack" && !st.size) {
    const longest = Math.max(...words.map((wd) => wd.w.length));
    fs = Math.min(w / (longest * FONTS[font][2] * 1.12), h / (words.length * lh), 300);
  }
  const outline = st.outline === undefined ? C.ink : st.outline;
  const textShadow = st.shadow ?? (outline ? `0 ${(fs * 0.06).toFixed(1)}px 0 ${outline}` : undefined);
  const stroke: React.CSSProperties = outline ? { WebkitTextStroke: `${Math.max(5, fs * 0.1).toFixed(1)}px ${outline}`, paintOrder: "stroke fill" } : {};

  let exitT = "";
  let exitO = 1;
  const exk = st.exit ?? "fade";
  if (ex > 0) {
    if (exk === "cut") exitO = 0;
    else if (exk === "up") { exitT = `translateY(${-ex * 140}px)`; exitO = 1 - ex; }
    else if (exk === "down") { exitT = `translateY(${ex * 260}px)`; exitO = 1 - ex; }
    else if (exk === "zoom") { exitT = `scale(${1 + ex * 0.9})`; exitO = 1 - ex; }
    else if (exk === "slash") { exitT = `skewX(${ex * -30}deg) translateX(${ex * 400}px)`; exitO = 1 - ex; }
    else exitO = 1 - ex;
  }

  const common: React.CSSProperties = {
    fontFamily: ff(font), fontSize: fs, lineHeight: lh, color: st.color, textShadow, letterSpacing: st.spacing, ...stroke,
  };

  // ---- special layouts ----
  if (st.s === "ticker" || st.s === "tunnel" || st.s === "spiral") {
    const vis = lt > -0.05;
    if (!vis || ex >= 1) return null;
    if (st.s === "ticker") {
      const shown = words.filter((wd) => T >= wd.t - 0.03).map((wd) => wd.w).join(" ");
      const band = (shown + "  ✦  ").repeat(6);
      return (
        <div style={{ position: "absolute", left: -400, width: W + 800, top: y - fs * 0.7, height: fs * 1.4, transform: `rotate(${st.rot ?? -8}deg) ${exitT}`, opacity: exitO, background: st.bgColor ?? C.red, overflow: "hidden", display: "flex", alignItems: "center" }}>
          <div style={{ ...common, whiteSpace: "nowrap", transform: `translateX(${-((T * 420) % (fs * 8))}px)` }}>{band}</div>
        </div>
      );
    }
    if (st.s === "tunnel") {
      const shown = words.filter((wd) => T >= wd.t - 0.03).map((wd) => wd.w).join(" ");
      const echoes = 5;
      const ph = (T * 0.9) % 1;
      const box = (sc: number, op: number, stroke: string | null, key: string | number) => (
        <div key={key} style={{ position: "absolute", left: x - w / 2, width: w, top: y, textAlign: "center", transform: `translateY(-50%) scale(${sc})`, opacity: op }}>
          <span style={stroke ? { ...common, color: "transparent", WebkitTextStroke: `3px ${stroke}`, textShadow: "none" } : common}>{shown}</span>
        </div>
      );
      return (
        <div style={{ position: "absolute", inset: 0, opacity: exitO, transform: exitT }}>
          {Array.from({ length: echoes }).map((_, k) => {
            const z = (k + ph) / echoes;
            return box(1 + z * 1.3, 0.5 * (1 - z), k % 2 ? st.accent : st.color, k);
          })}
          {box(1 + beatPulse(T) * 0.04, 1, null, "front")}
        </div>
      );
    }
    // spiral: letters orbit + get sucked in
    const chars = text.split("");
    const shownCount = words.reduce((acc, wd, idx) => (T >= wd.t - 0.03 ? acc + wd.w.length + (idx ? 1 : 0) : acc), 0);
    const pull = clamp((lt - lineDur * 0.55) / (lineDur * 0.6));
    return (
      <div style={{ position: "absolute", left: x, top: y, opacity: exitO }}>
        {chars.slice(0, shownCount).map((ch, j) => {
          const u = j / chars.length;
          const a = u * Math.PI * 3.2 + T * 1.6 + pull * 6;
          const R = (520 - u * 330) * (1 - pull * 0.95);
          return (
            <span key={j} style={{ ...common, position: "absolute", left: Math.cos(a) * R, top: Math.sin(a) * R * 0.75, transform: `translate(-50%,-50%) rotate(${(a * 180) / Math.PI + 90}deg) scale(${1 - pull * 0.8})`, fontSize: fs * (1 - u * 0.4) }}>
              {ch}
            </span>
          );
        })}
      </div>
    );
  }

  if (st.s === "scatter") {
    return (
      <div style={{ position: "absolute", inset: 0, opacity: exitO, transform: exitT }}>
        {words.map((wd, i) => {
          const r = renderWord({ wt: T - wd.t, wdur: (words[i + 1]?.t ?? line.end) - wd.t, i, n: words.length, lt, ex, T, fs, st, hl: !!st.hl?.includes(i), text: wd.w, lineDur });
          const px = rr(st.seed ?? 5, i, 180, 860), py = lerp(380, 1340, (i + 0.5) / words.length) + rr(st.seed ?? 5, i + 30, -60, 60);
          return (
            <div key={i} style={{ position: "absolute", left: px, top: py, transform: "translate(-50%,-50%)", ...common, fontSize: fs * 1.25, color: st.hl?.includes(i) ? st.accent : i % 2 ? st.accent : st.color, whiteSpace: "nowrap" }}>
              <span style={r.style}>{r.inner}</span>
            </div>
          );
        })}
      </div>
    );
  }

  const isStack = st.s === "stack";
  const isVert = st.s === "vertical";
  const container: React.CSSProperties = {
    position: "absolute", left: x - w / 2, width: w, top: y, transform: `translateY(-50%) rotate(${st.rot ?? 0}deg) ${exitT}`, opacity: exitO,
    display: "flex", flexWrap: isStack ? "nowrap" : "wrap", flexDirection: isStack ? "column" : isVert ? "row-reverse" : "row",
    justifyContent: isVert ? "center" : st.align === "left" ? "flex-start" : st.align === "right" ? "flex-end" : "center",
    alignItems: isStack ? (st.align === "left" ? "flex-start" : st.align === "right" ? "flex-end" : "center") : isVert ? "flex-start" : "baseline",
    columnGap: isVert ? fs * 0.25 : fs * 0.26, rowGap: fs * 0.02, ...common,
  };
  if (isVert) container.height = h;

  const hero = st.hero === false || NO_HERO.includes(st.s) ? -1 : st.hero ?? autoHero(words);
  const body = words.map((wd, i) => {
    const isHero = i === hero;
    const r = renderWord({ wt: T - wd.t, wdur: (words[i + 1]?.t ?? line.end) - wd.t, i, n: words.length, lt, ex, T, fs, st, hl: !!st.hl?.includes(i) || isHero, text: wd.w, lineDur });
    const col = st.hl?.includes(i) || isHero ? st.accent : undefined;
    const heroFx: React.CSSProperties = isHero && st.s !== "karaoke" && st.s !== "outline"
      ? { fontSize: (r.style.fontSize as number) ?? fs * 1.16, textShadow: `${textShadow ? textShadow + ", " : ""}0 0 ${(fs * 0.28).toFixed(0)}px ${st.accent}` }
      : {};
    const el = (
      <span style={{ ...r.style, ...heroFx, color: r.style.color ?? col, writingMode: isVert ? "vertical-rl" : undefined, textOrientation: isVert ? "upright" : undefined, fontSize: heroFx.fontSize ?? (r.style.fontSize as number) ?? (isVert ? fs * 0.8 : undefined), alignSelf: isStack ? (st.align ? undefined : i % 2 ? "flex-end" : "flex-start") : undefined }}>
        {r.inner}
      </span>
    );
    const wt = T - wd.t;
    const punch = isHero && wt >= 0 ? 1 + 0.22 * Math.exp(-wt / 0.09) : 1;
    const wrapped = isHero ? (
      <span style={{ display: "inline-block", position: "relative", transform: `scale(${punch.toFixed(3)})` }}>
        {el}
        <Sparks wt={wt} fs={fs} c1={st.accent} c2={C.paper} />
      </span>
    ) : el;
    return r.wrap ? <span key={i} style={{ display: "inline-block", ...r.wrap }}>{wrapped}</span> : <React.Fragment key={i}>{wrapped}</React.Fragment>;
  });
  const plateOn = (st.plate ?? (NO_PLATE.includes(st.s) || st.bg ? "none" : "shade")) === "shade";
  const estLines = isStack ? words.length : Math.max(1, Math.ceil((text.length * fs * FONTS[font][2] * (upper ? 1.08 : 1)) / w));
  const plateH = estLines * fs * lh + fs * 1.3;
  const plate = plateOn ? (
    <div style={{ position: "absolute", left: x - w * 0.7, width: w * 1.4, top: y - plateH / 2, height: plateH, opacity: clamp(lt / 0.2) * exitO, background: "radial-gradient(ellipse closest-side, rgba(6,4,5,0.66) 0%, rgba(6,4,5,0.42) 55%, rgba(6,4,5,0) 100%)", pointerEvents: "none" }} />
  ) : null;

  if (st.s === "bubble" && st.sprite) {
    const s = easeOutBack(clamp(lt / 0.25), 2);
    const bw = w * (st.spriteW ?? 1.3);
    return (
      <div style={{ position: "absolute", left: x - w / 2, width: w, top: y, transform: `translateY(-50%) scale(${Math.max(0, s)}) rotate(${st.rot ?? -3}deg) ${exitT}`, opacity: exitO }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 0, height: 0 }}>
          <Sp n={st.sprite} x={0} y={-(st.dy ?? 0)} w={bw} sy={st.spriteH ?? 1} />
        </div>
        <div style={{ position: "relative", display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: fs * 0.25, ...common, textShadow: "none", WebkitTextStroke: "0px transparent" }}>{body}</div>
      </div>
    );
  }
  if (st.s === "bubble") {
    const s = easeOutBack(clamp(lt / 0.25), 2);
    return (
      <div style={{ position: "absolute", left: x - w / 2, width: w, top: y, transform: `translateY(-50%) scale(${Math.max(0, s)}) rotate(${st.rot ?? -3}deg) ${exitT}`, opacity: exitO }}>
        <div style={{ background: st.bgColor ?? C.paper, border: `8px solid ${C.ink}`, borderRadius: 60, padding: "36px 40px", display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: fs * 0.25, ...common, textShadow: "none", WebkitTextStroke: "0px transparent" }}>{body}</div>
        <div style={{ position: "absolute", left: w * 0.25, bottom: -64, width: 0, height: 0, borderLeft: "30px solid transparent", borderRight: "50px solid transparent", borderTop: `72px solid ${C.ink}` }} />
      </div>
    );
  }
  if (st.bg === "box" || st.bg === "band") {
    return (
      <div style={{ ...container, background: st.bgColor ?? C.ink, padding: st.bg === "box" ? `${fs * 0.15}px ${fs * 0.3}px` : `${fs * 0.1}px 0`, left: st.bg === "band" ? -60 : container.left, width: st.bg === "band" ? W + 120 : w }}>
        {body}
      </div>
    );
  }
  return (
    <>
      {plate}
      <div style={container}>{body}</div>
    </>
  );
};

export const LyricsLayer: React.FC<{ T: number; styles: Record<number, LStyle>; fallback: (l: Line) => LStyle }> = ({ T, styles, fallback }) => {
  const out: React.ReactNode[] = [];
  LINES.forEach((l, k) => {
    const st = styles[l.id] ?? fallback(l);
    if (st.hide) return;
    const tail = st.tail ?? 0.22;
    const next = LINES[k + 1];
    const lastWord = l.words[l.words.length - 1].t;
    // finish leaving before the next line arrives, but keep the last word up for a beat
    const end = next ? Math.max(lastWord + 0.18, Math.min(l.end, next.start - tail)) : l.end;
    const lead = st.lead ?? 0.06;
    if (T >= l.start - lead && T <= end + tail + 0.02) out.push(<LyricLine key={l.id} line={{ ...l, end }} st={{ ...st, tail }} T={T} />);
  });
  return <>{out}</>;
};
