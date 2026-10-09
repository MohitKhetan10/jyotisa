#!/usr/bin/env bash
# Builds 9:16 vertical (1080x1920) cuts for TikTok / Reels / Shorts.
# Cards come from scenes_v/ (ORIENT=v node text_cards*.mjs). Screenshots: tall
# _full pages scroll-pan; short pages sit centered on the brand background.
# Music-only; narration folded in later with remux.sh (VERT=1 bash remux.sh ...).
set -e
cd "$(dirname "$0")"
FPS=30
BG=0x0d0a06
mkdir -p clips_v tmp out

# textclip: name dur fadeout_start
textclip () {
  local n=$1 d=$2 fo=$3
  ffmpeg -y -loglevel error -loop 1 -framerate $FPS -i "scenes_v/$n.png" -t $d \
    -vf "scale=1080:1920,fade=t=in:st=0:d=0.6,fade=t=out:st=$fo:d=0.6,format=yuv420p" \
    -r $FPS -c:v libx264 -pix_fmt yuv420p "clips_v/$n.mp4"
  echo "  vclip: $n (${d}s)"
}

# vscroll: shot dur fadeout_start  -- tall _full page scaled to a readable width,
# then a 1080x1920 window pans down (text stays legible).
vscroll () {
  local n=$1 d=$2 fo=$3
  ffmpeg -y -loglevel error -i "shots/${n}_full.png" -vf "scale=1600:-1" "tmp/vfull_$n.png"
  local H=$(ffprobe -v error -select_streams v -show_entries stream=height -of csv=p=0 "tmp/vfull_$n.png")
  local xoff=260                       # (1600-1080)/2, centre horizontally
  local pan=$(( H - 1920 )); [ "$pan" -lt 1 ] && pan=1
  ffmpeg -y -loglevel error -loop 1 -framerate $FPS -i "tmp/vfull_$n.png" -t $d \
    -vf "crop=1080:1920:${xoff}:'min($pan, $pan*t/$d)',fade=t=in:st=0:d=0.6,fade=t=out:st=$fo:d=0.6,format=yuv420p" \
    -r $FPS -c:v libx264 -pix_fmt yuv420p "clips_v/p_$n.mp4"
  echo "  vscroll: p_$n (${d}s)"
}

# vcover: shot dur fadeout_start  -- wide page scaled to fill height, then a slow
# horizontal reveal-pan across it (full-bleed, text stays large/legible).
vcover () {
  local n=$1 d=$2 fo=$3
  ffmpeg -y -loglevel error -i "shots/$n.png" -vf "scale=-1:1920" "tmp/vcov_$n.png"
  local W=$(ffprobe -v error -select_streams v -show_entries stream=width -of csv=p=0 "tmp/vcov_$n.png")
  local panx=$(( W - 1080 )); [ "$panx" -lt 1 ] && panx=1
  ffmpeg -y -loglevel error -loop 1 -framerate $FPS -i "tmp/vcov_$n.png" -t $d \
    -vf "crop=1080:1920:'min($panx, $panx*t/$d)':0,fade=t=in:st=0:d=0.6,fade=t=out:st=$fo:d=0.6,format=yuv420p" \
    -r $FPS -c:v libx264 -pix_fmt yuv420p "clips_v/p_$n.mp4"
  echo "  vcover: p_$n (${d}s)"
}

# assemble: OUTNAME "clip1 clip2 ..."  (reads from clips_v/)
assemble () {
  local out=$1; shift
  local root=$(pwd -W 2>/dev/null || pwd)
  : > tmp/vlist_$out.txt
  local total=0
  for c in "$@"; do
    printf "file '%s/clips_v/%s.mp4'\n" "$root" "$c" >> tmp/vlist_$out.txt
    local dd=$(ffprobe -v error -show_entries format=duration -of csv=p=0 clips_v/$c.mp4)
    total=$(awk -v a="$total" -v b="$dd" 'BEGIN{printf "%.3f", a+b}')
  done
  ffmpeg -y -loglevel error -f concat -safe 0 -i tmp/vlist_$out.txt -c copy tmp/${out}_V_silent.mp4
  local dur=$(printf "%.2f" "$total")
  local faded=$(awk -v d="$dur" 'BEGIN{printf "%.2f", d-4.0}')
  ffmpeg -y -loglevel error \
    -f lavfi -i "sine=frequency=110:duration=$dur" \
    -f lavfi -i "sine=frequency=164.81:duration=$dur" \
    -f lavfi -i "sine=frequency=220:duration=$dur" \
    -f lavfi -i "sine=frequency=329.63:duration=$dur" \
    -filter_complex "[0][1][2][3]amix=inputs=4:normalize=1,tremolo=f=0.12:d=0.5,aecho=0.8:0.88:900|1600:0.35|0.22,lowpass=f=820,highpass=f=70,volume=0.16,afade=t=in:st=0:d=3.5,afade=t=out:st=$faded:d=4.0" \
    -ac 2 -ar 48000 tmp/music_${out}_V.wav
  ffmpeg -y -loglevel error -i tmp/${out}_V_silent.mp4 -i tmp/music_${out}_V.wav \
    -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest "out/${out}_V.mp4"
  echo "=> out/${out}_V.mp4  (${dur}s)  [vertical, music only]"
}

