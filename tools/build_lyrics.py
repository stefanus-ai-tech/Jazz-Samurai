"""Build src/data/lyrics.json: every display line with per-word start times.

Sung/rapped lines are aligned automatically against the ASR word timeline
(tools/words_uvr.json, from Parakeet on UVR-isolated vocals). Scat, beatbox and
shouts that ASR can't read are pinned by hand to vocal/bass onsets.
"""
import difflib, json, re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent
ASR = json.load(open(ROOT / "words_uvr.json")) + json.load(open(ROOT / "words_spl.json"))
ASR.sort(key=lambda w: w[1])
NUM = {"12": "twelve", "9": "nine"}

def norm(s):
    s = s.lower().replace("'", "")
    return NUM.get(re.sub(r"[^a-z0-9]", "", s), re.sub(r"[^a-z0-9]", "", s))

# ---- the song, in order. kind: rap | spoken | back | shout | scat | whisper
# auto: (window_start, window_end) aligned against ASR.  manual: list of word start times.
L = []
def auto(win, kind, *lines):
    for t in lines: L.append(dict(text=t, kind=kind, win=win))
def man(kind, text, times, end=None):
    L.append(dict(text=text, kind=kind, times=times, end=end))

man("scat", "Dum... ba-dum... dum-dum...", [12.86, 13.40, 13.86])
man("shout", "Bum... ba-dum... BOW!", [14.52, 14.84, 15.38], end=16.4)
man("scat", "Tss-ka... boom... tss-ka...", [16.12, 16.86, 17.62])
man("scat", "Boom-ka-tss... ka-boom...", [19.10, 20.12], end=21.2)
man("spoken", "Mm.", [22.74], end=23.6)
auto((24, 32), "spoken", "Feel that?", "Don't chase the beat.", "Let it come to you.")
man("shout", "Wah!", [31.92], end=33.4)

auto((52, 74.2), "rap",
     "Black silk, black shoes, midnight stroll",
     "Got a little bit of jazz in a samurai soul",
     "Blade on my back but my hands stay clean",
     "Walkin' through the smoke like a fever dream",
     "Low ride, high tide, nowhere to go",
     "Got the whole damn city movin' extra slow",
     "Clock says twelve but the rhythm says nine",
     "Everybody got a watch, nobody got time")
man("back", "Get down, get down", [75.72, 76.0, 76.4, 76.62], end=77.6)
man("back", "Ba-da-bum, ba-da-bum", [79.1, 79.8], end=80.6)
man("back", "Get down, get down", [82.2, 82.5, 82.88, 83.2], end=83.65)
auto((83.5, 95.2), "rap",
     "I don't run when the world spins fast",
     "I let every little moment last",
     "One step left and a half step back",
     "Let the bassline bend till the vinyl cracks")
auto((95.2, 106.5), "rap",
     "Down, down, down in the pocket",
     "So damn deep, can't nobody stop it",
     "Low, low, lower than the ground",
     "Black hole groove gonna pull you down")
man("back", "Ooh, let it breathe", [107.1, 107.9, 108.2, 108.4], end=109.6)
man("back", "Ooh, underneath", [109.8, 110.9], end=113.6)
auto((113.8, 116.6), "shout", "Don't rush that beat!", "Let it shuffle those feet!")
man("shout", "BOOM—CHA!", [116.8], end=118.5)
man("shout", "BOOM-BOOM—CHA!", [118.7], end=120.1)
man("shout", "BOOM—CHA!", [120.2], end=120.95)
man("shout", "BOOM-BOOM—CHA!", [121.0], end=122.9)
man("shout", "BOOM—CHA!", [123.0], end=124.4)

auto((146.5, 164.0), "rap",
     "Got a crooked little grin and a crooked little groove",
     "Never met a mountain that I couldn't move",
     "Not with force, not with speed",
     "Just a little bit of patience and a pocket full of dreams",
     "Dust on the record, gold in the sound",
     "Everybody floats when the bass comes around",
     "I don't need a crown, I don't need a throne",
     "Just a six-string rhythm and a road back home")
man("back", "Left, right, slide!", [164.3, 164.7, 165.1], end=165.6)
man("back", "Let the rhythm ride!", [165.7, 165.8, 165.9, 166.4], end=166.9)
man("back", "Left, right, slide!", [167.0, 167.4, 167.8], end=168.2)
man("back", "Keep it on the inside!", [168.3, 168.6, 168.75, 168.9, 169.1], end=170.6)

auto((176.5, 185.5), "whisper",
     "Somewhere between the silence and the sound",
     "There's a little piece of heaven underground")
auto((187.2, 189.0), "whisper", "You hear that?")
man("scat", "Dum... dum-dum...", [188.86, 190.5], end=191.9)
man("scat", "Dum... dum-dum...", [192.12, 193.5], end=194.9)
auto((195.0, 197.5), "whisper", "That's the space between the notes.")
man("shout", "HA!", [202.0], end=203.6)

SCAT = ["Ba-doom, ba-da-bow", "Chicka-wah, chicka-now", "Doo-ba-dum, ba-da-dee", "Got that groove inside of me!"]
for text, t in zip(SCAT, [205.58, 206.84, 208.06, 209.44]):
    n = len(text.split()); man("scat", text, [t + i * 0.24 for i in range(n)])
for text, t in zip(SCAT[:3], [211.02, 211.68, 212.36]):
    n = len(text.split()); man("scat", text, [t + i * 0.25 for i in range(n)], end=t + 0.66 if t < 212 else 213.4)
