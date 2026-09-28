import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {build} from 'esbuild'

const compiled=await build({entryPoints:['src/scripts/vine-growth.ts'],write:false,format:'esm'})
const model=await import('data:text/javascript;base64,'+Buffer.from(compiled.outputFiles[0].text).toString('base64'))

test('nine states retrace through all three projects, including expanded content',()=>{
  const boundaries=[400,1000,1600,2200]
  const positions=[0,400,599,600,800,1000,1200,1400,1600,1800,2000,2200,3000]
  const expected=[0,0,0,1,2,3,4,5,6,7,8,8,8]
  assert.deepEqual(positions.map(y=>model.vineFrame(y,boundaries)),expected)
  assert.deepEqual([...positions].reverse().map(y=>model.vineFrame(y,boundaries)),[...expected].reverse())
  assert.equal(model.vineFrame(1100,[400,1600,2200,2800]),1)
  assert.equal(model.vineFrame(1600,[400,1600,2200,2800]),3)
})

test('native artwork proportions and text clearance survive desktop and mobile',()=>{
  for(const [width,viewport] of [[200,900],[150,800],[76,844],[76,500]]) {
    const layout=model.vineLayout(width,viewport)
    assert.ok(layout.originX-40*layout.scale>=0)
    assert.ok(layout.originX+78*layout.scale<=width)
    assert.equal(layout.height/layout.scale,832)
    assert.ok(layout.windowHeight<=viewport-100)
  }
})

test('camera moves the origin away, follows through the final project and reverses',()=>{
  for(const [width,viewport,end] of [[200,900,2300],[150,800,2800],[76,844,3900]]) {
    const layout=model.vineLayout(width,viewport)
    const boundaries=[400,1200,2000,end]
    const start=400,finish=end-viewport*.6
    const positions=Array.from({length:21},(_,i)=>start+(finish-start)*i/20)
    const offsets=positions.map(y=>model.vineCamera(y,viewport,boundaries,layout))
    assert.equal(offsets[0],0)
    assert.ok(offsets.every((n,i)=>i===0||n>offsets[i-1]))
    assert.equal(layout.height-offsets.at(-1),layout.windowHeight)
    assert.deepEqual([...positions].reverse().map(y=>model.vineCamera(y,viewport,boundaries,layout)),[...offsets].reverse())
    assert.equal(model.vineFrame(end,boundaries),8)
  }
})

test('reduced motion uses a still complete drawing without camera movement',()=>{
  const layout=model.vineLayout(200,900), boundaries=[400,1000,1600,2200]
  for(const y of [0,800,1800,3200,0]) {
    assert.equal(model.vineFrame(y,boundaries,true),8)
    assert.equal(model.vineCamera(y,900,boundaries,layout,true),0)
  }
})

test('renderer draws whole frames instead of inserting synthetic stem geometry',async()=>{
  const source=await readFile('src/scripts/work-preview.ts','utf8')
  assert.doesNotMatch(source,/bezierCurveTo|\.strips|\.joints|ctx\.stroke/)
  assert.match(source,/118 \* layout.scale, \(art.height \+ 2\) \* layout.scale/)
})
