import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const production = await readFile("dist/index.html", "utf8")
const preview = await readFile("dist/preview/index.html", "utf8")

const expected = {
  eyebrow: "AI/ML · Data · Interactive Systems",
  headline: "Make complexity easier to understand.",
  intro: "I build AI, data, and interactive systems that help people investigate difficult problems and act on what they learn.",
}

function introduction(html) {
  const section = html.match(/<section id="introduction"[\s\S]*?<\/section>/)
  assert.ok(section, "expected the homepage introduction")
  return section[0]
}

test("the first screen states the approved positioning and offers the fastest proof path", () => {
  for (const html of [production, preview]) {
    const hero = introduction(html)

    assert.match(hero, new RegExp(expected.eyebrow.replace("/", "\\/")))
    assert.match(hero, new RegExp(`<h1[^>]*>${expected.headline.replace(".", "\\.")}</h1>`))
    assert.match(hero, new RegExp(expected.intro.replace(".", "\\.")))
    assert.match(
      hero,
      /<a[^>]*class="button"[^>]*href="\/projects\/molecule-generation-with-rl\/"[^>]*>\s*Explore the molecule research/,
    )
    assert.match(hero, /<a[^>]*href="\/projects\/"[^>]*>\s*View selected work/)
    assert.match(hero, /<a[^>]*href="\/resume\/"[^>]*>\s*Resume/)
  }
})

test("the homepage positioning avoids unsupported seniority and portrait claims", () => {
  assert.equal((production.match(/<h1(?:\s|>)/g) ?? []).length, 1)
  assert.doesNotMatch(production, /\b(?:senior|staff|principal|lead|expert)\b/i)
  assert.doesNotMatch(production, /Design Engineer (?:&amp;|&) Builder/i)
  assert.doesNotMatch(production, /headshot-editorial|\.private-review|<img[^>]+(?:portrait|headshot)/i)
})
