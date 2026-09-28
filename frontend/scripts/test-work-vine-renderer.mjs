import {readFile,writeFile} from 'node:fs/promises'
import {createRequire} from 'node:module'
import vm from 'node:vm'
import assert from 'node:assert/strict'
import {build} from 'esbuild'
import sharp from 'sharp'
const require=createRequire(import.meta.url)
const {createCanvas,loadImage}=require('@napi-rs/canvas')
const compiled=await build({entryPoints:['src/scripts/work-preview.ts'],bundle:true,write:false,format:'iife'})
const sheet=await loadImage(await sharp(await readFile('public/assets/images/growth/ivy-journey-states.png')).png().toBuffer())
const samples=[]
for(const width of [200,150,76]){
  const handlers={},jobs=[],draws=[]
  const window={scrollY:0,innerHeight:844,devicePixelRatio:1,addEventListener:(event,fn)=>handlers[event]=fn}
  const canvas=createCanvas(1,1);canvas.style={};canvas.dataset={}
  const ctx=canvas.getContext('2d'),draw=ctx.drawImage.bind(ctx)
  ctx.drawImage=(...args)=>{draws.push(args);draw(...args)}
  const rail={clientWidth:width,hidden:false},props={}
  let boundaries=[600,1600,2450,3300]
  const sections=[0,1,2].map(i=>({getBoundingClientRect:()=>({top:boundaries[i]-window.scrollY,bottom:boundaries[i+1]-window.scrollY})}))
  const journey={style:{setProperty:(k,v)=>props[k]=v},classList:{add(){}},querySelectorAll:()=>sections}
  const reduced={matches:false,addEventListener:(event,fn)=>handlers.reduced=fn}
  sheet.addEventListener=(event,fn)=>handlers['image:'+event]=fn
  const document={documentElement:{scrollHeight:4000,style:{setProperty(){}}},
    getElementById:id=>({'project-journey':journey,'work-vine-canvas':canvas,'work-vine-sheet':sheet}[id]),
    querySelector:()=>rail,createElement:()=>createCanvas(1,1)}
  vm.runInNewContext(compiled.outputFiles[0].text,{document,window,matchMedia:()=>reduced,requestAnimationFrame:fn=>jobs.push(fn),ResizeObserver:class{constructor(fn){handlers.observer=fn}observe(){}}})
  const flush=()=>{while(jobs.length)jobs.shift()()}
  const scroll=y=>{window.scrollY=y;handlers.scroll();flush()}
  const seen=[]
  for(let y=0;y<=3000;y+=20){scroll(y);if(seen.at(-1)!==canvas.dataset.frame)seen.push(canvas.dataset.frame)}
  assert.deepEqual(seen,['0','1','2','3','4','5','6','7','8'])
  const reverse=[]
  for(let y=3000;y>=0;y-=20){scroll(y);if(reverse.at(-1)!==canvas.dataset.frame)reverse.push(canvas.dataset.frame)}
  assert.deepEqual(reverse,[...seen].reverse())
  for(const args of draws){const [,sx,sy,sw,sh,dx,dy,dw,dh]=args;assert.equal(sw,118);assert.equal(dy,0);assert.ok(Math.abs(dw/sw-dh/sh)<1e-8)}
  // A disclosure change must update progression without reloading the page.
  scroll(1800);const before=canvas.dataset.frame
  boundaries=[600,2300,3150,4000];handlers.observer();flush()
  assert.ok(Number(canvas.dataset.frame)<Number(before))
  boundaries=[600,1600,2450,3300]
  if(width!==150)for(const y of [500,1200,2050,2900]){
    scroll(y)
    const height=Number.parseFloat(props['--vine-window'])
    const pan=Number(canvas.style.transform.match(/translateY\(([-\d.]+)px/)[1])
    const snapshot=createCanvas(width,Math.ceil(height));snapshot.getContext('2d').drawImage(canvas,0,pan)
    samples.push({snapshot,width,height,frame:canvas.dataset.frame})
  }
  reduced.matches=true;handlers.reduced();flush();assert.equal(canvas.dataset.frame,'8');assert.equal(canvas.style.transform,'translateY(0px)')
  handlers['image:error']();assert.equal(rail.hidden,true)
}
if(process.argv[2]){
  const output=createCanvas(1280,800),context=output.getContext('2d')
  context.fillStyle='#f4f1e8';context.fillRect(0,0,1280,800)
  context.fillStyle='#254835';context.font='18px sans-serif';context.fillText('Canvas simulation: desktop and narrow rail, four scroll positions',24,28)
  let x=24
  for(const sample of samples){context.fillStyle='#254835';context.font='13px sans-serif';context.fillText(`State ${Number(sample.frame)+1}`,x,55);context.drawImage(sample.snapshot,x,76);x+=sample.width+24}
  await writeFile(process.argv[2],output.toBuffer('image/png'))
}
console.log('PASS: actual renderer visits nine frames in both directions; whole proportional drawings; disclosure remeasure; reduced motion and asset failure. Native canvas only, not browser layout.')
