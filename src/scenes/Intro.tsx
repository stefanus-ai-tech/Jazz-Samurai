import React from "react";
import { C } from "../lib/constants";
import { ff } from "../lib/fonts";
import { clamp, decay, easeIn, easeInOut, easeOutBack, prog, rr } from "../lib/math";
import { AUDIO, bass, bassHit, beatCount, beatPhase, beatPulse, hitPulse, lastIdx, since } from "../lib/audio";
import { wt } from "../lib/lyrics";
import { Fill, Svg, Cam, Glow, SceneFC } from "./kit";
import { Kanji, Smoke, Halftone, Paper, SpeedLines, Shock, Rays, Embers, Stars, Seigaiha } from "../assets/Fx";
import { Sp, SpTwinkle, Glint, SpriteName, pop, stamp, sway } from "../sprite/Sp";

/** wraps x into a looping strip [-margin, span - margin) for scrolling layers */
export const wrap = (x: number, span: number, margin = 500) => ((((x + margin) % span) + span) % span) - margin;

/** 0 → 8.4  needle drop on the tomoe record, shakuhachi smoke */
export const VinylIntro: SceneFC = ({ t, T }) => {
  const spin = t < 1.2 ? 100 * t * t : 144 + (t - 1.2) * 200;
  const arm = -28 + 36 * easeInOut(prog(t, 0.2, 1.5));
  const drop = decay(t, 1.55, 0.35);
  return (
    <Fill bg={C.ink}>
      <Cam z={1 + t * 0.03} r={-t * 0.5}>
        <Svg>
          <Glow id="vi-g" cx={540} cy={900} r={900} color={C.red} o={0.35 + 0.25 * drop} />
          <Embers t={T} n={36} colors={[C.paper, C.bone]} rise={30} size={0.7} />
        </Svg>
        <Sp n="rising_sun5" x={540} y={900} w={1600} r={T * 6} o={0.1 + 0.1 * prog(t, 2, 8)} blend="screen" />
        <Sp n="vinyl" x={540} y={900} w={880} r={spin} s={1 + drop * 0.03} glow={C.blood} glowR={50} />
        <Sp n="tonearm2" x={905} y={330} h={680} ax={0.52} ay={0.08} r={arm} />
        <Svg>
          <Shock cx={540} cy={900} p={clamp((t - 1.55) / 0.8)} R={700} color={C.cyan} width={20} />
        </Svg>
        <Smoke t={T} n={5} color={C.blue} opacity={0.32} y={1550} spread={520} size={1000} rise={60} />
      </Cam>
      <Sp n="hanko" x={200} y={1400} w={200} s={stamp(T, 4.62)} r={-6} />
      <Kanji ch="ジャズ" x={880} y={1380} size={120} color={C.paper} font="jpDela" vertical opacity={clamp((t - 7.27) / 0.08)} />
    </Fill>
  );
};

/** 8.4 → 12.8  bass alone: the stacks breathe on every bass onset */
export const BassIntro: SceneFC = ({ t, T }) => {
  const b1 = bassHit(T, 0.18), b2 = bassHit(T - 0.08, 0.2);
  const level = clamp(0.25 + bass(T) * 0.9);
  return (
    <Fill bg={C.blood}>
      <Halftone color={C.red} size={26} dot={30} opacity={0.3} />
      <Cam z={1.06 - t * 0.012} r={-2}>
        <Sp n="halftone_ink" x={540} y={1000} w={1700} o={0.85} />
        <Sp n="cable" x={540} y={1640} w={900} r={Math.sin(T * 3) * 3} />
        <Sp n="speaker_red" x={300} y={1020} h={900} s={1 + b1 * 0.06} sy={1 - b1 * 0.02} r={-3} />
        <Sp n="speaker_blue" x={790} y={990} h={940} s={1 + b2 * 0.06} sy={1 - b2 * 0.02} r={3} />
        <Sp n="vu" x={540} y={330} w={340} style={{ clipPath: `inset(${(1 - level) * 100}% 0 0 0)` }} />
      </Cam>
      <Kanji ch="低音" x={540} y={1760} size={150} color={C.paper} font="jpDela" opacity={0.55} />
    </Fill>
  );
};

