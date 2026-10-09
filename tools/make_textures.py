"""Procedural texture assets for the MV (grain, paper, smoke, dry-brush strokes, ink splats, ensō)."""
import numpy as np, pathlib
from PIL import Image, ImageFilter
from scipy.ndimage import zoom, gaussian_filter, map_coordinates

OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "tex"
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(7)

def fbm(h, w, octaves=6, base=4, persistence=0.55, seed=0):
    r = np.random.default_rng(seed); acc = np.zeros((h, w)); amp = 1; tot = 0
    for o in range(octaves):
        s = base * 2 ** o
        g = r.random((s + 1, int(s * w / h) + 2))
        up = zoom(g, (h / s, w / s * (s / (int(s * w / h) + 0.0001)) if False else h / s), order=3)[:h, :w]
        if up.shape != (h, w):
            up = np.pad(up, ((0, max(0, h - up.shape[0])), (0, max(0, w - up.shape[1]))), mode="edge")[:h, :w]
        acc += amp * up; tot += amp; amp *= persistence
    acc /= tot
    return (acc - acc.min()) / (acc.max() - acc.min() + 1e-9)

def save_mask(a, name):
    a = np.clip(a, 0, 1)
    rgba = np.zeros(a.shape + (4,), np.uint8); rgba[..., :3] = 255; rgba[..., 3] = (a * 255).astype(np.uint8)
    Image.fromarray(rgba, "RGBA").save(OUT / name, optimize=True)

# film grain tiles
for i in range(4):
    g = rng.normal(0.5, 0.17, (512, 512)); g = gaussian_filter(g, 0.6)
    g = (g - g.mean()) / g.std() * 0.16 + 0.5
    Image.fromarray((np.clip(g, 0, 1) * 255).astype(np.uint8), "L").save(OUT / f"grain{i}.png", optimize=True)

# washi paper (tileable-ish, warm)
h = w = 1024
p = fbm(h, w, 7, 3, 0.6, 3) * 0.6 + fbm(h, w, 3, 24, 0.5, 4) * 0.4
fib = np.zeros((h, w))
for _ in range(900):
    x, y = rng.integers(0, w), rng.integers(0, h); L = rng.integers(20, 120); a = rng.random() * np.pi
    xs = (x + np.cos(a) * np.arange(L)).astype(int) % w; ys = (y + np.sin(a) * np.arange(L)).astype(int) % h
    fib[ys, xs] += rng.random() * 0.8
fib = gaussian_filter(fib, 0.7)
v = 0.82 + 0.12 * p + 0.1 * np.clip(fib, 0, 1)
rgb = np.stack([v * 1.0, v * 0.95, v * 0.86], -1)
Image.fromarray((np.clip(rgb, 0, 1) * 255).astype(np.uint8)).save(OUT / "paper.jpg", quality=85)

# smoke puffs (alpha masks)
for i in range(3):
    s = 768; n = fbm(s, s, 6, 3, 0.58, 10 + i)
    yy, xx = np.mgrid[0:s, 0:s] / s - 0.5
    d = np.sqrt(xx ** 2 + yy ** 2)
    fall = np.clip(1 - d / 0.5, 0, 1) ** 1.6
    a = np.clip((n - 0.38) * 2.2, 0, 1) * fall
    a = gaussian_filter(a, 2)
    save_mask(a / a.max() * 0.95, f"smoke{i}.png")

# long wispy smoke band
s_h, s_w = 512, 1536; n = fbm(s_h, s_w, 6, 3, 0.6, 21)
yy = np.linspace(-1, 1, s_h)[:, None]
band = np.exp(-(yy / 0.45) ** 2) * np.clip((n - 0.35) * 2.5, 0, 1)
save_mask(gaussian_filter(band, 2) / band.max(), "smokeband.png")

