import React, { useContext } from "react";
import { C } from "../lib/constants";
import { clamp, decay, easeIn, easeInOut, easeOut, easeOutBack, prog, rr, lerp } from "../lib/math";
import { AUDIO, bass, beatPulse, bassHit, hat, lastIdx, beatCount, rms } from "../lib/audio";
import { Fill, Svg, Cam, Glow, SceneFC, StripeSun } from "./kit";
import { Samurai } from "../assets/Samurai";
import { Katana } from "../assets/Blade";
import { Vinyl, Tonearm, Tomoe } from "../assets/Vinyl";
import { BassStrings, BlackHole, Stage } from "../assets/Props";
import { Sunflower, Seigaiha, PetalStorm, Pagoda } from "../assets/Japan";
import { Kanji, Hypno, Stars, Smoke, Rays, Shock, Paper, Tex, Embers } from "../assets/Fx";
import { RenderAt } from "../ctx";
import { Seal } from "./Intro";

const Roofs: React.FC<{ off: number; y: number; fill: string; seed: number; s?: number }> = ({ off, y, fill, seed, s = 1 }) => {
  const items = [];
  for (let i = 0; i < 9; i++) {
    const w = rr(seed, i, 320, 520) * s;
    const x = ((i * 460 * s - off) % (9 * 460 * s) + 9 * 460 * s) % (9 * 460 * s) - 500;
    const h = rr(seed, i + 20, 0, 200) * s;
    items.push(
      <g key={i}>
        <rect x={x + w * 0.1} y={y - h} width={w * 0.8} height={1200} fill={fill} />
        <path d={`M${x - 30},${y - h} Q${x + w * 0.2},${y - h - 30} ${x + w * 0.3},${y - h - 120 * s} L${x + w * 0.7},${y - h - 120 * s} Q${x + w * 0.8},${y - h - 30} ${x + w + 30},${y - h} Z`} fill={fill} />
        {Array.from({ length: 8 }).map((_, k) => <line key={k} x1={x + w * (0.1 + k * 0.11)} y1={y - h - 10} x2={x + w * (0.32 + k * 0.05)} y2={y - h - 110 * s} stroke={C.coal} strokeWidth={4} />)}
      </g>,
    );
  }
  return <g>{items}</g>;
};

/** 264.3 → 271.6 rooftop run */
export const Rooftops: SceneFC = ({ t, T }) => {
  const off = t * 520;
  const jump = Math.abs(Math.sin(t * 1.25)) * 180;
  return (
    <Fill bg={C.navy}>
      <Svg>
        <rect width={1080} height={1920} fill={C.navy} />
        <Stars n={70} t={T} h={1100} />
        <circle cx={700} cy={560} r={330} fill={C.paper} />
        <Roofs off={off * 0.35} y={1250} fill="#0c1640" seed={3} s={0.7} />
        <Pagoda x={((200 - off * 0.35) % 1600 + 1600) % 1600 - 200} y={1250} s={1.3} fill="#0c1640" glow={C.red} />
        <Roofs off={off} y={1450} fill={C.ink} seed={5} />
        <Samurai x={420} y={1330 - jump} s={0.95} t={T} walk={T * 11} lean={12} rim={C.red} wind={1.4} />
      </Svg>
    </Fill>
  );
};

/** 271.6 → 278.2 slow-motion leap across the giant moon; moon turns into the spiral */
export const MoonLeap: SceneFC = ({ t, T, d }) => {
  const p = clamp(t / 5.2);
  const turn = easeIn(prog(t, 5.0, d));
  return (
    <Fill bg={C.ink}>
      <Svg>
        <rect width={1080} height={1920} fill={C.navy} opacity={1 - turn} />
        <circle cx={540} cy={900} r={600 + turn * 900} fill={turn > 0 ? C.red : C.paper} />
        {turn > 0 && <Hypno rot={T * 40} c1={C.red} c2={C.ink} n={22} zoom={T * 2} />}
        <g opacity={1 - turn}>
          <Samurai x={lerp(-150, 1230, p)} y={1100 - Math.sin(p * Math.PI) * 420} s={1.3} t={T} walk={1.2} armL={90} armR={60} lean={20 - p * 30} sword="drawn" wind={1.5} />
          <PetalStorm t={T} n={20} seed={21} colors={[C.red, C.ink]} wind={100} speed={60} />
        </g>
      </Svg>
    </Fill>
  );
};

