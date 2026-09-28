import {readFile,writeFile} from 'node:fs/promises'
import {spawnSync} from 'node:child_process'
import {resolve,dirname} from 'node:path'
const output=resolve(process.argv[2]||'../../portfolio-work-preview.html')
const base=dirname(output)
const routes={home:'preview',about:'about-preview',work:'work-preview',synthesizer:'synthesizer-preview'}
const initialRoute=process.argv[3]||'work'
if(!Object.hasOwn(routes,initialRoute))throw new Error('Unknown initial preview route')
const pages={}
for(const [name,route] of Object.entries(routes)){
 const file=resolve(base,`review-${name}.html`)
 const result=spawnSync(process.execPath,['scripts/export-growth-preview.mjs',file,`${route}/index.html`,'connected'],{encoding:'utf8'})
 if(result.status!==0)throw new Error(result.stderr||result.stdout)
 pages[name]=(await readFile(file,'utf8')).replaceAll('href="https://maverickespinosa.com/background/"','data-legacy="true" target="_blank" rel="noopener" href="https://maverickespinosa.com/"')
}
const data=JSON.stringify(pages).replaceAll('<','\\u003c')
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Maverick | Portfolio preview</title><style>html,body{margin:0;height:100%;background:#f6f3eb}iframe{display:block;width:100%;height:100%;border:0}</style></head><body><iframe title="Connected portfolio preview" id="portfolio" allow="autoplay"></iframe><script>
const pages=${data};const frame=document.getElementById('portfolio');let preference=null,current=null,anchor='';
function scrollToAnchor(){if(anchor)frame.contentDocument.getElementById(anchor)?.scrollIntoView();else frame.contentWindow.scrollTo(0,0);}
function render(){const parts=location.hash.slice(1).split(':');const route=Object.hasOwn(pages,parts[0])?parts[0]:${JSON.stringify(initialRoute)};try{anchor=decodeURIComponent(parts.slice(1).join(':'));}catch{anchor='';}if(route===current){scrollToAnchor();return;}if(current&&frame.contentDocument){preference=frame.contentDocument.documentElement.classList.contains('dark')?'dark':'light';frame.contentWindow.dispatchEvent(new Event('pagehide'));}current=route;frame.srcdoc=pages[route];}
frame.addEventListener('load',()=>{const doc=frame.contentDocument;if(!doc)return;if(preference)doc.getElementById(preference==='dark'?'theme-night':'theme-day')?.click();scrollToAnchor();doc.addEventListener('click',event=>{const link=event.target.closest('a');if(!link||link.dataset.legacy||!link.getAttribute('href')||link.getAttribute('href').startsWith('#'))return;const url=new URL(link.href);if(url.hostname!=='maverickespinosa.com')return;const map={'/':'home','/preview/':'home','/about/':'about','/about-preview/':'about','/projects/':'work','/work-preview/':'work','/synthesizer-preview/':'synthesizer'};const route=map[url.pathname];if(!route){link.target='_blank';link.rel='noopener';return;}event.preventDefault();const next=route+(url.hash?':'+encodeURIComponent(url.hash.slice(1)):'');if(location.hash.slice(1)===next){scrollToAnchor();return;}location.hash=next;});});window.addEventListener('hashchange',render);render();
</script></body></html>`
await writeFile(output,html)
console.log(`Exported four connected pages: ${output}`)
