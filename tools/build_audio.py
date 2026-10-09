"""Build src/data/audio.json: per-frame (30 fps) audio features + beat grid for audio-reactive visuals.

Needs the UVR stems from tools/separate.py (vocals = uvr_0.wav, band = uvr_1.wav) in WORK.
"""
import json, os, numpy as np, librosa, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
WORK = pathlib.Path(os.environ.get("WORK", "/tmp/claude-0/work"))
FPS, SR = 30, 22050
hop = SR / FPS
y, _ = librosa.load(ROOT / "Jazz Samurai.mp3", sr=SR, mono=True)
voc, _ = librosa.load(WORK / "uvr_0.wav", sr=SR, mono=True)
band, _ = librosa.load(WORK / "uvr_1.wav", sr=SR, mono=True)
n = int(np.ceil(len(y) / hop))

def frames(sig, fn):
    out = np.zeros(n)
    for i in range(n):
        a = int(i * hop); seg = sig[a: a + 2048]
        if len(seg): out[i] = fn(seg)
    return out

def bandenv(sig, lo, hi, nfft=2048):
    S = np.abs(librosa.stft(sig, n_fft=nfft, hop_length=735, center=True))
    f = librosa.fft_frequencies(sr=SR, n_fft=nfft)
    e = S[(f >= lo) & (f < hi)].mean(0)
    return np.interp(np.arange(n), np.arange(len(e)), e)

def norm(a, pct=99):
    return np.clip(a / (np.percentile(a, pct) + 1e-9), 0, 1)

bass = norm(bandenv(band, 30, 160))
hat = norm(bandenv(band, 5000, 11000))
mid = norm(bandenv(band, 300, 3000))
rms = norm(bandenv(y, 30, 11000))
vocal = norm(bandenv(voc, 150, 5000))
on = librosa.onset.onset_strength(y=y, sr=SR, hop_length=735)
onset = norm(np.interp(np.arange(n), np.arange(len(on)), on), 99.5)
bon = librosa.onset.onset_strength(S=librosa.amplitude_to_db(np.abs(librosa.stft(band, n_fft=4096, hop_length=735))[:40]), sr=SR)
bassOnsets = librosa.onset.onset_detect(onset_envelope=bon, sr=SR, hop_length=735, units="time", delta=0.3)
hon = librosa.onset.onset_detect(y=band, sr=SR, hop_length=735, units="time", delta=0.2)

# beat grid: tracker locks to 8th notes (~0.325 s); keep quarters (~0.65 s, ~92 BPM) via kick energy parity
_, beats = librosa.beat.beat_track(y=y, sr=SR, units="time", tightness=120)
def at(arr, t): return arr[min(n - 1, int(t * FPS))]
par = max((0, 1), key=lambda p: np.mean([at(bass, t) for t in beats[p::2]]))
quarters = beats[par::2]
bar_phase = max(range(4), key=lambda p: np.mean([at(bass, t) for t in quarters[p::4]]))
downbeats = quarters[bar_phase::4]

q = lambda a: [int(round(x * 99)) for x in a]
out = dict(fps=FPS, frames=n, duration=len(y) / SR,
           bass=q(bass), hat=q(hat), mid=q(mid), rms=q(rms), vocal=q(vocal), onset=q(onset),
           beats=[round(float(t), 3) for t in quarters], downbeats=[round(float(t), 3) for t in downbeats],
           bassOnsets=[round(float(t), 3) for t in bassOnsets], hits=[round(float(t), 3) for t in hon])
json.dump(out, open(ROOT / "src" / "data" / "audio.json", "w"), separators=(",", ":"))
print("frames", n, "quarters", len(quarters), "bpm", 60 / np.median(np.diff(quarters)), "downbeats", downbeats[:6], "bassOnsets", len(bassOnsets), "hits", len(hon))
