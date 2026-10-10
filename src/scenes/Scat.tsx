import React, { useContext } from "react";
import { C } from "../lib/constants";
import { ff } from "../lib/fonts";
import { clamp, decay, easeOutBack, hash, prog, rr } from "../lib/math";
import { AUDIO, bass, bassHit, beatCount, beatPulse, hat, hitPulse, lastIdx } from "../lib/audio";
import { LINES, wt } from "../lib/lyrics";
import { Fill, Svg, Glow, SceneFC } from "./kit";
import { Kanji, Halftone, Rays, Rain, Stars, Shock, Seigaiha } from "../assets/Fx";
import { RenderAt } from "../ctx";
import { Sp, SpRain, SpDrift, SpriteName, pop, stamp, sway } from "../sprite/Sp";
import { wrap } from "./Intro";

const scatStarts = (a: number, b: number) => LINES.filter((l) => l.kind === "scat" && l.start >= a && l.start < b).map((l) => l.start);

type Panel = { x: number; y: number; w: number; h: number; bg: string; n: SpriteName; sw: number; spin?: number };
const PANELS: Panel[] = [
  { x: 30, y: 230, w: 500, h: 520, bg: C.red, n: "tomoe", sw: 380, spin: 200 },
  { x: 550, y: 230, w: 500, h: 520, bg: C.blue, n: "record_tomoe", sw: 440, spin: 300 },
  { x: 30, y: 770, w: 1020, h: 480, bg: C.paper, n: "ronin_red_attack", sw: 700 },
  { x: 30, y: 1270, w: 500, h: 520, bg: C.navy, n: "speaker_blue", sw: 260 },
  { x: 550, y: 1270, w: 500, h: 520, bg: C.red2, n: "burst_cream", sw: 460, spin: 40 },
];

/** 205.45 → 213.4  manga page: a panel fills in with every scat phrase */
export const ComicPanels: SceneFC = ({ T }) => {
  const starts = scatStarts(205, 214);
  const n = starts.filter((s) => T >= s - 0.05).length;
  const chicka = [57, 61].map((id) => wt(id, 0)).filter((s) => T >= s - 0.05).pop();
  return (
    <Fill bg={C.ink}>
      {PANELS.map((p, k) => {
        const on = n > k;
        const kk = n > 5 ? (k + n) % 5 : k;
        const q = PANELS[kk];
        const pk = on ? easeOutBack(clamp((T - (starts[Math.min(k, starts.length - 1)] ?? T)) / 0.25)) : 0;
        return (
          <div key={k} style={{ position: "absolute", left: p.x, top: p.y, width: p.w, height: p.h, border: `10px solid ${on ? C.paper : C.coal}`, background: on ? q.bg : "transparent", overflow: "hidden", boxSizing: "border-box" }}>
            {on && (
              <>
                <Halftone color={C.ink} size={18} dot={24} opacity={0.2} />
                <Sp n={q.n} x={p.w / 2} y={p.h / 2} w={q.sw} s={Math.max(0.01, pk) * (1 + (q.n === "speaker_blue" ? bass(T) * 0.08 : 0))} r={q.spin ? T * q.spin : 0} />
              </>
            )}
          </div>
        );
      })}
      {chicka !== undefined && T - chicka < 1.3 && (
        <>
          <Sp n="word_chickawah" x={540} y={1010} w={900} s={stamp(T, chicka, 0.12)} r={-5} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 1160, textAlign: "center", fontFamily: ff("bangers"), fontSize: 110, color: C.paper, WebkitTextStroke: `10px ${C.ink}`, paintOrder: "stroke fill", transform: `rotate(-5deg) scale(${pop(T, chicka + 0.45)})` }}>CHICKA-NOW!</div>
        </>
      )}
    </Fill>
  );
};

/** 213.4 → 218.6  turntablist scratch */
export const TurntableScene: SceneFC = ({ T }) => {
  const scratch = Math.sin(T * 14) * 40 * (0.4 + hat(T)) + Math.sin(T * 5.3) * 30;
  return (
    <Fill bg={C.ink}>
      <Svg>
        {Array.from({ length: 30 }).map((_, k) => (
          <line key={k} x1={0} y1={k * 70} x2={1080} y2={k * 70} stroke={C.red2} strokeWidth={2} opacity={0.5} />
        ))}
        <Shock cx={540} cy={1000} p={(T * 1.6) % 1} R={640} color={C.cyan} width={10} />
      </Svg>
      <Sp n="record_red" x={540} y={1000} w={900} r={T * 150 + scratch} glow={C.red} glowR={30} />
      <Sp n="tonearm2" x={930} y={470} h={620} ax={0.52} ay={0.08} r={10} />
      <Sp n="faders" x={170} y={1580} w={220} r={-6} />
      <Sp n="knobs2" x={930} y={1600} w={180} r={6} />
      <Kanji ch="回転" x={540} y={330} size={170} color={C.red} font="jpDela" spacing={20} />
    </Fill>
  );
};

