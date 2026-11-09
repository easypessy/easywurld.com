"""Structural / text-envelope tests for editable templates; NOT a phone/platform approval."""
from pathlib import Path
from collections import Counter
import json,xml.etree.ElementTree as ET,hashlib
R=Path(__file__).parent;manifest=json.loads((R/'manifest.json').read_text());NS={'s':'http://www.w3.org/2000/svg'}
assert len(manifest)==85
assert Counter(x['kind'] for x in manifest)=={'carousel':44,'story':12,'LinkedIn':12,'TikTok photo reflow':11,'LinkedIn document':5,'component sheet':1}
seen=set();fingerprints=[]
for item in manifest:
 p=R/item['path'];assert p.exists() and str(p) not in seen,p;seen.add(str(p));t=ET.parse(p).getroot();w,h=map(int,item['size'].split('x'));assert t.attrib['width']==str(w) and t.attrib['height']==str(h)
 assert (item['safe'][2]<=w and item['safe'][3]<=h)
 text=p.read_text();assert '#FBE7C5' in text or '#144D3C' in text
 assert 'font-family="Lora,Georgia,serif"' in text or item['kind']=='component sheet' or item['kind']=='story' and 'font-family="Lora,Georgia,serif"' in text
 assert t.find('.//s:g[@id="content-headline"]',NS) is not None or item['kind']=='component sheet'
 for group in t.findall('.//s:g',NS):
  ident=group.attrib.get('id','');essential=ident.startswith('content-') and ident not in {'content-footer','content-series','content-page'}
  if not essential or item['kind']=='component sheet':continue
  for sp in group.findall('.//s:tspan',NS):
   x=float(sp.attrib['x']);y=float(sp.attrib['y']);assert item['safe'][0]<=x<=item['safe'][2] and item['safe'][1]<=y<=item['safe'][3],(item['path'],ident,x,y,item['safe'])
   parent=group.find('.//s:text',NS);size=float(parent.attrib.get('font-size','22')) if parent is not None else 22
   # Deliberately approximate: render and phone checks still required after font substitution.
   assert x+len(sp.text or '')*size*.55<=item['safe'][2]+4,(item['path'],ident,'approximate right edge',sp.text)
 if item['kind']=='carousel':
  assert '1080x1350'==item['size'];assert 'content-page' in text
 if item['kind']=='story':assert '1080x1920'==item['size']
 if item['kind']=='TikTok photo reflow':
  assert item['size']=='1080x1920';assert 'PLATFORM REFLOW' in text
 fingerprints.append(hashlib.sha256(text.encode()).hexdigest())
assert len(set(fingerprints))==85
for n in range(1,12):
 folder=R/'TEMPLATE_LIBRARY/CAROUSELS'/next(x for x in sorted(p.name for p in (R/'TEMPLATE_LIBRARY/CAROUSELS').iterdir()) if x.startswith(f'{n:02d}_'))
 expected={'cover.svg','interior-a.svg','interior-b.svg','conclusion.svg','tiktok-photo-cover.svg'}
 assert {x.name for x in folder.iterdir()}==expected
 # Compare vector structure (not only sample wording) between the two internals.
 a=(folder/'interior-a.svg').read_text();b=(folder/'interior-b.svg').read_text()
 def shapes(xml):
  return [(el.tag.split('}')[-1],tuple(sorted(el.attrib.items()))) for el in ET.fromstring(xml).iter() if el.tag.split('}')[-1] in {'rect','path','circle'}]
 assert shapes(a)!=shapes(b),folder
 assert (R/f'TEST_PROOFS/{n:02d}-long-hook.svg').exists() and (R/f'TEST_PROOFS/{n:02d}-heavy-internal.svg').exists()
for p in (R/'TEST_PROOFS').glob('*.svg'):ET.parse(p)
assert len(list((R/'TEST_PROOFS').glob('*.svg')))==22
assert (R/'preview.html').exists() and (R/'preview.html').stat().st_size>10_000
# Relative luminance / WCAG contrast of core green on beige: design check only.
def lum(h):
 rgb=[int(h[i:i+2],16)/255 for i in (1,3,5)];a=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in rgb]
 return .2126*a[0]+.7152*a[1]+.0722*a[2]
ratio=(lum('#FBE7C5')+.05)/(lum('#144D3C')+.05)
assert ratio>=7,ratio
print(f'PASS: {len(manifest)} unique editable SVGs, 11×4 carousel layouts + 11 TikTok reflows, 12 stories, 12 LinkedIn families (+5 document interiors), component sheet, 22 length proofs. Green/beige contrast {ratio:.1f}:1. G3/G4 and phone/composer checks still pending.')
