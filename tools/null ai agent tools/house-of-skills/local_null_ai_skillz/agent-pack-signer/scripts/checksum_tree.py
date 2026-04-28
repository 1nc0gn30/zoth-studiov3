#!/usr/bin/env python3
import argparse, hashlib, pathlib
SKIP={".git","node_modules","dist","build",".codex"}
def digest(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for c in iter(lambda:f.read(1048576),b''): h.update(c)
 return h.hexdigest()
def main():
 ap=argparse.ArgumentParser(); ap.add_argument('dir'); ap.add_argument('--out',required=True); a=ap.parse_args()
 root=pathlib.Path(a.dir); rows=[]
 for p in sorted(root.rglob('*')):
  if not p.is_file() or any(part in SKIP for part in p.parts): continue
  if p.name==pathlib.Path(a.out).name: continue
  rows.append(f"{digest(p)}  {p.relative_to(root)}")
 pathlib.Path(a.out).write_text('\n'.join(rows)+'\n')
 print(f"wrote {a.out} with {len(rows)} entries")
if __name__=='__main__': main()
