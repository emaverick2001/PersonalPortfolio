import test from "node:test"
import assert from "node:assert/strict"
import { readdir, readFile } from "node:fs/promises"

const stylesDirectory = new URL("../src/styles/", import.meta.url)
const styleFiles = (await readdir(stylesDirectory)).filter(file => file.endsWith(".css"))
const styles = (
  await Promise.all(styleFiles.map(file => readFile(new URL(file, stylesDirectory), "utf8")))
).join("\n")

const definedTokens = new Set(
  [...styles.matchAll(/(--[a-zA-Z0-9_-]+)\s*:/g)].map(match => match[1]),
)
const referencedTokens = new Set(
  [...styles.matchAll(/var\(\s*(--[a-zA-Z0-9_-]+)/g)].map(match => match[1]),
)

// These values are deliberately supplied at runtime by the growth and work renderers.
const runtimeTokens = new Set(["--metric", "--vine-anchor-x", "--vine-window"])

test("every stylesheet custom property is defined or deliberately runtime-driven", () => {
  const undefinedTokens = [...referencedTokens]
    .filter(token => !definedTokens.has(token) && !runtimeTokens.has(token))
    .sort()

  assert.deepEqual(undefinedTokens, [])
})
