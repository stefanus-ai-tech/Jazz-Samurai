import React from "react";
import { C } from "../lib/constants";
import { clamp, decay, easeOut, easeOutBack, prog } from "../lib/math";
import { AUDIO, beatCount, beatPhase, beatPulse, lastIdx } from "../lib/audio";
import { wt } from "../lib/lyrics";
import { Fill, Svg, Glow, SceneFC } from "./kit";
import { Rays, Smoke, Stars, Halftone } from "../assets/Fx";
import { Sp, SpRain, SpDrift, Glint, SpriteName, pop, stamp, sway } from "../sprite/Sp";
import { wrap } from "./Intro";

const NightSky: React.FC<{ id: string; T: number; low?: string }> = ({ id, T, low = C.blood }) => (
  <Svg>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#03061a" />
        <stop offset="0.62" stopColor={C.navy} />
        <stop offset="0.9" stopColor={low} />
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill={`url(#${id})`} />
    <Stars n={80} t={T} h={1200} />
  </Svg>
);

/** 52.6 → 55.3  "Black silk, black shoes, midnight stroll" */
export const Midnight: SceneFC = ({ t, T }) => {
  const ph = beatPhase(T);
  return (
    <Fill bg={C.navy}>
      <NightSky id="mn-sky" T={T} />
      <Sp n="crescent_cloud" x={800} y={330} w={460} glow={C.paper} glowR={40} r={sway(T, 2)} />
      <Sp n="city_small" x={540} y={1600} w={1200} ay={1} filter="brightness(0.6)" />
      <div style={{ position: "absolute", left: 0, top: 1590, width: 1080, height: 400, background: C.ink }} />
      <Sp n="ronin_blue_stand" x={180 + t * 150} y={1730 - Math.abs(Math.sin(ph * Math.PI)) * 14} h={640} ay={1} r={Math.sin(ph * Math.PI * 2) * 1.5} />
      {[0, 1].map((k) => (
        <Sp key={k} n="lantern" x={110 + k * 860} y={-40} h={340} ay={0.02} r={sway(T, 5, 1, k)} glow={C.red} glowR={50} />
      ))}
    </Fill>
  );
};

/** 55.3 → 58.2  "Got a little bit of jazz in a samurai soul" */
export const JazzSoul: SceneFC = ({ t, T }) => (
  <Fill bg={C.ink}>
    <Svg>
      <Glow id="js-g" cx={540} cy={860} r={800} color={C.blue} o={0.4} />
    </Svg>
    <Sp n="record_tomoe" x={540} y={860} w={1000} r={T * 120} s={1 + beatPulse(T) * 0.02} />
    <SpDrift names={["note_red", "note_blue", "note_red3", "note_blue3"]} n={8} t={T} seed={5} size={[90, 150]} rise={160} />
    <Sp n="ronin_red_scarf" x={540} y={1700} h={900} ay={1} sy={1 + Math.sin(T * 2) * 0.006} />
    <Sp n="hanko_samurai" x={860} y={1320} w={230} s={stamp(T, wt(10, 7))} r={8} />
  </Fill>
);

/** 58.2 → 60.85  "Blade on my back but my hands stay clean" */
export const BladeDraw: SceneFC = ({ t, T }) => {
  const clean = wt(11, 8);
  const sweep = easeOut(prog(t, 0, 0.7));
  const blade = { n: "katana" as const, x: 540 + (1 - sweep) * 900, y: 780, w: 1300, r: -32 + (1 - sweep) * 30 };
  const flash = decay(T, clean, 0.25);
  return (
    <Fill bg={C.ink}>
      <Svg>
        <Rays rot={T * 6} n={22} c1={C.blood} c2={C.ink} />
      </Svg>
      <Sp n="ronin_blue_crouch" x={540} y={1500} w={1000} ay={1} o={0.9} />
      <Sp {...blade} glow={C.red} glowR={30} />
      <Glint {...blade} p={prog(t, 0.7, 1.3)} />
      <Sp n="slash_a" x={560} y={760} w={1200} s={pop(T, clean, 0.18)} r={-10} blend="screen" />
      <SpDrift names={["petal_a", "petal_b", "sakura2"]} n={10} t={T} seed={7} size={[50, 110]} rise={-120} wind={40} spin={160} o={clamp((T - clean) / 0.2)} />
      <div style={{ position: "absolute", inset: 0, background: C.paper, opacity: flash * 0.8 }} />
    </Fill>
  );
};

/** 60.85 → 63.2  "Walkin' through the smoke like a fever dream" */
export const FeverSmoke: SceneFC = ({ t, T }) => (
  <Fill bg={C.blood}>
    <Svg>
      <Glow id="fs-g" cx={540} cy={1100} r={900} color={C.red} o={0.5} />
    </Svg>
    <Sp n="cloud_jp" x={wrap(200 + t * 90, 1900, 600)} y={700} w={1100} o={0.55} filter="blur(3px)" />
    <Sp n="ronin_red_stand" x={540} y={1560} h={780} ay={1} o={0.75 + 0.2 * Math.sin(T * 3)} filter={`hue-rotate(${Math.sin(T * 2) * 25}deg) blur(${1 + Math.sin(T * 2.4)}px)`} />
    <Sp n="clouds_blue" x={wrap(900 - t * 160, 2000, 700)} y={1250} w={1200} o={0.85} />
    <Sp n="clouds_cream" x={wrap(-200 + t * 210, 2100, 700)} y={1480} w={1300} o={0.9} />
    <Smoke t={T} n={6} color={C.paper} opacity={0.18} y={1300} spread={600} size={1000} rise={40} />
  </Fill>
);

