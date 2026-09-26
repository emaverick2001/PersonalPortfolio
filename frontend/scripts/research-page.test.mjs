import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const html = await readFile("dist/research/index.html", "utf8")

test("Research uses the approved shared shell", () => {
  assert.match(html, /class="site-header"/)
  assert.match(html, /class="portfolio-menu"/)
  assert.match(html, /id="theme-day"/)
  assert.match(html, /id="theme-night"/)
  assert.match(html, /aria-label="Portfolio pages"/)
})

test("Research separates interests from experience without dropping existing material", () => {
  assert.match(html, /id="research-interests"/)
  assert.match(html, /id="research-experience"/)
  for (const marker of [
    "Graph Neural Networks",
    "Agentic AI Systems",
    "TinyTutor",
    "Center for Psychedelic",
    "QA Library",
    "PHI Redactor",
    "Data Catalog System",
    "Protocol Deviations",
    "Toscano Lab",
    "hydropersulfides",
  ]) {
    assert.match(html, new RegExp(marker))
  }
})

test("Research keeps production navigation and a single page heading", () => {
  assert.match(html, /href="\/projects\/"/)
  assert.match(html, /href="\/resume\/"/)
  assert.doesNotMatch(html, /href="\/personal\/"/)
  assert.doesNotMatch(html, /href="\/background\/"/)
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1)
})

test("Research ends with the minimal shared footer instead of another promotional section", () => {
  assert.doesNotMatch(html, /Continue exploring/i)
  assert.doesNotMatch(html, /Follow the next question/i)
  assert.match(html, /aria-label="Portfolio pages"/)
})
