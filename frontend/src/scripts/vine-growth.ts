const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

/** Whole, consistently registered drawings from the approved growth study. */
export const vineArt = [
  { anchor: [107, 40], height: 188 },
  { anchor: [349.5, 40], height: 270 },
  { anchor: [590, 40], height: 338 },
  { anchor: [107, 676], height: 370 },
  { anchor: [349, 676], height: 460 },
  { anchor: [590, 676], height: 535 },
  { anchor: [107, 1311], height: 628 },
  { anchor: [349.5, 1311], height: 721 },
  { anchor: [590.5, 1311], height: 828 },
]

/** Three genuine drawings accompany each project, with no direction history. */
export function vineFrame(readerY: number, boundaries: number[], reducedMotion = false) {
  if (reducedMotion) return 8
  if (boundaries.length < 4) return 0
  let phase = 0
  for (let i = 1; i < 3; i++) if (readerY >= boundaries[i]!) phase = i
  const progress = clamp((readerY - boundaries[phase]!) /
    Math.max(1, boundaries[phase + 1]! - boundaries[phase]!), 0, 1)
  return Math.min(8, phase * 3 + Math.min(2, Math.floor(progress * 3)))
}

/** A camera follows the intact drawing. Page length never changes its shape. */
export function vineLayout(railWidth: number, viewportHeight: number) {
  const scale = Math.min(1.4, Math.max(0, railWidth - 12) / 118)
  const height = 832 * scale
  const windowHeight = Math.min(height * .62, Math.max(120, viewportHeight - 180))
  return { scale, height, windowHeight, originX: railWidth / 2 - 18.5 * scale }
}

export function vineCamera(scrollY: number, viewportHeight: number, boundaries: number[],
  layout: ReturnType<typeof vineLayout>, reducedMotion = false) {
  if (reducedMotion || boundaries.length < 4) return 0
  // Start following once the opening divider has left the viewport.
  const start = boundaries[0]!
  const end = boundaries[3]! - viewportHeight * .6
  const progress = clamp((scrollY - start) / Math.max(1, end - start), 0, 1)
  return progress * Math.max(0, layout.height - layout.windowHeight)
}
