import React from "react";
import { C } from "../lib/constants";
import { clamp, decay } from "../lib/math";
import { AUDIO, bass, bassHit, lastIdx } from "../lib/audio";
import { Fill, Svg, Glow, SceneFC } from "./kit";
import { Rays, Paper, Stars, Shock, Enso, Seigaiha } from "../assets/Fx";
import { Sp, SpDrift, pop, sway } from "../sprite/Sp";
import { wrap } from "./Intro";

/** ripples from the last few bass onsets */
const Ripples: React.FC<{ T: number; x: number; y: number; size: number; n?: number; life?: number }> = ({ T, x, y, size, n = 3, life = 2.4 }) => {
  const hi = lastIdx(AUDIO.bassOnsets, T);
  return (
    <>
      {Array.from({ length: n }).map((_, k) => {
        const j = hi - k;
        if (j < 0) return null;
        const p = clamp((T - AUDIO.bassOnsets[j]) / life);
        return p < 1 ? <Sp key={j} n="portal_blue2" x={x} y={y} w={size * (0.3 + p)} sy={1.6} o={(1 - p) * 0.8} blend="screen" /> : null;
      })}
    </>
  );
};

/** 170.6 → 177  instrumental bridge: the koi circle in a dark pond */
export const KoiRipples: SceneFC = ({ T }) => (
  <Fill bg="#040a26">
    <Svg>
      <Seigaiha r={80} c1={C.navy} c2={C.blue2} bg="#040a26" dx={T * 12} opacity={0.35} />
      <Glow id="kr-g" cx={540} cy={960} r={700} color={C.blue} o={0.35} />
    </Svg>
    <Ripples T={T} x={540} y={960} size={1300} n={4} />
    <Sp n="koi_yinyang" x={540} y={960} w={780 * (1 + bass(T) * 0.03)} r={T * 18} />
    <SpDrift names={["petal_a", "petal_b", "sakura2"]} n={9} t={T} seed={22} size={[50, 100]} rise={30} wind={30} spin={60} o={0.9} />
  </Fill>
);

/** 177 → 182.3  "Somewhere between the silence and the sound" — moon on the horizon */
export const Horizon: SceneFC = ({ t, T }) => (
  <Fill bg="#03061a">
    <Svg>
      <Stars n={80} t={T} h={1000} />
      <Glow id="hz-g" cx={540} cy={1000} r={800} color={C.paper} o={0.12} />
    </Svg>
    <Sp n="cloud_jp" x={wrap(300 + t * 40, 2000, 600)} y={620} w={900} o={0.7} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1000, overflow: "hidden" }}>
      <Sp n="moon3" x={540} y={1000 + 60 - t * 18} w={720} glow={C.paper} glowR={40} />
    </div>
    <div style={{ position: "absolute", left: 0, top: 1000, width: 1080, height: 920, background: "#020414" }} />
    <Sp n="moon3" x={540} y={1060 + t * 18} w={720} sy={-0.35} o={0.22} skew={Math.sin(T * 1.5) * 5} filter="blur(4px)" />
    <div style={{ position: "absolute", left: 0, top: 998, width: 1080, height: 4, background: C.paper, opacity: 0.4 }} />
  </Fill>
);

/** 182.3 → 187.5  "There's a little piece of heaven underground" */
export const HeavenUnder: SceneFC = ({ t, T }) => (
  <Fill bg={C.ink}>
    <Svg>
      <rect width={1080} height={760} fill={C.navy} />
      <Stars n={50} t={T} h={700} />
      <Glow id="hu-g" cx={540} cy={1350} r={700} color={C.gold} o={0.35} />
    </Svg>
    <Sp n="skyline_jp" x={540} y={770} w={1400} ay={1} />
    <div style={{ position: "absolute", left: 0, top: 760, width: 1080, height: 40, background: C.coal }} />
    <Sp n="sakura" x={540} y={1330} w={420} r={T * 8} glow={C.hot} glowR={40} />
    {[0, 1, 2, 3].map((k) => (
      <Sp key={k} n="lantern" x={160 + k * 253} y={980 + (k % 2) * 90} h={230} ay={0.02} r={sway(T, 4, 1, k)} glow={C.red} glowR={50} />
    ))}
    <SpDrift names={["petal_a", "petal_b"]} n={10} t={T} seed={24} size={[40, 80]} rise={40} y0={860} y1={1800} o={0.85} />
  </Fill>
);

/** 187.5 → 195.2  "You hear that? / Dum… dum-dum…" */
export const HearThat: SceneFC = ({ T }) => {
  const b = bassHit(T, 0.25);
  return (
    <Fill bg={C.ink}>
      <Svg>
        <Glow id="ht-g" cx={540} cy={960} r={700} color={C.blue} o={0.25 + 0.3 * b} />
      </Svg>
      <Sp n="waveform2" x={170} y={960} w={260} sy={0.6 + bass(T) * 1.6} r={90} o={0.9} />
      <Sp n="waveform_red" x={910} y={960} w={200} sy={0.6 + bass(T - 0.05) * 1.8} r={90} o={0.9} />
      <Sp n="headphones" x={540} y={980} h={880} s={1 + b * 0.05} />
    </Fill>
  );
};

/** 195.2 → 202  "That's the space between the notes." */
export const EnsoSpace: SceneFC = ({ t, T }) => (
  <Fill bg={C.paper}>
    <Paper opacity={1} />
    <Enso x={540} y={960} size={980} color={C.ink} p={clamp(t / 2.5)} rot={-90} />
    <Sp n="note_red2" x={250 - t * 6} y={960} w={180} s={pop(T, 195.6)} r={-8} />
    <Sp n="note_blue2" x={830 + t * 6} y={960} w={180} s={pop(T, 196.2)} r={8} />
  </Fill>
);

/** 202 → 205.45  HA! */
export const HaBlast: SceneFC = ({ t }) => (
  <Fill bg={C.red}>
    <Svg>
      <Rays rot={t * 40} n={28} c1={C.hot} c2={C.red} />
      <Shock cx={540} cy={880} p={clamp(t / 0.6)} R={1200} color={C.paper} width={60} />
    </Svg>
    <Sp n="burst_bubble3" x={540} y={880} w={1100 * (0.6 + 0.4 * Math.min(1, pop(t, 0, 0.2)))} r={-4} />
    <Sp n="bangs" x={900} y={480} w={200} s={pop(t, 0.1)} r={14} />
    <Sp n="starburst2" x={170} y={1330} w={240} s={pop(t, 0.18)} r={t * 50} />
    <Sp n="starburst_red2" x={880} y={1360} w={200} s={pop(t, 0.26)} r={-t * 50} />
    {decay(t, 0, 0.2) > 0.05 && <div style={{ position: "absolute", inset: 0, background: C.paper, opacity: decay(t, 0, 0.2) * 0.6 }} />}
  </Fill>
);
