#!/usr/bin/env bash
# Lays recorded narration over the music bed for one film and re-muxes.
# Usage: bash remux.sh 02_FREE_READING
# Expects audio/<prefix>_1.mp3 .. _5.mp3 where prefix maps below, and the
# silent cut tmp/<name>_silent.mp4 produced by build_all.sh.
set -e
cd "$(dirname "$0")"
NAME=$1
[ -z "$NAME" ] && { echo "usage: bash remux.sh <02_FREE_READING|03_SIXTEEN_CHARTS|04_UPAYA_MOON|05_FOUNDER>"; exit 1; }

# per-film VO prefix + start times (seconds), matching VO_SCRIPTS.md
case "$NAME" in
  02_FREE_READING)    P=v2; T=(0.7 4.3 7.5 11.0 14.6);;
  03_SIXTEEN_CHARTS)  P=v3; T=(0.7 4.3 8.0 18.0 25.0);;
  04_UPAYA_MOON)      P=v4; T=(0.7 4.5 9.0 13.5 18.0);;
  05_FOUNDER)         P=v5; T=(0.7 4.5 9.5 16.5 24.0);;
  06_MOON_NAKSHATRA)  P=v6; T=(0.7 4.3 8.3 15.9);;
  07_MAHADASHA)       P=v7; T=(0.7 4.3 12.0 16.2);;
  08_UPAYA_SUN)       P=v8; T=(0.7 4.3 8.7 13.3 17.5);;
  09_SADE_SATI)       P=v9; T=(0.7 4.3 12.1 16.5);;
  10_MANGAL_DOSHA)    P=v10; T=(0.7 4.3 8.7 16.7);;
  *) echo "unknown film: $NAME"; exit 1;;
esac

# VERT=1 muxes the 9:16 vertical cut (out/<NAME>_V.mp4) instead of the horizontal one.
if [ "$VERT" = "1" ]; then
  SILENT="tmp/${NAME}_V_silent.mp4"; MUSIC="tmp/music_${NAME}_V.wav"; SUFFIX="_V"
else
  SILENT="tmp/${NAME}_silent.mp4"; MUSIC="tmp/music_${NAME}.wav"; SUFFIX=""
fi
[ -f "$SILENT" ] || { echo "missing $SILENT — run build_all.sh / build_vertical.sh first"; exit 1; }

# collect VO inputs that actually exist. ffmpeg input 0 = music; VO files follow.
inputs=(); filters=(); labels=""
i=1; idx=1   # idx = ffmpeg input index for the next VO file (music is 0)
for t in "${T[@]}"; do
  f="audio/${P}_${i}.mp3"
  if [ -f "$f" ]; then
    inputs+=(-i "$f")
    ms=$(awk -v s="$t" 'BEGIN{printf "%d", s*1000}')
    filters+=("[$idx]adelay=${ms}|${ms},volume=1.9[a$i];")
    labels="$labels[a$i]"
    idx=$((idx+1))
  else
    echo "note: $f not recorded yet — skipping"
  fi
  i=$((i+1))
done

[ -z "$labels" ] && { echo "no VO files found in audio/ for $P — nothing to mux"; exit 1; }
nvox=$(echo "$labels" | grep -o '\[a' | wc -l)

ffmpeg -y -loglevel error -i "$MUSIC" "${inputs[@]}" \
  -filter_complex "$(printf '%s' "${filters[@]}")${labels}amix=inputs=${nvox}:normalize=0[vox];[0]volume=1[bed];[bed][vox]amix=inputs=2:normalize=0,alimiter=limit=0.95,aresample=48000[out]" \
  -map "[out]" -ac 2 -ar 48000 "tmp/mix_${NAME}.wav"

ffmpeg -y -loglevel error -i "$SILENT" -i "tmp/mix_${NAME}.wav" \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest "out/${NAME}${SUFFIX}.mp4"
echo "=> out/${NAME}${SUFFIX}.mp4  (narration + music)"
ffprobe -v error -show_entries format=duration -of csv=p=0 "out/${NAME}${SUFFIX}.mp4"
