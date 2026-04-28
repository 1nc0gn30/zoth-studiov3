#!/usr/bin/env python3
import argparse,json,collections
from pathlib import Path
def main():
 ap=argparse.ArgumentParser(); ap.add_argument('events_jsonl'); a=ap.parse_args(); c=collections.Counter()
 for line in Path(a.events_jsonl).read_text().splitlines():
  if not line.strip(): continue
  e=json.loads(line); c[(e.get('event','unknown'),e.get('pack_id','unknown'),e.get('status','unknown'))]+=1
 for (event,pack,status),n in sorted(c.items()): print(f'{n}\t{event}\t{pack}\t{status}')
if __name__=='__main__': main()
