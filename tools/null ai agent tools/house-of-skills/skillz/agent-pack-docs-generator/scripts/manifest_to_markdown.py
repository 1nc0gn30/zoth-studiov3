#!/usr/bin/env python3
import argparse,json
from pathlib import Path
def table(items): return '\n'.join(f"- `{x}`" for x in items) if items else '- None declared'
def main():
 ap=argparse.ArgumentParser(); ap.add_argument('manifest'); ap.add_argument('--out',required=True); a=ap.parse_args(); d=json.loads(Path(a.manifest).read_text())
 trust=d.get('trust',{})
 md=f"""# {d.get('name', d.get('id','Agent Pack'))}\n\n{d.get('summary','No summary provided.')}\n\n## Version\n\n`{d.get('version','unknown')}`\n\n## Compatibility\n\n{table(d.get('compatibility', []))}\n\n## Parameters\n\n```json\n{json.dumps(d.get('parameters',{}), indent=2)}\n```\n\n## Permissions\n\n{table(trust.get('permissions', []))}\n\n## Resources\n\n{table([r.get('url', str(r)) if isinstance(r,dict) else str(r) for r in d.get('resources', [])])}\n"""
 Path(a.out).write_text(md); print(f'wrote {a.out}')
if __name__=='__main__': main()
