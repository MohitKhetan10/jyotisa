#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
FPS=30
BG=0x0d0a06
mkdir -p clips tmp

# textclip: name dur fadeout_start
textclip () {
  local n=$1 d=$2 fo=$3
  ffmpeg -y -loglevel error -loop 1 -framerate $FPS -i "scenes/$n.png" -t $d \
    -vf "scale=1920:1080,fade=t=in:st=0:d=0.6,fade=t=out:st=$fo:d=0.6,format=yuv420p" \
    -r $FPS -c:v libx264 -pix_fmt yuv420p "clips/$n.mp4"
  echo "clip: $n (${d}s)"
}

# prodclip: shot dur frames fadeout_start
prodclip () {
  local n=$1 d=$2 frames=$3 fo=$4
  ffmpeg -y -loglevel error -i "shots/$n.png" \
    -vf "scale=1580:-1,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=$BG" "tmp/stage_$n.png"
  ffmpeg -y -loglevel error -loop 1 -framerate $FPS -i "tmp/stage_$n.png" -t $d \
    -vf "scale=3840:2160,zoompan=z='min(zoom+0.00035,1.09)':d=$frames:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=$FPS,fade=t=in:st=0:d=0.6,fade=t=out:st=$fo:d=0.6,format=yuv420p" \
    -r $FPS -c:v libx264 -pix_fmt yuv420p "clips/p_$n.mp4"
  echo "clip: p_$n (${d}s)"
}

# ---------------- TIMELINE ----------------
textclip q0 4.0 3.4
textclip q1 2.2 1.6
textclip q2 2.2 1.6
textclip q3 2.2 1.6
textclip q4 2.6 2.0
textclip q5 2.2 1.6
textclip bridge 4.0 3.4
prodclip dashboard 3.2 96 2.6
prodclip analysis 3.4 102 2.8
prodclip chart 3.0 90 2.4
prodclip dashas 3.4 102 2.8
textclip brand 5.2 4.6
textclip cta 4.6 4.0

# ---------------- CONCAT VIDEO ----------------
cat > tmp/list.txt <<EOF
file 'clips/q0.mp4'
file 'clips/q1.mp4'
file 'clips/q2.mp4'
file 'clips/q3.mp4'
file 'clips/q4.mp4'
file 'clips/q5.mp4'
file 'clips/bridge.mp4'
file 'clips/p_dashboard.mp4'
file 'clips/p_analysis.mp4'
file 'clips/p_chart.mp4'
file 'clips/p_dashas.mp4'
file 'clips/brand.mp4'
file 'clips/cta.mp4'
EOF
ffmpeg -y -loglevel error -f concat -safe 0 -i tmp/list.txt -c copy tmp/video.mp4
echo "video concatenated"

# ---------------- MUSIC BED (warm ambient pad) ----------------
ffmpeg -y -loglevel error \
  -f lavfi -i "sine=frequency=110:duration=42.5" \
  -f lavfi -i "sine=frequency=164.81:duration=42.5" \
  -f lavfi -i "sine=frequency=220:duration=42.5" \
  -f lavfi -i "sine=frequency=329.63:duration=42.5" \
  -filter_complex "[0][1][2][3]amix=inputs=4:normalize=1,tremolo=f=0.12:d=0.5,aecho=0.8:0.88:900|1600:0.35|0.22,lowpass=f=820,highpass=f=70,volume=0.16,afade=t=in:st=0:d=3.5,afade=t=out:st=38:d=4.5" \
  -ac 2 -ar 48000 audio/music.wav
echo "music bed built"

# ---------------- MIX NARRATION + MUSIC ----------------
ffmpeg -y -loglevel error \
  -i audio/music.wav \
  -i audio/vo1.mp3 -i audio/vo2.mp3 -i audio/vo3.mp3 -i audio/vo4.mp3 -i audio/vo5.mp3 \
  -filter_complex "[1]adelay=700|700,volume=1.9[a1];[2]adelay=4400|4400,volume=1.9[a2];[3]adelay=15700|15700,volume=1.9[a3];[4]adelay=29300|29300,volume=1.9[a4];[5]adelay=34300|34300,volume=1.9[a5];[a1][a2][a3][a4][a5]amix=inputs=5:normalize=0[vox];[0]volume=1[bed];[bed][vox]amix=inputs=2:normalize=0,alimiter=limit=0.95,aresample=48000[out]" \
  -map "[out]" -ac 2 -ar 48000 audio/mix.wav
echo "audio mixed"

# ---------------- MUX ----------------
ffmpeg -y -loglevel error -i tmp/video.mp4 -i audio/mix.wav \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -shortest "THE_QUESTION.mp4"
echo "=== DONE ==="
ffprobe -v error -show_entries format=duration -of csv=p=0 THE_QUESTION.mp4
