import { withoutPaper } from './botanical-paper'
const root = document.documentElement
const chapters = Array.from(document.querySelectorAll<HTMLElement>('[data-stage]'))
const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
let queued = false
const captions = ['Curiosity', 'Shared understanding', 'Useful action']
const canvas = document.getElementById('growth-canvas') as HTMLCanvasElement
const context = canvas.getContext('2d')
const sheets = Array.from(document.querySelectorAll<HTMLImageElement>('[data-growth-sheet]'))
const anchors = [[160,400],[155,400],[156,400],[164,362],[158,362],[145,800],[145,800],[132,800],[120,810],[115,810],[116,810]]
let lastFrame = -1
function drawGrowth(frame: number) {
  const sheet = sheets[frame < 5 ? 0 : frame < 8 ? 1 : 2]
  if (!context || !sheet?.complete || !sheet.naturalWidth || lastFrame === frame) return
  const cell = frame < 5 ? frame : frame < 8 ? frame - 5 : frame - 8
  const width = sheet.naturalWidth / 3
  const height = sheet.naturalHeight / (frame < 5 ? 2 : 1)
  const [x, y] = anchors[frame]!
  const desktop = window.innerWidth > 760
  const scale = desktop ? .816 : .68
  const anchorY = desktop ? .82 : .74
  context.clearRect(0, 0, 768, 768)
  context.drawImage(withoutPaper(sheet), cell % 3 * width, Math.floor(cell / 3) * height, width, height, 768 * .36 - x! * scale, 768 * anchorY - y! * scale, width * scale, height * scale)
  lastFrame = frame
  canvas.dataset.frame = String(frame)
}
function updateGrowth() {
  queued = false
  const points = chapters.map(section => section.getBoundingClientRect().top + window.scrollY)
  const offset = window.innerWidth <= 760 ? 350 : window.innerHeight * .4
  const [first = 0, second = 1, third = 2] = points
  const position = window.scrollY + (window.innerWidth <= 760 ? 330 : 120)
  let progress = position < second ? (position - first) / Math.max(1, second - first) : 1 + (position - second) / Math.max(1, third - second)
  progress = Math.max(0, Math.min(2, progress))
  const stage = Math.round(progress)
  drawGrowth(motion.matches ? 10 : Math.round(progress * 5))
  root.style.setProperty('--scroll', String(Math.min(1, window.scrollY / Math.max(1, root.scrollHeight - window.innerHeight))))
  document.getElementById('stage-caption')!.textContent = captions[stage] ?? captions[0]!
  document.getElementById('stage-number')!.textContent = `0${stage + 1} / 03`
  document.querySelectorAll<HTMLAnchorElement>('nav a[href^="#"]').forEach(link => {
    const target = document.querySelector<HTMLElement>(link.hash)
    const active = target && target.getBoundingClientRect().top <= offset && target.getBoundingClientRect().bottom > offset
    if (active) link.setAttribute('aria-current', 'location')
    else link.removeAttribute('aria-current')
  })
}
function requestUpdate() { if (!queued) { queued = true; requestAnimationFrame(updateGrowth) } }
window.addEventListener('scroll', requestUpdate, { passive: true })
window.addEventListener('resize', () => { lastFrame = -1; requestUpdate() })
motion.addEventListener('change', requestUpdate)
sheets.forEach(sheet => {
  sheet.addEventListener('load', requestUpdate)
  sheet.addEventListener('error', () => {
    // Keep the most recent successfully drawn state if a later sheet fails.
    if (lastFrame < 0) drawGrowth(0)
  })
})
updateGrowth()
const lenses = {
  self: ['Your perspective', 'What are you noticing, and what might you be assuming?'],
  other: ['Another person’s perspective', 'What might another person need, notice, or understand differently?'],
  system: ['System perspective', 'What patterns, constraints, or feedback loops are shaping this?'],
  future: ['Future perspective', 'Looking back from later, what choice would you want to have made?'],
} as const
const perspectiveForm = document.getElementById('perspective-form') as HTMLFormElement
const focus = document.getElementById('focus') as HTMLTextAreaElement
const lens = document.getElementById('perspective-lens') as HTMLSelectElement
const perspectiveResult = document.getElementById('perspective-result')!
const actionForm = document.getElementById('action-form') as HTMLFormElement
const action = document.getElementById('next-action') as HTMLTextAreaElement
const actionResult = document.getElementById('action-result')!
const reset = document.getElementById('try-again') as HTMLButtonElement
perspectiveForm.addEventListener('submit', event => {
  event.preventDefault()
  const value = focus.value.trim()
  if (!value) { focus.setCustomValidity('Add what has your attention to try this interaction.'); focus.reportValidity(); return }
  const [name, prompt] = lenses[lens.value as keyof typeof lenses] ?? lenses.self
  document.getElementById('focused-thought')!.textContent = value
  document.getElementById('lens-name')!.textContent = name
  document.getElementById('perspective-prompt')!.textContent = prompt
  perspectiveForm.hidden = true
  perspectiveResult.hidden = false
  document.getElementById('capture-status')!.textContent = `Perspective shifted to ${name}. Nothing has been saved or sent.`
  action.focus({ preventScroll: true })
  requestUpdate()
})
focus.addEventListener('input', () => focus.setCustomValidity(''))
actionForm.addEventListener('submit', event => {
  event.preventDefault()
  const value = action.value.trim()
  if (!value) { action.setCustomValidity('Add one useful next action.'); action.reportValidity(); return }
  document.getElementById('chosen-action')!.textContent = value
  actionForm.hidden = true
  actionResult.hidden = false
  document.getElementById('capture-status')!.textContent = 'Next action set for this visit only. Nothing has been saved or sent.'
  reset.focus({ preventScroll: true })
  requestUpdate()
})
action.addEventListener('input', () => action.setCustomValidity(''))
reset.addEventListener('click', () => {
  perspectiveResult.hidden = true
  actionResult.hidden = true
  actionForm.hidden = false
  perspectiveForm.hidden = false
  focus.value = ''
  action.value = ''
  document.getElementById('focused-thought')!.textContent = ''
  document.getElementById('lens-name')!.textContent = ''
  document.getElementById('perspective-prompt')!.textContent = ''
  document.getElementById('chosen-action')!.textContent = ''
  document.getElementById('capture-status')!.textContent = ''
  focus.focus({ preventScroll: true })
  requestUpdate()
})
