import React from "react";
import { C } from "../lib/constants";
import { clamp, decay, easeIn, easeInOut, easeOut, easeOutBack, prog, rr, lerp } from "../lib/math";
import { bass, beatPulse, bassHit, hat, vocal, lastIdx, AUDIO, pulse } from "../lib/audio";
import { LINES } from "../lib/lyrics";
import { Fill, Svg, Cam, Glow, SceneFC } from "./kit";
import { Samurai } from "../assets/Samurai";
import { Katana } from "../assets/Blade";
import { Vinyl, Tomoe } from "../assets/Vinyl";
import { Globe, Footprint, BlackHole, PocketWatch } from "../assets/Props";
import { Torii, PetalStorm, Petal, Taiko, Grass } from "../assets/Japan";
import { Kanji, Smoke, Halftone, Rays, Stars, SpeedLines, Shock, Paper, Splat, Starburst, Embers } from "../assets/Fx";

/** I don't run when the world spins fast */
export const WorldSpin: SceneFC = ({ t, T }) => (
  <Fill bg={C.ink}>
    <Svg>
      <SpeedLines t={T} n={120} inner={520} color={C.blue2} />
      <Globe x={540} y={820} R={470} spin={T * 9} />
      <Glow id="ws-g" cx={540} cy={1500} r={500} color={C.red} o={0.5} />
      <Samurai x={540} y={1640} s={1.35} t={T} wind={1} rim={C.red} />
    </Svg>
  </Fill>
);

/** I let every little moment last — freeze frame */
export const FreezeFrame: SceneFC = ({ t, T }) => {
  const freezeAt = 87.6;
  const fz = T >= freezeAt;
  const tt = fz ? freezeAt : T;
  const jump = Math.sin(clamp((tt - 86.38) / 1.6) * Math.PI) * 260;
  return (
    <Fill bg={fz ? C.paper : C.navy}>
      {fz && <Paper opacity={0.9} />}
      <Cam z={fz ? 1 + (T - freezeAt) * 0.04 : 1}>
        <Svg>
          {!fz && <Stars t={T} n={60} />}
          <circle cx={540} cy={760} r={330} fill={C.red} />
          <PetalStorm t={tt} n={46} seed={5} colors={[C.red, C.ink, C.blue]} wind={140} speed={260} size={1.4} />
          <Samurai x={540} y={1480 - jump} s={1.3} t={tt} walk={tt * 6} armL={70} armR={70} lean={-8} fill={C.ink} rim={fz ? C.blue : C.cyan} />
        </Svg>
      </Cam>
      {fz && (
        <div style={{ position: "absolute", inset: 40, border: `14px solid ${C.ink}`, boxShadow: `inset 0 0 0 8px ${C.red}` }} />
      )}
      {fz && <Kanji ch="瞬" x={170} y={260} size={200} color={C.red} font="jpAntique" opacity={clamp((T - freezeAt) / 0.1)} />}
    </Fill>
  );
};

/** One step left and a half step back — dance diagram */
export const DanceSteps: SceneFC = ({ t, T }) => {
  const steps = [
    { at: 89.04, x: 760, y: 1380, left: false, rot: 0 },
    { at: 89.6, x: 470, y: 1180, left: true, rot: -18 },
    { at: 90.08, x: 200, y: 980, left: true, rot: -30 },
    { at: 90.5, x: 380, y: 1230, left: false, rot: 10 },
    { at: 91.12, x: 600, y: 1420, left: false, rot: 22 },
  ];
  return (
    <Fill bg={C.paper}>
      <Paper opacity={1} />
      <Svg>
        {Array.from({ length: 12 }).map((_, k) => (
          <line key={k} x1={0} y1={700 + k * 90} x2={1080} y2={700 + k * 90} stroke={C.blue} strokeWidth={2} opacity={0.25} />
        ))}
        {steps.map((s, i) =>
          T >= s.at ? (
            <g key={i} opacity={easeOut(prog(T, s.at, s.at + 0.12))}>
              <Footprint x={s.x} y={s.y} rot={s.rot} s={1.25 * (1.4 - 0.4 * easeOut(prog(T, s.at, s.at + 0.12)))} left={s.left} fill={i % 2 ? C.red : C.ink} />
              <circle cx={s.x + 100} cy={s.y - 120} r={34} fill={C.blue} />
              <text x={s.x + 100} y={s.y - 104} fontSize={44} textAnchor="middle" fill={C.paper} fontFamily={`"JS Bungee"`}>{i + 1}</text>
            </g>
          ) : null,
        )}
        {T > 89.6 && <path d="M760,1380 Q520,1120 200,980" stroke={C.ink} strokeWidth={6} strokeDasharray="18 14" fill="none" />}
        {T > 90.5 && <path d="M200,980 Q380,1100 600,1420" stroke={C.red} strokeWidth={6} strokeDasharray="18 14" fill="none" markerEnd="" />}
      </Svg>
      <Kanji ch="歩" x={880} y={1600} size={260} color={C.ink} font="jpBrush" opacity={0.85} />
    </Fill>
  );
};