echo "[1/3] vertical text clips"
# video 1
for c in q0 q1 q2 q3 q4 q5 bridge brand cta; do : ; done
textclip q0 4.0 3.4; textclip q1 2.2 1.6; textclip q2 2.2 1.6; textclip q3 2.2 1.6
textclip q4 2.6 2.0; textclip q5 2.2 1.6; textclip bridge 4.0 3.4
textclip brand 5.2 4.6; textclip cta 4.6 4.0
# videos 2-10 cards
textclip d0 4.0 3.4; textclip d_free 4.0 3.4; textclip d_url 3.6 3.0
textclip c0 3.6 3.0; textclip c1 3.6 3.0; textclip c2 3.6 3.0; textclip c_depth 4.4 3.8
textclip r0 4.0 3.4; textclip r1 4.0 3.4; textclip r2 4.6 4.0; textclip r3 4.4 3.8; textclip r4 4.4 3.8
textclip f0 4.0 3.4; textclip f1 4.4 3.8; textclip f2 4.0 3.4; textclip f3 4.0 3.4; textclip f4 4.4 3.8
textclip n0 4.0 3.4; textclip n1 4.0 3.4; textclip n2 4.4 3.8; textclip n3 4.0 3.4
textclip m0 4.0 3.4; textclip m1 4.4 3.8; textclip m2 4.2 3.6; textclip m3 4.0 3.4
textclip su0 4.0 3.4; textclip su1 4.4 3.8; textclip su2 4.6 4.0; textclip su3 4.2 3.6; textclip su4 3.6 3.0
textclip ss0 4.0 3.4; textclip ss1 4.4 3.8; textclip ss2 4.4 3.8; textclip ss3 4.0 3.4
textclip md0 4.0 3.4; textclip md1 4.4 3.8; textclip md2 4.4 3.8; textclip md3 4.0 3.4

echo "[2/3] vertical product clips"
vscroll analysis 3.4 2.8
vscroll houses   3.2 2.6
vcover chart     3.0 2.4
vcover dashas    3.4 2.8
vcover dashboard 3.2 2.6
vcover today     3.2 2.6

echo "[3/3] assemble vertical films"
assemble 01_THE_QUESTION  q0 q1 q2 q3 q4 q5 bridge p_dashboard p_analysis p_chart p_dashas brand cta
assemble 02_FREE_READING  d0 p_chart p_dashas p_analysis d_free d_url cta
assemble 03_SIXTEEN_CHARTS  c0 c1 p_chart p_houses p_analysis c2 c_depth brand cta
assemble 04_UPAYA_MOON  r0 r1 r2 r3 r4 cta
assemble 05_FOUNDER  f0 f1 f2 p_dashboard f3 p_analysis f4 cta
assemble 06_MOON_NAKSHATRA  n0 n1 n2 p_chart n3 cta
assemble 07_MAHADASHA  m0 m1 p_dashas m2 m3 cta
assemble 08_UPAYA_SUN  su0 su1 su2 su3 su4 cta
assemble 09_SADE_SATI  ss0 ss1 p_today ss2 ss3 cta
assemble 10_MANGAL_DOSHA  md0 md1 md2 p_analysis md3 cta

echo "=== VERTICAL DONE ==="
for f in out/*_V.mp4; do printf "%-32s " "$f"; ffprobe -v error -show_entries format=duration -of csv=p=0 "$f"; done