/** 278.2 → 286.5 final chorus: hypnotic rings */
export const HypnoChorus: SceneFC = ({ t, T }) => (
  <Fill bg={C.red}>
    <Svg>
      <Hypno rot={T * 30} c1={beatCount(T) % 4 === 0 ? C.blue2 : C.red} c2={C.ink} n={26} zoom={T * 1.4 + bass(T)} />
      <circle cx={540} cy={960} r={120 + bass(T) * 60} fill={C.blue} />
      <Tomoe x={540} y={960} R={100 + bass(T) * 50} rot={-T * 120} fill={C.ink} />
    </Svg>
  </Fill>
);

/** 289.6 → 297.0 harmonies: hyperspace inside the hole */
export const Hyperspace: SceneFC = ({ t, T }) => (
  <Fill bg="#000">
    <Svg>
      <Stars n={220} t={T} stretch={0.25 + (t % 1.5) * 0.4} seed={9} />
      <Glow id="hs-g" cx={540} cy={960} r={400} color={C.blue} o={0.7} />
      <circle cx={540} cy={960} r={40 + bass(T) * 40} fill={C.paper} />
    </Svg>
  </Fill>
);

/** 297.0 → 311.6 underground jazz club: curtain, spotlight, mic */
export const JazzClub: SceneFC = ({ t, T }) => {
  const open = easeInOut(prog(T, 297.0, 298.6));
  const silence = prog(T, 306.5, 307.2) * (1 - prog(T, 308.7, 309.0));
  const roll = prog(T, 310.4, 311.8);
  return (
    <Fill bg={C.ink}>
      <div style={{ position: "absolute", inset: 0, filter: `saturate(${1 - silence * 0.9}) brightness(${1 - silence * 0.55})` }}>
        <Svg>
          <Stage t={T} open={open} beam={0.4 + 0.6 * open} />
          <g opacity={open}>
            <Samurai x={360} y={1500} s={1.05} t={T} sword="back" armR={40} rim={C.blue} />
          </g>
          {roll > 0 && <Vinyl x={lerp(-500, 1600, roll)} y={1420} R={300} rot={roll * 1400} />}
        </Svg>
        <Smoke t={T} n={4} color={C.paper} opacity={0.12} y={900} spread={300} size={700} rise={20} />
      </div>
    </Fill>
  );
};

/** 311.6 → 318.2 outro bass strings, now in blue */
export const BassOutro: SceneFC = ({ t, T }) => {
  const i = lastIdx(AUDIO.bassOnsets, T);
  const amps = [0, 1, 2, 3].map((k) => {
    let a = 0;
    for (let j = i; j >= Math.max(0, i - 4); j--) if (j % 4 === k) a = Math.max(a, decay(T, AUDIO.bassOnsets[j], 0.45));
    return a;
  });
  return (
    <Fill bg={C.blue2}>
      <Svg>
        <rect width={1080} height={1920} fill={C.blue2} />
        <rect x={-300} y={520} width={1700} height={900} fill={C.navy} transform="rotate(10 540 960)" />
        <BassStrings t={T} amps={amps} y0={640} gap={170} angle={10} color={C.paper} />
      </Svg>
      <Kanji ch="低音" x={930} y={960} size={240} color={C.red} font="jpDela" vertical opacity={0.9} />
    </Fill>
  );
};

/** 318.2 → 324.0 the sword goes home */
export const Sheath: SceneFC = ({ t, T }) => {
  const sh = easeInOut(prog(T, 318.4, 322.35));
  const click = decay(T, 322.4, 0.25);
  return (
    <Fill bg={C.ink}>
      <Svg>
        <Glow id="sh-g" cx={540} cy={960} r={700} color={C.red} o={0.3 + click * 0.5} />
        <g transform={`translate(${2 - sh * 300},980) rotate(-4)`}>
          <Katana x={0} y={0} s={0.62} L={1000} sheath={sh} showSaya glint={prog(T, 318.6, 319.8) * 0.9} />
        </g>
        <Shock cx={540} cy={980} p={clamp((T - 322.4) / 0.6)} R={700} color={C.cyan} width={20} />
      </Svg>
      <Kanji ch="秘" x={540} y={1500} size={200} color={C.paper} font="jpMincho" opacity={0.25 + click * 0.6} />
    </Fill>
  );
};

