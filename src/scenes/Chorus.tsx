import React from "react";
import { C } from "../lib/constants";
import { clamp, decay, easeIn, easeInOut, easeOut, easeOutBack, prog, rr } from "../lib/math";
import { AUDIO, bass, bassHit, beatCount, beatPulse, lastIdx, since } from "../lib/audio";
import { wt } from "../lib/lyrics";
import { Fill, Svg, Cam, Glow, SceneFC } from "./kit";
import { Rays, Halftone, Paper, Stars, Shock, SpeedLines } from "../assets/Fx";
import { Sp, SpOrbit, SpTwinkle, SpriteName, pop, stamp, sway } from "../sprite/Sp";

/** 83.55 → 86.35  "I don't run when the world spins fast" */
export const WorldSpin: SceneFC = ({ t, T }) => (
  <Fill bg={C.ink}>
    <Svg>
      <Glow id="ws-g" cx={540} cy={760} r={900} color={C.blue} o={0.35} />
      <Stars n={70} t={T} />
    </Svg>
    <Sp n="galaxy" x={540} y={760} w={1500} r={T * 160} blend="screen" />
    <Sp n="planet_blue" x={540 + Math.cos(T * 3) * 420} y={760 + Math.sin(T * 3) * 160} w={150} />
    <Sp n="planet_cream" x={540 + Math.cos(T * 3 + 3) * 460} y={760 + Math.sin(T * 3 + 3) * 180} w={120} />
    <Sp n="ronin_red_stand" x={540} y={1760} h={760} ay={1} />
  </Fill>
);

/** 86.35 → 89.0  "I let every little moment last" — freeze frame on film */
export const FreezeFrame: SceneFC = ({ t, T }) => {
  const k = easeOutBack(clamp(t / 0.3));
  return (
    <Fill bg={C.paper}>
      <Paper opacity={0.95} />
      <Halftone color={C.red} size={24} dot={22} opacity={0.25} />
      <div style={{ position: "absolute", inset: 0, transform: `rotate(${-4 + (1 - k) * 8}deg) scale(${0.9 + 0.1 * k})`, transformOrigin: "540px 1050px" }}>
        <Sp n="filmstrip" x={540} y={1060} h={1180} filter="drop-shadow(0 18px 0 rgba(0,0,0,0.35))" />
        <Sp n="ronin_red_attack" x={540} y={800} w={470} filter="saturate(0.3) contrast(1.3)" />
        <Sp n="hourglass_tilt" x={540} y={1330} h={400} r={sway(T, 2)} />
      </div>
    </Fill>
  );
};

/** 89.0 → 91.6  "One step left and a half step back" */
export const DanceSteps: SceneFC = ({ T }) => {
  const left = wt(22, 3), back = wt(22, 7);
  const x = 600 - 260 * easeOutBack(prog(T, left, left + 0.3)) + 130 * easeOutBack(prog(T, back, back + 0.3));
  return (
    <Fill bg={C.blue}>
      <Svg>
        <Rays rot={T * 6} n={24} c1={C.blue2} c2={C.blue} />
      </Svg>
      <Halftone color={C.navy} size={22} dot={28} opacity={0.35} />
      <Sp n="arrow_red" x={300} y={1120} w={360} flip s={pop(T, left)} />
      <Sp n="arrow_white" x={760} y={1260} w={280} s={pop(T, back)} />
      <Sp n="ronin_blue_crouch" x={x} y={1740} w={900} ay={1} skew={-6 * decay(T, left, 0.25) + 6 * decay(T, back, 0.25)} />
    </Fill>
  );
};

/** 91.6 → 95.3  "Let the bassline bend till the vinyl cracks" */
export const VinylCrack: SceneFC = ({ t, T }) => {
  const crack = wt(23, 7);
  const c = prog(T, crack, crack + 0.9);
  const bend = Math.sin(T * 5) * 0.08 * (1 - c) * prog(t, 0.6, 1.6);
  const rot = T * 140;
  const halves = [
    { clip: "polygon(0 0, 56% 0, 46% 38%, 60% 58%, 47% 100%, 0 100%)", dx: -1 },
    { clip: "polygon(56% 0, 100% 0, 100% 100%, 47% 100%, 60% 58%, 46% 38%)", dx: 1 },
  ];
  return (
    <Fill bg={C.ink}>
      <Svg>
        <Glow id="vc-g" cx={540} cy={1040} r={800} color={C.red} o={0.35 + 0.3 * bass(T)} />
        <Shock cx={540} cy={1040} p={c * 1.4} R={1100} color={C.paper} width={50} />
      </Svg>
      {T < crack ? (
        <Sp n="record_bolt" x={540} y={1040} w={920} r={rot} sx={1 + bend} sy={1 - bend} skew={bend * 60} />
      ) : (
        halves.map((h, i) => (
          <div key={i} style={{ position: "absolute", inset: 0, transform: `translate(${h.dx * easeOut(c) * 260}px, ${easeIn(c) * 300}px) rotate(${h.dx * c * 18}deg)`, transformOrigin: "540px 1040px" }}>
            <Sp n="record_bolt" x={540} y={1040} w={920} r={crack * 140} style={{ clipPath: h.clip }} />
          </div>
        ))
      )}
      <Sp n="bolt_red2" x={300} y={760} w={320} s={pop(T, crack)} r={-10} />
      <Sp n="bolt_blue" x={800} y={1360} w={260} s={pop(T, crack + 0.08)} r={12} />
      <Sp n="slash_c" x={560} y={1040} w={700} s={pop(T, crack, 0.15)} blend="screen" />
    </Fill>
  );
};

