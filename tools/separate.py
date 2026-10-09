import sys, time, numpy as np, soundfile as sf, librosa, sherpa_onnx as so
src, which, out = sys.argv[1], sys.argv[2], sys.argv[3]
M = "/tmp/claude-0/models"
y, sr = librosa.load(src, sr=44100, mono=False)
y = np.ascontiguousarray(y.astype(np.float32))
if which == "uvr":
    mc = so.OfflineSourceSeparationModelConfig(uvr=so.OfflineSourceSeparationUvrModelConfig(model=f"{M}/UVR-MDX-NET-Voc_FT.onnx"), num_threads=4)
else:
    mc = so.OfflineSourceSeparationModelConfig(spleeter=so.OfflineSourceSeparationSpleeterModelConfig(vocals=f"{M}/sherpa-onnx-spleeter-2stems-fp16/vocals.fp16.onnx", accompaniment=f"{M}/sherpa-onnx-spleeter-2stems-fp16/accompaniment.fp16.onnx"), num_threads=4)
sp = so.OfflineSourceSeparation(so.OfflineSourceSeparationConfig(model=mc))
t = time.time()
o = sp.process(sample_rate=sr, samples=y)
print("took", time.time() - t, "stems", len(o.stems), o.sample_rate)
for i, st in enumerate(o.stems):
    d = np.asarray(st.data)
    print(i, d.shape)
    sf.write(f"{out}_{i}.wav", d.T, o.sample_rate)
