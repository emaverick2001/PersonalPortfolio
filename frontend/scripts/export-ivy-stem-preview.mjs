import {readFile,writeFile} from 'node:fs/promises'
import {fileURLToPath} from 'node:url'
import path from 'node:path'
const frontend=fileURLToPath(new URL('../',import.meta.url))
const source=path.join(frontend,'experiments/ivy-stem-transition-preview.html')
let html=await readFile(source,'utf8')
for (const [name,mime] of [['assets/images/growth/ivy-journey-states.png','image/png'],['assets/fonts/charter/charter_regular.woff2','font/woff2']]) {
 const bytes=await readFile(path.join(frontend,'public',name))
 html=html.replaceAll('../public/'+name,`data:${mime};base64,${bytes.toString('base64')}`)
}
const output=process.argv[2]
if(!output)throw new Error('Provide an output path')
await writeFile(output,html)
console.log(`Exported full-growth study: ${output}`)
