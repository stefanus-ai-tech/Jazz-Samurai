import React from "react";
import { useContext } from "react";
import { C } from "../lib/constants";
import { clamp, decay, easeOut, easeOutBack, prog, rr, hash } from "../lib/math";
import { AUDIO, bass, beatPulse, bassHit, hat, hitPulse, mid, lastIdx } from "../lib/audio";
import { LINES } from "../lib/lyrics";
import { Fill, Svg, Cam, Glow, SceneFC } from "./kit";
import { Samurai } from "../assets/Samurai";
import { Vinyl, Tomoe, Turntable } from "../assets/Vinyl";
import { Woofer, Keys, Boombox } from "../assets/Props";
import { Taiko, Shamisen, Seigaiha, City, Koi } from "../assets/Japan";
import { Kanji, Halftone, Rays, Rain, Smoke, Stars, Starburst, Tex, Shock } from "../assets/Fx";
import { RenderAt } from "../ctx";

const scatStarts = (a: number, b: number) => LINES.filter((l) => l.kind === "scat" && l.start >= a && l.start < b).map((l) => l.start);

/** 205.5 → 213.4 manga panels fill up with each scat phrase */
export const ComicPanels: SceneFC = ({ t, T }) => {
  const starts = scatStarts(205, 214);
  const n = starts.filter((s) => T >= s - 0.05).length;
  const panels = [
    { x: 30, y: 230, w: 500, h: 520 }, { x: 550, y: 230, w: 500, h: 520 },
    { x: 30, y: 770, w: 1020, h: 480 },
    { x: 30, y: 1270, w: 500, h: 520 }, { x: 550, y: 1270, w: 500, h: 520 },
  ];
  const fills = [C.red, C.blue, C.paper, C.navy, C.red2];
  const groove = T >= 209.4 && T < 211.0;
  return (
    <Fill bg={C.ink}>
      <Svg>
        {panels.map((p, k) => {
          const on = n > k || (k === 4 && n > 4);
          const idx = (k + Math.max(0, n - 5)) % 5;
          if (!on) return <rect key={k} x={p.x} y={p.y} width={p.w} height={p.h} fill="none" stroke={C.coal} strokeWidth={6} />;
          const kk = n > 5 ? (k + n) % 5 : k;
          return (
            <g key={k}>
              <rect x={p.x} y={p.y} width={p.w} height={p.h} fill={fills[kk]} stroke={C.paper} strokeWidth={10} />
              <clipPath id={`cp-${k}`}><rect x={p.x} y={p.y} width={p.w} height={p.h} /></clipPath>
              <g clipPath={`url(#cp-${k})`}>
                {kk === 0 && <Tomoe x={p.x + p.w / 2} y={p.y + p.h / 2} R={180} rot={T * 200} fill={C.ink} />}
                {kk === 1 && <Vinyl x={p.x + p.w / 2} y={p.y + p.h / 2} R={210} rot={T * 300} />}
                {kk === 2 && (groove ? (
                  <g>
                    <rect x={p.x} y={p.y} width={p.w} height={p.h} fill={C.navy} />
                    <g transform={`translate(${p.x + p.w / 2},${p.y + p.h + 120}) scale(1.4)`}>
                      <Samurai x={0} y={0} t={T} fill={C.blue2} rim={C.cyan} rimOffset={4} scarf={null} />
                    </g>
                    <Vinyl x={p.x + p.w / 2} y={p.y + p.h - 70} R={70} rot={T * 400} />
                  </g>
                ) : <Taiko x={p.x + p.w / 2} y={p.y + p.h / 2} R={190} hit={hitPulse(T)} rot={T * 100} />)}
                {kk === 3 && <Woofer x={p.x + p.w / 2} y={p.y + p.h / 2} R={190} pump={bass(T)} />}
                {kk === 4 && <Starburst cx={p.x + p.w / 2} cy={p.y + p.h / 2} r1={120} r2={240} fill={C.paper} rot={T * 50} />}
              </g>
            </g>
          );
        })}
      </Svg>
      <Halftone color={C.ink} size={16} dot={24} opacity={0.25} />
    </Fill>
  );
};

