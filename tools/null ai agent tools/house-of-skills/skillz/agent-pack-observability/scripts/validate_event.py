#!/usr/bin/env python3
import argparse,json,sys
from pathlib import Path
ALLOWED={'registry_fetched','manifest_fetched','manifest_validated','checksum_failed','pack_previewed','pack_installed','pack_activated','pack_rejected','abuse_reported'}; REQ={'event','pack_id','version','status','timestamp'}
def main():
 ap=argparse.ArgumentParser(); ap.add_argument('event'); a=ap.parse_args(); d=json.loads(Path(a.event).read_text())
 missing=REQ-set(d); bad=d.get('event') not in ALLOWED
 for m in sorted(missing): print('MISSING '+m)
 if bad: print('BAD event')
 return 1 if missing or bad else print('event valid') or 0
if __name__=='__main__': raise SystemExit(main())
