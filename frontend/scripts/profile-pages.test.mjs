import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const personal = await readFile("dist/personal/index.html", "utf8")
const background = await readFile("dist/background/index.html", "utf8")

function assertReleasedProfilePage(html, route) {
  assert.match(html, /class="site-header"/)
  assert.match(html, /id="theme-day"/)
  assert.match(html, /id="theme-night"/)
  assert.match(html, new RegExp(`rel="canonical" href="https://maverickespinosa\\.com${route}"`))
  assert.doesNotMatch(html, /<meta name="robots" content="noindex/i)
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1)
  assert.match(html, /aria-label="Portfolio pages"/)
}

test("Personal uses the released botanical shell and a minimal human portrait", () => {
  assertReleasedProfilePage(personal, "/personal/")
  assert.match(personal, /Sound\. Movement\. Curiosity\./)
  for (const marker of ["Music", "Movement", "Connection", "Curiosity"]) {
    assert.match(personal, new RegExp(marker))
  }
  assert.match(personal, /href="\/music\/"/)
  assert.match(personal, /href="\/inspirations\/"/)
  assert.match(personal, /href="\/about\/"/)
  assert.doesNotMatch(personal, /girlfriend|Buddy|Pikachu|Pecan|Walnut|Pistachio|Phoenix ⇄|workout planner/i)
})

test("Background presents a truthful path without stale current-status claims", () => {
  assertReleasedProfilePage(background, "/background/")
  assert.match(background, /A path through mathematics, science, software, research, and creative systems\./)
  const pathHeadings = [...background.matchAll(/<article>\s*<p class="profile-index"[^>]*>[^<]+<\/p>\s*<div><h2>([^<]+)<\/h2>/g)].map(
    (match) => match[1],
  )
  assert.deepEqual(pathHeadings, [
    "Mathematics",
    "Physics",
    "Chemistry and neuroscience",
    "Computer science",
    "Research and data systems",
    "Products and creative technology",
    "Direction",
  ])
  assert.match(background, /summer after seventh grade/i)
  assert.match(background, /whether it made sense/i)
  assert.match(background, /academic majors/)
  assert.match(background, /substantial coursework in both/)
  assert.match(background, /href="\/projects\/"/)
  assert.match(background, /href="\/research\/"/)
  assert.match(background, /href="\/resume\/"/)
  for (const [route, label] of [
    ["projects", "Selected work"],
    ["research", "Research"],
    ["resume", "Résumé"],
  ]) {
    assert.match(background, new RegExp(`<a[^>]*href="/${route}/"[^>]*aria-label="${label}"`))
  }
  assert.doesNotMatch(background, /currently working|now pursuing|I am completing|Phoenix ⇄/i)
})
