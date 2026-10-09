import React from "react";
import { C } from "../lib/constants";
import { ff } from "../lib/fonts";
import { clamp, decay, easeInOut, easeOut, easeOutBack, prog, rr, bump } from "../lib/math";
import { AUDIO, bass, bassHit, beatCount, beatPulse, hitPulse, lastIdx, mid, pulse, since, hat } from "../lib/audio";
import { Fill, Svg, Cam, Glow, SceneFC, StripeSun } from "./kit";
import { Vinyl, Tonearm, Tomoe } from "../assets/Vinyl";
import { Samurai, SamuraiSeated, HatEyes } from "../assets/Samurai";
import { BassStrings, Clock } from "../assets/Props";
import { Kanji, Smoke, Halftone, Paper, SpeedLines, Starburst, Shock, Rays, Embers, Splat, Brush, Tex } from "../assets/Fx";
import { City, Fuji, Torii, Koi, Lantern, Sunflower, Taiko, Seigaiha, PetalStorm } from "../assets/Japan";
import { Katana } from "../assets/Blade";

/** Hanko seal stamp */
export const Seal: React.FC<{ x: number; y: number; size: number; p: number; text?: string; color?: string; rot?: number }> = ({ x, y, size, p, text = "侍", color = C.red, rot = -6 }) => {
  if (p <= 0) return null;
  const s = 1.8 - 0.8 * easeOut(clamp(p / 0.12));
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, transform: `rotate(${rot}deg) scale(${s})`, opacity: clamp(p / 0.05) }}>
      <div style={{ position: "absolute", inset: 0, border: `${size * 0.06}px solid ${color}`, borderRadius: size * 0.08 }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ff("jpAntique"), fontSize: size * 0.7, color, lineHeight: 1 }}>{text}</div>
    </div>
  );
};

/** 0 → 8.3  needle drop on the red record, shakuhachi smoke */
export const VinylIntro: SceneFC = ({ t, T }) => {
  const spin = t < 1.2 ? 100 * t * t : 120 + (t - 1.2) * 200;
  const arm = -32 + 54 * easeInOut(prog(t, 0.2, 1.5));
  const drop = decay(t, 1.55, 0.35);
  const z = 1.0 + t * 0.03;
  return (
    <Fill bg={C.ink}>
      <Cam z={z} r={-t * 0.6}>
        <Svg>
          <Glow id="vi-g" cx={540} cy={900} r={900} color={C.red} o={0.35 + 0.2 * drop} />
          <Embers t={T} n={40} colors={[C.paper, C.bone]} rise={30} size={0.7} />
        </Svg>
        <Kanji ch="侍" x={540} y={900} size={1250} color={C.red} opacity={0.12 + 0.1 * prog(t, 2, 8)} font="jpBrush" />
        <Svg>
          <Vinyl x={540} y={900} R={430} rot={spin} />
          <Tonearm px={930} py={420} angle={arm} s={0.95} />
          <Shock cx={540} cy={900} p={clamp((t - 1.55) / 0.8)} R={700} color={C.cyan} width={20} />
        </Svg>
        <Smoke t={T} n={5} color={C.blue} opacity={0.32} y={1550} spread={520} size={1000} rise={60} />
      </Cam>
      <Seal x={210} y={1380} size={190} p={t - 4.62} />
      <Kanji ch="ジャズ" x={880} y={1380} size={120} color={C.paper} font="jpDela" vertical opacity={clamp((t - 7.27) / 0.08)} />
    </Fill>
  );
};

/** 8.3 → 12.86 bass guitar alone: thick strings plucked on bass onsets */
export const BassIntro: SceneFC = ({ t, T }) => {
  const i = lastIdx(AUDIO.bassOnsets, T);
  const amps = [0, 1, 2, 3].map((k) => {
    let a = 0;
    for (let j = i; j >= Math.max(0, i - 4); j--) if (j % 4 === k) a = Math.max(a, decay(T, AUDIO.bassOnsets[j], 0.5));
    return a;
  });
  const b = bass(T);
  return (
    <Fill bg={C.blood}>
      <Cam z={1.08 - t * 0.012} r={2}>
        <Svg>
          <rect width={1080} height={1920} fill={C.blood} />
          {Array.from({ length: 14 }).map((_, k) => (
            <circle key={k} cx={rr(4, k, 0, 1080)} cy={rr(5, k, 0, 1920)} r={rr(6, k, 40, 160)} fill={k % 3 ? C.red : C.blue} opacity={0.12 + 0.12 * b} />
          ))}
          <rect x={-200} y={560} width={1500} height={900} fill={C.ink} transform="rotate(-12 540 960)" />
          <BassStrings t={T} amps={amps} y0={700} gap={170} angle={-12} />
          {Array.from({ length: 6 }).map((_, k) => (
            <rect key={k} x={-200 + k * 300} y={600} width={14} height={820} fill="#c9b79a" transform="rotate(-12 540 960)" opacity={0.85} />
          ))}
        </Svg>
      </Cam>
      <Kanji ch="低音" x={150} y={960} size={260} color={C.paper} font="jpDela" vertical stroke={C.paper} opacity={0.5} />
    </Fill>
  );
};