/** 12.8 → 16.1  manga sfx: BUM… BA-DUM… then BOW! */
export const DumComic: SceneFC = ({ T }) => {
  const BOW = 15.38;
  const bow = T >= BOW;
  const kb = decay(T, BOW, 0.3);
  if (bow) {
    return (
      <Fill bg={C.ink}>
        <Svg>
          <Rays rot={T * 40} n={30} c1={C.red} c2={C.ink} />
          <Shock cx={540} cy={900} p={clamp((T - BOW) / 0.6)} R={1200} color={C.paper} width={60} />
        </Svg>
        <Sp n="burst_blue" x={540} y={900} w={1500 + kb * 300} r={T * 30} o={0.8} blend="screen" />
        <Sp n="burst_bubble" x={540} y={900} w={1060 + kb * 160} r={-4} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 900, transform: `translateY(-50%) rotate(-7deg) scale(${2.2 - 1.2 * easeOutBack(clamp((T - BOW) / 0.16))})`, textAlign: "center", fontFamily: ff("bangers"), fontSize: 300, color: C.red, WebkitTextStroke: `14px ${C.ink}`, paintOrder: "stroke fill", textShadow: `0 16px 0 ${C.blue}` }}>
          BOW!
        </div>
        <Sp n="bangs" x={890} y={560} w={190} s={pop(T, BOW + 0.06)} r={14} />
        <Sp n="starburst_red" x={180} y={1300} w={260} s={pop(T, BOW + 0.12)} r={T * 40} />
      </Fill>
    );
  }
  return (
    <Fill bg={C.paper}>
      <Paper opacity={0.9} />
      <Svg>
        <SpeedLines t={T} n={110} inner={380} color={C.ink} opacity={0.8} />
      </Svg>
      <Sp n="burst_cream" x={540} y={880} w={1000} s={1 + beatPulse(T) * 0.06} r={T * 8} />
      <Sp n="word_bum" x={410} y={760} w={760} s={stamp(T, wt(1, 0), 0.12)} r={-8} />
      <Sp n="word_badum" x={650} y={1090} w={820} s={stamp(T, wt(1, 1), 0.12)} r={5} />
      <Halftone color={C.red} size={22} dot={28} opacity={0.4} fade="linear-gradient(180deg, #000, transparent 30%, transparent 75%, #000)" />
    </Fill>
  );
};

/** 16.1 → 22.6  breakbeat: the boombox jumps, notes fly out on every hit */
export const BeatBox: SceneFC = ({ T }) => {
  const h = hitPulse(T, 0.12);
  const hi = lastIdx(AUDIO.hits, T);
  const notes: React.ReactNode[] = [];
  for (let j = hi; j >= Math.max(0, hi - 7); j--) {
    const dt = T - AUDIO.hits[j];
    if (dt > 1.1) break;
    const a = -Math.PI / 2 + rr(21, j, -1.1, 1.1);
    const dist = 140 + dt * 820;
    const names: SpriteName[] = ["note_red", "note_blue", "note_red3", "note_blue3", "star4_white", "bolt_red4"];
    notes.push(<Sp key={j} n={names[j % names.length]} x={540 + Math.cos(a) * dist} y={980 + Math.sin(a) * dist} w={rr(22, j, 120, 200)} r={rr(23, j, -40, 40) + dt * 90} o={1 - dt / 1.1} />);
  }
  return (
    <Fill bg={C.navy}>
      <Svg>
        <Seigaiha r={70} c1={C.blue2} c2={C.navy} bg={C.navy} dx={T * 30} opacity={0.6} />
      </Svg>
      <Sp n="burst_blue3" x={540} y={1080} w={1400} r={T * 10} o={0.5} blend="screen" />
      {notes}
      <Sp n="boombox" x={540} y={1430} w={960} ay={1} sx={1 + h * 0.05} sy={1 - h * 0.07} r={Math.sin(T * 4.6) * 2} />
      <SpTwinkle names={["star4_white", "star4_blue3", "star4_cream"]} T={T} events={AUDIO.beats} size={[70, 130]} area={[80, 620, 1000, 1500]} />
    </Fill>
  );
};

/** 22.6 → 31.92  the voice: a ronin stands before the red sun */
export const RoninSun: SceneFC = ({ t, T }) => {
  const z = 1 + t * 0.02 + Math.pow(prog(t, 7.6, 9.3), 2) * 0.8;
  return (
    <Fill bg={C.ink}>
      <Cam z={z} py={1080}>
        <Svg>
          <Glow id="rs-g" cx={540} cy={1060} r={850} color={C.red} o={0.45} />
        </Svg>
        <Sp n="sun_red3" x={540} y={1070} w={930 + beatPulse(T) * 18} />
        <div style={{ position: "absolute", left: 0, top: 1480, width: 1080, height: 500, background: C.ink }} />
        <Sp n="ronin_red_stand" x={540} y={1500} h={900} ay={0.985} sy={1 + Math.sin(T * 1.6) * 0.006} glow={C.blood} glowR={24} />
        <Smoke t={T} n={6} color={C.blue} opacity={0.28} y={1420} spread={600} size={900} rise={30} />
      </Cam>
    </Fill>
  );
};

/** 31.92 → 33.4  WAH! */
export const WahBlast: SceneFC = ({ t }) => {
  const k = decay(t, 0, 0.4);
  return (
    <Fill bg={C.red}>
      <Svg>
        <Rays rot={t * 60} n={26} c1={C.hot} c2={C.red} />
      </Svg>
      <Sp n="splat" x={540} y={900} w={1150 * (0.55 + 0.45 * easeOutBack(clamp(t / 0.25)))} r={t * 10} />
      <Sp n="word_wah" x={540} y={900} w={1020} s={stamp(t, 0, 0.12)} r={-6 + Math.sin(t * 22) * k * 3} />
      <Kanji ch="ワウ" x={540} y={1450} size={200} color={C.cyan} font="jpDela" rot={-6} opacity={clamp((t - 0.2) / 0.1)} />
    </Fill>
  );
};

