import React from "react";
import { C } from "../lib/constants";
import { clamp, decay, easeIn, easeOut, prog, rr, n2 } from "../lib/math";
import { AUDIO, bass, beatPulse, bassHit, hat, mid, lastIdx, barCount } from "../lib/audio";
import { Fill, Svg, Cam, Glow, SceneFC } from "./kit";
import { Samurai, HatEyes, KasaHalves } from "../assets/Samurai";
import { Katana } from "../assets/Blade";
import { Grass, PetalStorm, Bamboo } from "../assets/Japan";
import { Kanji, Smoke, SpeedLines, Shock, Stars, Tex } from "../assets/Fx";

const STRIKE = 144.92;

const Field: React.FC<{ T: number; moonR?: number; moonY?: number }> = ({ T, moonR = 520, moonY = 760 }) => (
  <>
    <defs>
      <linearGradient id="du-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={C.navy} />
        <stop offset="1" stopColor={C.blue2} />
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#du-sky)" />
    <Stars n={70} t={T} h={1200} />
    <circle cx={540} cy={moonY} r={moonR} fill={C.red} />
    <circle cx={540} cy={moonY} r={moonR * 1.04} fill="none" stroke={C.hot} strokeWidth={6} opacity={0.5} />
  </>
);

/** 124.4 → 129.6 wide: two ronin on a ridge under the red moon */
export const DuelWide: SceneFC = ({ t, T }) => (
  <Fill bg={C.navy}>
    <Cam z={1 + t * 0.03} py={1300}>
      <Svg>
        <Field T={T} />
        <path d="M-50,1420 Q540,1300 1130,1420 L1130,1920 L-50,1920 Z" fill={C.ink} />
        <Grass t={T} y={1440} n={140} h={130} wind={1.4} />
        <Samurai x={250} y={1360} s={0.95} t={T} sword="waist" wind={1.2} rim={C.blood} />
        <Samurai x={830} y={1360} s={0.95} t={T + 3} sword="waist" hat="topknot" flip wind={1.2} scarf={C.blue} obi={C.blue} rim={C.blood} />
        <PetalStorm t={T} n={26} seed={9} colors={[C.red, C.paper]} wind={260} speed={90} />
      </Svg>
      <Tex src="smokeband.png" color={C.ink} x={((T * 90) % 1900) - 300} y={700} w={1500} h={420} opacity={0.7} />
    </Cam>
    <Kanji ch="決闘" x={120} y={520} size={130} color={C.paper} font="jpMincho" vertical opacity={0.8} />
  </Fill>
);

/** 129.6 → 134.8 close-ups trading on the half bar (bass solo vs wah guitar) */
export const DuelClose: SceneFC = ({ t, T }) => {
  const shot = Math.floor(t / 1.3) % 4;
  const local = t % 1.3;
  const push = 1 + local * 0.05;
  return (
    <Fill bg={C.ink}>
      <Cam z={push}>
        {shot === 0 && (
          <Svg>
            <rect width={1080} height={1920} fill={C.blood} />
            <Katana x={600} y={980} rot={-8} s={1.7} L={700} glint={(local / 1.3)} />
            <circle cx={260} cy={970} r={90} fill={C.ink} />
          </Svg>
        )}
        {shot === 1 && (
          <Svg>
            <HatEyes open={1} glint={bassHit(T)} smirk={0} y={820} iris={C.red} skin={C.navy} />
          </Svg>
        )}
        {shot === 2 && (
          <Svg>
            <rect width={1080} height={1920} fill={C.navy} />
            <g transform="translate(540,2150) scale(3)">
              <Samurai x={0} y={0} t={T} sword="none" scarf={null} walk={Math.sin(T * 2) * 0.3} fill={C.ink} />
            </g>
            <Grass t={T} y={1920} n={70} h={380} fill={C.ink} wind={1.6} />
          </Svg>
        )}
        {shot === 3 && (
          <Svg>
            <rect width={1080} height={1920} fill={C.red} />
            <g transform="translate(900,1700) scale(3.2)">
              <Samurai x={0} y={0} t={T} wind={1.6} scarf={C.ink} sword="none" fill={C.blood} />
            </g>
          </Svg>
        )}
      </Cam>
      <Kanji ch={["刃", "眼", "足", "風"][shot] === "眼" ? "目" : ["刃", "目", "足", "風"][shot]} x={170} y={300} size={180} color={shot === 3 ? C.ink : C.paper} font="jpDela" />
    </Fill>
  );
};

