import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const readBuilt = async (path) => readFile(path, "utf8").catch(() => "")

const resume = await readBuilt("dist/resume/index.html")
const home = await readBuilt("dist/index.html")
const inspirations = await readBuilt("dist/inspirations/index.html")
const personal = await readBuilt("dist/personal/index.html")
const background = await readBuilt("dist/background/index.html")
const generatedSitemap = await readBuilt("dist/sitemap-0.xml")
const publicSitemap = await readBuilt("dist/sitemap.xml")

test("Resume hub presents the one dated source PDF with distinct actions", () => {
  assert.ok(resume, "expected /resume/ to be built")
  assert.match(resume, /class="site-header"/)
  assert.equal((resume.match(/<h1(?:\s|>)/g) ?? []).length, 1)
  assert.equal((resume.match(/data-resume-entry(?:\s|=|>)/g) ?? []).length, 1)
  assert.match(resume, /September 20, 2025/)
  assert.match(
    resume,
    /href="\/assets\/files\/Resume_09_20_2025\.pdf"[^>]*target="_blank"[^>]*>\s*View PDF/,
  )
  assert.match(
    resume,
    /href="\/assets\/files\/Resume_09_20_2025\.pdf"[^>]*download[^>]*>\s*Download PDF/,
  )
  assert.doesNotMatch(resume, /AI Engineer Résumé|Data Engineer Résumé|coming soon|TBD/i)
})

test("Shared navigation exposes Resume but parks stale Personal and Background pages", () => {
  for (const html of [home, inspirations, resume]) {
    assert.match(html, /href="\/resume\/"/)
    assert.doesNotMatch(html, /href="\/personal\/"/)
    assert.doesNotMatch(html, /href="\/background\/"/)
  }

  assert.doesNotMatch(home, /href="\/assets\/files\/Resume_09_20_2025\.pdf"/)
})

test("Retained Personal and Background routes stay out of search indexing", () => {
  assert.match(personal, /<meta name="robots" content="noindex, nofollow"/)
  assert.match(background, /<meta name="robots" content="noindex, nofollow"/)

  for (const sitemap of [generatedSitemap, publicSitemap]) {
    assert.doesNotMatch(sitemap, /maverickespinosa\.com\/personal\//)
    assert.doesNotMatch(sitemap, /maverickespinosa\.com\/background\//)
    assert.match(sitemap, /maverickespinosa\.com\/resume\//)
  }
})
