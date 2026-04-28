#!/usr/bin/env python3
import argparse,json,sys
from pathlib import Path
REQ_TRUST=['publisher','permissions']; REQ=['id','version','summary','trust']
def main():
 ap=argparse.ArgumentParser(); ap.add_argument('manifest'); a=ap.parse_args(); d=json.loads(Path(a.manifest).read_text())
 missing=[k for k in REQ if k not in d]; trust=d.get('trust',{}); missing += [f'trust.{k}' for k in REQ_TRUST if k not in trust]
 if not d.get('checksum_sha256') and not trust.get('signature_url'): missing.append('checksum_sha256 or trust.signature_url')
 for m in missing: print('MISSING '+m)
 print(f'governance_findings={len(missing)}')
 return 1 if missing else 0
if __name__=='__main__': raise SystemExit(main())
