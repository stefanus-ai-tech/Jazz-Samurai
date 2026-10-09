import { C } from "./lib/constants";
import { Line } from "./lib/lyrics";
import { LStyle } from "./Lyrics";
import type { Cue } from "./cue";
import * as P1 from "./parts/part1";
import * as P2 from "./parts/part2";
import * as P3 from "./parts/part3";
import * as P4 from "./parts/part4";

export type { Cue };

/** The whole video, scene by scene (seconds in the song), assembled from the four parts. */
export const CUES: Cue[] = [...P1.cues, ...P2.cues, ...P3.cues, ...P4.cues];

/** Typography for every lyric line (id → style). */
export const LYRIC_STYLES: Record<number, LStyle> = { ...P1.styles, ...P2.styles, ...P3.styles, ...P4.styles };

const P = C.paper, B2 = C.cyan;

export const fallbackStyle = (l: Line): LStyle => {
  switch (l.kind) {
    case "shout": return { s: "slam", font: "anton", color: P };
    case "spoken": return { s: "serif", font: "serifI", color: P };
    case "whisper": return { s: "whisper", font: "serifI", color: P };
    case "back": return { s: "echo", font: "anton", color: P, accent: B2 };
    case "scat": return { s: "pop", font: "bangers", color: P };
    default: return { s: "pop", font: "anton", color: P };
  }
};

/** Moments that kick the camera (shouts + big hits). */
export const IMPACTS: number[] = [15.38, 31.92, 116.8, 117.2, 118.7, 119.3, 119.8, 120.2, 120.8, 121.0, 121.7, 122.5, 123.0, 123.5, 144.92, 202.0, 333.02, 336.4];
