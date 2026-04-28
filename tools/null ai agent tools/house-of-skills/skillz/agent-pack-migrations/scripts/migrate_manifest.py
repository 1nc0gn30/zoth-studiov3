#!/usr/bin/env python3
import argparse,json
from pathlib import Path
def main():
 ap=argparse.ArgumentParser(); ap.add_argument('manifest'); ap.add_argument('--to',default='agent-pack/v1'); ap.add_argument('--out',required=True); a=ap.parse_args(); d=json.loads(Path(a.manifest).read_text())
 d.setdefault('schema_version',a.to); d['schema_version']=a.to
 d.setdefault('resources',[]); d.setdefault('instructions',[]); d.setdefault('parameters',{'type':'object','additionalProperties':False,'properties':{}}); d.setdefault('trust',{'permissions':[]})
 Path(a.out).write_text(json.dumps(d,indent=2)+'\n'); print(f'wrote {a.out}')
if __name__=='__main__': main()
