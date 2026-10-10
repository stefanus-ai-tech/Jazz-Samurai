import React, { useContext } from "react";
import { C } from "../lib/constants";
import { clamp, decay, easeIn, easeInOut, easeOut, prog, rr } from "../lib/math";
import { AUDIO, bassHit, beatPulse, lastIdx } from "../lib/audio";
import { wt } from "../lib/lyrics";
import { Fill, Svg, Cam, Glow, SceneFC } from "./kit";
import { Stars, Halftone, Paper } from "../assets/Fx";
import { RenderAt } from "../ctx";
import { Sp, SpDrift, SpriteName, pop, stamp } from "../sprite/Sp";
import { wrap } from "./Intro";

/** 264.3 → 271.6  rooftops at night, comets overhead */
export const Rooftops: SceneFC = ({ t, T }) => {
  const comets: [SpriteName, number, number][] = [["comet", 0.6, 300], ["comet2", 2.4, 520], ["comet3", 4.3, 380], ["comet4", 6.0, 640]];
  return (
    <Fill bg="#03061a">
      <Svg>
        <Stars n={110} t={T} h={1300} />
        <Glow id="rt-g" cx={760} cy={520} r={600} color={C.paper} o={0.15} />
      </Svg>
      <Sp n="moon" x={760} y={520} w={600} glow={C.paper} glowR={60} />
      {comets.map(([n, at, y]) => {
        const p = prog(t, at, at + 1.2);
        return p > 0 && p < 1 ? <Sp key={n} n={n} x={1300 - p * 1700} y={y + p * 380} w={520} r={20} o={Math.sin(p * Math.PI)} blend="screen" /> : null;
      })}
      <Sp n="skyline_jp" x={540 + t * 10} y={1700} w={1700} ay={1} />
      <div style={{ position: "absolute", left: 0, top: 1690, width: 1080, height: 300, background: C.ink }} />
      <Sp n="ronin_red_scarf" x={300} y={1560} h={560} ay={1} />
    </Fill>
  );
};

/** 271.6 → 278.2  the leap across the full moon */
export const MoonLeap: SceneFC = ({ t, T }) => {
  const p = easeInOut(prog(t, 0.8, 4.2));
  const x = -260 + p * 1600, y = 1250 - Math.sin(p * Math.PI) * 600;
  const apex = 0.8 + 3.4 / 2;
  return (
    <Fill bg="#03061a">
      <Svg>
        <Stars n={90} t={T} />
      </Svg>
      <Sp n="moon3" x={540} y={900} w={1150 + t * 20} glow={C.paper} glowR={80} />
      <Sp n="slash_red" x={560} y={720} w={900} s={pop(t, apex, 0.15)} o={1 - prog(t, apex + 0.6, apex + 1.4)} blend="multiply" />
      <Sp n="ronin_red_attack" x={x} y={y} w={760} r={(p - 0.5) * 40} filter="brightness(0.25)" />
      <SpDrift names={["petal_a", "petal_b"]} n={8} t={T} seed={31} size={[40, 90]} rise={-120} wind={-80} spin={140} />
    </Fill>
  );
};

/** 278.2 → 286.5  final chorus: hypnotic spirals */
export const HypnoChorus: SceneFC = ({ T }) => (
  <Fill bg={C.ink}>
    <Sp n="spiral3" x={540} y={960} w={2300} r={T * 50} s={1 + beatPulse(T) * 0.03} />
    <Sp n="spiral_bw" x={540} y={960} w={900} r={-T * 90} o={0.85} filter="brightness(0.5)" />
    <Sp n="tomoe" x={540} y={960} w={300} r={T * 150} s={1 + bassHit(T, 0.2) * 0.12} />
  </Fill>
);

/** 289.6 → 297  "Down, down, down / Feel that sound…" — hyperspace */
export const Hyperspace: SceneFC = ({ t, T }) => {
  const objs: SpriteName[] = ["planet_blue", "comet", "planet_cream", "star8_red2", "record_moon", "star8_blue", "planet_ring", "comet3"];
  return (
    <Fill bg={C.ink}>
      <Svg>
        <Stars n={160} t={T} stretch={0.18} />
      </Svg>
      <Sp n="galaxy" x={540} y={960} w={500 + t * 40} r={T * 30} blend="screen" />
      {objs.map((n, k) => {
        const z = (t * 0.32 + k / objs.length) % 1;
        const a = rr(61, k, 0, Math.PI * 2);
        const d = Math.pow(z, 2.2) * 1300;
        return <Sp key={k} n={n} x={540 + Math.cos(a) * d} y={960 + Math.sin(a) * d * 1.3} w={60 + z * 520} r={(a * 180) / Math.PI} o={clamp(z * 6) * clamp((1 - z) * 6)} />;
      })}
    </Fill>
  );
};

