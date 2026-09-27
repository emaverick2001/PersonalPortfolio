import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const posts = [
  ["1x-speed", "Listen to content at 1x speed", "My mind moves at the speed of its input"],
  ["conjuring-tools", "Conjuring tools", "purpose-built tools"],
  ["modes-of-writing", "Modes of writing", "Unfocused, stream of consciousness writing"],
  ["use-the-wrong-tool", "Use the wrong tool for the job", "Earlier in my career"],
  ["sharpening-the-sword", "Sharpening the sword for a battle that never comes", "continuously getting stuck in a search for better tools"],
  ["typescript-never-array", "TypeScript's elusive never[] type", "But why would the array"],
]

const index = await readFile("dist/blog/index.html", "utf8")
const css = await readFile("src/styles/blog.css", "utf8")

test("Writing index uses the shared shell and preserves discovery controls", () => {
  assert.match(index, /class="[^"]*writing-index/)
  assert.match(index, /class="site-header"/)
  assert.match(index, /aria-current="page"[^>]*>Blog</)
  assert.match(index, /data-tag-filter-root/)
  assert.match(index, /data-pagination-root/)
  assert.equal((index.match(/<a\b[^>]*data-post-card(?:\s|=|>)/g) ?? []).length, posts.length)
})

test("Writing keeps the botanical page background authoritative in both themes", () => {
  assert.match(css, /body\.writing-page\s*\{[^}]*background:\s*var\(--paper\)/)
  assert.match(css, /body\.writing-page\s*\{[^}]*color:\s*var\(--ink\)/)
})

test("Writing cards visibly lift for pointer and keyboard focus without forcing motion", () => {
  assert.match(css, /\.writing-card:is\(:hover,\s*:focus-visible\)\s*\{[^}]*transform:\s*translateY\(-6px\)[^}]*box-shadow:/)
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.writing-card:is\(:hover,\s*:focus-visible\)\s*\{[^}]*transform:\s*none/)
})

test("Writing index keeps every post in newest-first order and features the newest", () => {
  const renderedSlugs = [...index.matchAll(/<a\b[^>]*href="\/blog\/([^/]+)\/"[^>]*data-post-card/g)].map(
    (match) => match[1],
  )
  assert.deepEqual(renderedSlugs, posts.map(([slug]) => slug))
  assert.match(index, /data-post-card[^>]*data-featured/)
})

test("Writing index ends with shared navigation without a promotional block", () => {
  assert.match(index, /<footer class="writing-footer">/)
  assert.match(index, /<nav class="portfolio-links" aria-label="Portfolio pages">/)
  assert.doesNotMatch(index, /Keep exploring/)
  assert.doesNotMatch(index, /Different forms/)
})

test("Every article keeps its content inside the shared reading layout", async () => {
  for (const [slug, title, marker] of posts) {
    const html = await readFile(`dist/blog/${slug}/index.html`, "utf8")
    assert.match(html, /class="site-header"/)
    assert.match(html, /class="[^"]*writing-article/)
    assert.match(html, /class="[^"]*article-body/)
    assert.match(html, /href="\/blog\/"[^>]*aria-current="page"/)
    assert.ok(html.includes(title.replaceAll("'", "&#39;")), `${title} should remain present`)
    assert.match(html, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"))
    assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1)
  }
})
