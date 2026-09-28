import test from "node:test"
import assert from "node:assert/strict"
import vm from "node:vm"
import { readdir, readFile } from "node:fs/promises"

const distRoot = new URL("../dist/", import.meta.url)

async function builtPages(directory = distRoot) {
  const entries = await readdir(directory, { withFileTypes: true })
  const pages = []

  for (const entry of entries) {
    const url = new URL(entry.name + (entry.isDirectory() ? "/" : ""), directory)
    if (entry.isDirectory()) pages.push(...await builtPages(url))
    if (entry.isFile() && entry.name.endsWith(".html")) pages.push(url)
  }

  return pages
}

function themeBootstrap(html, page) {
  const match = html.match(/<script[^>]*data-theme-bootstrap[^>]*>([\s\S]*?)<\/script>/)
  assert.ok(match, `${page} must include the shared theme bootstrap`)
  return match[1]
}

function runBootstrap(source, savedTheme, storageThrows = false) {
  let dark = false
  const classList = {
    add(name) { if (name === "dark") dark = true },
    remove(name) { if (name === "dark") dark = false },
    toggle(name, force) {
      if (name === "dark") dark = force === undefined ? !dark : Boolean(force)
    },
  }
  const localStorage = {
    getItem() {
      if (storageThrows) throw new Error("storage unavailable")
      return savedTheme
    },
  }
  const matchMedia = () => ({ matches: false })

  vm.runInNewContext(source, {
    document: { documentElement: { classList } },
    localStorage,
    matchMedia,
    window: { matchMedia },
  })

  return dark
}

test("every built page defaults to Night while respecting an explicit choice", async () => {
  const pages = await builtPages()
  assert.ok(pages.length > 0, "expected a built site")

  for (const page of pages) {
    const source = themeBootstrap(await readFile(page, "utf8"), page.pathname)
    assert.equal(runBootstrap(source, null), true, `${page.pathname} first visit`)
    assert.equal(runBootstrap(source, "light"), false, `${page.pathname} saved Day`)
    assert.equal(runBootstrap(source, "dark"), true, `${page.pathname} saved Night`)
    assert.equal(runBootstrap(source, null, true), true, `${page.pathname} unavailable storage`)
  }
})
