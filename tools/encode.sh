#!/usr/bin/env bash
# Upload-ready encodes from the Remotion master (TikTok / IG Reels: 1080x1920, H.264 High, AAC).
#   full MV  : out/jazz-samurai-mv-full.mp4  (~9 Mbps)
#   reel cut : out/jazz-samurai-reel.mp4     (from the full master, 75.53s → 124.6s, ~13 Mbps)
set -euo pipefail
cd "$(dirname "$0")/.."
M=out/master-full.mp4
X="-c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart -g 60"

ffmpeg -y -v error -i "$M" $X -b:v 9M -maxrate 14M -bufsize 20M -pass 1 -passlogfile out/x264full -an -f mp4 /dev/null
ffmpeg -y -v error -i "$M" $X -b:v 9M -maxrate 14M -bufsize 20M -pass 2 -passlogfile out/x264full -c:a aac -b:a 256k out/jazz-samurai-mv-full.mp4

SS=$(python3 -c "print(2266/30)"); DUR=$(python3 -c "print(124.6-2266/30)")
FO=$(python3 -c "print(124.6-2266/30-0.6)")
VF="fade=t=out:st=$FO:d=0.6"; AF="afade=t=out:st=$FO:d=0.6"
ffmpeg -y -v error -ss "$SS" -t "$DUR" -i "$M" -vf "$VF" $X -b:v 13M -maxrate 18M -bufsize 26M -pass 1 -passlogfile out/x264reel -an -f mp4 /dev/null
ffmpeg -y -v error -ss "$SS" -t "$DUR" -i "$M" -vf "$VF" -af "$AF" $X -b:v 13M -maxrate 18M -bufsize 26M -pass 2 -passlogfile out/x264reel -c:a aac -b:a 256k out/jazz-samurai-reel.mp4
rm -f out/x264*.log*
ls -lh out/jazz-samurai-*.mp4