/** 134.8 → 140.0 bamboo forest as an equalizer + shakuhachi ribbon */
export const BambooEQ: SceneFC = ({ t, T }) => {
  const ribbon: string[] = [];
  for (let i = 0; i <= 50; i++) {
    const u = i / 50;
    const x = -60 + u * 1200;
    const y = 700 + Math.sin(u * 6 + T * 2.4) * 120 * (0.4 + mid(T)) + Math.sin(u * 17 - T * 4) * 30;
    ribbon.push(`${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return (
    <Fill bg={C.navy}>
      <Svg>
        <rect width={1080} height={1920} fill={C.navy} />
        <circle cx={760} cy={420} r={160} fill={C.paper} />
        {Array.from({ length: 11 }).map((_, k) => {
          const band = k % 3 === 0 ? bass(T) : k % 3 === 1 ? mid(T - k * 0.03) : hat(T - k * 0.02);
          const h = 600 + band * 900 + rr(2, k, 0, 200);
          return <Bamboo key={k} x={40 + k * 100} base={1960} h={h} w={50 + (k % 3) * 10} fill={k % 2 ? C.ink : "#0a1430"} node={k % 4 === 0 ? C.cyan : C.red} sway={Math.sin(T * 1.2 + k) * 2} />;
        })}
        <path d={ribbon.join(" ")} stroke={C.cyan} strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.85} />
        <path d={ribbon.join(" ")} stroke={C.paper} strokeWidth={4} fill="none" opacity={0.9} />
      </Svg>
      <Smoke t={T} n={4} color={C.cyan} opacity={0.2} y={1500} size={900} rise={20} />
      <Kanji ch="尺八" x={920} y={1050} size={150} color={C.paper} font="jpBrush" vertical opacity={0.8} />
    </Fill>
  );
};

/** 140.0 → STRIKE  charge across the field */
export const DuelCharge: SceneFC = ({ t, T, d }) => {
  const p = clamp(t / d);
  const run = Math.pow(p, 1.4);
  return (
    <Fill bg={C.ink}>
      <Svg>
        <rect width={1080} height={1920} fill={C.blood} />
        <SpeedLines t={T} n={100} inner={300} color={C.ink} opacity={0.8} cx={540} cy={1100} />
        <rect y={1380} width={1080} height={600} fill={C.ink} />
        <Samurai x={120 + run * 330} y={1420} s={1.35} t={T} walk={T * 12} lean={14} sword="waist" wind={1.6} rim={C.red} />
        <Samurai x={960 - run * 330} y={1420} s={1.35} t={T} walk={T * 12 + 1} lean={14} flip hat="topknot" sword="waist" scarf={C.blue} obi={C.blue} wind={1.6} rim={C.blue} />
      </Svg>
    </Fill>
  );
};

/** STRIKE → 146.84  back to back… the opponent's hat splits */
export const Aftermath: SceneFC = ({ t, T }) => {
  const flash = decay(T, STRIKE, 0.18);
  const split = easeOut(prog(T, STRIKE + 0.9, STRIKE + 1.7));
  return (
    <Fill bg={C.paper}>
      <Svg>
        <Field T={T} moonR={420} moonY={700} />
        <rect y={1400} width={1080} height={600} fill={C.ink} />
        <Samurai x={780} y={1420} s={1.2} t={T} sword="drawn" armR={-50} wind={1} rim={C.blood} />
        <Samurai x={260} y={1420} s={1.2} t={T} flip hat={split > 0 ? "bald" : "topknot"} sword="none" scarf={C.blue} obi={C.blue} wind={1} rim={C.blood} />
        {split > 0 && (
          <g transform={`translate(${260 - split * 120},${1420 - 344 * 1.2 + split * split * 380}) rotate(${-split * 260})`}>
            <ellipse cx={0} cy={0} rx={11} ry={19} fill={C.ink} />
            <line x1={-40} y1={30} x2={40} y2={-30} stroke={C.cyan} strokeWidth={6 * (1 - split)} />
          </g>
        )}
        {split > 0 && <rect x={260 - 36} y={1420 - 322 * 1.2} width={72} height={11} fill={C.red} />}
        <PetalStorm t={T} n={30} seed={13} colors={[C.red, C.paper]} wind={300} speed={60} />
        <line x1={-100} y1={1300} x2={1180} y2={900} stroke={C.paper} strokeWidth={30 * flash} />
        <rect width={1080} height={1920} fill="#fff" opacity={flash * 0.9} />
      </Svg>
      <Kanji ch="斬" x={540} y={1650} size={260} color={C.red} font="jpBrush" opacity={clamp((T - STRIKE) / 0.2)} />
    </Fill>
  );
};
