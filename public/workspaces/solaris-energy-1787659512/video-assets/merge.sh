#!/bin/bash
set -e
cd /home/neo/assets/100-websites-in-30-days/video-assets
mkdir -p merge
ffmpeg -y -hide_banner -loglevel error -i chunks/chunk_000.mp4 -i chunks/chunk_010.mp4 -filter_complex "[0][1]xfade=transition=fade:duration=0.6:offset=16.000" -c:v libx264 -pix_fmt yuv420p -r 30 -crf 23 merge/step_000.mp4
ffmpeg -y -hide_banner -loglevel error -i merge/step_000.mp4 -i chunks/chunk_020.mp4 -filter_complex "[0][1]xfade=transition=fade:duration=0.6:offset=32.000" -c:v libx264 -pix_fmt yuv420p -r 30 -crf 23 merge/step_001.mp4
ffmpeg -y -hide_banner -loglevel error -i merge/step_001.mp4 -i chunks/chunk_030.mp4 -filter_complex "[0][1]xfade=transition=fade:duration=0.6:offset=48.000" -c:v libx264 -pix_fmt yuv420p -r 30 -crf 23 merge/step_002.mp4
ffmpeg -y -hide_banner -loglevel error -i merge/step_002.mp4 -i chunks/chunk_040.mp4 -filter_complex "[0][1]xfade=transition=fade:duration=0.6:offset=64.000" -c:v libx264 -pix_fmt yuv420p -r 30 -crf 23 merge/step_003.mp4
ffmpeg -y -hide_banner -loglevel error -i merge/step_003.mp4 -i chunks/chunk_050.mp4 -filter_complex "[0][1]xfade=transition=fade:duration=0.6:offset=80.000" -c:v libx264 -pix_fmt yuv420p -r 30 -crf 23 merge/step_004.mp4
ffmpeg -y -hide_banner -loglevel error -i merge/step_004.mp4 -i chunks/chunk_060.mp4 -filter_complex "[0][1]xfade=transition=fade:duration=0.6:offset=96.000" -c:v libx264 -pix_fmt yuv420p -r 30 -crf 23 merge/step_005.mp4
ffmpeg -y -hide_banner -loglevel error -i merge/step_005.mp4 -i chunks/chunk_070.mp4 -filter_complex "[0][1]xfade=transition=fade:duration=0.6:offset=112.000" -c:v libx264 -pix_fmt yuv420p -r 30 -crf 23 merge/step_006.mp4
ffmpeg -y -hide_banner -loglevel error -i merge/step_006.mp4 -i chunks/chunk_080.mp4 -filter_complex "[0][1]xfade=transition=fade:duration=0.6:offset=128.000" -c:v libx264 -pix_fmt yuv420p -r 30 -crf 23 merge/step_007.mp4
ffmpeg -y -hide_banner -loglevel error -i merge/step_007.mp4 -i chunks/chunk_090.mp4 -filter_complex "[0][1]xfade=transition=fade:duration=0.6:offset=144.000" -c:v libx264 -pix_fmt yuv420p -r 30 -crf 23 merge/step_008.mp4
cp merge/step_008.mp4 season1-day-by-day.mp4
echo FINAL: season1-day-by-day.mp4
