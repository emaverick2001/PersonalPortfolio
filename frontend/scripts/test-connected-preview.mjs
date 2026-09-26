import {readFile} from 'node:fs/promises'
import vm from 'node:vm'
import assert from 'node:assert/strict'
const html=await readFile(process.argv[2],'utf8')
const code=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'))
const handlers={},clicks=[],events=[]
const doc={documentElement:{classList:{contains:()=>true}},getElementById:id=>({click:()=>clicks.push(id),scrollIntoView:()=>events.push('anchor:'+id)}),addEventListener:(name,fn)=>handlers['doc:'+name]=fn}
const frame={srcdoc:'',contentDocument:doc,contentWindow:{dispatchEvent:e=>events.push(e.type),scrollTo:()=>{}},addEventListener:(name,fn)=>handlers[name]=fn}
let hash=process.argv[3]||''
const location={get hash(){return hash},set hash(value){hash=value.startsWith('#')?value:'#'+value}}
vm.runInNewContext(code,{document:{getElementById:()=>frame},location,window:{addEventListener:(name,fn)=>handlers[name]=fn},URL,Event:class{constructor(type){this.type=type}}})
assert.match(frame.srcdoc,/Different questions/)
handlers.load()
function click(path){let prevented=false;const a={href:'https://maverickespinosa.com'+path,dataset:{},getAttribute:()=>a.href};handlers['doc:click']({target:{closest:()=>a},preventDefault:()=>prevented=true});assert.ok(prevented);handlers.hashchange();handlers.load()}
click('/synthesizer-preview/');assert.ok(frame.srcdoc.includes('The arpeggiator'),'Case study should render')
click('/work-preview/#daily-focus-coach');assert.match(frame.srcdoc,/Different questions/);assert.ok(events.includes('anchor:daily-focus-coach'))
click('/about-preview/');assert.match(frame.srcdoc,/Enable sound/)
click('/preview/#work');assert.match(frame.srcdoc,/Tools that help/);assert.ok(events.includes('pagehide'));assert.ok(clicks.includes('theme-night'));assert.ok(events.includes('anchor:work'))
location.hash='#about';handlers.hashchange();assert.match(frame.srcdoc,/Enable sound/)
console.log('PASS: Work → case study → Work anchor → About → Home anchor; theme carryover, pagehide and history routing')
