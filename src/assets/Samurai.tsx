import React from "react";
import { C } from "../lib/constants";
import { poly } from "../lib/math";
import { useUid } from "./util";

export type SamuraiProps = {
  x?: number; y?: number; s?: number; flip?: boolean;
  /** walk phase in radians (undefined = standing) */
  walk?: number;
  t?: number;
  fill?: string;
  rim?: string; rimOffset?: number;
  scarf?: string | null; wind?: number;
  obi?: string;
  hat?: "kasa" | "topknot" | "bald";
  hatTilt?: number;
  sword?: "back" | "waist" | "drawn" | "none";
  armL?: number; armR?: number;
  lean?: number;
  eyes?: string | null;
  opacity?: number;
};

const Scarf: React.FC<{ t: number; wind: number; color: string; dir: number }> = ({ t, wind, color, dir }) => {
  const top: [number, number][] = [];
  const bot: [number, number][] = [];
  const N = 18;
  for (let i = 0; i <= N; i++) {
    const s = i / N;
    const x = dir * (6 + s * 260 * wind);
    const y = -286 + s * 34 * (1.2 - wind) + Math.sin(s * 7 - t * 9) * 22 * s * (0.4 + wind);
    const w = 15 * (1 - s * 0.55);
    top.push([x, y - w]);
    bot.push([x, y + w]);
  }
  return <path d={poly([...top, ...bot.reverse()])} fill={color} />;
};

/** Ronin silhouette. Origin = between the feet. ~380 units tall. */
export const Samurai: React.FC<SamuraiProps> = (p) => {
  const {
    x = 0, y = 0, s = 1, flip = false, walk, t = 0, fill = C.ink, rim, rimOffset = 7,
    scarf = C.red, wind = 0.7, obi = C.red, hat = "kasa", hatTilt = 0, sword = "back",
    armL = 0, armR = 0, lean = 0, eyes = null, opacity = 1,
  } = p;
  const sw = walk === undefined ? 0 : Math.sin(walk);
  const bob = walk === undefined ? 0 : Math.abs(Math.cos(walk)) * 7;
  const legL = sw * 34, legR = -sw * 34;

  const body = (col: string, isRim = false) => (
    <g>
      {sword === "back" && (
        <g>
          <line x1={-92} y1={-358} x2={-46} y2={-302} stroke={col} strokeWidth={13} strokeLinecap="round" />
          <ellipse cx={-44} cy={-299} rx={17} ry={6} transform="rotate(-50 -44 -299)" fill={col} />
          <line x1={-44} y1={-299} x2={92} y2={-128} stroke={col} strokeWidth={12} strokeLinecap="round" />
        </g>
      )}
      {sword === "waist" && (
        <g>
          <line x1={-30} y1={-172} x2={-150} y2={-205} stroke={col} strokeWidth={12} strokeLinecap="round" />
          <ellipse cx={22} cy={-158} rx={6} ry={16} transform="rotate(-15 22 -158)" fill={col} />
          <line x1={24} y1={-158} x2={92} y2={-142} stroke={col} strokeWidth={11} strokeLinecap="round" />
        </g>
      )}
      {/* hakama legs */}
      <path d={`M-46,-178 L6,-178 Q4,-90 ${-4 + legL},-14 L${-78 + legL},-14 Q-60,-100 -46,-178 Z`} fill={col} />
      <path d={`M-6,-178 L46,-178 Q60,-100 ${78 + legR},-14 L${4 + legR},-14 Q-4,-90 -6,-178 Z`} fill={col} />
      <ellipse cx={-42 + legL * 1.1} cy={-8} rx={26} ry={9} fill={col} />
      <ellipse cx={42 + legR * 1.1} cy={-8} rx={26} ry={9} fill={col} />
      {/* torso */}
      <path d="M-60,-284 Q0,-296 60,-284 L48,-176 L-48,-176 Z" fill={col} />
      {!isRim && <rect x={-50} y={-192} width={100} height={20} fill={obi} />}
      {!isRim && <path d="M-18,-284 L0,-236 L18,-284" stroke={C.coal} strokeWidth={4} fill="none" />}
      {/* sleeves */}
      <g transform={`rotate(${armL - sw * 9} -56 -278)`}>
        <path d="M-56,-284 L-102,-252 L-112,-156 L-62,-148 L-44,-232 Z" fill={col} />
        <circle cx={-86} cy={-150} r={13} fill={col} />
      </g>
      <g transform={`rotate(${-armR + sw * 9} 56 -278)`}>
        <path d="M56,-284 L102,-252 L112,-156 L62,-148 L44,-232 Z" fill={col} />
        <circle cx={86} cy={-150} r={13} fill={col} />
        {sword === "drawn" && (
          <path d="M86,-150 L92,-160 Q240,-250 420,-330 L428,-322 Q250,-232 96,-142 Z" fill={isRim ? col : C.bone} />
        )}
      </g>
      {/* head */}
      <rect x={-12} y={-300} width={24} height={20} fill={col} />
      <circle cx={0} cy={-312} r={27} fill={col} />
      {hat === "topknot" && (
        <g>
          <ellipse cx={0} cy={-344} rx={9} ry={16} fill={col} />
          <rect x={-30} y={-322} width={60} height={9} fill={isRim ? col : C.red} />
        </g>
      )}
      {hat === "kasa" && (
        <g transform={`rotate(${hatTilt} 0 -318)`}>
          <path d="M-122,-314 Q0,-412 122,-314 Q0,-328 -122,-314 Z" fill={col} />
          <circle cx={0} cy={-362} r={6} fill={col} />
        </g>
      )}
    </g>
  );
  return (
    <g transform={`translate(${x},${y - bob * s}) scale(${flip ? -s : s},${s}) rotate(${lean})`} opacity={opacity}>
      {scarf && <Scarf t={t} wind={wind} color={scarf} dir={-1} />}
      {rim && <g transform={`translate(${rimOffset},${-rimOffset * 0.4})`}>{body(rim, true)}</g>}
      {body(fill)}
      {eyes && (
        <g>
          <path d="M-16,-308 L-4,-305 L-15,-302 Z" fill={eyes} />
          <path d="M16,-308 L4,-305 L15,-302 Z" fill={eyes} />
        </g>
      )}
    </g>
  );
};

