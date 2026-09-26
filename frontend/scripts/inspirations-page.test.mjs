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

test("Inspirations offers a compact index with live category counts", () => {
  const indexEntries = [...html.matchAll(/data-inspiration-index="([^"]+)"[^>]*>[\s\S]*?<span[^>]*data-inspiration-count>(\d+)<\/span>/g)]

  assert.deepEqual(
    indexEntries.map(([, category, count]) => [category, Number(count)]),
    [
      ["people", 11],
      ["posts", 11],
      ["talks", 7],
      ["videos", 1],
      ["music", 9],
      ["games", 1],
      ["media", 18],
    ],
  )

  for (const category of ["people", "posts", "talks", "videos", "music", "games", "media"]) {
    assert.match(html, new RegExp(`href="#inspiration-${category}"`))
  }

  assert.match(css, /\.inspirations-category-index a > span\s*\{[^}]*display:\s*block;/)
})

test("Inspirations provides category filtering and three explicit sort modes", () => {
  assert.match(html, /data-inspiration-controls/)
  assert.match(html, /<select[^>]*data-inspiration-category-filter/)
  assert.match(html, /<option value="all"[^>]*>All categories<\/option>/)

  for (const category of ["people", "posts", "talks", "videos", "music", "games", "media"]) {
    assert.match(html, new RegExp(`<option value="${category}"`))
  }

  assert.match(html, /<select[^>]*data-inspiration-sort/)
  assert.match(html, /<option value="curated"[^>]*>Curated<\/option>/)
  assert.match(html, /<option value="az"[^>]*>A–Z<\/option>/)
  assert.match(html, /<option value="za"[^>]*>Z–A<\/option>/)
  assert.match(html, /data-inspiration-status[^>]*>\s*58 entries · Curated order\s*</)
  assert.equal((html.match(/data-inspiration-title=/g) ?? []).length, 58)
  assert.equal((html.match(/data-curated-index=/g) ?? []).length, 58)
  assert.match(css, /\.inspiration-category\[hidden\]\s*\{[^}]*display:\s*none;/)
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
