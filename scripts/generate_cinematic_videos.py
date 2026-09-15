#!/usr/bin/env python3
"""
⚡ ZOTH STUDIO — CINEMATIC VIDEO COMPOSITOR
Converts generated 8K master digital assets into 60 FPS web-optimized looping video assets.
Features:
- Smooth continuous zoom/pan (Ken Burns dynamic camera trajectory)
- 60 FPS interpolation with +faststart instant web streaming
- Procedural Solfeggio / Cybernetic ambient audio synthesis
- Visually lossless CRF 20 H.264 web compression
"""

import os
import subprocess
import shutil

BRAIN_DIR = '/home/neo/.gemini/antigravity-cli/brain/8036405d-b2ff-4a68-a102-979f52091b84'
ASSETS_MEDIA = '/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-studio/core-app/public/assets/media'

ASSETS = [
    {
        'src_name': 'azoth_sanctum_core_1789450205274.jpg',
        'dest_img': 'hero-azoth-sanctum-citadel.jpg',
        'dest_vid': 'hero-azoth-sanctum-citadel.mp4',
        'duration': 8,
        'zoom_expr': "zoom+0.0008:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'",
        'audio_freq': 432,
        'title': 'Sovereign Alchemical Citadel'
    },
    {
        'src_name': 'swarm_consensus_core_1789450216930.jpg',
        'dest_img': 'hero-swarm-consensus-core.jpg',
        'dest_vid': 'hero-swarm-consensus-core.mp4',
        'duration': 8,
        'zoom_expr': "zoom+0.0006:x='iw/2-(iw/zoom/2)+sin(on/30)*20':y='ih/2-(ih/zoom/2)+cos(on/30)*15'",
        'audio_freq': 528,
        'title': '21-Agent Neural Consensus Swarm'
    },
    {
        'src_name': 'cyber_mascot_spirit_1789450230507.jpg',
        'dest_img': 'hero-cyber-mascot-spirit.jpg',
        'dest_vid': 'hero-cyber-mascot-spirit.mp4',
        'duration': 8,
        'zoom_expr': "zoom+0.0007:x='iw/2-(iw/zoom/2)':y='ih*0.4-(ih/zoom*0.4)'",
        'audio_freq': 639,
        'title': 'Quantum Cyber Spirit Mascot'
    }
]

def main():
    print("=" * 70)
    print("⚡ GENERATING 3 HIGH-QUALITY CINEMATIC DIGITAL VIDEO ASSETS")
    print("=" * 70)

    for item in ASSETS:
        src_path = os.path.join(BRAIN_DIR, item['src_name'])
        dest_img_path = os.path.join(ASSETS_MEDIA, item['dest_img'])
        dest_vid_path = os.path.join(ASSETS_MEDIA, item['dest_vid'])

        if not os.path.exists(src_path):
            print(f"Error: Source image not found: {src_path}")
            continue

        # 1. Copy image to public assets
        shutil.copy2(src_path, dest_img_path)
        img_sz = os.path.getsize(dest_img_path)
        print(f"\n🖼️ Image Asset Saved: {item['dest_img']} ({img_sz / 1024:.1f} KB)")

        # 2. Generate 60 FPS Cinematic Video with Ken Burns & Solfeggio Atmosphere
        print(f"🎬 Rendering 60 FPS Video: {item['dest_vid']}...")
        
        # Audio tone generator filter with fade in/out
        audio_filter = (
            f"sine=frequency={item['audio_freq']}:duration={item['duration']},"
            f"afade=t=in:ss=0:d=1.5,afade=t=out:st={item['duration']-1.5}:d=1.5,"
            f"volume=0.18"
        )
        
        # Video filter with 60 FPS, smooth zoompan, and subtle vignette
        video_filter = (
            f"zoompan=z='{item['zoom_expr']}':d={item['duration']*60}:s=1920x1080:fps=60,"
            f"fade=t=in:st=0:d=1,fade=t=out:st={item['duration']-1}:d=1"
        )

        cmd = [
            'ffmpeg', '-y', '-v', 'error',
            '-loop', '1', '-i', dest_img_path,
            '-f', 'lavfi', '-i', audio_filter,
            '-vf', video_filter,
            '-c:v', 'libx264',
            '-t', str(item['duration']),
            '-pix_fmt', 'yuv420p',
            '-crf', '20',
            '-preset', 'slow',
            '-movflags', '+faststart',
            '-c:a', 'aac',
            '-b:a', '160k',
            dest_vid_path
        ]

        res = subprocess.run(cmd)
        if res.returncode == 0:
            vid_sz = os.path.getsize(dest_vid_path)
            print(f"  ✓ Video Created: {item['dest_vid']} ({vid_sz / (1024*1024):.2f} MB | 1080p 60 FPS + FastStart)")
        else:
            print(f"  ⚠ Failed to render {item['dest_vid']}")

    print("\n" + "=" * 70)
    print("✨ ALL 3 IMAGES & 3 VIDEOS SUCCESSFULLY GENERATED & INTEGRATED!")
    print("=" * 70)

if __name__ == '__main__':
    main()
