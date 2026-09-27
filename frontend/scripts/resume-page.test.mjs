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

test("Resume page presents one current primary PDF with distinct actions", () => {
  assert.ok(resume, "expected /resume/ to be built")
  assert.match(resume, /class="site-header"/)
  assert.equal((resume.match(/<h1(?:\s|>)/g) ?? []).length, 1)
  assert.equal((resume.match(/data-resume-entry(?:\s|=|>)/g) ?? []).length, 1)
  assert.match(resume, /AI\/ML &amp; Data Engineer Résumé/)
  assert.match(resume, /September 2026/)
  assert.match(
    resume,
    /href="\/assets\/files\/Maverick_Espinosa_Resume\.pdf"[^>]*target="_blank"[^>]*>\s*View PDF/,
  )
  assert.match(
    resume,
    /href="\/assets\/files\/Maverick_Espinosa_Resume\.pdf"[^>]*download[^>]*>\s*Download PDF/,
  )
  assert.equal((resume.match(/\/assets\/files\/Maverick_Espinosa_Resume\.pdf/g) ?? []).length, 2)
  assert.doesNotMatch(resume, /Resume_09_20_2025\.pdf|coming soon|TBD|future role-specific versions/i)
})

test("Shared navigation exposes Resume, Personal, and Background", () => {
  for (const html of [home, inspirations, resume]) {
    assert.match(html, /href="\/resume\/"/)
    assert.match(html, /href="\/personal\/"/)
    assert.match(html, /href="\/background\/"/)
  }

  assert.doesNotMatch(home, /href="\/assets\/files\/Resume_09_20_2025\.pdf"/)
})

test("Released Personal and Background routes are available to search indexing", () => {
  assert.doesNotMatch(personal, /<meta name="robots" content="noindex/i)
  assert.doesNotMatch(background, /<meta name="robots" content="noindex/i)

  assert.match(generatedSitemap, /maverickespinosa\.com\/personal\//)
  assert.match(generatedSitemap, /maverickespinosa\.com\/background\//)
  assert.match(generatedSitemap, /maverickespinosa\.com\/resume\//)
})
