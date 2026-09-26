import { readFile } from 'node:fs/promises'
import { transform } from 'esbuild'
import vm from 'node:vm'
import assert from 'node:assert/strict'
class E { listeners={};dataset={};value='0';attrs={};addEventListener(k,f){(this.listeners[k]??=[]).push(f)}async fire(k,e={}){for(const f of this.listeners[k]??[])await f({preventDefault(){},...e})}setAttribute(k,v){this.attrs[k]=v}getContext(){return null}focus(){}setPointerCapture(){}contains(x){return x===this}}
const ids=new Map(),keys=Array.from({length:13},(_,i)=>{const e=new E();e.dataset.note=String(60+i);return e})
function get(id){if(!ids.has(id))ids.set(id,new E());return ids.get(id)}get('instrument').querySelectorAll=()=>keys
let starts=0,stops=0,contexts=0
function p(){return {value:0,cancelScheduledValues(){},setTargetAtTime(v){this.value=v},linearRampToValueAtTime(v){this.value=v}}}
function n(){return {gain:p(),frequency:p(),detune:p(),delayTime:p(),connect(){},disconnect(){},start(){starts++},stop(){stops++}}}
class A {currentTime=0;sampleRate=100;state='suspended';constructor(){contexts++}createGain(){return n()}createOscillator(){return n()}createDelay(){return n()}createAnalyser(){return n()}createConvolver(){return n()}createBuffer(c,l){return {getChannelData:()=>new Float32Array(l)}}async resume(){this.state='running'}async suspend(){this.state='suspended'}}
const window=new E(),document=new E();document.getElementById=get;document.documentElement={style:{setProperty(){}}}
let code=await readFile('src/scripts/about-preview.ts','utf8');code=code.replace("import { withoutPaper } from './botanical-paper'",'const withoutPaper=x=>x');code=(await transform(code,{loader:'ts',format:'iife'})).code
vm.runInNewContext(code,{window,document,AudioContext:A,HTMLInputElement:class{},matchMedia:()=>({matches:true}),requestAnimationFrame:()=>1,cancelAnimationFrame(){}})
assert.equal(contexts,0)
await keys[0].fire('pointerdown',{pointerId:1});assert.equal(starts,0)
await get('sound-toggle').fire('click');assert.equal(contexts,1)
await keys[0].fire('pointerdown',{pointerId:1});assert.equal(starts,1)
await keys[0].fire('pointercancel',{pointerId:1});assert.equal(stops,1)
await keys[1].fire('pointerdown',{pointerId:2});await window.fire('blur');assert.equal(stops,2);assert.equal(get('sound-toggle').attrs['aria-pressed'],'false')
await get('sound-toggle').fire('click');assert.equal(contexts,1)
await get('instrument').fire('keydown',{key:'a',target:get('instrument')});await window.fire('keyup',{key:'a'});assert.equal(starts,3);assert.equal(stops,3)
await get('sound-toggle').fire('click');assert.equal(keys[0].disabled,true)
console.log('PASS: silent start, consent, pointer cancel, blur mute, context reuse, keyboard release, mute')
