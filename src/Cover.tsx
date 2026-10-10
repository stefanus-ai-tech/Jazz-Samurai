import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "./lib/constants";
import { ff, loadAllFonts } from "./lib/fonts";
import { Svg, Glow } from "./scenes/kit";
import { Kanji, Smoke, Halftone } from "./assets/Fx";
import { Sp } from "./sprite/Sp";
import { Finish } from "./Finish";

loadAllFonts();

/** Thumbnail / cover image for TikTok & Reels. */
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
    <Kanji ch="侍" x={540} y={820} size={1300} color={C.red2} font="jpBrush" opacity={0.35} />
    <Svg>
      <Glow id="cv-g" cx={540} cy={1180} r={800} color={C.red} o={0.45} />
    </Svg>
    <Sp n="rising_sun5" x={540} y={1180} w={1500} o={0.18} blend="screen" />
    <Sp n="sun_red3" x={540} y={1180} w={860} />
    <div style={{ position: "absolute", left: 0, top: 1500, width: 1080, height: 420, background: C.ink }} />
    <Sp n="ronin_red_stand" x={540} y={1530} h={900} ay={0.985} />
    <Smoke t={2} n={5} color={C.blue} opacity={0.3} y={1500} spread={560} size={900} rise={0} />
    <Sp n="splat" x={880} y={330} w={460} r={30} o={0.9} />
    <Halftone color={C.ink} size={18} dot={26} opacity={0.35} fade="linear-gradient(0deg, #000, transparent 35%)" />
    <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", fontFamily: ff("bungeeshade"), fontSize: 168, lineHeight: 0.95, color: C.paper, textShadow: `0 10px 0 ${C.blue}` }}>
      JAZZ
      <br />
      SAMURAI
    </div>
    <Kanji ch="ジャズ侍" x={970} y={1120} size={92} color={C.paper} font="jpDela" vertical />
    <Sp n="hanko" x={150} y={1720} w={170} r={-6} />
    <Finish T={3.3} grain={0.22} />
  </AbsoluteFill>
);
