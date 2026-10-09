import React from "react";
import { C } from "../lib/constants";
import { clamp, decay, easeIn, easeInOut, easeOut, prog, rr } from "../lib/math";
import { AUDIO, bass, beatPulse, bassHit, hat, mid, rms, lastIdx, hitPulse } from "../lib/audio";
import { Fill, Svg, Cam, Glow, SceneFC } from "./kit";
import { Samurai } from "../assets/Samurai";
import { Sunflower, Petal } from "../assets/Japan";
import { Kanji, Smoke, Enso, Paper, Rays, Stars, SpeedLines, Shock, Embers, Starburst, Tex } from "../assets/Fx";

/** 170.6 → 177.0 drums vanish: moon on a still pond, Rhodes ripples */
export const Ripples: SceneFC = ({ t, T }) => {
  const hits = AUDIO.bassOnsets.filter((h) => h > 170.4 && h <= T).slice(-6);
  const leafY = 200 + easeOut(clamp(t / 4.2)) * 1000;
  return (
    <Fill bg={C.navy}>
      <Svg>
        <rect width={1080} height={1920} fill={C.navy} />
        <Stars n={60} t={T} h={900} />
        <circle cx={540} cy={520} r={150} fill={C.paper} />
        <rect y={940} width={1080} height={980} fill="#040a22" />
        <ellipse cx={540} cy={1300} rx={150} ry={40} fill={C.paper} opacity={0.5} />
        {hits.map((h, k) => (
          <ellipse key={k} cx={540 + rr(3, Math.round(h * 10), -260, 260)} cy={1300 + rr(4, Math.round(h * 10), -160, 300)} rx={(T - h) * 280} ry={(T - h) * 60} fill="none" stroke={k % 2 ? C.cyan : C.paper} strokeWidth={4} opacity={clamp(1 - (T - h) / 2.2)} />
        ))}
        {leafY < 1200 && <Petal x={540 + Math.sin(t * 2) * 80} y={leafY} s={2.4} rot={Math.sin(t * 3) * 40} fill={C.red} />}
        {leafY >= 1200 && <Petal x={540 + Math.sin(4.2 * 2) * 80} y={1200} s={2.4} rot={60} fill={C.red} />}
      </Svg>
      <Smoke t={T} n={4} color={C.cyan} opacity={0.14} y={900} spread={600} size={1000} rise={8} />
      <Kanji ch="静" x={900} y={300} size={180} color={C.paper} font="jpBrush" opacity={0.45} />
    </Fill>
  );
};

/** Somewhere between the silence and the sound — split horizon */
export const Horizon: SceneFC = ({ t, T }) => {
  const wave: string[] = [];
  for (let i = 0; i <= 90; i++) {
    const u = i / 90;
    const tt = T - (1 - u) * 2.2;
    const a = rms(tt) * 260 + bass(tt) * 120;
    const y = 1300 + Math.sin(u * 80 + T * 10) * a;
    wave.push(`${i ? "L" : "M"}${(u * 1080).toFixed(1)},${y.toFixed(1)}`);
  }
  return (
    <Fill bg={C.ink}>
      <Svg>
        <rect width={1080} height={960} fill="#000" />
        <circle cx={540} cy={480} r={6} fill={C.paper} />
        <rect y={960} width={1080} height={960} fill={C.red} />
        <path d={wave.join(" ")} stroke={C.ink} strokeWidth={10} fill="none" />
        <path d={wave.join(" ")} stroke={C.cyan} strokeWidth={3} fill="none" transform="translate(0,14)" opacity={0.7} />
        <line x1={0} y1={960} x2={1080} y2={960} stroke={C.paper} strokeWidth={4} />
      </Svg>
      <Kanji ch="無" x={160} y={480} size={150} color={C.paper} font="jpBrush" opacity={0.35} />
      <Kanji ch="音" x={920} y={1500} size={180} color={C.ink} font="jpBrush" opacity={0.8} />
    </Fill>
  );
};

