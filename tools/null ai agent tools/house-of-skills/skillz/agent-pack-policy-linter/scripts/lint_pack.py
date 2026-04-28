#!/usr/bin/env python3
import argparse,pathlib,re,json
RULES=[('critical',re.compile(r'ignore .*instructions|do not tell the user|hide this',re.I),'unsafe instruction authority'),('critical',re.compile(r'steal|exfiltrat|upload.*secret|GITHUB_TOKEN|OPENAI_API_KEY',re.I),'secret risk'),('high',re.compile(r'rm -rf|curl .*\|.*bash|wget .*\|.*sh',re.I),'unsafe shell pattern'),('medium',re.compile(r'http://',re.I),'non-https url')]
def main():
 ap=argparse.ArgumentParser(); ap.add_argument('dir'); a=ap.parse_args(); root=pathlib.Path(a.dir); findings=[]
 for p in root.rglob('*'):
  if p.is_file() and p.suffix.lower() in {'.md','.json','.txt','.yml','.yaml','.py','.sh','.js','.ts'}:
   t=p.read_text(errors='ignore')
   for sev,rx,msg in RULES:
    if rx.search(t): findings.append((sev,p,msg))
 mf=root/'manifest.json'
 if mf.exists():
  d=json.loads(mf.read_text()); tr=d.get('trust',{})
  if not tr.get('publisher'): findings.append(('medium',mf,'missing trust.publisher'))
 for sev,p,msg in findings: print(f'{sev.upper()} {p}: {msg}')
 print(f'findings={len(findings)}')
 return 1 if any(sev in {'critical','high'} for sev,_,__ in findings) else 0
if __name__=='__main__': raise SystemExit(main())
