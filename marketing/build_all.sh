#!/usr/bin/env bash
# Builds marketing films 2-5 as music-only cuts (narration to be recorded by
# Animesh and muxed in later via remux.sh). Reuses video-1 clips where possible.
set -e
cd "$(dirname "$0")"
FPS=30
BG=0x0d0a06
mkdir -p clips tmp out

# textclip: name dur fadeout_start
textclip () {
  local n=$1 d=$2 fo=$3
  ffmpeg -y -loglevel error -loop 1 -framerate $FPS -i "scenes/$n.png" -t $d \
    -vf "scale=1920:1080,fade=t=in:st=0:d=0.6,fade=t=out:st=$fo:d=0.6,format=yuv420p" \
    -r $FPS -c:v libx264 -pix_fmt yuv420p "clips/$n.mp4"
  echo "  clip: $n (${d}s)"
}

# prodclip: shot dur frames fadeout_start  (slow Ken-Burns push on a real screenshot)
prodclip () {
  local n=$1 d=$2 frames=$3 fo=$4
  ffmpeg -y -loglevel error -i "shots/$n.png" \
    -vf "scale=1580:-1,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=$BG" "tmp/stage_$n.png"
  ffmpeg -y -loglevel error -loop 1 -framerate $FPS -i "tmp/stage_$n.png" -t $d \
    -vf "scale=3840:2160,zoompan=z='min(zoom+0.00035,1.09)':d=$frames:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=$FPS,fade=t=in:st=0:d=0.6,fade=t=out:st=$fo:d=0.6,format=yuv420p" \
    -r $FPS -c:v libx264 -pix_fmt yuv420p "clips/p_$n.mp4"
  echo "  clip: p_$n (${d}s)"
}

# assemble: OUTNAME  "clip1 clip2 ..."
assemble () {
  local out=$1; shift
  local root=$(pwd -W 2>/dev/null || pwd)
  : > tmp/list_$out.txt
  local total=0
  for c in "$@"; do
    printf "file '%s/clips/%s.mp4'\n" "$root" "$c" >> tmp/list_$out.txt
    local d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 clips/$c.mp4)
    total=$(awk -v a="$total" -v b="$d" 'BEGIN{printf "%.3f", a+b}')
  done
  ffmpeg -y -loglevel error -f concat -safe 0 -i tmp/list_$out.txt -c copy tmp/${out}_silent.mp4
  # warm ambient drone sized to the cut
  local dur=$(printf "%.2f" "$total")
  local faded=$(awk -v d="$dur" 'BEGIN{printf "%.2f", d-4.0}')
  ffmpeg -y -loglevel error \
    -f lavfi -i "sine=frequency=110:duration=$dur" \
    -f lavfi -i "sine=frequency=164.81:duration=$dur" \
    -f lavfi -i "sine=frequency=220:duration=$dur" \
    -f lavfi -i "sine=frequency=329.63:duration=$dur" \
    -filter_complex "[0][1][2][3]amix=inputs=4:normalize=1,tremolo=f=0.12:d=0.5,aecho=0.8:0.88:900|1600:0.35|0.22,lowpass=f=820,highpass=f=70,volume=0.16,afade=t=in:st=0:d=3.5,afade=t=out:st=$faded:d=4.0" \
    -ac 2 -ar 48000 tmp/music_$out.wav
  ffmpeg -y -loglevel error -i tmp/${out}_silent.mp4 -i tmp/music_$out.wav \
    -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest "out/${out}.mp4"
  echo "=> out/${out}.mp4  (${dur}s)  [music only, add VO with remux.sh]"
}

echo "[1/5] text clips"
# VIDEO 2 DEMO
textclip d0     4.0 3.4
textclip d_free 4.0 3.4
textclip d_url  3.6 3.0
# VIDEO 3 SIXTEEN
textclip c0     3.6 3.0
textclip c1     3.6 3.0
textclip c2     3.6 3.0
textclip c_depth 4.4 3.8
# VIDEO 4 REMEDY
textclip r0 4.0 3.4
textclip r1 4.0 3.4
textclip r2 4.6 4.0
textclip r3 4.4 3.8
textclip r4 4.4 3.8
# VIDEO 5 FOUNDER
textclip f0 4.0 3.4
textclip f1 4.4 3.8
textclip f2 4.0 3.4
textclip f3 4.0 3.4
textclip f4 4.4 3.8
# VIDEO 6 MOON NAKSHATRA
textclip n0 4.0 3.4
textclip n1 4.0 3.4
textclip n2 4.4 3.8
textclip n3 4.0 3.4
# VIDEO 7 MAHADASHA
textclip m0 4.0 3.4
textclip m1 4.4 3.8
textclip m2 4.2 3.6
textclip m3 4.0 3.4
# VIDEO 8 WEAK SUN
textclip su0 4.0 3.4
textclip su1 4.4 3.8
textclip su2 4.6 4.0
textclip su3 4.2 3.6
textclip su4 3.6 3.0
# VIDEO 9 SADE SATI
textclip ss0 4.0 3.4
textclip ss1 4.4 3.8
textclip ss2 4.4 3.8
textclip ss3 4.0 3.4
# VIDEO 10 MANGAL DOSHA
textclip md0 4.0 3.4
textclip md1 4.4 3.8
textclip md2 4.4 3.8
textclip md3 4.0 3.4

echo "[2/5] new product clips (houses, today)"
prodclip houses 3.2 96 2.6
prodclip today 3.2 96 2.6

echo "[3/5] VIDEO 2 — the Rs.2000 reading, free"
assemble 02_FREE_READING  d0 p_chart p_dashas p_analysis d_free d_url cta

echo "[4/5] VIDEO 3 — sixteen charts"
assemble 03_SIXTEEN_CHARTS  c0 c1 p_chart p_houses p_analysis c2 c_depth brand cta

echo "[5/5] VIDEO 4 — upaya of the day (weak Moon)  &  VIDEO 5 — founder"
assemble 04_UPAYA_MOON  r0 r1 r2 r3 r4 cta
assemble 05_FOUNDER  f0 f1 f2 p_dashboard f3 p_analysis f4 cta

echo "[6/10] VIDEO 6 — Moon nakshatra"
assemble 06_MOON_NAKSHATRA  n0 n1 n2 p_chart n3 cta
echo "[7/10] VIDEO 7 — mahadasha chapters"
assemble 07_MAHADASHA  m0 m1 p_dashas m2 m3 cta
echo "[8/10] VIDEO 8 — weak Sun remedy"
assemble 08_UPAYA_SUN  su0 su1 su2 su3 su4 cta
echo "[9/10] VIDEO 9 — Sade Sati, no fear"
assemble 09_SADE_SATI  ss0 ss1 p_today ss2 ss3 cta
echo "[10/10] VIDEO 10 — Mangal Dosha truth"
assemble 10_MANGAL_DOSHA  md0 md1 md2 p_analysis md3 cta

echo "=== ALL DONE ==="
for f in out/*.mp4; do printf "%-28s " "$f"; ffprobe -v error -show_entries format=duration -of csv=p=0 "$f"; done
