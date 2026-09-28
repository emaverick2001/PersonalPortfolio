const cleanSheets = new Map<HTMLImageElement, HTMLCanvasElement>()
export function withoutPaper(sheet: HTMLImageElement) {
  const existing = cleanSheets.get(sheet)
  if (existing) return existing
  const clean = document.createElement('canvas')
  clean.width = sheet.naturalWidth; clean.height = sheet.naturalHeight
  const ctx = clean.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(sheet, 0, 0)
  const pixels = ctx.getImageData(0, 0, clean.width, clean.height)
  const { data } = pixels, width = clean.width, height = clean.height
  const visited = new Uint8Array(width * height)
  const queue = new Int32Array(width * height)
  let head = 0, tail = 0
  function visit(index: number) {
    if (visited[index]) return
    visited[index] = 1
    const p = index * 4
    const r = data[p]!, g = data[p + 1]!, b = data[p + 2]!
    // Only exterior pale, nearly neutral paper. Enclosed highlights are untouched.
    if (Math.min(r, g, b) < 215 || Math.max(r, g, b) - Math.min(r, g, b) > 28) return
    queue[tail++] = index
  }
  for (let x = 0; x < width; x++) { visit(x); visit((height - 1) * width + x) }
  for (let y = 0; y < height; y++) { visit(y * width); visit(y * width + width - 1) }
  while (head < tail) {
    const index = queue[head++]!
    data[index * 4 + 3] = 0
    const x = index % width
    if (x > 0) visit(index - 1)
    if (x < width - 1) visit(index + 1)
    if (index >= width) visit(index - width)
    if (index < width * (height - 1)) visit(index + width)
  }
  ctx.putImageData(pixels, 0, 0)
  cleanSheets.set(sheet, clean)
  return clean
}
