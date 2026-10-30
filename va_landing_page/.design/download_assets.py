import re, pathlib, subprocess, concurrent.futures, json
root=pathlib.Path(__file__).resolve().parent.parent
assets=root/'dist/assets'
assets.mkdir(exist_ok=True)
sources={}
for file in [root/'.design/reference.jsx',*[root/f'.design/22-{n}.txt' for n in [578,590,565,602,603]]]:
    prefix='' if file.suffix=='.jsx' else file.stem+'-'
    for name,url in re.findall(r'const (\w+) = "(https://www.figma.com/api/mcp/asset/[^\"]+)";',file.read_text(encoding='utf-8')):
        sources[prefix+name]=url
def download(item):
    name,url=item
    file=assets/(name+pathlib.Path(url).suffix)
    if not file.exists() or not file.stat().st_size:
        subprocess.run(['curl.exe','-f','-sS','-L','--retry','2',url,'-o',str(file)],check=True)
    return name,'assets/'+file.name
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    manifest=dict(pool.map(download,sources.items()))
(root/'.design/assets.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
print(f'Downloaded {len(manifest)} assets')