/** 213.4 → 218.6 turntablist scratch */
export const TurntableScene: SceneFC = ({ t, T }) => {
  const scratch = Math.sin(T * 14) * 40 * (0.4 + hat(T)) + Math.sin(T * 5.3) * 30;
  return (
    <Fill bg={C.ink}>
      <Svg>
        {Array.from({ length: 30 }).map((_, k) => (
          <line key={k} x1={0} y1={k * 70} x2={1080} y2={k * 70} stroke={C.red2} strokeWidth={2} opacity={0.5} />
        ))}
        <g transform="rotate(-12 540 980)">
          <Turntable x={540} y={980} s={1.05} rot={T * 120 + scratch} />
        </g>
        <Shock cx={480} cy={980} p={(T * 1.6) % 1} R={600} color={C.cyan} width={10} />
      </Svg>
      <Kanji ch="回転" x={540} y={330} size={170} color={C.red} font="jpDela" spacing={20} />
    </Fill>
  );
};

/** 218.6 → 223.8 VHS rewind through everything so far */
export const Rewind: SceneFC = ({ t, T }) => {
  const renderAt = useContext(RenderAt);
  const src = 205 - t * 34 - Math.sin(t * 2) * 3;
  const fr = Math.floor(T * 30);
  return (
    <Fill bg="#000">
      <div style={{ position: "absolute", left: 60, top: 300, width: 960, height: 1240, overflow: "hidden", borderRadius: 50, border: `16px solid ${C.coal}` }}>
        <div style={{ position: "absolute", left: -60, top: -340, width: 1080, height: 1920, transform: "scale(0.9)", transformOrigin: "600px 960px" }}>{renderAt(Math.max(0.5, src))}</div>
        {Array.from({ length: 3 }).map((_, k) => (
          <div key={k} style={{ position: "absolute", left: 0, right: 0, top: ((hash(fr + k) * 1300 + t * 900 * (k + 1)) % 1300) - 40, height: 26 + k * 10, background: "rgba(255,255,255,0.35)", mixBlendMode: "overlay" }} />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0 3px, transparent 3px 6px)" }} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 360, fontFamily: `"JS SpaceMono"`, fontSize: 64, color: "#fff", textShadow: `3px 0 ${C.red}, -3px 0 ${C.cyan}` }}>◀◀ REW</div>
      <div style={{ position: "absolute", left: 120, top: 1430, fontFamily: `"JS SpaceMono"`, fontSize: 48, color: "#fff", opacity: 0.85 }}>
        {`${String(Math.floor(src / 60)).padStart(2, "0")}:${String(Math.floor(src % 60)).padStart(2, "0")}`}
      </div>
    </Fill>
  );
};

/** 223.8 → 229.0 shamisen accents */
export const ShamisenScene: SceneFC = ({ t, T }) => (
  <Fill bg={C.navy}>
    <Svg>
      <Seigaiha r={64} c1={C.blue2} c2={C.blue} bg={C.navy} dx={-T * 40} opacity={0.7} />
      <circle cx={760} cy={600} r={300} fill={C.red} />
      <Shamisen x={480} y={1300} s={0.95} rot={28} vib={hitPulse(T, 0.2)} t={T} />
      <path d={`M${720 + Math.sin(T * 9) * 40},${1420} l120,-80 l40,140 Z`} fill={C.bone} />
    </Svg>
    <Kanji ch="三味線" x={160} y={600} size={140} color={C.paper} font="jpBrush" vertical />
  </Fill>
);

/** 229.0 → 233.2 neon alley in the rain */
export const NeonAlley: SceneFC = ({ t, T }) => (
  <Fill bg="#05060f">
    <Svg>
      <City y={1500} seed={77} fill="#090b18" win={C.red} win2={C.cyan} scale={1.4} offset={200 + t * 20} t={T * 2} />
      <rect y={1500} width={1080} height={420} fill="#05060f" />
      <g transform="translate(0,3000) scale(1,-1)" opacity={0.3}>
        <City y={1500} seed={77} fill="#090b18" win={C.red} win2={C.cyan} scale={1.4} offset={200 + t * 20} t={T * 2} />
      </g>
      <Samurai x={540} y={1560} s={1.2} t={T} rim={C.cyan} />
      <path d="M300,1130 Q540,880 780,1130 Z" fill={C.red} />
      {Array.from({ length: 9 }).map((_, k) => <line key={k} x1={540} y1={1000} x2={300 + k * 60} y2={1130} stroke={C.ink} strokeWidth={4} />)}
      <line x1={540} y1={1000} x2={540} y2={1300} stroke={C.ink} strokeWidth={8} />
      <Rain t={T} n={140} color={C.cyan} />
    </Svg>
  </Fill>
);

/** 233.2 → 244.5 scat feed over a giant pumping woofer */
export const WooferFeed: SceneFC = ({ t, T }) => {
  const g = (T >= 237.0 && T < 238.9) || (T >= 242.2 && T < 244.5);
  return (
    <Fill bg={C.ink}>
      <Svg>
        <Rays n={36} rot={T * 20} c1={g ? C.red : C.blue2} c2={C.ink} />
        <Woofer x={540} y={960} R={460} pump={bass(T)} ring={g ? C.red : C.blue} />
        {g && (
          <g transform="translate(540,1700) scale(2.6)" opacity={0.9}>
            <Samurai x={0} y={0} t={T} fill="rgba(0,0,0,0.6)" rim={C.cyan} rimOffset={3} scarf={C.red} />
          </g>
        )}
      </Svg>
    </Fill>
  );
};

/** 244.5 → 250.4 smoky Rhodes */
export const RhodesKeys: SceneFC = ({ t, T }) => {
  const notes = Array.from({ length: 14 }).map((_, k) => {
    const life = (t * 0.5 + rr(2, k, 0, 1)) % 1;
    return <text key={k} x={rr(3, k, 100, 980) + Math.sin(T + k) * 40} y={1300 - life * 1100} fontSize={rr(4, k, 70, 140)} fill={k % 2 ? C.cyan : C.red} opacity={Math.sin(life * Math.PI)} fontFamily="serif">{k % 3 ? "♪" : "♫"}</text>;
  });
  return (
    <Fill bg={C.blood}>
      <Svg>
        <rect width={1080} height={1920} fill={C.blood} />
        {notes}
        <g transform="rotate(-18 540 1400)">
          <rect x={-200} y={1200} width={1500} height={420} fill={C.ink} />
          <Keys x={-160} y={1260} w={1420} h={330} n={18} pressed={(i) => clamp(Math.sin(T * 7 + i * 1.7) * 2 - 1.2 + mid(T) * 1.5)} />
        </g>
      </Svg>
      <Smoke t={T} n={6} color={C.ink} opacity={0.4} y={900} spread={500} size={1000} rise={40} />
      <Kanji ch="鍵" x={880} y={360} size={200} color={C.paper} font="jpBrush" opacity={0.8} />
    </Fill>
  );
};

/** 250.4 → 256.3 two koi circling like a tomoe */
export const KoiPond: SceneFC = ({ t, T }) => {
  const a = T * 1.2;
  const R = 300;
  return (
    <Fill bg={C.navy}>
      <Svg>
        <rect width={1080} height={1920} fill="#061238" />
        {AUDIO.bassOnsets.filter((h) => h > 250 && h <= T).slice(-4).map((h, k) => (
          <circle key={k} cx={540} cy={960} r={(T - h) * 500} fill="none" stroke={C.cyan} strokeWidth={3} opacity={clamp(1 - (T - h) / 1.6)} />
        ))}
        {[0, 1, 2, 3, 4].map((k) => (
          <ellipse key={k} cx={540 + Math.cos(k * 1.3) * 420} cy={960 + Math.sin(k * 1.7) * 700} rx={90} ry={70} fill="#0f2a66" opacity={0.85} />
        ))}
        <Koi x={540 + Math.cos(a) * R} y={960 + Math.sin(a) * R} rot={(a * 180) / Math.PI + 90} s={1.5} t={T} body={C.paper} patch={C.red} />
        <Koi x={540 + Math.cos(a + Math.PI) * R} y={960 + Math.sin(a + Math.PI) * R} rot={((a + Math.PI) * 180) / Math.PI + 90} s={1.5} t={T + 0.5} body={C.ink} patch={C.blue} seed={7} />
      </Svg>
      <Kanji ch="鯉" x={540} y={1650} size={200} color={C.paper} font="jpBrush" opacity={0.6} />
    </Fill>
  );
};

/** 256.3 → 264.3 beatbox boombox */
export const BoomboxScene: SceneFC = ({ t, T }) => (
  <Fill bg={C.navy}>
    <Svg>
      {Array.from({ length: 26 }).map((_, r) =>
        Array.from({ length: 8 }).map((_, c) => <rect key={`${r}-${c}`} x={c * 150 - (r % 2) * 75 + 4} y={r * 76 + 4} width={142} height={68} fill="#0c1a4a" />),
      )}
      {[["侍", 200, 420, C.red], ["ズン", 820, 380, C.cyan], ["音", 900, 1700, C.red]].map(([ch, x, y, col], k) => (
        <text key={k} x={x as number} y={y as number} fontSize={200} fill={col as string} fontFamily={`"JS JP Reggae"`} textAnchor="middle" transform={`rotate(${-10 + k * 8} ${x} ${y})`} opacity={0.85}>{ch as string}</text>
      ))}
      <Boombox x={540} y={1180} s={1} pumpL={bass(T)} pumpR={hitPulse(T)} t={T} />
    </Svg>
  </Fill>
);
