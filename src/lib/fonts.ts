import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/** key -> [css family, file, avg glyph width ratio (for fitting)] */
export const FONTS = {
  anton: ["JS Anton", "anton", 0.47],
  bebas: ["JS Bebas", "bebas", 0.42],
  bangers: ["JS Bangers", "bangers", 0.52],
  marker: ["JS Marker", "marker", 0.64],
  monoton: ["JS Monoton", "monoton", 0.98],
  serif: ["JS DMSerif", "dmserif", 0.56],
  serifI: ["JS DMSerifItalic", "dmserif-italic", 0.5],
  typewriter: ["JS Typewriter", "typewriter", 0.62],
  blackops: ["JS BlackOps", "blackops", 0.7],
  rubikmono: ["JS RubikMono", "rubikmono", 0.92],
  bungee: ["JS Bungee", "bungee", 0.74],
  bungeeshade: ["JS BungeeShade", "bungeeshade", 0.82],
  shrikhand: ["JS Shrikhand", "shrikhand", 0.7],
  graffiti: ["JS Graffiti", "graffiti", 0.58],
  glitch: ["JS Glitch", "glitch", 0.72],
  caveat: ["JS Caveat", "caveat", 0.46],
  abril: ["JS Abril", "abril", 0.58],
  playfair: ["JS Playfair", "playfair", 0.58],
  spacemono: ["JS SpaceMono", "spacemono", 0.62],
  zendots: ["JS ZenDots", "zendots", 0.88],
  rocksalt: ["JS RockSalt", "rocksalt", 0.82],
  faster: ["JS Faster", "faster", 0.78],
  climate: ["JS Climate", "climate", 0.95],
  wetpaint: ["JS WetPaint", "wetpaint", 0.75],
  fredericka: ["JS Fredericka", "fredericka", 0.66],
  londrina: ["JS Londrina", "londrina", 0.52],
  syne: ["JS Syne", "syne", 0.74],
  righteous: ["JS Righteous", "righteous", 0.62],
  // Japanese (subset)
  jpDela: ["JS JP Dela", "jp-dela", 1],
  jpBrush: ["JS JP Yuji", "jp-yuji", 1],
  jpPotta: ["JS JP Potta", "jp-potta", 1],
  jpAntique: ["JS JP Antique", "jp-antique", 1],
  jpReggae: ["JS JP Reggae", "jp-reggae", 1],
  jpRampart: ["JS JP Rampart", "jp-rampart", 1],
  jpMincho: ["JS JP Mincho", "jp-mincho", 1],
  jpDot: ["JS JP Dot", "jp-dot", 1],
  jpBoku: ["JS JP Boku", "jp-boku", 1],
  jpTrain: ["JS JP Train", "jp-train", 1],
} as const;

export type FontKey = keyof typeof FONTS;
export const ff = (k: FontKey) => `"${FONTS[k][0]}", "IPAGothic", sans-serif`;

let loaded = false;
export const loadAllFonts = () => {
  if (loaded) return;
  loaded = true;
  for (const [family, file] of Object.values(FONTS)) {
    loadFont({ family, url: staticFile(`fonts/${file}.woff2`), format: "woff2" }).catch((e) => {
      console.error("font failed", family, e);
    });
  }
};

/** Pick a font size so `text` fits in a w×h box (heuristic from glyph width ratio). */
export const fitSize = (text: string, font: FontKey, w: number, h: number, max = 260, upper = true) => {
  const r = FONTS[font][2] * (upper ? 1.08 : 1);
  const words = text.split(/\s+/);
  const longest = Math.max(...words.map((x) => x.length));
  const chars = Math.max(1, text.length);
  const byArea = Math.sqrt((w * h) / (chars * r * 1.25 * 1.3));
  const byWord = w / (longest * r * 1.12);
  return Math.max(28, Math.min(byArea, byWord, max));
};
