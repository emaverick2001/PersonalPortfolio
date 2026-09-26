import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { build } from 'esbuild'

const compiled = await build({ entryPoints: ['src/scripts/growth-preview.ts'], bundle: true, write: false, format: 'iife' })
const source = compiled.outputFiles[0].text
function setup(reduced = false) {
  const properties = {}, listeners = {}, nodes = new Map()
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, { dataset: {}, getContext() { return {clearRect(){},fillRect(){},drawImage(){}} }, hidden: id === 'perspective-result' || id === 'action-result', textContent: '', value: '', handlers: {}, addEventListener(name, fn) { this.handlers[name] = fn }, focus() { this.focused = true }, setCustomValidity(value) { this.validity = value }, reportValidity() {} })
    return nodes.get(id)
  }
  const win = { scrollY: 0, innerWidth: 1200, innerHeight: 900, matchMedia: () => ({ matches: reduced, addEventListener() {} }), addEventListener(name, fn) { listeners[name] = fn } }
  const chapters = [120, 1020, 1920].map(top => ({ getBoundingClientRect: () => ({ top: top - win.scrollY }) }))
  const doc = { createElement() { return {getContext() { return {drawImage(){},getImageData(){return {data:new Uint8ClampedArray(1536*1024*4)}},putImageData(){}} }} }, documentElement: { scrollHeight: 3400, style: { setProperty(k, v) { properties[k] = Number(v) } } }, querySelectorAll: selector => selector === '[data-stage]' ? chapters : selector === '[data-growth-sheet]' ? Array.from({length:3}, () => ({complete:true,naturalWidth:1536,naturalHeight:1024,addEventListener(){}})) : [], getElementById: node }
  vm.runInNewContext(source, { document: doc, window: win, requestAnimationFrame: fn => fn() })
  return { properties, node, win, scroll(y) { win.scrollY = y; listeners.scroll() } }
}
test('eleven states advance and retrace with a fixed canvas', () => {
  const ui = setup()
  for (let frame=0; frame<=10; frame++) { ui.scroll(frame*180); assert.equal(ui.node('growth-canvas').dataset.frame, String(frame)) }
  for (let frame=10; frame>=0; frame--) { ui.scroll(frame*180); assert.equal(ui.node('growth-canvas').dataset.frame, String(frame)) }
  ui.scroll(9999); assert.equal(ui.node('growth-canvas').dataset.frame, '10')
})
test('reduced motion keeps the final illustration still', () => {
  const ui = setup(true)
  for (const y of [0,450,900,1800]) { ui.scroll(y); assert.equal(ui.node('growth-canvas').dataset.frame,'10') }
})
test('attention moves through a chosen perspective before asking for an action', () => {
  const ui = setup(), input = ui.node('focus'), form = ui.node('perspective-form'), lens = ui.node('perspective-lens')
  assert.equal(typeof form.handlers.submit, 'function')
  input.value = '   '; form.handlers.submit({ preventDefault() {} }); assert.ok(input.validity)
  input.value = 'The project feels too broad.'; lens.value = 'system'; input.handlers.input(); form.handlers.submit({ preventDefault() {} })
  assert.equal(ui.node('focused-thought').textContent, input.value)
  assert.equal(ui.node('lens-name').textContent, 'System perspective')
  assert.equal(ui.node('perspective-prompt').textContent, 'What patterns, constraints, or feedback loops are shaping this?')
  assert.equal(form.hidden, true)
  assert.equal(ui.node('perspective-result').hidden, false)
  assert.equal(ui.node('next-action').focused, true)
})

test('the next action remains local, renders as text, and clears on reset', () => {
  const ui = setup(), focus = ui.node('focus'), perspectiveForm = ui.node('perspective-form'), action = ui.node('next-action'), actionForm = ui.node('action-form')
  assert.equal(typeof perspectiveForm.handlers.submit, 'function')
  focus.value = 'Understand the next step.'; ui.node('perspective-lens').value = 'self'; perspectiveForm.handlers.submit({ preventDefault() {} })
  action.value = '   '; actionForm.handlers.submit({ preventDefault() {} }); assert.ok(action.validity)
  action.value = '<strong>Write one question.</strong>'; action.handlers.input(); actionForm.handlers.submit({ preventDefault() {} })
  assert.equal(ui.node('chosen-action').textContent, action.value)
  assert.equal(actionForm.hidden, true)
  assert.equal(ui.node('action-result').hidden, false)
  assert.match(ui.node('capture-status').textContent, /Nothing has been saved or sent/)
  ui.node('try-again').handlers.click()
  assert.equal(focus.value, '')
  assert.equal(action.value, '')
  assert.equal(perspectiveForm.hidden, false)
  assert.equal(ui.node('perspective-result').hidden, true)
})
