"""Contact sheet of preview stills: python3 tools/sheet.py out.png [cols] [lo-hi seconds]  (env PREVIEW_DIR, default out/preview)"""
import sys, glob, pathlib, os
from PIL import Image, ImageDraw
out = sys.argv[1]; cols = int(sys.argv[2]) if len(sys.argv) > 2 else 6
files = sorted(glob.glob(os.path.join(os.environ.get("PREVIEW_DIR", "out/preview"), "f*.jpeg")))
if len(sys.argv) > 3:
    lo, hi = map(float, sys.argv[3].split("-")); files = [f for f in files if lo * 30 <= int(pathlib.Path(f).stem[1:]) <= hi * 30]
ims = [Image.open(f) for f in files]
w, h = ims[0].size; tw, th = w // 2, h // 2
rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (cols * tw, rows * (th + 22)), (30, 30, 30))
d = ImageDraw.Draw(sheet)
for i, (f, im) in enumerate(zip(files, ims)):
    x, y = (i % cols) * tw, (i // cols) * (th + 22)
    sheet.paste(im.resize((tw, th)), (x, y + 22))
    fr = int(pathlib.Path(f).stem[1:])
    d.text((x + 4, y + 4), f"{fr / 30:.2f}s", fill=(255, 255, 0))
sheet.save(out)
print(out, sheet.size, len(ims))
