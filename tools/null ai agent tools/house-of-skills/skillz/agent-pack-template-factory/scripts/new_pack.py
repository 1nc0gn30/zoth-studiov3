#!/usr/bin/env python3
import argparse,json,pathlib

def main():
 ap=argparse.ArgumentParser(); ap.add_argument('--id',required=True); ap.add_argument('--name',required=True); ap.add_argument('--summary',default='Hosted agent pack.'); ap.add_argument('--role',default='focused specialist'); ap.add_argument('--version',default='1.0.0'); ap.add_argument('--out',required=True); a=ap.parse_args()
 out=pathlib.Path(a.out); out.mkdir(parents=True,exist_ok=True)
 manifest={'schema_version':'agent-pack/v1','id':a.id,'name':a.name,'version':a.version,'summary':a.summary,'compatibility':['generic-agent'],'parameters':{'type':'object','additionalProperties':False,'properties':{}},'instructions':[{'type':'markdown','path':'SKILL.md'}],'resources':[],'trust':{'publisher':'','license':'','permissions':[]}}
 (out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
 (out/'SKILL.md').write_text(f"# {a.name}\n\nAct as a {a.role}. Preserve local higher-priority instructions and approval requirements.\n")
 (out/'PACK.md').write_text(f"# {a.name}\n\n{a.summary}\n")
 print(f'created {out}')
if __name__=='__main__': main()
