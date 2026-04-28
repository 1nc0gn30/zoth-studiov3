#!/usr/bin/env python3
import argparse,re
from pathlib import Path
RULES=[('critical',r'steal|token|secret|credential|exfiltrat|malware|delete all'),('high',r'ignore.*instructions|hidden|shell|curl.*bash|unsafe'),('medium',r'checksum|misleading|vulnerab|broken'),('low',r'spam|typo|duplicate')]
def main():
 ap=argparse.ArgumentParser(); ap.add_argument('report'); a=ap.parse_args(); t=Path(a.report).read_text(errors='ignore')
 for sev,rx in RULES:
  if re.search(rx,t,re.I): print(sev); return 0
 print('needs-review')
if __name__=='__main__': main()
