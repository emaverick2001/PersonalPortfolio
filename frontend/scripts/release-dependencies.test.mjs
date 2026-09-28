import test from "node:test"
import assert from "node:assert/strict"
import { access, readFile } from "node:fs/promises"
import { spawnSync } from "node:child_process"
import { resolve } from "node:path"

const repositoryRoot = resolve("..")
const packageJson = JSON.parse(await readFile("package.json", "utf8"))

test("the frontend declares the release package-manager version", () => {
  assert.equal(packageJson.packageManager, "pnpm@10.20.0")
})

test("the release lockfile is eligible for version control", () => {
  const ignored = spawnSync(
    "git",
    ["check-ignore", "-q", "--", "frontend/pnpm-lock.yaml"],
    { cwd: repositoryRoot },
  )

  assert.notEqual(ignored.status, 0, "frontend/pnpm-lock.yaml must not be ignored")
})

test("the frontend has a pnpm lockfile", async () => {
  await access("pnpm-lock.yaml")
})
