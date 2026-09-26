import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const about = await readFile("dist/about/index.html", "utf8")

test("About ends with the shared navigation without a promotional heading", () => {
  assert.match(about, /<footer[^>]*id="about"/)
  assert.match(about, /<nav class="portfolio-links" aria-label="Portfolio pages">/)
  assert.doesNotMatch(about, /There’s more to explore/)
  assert.doesNotMatch(about, /about-footer-title/)
})

test("About keeps the consent-gated sound instrument", () => {
  assert.match(about, /id="instrument"/)
  assert.match(about, /id="sound-toggle"[^>]*aria-pressed="false"/)
  assert.match(about, /id="sound-controls" disabled/)
  assert.equal((about.match(/class="piano-key/g) ?? []).length, 13)
})