/** 12.86 → 16.1  manga sfx panel: DUM… BOW! */
export const DumComic: SceneFC = ({ t, T }) => {
  const bow = T >= 15.38;
  const kb = decay(T, 15.38, 0.3);
  return (
    <Fill bg={bow ? C.ink : C.paper}>
      {!bow && <Paper opacity={0.9} />}
      <Svg>
        {!bow ? (
          <>
            <SpeedLines t={T} n={110} inner={360} color={C.ink} opacity={0.85} />
            <circle cx={540} cy={960} r={300 + 30 * beatPulse(T)} fill={C.red} />
          </>
        ) : (
          <>
            <Rays rot={T * 40} n={30} c1={C.red} c2={C.ink} />
            <Starburst cx={540} cy={900} r1={300 + kb * 120} r2={560 + kb * 160} n={16} fill={C.cyan} stroke={C.ink} rot={T * 20} />
            <Shock cx={540} cy={900} p={clamp((T - 15.38) / 0.6)} R={1200} color={C.paper} width={60} />
          </>
        )}
      </Svg>
      {!bow && <Halftone color={C.red} size={22} dot={28} opacity={0.5} fade="linear-gradient(180deg, #000, transparent 45%, transparent 60%, #000)" />}
      <Kanji ch={bow ? "バウッ" : t > 1.0 ? "ドドン" : "ドン"} x={540} y={bow ? 1560 : 420} size={bow ? 230 : 210} color={bow ? C.paper : C.ink} font="jpDela" rot={-8} stroke={bow ? undefined : C.ink} opacity={bow ? 1 : 0.85} />
    </Fill>
  );
};

/** 16.1 → 22.7  breakbeat on three taiko drums */
export const TaikoBeat: SceneFC = ({ t, T }) => {
  const hi = lastIdx(AUDIO.hits, T);
  const drum = (k: number) => {
    let h = 0;
    for (let j = hi; j >= Math.max(0, hi - 6); j--) if (j % 3 === k) h = Math.max(h, decay(T, AUDIO.hits[j], 0.18));
    return h;
  };
  return (
    <Fill bg={C.navy}>
      <Svg>
        <Seigaiha r={70} c1={C.blue2} c2={C.navy} bg={C.navy} dx={T * 30} opacity={0.6} />
        <Taiko x={300} y={620} R={250} hit={drum(0)} rot={T * 60} />
        <Taiko x={790} y={900} R={220} hit={drum(1)} rot={-T * 60} skin={C.red} tomoe={C.ink} />
        <Taiko x={380} y={1240} R={230} hit={drum(2)} rot={T * 80} />
        {Array.from({ length: 24 }).map((_, k) => {
          const a = rr(7, k + Math.floor(T * 8), 0, Math.PI * 2);
          const r = 200 + hat(T) * 500;
          return <circle key={k} cx={540 + Math.cos(a) * r} cy={960 + Math.sin(a) * r * 1.4} r={4 + hat(T) * 6} fill={C.cyan} opacity={hat(T)} />;
        })}
        <line x1={0} y1={0} x2={1080 * prog(t, 0, 0.4)} y2={0} />
      </Svg>
      <Kanji ch="太鼓" x={900} y={480} size={150} color={C.paper} font="jpBrush" vertical opacity={0.85} />
    </Fill>
  );
};