/** There's a little piece of heaven underground */
export const HeavenUnder: SceneFC = ({ t, T }) => {
  const reveal = easeInOut(clamp(t / 1.6));
  return (
    <Fill bg={C.ink}>
      <Cam y={-reveal * 300}>
        <Svg>
          <rect width={1080} height={700} fill={C.navy} />
          <Stars n={40} t={T} h={600} />
          <rect y={600} width={1080} height={1700} fill={C.ink} />
          <Samurai x={540} y={602} s={0.5} t={T} rim={C.blue} />
          <path d="M80,900 Q540,700 1000,900 Q1060,1500 820,1950 L260,1950 Q20,1500 80,900 Z" fill="#06143d" />
          <Glow id="hu-g" cx={540} cy={1450} r={520} color={C.cyan} o={0.55} />
          {Array.from({ length: 10 }).map((_, k) => (
            <path key={k} d={`M${200 + k * 70},700 q ${rr(1, k, -60, 60)},${150} ${rr(2, k, -100, 100)},${300 + rr(3, k, 0, 200)}`} stroke={C.ink} strokeWidth={8} fill="none" />
          ))}
          <Sunflower x={540} y={1380} s={0.75} rot={T * 12} t={T} stem={C.blue2} />
        </Svg>
        <Embers t={T} n={30} colors={[C.cyan, C.paper]} rise={50} />
      </Cam>
    </Fill>
  );
};

/** You hear that? … dum dum … finger snaps */
export const HearThat: SceneFC = ({ t, T }) => {
  const bassRings = AUDIO.bassOnsets.filter((h) => h > 187.2 && h <= T).slice(-5);
  const snaps = AUDIO.hits.filter((h) => h > 188.5 && h <= T).slice(-6);
  return (
    <Fill bg="#020203">
      <Svg>
        {bassRings.map((h, k) => (
          <circle key={k} cx={540} cy={960} r={60 + (T - h) * 600} fill="none" stroke={C.red} strokeWidth={14 * clamp(1 - (T - h) / 1.4)} opacity={clamp(1 - (T - h) / 1.4)} />
        ))}
        {snaps.map((h, k) => {
          const x = rr(5, Math.round(h * 100), 200, 880), y = rr(6, Math.round(h * 100), 400, 1400);
          const a = clamp(1 - (T - h) / 0.5);
          return <Starburst key={k} cx={x} cy={y} r1={10 * a} r2={70 * a} n={8} fill={C.paper} stroke="none" />;
        })}
      </Svg>
      <Kanji ch="聞" x={540} y={960} size={600} color={C.blue} font="jpBrush" opacity={0.12} />
    </Fill>
  );
};

/** That's the space between the notes — ensō */
export const EnsoSpace: SceneFC = ({ t, T }) => {
  const p = easeInOut(prog(T, 195.3, 197.4));
  const dark = prog(T, 198.5, 202.0);
  const crack = prog(T, 201.2, 202.0);
  return (
    <Fill bg={C.paper}>
      <Paper />
      <div style={{ position: "absolute", inset: 0, background: C.ink, opacity: dark * 0.85 }} />
      <Kanji ch="間" x={540} y={960} size={380} color={C.red} font="jpMincho" opacity={0.18 + dark * 0.4} />
      <Cam r={dark * 40} z={1 + dark * 0.1}>
        <Enso x={540} y={960} size={980} color={dark > 0.5 ? C.paper : C.ink} p={p} rot={-20} />
      </Cam>
      {crack > 0 && (
        <Svg>
          {Array.from({ length: 8 }).map((_, k) => {
            const a = k * 0.8;
            return <path key={k} d={`M540,960 L${540 + Math.cos(a) * 300 * crack},${960 + Math.sin(a) * 300 * crack} L${540 + Math.cos(a + 0.2) * 900 * crack},${960 + Math.sin(a + 0.2) * 900 * crack}`} stroke={C.cyan} strokeWidth={6} fill="none" />;
          })}
        </Svg>
      )}
    </Fill>
  );
};

/** HA! — the paper shatters into a full-band funk break */
export const HaBlast: SceneFC = ({ t, T }) => {
  const shards = Array.from({ length: 22 }).map((_, k) => {
    const a = rr(1, k, 0, Math.PI * 2);
    const v = rr(2, k, 600, 1600);
    const x = 540 + Math.cos(a) * v * t, y = 960 + Math.sin(a) * v * t + 900 * t * t;
    const s = rr(3, k, 60, 200);
    return <polygon key={k} points={`${-s},${-s * 0.4} ${s * 0.8},${-s} ${s * 0.5},${s * 0.9}`} transform={`translate(${x},${y}) rotate(${t * rr(4, k, -500, 500)})`} fill={k % 3 ? C.paper : C.ink} />;
  });
  return (
    <Fill bg={C.red}>
      <Svg>
        <Rays n={28} rot={t * 60} c1={C.red} c2={C.ink} />
        <SpeedLines t={T} n={80} inner={380} color={C.cyan} opacity={0.5} />
        <Shock cx={540} cy={960} p={clamp(t / 0.6)} R={1400} color={C.paper} width={90} />
        {shards}
      </Svg>
      <Kanji ch="ハッ" x={540} y={1580} size={280} color={C.paper} font="jpDela" rot={-8} />
    </Fill>
  );
};