/** Let the bassline bend till the vinyl cracks */
export const VinylCrack: SceneFC = ({ t, T }) => {
  const crack = easeOut(prog(T, 93.9, 94.4));
  const shake = crack > 0 ? Math.sin(T * 90) * 8 * (1 - prog(T, 94.0, 95.0)) : 0;
  return (
    <Fill bg={C.blue2}>
      <Svg>
        <Rays n={20} rot={-T * 15} c1={C.blue2} c2={C.navy} />
      </Svg>
      <Cam x={shake} z={1 + crack * 0.06}>
        <Svg>
          <Vinyl x={540} y={980} R={480} rot={T * (200 - crack * 180)} warp={Math.sin(T * 5) * 0.3 * bass(T) + crack * 0.2} crack={crack} />
        </Svg>
      </Cam>
      <Kanji ch="割" x={540} y={300} size={220} color={C.red} font="jpDela" opacity={crack} rot={-8} />
    </Fill>
  );
};

/** Down, down, down in the pocket — torii tunnel dive */
export const ToriiDive: SceneFC = ({ t, T }) => {
  let speed = 0.6;
  for (const wt of [95.36, 95.92, 96.48]) speed += decay(T, wt, 0.35) * 2.2;
  const travel = t * 1.0 + [95.36, 95.92, 96.48].reduce((a, wt) => a + (T > wt ? (1 - Math.exp(-(T - wt) / 0.35)) * 0.8 : 0), 0);
  const N = 12;
  return (
    <Fill bg={C.ink}>
      <Svg>
        <Glow id="td-g" cx={540} cy={980} r={420} color={C.cyan} o={0.7} />
        {Array.from({ length: N }).map((_, i) => {
          const z = N - i - (travel % 1);
          const s = 2.6 / (0.25 + z * 0.55);
          if (s > 9) return null;
          return <Torii key={i + Math.floor(travel)} x={540} y={980 + 230 * s} s={s} fill={(i + Math.floor(travel)) % 2 ? C.red : C.red2} opacity={clamp(1.4 - z / N)} />;
        })}
        <SpeedLines t={T} n={60} inner={650} color={C.cyan} opacity={0.15 + speed * 0.1} />
      </Svg>
    </Fill>
  );
};

/** So damn deep, can't nobody stop it — deep-sea descent */
export const DeepDepth: SceneFC = ({ t, T }) => {
  const depth = Math.floor(lerp(400, 9999, clamp(t / 2.6)));
  return (
    <Fill bg={C.navy}>
      <Svg>
        <defs>
          <linearGradient id="dd-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.blue2} />
            <stop offset="1" stopColor="#020309" />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#dd-g)" />
        {Array.from({ length: 6 }).map((_, k) => (
          <polygon key={k} points={`${200 + k * 140},0 ${260 + k * 140},0 ${60 + k * 180},1920 ${-40 + k * 180},1920`} fill={C.cyan} opacity={0.05} />
        ))}
        {Array.from({ length: 40 }).map((_, k) => {
          const x = rr(1, k, 0, 1080) + Math.sin(T * 2 + k) * 14;
          const y = 1950 - ((rr(2, k, 0, 2000) + t * rr(3, k, 200, 600)) % 2000);
          return <circle key={k} cx={x} cy={y} r={rr(4, k, 4, 18)} fill="none" stroke={C.cyan} strokeWidth={3} opacity={0.6} />;
        })}
        <g transform={`translate(540, ${1250 + t * 30}) scale(${1 - t * 0.12})`}>
          <Samurai x={0} y={0} s={0.9} t={T} wind={0.2} armL={140} armR={140} rim={C.blue} />
        </g>
        <rect x={60} y={300} width={16} height={1200} fill={C.paper} opacity={0.3} />
        <rect x={60} y={300 + clamp(t / 2.6) * 1150} width={16} height={50} fill={C.red} />
      </Svg>
      <div style={{ position: "absolute", left: 96, top: 260 + clamp(t / 2.6) * 1150, fontFamily: `"JS SpaceMono"`, fontSize: 40, color: C.red }}>-{depth}m</div>
      <Kanji ch="深" x={860} y={1560} size={300} color={C.cyan} font="jpBrush" opacity={0.6} />
    </Fill>
  );
};