/** 95.3 → 97.7  "Down, down, down in the pocket" — diving through torii gates */
export const ToriiDive: SceneFC = ({ t, T }) => (
  <Fill bg={C.ink}>
    <Svg>
      <Glow id="td-g" cx={540} cy={1000} r={700} color={C.red} o={0.6} />
    </Svg>
    {Array.from({ length: 7 }).map((_, k) => {
      const z = (t * 0.55 + (6 - k) / 7) % 1;
      const s = 0.12 * Math.pow(28, z);
      return <Sp key={k} n="torii" x={540} y={1000} w={760} s={s} o={clamp((1 - z) * 4) * clamp(z * 5)} filter={`brightness(${0.5 + z * 0.7})`} />;
    })}
    <SpTwinkle names={["star4_red2", "star4_blue2", "star4_white"]} T={T} events={AUDIO.beats} size={[60, 110]} area={[120, 600, 960, 1500]} />
  </Fill>
);

/** 97.7 → 100.35  "So damn deep, can't nobody stop it" */
export const DeepDepth: SceneFC = ({ t, T }) => (
  <Fill bg={C.navy}>
    <Sp n="tunnel3" x={540} y={1020} w={1250} s={1 + t * 0.35 + beatPulse(T) * 0.03} />
    <Sp n="tunnel3" x={540} y={1020} w={1250} s={(1 + t * 0.35) * 0.32} o={0.9} />
    <Sp n="koi_blue" x={540 + Math.sin(T * 2) * 120} y={500 + t * 220} w={560 - t * 120} r={20 + t * 10} />
    <Svg>
      {Array.from({ length: 22 }).map((_, k) => {
        const y = 1900 - ((rr(41, k, 0, 2000) + t * rr(42, k, 200, 500)) % 2000);
        return <circle key={k} cx={rr(43, k, 60, 1020) + Math.sin(T * 2 + k) * 20} cy={y} r={rr(44, k, 6, 20)} fill="none" stroke={C.cyan} strokeWidth={3} opacity={0.6} />;
      })}
    </Svg>
  </Fill>
);

/** 100.35 → 103.05  "Low, low, lower than the ground" — the camera sinks underground */
export const Strata: SceneFC = ({ t, T }) => {
  const dy = easeInOut(prog(t, 0.1, 2.6)) * 1500;
  const bands = [C.coal, C.blood, "#2a0d10", C.navy, "#12081a", C.ink];
  const buried: [SpriteName, number, number, number, number][] = [
    ["record_black", 250, 1700, 360, 20], ["cassette", 820, 2000, 320, -18], ["tomoe", 330, 2400, 260, 0], ["katana", 640, 2650, 900, -12], ["hanko_shinobi", 880, 2900, 150, 6],
  ];
  return (
    <Fill bg={C.ink}>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${-dy}px)` }}>
        <Svg>
          <rect width={1080} height={1300} fill={C.navy} />
          <Stars n={50} t={T} h={1100} />
          {bands.map((c, i) => (
            <rect key={i} y={1300 + i * 380} width={1080} height={400} fill={c} />
          ))}
        </Svg>
        <Sp n="skyline_jp" x={540} y={1320} w={1400} ay={1} />
        <div style={{ position: "absolute", left: 0, top: 1300, width: 1080, height: 2300, backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.5) 30%, transparent 32%)`, backgroundSize: "22px 22px", opacity: 0.5 }} />
        {buried.map(([n, x, y, w, r]) => (
          <Sp key={n} n={n} x={x} y={y} w={w} r={r} o={0.85} />
        ))}
      </div>
      <Sp n="ronin_red_stand" x={540} y={1180 + Math.sin(T * 2) * 10} h={560} r={Math.sin(T * 1.5) * 4} o={prog(t, 0.6, 1.2)} />
    </Fill>
  );
};

