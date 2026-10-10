// Render stills at given song times (seconds) into out/preview/, reusing one bundle.
// usage: node tools/preview.mjs 12.9 15.5 60 ...   (or a range "a:b:step")
// env: PREVIEW_DIR (default out/preview), PREVIEW_SCALE (default 0.4)
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const args = process.argv.slice(2);
const times = [];
for (const a of args) {
  if (a.includes(":")) {
    const [s, e, st] = a.split(":").map(Number);
    for (let t = s; t <= e + 1e-6; t += st) times.push(+t.toFixed(3));
  } else times.push(Number(a));
}
const outDir = path.resolve(process.env.PREVIEW_DIR ?? "out/preview");
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), onProgress: () => {} });
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const browser = await openBrowser("chrome", { browserExecutable });
const composition = await selectComposition({ serveUrl, id: "JazzSamuraiMV", puppeteerInstance: browser, inputProps: {} });
const conc = 4;
let idx = 0;
const t0 = Date.now();
async function worker() {
  while (idx < times.length) {
    const t = times[idx++];
    const frame = Math.min(composition.durationInFrames - 1, Math.round(t * 30));
    await renderStill({ serveUrl, composition, frame, output: path.join(outDir, `f${String(frame).padStart(5, "0")}.jpeg`), imageFormat: "jpeg", jpegQuality: 80, scale: Number(process.env.PREVIEW_SCALE ?? 0.4), puppeteerInstance: browser, browserExecutable });
  }
}
await Promise.all(Array.from({ length: conc }, worker));
console.log(`rendered ${times.length} stills in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
await browser.close({ silent: true });
