#!/usr/bin/env python3
import argparse,json
from pathlib import Path
KEYS=['task_success','domain_quality','safety','validation_honesty','format_adherence']
def main():
 ap=argparse.ArgumentParser(); ap.add_argument('results'); a=ap.parse_args(); d=json.loads(Path(a.results).read_text()); rows=d.get('results',d if isinstance(d,list) else [])
 total=0; count=0
 for r in rows:
  s=sum(int(r.get(k,0)) for k in KEYS); total+=s; count+=len(KEYS); print(f"{r.get('id','task')}\t{s}/{len(KEYS)*3}")
 print(f'aggregate={total}/{count*3 if count else 0}')
if __name__=='__main__': main()
