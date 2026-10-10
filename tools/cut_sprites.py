"""Cut the sprite sheets in assets/ into individual sprites.

usage: python3 tools/cut_sprites.py            (all sprites in tools/sprites.json)
       python3 tools/cut_sprites.py name ...   (only these)

Every entry of tools/sprites.json is [sheet, x0, y0, x1, y1, mode?, {"drop": [[x, y], ...]}?]:
  cc     (default) keep only the pieces that belong to the box: each opaque pixel is
         assigned to its nearest solid blob; blobs that mostly live outside the box
         (a neighbour's scarf, a tonearm poking in) are dropped
  box    plain crop (for sprites that touch their neighbours)
  circle crop + inscribed circle mask (records in a row)
  drop   sheet points whose blob must go (a neighbour that sits inside the box)
The cut is trimmed, upscaled 2x (Lanczos + light unsharp) and saved as
public/sprites/<name>.webp; src/data/sprites.json gets the sizes.
"""
import json, sys, pathlib
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "sprites"
SCALE = 2
FEATHER = 6

cuts = {k: v for k, v in json.loads((ROOT / "tools" / "sprites.json").read_text()).items() if not k.startswith("_")}
only = set(sys.argv[1:])
OUT.mkdir(parents=True, exist_ok=True)

_sheets = {}


def sheet(n):
    if n not in _sheets:
        rgba = np.array(Image.open(ROOT / "assets" / f"{n}.png").convert("RGBA"))
        a = rgba[..., 3]
        solid = a > 150
        lab, _ = ndi.label(solid, structure=np.ones((3, 3)))
        # every visible pixel joins its nearest solid blob (glow and haze follow their owner)
        _, (iy, ix) = ndi.distance_transform_edt(~solid, return_indices=True)
        owner = lab[iy, ix]
        owner[a == 0] = 0
        area = np.bincount(owner.ravel())
        _sheets[n] = (rgba, owner, area)
    return _sheets[n]


def feather(h, w):
    ry = np.minimum(np.arange(h), np.arange(h)[::-1])
    rx = np.minimum(np.arange(w), np.arange(w)[::-1])
    return np.clip(np.minimum.outer(ry, rx) / FEATHER, 0, 1)


def cut(name, spec):
    n, x0, y0, x1, y1 = spec[:5]
    extra = spec[5:]
    mode = next((e for e in extra if isinstance(e, str)), "cc")
    drop = next((e["drop"] for e in extra if isinstance(e, dict)), [])
    rgba, owner, area = sheet(n)
    crop = rgba[y0:y1, x0:x1].astype(np.float32)
    h, w = crop.shape[:2]
    own = owner[y0:y1, x0:x1]
    keep = np.ones((h, w), np.float32)
    if mode == "cc":
        inside = np.bincount(own.ravel(), minlength=len(area))
        total = inside[1:].sum()
        ok = np.zeros(len(area), bool)
        for c in np.nonzero(inside)[0]:
            frac = inside[c] / area[c]
            # mostly inside the box, or a big shared blob (merged art) that this box is cut from
            if c and (frac >= 0.5 or (frac >= 0.25 and inside[c] >= 0.35 * total)):
                ok[c] = True
        keep = ok[own].astype(np.float32)
    if drop:
        gone = np.isin(own, [owner[y, x] for x, y in drop if owner[y, x]])
        keep = keep * (~gone)
    if mode == "circle":
        yy, xx = np.mgrid[0:h, 0:w]
        r = min(w, h) / 2
        d = np.hypot(xx - (w - 1) / 2, yy - (h - 1) / 2)
        keep = np.clip(r - d, 0, 1.5) / 1.5
    alpha = crop[..., 3] * keep * feather(h, w)
    ys, xs = np.nonzero(alpha > 4)
    if not len(ys):
        print("EMPTY", name)
        return None
    ya, yb, xa, xb = max(0, ys.min() - 2), min(h, ys.max() + 3), max(0, xs.min() - 2), min(w, xs.max() + 3)
    crop[..., 3] = alpha
    im = Image.fromarray(np.clip(crop[ya:yb, xa:xb], 0, 255).astype(np.uint8), "RGBA")
    im = im.resize((im.width * SCALE, im.height * SCALE), Image.LANCZOS)
    rgb = im.convert("RGB").filter(ImageFilter.UnsharpMask(radius=2, percent=55, threshold=2))
    out = Image.merge("RGBA", (*rgb.split(), im.getchannel("A")))
    out.save(OUT / f"{name}.webp", "WEBP", quality=90, alpha_quality=100, method=6)
    return [im.width, im.height]


meta_path = ROOT / "src" / "data" / "sprites.json"
meta = json.loads(meta_path.read_text()) if meta_path.exists() and only else {}
for name, spec in cuts.items():
    if only and name not in only:
        continue
    size = cut(name, spec)
    if size:
        meta[name] = size
meta = {k: meta[k] for k in cuts if k in meta}
meta_path.write_text(json.dumps(meta, separators=(",", ":")) + "\n")
print(f"{len(meta)} sprites -> {OUT.relative_to(ROOT)}")