/** 218.6 → 223.8  VHS rewind through everything so far */
export const Rewind: SceneFC = ({ t, T }) => {
  const renderAt = useContext(RenderAt);
  const src = 205 - t * 34 - Math.sin(t * 2) * 3;
  const fr = Math.floor(T * 30);
  return (
    <Fill bg="#000">
      <div style={{ position: "absolute", left: 60, top: 300, width: 960, height: 1240, overflow: "hidden", borderRadius: 50, border: `16px solid ${C.coal}` }}>
        <div style={{ position: "absolute", left: -60, top: -340, width: 1080, height: 1920, transform: "scale(0.9)", transformOrigin: "600px 960px" }}>{renderAt(Math.max(0.5, src))}</div>
        {Array.from({ length: 3 }).map((_, k) => (
          <div key={k} style={{ position: "absolute", left: 0, right: 0, top: ((hash(fr + k) * 1300 + t * 900 * (k + 1)) % 1300) - 40, height: 26 + k * 10, background: "rgba(255,255,255,0.35)", mixBlendMode: "overlay" }} />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0 3px, transparent 3px 6px)" }} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 360, fontFamily: ff("spacemono"), fontSize: 64, color: "#fff", textShadow: `3px 0 ${C.red}, -3px 0 ${C.cyan}` }}>◀◀ REW</div>
      <div style={{ position: "absolute", left: 120, top: 1430, fontFamily: ff("spacemono"), fontSize: 48, color: "#fff", opacity: 0.85 }}>
        {`${String(Math.floor(src / 60)).padStart(2, "0")}:${String(Math.floor(src % 60)).padStart(2, "0")}`}
      </div>
      <Sp n="cassette" x={880} y={1600} w={260} r={-8} o={0.9} />
    </Fill>
  );
};

/** 223.8 → 229.0  solo on tape: the cassette rocks on every accent */
export const CassetteSolo: SceneFC = ({ t, T }) => {
  const h = hitPulse(T, 0.15);
  return (
    <Fill bg={C.navy}>
      <Svg>
        <Seigaiha r={64} c1={C.blue2} c2={C.blue} bg={C.navy} dx={-T * 40} opacity={0.6} />
      </Svg>
      <Sp n="streak_red_long" x={wrap(1400 - t * 900, 2400, 700)} y={560} w={1100} blend="screen" />
      <Sp n="glitch" x={wrap(-200 + t * 700, 2400, 700)} y={1500} w={1000} blend="screen" />
      <Sp n="cassette" x={540} y={1000} w={960} r={-6 + Math.sin(T * 3) * 3 + h * 4} s={1 + h * 0.04} />
      <Sp n="vu" x={540} y={1560} w={300} r={0} style={{ clipPath: `inset(${(1 - clamp(0.25 + bass(T))) * 100}% 0 0 0)` }} />
    </Fill>
  );
};

/** 229.0 → 233.2  neon alley in the rain */
export const NeonAlley: SceneFC = ({ t, T }) => (
  <Fill bg="#05060f">
    <Sp n="crescent" x={820} y={420} w={260} glow={C.paper} glowR={30} r={sway(T, 3)} />
    <Sp n="city_b" x={300 - t * 20} y={1500} w={760} ay={1} />
    <Sp n="city_a" x={860 - t * 20} y={1500} w={700} ay={1} />
    <div style={{ position: "absolute", left: 0, top: 1500, width: 1080, height: 420, background: "#05060f" }} />
    <div style={{ position: "absolute", left: 0, top: 1500, width: 1080, height: 420, overflow: "hidden", opacity: 0.35, filter: "blur(3px)" }}>
      <Sp n="city_b" x={300 - t * 20} y={0} w={760} ay={1} sy={-1} skew={Math.sin(T * 3) * 3} />
      <Sp n="city_a" x={860 - t * 20} y={0} w={700} ay={1} sy={-1} skew={Math.sin(T * 3) * 3} />
    </div>
    {[0, 1, 2].map((k) => (
      <Sp key={k} n="lantern" x={150 + k * 390} y={-60 + (k % 2) * 80} h={300} ay={0.02} r={sway(T, 5, 1, k)} glow={C.red} glowR={60} />
    ))}
    <Svg>
      <Rain t={T} n={150} color={C.cyan} />
    </Svg>
  </Fill>
);

/** 233.2 → 244.5  scat over the stacks: the speaker swaps every two phrases */
export const WooferFeed: SceneFC = ({ T }) => {
  const starts = scatStarts(233, 245);
  const i = Math.max(0, starts.filter((s) => T >= s - 0.05).length - 1);
  const red = Math.floor(i / 2) % 2 === 1;
  const b = bassHit(T, 0.2);
  return (
    <Fill bg={red ? C.red : C.blue2}>
      <Svg>
        <Rays rot={T * (red ? 20 : -20)} n={26} c1={red ? C.red2 : C.navy} c2={red ? C.red : C.blue2} />
      </Svg>
      <Sp n={red ? "burst_red2" : "burst_blue3"} x={540} y={900} w={1300 + b * 120} r={T * 25} o={0.7} blend="screen" />
      <Sp n={red ? "speaker_red" : "speaker_blue"} x={540} y={900} h={820} s={1 + b * 0.07} sy={1 - b * 0.02} />
      <Halftone color={C.ink} size={22} dot={24} opacity={0.18} />
    </Fill>
  );
};

/** 244.5 → 250.4  keys solo: notes fall around a spinning moon record */
export const NoteFall: SceneFC = ({ t, T }) => (
  <Fill bg={C.navy}>
    <Svg>
      <Glow id="nf-g" cx={540} cy={960} r={800} color={C.blue} o={0.3} />
      <Stars n={60} t={T} />
    </Svg>
    <Sp n="record_moon" x={540} y={960} w={880} r={T * 60} />
    <SpRain names={["note_red", "note_blue", "note_red2", "note_blue2", "note_red3", "note_blue3"]} n={14} t={t + 3} seed={27} size={[90, 170]} speed={300} spin={40} />
    <Sp n="spotlight" x={150} y={250} w={340} r={20} />
  </Fill>
);

/** 250.4 → 256.3  koi pond: four koi circle the centre */
export const KoiPond: SceneFC = ({ T }) => {
  const koi: SpriteName[] = ["koi_red", "koi_blue", "koi_red2", "koi_blue2"];
  const hi = lastIdx(AUDIO.bassOnsets, T);
  return (
    <Fill bg="#061033">
      <Svg>
        <Seigaiha r={90} c1="#0a1a4a" c2={C.blue2} bg="#061033" dx={T * 10} opacity={0.4} />
      </Svg>
      {[0, 1].map((k) => {
        const j = hi - k;
        if (j < 0) return null;
        const p = clamp((T - AUDIO.bassOnsets[j]) / 2);
        return p < 1 ? <Sp key={j} n="portal_blue2" x={540} y={960} w={300 + p * 1000} sy={2.2} o={(1 - p) * 0.7} blend="screen" /> : null;
      })}
      {koi.map((n, k) => {
        const a = T * 0.35 + (k / 4) * Math.PI * 2;
        return <Sp key={n} n={n} x={540 + Math.cos(a) * 300} y={960 + Math.sin(a) * 420} w={480} r={(a * 180) / Math.PI + 90} />;
      })}
      <Sp n="sakura" x={540} y={960} w={220} r={-T * 20} />
      <SpDrift names={["petal_a", "petal_b", "sakura2"]} n={10} t={T} seed={29} size={[40, 90]} rise={30} wind={20} spin={60} />
    </Fill>
  );
};

/** 256.3 → 264.3  "Bmm-ts, bmm-bmm-ts!" — the boombox goes off */
export const BoomboxScene: SceneFC = ({ T }) => {
  const h = hitPulse(T, 0.12);
  const hi = lastIdx(AUDIO.hits, T);
  const fx: React.ReactNode[] = [];
  const names: SpriteName[] = ["bolt_red4", "note_red2", "starburst_red", "note_blue2", "bolt_red", "star8_blue"];
  for (let j = hi; j >= Math.max(0, hi - 6); j--) {
    const dt = T - AUDIO.hits[j];
    if (dt > 1) break;
    const a = -Math.PI / 2 + rr(51, j, -1.3, 1.3);
    fx.push(<Sp key={j} n={names[j % names.length]} x={540 + Math.cos(a) * (200 + dt * 760)} y={1180 + Math.sin(a) * (200 + dt * 760)} w={rr(52, j, 120, 210)} r={rr(53, j, -50, 50) + dt * 120} o={1 - dt} />);
  }
  return (
    <Fill bg={C.red}>
      <Svg>
        <Seigaiha r={70} c1={C.red2} c2={C.hot} bg={C.red} dx={T * 30} opacity={0.5} />
      </Svg>
      <Sp n="burst_cream" x={540} y={1180} w={1300 + h * 100} r={T * 20} o={0.9} />
      {fx}
      <Sp n="boombox2" x={540} y={1580} w={980} ay={1} sx={1 + h * 0.05} sy={1 - h * 0.08} r={Math.sin(T * 4.6) * 2} />
    </Fill>
  );
};