/** 22.7 → 31.92  the voice: seated ronin before a red sun */
export const VoiceSeated: SceneFC = ({ t, T }) => {
  const z = 1 + t * 0.02 + Math.pow(prog(t, 7.6, 9.2), 2) * 0.6;
  const glint = decay(T, 24.4, 0.5) + decay(T, 27.04, 0.4) * 0.6;
  return (
    <Fill bg={C.ink}>
      <Cam z={z} py={1100}>
        <Svg>
          <Glow id="vs-g" cx={540} cy={1050} r={800} color={C.red} o={0.4} />
          <StripeSun cx={540} cy={1060} r={430 + 10 * beatPulse(T)} fill={C.red} bg={C.ink} t={T} cuts={8} />
          <rect x={0} y={1380} width={1080} height={600} fill={C.ink} />
          <SamuraiSeated x={540} y={1395} s={1.55} t={T} nod={Math.sin(T * 2.6) * 2} eyes={glint > 0.05 ? C.cyan : null} rim={C.blood} />
        </Svg>
        <Smoke t={T} n={6} color={C.blue} opacity={0.28} y={1350} spread={600} size={900} rise={30} />
      </Cam>
      <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.15 + 0.1 * Math.sin(T * 0.9)})` }} />
    </Fill>
  );
};

/** 31.92 → 33.4  WAH! */
export const WahBlast: SceneFC = ({ t, T }) => {
  const wob = 1 + Math.sin(t * 22) * 0.12 * Math.exp(-t * 1.5);
  return (
    <Fill bg={C.red}>
      <Svg>
        <Rays rot={t * 90} n={24} c1={C.red} c2={C.hot} />
      </Svg>
      <Splat x={540} y={940} size={1700} color={C.ink} v={1} rot={20} p={t / 0.35} />
      <Kanji ch="ワウ" x={540} y={1450} size={300} color={C.cyan} font="jpDela" rot={-6} scaleX={wob} opacity={clamp(t / 0.1)} />
      <Svg>
        <Shock cx={540} cy={940} p={clamp(t / 0.7)} R={1300} color={C.cyan} width={70} />
      </Svg>
    </Fill>
  );
};

/** 33.4 → 38.6  beat-cut icon montage */
export const Montage: SceneFC = ({ t, T }) => {
  const k = Math.max(0, beatCount(T) - beatCount(33.4));
  const card = k % 8;
  const p = beatPulse(T, 0.25);
  const bgs = [C.red, C.navy, C.paper, C.blue, C.ink, C.navy, C.red, C.ink];
  const icons: React.ReactNode[] = [
    <Katana key="k" x={540} y={960} rot={-35} s={1.05} L={780} glint={((T * 1.5) % 1)} />,
    <Vinyl key="v" x={540} y={960} R={420} rot={T * 200} label={C.blue} label2={C.red} />,
    <Tomoe key="t" x={540} y={960} R={380} rot={T * 120} fill={C.red} ring={C.ink} />,
    <g key="f"><rect width={1080} height={1920} fill={C.blue} /><Fuji x={540} y={1500} s={1.1} /></g>,
    <Torii key="to" x={540} y={1400} s={2.1} />,
    <g key="ko"><Koi x={420} y={860} rot={-30} s={1.6} t={T} /><Koi x={680} y={1120} rot={150} s={1.5} t={T + 1} body={C.ink} patch={C.blue} seed={4} /></g>,
    <Lantern key="la" x={540} y={940} s={2.6} ch="侍" />,
    <Sunflower key="su" x={540} y={820} s={1.6} rot={T * 30} t={T} />,
  ];
  return (
    <Fill bg={bgs[card]}>
      <Cam z={1.06 - p * 0.06} r={(card % 2 ? 1 : -1) * 2}>
        <Svg>{icons[card]}</Svg>
        <Halftone color={card === 2 ? C.red : C.ink} size={20} dot={26} opacity={0.35} fade="linear-gradient(0deg, #000, transparent 40%)" />
      </Cam>
      <Kanji ch={["刀", "盤", "鼓", "山", "門", "鯉", "灯", "陽"][card]} x={930} y={300} size={170} color={card === 2 ? C.ink : C.paper} font="jpDela" />
    </Fill>
  );
};

/** 38.6 → 46.0  walking through the night city (parallax) */
export const WalkCity: SceneFC = ({ t, T }) => (
  <Fill bg={C.navy}>
    <Svg>
      <defs>
        <linearGradient id="wc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.navy} />
          <stop offset="0.7" stopColor={C.blue2} />
          <stop offset="1" stopColor={C.red2} />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#wc-sky)" />
      <circle cx={760} cy={430} r={210} fill={C.paper} />
      <circle cx={700} cy={400} r={36} fill={C.bone} />
      <circle cx={820} cy={500} r={22} fill={C.bone} />
      <City y={1300} seed={11} fill="#0d1840" win={C.cyan} win2={C.paper} scale={0.75} offset={t * 60} neon={false} t={T} />
      <City y={1480} seed={23} fill={C.ink} win={C.red} win2={C.cyan} scale={1} offset={t * 180} t={T} />
      <rect y={1480} width={1080} height={440} fill={C.ink} />
      {Array.from({ length: 12 }).map((_, k) => (
        <rect key={k} x={((k * 180 - t * 420) % 2160 + 2160) % 2160 - 300} y={1540} width={110} height={10} fill={C.red} opacity={0.6} />
      ))}
      <Samurai x={460} y={1500} s={1.15} walk={T * 4.6} t={T} rim={C.red2} />
    </Svg>
    <Smoke t={T} n={4} color={C.cyan} opacity={0.18} y={1420} size={800} rise={10} />
  </Fill>
);

/** 46.0 → 52.6  under the hat: eyes open on the downbeat */
export const HatEyesScene: SceneFC = ({ t, T }) => {
  const open = easeOutBack(prog(T, 49.2, 49.6), 1.5);
  const z = 1 + t * 0.015 + Math.pow(prog(t, 5.9, 6.6), 3) * 2.2;
  return (
    <Fill bg={C.blood}>
      <Cam z={z} px={330} py={800}>
        <Svg>
          <g transform="translate(540,900) scale(1.35) translate(-540,-900)"><HatEyes open={open} glint={beatPulse(T)} smirk={easeOut(prog(T, 51.0, 51.5))} y={780} /></g>
        </Svg>
        <Smoke t={T} n={4} color={C.red} opacity={0.3} y={1400} size={900} rise={20} />
      </Cam>
    </Fill>
  );
};
