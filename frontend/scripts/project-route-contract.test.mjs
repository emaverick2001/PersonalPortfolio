import test from "node:test"
import assert from "node:assert/strict"
import { access, readFile } from "node:fs/promises"

const releasedRoutes = [
  "dist/projects/index.html",
  "dist/projects/symbiotic-swe/index.html",
  "dist/projects/molecule-generation-with-rl/index.html",
  "dist/projects/semantic-aware-kv-cache-eviction/index.html",
  "dist/projects/pure-data-synthesizer--visualizer/index.html",
]

const omittedSlugs = [
  "pactspace",
  "cpcr-datacatalog",
  "ctr-analysis",
  "ai-policy-web-crawler",
  "phi-redactor",
  "visual-score",
  "music-recommendation-system",
]

async function exists(path) {
  try {
    await access(path)
    return true
  } catch (error) {
    if (error?.code === "ENOENT") return false
    throw error
  }
}

test("the built Work routes expose only the curated index and four reviewed case studies", async () => {
  for (const route of releasedRoutes) {
    assert.equal(await exists(route), true, `${route} should remain publicly available`)
  }

  for (const slug of omittedSlugs) {
    assert.equal(
      await exists(`dist/projects/${slug}/index.html`),
      false,
      `/projects/${slug}/ should not be generated`,
    )
  }
})

test("the sitemaps expose the reviewed case studies and no omitted legacy project route", async () => {
  const sitemapOutput = await readFile("dist/sitemap-0.xml", "utf8")

  for (const slug of ["symbiotic-swe", "semantic-aware-kv-cache-eviction"]) {
    assert.match(sitemapOutput, new RegExp(`/projects/${slug}/`))
  }

  for (const slug of omittedSlugs) {
    assert.doesNotMatch(sitemapOutput, new RegExp(`/projects/${slug}/`))
  }
})
