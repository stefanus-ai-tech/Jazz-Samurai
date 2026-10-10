import { C } from "../lib/constants";
import { clamp, easeInOut, easeOutBack, prog } from "../lib/math";
import { bass, bassHit, beatPulse, hitPulse } from "../lib/audio";
import { wt } from "../lib/lyrics";
import { Fill, Svg, Glow, SceneFC } from "./kit";
import { Rays, Halftone, Paper, Stars, Embers } from "../assets/Fx";
import { Sp, SpDrift, SpriteName, pop, stamp, sway } from "../sprite/Sp";

/** 146.8 → 149.15  "Got a crooked little grin and a crooked little groove" */
export const Crooked: SceneFC = ({ T }) => (
  <Fill bg={C.red2}>
    <div style={{ position: "absolute", inset: 0, transform: "rotate(-9deg) scale(1.3)" }}>
      <Svg>
        <Rays rot={T * 12} n={22} c1={C.red} c2={C.red2} />
      </Svg>
    </div>
    <Halftone color={C.ink} size={22} dot={26} opacity={0.2} angle={-9} />
    <Sp n="record_sun" x={640} y={1260} w={880} r={T * 110} skew={Math.sin(T * 3) * 8} sy={0.92 + Math.sin(T * 2.2) * 0.04} />
    <Sp n="ronin_red_scarf" x={290} y={1880} h={820} ay={1} r={-11 + Math.sin(T * 2.6) * 2} />
  </Fill>
);

/** 149.15 → 150.85  "Never met a mountain that I couldn't move" */
export const FujiMove: SceneFC = ({ t, T }) => {
  const mv = wt(38, 7);
  const shift = -340 * easeOutBack(prog(T, mv, mv + 0.4), 1.6);
  return (
    <Fill bg={C.navy}>
      <Svg>
        <defs>
          <linearGradient id="fm-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.navy} />
            <stop offset="0.55" stopColor={C.blue2} />
            <stop offset="0.85" stopColor={C.red} />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#fm-sky)" />
      </Svg>
      <Sp n="clouds_rb" x={260 - t * 30} y={900} w={520} o={0.85} />
      <Sp n="sunset" x={760 + shift} y={1620} w={2100} ay={1} />
      <div style={{ position: "absolute", left: 0, top: 1600, width: 1080, height: 400, background: C.navy }} />
    </Fill>
  );
};

/** 150.85 → 152.5  "Not with force, not with speed" — the sword stays sheathed */
export const NoForce: SceneFC = ({ t, T }) => (
  <Fill bg={C.paper}>
    <Paper opacity={0.95} />
    <Sp n="brush_red" x={540} y={1210} w={1200} o={0.85} style={{ clipPath: `inset(0 ${(1 - easeInOut(prog(t, 0, 0.5))) * 100}% 0 0)` }} />
    <Sp n="saya" x={540} y={1480} w={940} r={-14} />
    <Sp n="hanko_shinobi" x={890} y={480} w={150} s={stamp(T, wt(39, 5))} r={6} />
  </Fill>
);

/** 152.5 → 155.3  "Just a little bit of patience and a pocket full of dreams" */
export const DreamPocket: SceneFC = ({ t, T }) => (
  <Fill bg={C.navy}>
    <Svg>
      <Stars n={90} t={T} />
    </Svg>
    <Sp n="bubble_thought" x={600} y={1100} w={980} s={0.9 + 0.1 * easeOutBack(clamp(t / 0.4))} r={sway(T, 2)} />
    <Sp n="moon2" x={560} y={1060} w={300} r={T * 10} />
    <Sp n="star4_red5" x={770} y={980} w={110} s={pop(T, 153.2)} r={T * 30} />
    <Sp n="star4_blue5" x={380} y={1160} w={90} s={pop(T, 153.6)} r={-T * 30} />
    <SpDrift names={["star4_white", "star4_blue3", "planet_cream", "star4_red2"]} n={8} t={T} seed={16} size={[50, 100]} rise={120} />
    <Sp n="ronin_blue_stand" x={210} y={1880} h={520} ay={1} />
  </Fill>
);

/** 155.3 → 157.25  "Dust on the record, gold in the sound" */
export const GoldDust: SceneFC = ({ T }) => (
  <Fill bg={C.ink}>
    <Svg>
      <Glow id="gd-g" cx={540} cy={1250} r={850} color={C.gold} o={0.3 + 0.2 * bass(T)} />
    </Svg>
    <Sp n="record_black" x={540} y={1250} w={980} r={T * 130} />
    <Svg>
      <Embers t={T} n={70} seed={33} colors={[C.gold, "#ffe7a0", C.paper]} rise={90} size={0.9} />
    </Svg>
    <Sp n="vu" x={900} y={560} w={200} o={0.85} style={{ clipPath: `inset(${(1 - clamp(0.3 + bass(T))) * 100}% 0 0 0)` }} />
  </Fill>
);

