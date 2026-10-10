#!/usr/bin/env bash
# Upload-ready encodes from the Remotion master (TikTok / IG Reels: 1080x1920, H.264 High, AAC).
#   full MV  : out/jazz-samurai-mv-full.mp4  (CRF 19, capped ~12 Mbps)
#   reel cut : out/jazz-samurai-reel.mp4     (from the full master, 75.53s → 124.6s)
set -euo pipefail
cd "$(dirname "$0")/.."
M=out/master-full.mp4
X="-c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart -g 60 -crf 19"
ffmpeg -y -v error -i "$M" $X -maxrate 12M -bufsize 24M -c:a aac -b:a 256k out/jazz-samurai-mv-full.mp4
SS=$(python3 -c "print(2266/30)"); DUR=$(python3 -c "print(124.6-2266/30)"); FO=$(python3 -c "print(124.6-2266/30-0.6)")
ffmpeg -y -v error -ss "$SS" -t "$DUR" -i "$M" -vf "fade=t=out:st=$FO:d=0.6" -af "afade=t=out:st=$FO:d=0.6" $X -maxrate 16M -bufsize 32M -c:a aac -b:a 256k out/jazz-samurai-reel.mp4
ls -lh out/jazz-samurai-*.mp4
