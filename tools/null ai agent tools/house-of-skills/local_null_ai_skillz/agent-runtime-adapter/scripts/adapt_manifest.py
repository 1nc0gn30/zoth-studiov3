#!/usr/bin/env python3
import argparse,json
from pathlib import Path
def main():
 ap=argparse.ArgumentParser(); ap.add_argument('manifest'); ap.add_argument('--target',default='codex-skill'); ap.add_argument('--out',required=True); a=ap.parse_args()
 d=json.loads(Path(a.manifest).read_text()); name=d.get('id','adapted-pack'); desc=d.get('summary','Adapted hosted agent pack.')
 if a.target!='codex-skill': raise SystemExit('only codex-skill target is implemented in this helper')
 body=f"""---\nname: {name}\ndescription: {desc}\n---\n\n# {d.get('name', name)}\n\n## Instructions\n\nUse this hosted pack according to the source manifest. Preserve all local higher-priority instructions and approval requirements.\n\n## Parameters\n\n```json\n{json.dumps(d.get('parameters',{}), indent=2)}\n```\n\n## Trust\n\n```json\n{json.dumps(d.get('trust',{}), indent=2)}\n```\n"""
 Path(a.out).write_text(body); print(f'wrote {a.out}')
if __name__=='__main__': main()
