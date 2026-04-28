#!/usr/bin/env python3
import argparse,json
from pathlib import Path
def main():
 ap=argparse.ArgumentParser(); ap.add_argument('registry'); ap.add_argument('--out',required=True); a=ap.parse_args(); r=json.loads(Path(a.registry).read_text())
 items=[]
 for p in r.get('packs',[]):
  items.append({'id':p.get('id'),'name':p.get('name'),'summary':p.get('summary'),'tags':p.get('tags',[]),'compatibility':p.get('compatibility',[]),'version':p.get('version'),'manifest_url':p.get('manifest_url'),'text':' '.join([str(p.get('name','')),str(p.get('summary','')),' '.join(p.get('tags',[]))]).lower()})
 Path(a.out).write_text(json.dumps({'items':items},indent=2)+'\n'); print(f'wrote {len(items)} items')
if __name__=='__main__': main()
