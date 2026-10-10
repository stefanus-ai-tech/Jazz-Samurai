import raw from "../data/lyrics.json";

export type Word = { w: string; t: number };
export type Line = { id: number; text: string; kind: "rap" | "spoken" | "back" | "shout" | "scat" | "whisper"; start: number; end: number; words: Word[] };
export const LINES = raw as Line[];

const BY_ID = new Map(LINES.map((l) => [l.id, l]));
export const lineOf = (id: number) => BY_ID.get(id)!;
/** song time of word i of lyric line id (clamped to the last word) */
export const wt = (id: number, i: number) => {
  const l = lineOf(id);
  return l.words[Math.min(i, l.words.length - 1)].t;
};
