import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const html = await readFile("dist/inspirations/index.html", "utf8")
const css = await readFile("src/styles/inspirations.css", "utf8")

test("Inspirations uses the shared shell with its active Explore destination", () => {
  assert.match(html, /class="site-header"/)
  assert.match(html, /<nav class="portfolio-links" aria-label="Portfolio pages">/)
  assert.match(html, /href="\/inspirations\/"[^>]*aria-current="page"/)
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1)
})

test("Inspirations preserves all seven categories and 58 entries", () => {
  const categories = [...html.matchAll(/data-inspiration-category="([^"]+)"/g)].map(
    (match) => match[1],
  )
  assert.deepEqual(categories, ["people", "posts", "talks", "videos", "music", "games", "media"])
  assert.equal((html.match(/data-inspiration-item(?:\s|=|>)/g) ?? []).length, 58)
  assert.match(html, /History of Computers &amp; User Interface Images &amp; Symbols/)
  assert.match(html, /Joe Hisaishi in Budokan - Studio Ghibli 25 Years Concert/)
  assert.doesNotMatch(html, /Isabel Lopez Santiago/)
})

test("Inspirations presents the curated categories as one single-open accordion", () => {
  const disclosures = [...html.matchAll(/<details\b([^>]*)data-inspiration-category="([^"]+)"([^>]*)>/g)]

  assert.deepEqual(
    disclosures.map(([, , category]) => category),
    ["people", "posts", "talks", "videos", "music", "games", "media"],
  )
  assert.equal(disclosures.length, 7)
  assert.equal(disclosures.filter(([attributes]) => /\bopen\b/.test(attributes)).length, 1)
  assert.match(disclosures[0][1], /\bopen\b/)
  assert.equal((html.match(/<summary\b[^>]*data-inspiration-summary/g) ?? []).length, 7)
  assert.equal((html.match(/name="inspiration-categories"/g) ?? []).length, 7)
  assert.equal((html.match(/data-inspiration-count/g) ?? []).length, 7)

  for (const category of ["people", "posts", "talks", "videos", "music", "games", "media"]) {
    assert.match(html, new RegExp(`id="inspiration-${category}"`))
  }

  assert.match(css, /\.inspiration-category\s*>\s*summary\s*\{[^}]*cursor:\s*pointer;/)
  assert.match(css, /\.inspiration-category\[open\]\s+\.inspiration-disclosure-icon/)
})

test("Inspirations preserves curated ordering with optional alphabetical sorting", () => {
  assert.match(html, /data-inspiration-controls/)
  assert.doesNotMatch(html, /data-inspiration-category-filter/)
  assert.doesNotMatch(html, />Show</)

  assert.match(html, /<select[^>]*data-inspiration-sort/)
  assert.match(html, /<option value="curated"[^>]*>Curated<\/option>/)
  assert.match(html, /<option value="az"[^>]*>A–Z<\/option>/)
  assert.match(html, /<option value="za"[^>]*>Z–A<\/option>/)
  assert.match(html, /data-inspiration-status[^>]*>\s*58 entries · Curated order\s*</)
  assert.equal((html.match(/data-inspiration-title=/g) ?? []).length, 58)
  assert.equal((html.match(/data-curated-index=/g) ?? []).length, 58)
})

test("Every linked inspiration is an explicit safe outbound action", () => {
  const items = [...html.matchAll(/<li[^>]*data-inspiration-item[^>]*>(.*?)<\/li>/g)].map(
    (match) => match[1],
  )
  const linkedItems = items.filter((item) => item.includes("<a "))

  assert.equal(linkedItems.length, 39)
  for (const item of linkedItems) {
    assert.match(item, /target="_blank"/)
    assert.match(item, /rel="noopener noreferrer"/)
  }
})

test("Inspirations frames the collection around perspective and intentional action", () => {
  assert.match(
    html,
    /A living collection of people, ideas, and media that have shaped how I understand, create, and choose\./,
  )
  assert.match(
    html,
    /Media lets us borrow another perspective\. I keep what helps me see more clearly, act with intention, and move one thing forward\./,
  )
  assert.doesNotMatch(html, /Kana Akatsuki/)
  assert.doesNotMatch(html, /Violet Evergarden Ever After/)
  assert.doesNotMatch(html, /more organized in the future/i)
  assert.doesNotMatch(html, /I promise/i)
})
