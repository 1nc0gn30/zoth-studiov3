#!/usr/bin/env python3
"""
mp3 -> pixel/glitch/datamosh-ish video (same duration as audio)

Deps:
  pip install numpy soundfile opencv-python
System:
  ffmpeg must be installed and on PATH.

Usage:
  python mp3_mosh_video.py input.mp3 -o out.mp4
  python mp3_mosh_video.py input.mp3 -o out.mp4 --w 1920 --h 1080 --fps 30 --seed 1337
"""

import argparse
import math
import os
import random
import subprocess
import tempfile

import cv2
import numpy as np
import soundfile as sf


def run(cmd: list[str]) -> None:
    p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if p.returncode != 0:
        raise RuntimeError(
            "Command failed:\n"
            + " ".join(cmd)
            + "\n\nSTDOUT:\n"
            + p.stdout
            + "\n\nSTDERR:\n"
            + p.stderr
        )


def ffprobe_duration_seconds(path: str) -> float:
    # Most reliable for MP3 duration vs reading decoded samples.
    cmd = [
        "ffprobe",
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        path,
    ]
    p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if p.returncode == 0:
        try:
            return float(p.stdout.strip())
        except Exception:
            pass
    return -1.0


def decode_audio_to_wav(mp3_path: str, wav_path: str, sr: int) -> None:
    # Force consistent SR + channel handling.
    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            mp3_path,
            "-vn",
            "-ac",
            "1",
            "-ar",
            str(sr),
            "-f",
            "wav",
            wav_path,
        ]
    )


def soft_clip01(x: np.ndarray) -> np.ndarray:
    # Smooth clamp to [0,1]
    return 0.5 * (np.tanh((x - 0.5) * 2.6) + 1.0)


def make_palette(n: int = 256) -> np.ndarray:
    # Neon-ish palette (HSV -> RGB)
    h = np.linspace(0, 1, n, endpoint=False)
    s = np.ones_like(h) * 0.95
    v = np.ones_like(h) * 0.95

    hsv = np.stack([h, s, v], axis=-1).astype(np.float32)
    rgb = cv2.cvtColor((hsv[None, :, :] * 255).astype(np.uint8), cv2.COLOR_HSV2BGR)[0]
    # BGR -> RGB
    rgb = rgb[:, ::-1].astype(np.uint8)
    return rgb