def brush_stroke(w, h, seed, taper=True, dry=0.55):
    r = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    u = xx / w
    # width profile: pressure up then lift with ragged tail
    prof = np.clip(np.sin(np.clip(u * 1.08, 0, 1) * np.pi) ** 0.35, 0, 1) if taper else np.ones_like(u)
    center = h / 2 + (np.sin(u * 3.1 + r.random() * 6) * 0.06 + (u - 0.5) * 0.05) * h
    half = h * 0.42 * prof * (1 + 0.08 * np.sin(u * 13 + seed))
    edge = np.abs(yy - center) / (half + 1e-6)
    body = np.clip((1 - edge) * 6, 0, 1)
    # bristle streaks: per-row noise along x
    rows = r.random(h)
    streak = zoom(r.random((h // 2, 12)), (2, w / 12), order=1)[:h, :w]
    bristle = np.clip((streak + rows[:, None] * 0.5) - (u ** 1.5) * dry * 1.4, 0, 1)
    gaps = np.where(bristle < 0.35 + 0.35 * u, 0.0, 1.0)
    gaps = gaussian_filter(gaps, (0.6, 2.5))
    rough = fbm(h, w, 4, 6, 0.5, seed) * 0.35
    a = body * np.clip(gaps + (1 - u) * 0.55 - rough, 0, 1)
    return np.clip(a * 1.3, 0, 1)

for i in range(3):
    save_mask(brush_stroke(2048, 360, 30 + i), f"brush{i}.png")

# ensō: dry brush along a circle, polar warp of a stroke
s = 1024; stroke = brush_stroke(2400, 220, 77, dry=0.32)
yy, xx = np.mgrid[0:s, 0:s] - s / 2
ang = (np.arctan2(yy, xx) + np.pi / 2) % (2 * np.pi)  # start at top, clockwise in screen space
rad = np.sqrt(xx ** 2 + yy ** 2)
u = ang / (2 * np.pi) * 0.93  # leave the classic gap
R0 = 380 + 18 * np.sin(ang * 2.0)
v = (rad - R0) / 110 * 110 + 110
coords = np.array([np.clip(v, 0, 219), np.clip(u * 2399, 0, 2399)])
e = map_coordinates(stroke, coords, order=1) * (ang / (2 * np.pi) < 0.93)
save_mask(e, "enso.png")

# ink splats
for i in range(4):
    s = 1024; r = np.random.default_rng(50 + i)
    a = np.zeros((s, s))
    yy, xx = np.mgrid[0:s, 0:s]
    cx, cy = s / 2, s / 2
    a += np.exp(-(((xx - cx) ** 2 + (yy - cy) ** 2) / (2 * (90 + 40 * r.random()) ** 2))) * 3
    for _ in range(26):
        ang = r.random() * 2 * np.pi; dist = r.uniform(80, 420); rr = r.uniform(6, 46) * (1 - dist / 520)
        x, y = cx + np.cos(ang) * dist, cy + np.sin(ang) * dist
        a += np.exp(-(((xx - x) ** 2 + (yy - y) ** 2) / (2 * rr ** 2))) * 2
        # streak back toward center
        for k in np.linspace(0, 1, 14):
            x2, y2 = cx + np.cos(ang) * dist * k, cy + np.sin(ang) * dist * k
            a += np.exp(-(((xx - x2) ** 2 + (yy - y2) ** 2) / (2 * (rr * 0.35 + 3) ** 2))) * 0.6
    n = fbm(s, s, 5, 8, 0.5, 60 + i)
    m = np.clip((a + n * 0.9 - 1.0) * 4, 0, 1)
    save_mask(gaussian_filter(m, 0.8), f"splat{i}.png")

# halftone dot sprite for cheap CSS patterns is done in CSS; here a soft light-leak
s = 1024; n = fbm(s, s, 4, 2, 0.5, 90)
yy, xx = np.mgrid[0:s, 0:s] / s
leak = np.clip(np.exp(-((xx - 0.15) ** 2 + (yy - 0.2) ** 2) / 0.08) * (0.6 + 0.6 * n), 0, 1)
save_mask(leak, "leak.png")
print(sorted(p.name for p in OUT.iterdir()))
