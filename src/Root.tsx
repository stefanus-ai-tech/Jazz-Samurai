import React from "react";
import { Composition } from "remotion";
import { FPS, H, SONG_DURATION, W } from "./lib/constants";
import { MV, MVProps } from "./MV";

/** Reel cut: "Get down, get down" → pre-chorus → chorus → BOOM—CHA (≈49 s) */
const REEL: MVProps = { from: 2266 / 30, to: 124.6, fadeOut: 0.6 };
const FULL: MVProps = { from: 0, to: SONG_DURATION, fadeOut: 0 };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="JazzSamuraiMV"
      component={MV}
      durationInFrames={Math.ceil((FULL.to - FULL.from) * FPS)}
      fps={FPS}
      width={W}
      height={H}
      defaultProps={FULL}
      calculateMetadata={({ props }) => ({ durationInFrames: Math.ceil((props.to - props.from) * FPS) })}
    />
    <Composition
      id="JazzSamuraiReel"
      component={MV}
      durationInFrames={Math.ceil((REEL.to - REEL.from) * FPS)}
      fps={FPS}
      width={W}
      height={H}
      defaultProps={REEL}
      calculateMetadata={({ props }) => ({ durationInFrames: Math.ceil((props.to - props.from) * FPS) })}
    />
  </>
);