def block_shift(img: np.ndarray, rng: random.Random, strength: float) -> np.ndarray:
    h, w, _ = img.shape
    out = img.copy()

    blocks = int(6 + strength * 22)
    for _ in range(blocks):
        bh = rng.randint(max(8, h // 40), max(12, h // 8))
        bw = rng.randint(max(16, w // 40), max(24, w // 6))
        y = rng.randint(0, max(0, h - bh))
        x = rng.randint(0, max(0, w - bw))
        dx = rng.randint(-int(w * 0.08 * strength) - 1, int(w * 0.08 * strength) + 1)
        dy = rng.randint(-int(h * 0.04 * strength) - 1, int(h * 0.04 * strength) + 1)

        src = out[y : y + bh, x : x + bw]
        yy = int(np.clip(y + dy, 0, h - bh))
        xx = int(np.clip(x + dx, 0, w - bw))
        out[yy : yy + bh, xx : xx + bw] = src

    return out


def channel_offset(img: np.ndarray, rng: random.Random, px: int) -> np.ndarray:
    if px <= 0:
        return img
    h, w, _ = img.shape
    out = img.copy()
    for c in range(3):
        dx = rng.randint(-px, px)
        dy = rng.randint(-px // 2, px // 2)
        out[:, :, c] = np.roll(out[:, :, c], shift=(dy, dx), axis=(0, 1))
    return out


def scanline_tears(img: np.ndarray, rng: random.Random, strength: float) -> np.ndarray:
    h, w, _ = img.shape
    out = img.copy()
    n = int(4 + strength * 18)
    for _ in range(n):
        y = rng.randint(0, h - 1)
        band = rng.randint(1, max(2, int(h * 0.02)))
        dx = rng.randint(-int(w * 0.12 * strength) - 1, int(w * 0.12 * strength) + 1)
        y2 = min(h, y + band)
        out[y:y2] = np.roll(out[y:y2], dx, axis=1)
    return out


def datamosh_smear(prev: np.ndarray, cur: np.ndarray, rng: random.Random, strength: float) -> np.ndarray:
    """
    "Datamosh-ish" smear:
      - motion-like displacement of prev frame
      - selective refresh so old blocks persist
      - blend factor driven by strength
    """
    h, w, _ = cur.shape
    out = cur.copy()

    # Displace prev slightly and blend in
    dx = rng.randint(-int(w * 0.03 * strength) - 1, int(w * 0.03 * strength) + 1)
    dy = rng.randint(-int(h * 0.02 * strength) - 1, int(h * 0.02 * strength) + 1)
    shifted_prev = np.roll(prev, shift=(dy, dx), axis=(0, 1))

    alpha = 0.25 + 0.55 * strength
    out = cv2.addWeighted(out, 1.0 - alpha, shifted_prev, alpha, 0)

    # Persist blocks from previous (like P-frame corruption / missing I-frames)
    blocks = int(8 + strength * 40)
    for _ in range(blocks):
        bh = rng.randint(max(10, h // 50), max(20, h // 6))
        bw = rng.randint(max(16, w // 50), max(32, w // 4))
        y = rng.randint(0, max(0, h - bh))
        x = rng.randint(0, max(0, w - bw))
        if rng.random() < (0.35 + 0.45 * strength):
            out[y : y + bh, x : x + bw] = shifted_prev[y : y + bh, x : x + bw]

    return out


def frame_from_audio(
    segment: np.ndarray,
    sr: int,
    t: float,
    base_grid: tuple[int, int],
    palette: np.ndarray,
    rng: random.Random,
) -> tuple[np.ndarray, float]:
    """
    Returns (low_res_rgb_frame, energy_01)
    """
    # Window + FFT
    seg = segment.astype(np.float32)
    if len(seg) == 0:
        seg = np.zeros(2048, dtype=np.float32)
    if len(seg) < 2048:
        seg = np.pad(seg, (0, 2048 - len(seg)))
    seg = seg[:4096] if len(seg) >= 4096 else np.pad(seg, (0, 4096 - len(seg)))

    win = np.hanning(len(seg)).astype(np.float32)
    segw = seg * win

    fft = np.fft.rfft(segw)
    mag = np.abs(fft).astype(np.float32) + 1e-9
    mag = np.log1p(mag)

    # Energy
    rms = float(np.sqrt(np.mean(segw * segw)) + 1e-12)
    energy = min(1.0, rms * 18.0)

    gh, gw = base_grid
    # Build a 2D field using audio spectrum + time
    # Sample spectrum into gw buckets
    bins = np.interp(
        np.linspace(0, len(mag) - 1, gw).astype(np.float32),
        np.arange(len(mag), dtype=np.float32),
        mag,
    )
    bins = (bins - bins.min()) / (bins.max() - bins.min() + 1e-9)

    # Create vertical modulation using sin + bins
    y = np.linspace(0, 1, gh, dtype=np.float32)[:, None]
    x = np.linspace(0, 1, gw, dtype=np.float32)[None, :]

    # Phase shifts that feel "moshy"
    phase = (t * (0.6 + 2.8 * energy)) + (bins[None, :] * (1.5 + 4.0 * energy))
    field = (
        0.55 * np.sin(2 * np.pi * (x * (1.0 + 1.5 * energy) + phase)) +
        0.45 * np.cos(2 * np.pi * (y * (1.0 + 2.2 * energy) - phase))
    )
    field = (field - field.min()) / (field.max() - field.min() + 1e-9)
    field = soft_clip01(field)

    # Map to palette indexes (add some random jitter)
    jitter = (rng.random() - 0.5) * 0.06 * (0.2 + energy)
    idx = np.clip(((field + jitter) * (len(palette) - 1)).astype(np.int32), 0, len(palette) - 1)
    rgb = palette[idx]

    # Add a second layer to get more pixel grit
    noise = (rng.random() - 0.5) * 0.18 * (0.25 + energy)
    idx2 = np.clip(((field * (0.7 + 0.6 * energy) + noise) * (len(palette) - 1)).astype(np.int32), 0, len(palette) - 1)
    rgb2 = palette[idx2]

    mix = 0.55 + 0.35 * energy
    out = (rgb.astype(np.float32) * mix + rgb2.astype(np.float32) * (1.0 - mix)).astype(np.uint8)

    return out, energy


def upscale_nearest(img: np.ndarray, w: int, h: int) -> np.ndarray:
    return cv2.resize(img, (w, h), interpolation=cv2.INTER_NEAREST)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("mp3", help="Input mp3 path")
    ap.add_argument("-o", "--out", default="out.mp4", help="Output mp4 path")
    ap.add_argument("--w", type=int, default=1280, help="Width")
    ap.add_argument("--h", type=int, default=720, help="Height")
    ap.add_argument("--fps", type=int, default=30, help="Frames per second")
    ap.add_argument("--sr", type=int, default=44100, help="Decode sample rate")
    ap.add_argument("--grid", type=int, default=160, help="Base pixel grid size (higher = finer pixels)")
    ap.add_argument("--seed", type=int, default=0, help="RNG seed (0 = random)")
    args = ap.parse_args()

    if not os.path.isfile(args.mp3):
        raise FileNotFoundError(args.mp3)

    if args.seed == 0:
        args.seed = random.randint(1, 2**31 - 1)
    rng = random.Random(args.seed)

    # Duration (prefer ffprobe)
    dur = ffprobe_duration_seconds(args.mp3)
    if dur <= 0:
        # fallback: approximate later from decoded samples
        dur = None

    palette = make_palette(256)

    # Decode to temp wav so soundfile can read cleanly
    with tempfile.TemporaryDirectory() as td:
        wav_path = os.path.join(td, "audio.wav")
        decode_audio_to_wav(args.mp3, wav_path, args.sr)

        audio, sr = sf.read(wav_path, dtype="float32", always_2d=False)
        if audio.ndim != 1:
            audio = audio.mean(axis=1).astype(np.float32)
        if dur is None:
            dur = len(audio) / float(sr)

        fps = float(args.fps)
        # Ensure video >= audio duration so final mux can trim to audio with -t
        total_frames = int(math.ceil(dur * fps)) + 2

        # Pixel grid: keep aspect ratio while staying in "grid" budget
        # grid = approximate width in low-res pixels
        gw = max(64, args.grid)
        gh = max(36, int(gw * (args.h / args.w)))

        # Temp silent video
        silent_mp4 = os.path.join(td, "silent.mp4")

        fourcc = cv2.VideoWriter_fourcc(*"mp4v")  # widely available; final encode done by ffmpeg
        vw = cv2.VideoWriter(silent_mp4, fourcc, fps, (args.w, args.h))
        if not vw.isOpened():
            raise RuntimeError("OpenCV VideoWriter failed to open. Try installing a fuller OpenCV build.")

        # Frame sizing for audio segments
        samples_per_frame = int(sr / fps)

        prev = None
        for i in range(total_frames):
            t = i / fps
            s0 = i * samples_per_frame
            s1 = s0 + samples_per_frame
            seg = audio[s0:s1]

            low, energy = frame_from_audio(seg, sr, t, (gh, gw), palette, rng)
            frame = upscale_nearest(low, args.w, args.h)

            # Glitch intensity driven by energy but with random spikes
            spike = 1.0 if rng.random() < (0.04 + 0.10 * energy) else 0.0
            strength = float(np.clip(0.15 + 0.85 * (0.55 * energy + 0.45 * spike), 0.0, 1.0))

            # Channel offsets + tears
            frame = channel_offset(frame, rng, px=int(1 + strength * 10))
            frame = scanline_tears(frame, rng, strength=strength)
            if rng.random() < (0.35 + 0.45 * strength):
                frame = block_shift(frame, rng, strength=strength)

            # Datamosh-ish smear with previous frame
            if prev is not None and rng.random() < (0.45 + 0.40 * strength):
                frame = datamosh_smear(prev, frame, rng, strength=strength)

            prev = frame

            # OpenCV expects BGR
            vw.write(frame[:, :, ::-1])

        vw.release()

        # Final mux + encode (trim to exact audio duration)
        # -t ensures output duration == audio duration (as closely as container allows)
        run(
            [
                "ffmpeg",
                "-y",
                "-i",
                silent_mp4,
                "-i",
                args.mp3,
                "-t",
                f"{dur:.6f}",
                "-c:v",
                "libx264",
                "-preset",
                "medium",
                "-crf",
                "18",
                "-pix_fmt",
                "yuv420p",
                "-c:a",
                "aac",
                "-b:a",
                "192k",
                "-movflags",
                "+faststart",
                args.out,
            ]
        )

    print(f"Done.\n  out: {args.out}\n  duration: {dur:.3f}s\n  seed: {args.seed}")


if __name__ == "__main__":
    main()