/** 103.05 → 107  "Black hole groove gonna pull you down" */
export const BlackHoleScene: SceneFC = ({ t, T }) => (
  <Fill bg={C.ink}>
    <Svg>
      <Stars n={120} t={T} stretch={0.02 * t} />
    </Svg>
    <Sp n="vortex2" x={540} y={900} w={1400} r={-T * 50} blend="screen" />
    <Sp n="portal_red" x={540} y={900} w={1150} r={-14} sy={1.4} o={0.8} blend="screen" />
    <SpOrbit names={["record_tomoe", "note_red", "clock_roman", "note_blue", "star8_red2", "cassette", "star4_white"]} n={14} t={T} seed={8} size={[110, 220]} R={[60, 760]} pull={1} speed={0.9} tilt={0.45} cy={900} />
    <Sp n="eclipse" x={540} y={900} h={760 * (1 + bass(T) * 0.08)} r={T * 20} />
  </Fill>
);

/** 107 → 113.95  "Ooh, let it breathe / Ooh, underneath" — moon over still water */
export const Breathe: SceneFC = ({ t, T }) => {
  const hi = lastIdx(AUDIO.bassOnsets, T);
  return (
    <Fill bg={C.navy}>
      <Svg>
        <Glow id="br-g" cx={540} cy={540} r={700} color={C.paper} o={0.2} />
        <Stars n={60} t={T} h={980} />
        <rect y={980} width={1080} height={940} fill="#040820" />
      </Svg>
      <Sp n="moon3" x={540} y={560} w={620} glow={C.paper} glowR={50} />
      <Sp n="moon3" x={540} y={1400} w={620} sy={-0.5} o={0.25} skew={Math.sin(T * 2) * 4} filter="blur(3px)" />
      <Sp n="koi_pair" x={540} y={1420} w={720} r={T * 14} o={0.9} />
      {[0, 1, 2].map((k) => {
        const j = hi - k;
        if (j < 0) return null;
        const p = clamp((T - AUDIO.bassOnsets[j]) / 2.2);
        return p < 1 ? <Sp key={j} n="portal_cream" x={540} y={1420} w={300 + p * 900} sy={1.2} o={(1 - p) * 0.45} blend="screen" /> : null;
      })}
    </Fill>
  );
};

/** 113.95 → 116.75  "Don't rush that beat! Let it shuffle those feet!" */
export const Shuffle: SceneFC = ({ T }) => {
  const b = beatCount(T);
  const p = beatPulse(T, 0.14);
  return (
    <Fill bg={C.red}>
      <div style={{ position: "absolute", left: 540, top: 0, width: 540, height: 1920, background: C.blue2 }} />
      <Halftone color={C.ink} size={22} dot={26} opacity={0.22} />
      <Sp n="speaker_red" x={190} y={1150} h={760} s={1 + (b % 2 ? 0 : p * 0.08)} />
      <Sp n="speaker_blue" x={890} y={1150} h={780} s={1 + (b % 2 ? p * 0.08 : 0)} />
      {Array.from({ length: 6 }).map((_, k) => (
        <Sp key={k} n={k % 2 ? "chevron_blue" : "chevron_red"} x={((k * 220 + T * 400) % 1320) - 120} y={1560 + (k % 2) * 40} w={110} />
      ))}
    </Fill>
  );
};

const BOOMS = [116.8, 118.7, 120.2, 121.0, 123.0];

/** 116.75 → 124.4  BOOM—CHA! five slams, each its own panel */
export const BoomCha: SceneFC = ({ T }) => {
  const i = Math.max(0, lastIdx(BOOMS, T));
  const t0 = BOOMS[i];
  const k = stamp(T, t0, 0.12);
  const bgs = [C.red, C.blue2, C.ink, C.navy, C.red];
  const ray = [C.red2, C.blue, C.blood, C.blue2, C.hot];
  const word = i === 1 || i === 3;
  return (
    <Fill bg={bgs[i]}>
      <Svg>
        <Rays rot={T * (i % 2 ? -30 : 30)} n={28} c1={ray[i]} c2={bgs[i]} />
        <Shock cx={540} cy={1000} p={clamp((T - t0) / 0.5)} R={1100} color={C.paper} width={50} />
      </Svg>
      {i === 0 && <Sp n="rising_sun4" x={540} y={1050} w={1000} r={T * 40} s={k} />}
      {i === 0 && <Sp n="tomoe" x={540} y={1050} w={420} r={-T * 120} s={k} />}
      {i === 2 && <Sp n="record_tomoe" x={540} y={1050} w={940} r={T * 300} s={k} />}
      {i === 4 && <Sp n="burst_cream" x={540} y={1050} w={1000} r={T * 20} s={k} />}
      {i === 4 && <Sp n="hanko_samurai" x={540} y={1050} w={420} r={-6} s={stamp(T, t0 + 0.1)} />}
      {word && <Sp n={i === 1 ? "burst_blue3" : "burst_red2"} x={540} y={960} w={1400} r={T * 30} o={0.8} blend="screen" />}
      {word && <Sp n="word_boomcha" x={540} y={960} w={1040} s={k} r={i === 1 ? -6 : 5} />}
      <SpTwinkle names={["starburst2", "star8_red2", "star4_white", "starburst_red2"]} T={T} events={AUDIO.beats} size={[120, 220]} area={[100, 600, 980, 1500]} />
    </Fill>
  );
};
