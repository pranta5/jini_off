import fitz,json
from pathlib import Path
p=fitz.open(r'C:\Users\prant\Downloads\Frame 2147223809.pdf')[0]
def text(rect):
    return ' '.join(p.get_textbox(fitz.Rect(rect)).split()).replace('\ufffd',"'")
solutions=[]
for title,body in [((510,2100,1060,2190),(510,2195,1060,2290)),((1100,2100,1480,2185),(1100,2190,1480,2320)),((1515,2100,1900,2185),(1515,2190,1900,2320)),((510,2690,905,2775),(510,2780,905,2910)),((925,2690,1310,2775),(925,2780,1310,2910)),((1340,2690,1890,2780),(1340,2785,1890,2900))]:
    solutions.append({'title':text(title),'body':text(body)})
features=[]
for offset in [0,1630,3260]:
    group=[]
    for y in [5430,5726]:
        for x in [498,971.333,1444.667]:
            group.append({'title':text((x+100+offset,y,x+450+offset,y+80)),'body':text((x+15+offset,y+100,x+440+offset,y+225))})
    features.append(group)
Path('tmp/pdfs/content.json').write_text(json.dumps({'solutions':solutions,'features':features},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'solutions':solutions,'features':features},ensure_ascii=False))
