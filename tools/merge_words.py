import json, sys
def words_of(path):
    d = json.load(open(path)); out = []
    for w in d:
        t0 = w['t0']; win = 16 if 'asr_uvr_a' in path or path == 'asr_spl.json' else 10
        cur = None
        for tok, t in w['tokens']:
            if tok.startswith(' ') or cur is None:
                if cur: out.append(cur)
                cur = [tok.strip(), t, min(t - t0, t0 + win - t)]
            else:
                cur[0] += tok
        if cur: out.append(cur)
    return out
allw = []
for p in sys.argv[2:]:
    allw += words_of(p)
allw.sort(key=lambda x: x[1])
# greedy: keep word if no more-central candidate within 0.35s with similar text
import difflib, re
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
keep = []
for w in allw:
    clash = [k for k in keep if abs(k[1] - w[1]) < 0.35 and difflib.SequenceMatcher(None, norm(k[0]), norm(w[0])).ratio() > 0.5]
    if clash:
        k = clash[0]
        if w[2] > k[2]: keep[keep.index(k)] = w
    else:
        keep.append(w)
keep.sort(key=lambda x: x[1])
# drop words whose centrality < 0.6 if there's any other word within 0.2 (window edge junk)
keep = [k for k in keep if k[2] > 0.25]
json.dump([[k[0], round(k[1], 3)] for k in keep], open(sys.argv[1], 'w'))
line=[]; last=-10
for wd,t,c in keep:
    if t-last>1.0 and line: print(' '.join(line)); line=[]
    if not line: line.append(f"[{t:6.2f}]")
    line.append(f"{wd}"); last=t
print(' '.join(line))
