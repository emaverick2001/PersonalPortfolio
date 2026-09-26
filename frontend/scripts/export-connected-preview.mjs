import {readFile,writeFile} from 'node:fs/promises'
const base='/workspace/scratch/c53805e57b33/'
const pages={home:await readFile(base+'connected-home.html','utf8'),about:await readFile(base+'connected-about.html','utf8')}
for(const key of Object.keys(pages))pages[key]=pages[key].replaceAll('href="https://maverickespinosa.com/background/"','data-legacy="true" target="_blank" rel="noopener" href="https://maverickespinosa.com/"')
const data=JSON.stringify(pages).replaceAll('<','\\u003c')
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Maverick | Connected portfolio preview</title><style>html,body{margin:0;height:100%;background:#f6f3eb}iframe{display:block;width:100%;height:100%;border:0}</style></head><body><iframe title="Portfolio preview" id="portfolio" allow="autoplay"></iframe><script>
const pages=${data};const frame=document.getElementById('portfolio');let preference=null;let current=null;
function render(){const route=location.hash==='#about'?'about':'home';if(route===current)return;if(current){preference=frame.contentDocument.documentElement.classList.contains('dark')?'dark':'light';frame.contentWindow.dispatchEvent(new Event('pagehide'));}current=route;frame.srcdoc=pages[route];}
frame.addEventListener('load',()=>{const doc=frame.contentDocument;if(preference)doc.getElementById(preference==='dark'?'theme-night':'theme-day')?.click();doc.addEventListener('click',event=>{const link=event.target.closest('a');if(!link||link.dataset.legacy||link.getAttribute('href').startsWith('#'))return;const url=new URL(link.href);if(url.hostname!=='maverickespinosa.com')return;const route=['/about/','/about-preview/'].includes(url.pathname)?'about':['/','/preview/'].includes(url.pathname)?'home':null;if(!route){link.target='_blank';link.rel='noopener';return;}event.preventDefault();if(route===current){frame.contentWindow.scrollTo({top:0,behavior:'smooth'});return;}location.hash=route;});});window.addEventListener('hashchange',render);render();
</script></body></html>`
await writeFile(base+'portfolio-connected-preview.html',html)
console.log('Connected preview exported, Home and About embedded.')
