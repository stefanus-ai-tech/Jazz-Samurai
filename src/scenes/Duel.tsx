import React from "react";
import { C } from "../lib/constants";
import { clamp, decay, easeIn, easeInOut, prog } from "../lib/math";
import { AUDIO, barCount, barPulse, bassHit, hitPulse, lastIdx } from "../lib/audio";
import { Fill, Svg, Cam, Glow, SceneFC } from "./kit";
import { Rays, SpeedLines, Halftone, Stars, Shock } from "../assets/Fx";
import { Sp, SpRain, SpDrift, Glint, pop, stamp, sway } from "../sprite/Sp";
import { wrap } from "./Intro";

const Dusk: React.FC<{ id: string }> = ({ id }) => (
  <Svg>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={C.blood} />
        <stop offset="0.7" stopColor={C.red2} />
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill={`url(#${id})`} />
  </Svg>
);

/** 124.4 → 129.6  standoff under the red sun, wind full of leaves */
export const DuelWide: SceneFC = ({ t, T }) => (
  <Fill bg={C.blood}>
    <Cam z={1 + t * 0.02} py={1400}>
      <Dusk id="dw-sky" />
      <Sp n="sun_red3" x={540} y={1000} w={1050} filter="brightness(1.15)" />
      <div style={{ position: "absolute", left: 0, top: 1460, width: 1080, height: 500, background: C.ink }} />
      <Sp n="ronin_red_stand" x={260} y={1490} h={720} ay={0.985} />
      <Sp n="ronin_blue_stand" x={830} y={1490} h={720} ay={0.985} flip />
    </Cam>
    <SpRain names={["maple_red2", "petal_a", "petal_b", "sakura2"]} n={14} t={t} seed={12} size={[50, 120]} speed={260} wind={-260} spin={200} />
  </Fill>
);

/** 129.6 → 134.8  close-ups traded on every bar */
export const DuelClose: SceneFC = ({ T }) => {
  const b = barCount(T);
  const red = b % 2 === 0;
  const k = barPulse(T, 0.3);
  return (
    <Fill bg={red ? C.red : C.blue2}>
      <Svg>
        <SpeedLines t={T} n={120} inner={520} color={C.ink} opacity={0.6} />
      </Svg>
      {red ? (
        <Sp n="ronin_red_stand" x={600} y={420} h={3000} ay={0.08} s={1 + k * 0.04} />
      ) : (
        <Sp n="ronin_blue_stand" x={500} y={420} h={3000} ay={0.08} s={1 + k * 0.04} flip />
      )}
      <Sp n="katana" x={540} y={1500} w={1500} r={red ? -14 : 14} o={0.9} />
      <Glint n="katana" x={540} y={1500} w={1500} r={red ? -14 : 14} p={prog(T, (AUDIO.downbeats[b] ?? T) + 0.1, (AUDIO.downbeats[b] ?? T) + 0.6)} />
      <Halftone color={C.ink} size={22} dot={26} opacity={0.2} />
    </Fill>
  );
};

/** 134.8 → 140  the shrine: torii, bamboo, scarves on the wind */
export const ShrineWind: SceneFC = ({ t, T }) => (
  <Fill bg={C.navy}>
    <Svg>
      <Glow id="sw-g" cx={540} cy={600} r={700} color={C.paper} o={0.15} />
      <Stars n={60} t={T} h={1000} />
    </Svg>
    <Sp n="moon2" x={540} y={560} w={520} glow={C.paper} glowR={40} />
    <Sp n="torii" x={540} y={1500} w={900} ay={1} />
    <div style={{ position: "absolute", left: 0, top: 1490, width: 1080, height: 500, background: C.ink }} />
    <Sp n="scarf_red" x={wrap(1500 - t * 520, 2600, 800)} y={900 + Math.sin(T * 2) * 60} w={900} r={sway(T, 6)} />
    <Sp n="scarf_blue" x={wrap(2400 - t * 440, 2600, 800)} y={1200 + Math.sin(T * 2.4) * 60} w={860} r={sway(T, 6, 1.2, 2)} />
    <Sp n="bamboo_blue" x={110} y={1960} h={1100} ay={1} r={sway(T, 3)} flip />
    <Sp n="bamboo_blue" x={980} y={1960} h={1200} ay={1} r={sway(T, 3, 1, 1)} />
    {[0, 1].map((k) => (
      <Sp key={k} n="lantern" x={300 + k * 480} y={-30} h={300} ay={0.02} r={sway(T, 5, 1, k)} glow={C.red} glowR={50} />
    ))}
  </Fill>
);

/** 140 → 144.92  the charge: both ronin rush in on speed lines */
export const DuelCharge: SceneFC = ({ t, T, d }) => {
  const p = easeIn(prog(t, 0, d));
  const h = hitPulse(T, 0.1);
  return (
    <Fill bg={C.red}>
      <Svg>
        <Rays rot={T * 50} n={30} c1={C.hot} c2={C.red} />
      </Svg>
      {Array.from({ length: 8 }).map((_, k) => (
        <Sp key={k} n={k % 2 ? "speed_blue" : "speed_navy"} x={wrap(k * 300 - t * (900 + k * 80), 1800, 400)} y={300 + k * 190} w={700} o={0.8} />
      ))}
      <Sp n="ronin_red_attack" x={170 + p * 330} y={1000 - h * 12} w={760} />
      <Sp n="ronin_blue_crouch" x={910 - p * 330} y={1200 + h * 12} w={720} />
      <Halftone color={C.ink} size={20} dot={22} opacity={0.15} />
    </Fill>
  );
};

/** 144.92 → 146.8  aftermath of the clash */
export const Aftermath: SceneFC = ({ t, T }) => (
  <Fill bg={C.paper}>
    <Svg>
      <Rays rot={-10} n={24} c1="#e8d7b8" c2={C.paper} />
      <Shock cx={540} cy={900} p={clamp(t / 0.7)} R={1300} color={C.red} width={70} />
    </Svg>
    <Sp n="ronin_blue_crouch" x={760} y={1500} w={700} ay={1} r={easeIn(prog(t, 0.6, 1.8)) * 18} o={1 - prog(t, 1.2, 1.8) * 0.6} />
    <Sp n="ronin_red_scarf" x={330} y={1560} h={860} ay={1} />
    <Sp n="slash_big" x={540} y={820} w={1300} s={pop(t, 0, 0.12)} r={-6} />
    <Sp n="hanko_zan" x={860} y={480} w={220} s={stamp(t, 0.5)} r={8} />
    <SpDrift names={["petal_a", "petal_b", "sakura2"]} n={12} t={T} seed={14} size={[50, 110]} rise={-140} wind={30} spin={160} />
  </Fill>
);