/** Cross-legged meditating ronin, sword upright against the shoulder. Origin = base center. */
export const SamuraiSeated: React.FC<{ x?: number; y?: number; s?: number; fill?: string; rim?: string; t?: number; nod?: number; scarf?: string; eyes?: string | null }> = ({
  x = 0, y = 0, s = 1, fill = C.ink, rim, t = 0, nod = 0, scarf = C.red, eyes = null,
}) => {
  const fig = (col: string, isRim = false) => (
    <g>
      <line x1={88} y1={-10} x2={70} y2={-330} stroke={col} strokeWidth={12} strokeLinecap="round" />
      <ellipse cx={70} cy={-300} rx={18} ry={6} fill={col} />
      <line x1={70} y1={-300} x2={66} y2={-372} stroke={col} strokeWidth={14} strokeLinecap="round" />
      <path d="M-150,0 Q-160,-56 -70,-74 L70,-74 Q160,-56 150,0 Z" fill={col} />
      <path d="M-62,-222 Q0,-232 62,-222 L54,-70 L-54,-70 Z" fill={col} />
      {!isRim && <rect x={-56} y={-96} width={112} height={18} fill={scarf} />}
      <path d="M-62,-220 L-110,-180 L-118,-70 L-40,-56 L-40,-170 Z" fill={col} />
      <path d="M62,-220 L110,-180 L118,-70 L40,-56 L40,-170 Z" fill={col} />
      <g transform={`rotate(${nod} 0 -240)`}>
        <rect x={-12} y={-244} width={24} height={20} fill={col} />
        <circle cx={0} cy={-256} r={27} fill={col} />
        <path d="M-126,-258 Q0,-360 126,-258 Q0,-272 -126,-258 Z" fill={col} />
        <circle cx={0} cy={-308} r={6} fill={col} />
        {!isRim && eyes && (
          <g>
            <path d="M-17,-250 L-4,-247 L-16,-244 Z" fill={eyes} />
            <path d="M17,-250 L4,-247 L16,-244 Z" fill={eyes} />
          </g>
        )}
      </g>
    </g>
  );
  const sc: [number, number][] = [];
  const sb: [number, number][] = [];
  for (let i = 0; i <= 16; i++) {
    const k = i / 16;
    const px = -10 - k * 230;
    const py = -226 + k * 60 + Math.sin(k * 6 - t * 6) * 16 * k;
    sc.push([px, py - 12 * (1 - k * 0.5)]);
    sb.push([px, py + 12 * (1 - k * 0.5)]);
  }
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d={poly([...sc, ...sb.reverse()])} fill={scarf} />
      {rim && <g transform="translate(8,-4)">{fig(rim, true)}</g>}
      {fig(fill)}
    </g>
  );
};

