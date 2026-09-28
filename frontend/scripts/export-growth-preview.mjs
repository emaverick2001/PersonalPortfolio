import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname, extname } from 'node:path'
import { build } from 'esbuild'

const output = process.argv[2]
if (!output) throw new Error('Pass the absolute output HTML path.')
const dist = resolve('dist')
const mime = { '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' }
let html = await readFile(resolve(dist, process.argv[3] || 'preview/index.html'), 'utf8')
async function inlineAssets(css) {
  for (const match of [...css.matchAll(/url\(["']?(\/[^)"']+)["']?\)/g)]) {
    const bytes = await readFile(resolve(dist, '.' + match[1]))
    css = css.replace(match[0], `url("data:${mime[extname(match[1]) ]};base64,${bytes.toString('base64')}")`)
  }
  return css
}
for (const match of [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)]) {
  const href = match[0].match(/href="([^"]+)"/)[1]
  html = html.replace(match[0], `<style>${await inlineAssets(await readFile(resolve(dist, '.' + href), 'utf8'))}</style>`)
}
for (const match of [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)]) {
  html = html.replace(match[0], `<style>${await inlineAssets(match[1])}</style>`)
}
for (const match of [...html.matchAll(/<script\b[^>]*src="(\/[^"]+)"[^>]*><\/script>/g)]) {
  const bundled = await build({entryPoints:[resolve(dist, '.' + match[1])],bundle:true,write:false,format:'esm',platform:'browser'})
  const script = bundled.outputFiles[0].text
  html = html.replace(match[0], `<script type="module">${script.replaceAll('</script', '<\\/script')}</script>`)
}
for (const match of [...html.matchAll(/<img\b[^>]*src="(\/[^"]+)"[^>]*>/g)]) {
  const bytes = await readFile(resolve(dist, '.' + match[1]))
  html = html.replace(match[0], match[0].replace(match[1], `data:${mime[extname(match[1])]};base64,${bytes.toString('base64')}`))
}
// Standalone review links open the current public portfolio. About stays in-page until deployed.
if (process.argv[4] !== "connected") html = html.replaceAll('href="/about/"', 'href="#about"')
html = html.replace(/href="(\/[^"]*)"/g, (_, path) => `href="https://maverickespinosa.com${path}"`)
if (/(?:src|href)="\//.test(html) || /url\(["']?\//.test(html)) throw new Error('Export still contains external local asset paths.')
if (html.includes('—')) throw new Error('Unexpected em dash in preview.')
await mkdir(dirname(output), { recursive: true })
await writeFile(output, html)
console.log(`Exported standalone preview: ${output} (${Buffer.byteLength(html)} bytes)`)
