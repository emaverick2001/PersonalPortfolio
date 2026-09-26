import {readFile} from 'node:fs/promises'
import vm from 'node:vm'
import assert from 'node:assert/strict'
const html=await readFile(process.argv[2],'utf8')
const manifest=JSON.parse(html.match(/<script id="vine-manifest" type="application\/json">([\s\S]*?)<\/script>/)[1])
const code=html.match(/<script>\s*([\s\S]*?)<\/script>/)[1]
assert.ok(manifest.src.startsWith('data:image/png;base64,'))
assert.ok(!html.includes('__VINE_MANIFEST__'))
assert.ok(!html.includes('—'))
assert.equal(manifest.frames.length,9,'The preview must show the full growth sequence, not two almost-grown snapshots')
assert.ok(!html.includes('>Earlier<')&&!html.includes('>Later<'),'Remove ambiguous snapshot controls')
for(const width of [220,138,115]){
 const handlers={},jobs=[],draws=[]
 const context={setTransform(){},clearRect(){},drawImage(...args){draws.push(args)}}
 const canvas={style:{},dataset:{},getContext:()=>context}
 const readout={textContent:'',classList:{add(){}}},theme={textContent:'Night',setAttribute(){},addEventListener(t,fn){this.click=fn}},restart={addEventListener(t,fn){this.click=fn}}
 const window={scrollY:0,innerHeight:800,devicePixelRatio:1,addEventListener(type,fn){handlers[type]=fn},scrollTo({top}){this.scrollY=top;handlers.scroll()}}
 const study={style:{setProperty(){}},querySelector:()=>({clientWidth:width}),getBoundingClientRect:()=>({top:210-window.scrollY})}
 const reduced={matches:false,addEventListener(type,fn){this.change=fn}}
 const root={dataset:{}}
 const elements={'vine-manifest':{textContent:JSON.stringify(manifest)},study,vine:canvas,readout,theme,restart}
 const document={documentElement:root,getElementById:id=>elements[id]}
 class Image{set src(value){this.onload()}}
 vm.runInNewContext(code,{document,window,Image,matchMedia:()=>reduced,requestAnimationFrame:fn=>jobs.push(fn)})
 const flush=()=>{while(jobs.length)jobs.shift()()};flush()
 assert.equal(canvas.dataset.frame,'0')
 const originalHeight=canvas.height
 const seen=[]
 for(let y=0;y<=1250;y+=10){window.scrollY=y;handlers.scroll();flush();if(seen.at(-1)!==canvas.dataset.frame)seen.push(canvas.dataset.frame)}
 assert.deepEqual(seen,['0','1','2','3','4','5','6','7','8'])
 const reversed=[]
 for(let y=1250;y>=0;y-=10){window.scrollY=y;handlers.scroll();flush();if(reversed.at(-1)!==canvas.dataset.frame)reversed.push(canvas.dataset.frame)}
 assert.deepEqual(reversed,[...seen].reverse())
 window.scrollY=120;handlers.scroll();flush();assert.notEqual(canvas.dataset.frame,'0','Growth must begin during the first 120px of scrolling at this viewport')
 window.scrollY=1100;handlers.scroll();flush();restart.click();flush();assert.equal(canvas.dataset.frame,'0')
 assert.equal(canvas.height,originalHeight,'All drawings use a common scale')
 reduced.matches=true;reduced.change();flush();assert.equal(canvas.dataset.frame,'8')
 theme.click({currentTarget:theme});assert.equal(root.dataset.theme,'night')
 theme.click({currentTarget:theme});assert.equal(root.dataset.theme,'day')
 for (const call of draws){
  const [,sx,sy,sw,sh,dx,dy,dw,dh]=call
  assert.ok(Math.abs(dw/sw-dh/sh)<1e-9,'Artwork retains natural proportions')
  const art=manifest.frames.find(f=>f.rect[0]===sx&&f.rect[1]===sy)
  assert.ok(Math.abs(dy+art.anchor[1]*dh/sh)<1e-8,'Top anchor stays at its document location')
 }
}
console.log('PASS: all nine growth states, early progression, complete reverse sequence, restart, reduced motion, day/night, fixed origin and uniform scale. Browser layout untested.')