/** 324.0 → 333.0 sunrise over the sea, walking home through sunflowers */
export const Sunrise: SceneFC = ({ t, T, d }) => {
  const rise = easeOut(clamp(t / d));
  return (
    <Fill bg={C.navy}>
      <Svg>
        <defs>
          <linearGradient id="sr-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.navy} />
            <stop offset={0.5 - rise * 0.2} stopColor={C.blue2} />
            <stop offset="1" stopColor={C.hot} />
          </linearGradient>
        </defs>
        <rect width={1080} height={1100} fill="url(#sr-sky)" />
        <StripeSun cx={540} cy={1100 - rise * 330} r={300} fill={C.red} bg={C.blue2} cuts={0} />
        <rect y={1050} width={1080} height={900} fill={C.navy} />
        <g transform="translate(0,1050)">
          <Seigaiha h={300} r={40} c1={C.blue2} c2={C.blue} bg={C.navy} dx={T * 20} />
        </g>
        {Array.from({ length: 5 }).map((_, k) => (
          <path key={k} d={`M${200 + k * 140 + t * 20},${500 + k * 40} q 20,-20 40,0 q 20,-20 40,0`} stroke={C.ink} strokeWidth={6} fill="none" />
        ))}
        <rect y={1350} width={1080} height={600} fill={C.ink} />
        <g transform={`translate(${560 + t * 8},1360) scale(0.45)`}>
          <Samurai x={0} y={0} t={T} walk={T * 3.6} rim={C.red} />
        </g>
        {Array.from({ length: 7 }).map((_, k) => (
          <Sunflower key={k} x={60 + k * 165} y={1560 + (k % 2) * 140} s={0.5 + (k % 3) * 0.08} rot={Math.sin(T + k) * 10} t={T + k} />
        ))}
      </Svg>
    </Fill>
  );
};

/** 333.0 → 346.8 recap: every scene flashes by in a film strip, on the bass */
export const Recap: SceneFC = ({ t, T }) => {
  const renderAt = useContext(RenderAt);
  const i = Math.max(0, lastIdx(AUDIO.bassOnsets, T) - lastIdx(AUDIO.bassOnsets, 333.0));
  const moments = [16, 25, 48, 54, 57, 62, 66, 70, 73, 78, 85, 87.5, 90, 93, 96, 99, 102, 105, 118, 127, 131, 137, 142, 145.5, 148, 150.7, 151.8, 154, 156, 158, 160.5, 162, 166, 174, 180, 185, 192, 196.5, 203, 207, 214.5, 226, 231, 236, 247, 252, 260, 268, 274, 282, 288, 292, 300, 314, 320, 330];
  const m = moments[(moments.length - 1 - (i % moments.length) + moments.length) % moments.length];
  const p = decay(T, AUDIO.bassOnsets[lastIdx(AUDIO.bassOnsets, T)] ?? T, 0.25);
  const sprockets = (x: number) => Array.from({ length: 16 }).map((_, k) => <rect key={k} x={x} y={((k * 130 + t * 600) % 2080) - 80} width={44} height={70} rx={10} fill={C.paper} />);
  return (
    <Fill bg={C.ink}>
      <div style={{ position: "absolute", left: 110, top: 0, width: 860, height: 1920, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -110, top: 0, width: 1080, height: 1920, transform: `scale(${1 + p * 0.05})`, filter: `sepia(${0.3 + p * 0.4}) contrast(1.15)` }}>{renderAt(m + (t % 1.0))}</div>
        <div style={{ position: "absolute", inset: 0, background: C.red, mixBlendMode: "multiply", opacity: 0.25 }} />
      </div>
      <Svg>
        {sprockets(34)}
        {sprockets(1002)}
      </Svg>
    </Fill>
  );
};

/** 346.8 → 350.6 BWOOW — the picture melts down with the bass slide */
export const Bwoow: SceneFC = ({ t, T }) => {
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

/** 350.6 → end: vinyl stop, needle up, seal */
export const VinylStop: SceneFC = ({ t, T, d }) => {
  const slow = Math.max(0, 1 - t / 1.6);
  const rot = 200 * (t - (t * t) / 3.2);
  const arm = 22 - 54 * easeInOut(prog(t, 1.4, 2.2));
  const fade = prog(T, 352.4, 353.1);
  return (
    <Fill bg={C.ink}>
      <div style={{ position: "absolute", inset: 0, filter: `saturate(${slow + 0.2})` }}>
        <Svg>
          <Glow id="vs2-g" cx={540} cy={900} r={800} color={C.red} o={0.3 * slow} />
          <Vinyl x={540} y={900} R={430} rot={t < 1.6 ? rot : 200 * 0.8} />
          <Tonearm px={930} py={420} angle={arm} s={0.95} />
        </Svg>
      </div>
      <Seal x={540} y={1460} size={220} p={t - 1.7} />
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: fade }} />
    </Fill>
  );
};
