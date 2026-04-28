#!/usr/bin/env python3
import argparse,hashlib,pathlib,shutil,json,datetime

def digest(p):
 h=hashlib.sha256(); h.update(pathlib.Path(p).read_bytes()); return h.hexdigest()
def main():
 ap=argparse.ArgumentParser(); ap.add_argument('file'); ap.add_argument('--cache',required=True); a=ap.parse_args(); src=pathlib.Path(a.file); d=digest(src); root=pathlib.Path(a.cache); out=root/'blobs'/'sha256'/d[:2]/d
 out.parent.mkdir(parents=True,exist_ok=True); shutil.copy2(src,out)
 meta={'file':str(src),'sha256':d,'cached_at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 print(json.dumps(meta,indent=2))
if __name__=='__main__': main()
