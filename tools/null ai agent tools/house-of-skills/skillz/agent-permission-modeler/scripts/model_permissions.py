#!/usr/bin/env python3
import argparse,json,sys
from pathlib import Path
CRITICAL={'deploy-production','read-secrets','payment-action'}; HIGH={'shell-write','external-write'}
def main():
 ap=argparse.ArgumentParser(); ap.add_argument('manifest'); a=ap.parse_args(); d=json.loads(Path(a.manifest).read_text())
 trust=d.get('trust',{}); perms=set(trust.get('permissions',[])); approvals=set(trust.get('requires_user_approval',[]))
 findings=[]
 for p in sorted(perms & (CRITICAL|HIGH)):
  if p not in approvals: findings.append(f"{p} should be listed in trust.requires_user_approval")
 if 'read-secrets' in perms and 'network-fetch' in perms: findings.append('read-secrets + network-fetch requires explicit exfiltration review')
 for f in findings: print('WARN '+f)
 print(f"permissions={len(perms)} findings={len(findings)}")
 return 1 if findings else 0
if __name__=='__main__': raise SystemExit(main())
