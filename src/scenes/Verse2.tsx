import React from "react";
import { C } from "../lib/constants";
import { clamp, decay, easeIn, easeInOut, easeOut, easeOutBack, prog, rr } from "../lib/math";
import { bass, beatPulse, bassHit, hat, beatCount } from "../lib/audio";
import { Fill, Svg, Cam, Glow, SceneFC, StripeSun } from "./kit";
import { Samurai } from "../assets/Samurai";
import { Katana } from "../assets/Blade";
import { Vinyl } from "../assets/Vinyl";
import { Crown, Throne, Road, GuitarStrings, Footprint } from "../assets/Props";
import { Fuji, Lantern, Koi, PetalStorm } from "../assets/Japan";
import { Kanji, Smoke, Brush, Halftone, Rays, Stars, Paper, Embers, Tex, Shock } from "../assets/Fx";

/** Got a crooked little grin and a crooked little groove */
export const Crooked: SceneFC = ({ t, T }) => (
  <Fill bg={C.red}>
    <Cam r={-7} z={1.15}>
      <Svg>
        {Array.from({ length: 16 }).map((_, k) => (
          <rect key={k} x={-400} y={k * 160 - 200 + ((t * 80) % 160)} width={1900} height={70} fill={C.red2} transform={`rotate(${-18 + Math.sin(k) * 3} 540 960)`} />
        ))}
      </Svg>
      <Brush x={540} y={1380} w={980} h={240} color={C.ink} reveal={easeOut(prog(t, 0.1, 0.8))} rot={-12} variant={1} />
      <Brush x={600} y={1460} w={700} h={140} color={C.ink} reveal={easeOut(prog(t, 0.5, 1.1))} rot={8} variant={2} />
    </Cam>
    <Kanji ch="笑" x={850} y={330} size={260} color={C.paper} font="jpBrush" rot={12} />
  </Fill>
);

/** Never met a mountain that I couldn't move */
export const FujiMove: SceneFC = ({ t, T }) => {
  const shove = easeIn(prog(T, 150.55, 150.86));
  return (
    <Fill bg={C.blue}>
      <Svg>
        <rect width={1080} height={1920} fill={C.blue} />
        {Array.from({ length: 6 }).map((_, r) =>
          Array.from({ length: 9 }).map((_, c) => (
            <path key={`${r}-${c}`} d={`M${c * 140 - (r % 2) * 70 + ((t * 30) % 140)},${300 + r * 70} q 30,-34 60,0 q 30,-34 60,0`} stroke={C.paper} strokeWidth={8} fill="none" opacity={0.5} />
          )),
        )}
        <g transform={`translate(${shove * 1400},0) rotate(${shove * 12} 540 1700)`}>
          <Fuji x={540} y={1750} s={1.35} />
        </g>
        <rect y={1740} width={1080} height={200} fill={C.ink} />
        {shove > 0 && <Shock cx={540} cy={1500} p={shove} R={900} color={C.paper} />}
      </Svg>
      <Kanji ch="山" x={170} y={1180} size={230} color={C.ink} font="jpDela" opacity={0.85} />
    </Fill>
  );
};

/** Not with force, not with speed */
export const NoForce: SceneFC = ({ t, T }) => (
  <Fill bg={C.paper}>
    <Paper />
    <Kanji ch="力" x={300} y={620} size={520} color={C.ink} font="jpDela" opacity={0.85} />
    <Kanji ch="速" x={780} y={1260} size={520} color={C.ink} font="jpDela" opacity={0.85} />
    <Brush x={300} y={620} w={700} h={180} color={C.red} reveal={easeOut(prog(T, 151.28, 151.5))} rot={-28} variant={0} />
    <Brush x={780} y={1260} w={700} h={180} color={C.red} reveal={easeOut(prog(T, 152.16, 152.38))} rot={24} variant={2} />
    <Kanji ch="忍" x={540} y={1650} size={160} color={C.blue} font="jpBrush" opacity={prog(T, 152.3, 152.5)} />
  </Fill>
);

