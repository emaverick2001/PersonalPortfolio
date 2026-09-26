import { withoutPaper } from './botanical-paper'
const plant=document.getElementById('about-plant') as HTMLCanvasElement
const sheet=document.getElementById('plant-sheet') as HTMLImageElement
function drawPlant(){if(sheet.naturalWidth)plant.getContext('2d')?.drawImage(withoutPaper(sheet),sheet.naturalWidth*2/3,0,sheet.naturalWidth/3,sheet.naturalHeight,100,0,400,800)}
sheet.addEventListener('load',drawPlant);if(sheet.complete)drawPlant()
window.addEventListener('scroll',()=>document.documentElement.style.setProperty('--scroll',String(window.scrollY/Math.max(1,document.documentElement.scrollHeight-window.innerHeight))),{passive:true})
const instrument=document.getElementById('instrument')!
const toggle=document.getElementById('sound-toggle') as HTMLButtonElement
const status=document.getElementById('sound-status')!
const controls=document.getElementById('sound-controls') as HTMLFieldSetElement
const keys=Array.from(instrument.querySelectorAll<HTMLButtonElement>('[data-note]'))
const pitch=document.getElementById('pitch') as HTMLInputElement
const delay=document.getElementById('delay') as HTMLInputElement
const reverb=document.getElementById('reverb') as HTMLInputElement
const wave=document.getElementById('waveform') as HTMLCanvasElement
let audio:AudioContext|undefined
let input:GainNode,master:GainNode,delayed:GainNode,reverbed:GainNode,analyser:AnalyserNode
let enabled=false,animation=0
const voices=new Map<string,{osc:OscillatorNode;gain:GainNode;button:HTMLButtonElement}>()
function release(id:string){const v=voices.get(id);if(!v||!audio)return;v.gain.gain.cancelScheduledValues(audio.currentTime);v.gain.gain.setTargetAtTime(0,audio.currentTime,.02);v.osc.stop(audio.currentTime+.15);voices.delete(id);if(![...voices.values()].some(x=>x.button===v.button))v.button.setAttribute('aria-pressed','false')}
function releaseAll(){for(const id of [...voices.keys()])release(id)}
function play(button:HTMLButtonElement,id:string){if(!enabled||!audio||audio.state!=='running'||voices.has(id))return;const osc=audio.createOscillator(),gain=audio.createGain();osc.type='triangle';osc.frequency.value=440*Math.pow(2,(Number(button.dataset.note)-69)/12);osc.detune.value=Number(pitch.value)*100;gain.gain.value=0;gain.gain.linearRampToValueAtTime(.12,audio.currentTime+.02);osc.connect(gain);gain.connect(input);osc.onended=()=>{osc.disconnect();gain.disconnect()};osc.start();voices.set(id,{osc,gain,button});button.setAttribute('aria-pressed','true')}
function setup(){audio=new AudioContext();input=audio.createGain();master=audio.createGain();master.gain.value=.45;analyser=audio.createAnalyser();analyser.fftSize=1024;input.connect(master);master.connect(analyser);analyser.connect(audio.destination);const echo=audio.createDelay(1),feedback=audio.createGain();echo.delayTime.value=.28;feedback.gain.value=.3;delayed=audio.createGain();delayed.gain.value=Number(delay.value)/100;input.connect(echo);echo.connect(feedback);feedback.connect(echo);echo.connect(delayed);delayed.connect(master);const convolver=audio.createConvolver(),buffer=audio.createBuffer(2,audio.sampleRate*1.5,audio.sampleRate);for(let c=0;c<2;c++){const data=buffer.getChannelData(c);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,3)}convolver.buffer=buffer;reverbed=audio.createGain();reverbed.gain.value=Number(reverb.value)/100;input.connect(convolver);convolver.connect(reverbed);reverbed.connect(master)}
function drawWave(){const ctx=wave.getContext('2d');if(!ctx)return;ctx.clearRect(0,0,wave.width,wave.height);ctx.strokeStyle=getComputedStyle(instrument).color;ctx.lineWidth=2;ctx.beginPath();const samples=new Uint8Array(analyser?.fftSize??1024);if(enabled)analyser.getByteTimeDomainData(samples);else samples.fill(128);for(let i=0;i<samples.length;i++){const x=i/(samples.length-1)*wave.width,y=samples[i]!/255*wave.height;if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y)}ctx.stroke();if(enabled&&!matchMedia('(prefers-reduced-motion: reduce)').matches)animation=requestAnimationFrame(drawWave)}
function setEnabled(value:boolean){enabled=value;toggle.textContent=value?'Mute sound':'Enable sound';toggle.setAttribute('aria-pressed',String(value));controls.disabled=!value;keys.forEach(key=>key.disabled=!value);status.textContent=value?'Ready. Hold a key to play.':'Sound is off.';cancelAnimationFrame(animation);drawWave()}
toggle.addEventListener('click',async()=>{toggle.disabled=true;try{if(enabled){releaseAll();master.gain.value=0;await audio?.suspend();setEnabled(false)}else{if(!audio)setup();await audio!.resume();master.gain.value=.45;setEnabled(true)}}catch{setEnabled(false);status.textContent='Audio could not start. Try another browser.'}finally{toggle.disabled=false}})
keys.forEach(button=>{button.addEventListener('pointerdown',event=>{if(!enabled)return;event.preventDefault();button.focus({preventScroll:true});button.setPointerCapture(event.pointerId);play(button,`pointer:${event.pointerId}`)});for(const eventName of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(eventName,event=>release(`pointer:${(event as PointerEvent).pointerId}`));button.addEventListener('keydown',event=>{if([' ','Enter'].includes(event.key)){event.preventDefault();if(!event.repeat)play(button,`button:${button.dataset.note}`)}});button.addEventListener('keyup',event=>{if([' ','Enter'].includes(event.key)){event.preventDefault();release(`button:${button.dataset.note}`)}});button.addEventListener('blur',()=>release(`button:${button.dataset.note}`))})
const shortcuts=['a','w','s','e','d','f','t','g','y','h','u','j','k']
instrument.addEventListener('keydown',event=>{if(event.target instanceof HTMLInputElement||event.ctrlKey||event.metaKey||event.altKey)return;const index=shortcuts.indexOf(event.key.toLowerCase());if(index<0||event.repeat)return;event.preventDefault();play(keys[index]!,`key:${event.key.toLowerCase()}`)})
window.addEventListener('keyup',event=>release(`key:${event.key.toLowerCase()}`))
instrument.addEventListener('focusout',event=>{if(!instrument.contains(event.relatedTarget as Node))releaseAll()})
function silence(){releaseAll();if(audio){master.gain.value=0;void audio.suspend()}setEnabled(false)}
window.addEventListener('blur',silence);window.addEventListener('pagehide',silence);document.addEventListener('visibilitychange',()=>{if(document.hidden)silence()})
pitch.addEventListener('input',()=>{document.getElementById('pitch-value')!.textContent=`${pitch.value} semitones`;if(audio)for(const v of voices.values())v.osc.detune.setTargetAtTime(Number(pitch.value)*100,audio.currentTime,.02)})
for(const [slider,id] of [[delay,'delay-value'],[reverb,'reverb-value']] as const)slider.addEventListener('input',()=>{document.getElementById(id)!.textContent=`${slider.value}%`;if(audio)(slider===delay?delayed:reverbed).gain.setTargetAtTime(Number(slider.value)/100,audio.currentTime,.02)})
drawWave()
