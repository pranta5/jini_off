import fitz, json, io
from PIL import Image
from pathlib import Path

doc = fitz.open(r'C:\Users\prant\Downloads\Frame 2147223809.pdf')
page = doc[0]
out = Path('assets'); out.mkdir(exist_ok=True)
infos = page.get_image_info(xrefs=True)
manifest = []
def extract(name, number, maxsize=1600):
    item=infos[number]; xref=item['xref']
    pix=fitz.Pixmap(doc,xref)
    mask=doc.extract_image(xref).get('smask',0)
    if mask: pix=fitz.Pixmap(pix,fitz.Pixmap(doc,mask))
    im=Image.open(io.BytesIO(pix.tobytes('png')))
    im.thumbnail((maxsize,maxsize),Image.Resampling.LANCZOS)
    im.save(out/(name+'.webp'),'WEBP',quality=92)
    manifest.append({'file':name+'.webp','pdf_image':number,'bbox':item['bbox'],'size':im.size})

extract('hero-background',0)
extract('logo',1,500)
extract('assistant',23,80)
extract('footer-background',122)
for i,n in enumerate(range(26,36)): extract('partner-'+str(i),n,240)
for i,n in enumerate([46,52,53,54,55,56]): extract('solution-'+str(i),n,900)
for i,n in enumerate([78,79,80,81]): extract('compliance-'+str(i),n,280)
for i,n in enumerate(range(132,144)): extract('technology-'+str(i),n,300)
for i,n in enumerate([83,84,85,86,87,88,160,161,162,163,164,165,167,168,169,170,171,172]): extract('feature-'+str(i),n,80)
for i,n in enumerate([104,105]): extract('contact-'+str(i),n,80)
# Preserve the PDF's clipped illustration compositions, without surrounding UI.
display=page.get_displaylist()
for i,rect in enumerate([(2047,3473,2737,4174),(498,3453,1188,4154),(2757,3473,3447,4174),(3467,3473,4157,4174),(4177,3473,4867,4174),(4887,3473,5577,4174),(5597,3473,6287,4174)]):
    pix=display.get_pixmap(matrix=fitz.Matrix(1,1),clip=fitz.Rect(rect),alpha=False)
    im=Image.open(io.BytesIO(pix.tobytes('png'))); name=f'industry-{i}.webp'; im.save(out/name,'WEBP',quality=94)
    manifest.append({'file':name,'bbox':rect,'size':im.size})
for i,rect in enumerate([(5861,5405,6788,5793),(7464,5405,8391,5793),(8967,5405,9894,5793),(10442,5405,11369,5793)]):
    pix=display.get_pixmap(matrix=fitz.Matrix(1,1),clip=fitz.Rect(rect),alpha=False)
    im=Image.open(io.BytesIO(pix.tobytes('png'))); name=f'models-{i}.webp'; im.save(out/name,'WEBP',quality=94)
    manifest.append({'file':name,'bbox':rect,'size':im.size})
Path('assets/manifest.json').write_text(json.dumps(manifest,indent=2))
print(f'Extracted {len(manifest)} assets')