/** Just a little bit of patience and a pocket full of dreams */
export const DreamPocket: SceneFC = ({ t, T }) => {
  const items = Array.from({ length: 26 }).map((_, k) => {
    const life = (t * 0.45 + rr(1, k, 0, 1)) % 1;
    const x = 540 + rr(2, k, -420, 420) * life + Math.sin(T * 2 + k) * 30;
    const y = 1500 - life * 1400;
    const kind = k % 4;
    const s = 0.6 + life;
    const o = Math.sin(life * Math.PI);
    if (kind === 0) return <path key={k} transform={`translate(${x},${y}) scale(${s}) rotate(${T * 40 + k * 20})`} d="M0,-30 L8,-8 L30,0 L8,8 L0,30 L-8,8 L-30,0 L-8,-8 Z" fill={C.paper} opacity={o} />;
    if (kind === 1) return <path key={k} transform={`translate(${x},${y}) scale(${s})`} d="M-20,-28 A30,30 0 1,0 20,22 A24,24 0 1,1 -20,-28 Z" fill={C.cyan} opacity={o} />;
    if (kind === 2) return <g key={k} opacity={o}><Koi x={x} y={y} rot={-90 + Math.sin(T + k) * 20} s={0.25 * s} t={T + k} body={C.red} patch={C.paper} /></g>;
    return <ellipse key={k} cx={x} cy={y} rx={50 * s} ry={22 * s} fill={C.paper} opacity={o * 0.7} />;
  });
  return (
    <Fill bg={C.navy}>
      <Svg>
        <Stars n={100} t={T} />
        <Glow id="dp-g" cx={540} cy={1500} r={600} color={C.blue} o={0.6} />
        {items}
        <path d="M230,1480 L850,1480 L820,1830 L540,1940 L260,1830 Z" fill={C.blue2} stroke={C.ink} strokeWidth={12} />
        <path d="M262,1512 L818,1512 L792,1806 L540,1906 L288,1806 Z" fill="none" stroke={C.paper} strokeWidth={6} strokeDasharray="22 14" />
        <path d="M230,1480 Q540,1560 850,1480" stroke={C.red} strokeWidth={16} fill="none" />
      </Svg>
    </Fill>
  );
};

/** Dust on the record, gold in the sound */
export const GoldDust: SceneFC = ({ t, T }) => (
  <Fill bg={C.ink}>
    <Svg>
      <Vinyl x={1500} y={960} R={1700} rot={T * 18} />
      <polygon points="200,-50 520,-50 900,1970 -100,1970" fill={C.paper} opacity={0.08} />
      {Array.from({ length: 80 }).map((_, k) => {
        const x = rr(1, k, 0, 1080) + Math.sin(T + k) * 30;
        const y = rr(2, k, 0, 1920) - ((t * rr(3, k, 10, 60)) % 400);
        const gold = k % 3 === 0;
        return <circle key={k} cx={x} cy={y} r={rr(4, k, 2, gold ? 8 : 4)} fill={gold ? C.gold : C.paper} opacity={(gold ? 0.9 : 0.5) * (0.5 + 0.5 * Math.sin(T * 5 + k))} />;
      })}
    </Svg>
    <Kanji ch="金" x={540} y={1500} size={330} color={C.gold} font="jpAntique" opacity={easeOut(prog(T, 156.3, 156.6))} />
  </Fill>
);

/** Everybody floats when the bass comes around */
export const Lanterns: SceneFC = ({ t, T }) => (
  <Fill bg={C.navy}>
    <Svg>
      <Stars n={80} t={T} />
      {Array.from({ length: 11 }).map((_, k) => {
        const depth = rr(1, k, 0.4, 1.1);
        const x = rr(2, k, 80, 1000);
        const y = 2000 - ((rr(3, k, 0, 2200) + t * 260 * depth) % 2300) - bass(T) * 60 * depth;
        return <Lantern key={k} x={x} y={y} s={depth * 1.35} rot={Math.sin(T * 1.5 + k) * 8} ch={["音", "浮", "侍", "夢"][k % 4]} glow={0.6 + bass(T) * 0.6} />;
      })}
    </Svg>
  </Fill>
);