/** Low, low, lower than the ground — earth strata cross-section */
export const Strata: SceneFC = ({ t, T }) => {
  const pan = easeInOut(clamp(t / 2.6)) * 900;
  const layers = [C.blood, C.red2, C.ink, C.navy, C.blood, C.ink, C.blue2, C.ink];
  return (
    <Fill bg={C.navy}>
      <Cam y={-pan}>
        <Svg>
          <rect y={-400} width={1080} height={1100} fill={C.navy} />
          <circle cx={820} cy={300} r={110} fill={C.paper} />
          <Grass t={T} y={700} n={90} h={90} fill={C.ink} />
          <Samurai x={300} y={700} s={0.55} t={T} />
          {layers.map((col, k) => {
            const y0 = 700 + k * 260;
            let d = `M0,${y0}`;
            for (let i = 0; i <= 12; i++) d += ` L${i * 90},${y0 + Math.sin(i * 1.3 + k) * 30}`;
            d += ` L1080,${y0 + 1400} L0,${y0 + 1400} Z`;
            return <path key={k} d={d} fill={col} />;
          })}
          {Array.from({ length: 7 }).map((_, k) => (
            <Vinyl key={k} x={rr(8, k, 120, 960)} y={1000 + k * 260} R={rr(9, k, 50, 110)} rot={k * 40} />
          ))}
          {Array.from({ length: 8 }).map((_, k) => (
            <path key={`r${k}`} d={`M${300 + k * 10},700 q ${rr(1, k, -80, 80)},200 ${rr(2, k, -140, 140)},${300 + k * 40}`} stroke={C.ink} strokeWidth={6} fill="none" />
          ))}
        </Svg>
      </Cam>
      <Kanji ch="底" x={880} y={1500} size={260} color={C.red} font="jpDela" opacity={0.85} />
    </Fill>
  );
};

/** Black hole groove gonna pull you down */
export const BlackHoleScene: SceneFC = ({ t, T, d }) => {
  const pull = easeIn(clamp(t / d));
  return (
    <Fill bg="#000">
      <Cam z={1 + pull * 0.5} r={t * 6}>
        <Svg>
          <Stars n={160} t={T} stretch={0.1 + pull * 0.6} />
          <BlackHole x={540} y={900} R={190} spin={T * 1.6} pull={pull} />
          {Array.from({ length: 10 }).map((_, k) => {
            const a = k * 0.63 + t * 2.4;
            const r = 900 * (1 - clamp((t * 0.4 + k * 0.1) % 1));
            return <Petal key={k} x={540 + Math.cos(a) * r} y={900 + Math.sin(a) * r * 0.5} rot={a * 90} s={1.5} fill={k % 2 ? C.red : C.cyan} />;
          })}
          {Array.from({ length: 4 }).map((_, k) => {
            const a = k * 1.6 + t * 1.8;
            const r = 760 * (1 - clamp((t * 0.35 + k * 0.22) % 1));
            return <PocketWatch key={`w${k}`} x={540 + Math.cos(a) * r} y={900 + Math.sin(a) * r * 0.5} s={0.5 * (r / 760 + 0.2)} rot={a * 80} t={T} />;
          })}
        </Svg>
      </Cam>
    </Fill>
  );
};

