#!/usr/bin/env python3
import subprocess
import sys
import os

if len(sys.argv) < 3:
    print("Usage: python app2.py input.mp3 output.mp4")
    sys.exit(1)

mp3 = sys.argv[1]
out = sys.argv[2]

if not os.path.exists(mp3):
    print("MP3 not found")
    sys.exit(1)

cmd = [
    "ffmpeg",
    "-y",
    "-i", mp3,

    "-filter_complex",
    (
        "[0:a]"
        "showspectrum=s=1280x720:mode=combined:color=rainbow:slide=scroll,"
        "format=rgba,"
        "noise=alls=20:allf=t+u,"
        "lagfun=decay=0.92"
        "[v]"
    ),

    "-map", "[v]",
    "-map", "0:a",

    "-c:v", "libx264",
    "-preset", "veryfast",
    "-crf", "23",
    "-pix_fmt", "yuv420p",

    "-c:a", "aac",
    "-b:a", "192k",

    "-shortest",
    out
]

subprocess.run(cmd)

print("DONE:", out)

