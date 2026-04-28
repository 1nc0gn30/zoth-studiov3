#!/usr/bin/env python3
import argparse
import json
from collections import defaultdict
from pathlib import Path

from PIL import Image


def dhash64(image: Image.Image) -> int:
    gray = image.convert("L").resize((9, 8), Image.Resampling.BILINEAR)
    pixels = list(gray.getdata())
    bits = 0
    idx = 0
    for y in range(8):
        row = pixels[y * 9 : (y + 1) * 9]
        for x in range(8):
            bits <<= 1
            bits |= 1 if row[x] > row[x + 1] else 0
            idx += 1
    return bits


def hamming(a: int, b: int) -> int:
    return (a ^ b).bit_count()


def collect_pngs(roots):
    files = []
    for root in roots:
        r = Path(root)
        if not r.exists():
            continue
        files.extend(sorted(p for p in r.rglob("*.png") if p.is_file()))
    return files


def main():
    parser = argparse.ArgumentParser(description="Find duplicate and near-duplicate pixel icons.")
    parser.add_argument("--roots", nargs="+", required=True, help="Root directories to scan for PNG files.")
    parser.add_argument(
        "--out-report",
        default="/home/neo/pixelz/output/pixel_dedupe_report.json",
        help="Path to write dedupe report JSON.",
    )
    parser.add_argument(
        "--near-threshold",
        type=int,
        default=4,
        help="Max Hamming distance for near-duplicate grouping.",
    )
    args = parser.parse_args()

    files = collect_pngs(args.roots)
    exact_groups = defaultdict(list)
    near_buckets = defaultdict(list)
    records = []

    for p in files:
        try:
            with Image.open(p) as img:
                sig = dhash64(img)
        except Exception:
            continue
        exact_groups[sig].append(str(p))

        bucket = sig >> 52
        near = None
        for prev_sig, prev_path in near_buckets[bucket]:
            if hamming(sig, prev_sig) <= args.near_threshold:
                near = prev_path
                break
        near_buckets[bucket].append((sig, str(p)))

        records.append({"path": str(p), "hash": f"{sig:016x}", "near_to": near})

    exact_duplicate_sets = [paths for paths in exact_groups.values() if len(paths) > 1]
    near_pairs = [{"path": r["path"], "near_to": r["near_to"]} for r in records if r["near_to"]]

    deduped_exact_count = sum(len(g) - 1 for g in exact_duplicate_sets)
    unique_exact = len(files) - deduped_exact_count
    report = {
        "scanned_png": len(files),
        "unique_exact": unique_exact,
        "exact_duplicate_files": deduped_exact_count,
        "exact_duplicate_groups": exact_duplicate_sets,
        "near_duplicate_pairs": near_pairs,
        "near_threshold": args.near_threshold,
    }

    out = Path(args.out_report)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"scanned_png={len(files)}")
    print(f"unique_exact={unique_exact}")
    print(f"exact_duplicate_files={deduped_exact_count}")
    print(f"near_duplicate_pairs={len(near_pairs)}")
    print(f"report={out}")


if __name__ == "__main__":
    main()
