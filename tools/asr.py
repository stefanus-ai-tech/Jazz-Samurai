import sys, json, numpy as np, soundfile as sf, librosa, sherpa_onnx as so
wav, out = sys.argv[1], sys.argv[2]
M = "/tmp/claude-0/models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8"
rec = so.OfflineRecognizer.from_transducer(encoder=f"{M}/encoder.int8.onnx", decoder=f"{M}/decoder.int8.onnx",
        joiner=f"{M}/joiner.int8.onnx", tokens=f"{M}/tokens.txt", num_threads=4, model_type="nemo_transducer")
y, sr = librosa.load(wav, sr=16000, mono=True)
y = y / (np.abs(y).max() + 1e-9) * 0.9
win, hop = float(sys.argv[3]), float(sys.argv[4])
t0 = float(sys.argv[5])
res = []

while t0 < len(y) / sr:
    seg = y[int(t0*sr): int((t0+win)*sr)]
    s = rec.create_stream(); s.accept_waveform(sr, seg); rec.decode_stream(s)
    r = s.result
    toks = [(t, float(ts) + t0) for t, ts in zip(r.tokens, r.timestamps)]
    res.append({"t0": t0, "text": r.text, "tokens": toks})
    print(f"{t0:7.1f} {r.text}", flush=True)
    t0 += hop
json.dump(res, open(out, "w"), indent=0)
