import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const production = await readFile("dist/index.html", "utf8")
const preview = await readFile("dist/preview/index.html", "utf8")

function principleSection(html) {
  const section = html.match(/<footer id="about">([\s\S]*?)<nav class="portfolio-links"/)
  assert.ok(section, "the homepage principles should remain inside the shared footer")
  return section[1]
}

function coachInteraction(html) {
  const section = html.match(/<section class="home-note" id="current-project"[\s\S]*?<section class="home-note" id="writing"/)
  assert.ok(section, "the Daily Focus Coach interaction should remain on the homepage")
  return section[0]
}

test("the homepage categorizes its closing principle as Research without restoring a biography block", () => {
  const section = principleSection(production)
  assert.equal((section.match(/<p(?:\s|>)/g) ?? []).length, 2)
  assert.match(section, /class="eyebrow">Research<\/p>[\s\S]*?<h2>Attention\.<br>Understanding\.<br>Agency\.<\/h2>/)
  assert.doesNotMatch(section, /mailto:/)
})

test("the understated About action stays inside the matching production or preview experience", () => {
  assert.match(principleSection(production), /href="\/about\/"/)
  assert.match(principleSection(preview), /href="\/about-preview\/"/)
})

test("the private thought forms cannot submit visitor text before JavaScript installs", () => {
  for (const html of [production, preview]) {
    const interaction = coachInteraction(html)
    assert.doesNotMatch(interaction, /\sname=/)
    const submitButtons = [...interaction.matchAll(/<button[^>]*type="submit"[^>]*>/g)].map(match => match[0])
    assert.equal(submitButtons.length, 2)
    for (const button of submitButtons) assert.match(button, /\sdisabled(?:\s|>|="")/)
  }
})
