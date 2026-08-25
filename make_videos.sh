#!/bin/bash
set -e
mkdir -p public/assets/generated/videos/
create_video() {
    img="public/assets/generated/$1"
    aud="public/assets/audio/music/$2"
    out="public/assets/generated/videos/$3"
    echo "Creating $out..."
    ffmpeg -y -loop 1 -i "$img" -i "$aud" -vf "scale=1920:1080,zoompan=z='min(zoom+0.0003,1.15)':d=250" -c:v libx264 -preset veryfast -crf 20 -tune stillimage -pix_fmt yuv420p -c:a aac -b:a 128k -t 10 -shortest "$out" < /dev/null
}

create_video "real_hero.jpg" "willow-kayne-white-city.mp3" "video_hero.mp4"
create_video "real_pipeline.jpg" "ivoxygen-skate.mp3" "video_pipeline.mp4"
create_video "real_studio.jpg" "willow-kayne-two-seater.mp3" "video_studio.mp4"
create_video "real_pets.jpg" "lucidbeatz-drift.mp3" "video_pets.mp4"
create_video "real_vault.jpg" "ivoxygen-ghost.mp3" "video_vault.mp4"
create_video "real_athena.jpg" "lucidbeatz-shadows.mp3" "video_athena.mp4"
echo "All videos created!"
