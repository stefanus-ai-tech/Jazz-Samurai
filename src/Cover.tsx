import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "./lib/constants";
import { ff, loadAllFonts } from "./lib/fonts";
import { Svg, Glow, StripeSun } from "./scenes/kit";
import { SamuraiSeated } from "./assets/Samurai";
import { Kanji, Smoke, Halftone, Splat } from "./assets/Fx";
import { Seal } from "./scenes/Intro";
import { Finish } from "./Finish";

loadAllFonts();

/** Thumbnail / cover image for TikTok & Reels. */
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
    <Kanji ch="侍" x={540} y={820} size={1300} color={C.red2} font="jpBrush" opacity={0.35} />
    <Svg>
      <Glow id="cv-g" cx={540} cy={1180} r={800} color={C.red} o={0.45} />
      <StripeSun cx={540} cy={1180} r={420} fill={C.red} bg={C.ink} cuts={8} />
      <rect y={1500} width={1080} height={420} fill={C.ink} />
      <SamuraiSeated x={540} y={1515} s={1.5} t={0.6} eyes={C.cyan} rim={C.blue} />
    </Svg>
    <Smoke t={2} n={5} color={C.blue} opacity={0.3} y={1500} spread={560} size={900} rise={0} />
    <Splat x={860} y={330} size={520} color={C.blue} v={1} rot={30} />
    <Halftone color={C.ink} size={18} dot={26} opacity={0.35} fade="linear-gradient(0deg, #000, transparent 35%)" />
    <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", fontFamily: ff("bungeeshade"), fontSize: 168, lineHeight: 0.95, color: C.paper, textShadow: `0 10px 0 ${C.blue}` }}>
      JAZZ
      <br />
      SAMURAI
    </div>
    <Kanji ch="ジャズ侍" x={970} y={1120} size={92} color={C.paper} font="jpDela" vertical />
    <Seal x={140} y={1720} size={170} p={1} />
    <Finish T={3.3} grain={0.22} />
  </AbsoluteFill>
);