for text, t in zip(SCAT, [233.3, 234.4, 235.5, 237.04]):
    n = len(text.split()); man("scat", text, [t + i * 0.3 for i in range(n)])
for text, t in zip(SCAT, [238.9, 240.0, 241.1, 242.2]):
    n = len(text.split()); man("scat", text, [t + i * 0.3 for i in range(n)], end=244.4 if t > 242 else None)
man("shout", "Bmm-ts, bmm-bmm-ts!", [256.42, 257.46], end=258.4)
man("shout", "Bada-bow, bada-bow!", [259.22, 259.7], end=260.6)
man("shout", "Tka-tss, boom-tss, boom!", [261.95, 262.88, 263.3], end=264.2)

auto((278.0, 289.0), "rap",
     "Down, down, down in the pocket",
     "So damn deep, can't nobody stop it",
     "Low, low, lower than the ground",
     "Black hole groove gonna pull you down")
man("back", "Down, down, down", [290.0, 290.5, 291.0], end=292.0)
man("back", "Feel that sound", [292.2, 292.9, 293.4], end=294.4)
man("back", "Down, down, down", [294.7, 295.4, 296.0], end=296.9)
man("back", "Underground", [297.0], end=298.8)
auto((299.0, 311.0), "spoken", "A little less hurry.", "A little more soul.", "A little more silence.", "Now let that bass roll.")
man("scat", "Dum... ba-dum...", [312.34, 313.72], end=315.0)
man("scat", "Dum-dum... bow...", [315.1, 316.64], end=317.9)
auto((318.0, 323.5), "spoken", "The secret ain't playing fast.", "It's knowing when not to play.")
man("shout", "BWOOW...", [346.9], end=350.6)

def align(lines, win):
    a, b = win
    asr = [w for w in ASR if a <= w[1] < b]
    # dedupe near-identical neighbours from the two stems
    dd = []
    for w in asr:
        if dd and norm(dd[-1][0]) == norm(w[0]) and abs(dd[-1][1] - w[1]) < 0.3: continue
        dd.append(w)
    asr = dd
    lw = [(i, w) for i, ln in enumerate(lines) for w in ln["text"].split()]
    n, m = len(lw), len(asr)
    def sim(x, y):
        x, y = norm(x), norm(y)
        if not x or not y: return 0
        return difflib.SequenceMatcher(None, x, y).ratio()
    NEG = -1e9
    D = [[NEG] * (m + 1) for _ in range(n + 1)]; P = [[None] * (m + 1) for _ in range(n + 1)]
    for j in range(m + 1): D[0][j] = 0  # free leading ASR junk
    for i in range(1, n + 1): D[i][0] = D[i-1][0] - 0.4; P[i][0] = (i-1, 0, "skipL")
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            s = sim(lw[i-1][1], asr[j-1][0])
            c = [(D[i-1][j-1] + (2 * s - 0.8 if s > 0.45 else -1.2), (i-1, j-1, "m" if s > 0.45 else "x")),
                 (D[i-1][j] - 0.4, (i-1, j, "skipL")), (D[i][j-1] - 0.25, (i, j-1, "skipA"))]
            D[i][j], P[i][j] = max(c, key=lambda z: z[0])
    j = max(range(m + 1), key=lambda jj: D[n][jj]); i = n
    times = [None] * n
    while i > 0:
        pi, pj, op = P[i][j]
        if op == "m": times[i-1] = asr[j-1][1]
        i, j = pi, pj
    # interpolate unmatched words
    known = [k for k, t in enumerate(times) if t is not None]
    for k in range(n):
        if times[k] is None:
            prev = max([q for q in known if q < k], default=None); nxt = min([q for q in known if q > k], default=None)
            if prev is not None and nxt is not None:
                times[k] = times[prev] + (times[nxt] - times[prev]) * (k - prev) / (nxt - prev)
            elif prev is not None: times[k] = times[prev] + 0.22 * (k - prev)
            elif nxt is not None: times[k] = times[nxt] - 0.22 * (nxt - k)
            else: times[k] = a + 0.3 * k
    # enforce monotonic
    for k in range(1, n): times[k] = max(times[k], times[k-1] + 0.04)
    out, k = [], 0
    for ln in lines:
        c = len(ln["text"].split()); out.append(times[k:k+c]); k += c
    return out

# resolve auto groups
groups = {}
for ln in L:
    if "win" in ln: groups.setdefault(ln["win"], []).append(ln)
for win, lines in groups.items():
    for ln, ts in zip(lines, align(lines, win)):
        ln["times"] = ts
        miss = sum(1 for _ in ts)
res = []
for k, ln in enumerate(L):
    words = ln["text"].split(); ts = [round(t, 3) for t in ln["times"]]
    assert len(words) == len(ts), (ln["text"], ts)
    nxt = L[k+1]["times"][0] if k + 1 < len(L) else 353
    end = ln.get("end") or min(ts[-1] + 0.9, nxt - 0.05)
    end = min(end, nxt - 0.02) if nxt > ts[-1] else end
    res.append(dict(id=k, text=ln["text"], kind=ln["kind"], start=ts[0], end=round(max(end, ts[-1] + 0.25), 3),
                    words=[dict(w=w, t=t) for w, t in zip(words, ts)]))
out = ROOT.parent / "src" / "data" / "lyrics.json"
json.dump(res, open(out, "w"), indent=1, ensure_ascii=False)
for r in res:
    print(f"{r['id']:3d} {r['start']:7.2f}-{r['end']:7.2f} {r['kind']:7s} {r['text']}   " + ' '.join(f"{w['t']:.2f}" for w in r['words']))