/** 297 → 311.55  "A little less hurry / A little more soul…" — the club */
export const JazzClub: SceneFC = ({ t, T }) => {
  const roll = wt(85, 4);
  const r = easeOut(prog(T, roll - 0.2, roll + 0.6));
  return (
    <Fill bg={C.ink}>
      <Cam z={1.05 + t * 0.006 - r * 0.05} py={1100}>
        <Sp n="stage" x={540} y={1150} w={1500} />
        <Sp n="mic_stand" x={540} y={1550} h={640} ay={1} glow={C.paper} glowR={30} />
        <Sp n="ronin_blue_stand" x={790} y={1580} h={520} ay={1} filter="brightness(0.6)" />
        <Sp n="speaker_red" x={130} y={1500} h={560} s={1 + bassHit(T, 0.2) * 0.05 * r} o={r} />
        <Sp n="speaker_blue" x={960} y={1500} h={580} s={1 + bassHit(T, 0.2) * 0.05 * r} o={r} />
        <SpDrift names={["note_red3", "note_blue3"]} n={6} t={T} seed={33} size={[70, 120]} rise={70} y0={500} y1={1500} o={0.85} />
      </Cam>
    </Fill>
  );
};

/** 311.55 → 318.2  "Dum… ba-dum… / Dum-dum… bow…" — the bass rolls out */
export const BassOutro: SceneFC = ({ T }) => {
  const b = bassHit(T, 0.22);
  return (
    <Fill bg={C.blood}>
      <Halftone color={C.red} size={26} dot={30} opacity={0.3} />
      <Sp n="halftone_ink" x={540} y={900} w={1500} o={0.9} />
      <Sp n="speaker_red" x={540} y={900} h={880} s={1 + b * 0.07} />
      <Sp n="cable" x={540} y={1560} w={820} r={Math.sin(T * 2.5) * 3} />
    </Fill>
  );
};

/** 318.2 → 324  "The secret ain't playing fast. It's knowing when not to play." — the blade goes home */
export const Sheath: SceneFC = ({ t, T, d }) => {
  const p = easeInOut(prog(t, 0.2, d - 1.0));
  // saya mouth sits at x≈900; the blade slides in from the right and is hidden past the mouth
  const sayaW = 500, sayaL = 70, mouth = sayaL + sayaW * 0.95;
  const W = (sayaW * 0.95) / 0.82;
  const left = mouth - W * 0.82 * p;
  const hidden = clamp((mouth - left) / W);
  const click = decay(t, d - 1.0, 0.25);
  return (
    <Fill bg={C.paper}>
      <Paper opacity={1} />
      <Sp n="sun_red3" x={540} y={900} w={760} o={0.92} />
      <div style={{ position: "absolute", inset: 0, transform: `rotate(-8deg) translateY(${click * 6}px)`, transformOrigin: "540px 960px" }}>
        <Sp n="saya" x={sayaL} y={980} w={sayaW} ax={0} />
        <Sp n="katana" x={left} y={972} w={W} ax={0} style={{ clipPath: `inset(0 0 0 ${hidden * 100}%)` }} />
      </div>
      <Sp n="hanko" x={540} y={1460} w={200} s={stamp(t, d - 0.9)} r={-6} />
    </Fill>
  );
};

/** 324 → 333  sunrise over the sea */
export const Sunrise: SceneFC = ({ t, T }) => {
  const up = easeOut(prog(t, 0, 8));
  return (
    <Fill bg={C.navy}>
      <Svg>
        <defs>
          <linearGradient id="sr-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.navy} />
            <stop offset={0.75 - up * 0.3} stopColor={C.red2} />
            <stop offset="1" stopColor={C.gold} />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#sr-sky)" />
      </Svg>
      <Sp n="rising_sun5" x={540} y={1420 - up * 520} w={1500} r={T * 4} o={0.25 * up} blend="screen" />
      <Sp n="sun_red3" x={540} y={1420 - up * 520} w={700} />
      <Sp n="waves" x={540 - t * 12} y={1940} w={1600} ay={1} />
      <Sp n="ronin_red_stand" x={380} y={1460} h={300} ay={1} filter="brightness(0.15)" />
      <Sp n="ronin_blue_stand" x={500} y={1460} h={300} ay={1} filter="brightness(0.15)" />
      <SpDrift names={["petal_a", "petal_b", "sakura2"]} n={8} t={T} seed={35} size={[40, 90]} rise={-90} wind={50} spin={120} />
    </Fill>
  );
};

