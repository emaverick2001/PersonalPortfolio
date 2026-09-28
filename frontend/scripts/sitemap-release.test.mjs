import test from "node:test"
import assert from "node:assert/strict"
import { access, readFile } from "node:fs/promises"

const canonicalOrigin = "https://maverickespinosa.com"
const releasedRoutes = [
  "/about/",
  "/projects/",
  "/research/",
  "/blog/",
  "/music/",
  "/inspirations/",
  "/personal/",
  "/background/",
  "/resume/",
  "/projects/symbiotic-swe/",
  "/projects/molecule-generation-with-rl/",
  "/projects/semantic-aware-kv-cache-eviction/",
  "/projects/pure-data-synthesizer--visualizer/",
]
const previewRoutes = [
  "/preview/",
  "/about-preview/",
  "/work-preview/",
  "/synthesizer-preview/",
]

test("robots advertises only the canonical generated sitemap index", async () => {
  const robots = await readFile("public/robots.txt", "utf8")
  const sitemapDirectives = robots
    .split("\n")
    .filter((line) => line.trim().toLowerCase().startsWith("sitemap:"))

  assert.deepEqual(sitemapDirectives, [
    `Sitemap: ${canonicalOrigin}/sitemap-index.xml`,
  ])
  await assert.rejects(access("public/sitemap.xml"), { code: "ENOENT" })
})

test("generated sitemap publishes released routes and excludes previews", async () => {
  const index = await readFile("dist/sitemap-index.xml", "utf8")
  const generated = await readFile("dist/sitemap-0.xml", "utf8")

  assert.equal((index.match(/<sitemap>/g) ?? []).length, 1)
  assert.match(index, new RegExp(`${canonicalOrigin}/sitemap-0\\.xml`))

  for (const route of releasedRoutes) {
    assert.match(generated, new RegExp(`<loc>${canonicalOrigin}${route}</loc>`))
  }

  for (const route of previewRoutes) {
    assert.doesNotMatch(generated, new RegExp(`<loc>${canonicalOrigin}${route}</loc>`))
  }
})