/** 157.25 → 159.22  "Everybody floats when the bass comes around" */
export const Lanterns: SceneFC = ({ t, T }) => (
  <Fill bg={C.navy}>
    <Svg>
      <Glow id="ln-g" cx={540} cy={1500} r={900} color={C.red} o={0.35} />
      <Stars n={70} t={T} />
    </Svg>
    <SpDrift names={["lantern"]} n={11} t={T} seed={18} size={[90, 170]} rise={120} glow={C.red} />
    <Sp n="ronin_blue_stand" x={540} y={1500 - t * 120 - bassHit(T, 0.3) * 20} h={560} r={Math.sin(T * 1.4) * 4} />
  </Fill>
);

/** 159.22 → 161.32  "I don't need a crown, I don't need a throne" — just a mic in the spotlight */
export const CrownCut: SceneFC = ({ t }) => (
  <Fill bg={C.ink}>
    <Sp n="stage" x={540} y={1180} w={1300} s={1.02 - t * 0.01} />
    <Sp n="mic_stand" x={540} y={1460} h={600} ay={1} glow={C.paper} glowR={30} />
  </Fill>
);

/** 161.32 → 164.25  "Just a six-string rhythm and a road back home" */
export const RoadHome: SceneFC = ({ t, T }) => {
  const h = hitPulse(T, 0.1);
  return (
    <Fill bg={C.blood}>
      <Svg>
        <defs>
          <linearGradient id="rh-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.navy} />
            <stop offset="0.8" stopColor={C.blood} />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#rh-sky)" />
        <Stars n={60} t={T} h={900} />
        <polygon points="540,1180 -400,1920 1480,1920" fill={C.ink} />
        {Array.from({ length: 6 }).map((_, k) => {
          const z = (t * 0.6 + k / 6) % 1;
          const y = 1180 + Math.pow(z, 2) * 740;
          return <rect key={k} x={540 - 4 - z * 18} y={y} width={8 + z * 36} height={20 + z * 90} fill={C.paper} opacity={0.8} />;
        })}
      </Svg>
      <Sp n="city_small" x={540} y={1190} w={900} ay={1} filter="brightness(0.6)" />
      <Sp n="radio" x={540} y={1560} w={560} sx={1 + h * 0.04} sy={1 - h * 0.05} />
      <SpDrift names={["note_red2", "note_blue2"]} n={6} t={T} seed={19} size={[70, 120]} rise={200} y0={700} y1={1500} />
    </Fill>
  );
};

const CHANT_ARROWS: { at: number; n: SpriteName; x: number; y: number; w: number; flip?: boolean }[] = [
  { at: wt(45, 0), n: "arrow_red", x: 300, y: 620, w: 420, flip: true },
  { at: wt(45, 1), n: "arrow_blue_speed", x: 780, y: 1330, w: 440 },
  { at: wt(47, 0), n: "arrow_red_speed", x: 300, y: 620, w: 420, flip: true },
  { at: wt(47, 1), n: "arrow_long_red", x: 780, y: 1330, w: 460 },
];

/** 164.25 → 170.6  "Left, right, slide! / Let the rhythm ride! / … / Keep it on the inside!" */
export const Chants: SceneFC = ({ T }) => {
  const line = T < wt(46, 0) - 0.1 ? 0 : T < wt(47, 0) - 0.1 ? 1 : T < wt(48, 0) - 0.1 ? 2 : 3;
  const bg = [C.red, C.blue2, C.red, C.ink][line];
  const slides = [wt(45, 2), wt(47, 2)];
  const sl = slides.map((s) => prog(T, s, s + 0.6));
  return (
    <Fill bg={bg}>
      <Halftone color={C.ink} size={24} dot={26} opacity={0.22} />
      {CHANT_ARROWS.map((a, i) => {
        const age = T - a.at;
        return age >= 0 && age < 1.4 ? <Sp key={i} n={a.n} x={a.x + (a.flip ? -1 : 1) * age * 60} y={a.y} w={a.w} flip={a.flip} s={pop(T, a.at, 0.2)} o={1 - clamp((age - 1.1) / 0.3)} /> : null;
      })}
      {sl.map((p, i) => (p > 0 && p < 1 ? <Sp key={i} n="ronin_blue_crouch" x={-300 + p * 1700} y={1500} w={700} skew={-14} o={1} /> : null))}
      {line === 1 && <Sp n="record_sun" x={-300 + prog(T, wt(46, 0), wt(46, 0) + 1.3) * 1700} y={1380} w={500} r={T * 400} />}
      {line === 3 && <Sp n="koi_yinyang" x={540} y={1400} w={520} r={T * 60} s={0.9 + beatPulse(T) * 0.1} />}
    </Fill>
  );
};