/** I don't need a crown, I don't need a throne */
export const CrownCut: SceneFC = ({ t, T }) => {
  const cut = prog(T, 160.12, 160.5);
  const kick = easeIn(prog(T, 160.9, 161.3));
  return (
    <Fill bg={C.ink}>
      <Svg>
        <Rays n={30} rot={T * 8} c1="#1a0a0d" c2={C.ink} />
        <g transform={`translate(${-cut * 160},${cut * 260}) rotate(${-cut * 20} 540 640)`}>
          <clipPath id="cc-l"><polygon points="0,0 560,0 520,1920 0,1920" /></clipPath>
          <g clipPath="url(#cc-l)"><Crown x={540} y={640} s={1.1} /></g>
        </g>
        <g transform={`translate(${cut * 160},${cut * 320}) rotate(${cut * 26} 540 640)`}>
          <clipPath id="cc-r"><polygon points="560,0 1080,0 1080,1920 520,1920" /></clipPath>
          <g clipPath="url(#cc-r)"><Crown x={540} y={640} s={1.1} /></g>
        </g>
        {cut > 0 && cut < 1 && <line x1={600} y1={300} x2={480} y2={1000} stroke={C.cyan} strokeWidth={16 * (1 - cut)} />}
        <g transform={`translate(${kick * 900},${kick * 300}) rotate(${kick * 80} 540 1700)`}>
          <Throne x={540} y={1700} s={0.9} />
        </g>
      </Svg>
      <Kanji ch="王" x={900} y={1180} size={200} color={C.red} font="jpDela" opacity={0.8} />
    </Fill>
  );
};

/** Just a six-string rhythm and a road back home */
export const RoadHome: SceneFC = ({ t, T }) => {
  const morph = easeInOut(prog(t, 0.6, 2.0));
  return (
    <Fill bg={C.navy}>
      <Svg>
        <defs>
          <linearGradient id="rh-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.navy} />
            <stop offset="1" stopColor={C.red} />
          </linearGradient>
        </defs>
        <rect width={1080} height={1000} fill="url(#rh-sky)" />
        <StripeSun cx={540} cy={1000} r={300} fill={C.hot} bg={C.navy} cuts={6} />
        <rect y={990} width={1080} height={940} fill={C.ink} />
        <g opacity={morph}>
          <Road vx={540} vy={1000} travel={t * 900} />
        </g>
        <g opacity={1 - morph}>
          <GuitarStrings t={T} amp={0.6 + bass(T)} y0={1150} gap={70} />
        </g>
        <g transform={`translate(540,${1220 - morph * 120}) scale(${0.6 - morph * 0.3})`}>
          <Samurai x={0} y={0} t={T} walk={T * 4} rim={C.red} />
        </g>
      </Svg>
      <Kanji ch="帰り道" x={540} y={1700} size={120} color={C.paper} font="jpMincho" opacity={0.8} />
    </Fill>
  );
};

/** Left, right, slide! / Let the rhythm ride! / Keep it on the inside! */
export const Chants: SceneFC = ({ t, T }) => {
  const inside = T >= 168.3;
  const beat = beatCount(T);
  const leftSide = beat % 2 === 0;
  return (
    <Fill bg={C.ink}>
      {!inside ? (
        <Svg>
          <rect width={540} height={1920} fill={leftSide ? C.blue : C.ink} />
          <rect x={540} width={540} height={1920} fill={leftSide ? C.ink : C.red} />
          <path d={leftSide ? "M420,1500 L160,1500 L160,1440 L40,1560 L160,1680 L160,1620 L420,1620 Z" : "M660,1500 L920,1500 L920,1440 L1040,1560 L920,1680 L920,1620 L660,1620 Z"} fill={C.paper} />
          <Footprint x={leftSide ? 300 : 780} y={460} rot={leftSide ? -15 : 15} s={1.1} left={leftSide} fill={C.paper} />
        </Svg>
      ) : (
        <Svg>
          {Array.from({ length: 10 }).map((_, k) => {
            const z = (k + ((T * 1.2) % 1)) / 10;
            const s = 1 - z;
            return <rect key={k} x={540 - 600 * s} y={960 - 1060 * s} width={1200 * s} height={2120 * s} fill={(k + Math.floor(T * 1.2)) % 2 ? C.blue : C.red} />;
          })}
          <rect x={440} y={860} width={200} height={200} fill={C.ink} />
        </Svg>
      )}
    </Fill>
  );
};
