import test from "node:test"
import assert from "node:assert/strict"
import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"

async function findHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const paths = await Promise.all(entries.map(async entry => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? findHtmlFiles(path) : entry.name.endsWith(".html") ? [path] : []
  }))
  return paths.flat()
}

function metaContent(html, name) {
  return html.match(new RegExp(`<meta name=["']${name}["'] content=["']([^"']+)["']\\s*\\/?`))?.[1]
}

const htmlFiles = await findHtmlFiles("dist")
const pages = await Promise.all(htmlFiles.map(async path => ({ path, html: await readFile(path, "utf8") })))

test("every built page exposes one valid release environment", () => {
  assert.ok(pages.length > 0, "the release build should contain HTML pages")

  const environments = new Set(pages.map(({ path, html }) => {
    const environment = metaContent(html, "portfolio-environment")
    assert.match(environment ?? "", /^(production|staging)$/, `${path} should expose a valid environment`)
    return environment
  }))

  assert.equal(environments.size, 1, "one build must not mix release environments")
})

test("the built release environment applies one private-indexing and analytics boundary", () => {
  const environment = metaContent(pages[0].html, "portfolio-environment")
  const analyticsExpected = environment === "production" && process.env.PUBLIC_ANALYTICS_ENABLED === "true"
    ? "enabled"
    : "disabled"

  for (const { path, html } of pages) {
    assert.equal(
      metaContent(html, "portfolio-analytics"),
      analyticsExpected,
      `${path} should expose the expected analytics state`,
    )

    if (environment === "staging") {
      const robotsDirectives = [...html.matchAll(/<meta name=["']robots["'] content=["']([^"']+)["']/g)]
        .map(match => match[1].replaceAll(" ", ""))
      assert.ok(
        robotsDirectives.some(content => content.includes("noindex") && content.includes("nofollow")),
        `${path} should prevent staging indexing and link following`,
      )
    }
  }
})

test("private portrait studies are absent from the release build", () => {
  for (const { path, html } of pages) {
    assert.doesNotMatch(html, /headshot-editorial-v[1-4]/, `${path} must not reference a private portrait`)
  }
})
