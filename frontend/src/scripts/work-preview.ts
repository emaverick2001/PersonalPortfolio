import { vineFrame, vineLayout, vineCamera, vineArt } from './vine-growth'

const root = document.documentElement
const journey = document.getElementById('project-journey')
const canvas = document.getElementById('work-vine-canvas') as HTMLCanvasElement | null
const sheet = document.getElementById('work-vine-sheet') as HTMLImageElement | null
const rail = document.querySelector<HTMLElement>('.vine-rail')
const reduced = matchMedia('(prefers-reduced-motion: reduce)')
let queued = false
let lastKey = ''
let preparedSheet: HTMLCanvasElement | null = null

function drawVine() {
  if (!canvas || !sheet?.naturalWidth || !journey || !rail) return
  const sections = Array.from(journey.querySelectorAll<HTMLElement>('.project-entry'))
  const last = sections[sections.length - 1]
  if (!last) return
  const tops = sections.map(section => section.getBoundingClientRect().top + window.scrollY)
  const boundaries = [...tops, last.getBoundingClientRect().bottom + window.scrollY]
  const width = rail.clientWidth
  const frame = vineFrame(window.scrollY + window.innerHeight * .6, boundaries, reduced.matches)
  const layout = vineLayout(width, window.innerHeight)
  const camera = vineCamera(window.scrollY, window.innerHeight, boundaries, layout, reduced.matches)
  journey.style.setProperty('--vine-anchor-x', `${layout.originX}px`)
  journey.style.setProperty('--vine-window', `${reduced.matches ? layout.height : layout.windowHeight}px`)
  canvas.style.transform = `translateY(${-camera}px)`
  const resolution = Math.min(2, window.devicePixelRatio || 1)
  const key = `${frame}:${width}:${layout.height}:${resolution}`
  if (lastKey === key) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  if (!preparedSheet) {
    const clean = document.createElement('canvas')
    clean.width = sheet.naturalWidth; clean.height = sheet.naturalHeight
    const cleanContext = clean.getContext('2d', { willReadFrequently: true })
    if (!cleanContext) return
    cleanContext.drawImage(sheet, 0, 0)
    const pixels = cleanContext.getImageData(0, 0, clean.width, clean.height)
    // Remove faint transparent haze without removing ivory flowers.
    for (let p = 3; p < pixels.data.length; p += 4) {
      if (pixels.data[p]! < 24) pixels.data[p] = 0
    }
    cleanContext.putImageData(pixels, 0, 0)
    preparedSheet = clean
  }
  canvas.width = Math.round(width * resolution)
  canvas.height = Math.round(layout.height * resolution)
  canvas.style.height = `${layout.height}px`
  ctx.setTransform(resolution, 0, 0, resolution, 0, 0)
  const art = vineArt[frame]!
  ctx.clearRect(0, 0, width, layout.height)
  // One complete drawing, one uniform scale. No sliced stems or connector paths.
  ctx.drawImage(preparedSheet,
    art.anchor[0]! - 40, art.anchor[1]!, 118, art.height + 2,
    layout.originX - 40 * layout.scale, 0, 118 * layout.scale, (art.height + 2) * layout.scale)
  canvas.dataset.phase = String(Math.floor(frame / 3))
  canvas.dataset.frame = String(frame)
  lastKey = key
}

function update() {
  queued = false
  root.style.setProperty('--scroll', String(Math.min(1, Math.max(0, window.scrollY / Math.max(1, root.scrollHeight - window.innerHeight)))))
  drawVine()
}
function schedule() {
  if (!queued) { queued = true; requestAnimationFrame(update) }
}
sheet?.addEventListener('load', () => { lastKey = ''; schedule() })
sheet?.addEventListener('error', () => {
  if (rail) rail.hidden = true
  journey?.classList.add('vine-unavailable')
})
window.addEventListener('scroll', schedule, { passive: true })
window.addEventListener('resize', schedule)
reduced.addEventListener('change', schedule)
if (journey) new ResizeObserver(schedule).observe(journey)
update()