/** Extreme close-up: kasa brim across the frame, eyes glinting underneath. Drawn in a 1080 wide space. */
export const HatEyes: React.FC<{ open: number; glint: number; smirk: number; y?: number; iris?: string; skin?: string; hat?: string }> = ({
  open, glint, smirk, y = 760, iris = C.cyan, skin = C.blood, hat = C.ink,
}) => {
  const uid = useUid("eye");
  const eye = (cx: number, dir: number) => {
    const h = 38 * open;
    return (
      <g>
        <path d={`M${cx - 120 * dir},${y + 40} Q${cx},${y + 40 - h * 1.6} ${cx + 120 * dir},${y + 26} Q${cx},${y + 40 + h * 0.9} ${cx - 120 * dir},${y + 40} Z`} fill={C.paper} />
        <clipPath id={`${uid}${dir > 0 ? "a" : "b"}`}>
          <path d={`M${cx - 120 * dir},${y + 40} Q${cx},${y + 40 - h * 1.6} ${cx + 120 * dir},${y + 26} Q${cx},${y + 40 + h * 0.9} ${cx - 120 * dir},${y + 40} Z`} />
        </clipPath>
        <g clipPath={`url(#${uid}${dir > 0 ? "a" : "b"})`}>
          <circle cx={cx + 8 * dir} cy={y + 32} r={40} fill={iris} />
          <circle cx={cx + 8 * dir} cy={y + 32} r={18} fill={C.ink} />
          <circle cx={cx - 6 * dir} cy={y + 18} r={9 * (0.6 + glint)} fill="#fff" />
        </g>
        <path d={`M${cx - 130 * dir},${y + 44} Q${cx},${y + 30 - h * 1.7} ${cx + 132 * dir},${y + 20}`} stroke={C.ink} strokeWidth={10} fill="none" strokeLinecap="round" />
        <path d={`M${cx - 120 * dir},${y - 40 - 14 * smirk} L${cx + 130 * dir},${y - 18}`} stroke={C.ink} strokeWidth={22} strokeLinecap="round" />
      </g>
    );
  };
  return (
    <g>
      <rect x={0} y={y - 300} width={1080} height={1200} fill={skin} />
      {eye(330, 1)}
      {eye(750, -1)}
      <path d={`M380,${y + 360} Q540,${y + 360 + 30 * smirk} 700,${y + 340 - 40 * smirk}`} stroke={C.ink} strokeWidth={12} fill="none" strokeLinecap="round" />
      <path d={`M-40,${y - 120} Q540,${y - 760} 1120,${y - 120} Q540,${y - 40} -40,${y - 120} Z`} fill={hat} />
      <path d={`M-40,${y - 120} Q540,${y - 40} 1120,${y - 120}`} stroke={C.red} strokeWidth={6} fill="none" opacity={0.7} />
      {Array.from({ length: 22 }).map((_, i) => (
        <line key={i} x1={540} y1={y - 520} x2={-40 + i * 56} y2={y - 110 + Math.abs(i - 11) * -4} stroke={C.coal} strokeWidth={3} opacity={0.6} />
      ))}
    </g>
  );
};

/** The duel opponent's hat sliced in half — two halves drifting apart. */
export const KasaHalves: React.FC<{ x: number; y: number; s?: number; split: number; fill?: string; edge?: string }> = ({ x, y, s = 1, split, fill = C.ink, edge = C.cyan }) => {
  const uid = useUid("kasa");
  const shape = "M-122,0 Q0,-98 122,0 Q0,-14 -122,0 Z";
  const a = split * 70, b = split * 140;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <clipPath id={uid + "L"}><polygon points="-200,-200 18,-200 -18,60 -200,60" /></clipPath>
      <clipPath id={uid + "R"}><polygon points="18,-200 200,-200 200,60 -18,60" /></clipPath>
      <g transform={`translate(${-a},${b * 0.6}) rotate(${-split * 25})`}>
        <path d={shape} fill={fill} clipPath={`url(#${uid}L)`} />
      </g>
      <g transform={`translate(${a},${b}) rotate(${split * 35})`}>
        <path d={shape} fill={fill} clipPath={`url(#${uid}R)`} />
      </g>
      {split > 0 && split < 0.5 && <line x1={-40} y1={140} x2={40} y2={-160} stroke={edge} strokeWidth={6 * (1 - split * 2)} />}
    </g>
  );
};