const CARDS: [SpriteName, string, number, number][] = [
  ["record_sun", C.blue, 0, 860], ["katana", C.red, -32, 1250], ["koi_yinyang", C.paper, 0, 820], ["lantern", C.navy, 0, 440],
  ["hanko_samurai", C.ink, -8, 640], ["boombox2", C.red, 4, 900], ["torii", C.blue, 0, 860], ["moon2", C.ink, 0, 760],
  ["cassette", C.red, -6, 860], ["headphones", C.blue, 0, 640], ["record_moon", C.red, 0, 860],
];

/** 33.4 → 38.6  beat-cut montage, one illustrated object per beat */
export const Montage: SceneFC = ({ T }) => {
  const i = Math.max(0, beatCount(T) - beatCount(33.4));
  const bt = Math.min(since(AUDIO.beats, T), T - 33.4);
  const [n, bg, r, w] = CARDS[i % CARDS.length];
  const ink = bg === C.paper ? C.red : C.ink;
  return (
    <Fill bg={bg}>
      <Svg>
        <Rays rot={i * 17 + bt * 30} n={18} c1={ink} c2={bg} />
      </Svg>
      <Halftone color={bg === C.ink ? C.red : C.ink} size={22} dot={30} opacity={0.25} />
      <Sp n={n} x={540} y={900} w={w} s={0.82 + 0.18 * easeOutBack(clamp(bt / 0.2))} r={r + bt * 6} glow={C.ink} glowR={20} />
    </Fill>
  );
};

/** 38.6 → 46  night walk: city layers scroll, the blue ronin keeps the beat */
export const WalkCity: SceneFC = ({ t, T }) => {
  const ph = beatPhase(T);
  const bob = Math.abs(Math.sin(ph * Math.PI));
  return (
    <Fill bg={C.navy}>
      <Svg>
        <defs>
          <linearGradient id="wc-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#03061a" />
            <stop offset="0.6" stopColor={C.navy} />
            <stop offset="0.82" stopColor={C.blood} />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#wc-sky)" />
        <Stars n={90} t={T} h={1100} />
      </Svg>
      <Sp n="moon" x={740} y={540} w={560} glow={C.paper} glowR={60} />
      {[0, 1, 2].map((k) => (
        <Sp key={`f${k}`} n="city_c" x={wrap(k * 1000 - t * 40, 3000)} y={1390} w={1010} ay={1} filter="brightness(0.45) saturate(0.8)" />
      ))}
      {[0, 1, 2, 3].map((k) => (
        <Sp key={`n${k}`} n="city_b" x={wrap(k * 700 - t * 120, 2800)} y={1580} w={720} ay={1} />
      ))}
      <div style={{ position: "absolute", left: 0, top: 1570, width: 1080, height: 400, background: C.ink }} />
      <Sp n="ronin_blue_stand" x={400} y={1720 - bob * 16} h={760} ay={1} r={Math.sin(ph * Math.PI * 2) * 1.6} />
      {[0, 1, 2].map((k) => (
        <Sp key={`l${k}`} n="lantern" x={160 + k * 380} y={-30 + (k % 2) * 60} h={300} ay={0.02} r={sway(T, 4, 1, k)} glow={C.red} glowR={40} />
      ))}
    </Fill>
  );
};

/** 46 → 52.6  the build: the blade leaves its sheath under an eclipse */
export const BladeEclipse: SceneFC = ({ t, T, d }) => {
  const draw = easeInOut(prog(t, 0.6, 5.2));
  const end = easeIn(prog(t, d - 0.9, d));
  const blade = { n: "katana" as const, x: 560 - draw * 230, y: 1250 - draw * 140, w: 1240, r: -8 - draw * 16 };
  const hi = lastIdx(AUDIO.hits, T);
  return (
    <Fill bg={C.ink}>
      <Cam z={1 + end * 1.8} py={760}>
        <Svg>
          <Glow id="be-g" cx={540} cy={760} r={900} color={C.red} o={0.22 + 0.2 * bass(T)} />
          <Stars n={60} t={T} />
        </Svg>
        <Sp n="eclipse" x={540} y={760} h={880 + t * 30} r={t * 4} glow={C.blue} glowR={40} />
        <Sp n="saya" x={540} y={1330} w={1000} r={-8} />
        <Sp {...blade} />
        <Glint {...blade} p={prog(t, 5.0, 5.7)} width={6} />
        {hi >= 0 && T - AUDIO.hits[hi] < 0.3 && (
          <Sp n={hi % 2 ? "streak_red2" : "streak_blue2"} x={rr(31, hi, 200, 880)} y={rr(32, hi, 1100, 1450)} w={700} o={1 - (T - AUDIO.hits[hi]) / 0.3} blend="screen" />
        )}
      </Cam>
    </Fill>
  );
};
