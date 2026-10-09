import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FPS } from "./lib/constants";
import { loadAllFonts } from "./lib/fonts";
import { clamp, decay, hash } from "./lib/math";
import { bassHit, beatPulse } from "./lib/audio";
import { CUES, LYRIC_STYLES, fallbackStyle, IMPACTS } from "./timeline";
import { TransitionView } from "./Transitions";
import { LyricsLayer } from "./Lyrics";
import { Finish } from "./Finish";
import { RenderAt } from "./ctx";

loadAllFonts();

const cueIndex = (T: number) => {
  let i = 0;
  while (i + 1 < CUES.length && CUES[i + 1].at <= T) i++;
  return i;
};

const sceneEl = (i: number, T: number) => {
  const c = CUES[i];
  const d = (CUES[i + 1]?.at ?? 353.2) - c.at;
  const S = c.S;
  return <S key={`s${i}`} t={T - c.at} d={d} T={T} />;
};

/** plain scene (no transition) for montage re-renders; montage scenes never nest */
const renderAt = (T: number) => {
  const i = cueIndex(T);
  if (CUES[i].montage) return <AbsoluteFill style={{ background: C.ink }} />;
  return <AbsoluteFill style={{ overflow: "hidden" }}>{sceneEl(i, T)}</AbsoluteFill>;
};

export const SceneStack: React.FC<{ T: number }> = ({ T }) => {
  const i = cueIndex(T);
  const c = CUES[i];
  const t = T - c.at;
  const cur = sceneEl(i, T);
  if (c.tr && c.tr !== "cut" && i > 0 && t < (c.trd ?? 0.4)) {
    const prev = sceneEl(i - 1, T);
    return <TransitionView kind={c.tr} p={t / (c.trd ?? 0.4)} A={prev} B={cur} T={T} />;
  }
  return <AbsoluteFill style={{ overflow: "hidden" }}>{cur}</AbsoluteFill>;
};

export type MVProps = { from: number; to: number; fadeOut: number };

export const MV: React.FC<MVProps> = ({ from, to, fadeOut }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const T = from + frame / FPS;
  const fr = Math.floor(T * 30);
  let shake = 0;
  for (const h of IMPACTS) shake += decay(T, h, 0.16);
  shake = Math.min(1.4, shake);
  const sx = (hash(fr) - 0.5) * 36 * shake, sy = (hash(fr + 7) - 0.5) * 36 * shake;
  const zoom = 1 + bassHit(T, 0.14) * 0.014 + beatPulse(T, 0.1) * 0.006 + shake * 0.03;
  const flash = Math.min(0.32, IMPACTS.reduce((a, h) => a + decay(T, h, 0.07), 0) * 0.32);
  const end = fadeOut > 0 ? clamp((frame - (durationInFrames - fadeOut * FPS)) / (fadeOut * FPS)) : 0;
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Audio
        src={staticFile("jazz-samurai.mp3")}
        trimBefore={Math.round(from * FPS)}
        volume={(f) => (fadeOut > 0 ? interpolate(f, [durationInFrames - fadeOut * FPS, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1)}
      />
      <RenderAt.Provider value={renderAt}>
        <AbsoluteFill style={{ transform: `translate(${sx}px,${sy}px) scale(${zoom})` }}>
          <SceneStack T={T} />
        </AbsoluteFill>
      </RenderAt.Provider>
      <AbsoluteFill style={{ transform: `translate(${sx * 0.4}px,${sy * 0.4}px)` }}>
        <LyricsLayer T={T} styles={LYRIC_STYLES} fallback={fallbackStyle} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: C.paper, opacity: flash, mixBlendMode: "screen" }} />
      <Finish T={T} />
      {end > 0 && <AbsoluteFill style={{ background: "#000", opacity: end }} />}
    </AbsoluteFill>
  );
};