/** 63.2 → 65.9  "Low ride, high tide, nowhere to go" */
export const TideWave: SceneFC = ({ t, T }) => {
  const rise = easeOut(prog(t, 0, 2.4));
  return (
    <Fill bg={C.navy}>
      <Svg>
        <defs>
          <linearGradient id="tw-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.navy} />
            <stop offset="0.75" stopColor={C.blood} />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#tw-sky)" />
      </Svg>
      <Sp n="sun_red2" x={540} y={1180 + t * 30} w={760} glow={C.red} glowR={60} />
      <Sp n="waves" x={540 - t * 30} y={1980 - rise * 260} w={1700} ay={1} />
      <Sp n="waves2" x={wrap(400 + t * 120, 2000, 500)} y={1960 - rise * 120} w={1100} ay={1} />
      <Sp n="waves2" x={wrap(1400 + t * 120, 2000, 500)} y={1980 - rise * 120} w={1100} ay={1} flip />
    </Fill>
  );
};

/** 65.9 → 68.5  "Got the whole damn city movin' extra slow" */
export const SlowCity: SceneFC = ({ t, T }) => {
  const layer = (n: SpriteName, x: number, y: number, w: number, o = 1, filter?: string) =>
    [0.5, 0.3, 0.15].map((g, k) => <Sp key={`${n}${x}${k}`} n={n} x={x - k * 26} y={y} w={w} ay={1} o={(k ? g : 1) * o} filter={filter} />);
  return (
    <Fill bg={C.ink}>
      <NightSky id="sc-sky" T={T * 0.3} />
      <Sp n="clock_roman" x={540} y={560} w={640} r={t * 4} o={0.5} />
      {layer("city_c", 600 - t * 14, 1300, 1300, 0.8, "brightness(0.55)")}
      {layer("city_a", 260 - t * 26, 1560, 800)}
      {layer("city_b", 840 - t * 26, 1580, 700)}
      <div style={{ position: "absolute", left: 0, top: 1570, width: 1080, height: 400, background: C.ink }} />
      <Sp n="streak_blue" x={wrap(1200 - t * 200, 2200, 600)} y={1450} w={900} o={0.6} blend="screen" />
    </Fill>
  );
};

/** 68.5 → 71.25  "Clock says twelve but the rhythm says nine" — the clock turns on its side */
export const ClockScene: SceneFC = ({ t, T }) => {
  const nine = wt(15, 7);
  const turn = -90 * easeOutBack(prog(T, nine, nine + 0.35), 2.2);
  const tick = beatPulse(T, 0.12);
  return (
    <Fill bg={C.navy}>
      <Svg>
        <Rays rot={-T * 8} n={24} c1={C.blue2} c2={C.navy} />
      </Svg>
      <Sp n="clocks_cluster" x={180} y={1560} w={300} r={T * 10} o={0.7} />
      <Sp n="pocketwatch" x={900} y={1580} w={260} r={sway(T, 10, 1.5)} o={0.8} />
      <Sp n="clock_kanji2" x={540} y={1000} w={860} r={turn + Math.sin(T * 9) * tick * 2} s={1 + 0.06 * decay(T, wt(15, 2), 0.3)} glow={C.cyan} glowR={30 + tick * 30} />
    </Fill>
  );
};

/** 71.25 → 75.6  "Everybody got a watch, nobody got time" — it rains clocks */
export const RainingWatches: SceneFC = ({ t, T }) => (
  <Fill bg={C.red}>
    <Svg>
      <Rays rot={T * 10} n={26} c1={C.red2} c2={C.red} />
    </Svg>
    <SpRain names={["alarm", "clock_roman", "pocketwatch", "hourglass_tilt", "clock_kanji2", "clocks"]} n={16} t={t + 2} seed={9} size={[170, 330]} speed={480} spin={140} />
    <Halftone color={C.ink} size={20} dot={26} opacity={0.2} />
  </Fill>
);

/** 75.6 → 83.55  "Get down, get down / Ba-da-bum…" — two ronin trade poses on the beat */
export const GetDown: SceneFC = ({ T }) => {
  const b = Math.max(0, beatCount(T) - beatCount(75.6));
  const pose = Math.floor(b / 2) % 2;
  const sw = AUDIO.beats[beatCount(75.6) + Math.floor(b / 2) * 2] ?? 75.6;
  const k = stamp(T, sw, 0.12);
  const downs = [wt(17, 1), wt(17, 3), wt(19, 1), wt(19, 3)];
  const li = lastIdx(downs, T);
  const dk = li >= 0 ? decay(T, downs[li], 0.35) : 0;
  return (
    <Fill bg={pose ? C.blue2 : C.red}>
      <Svg>
        <Rays rot={T * (pose ? -14 : 14)} n={22} c1={pose ? C.navy : C.red2} c2={pose ? C.blue2 : C.red} />
      </Svg>
      <Sp n={pose ? "ronin_blue_crouch" : "ronin_red_attack"} x={540} y={1700} w={1080} ay={1} s={Math.min(k, 1.25)} glow={C.paper} glowR={10} />
      {[160, 920].map((x, j) => (
        <Sp key={j} n="arrow_red" x={x} y={1080 + dk * 90} w={260} r={90} o={0.4 + 0.6 * dk} />
      ))}
      <Halftone color={C.ink} size={20} dot={24} opacity={0.18} />
    </Fill>
  );
};
