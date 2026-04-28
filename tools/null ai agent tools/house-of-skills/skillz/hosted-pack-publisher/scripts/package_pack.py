#!/usr/bin/env python3
import argparse, hashlib, pathlib, shutil, zipfile

SKIP_DIRS = {".git", "node_modules", "dist", "build", ".codex"}

def sha256(path):
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def copytree(src, dst):
    if dst.exists():
        raise SystemExit(f"release directory already exists: {dst}")
    def ignore(dirpath, names):
        return [n for n in names if n in SKIP_DIRS]
    shutil.copytree(src, dst, ignore=ignore)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("pack_dir")
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    src = pathlib.Path(args.pack_dir)
    dst = pathlib.Path(args.out)
    copytree(src, dst)
    files = [p for p in sorted(dst.rglob("*")) if p.is_file() and p.name not in {"checksums.txt", "pack.zip"}]
    checksums = []
    for p in files:
        checksums.append(f"{sha256(p)}  {p.relative_to(dst)}")
    (dst / "checksums.txt").write_text("\n".join(checksums) + "\n")
    zip_path = dst / "pack.zip"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        for p in files + [dst / "checksums.txt"]:
            z.write(p, p.relative_to(dst))
    print(f"published staging release at {dst}")

if __name__ == "__main__":
    main()