/** 333.0 → 346.8  recap: every scene flashes by in a film strip, on the bass */
export const Recap: SceneFC = ({ t, T }) => {
  const renderAt = useContext(RenderAt);
  const i = Math.max(0, lastIdx(AUDIO.bassOnsets, T) - lastIdx(AUDIO.bassOnsets, 333.0));
  const moments = [5, 16, 25, 34, 42, 49, 54, 57, 62, 66, 70, 73, 78, 85, 87.5, 90, 93, 96, 99, 102, 105, 118, 127, 131, 137, 142, 145.5, 148, 150.7, 151.8, 154, 156, 158, 160.5, 162, 166, 174, 180, 185, 192, 196.5, 203, 207, 214.5, 226, 231, 236, 247, 252, 260, 268, 274, 282, 288, 292, 300, 314, 320, 330];
  const m = moments[(moments.length - 1 - (i % moments.length) + moments.length) % moments.length];
  const p = decay(T, AUDIO.bassOnsets[lastIdx(AUDIO.bassOnsets, T)] ?? T, 0.25);
  return (
    <Fill bg={C.ink}>
      <div style={{ position: "absolute", left: 110, top: 0, width: 860, height: 1920, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -110, top: 0, width: 1080, height: 1920, transform: `scale(${1 + p * 0.05})`, filter: `sepia(${0.3 + p * 0.4}) contrast(1.15)` }}>{renderAt(m + (t % 1.0))}</div>
        <div style={{ position: "absolute", inset: 0, background: C.red, mixBlendMode: "multiply", opacity: 0.25 }} />
      </div>
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <React.Fragment key={k}>
          <Sp n="filmstrip2" x={55} y={wrap(k * 380 + t * 600, 2280, 200)} h={380} style={{ clipPath: "inset(0 74% 0 0)" }} ax={0.12} />
          <Sp n="filmstrip2" x={1025} y={wrap(k * 380 + t * 600, 2280, 200)} h={380} style={{ clipPath: "inset(0 0 0 74%)" }} ax={0.88} />
        </React.Fragment>
      ))}
    </Fill>
  );
};

/** 346.8 → 350.6  BWOOW — the picture melts down with the bass slide */
export const Bwoow: SceneFC = ({ t }) => {
  const renderAt = useContext(RenderAt);
  const m = easeIn(clamp(t / 3.5));
  return (
    <Fill bg={C.ink}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 0%", transform: `scaleY(${1 + m * 1.8}) scaleX(${1 - m * 0.3}) skewX(${Math.sin(t * 3) * m * 10}deg)`, filter: `hue-rotate(${m * -40}deg) blur(${m * 2}px)` }}>
        {renderAt(324 + 8.9)}
      </div>
      <Svg>
        {Array.from({ length: 14 }).map((_, k) => {
          const x = 40 + k * 78;
          const len = (200 + rr(1, k, 0, 900)) * m;
          return <path key={k} d={`M${x - 30},0 L${x + 30},0 L${x + 22},${len} Q${x},${len + 50} ${x - 22},${len} Z`} fill={k % 3 ? C.red : C.blue} />;
        })}
      </Svg>
    </Fill>
  );
};

/** 350.6 → end: the record stops, the needle lifts, the seal lands */
export const VinylStop: SceneFC = ({ t, T }) => {
  const slow = Math.max(0, 1 - t / 1.6);
  const rot = 200 * (t - (t * t) / 3.2);
  const arm = 8 - 36 * easeInOut(prog(t, 1.4, 2.2));
  const fade = prog(T, 352.4, 353.1);
  return (
    <Fill bg={C.ink}>
      <div style={{ position: "absolute", inset: 0, filter: `saturate(${slow + 0.2})` }}>
        <Svg>
          <Glow id="vs2-g" cx={540} cy={900} r={800} color={C.red} o={0.3 * slow} />
        </Svg>
        <Sp n="vinyl" x={540} y={900} w={880} r={t < 1.6 ? rot : 200 * 0.8} />
        <Sp n="tonearm2" x={905} y={330} h={680} ax={0.52} ay={0.08} r={arm} />
      </div>
      <Sp n="hanko" x={540} y={1480} w={220} s={stamp(t, 1.7)} r={-6} />
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: fade }} />
    </Fill>
  );
};