/** Ooh let it breathe / underneath — moonlit water breathing rings */
export const Breathe: SceneFC = ({ t, T }) => {
  const rings = [107.1, 107.9, 108.4, 109.8, 110.9, 111.8, 112.6];
  return (
    <Fill bg={C.navy}>
      <Svg>
        <defs>
          <linearGradient id="br-w" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.blue2} />
            <stop offset="1" stopColor="#020617" />
          </linearGradient>
        </defs>
        <Stars n={70} t={T} h={980} />
        <circle cx={540} cy={560} r={170 + vocal(T) * 20} fill={C.paper} />
        <rect y={980} width={1080} height={940} fill="url(#br-w)" />
        {Array.from({ length: 9 }).map((_, k) => (
          <rect key={k} x={540 - 170 + rr(1, k, -30, 30) + Math.sin(T * 2 + k) * 20} y={1010 + k * 34} width={340 - k * 28} height={8} fill={C.paper} opacity={0.6 - k * 0.05} />
        ))}
        {rings.map((r0, k) =>
          T > r0 ? <ellipse key={k} cx={540} cy={1180} rx={(T - r0) * 330} ry={(T - r0) * 70} fill="none" stroke={k % 2 ? C.cyan : C.paper} strokeWidth={5} opacity={clamp(1 - (T - r0) / 2.4)} /> : null,
        )}
      </Svg>
    </Fill>
  );
};

/** Don't rush that beat / shuffle those feet */
export const Shuffle: SceneFC = ({ t, T }) => {
  const ph = T * 9.4;
  return (
    <Fill bg={C.red}>
      <Svg>
        {Array.from({ length: 10 }).map((_, r) =>
          Array.from({ length: 8 }).map((_, c) => {
            const y0 = 1000 + Math.pow(r / 10, 1.6) * 920;
            const y1 = 1000 + Math.pow((r + 1) / 10, 1.6) * 920;
            const w0 = 60 + r * 40, w1 = 60 + (r + 1) * 40;
            const x0 = 540 + (c - 4) * w0, x1 = 540 + (c - 4) * w1;
            return <polygon key={`${r}-${c}`} points={`${x0},${y0} ${x0 + w0},${y0} ${x1 + w1},${y1} ${x1},${y1}`} fill={(r + c) % 2 ? C.ink : C.paper} />;
          }),
        )}
        <Footprint x={380 + Math.sin(ph) * 90} y={1500 - Math.max(0, Math.cos(ph)) * 60} rot={-10 + Math.sin(ph) * 14} s={1.5} left fill={C.ink} />
        <Footprint x={700 - Math.sin(ph) * 90} y={1500 - Math.max(0, -Math.cos(ph)) * 60} rot={10 - Math.sin(ph) * 14} s={1.5} left={false} fill={C.blue} />
      </Svg>
    </Fill>
  );
};

/** BOOM—CHA hits: taiko booms + katana slashes */
const BOOMS = [116.8, 118.7, 119.3, 120.2, 121.0, 121.7, 123.0];
const CHAS = [117.2, 119.8, 120.8, 122.5, 123.5];
export const BoomCha: SceneFC = ({ t, T }) => {
  const bi = lastIdx(BOOMS, T), ci = lastIdx(CHAS, T);
  const lastBoom = bi >= 0 ? BOOMS[bi] : -9, lastCha = ci >= 0 ? CHAS[ci] : -9;
  const isCha = lastCha > lastBoom;
  const k = Math.max(0, bi) + Math.max(0, ci);
  const bg = [C.red, C.ink, C.blue, C.paper][k % 4];
  const fg = [C.ink, C.red, C.ink, C.red][k % 4];
  const hb = decay(T, lastBoom, 0.25), hc = decay(T, lastCha, 0.22);
  const ang = [-30, 25, -15, 35, -40][Math.max(0, ci) % 5];
  return (
    <Fill bg={bg}>
      <Svg>
        <Rays n={22} rot={T * 30 + k * 20} c1={fg} c2={bg} />
        <circle cx={540} cy={940} r={380} fill={bg} />
        <Taiko x={540} y={940} R={330 * (1 + hb * 0.12)} hit={hb} rot={T * 90} skin={C.paper} tomoe={C.red} />
        <Shock cx={540} cy={940} p={clamp((T - lastBoom) / 0.5)} R={1300} color={fg} width={80} />
        {isCha && hc > 0.02 && (
          <g transform={`rotate(${ang} 540 940)`}>
            <rect x={-400} y={930 - 70 * hc} width={1900} height={140 * hc} fill={C.paper} />
            <rect x={-400} y={930 - 16} width={1900} height={32} fill={C.cyan} opacity={hc} />
          </g>
        )}
      </Svg>
      <Kanji ch={isCha ? "斬" : "轟"} x={540} y={1560} size={260} color={fg} font="jpDela" opacity={0.9} rot={isCha ? -10 : 6} />
    </Fill>
  );
};
