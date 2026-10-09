# Jazz Samurai

A vertical (9:16, 1080×1920) lyric music video for **Jazz Samurai**, made for TikTok and Instagram Reels.
It's ink black and vermilion red with cobalt blue as the contrast colour, in the spirit of *Samurai Champloo*.
The screen shows only the lyrics and the visuals: no chord charts and no section names.

Everything is code. All characters, props, patterns and textures are drawn procedurally with React/SVG in [Remotion](https://www.remotion.dev).
That includes the ronin, the katana, the vinyl, the torii tunnel, the great wave, the black hole, the koi and the boombox.
The lyrics are timed **word by word** to the actual vocals.

## Outputs

| Composition | What | Length |
|---|---|---|
| `JazzSamuraiMV` | Full music video (TikTok) | 5:53 |
| `JazzSamuraiReel` | Hook cut: "Get down" → pre-chorus → chorus → BOOM—CHA (Reels / TikTok) | 0:49 |

Lyrics stay inside the TikTok/Reels safe area, clear of the caption bar and side buttons.

## Run it

```bash
npm install
npm run dev            # Remotion Studio: scrub, tweak, preview with audio
npm run render         # full MV master  -> out/master-full.mp4
npm run render:reel    # reel master      -> out/master-reel.mp4
npm run encode         # upload-ready H.264 files from the full master -> out/jazz-samurai-*.mp4
```

`npm run dev` / `render` copy `Jazz Samurai.mp3` into `public/` automatically.
To use a local Chromium instead of Remotion's download, set `REMOTION_BROWSER=/path/to/chrome-headless-shell`.

## How it's put together

```
src/
  MV.tsx            composition: audio, scene stack, camera shake, lyrics, film finish
  timeline.ts       ← the edit: CUES (which scene when, which transition) + LYRIC_STYLES (per line)
  Lyrics.tsx        kinetic typography engine — ~30 word-synced styles (slam, neon, karaoke, spiral, tunnel, ticker…)
  Transitions.tsx   katana slash, ink bloom, iris, shoji doors, record scratch, film burn, paper tear…
  Finish.tsx        grain, dust & scratches, gate flicker, vignette
  scenes/           ~70 scenes, one idea per lyric line (Intro, Verse1, Chorus, Duel, Verse2, Bridge, Scat, Final)
  assets/           drawn assets: Samurai, Katana, Vinyl/Tomoe/Turntable, Japan (Fuji, wave, torii, koi…), Props, Fx
  data/lyrics.json  every line with per-word timestamps
  data/audio.json   per-frame bass / hats / mids / vocal energy, beat grid, bass onsets
public/fonts        self-hosted Google Fonts (OFL); Japanese fonts subset to the glyphs used
public/tex          generated textures: grain, washi paper, smoke, dry-brush strokes, ink splats, ensō
tools/              the pipeline that produced the timing data + preview/encode helpers
```

**Changing the edit:** to change a scene, its timing or its transition, edit `CUES` in `src/timeline.ts`.
To restyle a lyric line, change its entry in `LYRIC_STYLES` (keyed by the `id` in `src/data/lyrics.json`).

### Lyric timing pipeline (`tools/`)

1. `separate.py`: isolate the vocals with UVR-MDX (sherpa-onnx). Spleeter is the fallback.
2. `asr.py` + `merge_words.py`: run Parakeet-TDT speech recognition with word timestamps, using overlapping windows.
3. `build_lyrics.py`: align the written lyrics to the ASR words with dynamic programming. Scat, beatbox and shouts that ASR can't read are pinned by hand to vocal and bass onsets.
4. `build_audio.py`: compute per-frame audio features and the beat grid that drive the audio-reactive visuals.
5. `make_textures.py`: build the procedural textures.
6. `preview.mjs` + `sheet.py`: render stills at chosen song times and assemble contact sheets.

The Python tools need `sherpa-onnx librosa soundfile numpy scipy pillow`. The models are downloaded from the sherpa-onnx GitHub releases.
