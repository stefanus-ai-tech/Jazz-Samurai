# Jazz Samurai

A vertical (9:16, 1080×1920) lyric music video for **Jazz Samurai**, made for TikTok and Instagram Reels.
It's ink black and vermilion red with cobalt blue as the contrast colour, in the spirit of *Samurai Champloo*.
The screen shows only the lyrics and the visuals: no chord charts and no section names.

The visuals are the illustrated sprite sheets in `assets/1.png` … `assets/6.png`: ronin, katana, records, boomboxes, koi, waves, clocks, comic bubbles and sound-effect words.
They are cut into ~260 separate sprites (`public/sprites/`) and animated in [Remotion](https://www.remotion.dev): spun, stamped, slid, rained, orbited and pumped on the beat.
Backgrounds (rays, speed lines, halftone, seigaiha) and the film finish are drawn in code.
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
  parts/part1-4.ts  ← the edit: cues (which scene when, which transition) + lyric styles (per line)
  timeline.ts       joins the four parts into CUES + LYRIC_STYLES
  Lyrics.tsx        kinetic typography engine — ~30 word-synced styles (slam, neon, karaoke, spiral, tunnel, ticker…)
  Transitions.tsx   katana slash, ink bloom, iris, shoji doors, record scratch, film burn, paper tear…
  Finish.tsx        grain, dust & scratches, gate flicker, vignette
  scenes/           ~70 scenes, one idea per lyric line (Intro, Verse1, Chorus, Duel, Verse2, Bridge, Scat, Final)
  sprite/Sp.tsx     <Sp> places one sprite (anchor, size, spin, squash, glow); SpRain / SpDrift / SpOrbit / SpTwinkle, Glint
  assets/Fx.tsx     code-drawn backgrounds and fx: rays, speed lines, halftone, seigaiha, smoke, stars, ensō, kanji
  data/sprites.json sprite name → size (written by tools/cut_sprites.py)
  data/lyrics.json  every line with per-word timestamps
  data/audio.json   per-frame bass / hats / mids / vocal energy, beat grid, bass onsets
public/sprites      the sprites cut from assets/*.png (WebP, 2× upscaled)
public/fonts        self-hosted Google Fonts (OFL); Japanese fonts subset to the glyphs used
public/tex          generated textures: grain, washi paper, smoke, dry-brush strokes, ink splats, ensō
tools/              the pipeline that produced the timing data + preview/encode helpers
```

**Using a sprite:** `<Sp n="ronin_red_stand" x={540} y={1500} h={900} ay={1} />` puts the sprite's bottom centre at (540, 1500).
Names are typed, so the editor autocompletes them.

**Adding or re-cutting sprites:** add an entry `"name": [sheet, x0, y0, x1, y1]` to `tools/sprites.json` (pixel box on the sheet), then run `python3 tools/cut_sprites.py name`.
Each visible pixel is assigned to its nearest solid blob, and blobs that mostly sit outside the box are dropped, so a neighbour's scarf or tonearm poking into the box doesn't come along.
Use `"box"` for a plain crop, `"circle"` for round things in a row, and `{"drop": [[x, y]]}` to remove a specific overlapping piece.

**Changing the edit:** to change a scene, its timing or its transition, edit `cues` in `src/parts/part1.ts` … `part4.ts`.
To restyle a lyric line, change its entry in that part's `styles` (keyed by the `id` in `src/data/lyrics.json`).
`hide: true` drops a line from the lyric layer when the scene already shows it as word art (WAH!, BOOM-BOOM-CHA!, CHICKA-WAH).
The `bubble` style can draw an illustrated speech bubble behind the words with `sprite: "bubble_cloud"`.

### Lyric timing pipeline (`tools/`)

1. `separate.py`: isolate the vocals with UVR-MDX (sherpa-onnx). Spleeter is the fallback.
2. `asr.py` + `merge_words.py`: run Parakeet-TDT speech recognition with word timestamps, using overlapping windows.
3. `build_lyrics.py`: align the written lyrics to the ASR words with dynamic programming. Scat, beatbox and shouts that ASR can't read are pinned by hand to vocal and bass onsets.
4. `build_audio.py`: compute per-frame audio features and the beat grid that drive the audio-reactive visuals.
5. `make_textures.py`: build the procedural textures.
6. `cut_sprites.py`: cut the sprite sheets in `assets/` into `public/sprites/` (cut list: `sprites.json`).
7. `preview.mjs` + `sheet.py`: render stills at chosen song times and assemble contact sheets.

The Python tools need `sherpa-onnx librosa soundfile numpy scipy pillow` (`cut_sprites.py` only needs `numpy scipy pillow`). The models are downloaded from the sherpa-onnx GitHub releases.
