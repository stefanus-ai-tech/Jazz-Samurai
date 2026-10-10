import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { hash, rr } from "./lib/math";

/** Film finish: grain, dust & scratches, gate flicker, vignette. */
export const Finish: React.FC<{ T: number; grain?: number }> = ({ T, grain = 0.24 }) => {
  // grain/dust tick at 15 fps: more filmic, and far kinder to the encoder
  const fr = Math.floor(T * 15);
  const gx = Math.floor(hash(fr) * 512), gy = Math.floor(hash(fr + 0.5) * 512);
  const specks = Array.from({ length: 4 }).map((_, i) => ({
    x: rr(fr, i, 0, 1080), y: rr(fr, i + 20, 0, 1920), r: rr(fr, i + 40, 1, 4.5), on: hash(fr * 3 + i) > 0.55,
  }));
  const scratch = hash(fr * 0.37) > 0.92 ? rr(fr, 99, 80, 1000) : null;
  return (
    <>
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile(`tex/grain${fr % 4}.png`)})`, backgroundPosition: `${gx}px ${gy}px`, backgroundSize: "512px 512px", mixBlendMode: "overlay", opacity: grain }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 48%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
      <AbsoluteFill style={{ background: "#000", opacity: hash(fr * 1.7) * 0.05 }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {specks.map((s, i) => (s.on ? <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={i % 2 ? "#f2e6cf" : "#000"} opacity={0.6} /> : null))}
        {scratch !== null && <line x1={scratch} y1={0} x2={scratch + 6} y2={1920} stroke="#f2e6cf" strokeWidth={1.5} opacity={0.35} />}
      </svg>
    </>
  );
};
