import React from "react";
import { C } from "../lib/constants";
import { clamp, decay, easeOut, easeOutBack, easeOutElastic, prog, rr, n2 } from "../lib/math";
import { bass, beatPulse, hat, bassHit, hitPulse } from "../lib/audio";
import { Fill, Svg, Cam, Glow, SceneFC } from "./kit";
import { Samurai } from "../assets/Samurai";
import { Katana } from "../assets/Blade";
import { Clock, PocketWatch } from "../assets/Props";
import { City, GreatWave, Seigaiha } from "../assets/Japan";
import { Kanji, Smoke, Brush, Halftone, Rays, Stars, Tex, Paper } from "../assets/Fx";

/** Black silk, black shoes, midnight stroll */
export const Midnight: SceneFC = ({ t, T }) => {
  const ribbon = (k: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const u = i / 40;
      const x = -100 + u * 1300;
      const y = 1180 + k * 70 + Math.sin(u * 5 + T * 2.2 + k) * 90 + Math.sin(u * 13 - T * 3) * 20;
      pts.push(`${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  };
  return (
    <Fill bg={C.navy}>
      <Svg>
        <Stars n={90} t={T} h={1100} />
        <Glow id="mn-g" cx={540} cy={430} r={520} color={C.cyan} o={0.35} />
        <circle cx={540} cy={430} r={250} fill={C.paper} />
        <circle cx={470} cy={380} r={40} fill={C.bone} />
        <circle cx={610} cy={500} r={26} fill={C.bone} />
        <path d={ribbon(0)} stroke={C.ink} strokeWidth={90} fill="none" strokeLinecap="round" />
        <path d={ribbon(0)} stroke="#3b3a44" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.7} />
        <rect y={1500} width={1080} height={420} fill={C.ink} />
        <g transform="translate(540,2350) scale(3.4)">
          <Samurai x={0} y={0} walk={T * 4.4} t={T} scarf={null} sword="none" fill="#050405" rim={C.blue2} rimOffset={3} />
        </g>
      </Svg>
    </Fill>
  );
};

/** Got a little bit of jazz in a samurai soul */
export const JazzSoul: SceneFC = ({ t, T }) => {
  const bricks: React.ReactNode[] = [];
  for (let r = 0; r < 26; r++) {
    for (let c = 0; c < 8; c++) {
      const x = c * 150 - (r % 2) * 75;
      bricks.push(<rect key={`${r}-${c}`} x={x + 4} y={r * 76 + 4} width={142} height={68} fill={rr(r, c, 0, 1) > 0.8 ? C.red2 : C.blood} opacity={0.75 + rr(c, r, 0, 0.25)} />);
    }
  }
  const flick = n2("js", 0, T * 3) > -0.5 ? 1 : 0.3;
  return (
    <Fill bg={C.ink}>
      <Cam z={1.04 + t * 0.02}>
        <Svg>
          {bricks}
          <rect width={1080} height={1920} fill={C.ink} opacity={0.45} />
          <Glow id="js-g" cx={540} cy={820} r={600} color={C.blue} o={0.55 * flick} />
          <rect x={110} y={560} width={860} height={520} rx={40} fill="none" stroke={C.cyan} strokeWidth={10} opacity={flick} />
        </Svg>
        <Kanji ch="魂" x={540} y={1400} size={560} color={C.red} font="jpBrush" opacity={0.95} rot={-4} />
        <Kanji ch="ジャズ" x={540} y={1690} size={110} color={C.cyan} font="jpDot" opacity={flick} />
      </Cam>
    </Fill>
  );
};

/** Blade on my back but my hands stay clean */
export const BladeDraw: SceneFC = ({ t, T, d }) => {
  const draw = easeOut(prog(t, 0.05, 1.4));
  const glint = prog(T, 59.9, 60.6);
  return (
    <Fill bg={C.ink}>
      <Svg>
        <polygon points="0,0 1080,0 1080,700 0,1500" fill={C.red} />
        <polygon points="0,1500 1080,700 1080,760 0,1560" fill={C.paper} opacity={0.9} />
        <Rays cx={540} cy={1100} n={36} rot={T * 6} c1="#140c0d" c2={C.ink} R={0} />
        <Katana x={300 + draw * 120} y={1120 - draw * 90} rot={-36} s={1.25} L={820} sheath={0} glint={glint > 0 && glint < 1 ? glint : -1} />
        <Glow id="bd-g" cx={540} cy={900} r={500} color={C.cyan} o={0.3 * decay(T, 60.24, 0.4)} />
      </Svg>
      <Kanji ch="刀" x={860} y={330} size={330} color={C.ink} font="jpBrush" />
    </Fill>
  );
};

/** Walkin' through the smoke like a fever dream */
export const FeverSmoke: SceneFC = ({ t, T }) => (
  <Fill bg={C.blood}>
    <Cam z={1.1} r={Math.sin(T * 1.3) * 3} style={{ filter: `hue-rotate(${Math.sin(T * 2) * 12}deg)` }}>
      <Svg>
        <Glow id="fs-g" cx={540} cy={1000} r={900} color={C.hot} o={0.4} />
        <g opacity={0.55 + 0.45 * Math.sin(T * 3)}>
          <Samurai x={540} y={1450} s={1.6} walk={T * 3.5} t={T} rim={C.cyan} />
        </g>
      </Svg>
      <Smoke t={T + 3} n={7} color={C.blue} opacity={0.55} y={1100} spread={620} size={1100} rise={40} seed={3} />
      <Smoke t={T} n={6} color={C.ink} opacity={0.5} y={1300} spread={600} size={1000} rise={60} seed={8} />
      <Smoke t={T + 5} n={4} color={C.hot} opacity={0.35} y={700} spread={500} size={900} rise={20} seed={12} />
    </Cam>
    <Kanji ch="夢" x={540} y={520} size={420} color={C.paper} font="jpBrush" opacity={0.25 + 0.15 * Math.sin(T * 4)} blur={2} />
  </Fill>
);

/** Low ride, high tide, nowhere to go */
export const TideWave: SceneFC = ({ t, T }) => {
  const rise = easeOut(prog(t, 0, 1.6));
  return (
    <Fill bg={C.navy}>
      <Svg>
        <Seigaiha r={56} c1={C.blue2} c2={C.blue} bg={C.navy} dy={T * 20} opacity={0.5} />
        <circle cx={260} cy={360} r={120} fill={C.red} />
        <GreatWave x={-120} y={1980 + (1 - rise) * 500} s={1.1} t={T} />
        <path d={`M640,${1600 - rise * 220} l160,-16 l-30,40 l-110,6 Z`} fill={C.ink} />
      </Svg>
      <Kanji ch="波" x={160} y={1040} size={240} color={C.paper} font="jpBrush" opacity={0.8} />
    </Fill>
  );
};

/** Got the whole damn city movin' extra slow */
export const SlowCity: SceneFC = ({ t, T }) => (
  <Fill bg={C.red}>
    <Svg>
      <defs>
        <linearGradient id="sc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.blood} />
          <stop offset="0.6" stopColor={C.red} />
          <stop offset="1" stopColor={C.hot} />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#sc-sky)" />
      {Array.from({ length: 5 }).map((_, k) => (
        <ellipse key={k} cx={((k * 300 + t * 12) % 1500) - 200} cy={300 + k * 110} rx={260} ry={34} fill={C.paper} opacity={0.18} />
      ))}
      <City y={1450} seed={41} fill={C.ink} win={C.cyan} win2={C.paper} scale={1.1} offset={t * 6} t={T * 0.2} />
      <rect y={1450} width={1080} height={480} fill={C.ink} />
      {Array.from({ length: 8 }).map((_, k) => {
        const x = ((k * 260 + t * 26) % 1600) - 300;
        return <rect key={k} x={x} y={1520 + (k % 3) * 70} width={420} height={12} rx={6} fill={k % 2 ? C.cyan : C.hot} opacity={0.75} />;
      })}
    </Svg>
    <Kanji ch="遅" x={880} y={1220} size={260} color={C.paper} font="jpDela" opacity={0.9} scaleX={1 + t * 0.15} />
  </Fill>
);

/** Clock says twelve but the rhythm says nine */
export const ClockScene: SceneFC = ({ t, T }) => {
  const snap = easeOutElastic(prog(T, 70.8, 71.3));
  const hour = 0 + snap * 270;
  const minute = (T < 70.8 ? Math.sin(T * 6) * 4 : 0) + snap * 270;
  return (
    <Fill bg={C.navy}>
      <Svg>
        <g transform={`rotate(${T * 8} 540 1060)`}>
          {Array.from({ length: 72 }).map((_, k) => {
            const a = (k / 72) * Math.PI * 2;
            return <line key={k} x1={540 + Math.cos(a) * 520} y1={1060 + Math.sin(a) * 520} x2={540 + Math.cos(a) * 1400} y2={1060 + Math.sin(a) * 1400} stroke={C.blue2} strokeWidth={k % 6 ? 3 : 12} />;
          })}
        </g>
        <g transform={`translate(540,1060) scale(${1 + beatPulse(T) * 0.03}) translate(-540,-1060)`}>
          <Clock x={540} y={1060} R={420} hour={hour} minute={minute} hl={T < 70.8 ? 0 : 9} />
        </g>
      </Svg>
    </Fill>
  );
};

/** Everybody got a watch, nobody got time */
export const RainingWatches: SceneFC = ({ t, T }) => (
  <Fill bg={C.red}>
    <Svg>
      <Rays rot={T * 10} n={40} c1={C.red} c2={C.red2} />
      {Array.from({ length: 22 }).map((_, k) => {
        const depth = rr(2, k, 0.45, 1.25);
        const x = rr(3, k, 60, 1020);
        const y = ((rr(4, k, 0, 2400) + t * 520 * depth) % 2500) - 300;
        return <PocketWatch key={k} x={x} y={y} s={depth} rot={t * rr(5, k, -120, 120) + k * 30} t={T + k} />;
      })}
    </Svg>
    <Halftone color={C.ink} size={18} dot={30} opacity={0.4} fade="linear-gradient(180deg, #000, transparent 30%, transparent 75%, #000)" />
  </Fill>
);

/** Get down / ba-da-bum: funk sunburst with three dancing ronin */
export const GetDown: SceneFC = ({ t, T }) => {
  const bp = beatPulse(T);
  const dancer = (x: number, s: number, ph: number, flip: boolean) => (
    <Samurai x={x} y={1560 + bp * 20 * s} s={s} t={T} walk={T * 4.6 + ph} armL={30 + Math.sin(T * 9.2 + ph) * 40} armR={30 + Math.cos(T * 9.2 + ph) * 40} hatTilt={Math.sin(T * 4.6 + ph) * 12} flip={flip} lean={Math.sin(T * 4.6 + ph) * 6} rim={C.cyan} rimOffset={6} />
  );
  return (
    <Fill bg={C.ink}>
      <Svg>
        <Rays cx={540} cy={1100} n={32} rot={T * 25} c1={C.red} c2={C.ink} />
        <circle cx={540} cy={1100} r={260 + bp * 40} fill={C.blue} />
        <circle cx={540} cy={1100} r={180 + bp * 30} fill={C.ink} />
        <rect y={1560} width={1080} height={400} fill={C.ink} />
        {Array.from({ length: 9 }).map((_, k) => (
          <rect key={k} x={k * 130 - 40} y={1580} width={110} height={30} fill={(k + Math.floor(T * 1.5)) % 2 ? C.red : C.blue} />
        ))}
        {dancer(200, 0.9, 1.2, true)}
        {dancer(880, 0.9, 2.2, false)}
        {dancer(540, 1.3, 0, false)}
      </Svg>
    </Fill>
  );
};
