import raw from "../data/lyrics.json";

export type Word = { w: string; t: number };
export type Line = { id: number; text: string; kind: "rap" | "spoken" | "back" | "shout" | "scat" | "whisper"; start: number; end: number; words: Word[] };
export const LINES = raw as Line[];
