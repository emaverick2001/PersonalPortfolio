import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const readRepositoryFile = (path) =>
  readFile(new URL(`../../${path}`, import.meta.url), "utf8").catch(() => "")

const [verification, staging, production, packageSource] = await Promise.all([
  readRepositoryFile(".github/workflows/verify-portfolio.yml"),
  readRepositoryFile(".github/workflows/stage-portfolio.yml"),
  readRepositoryFile(".github/workflows/deploy.yml"),
  readRepositoryFile("frontend/package.json"),
])

test("verification is read-only and runs the frozen release contract", () => {
  assert.match(verification, /pull_request:/)
  assert.match(verification, /push:[\s\S]*codex\/\*\*/)
  assert.match(verification, /workflow_dispatch:/)
  assert.match(verification, /permissions:\s*\n\s*contents: read/)
  assert.match(verification, /PUBLIC_SITE_ENV: production/)
  assert.match(verification, /PUBLIC_ANALYTICS_ENABLED: ["']?false["']?/)
  assert.match(verification, /pnpm run verify/)
  assert.doesNotMatch(
    verification,
    /secrets\.|cloudflare|pages: write|id-token: write|upload-pages-artifact|deploy-pages/i,
  )
})

test("staging is manual, exact-SHA, private-build oriented, and analytics-disabled", () => {
  assert.match(staging, /workflow_dispatch:/)
  assert.doesNotMatch(staging, /\n\s+(push|pull_request):/)
  assert.match(staging, /commit_sha:[\s\S]*required: true/)
  assert.match(staging, /\^\[0-9a-f\]\{40\}\$/)
  assert.match(staging, /ref: \$\{\{ inputs\.commit_sha \}\}/)
  assert.match(staging, /git rev-parse HEAD/)
  assert.match(staging, /PUBLIC_SITE_ENV: staging/)
  assert.match(staging, /PUBLIC_ANALYTICS_ENABLED: ["']?false["']?/)
  assert.match(staging, /pnpm run verify/)
  assert.match(staging, /cloudflare\/wrangler-action@v4/)
  assert.match(staging, /CLOUDFLARE_ACCOUNT_ID/)
  assert.match(staging, /CLOUDFLARE_API_TOKEN/)
  assert.match(staging, /CLOUDFLARE_PAGES_PROJECT/)
  assert.match(staging, /--branch=review-\$\{\{ inputs\.commit_sha \}\}/)
  assert.match(staging, /deployment-url/)
  assert.match(staging, /pages-deployment-alias-url/)
})

test("production is manual-only and promotes exactly the staged SHA", () => {
  assert.match(production, /workflow_dispatch:/)
  assert.doesNotMatch(production, /\n\s+(push|pull_request):/)
  assert.match(production, /commit_sha:[\s\S]*required: true/)
  assert.match(production, /staged_sha:[\s\S]*required: true/)
  assert.match(production, /enable_analytics:[\s\S]*type: boolean/)
  assert.match(production, /enable_analytics:[\s\S]*default: false/)
  assert.match(production, /\^\[0-9a-f\]\{40\}\$/)
  assert.match(production, /COMMIT_SHA[^\n]*!=[^\n]*STAGED_SHA/)
  assert.match(production, /ref: \$\{\{ inputs\.commit_sha \}\}/)
  assert.match(production, /git rev-parse HEAD/)
  assert.match(production, /PUBLIC_SITE_ENV: production/)
  assert.match(production, /PUBLIC_ANALYTICS_ENABLED:[^\n]*inputs\.enable_analytics/)
  assert.match(production, /pnpm run verify/)
  assert.match(production, /actions\/upload-pages-artifact@v4/)
  assert.match(production, /actions\/deploy-pages@v4/)
})

test("every workflow pins Node, pnpm, and frozen dependency installation", () => {
  for (const workflow of [verification, staging, production]) {
    assert.match(workflow, /node-version: ["']?22["']?/)
    assert.match(workflow, /pnpm\/action-setup@v4/)
    assert.match(workflow, /version: 10\.20\.0/)
    assert.match(workflow, /pnpm install --frozen-lockfile/)
  }
})

test("package scripts expose the supported tests and non-mutating verification", () => {
  const packageJson = JSON.parse(packageSource)
  assert.match(packageJson.scripts.test, /node --test scripts\/\*\.test\.mjs/)
  assert.match(packageJson.scripts.test, /scripts\/test-about-audio\.mjs/)
  assert.match(packageJson.scripts.test, /scripts\/test-vine-growth\.mjs/)
  assert.match(packageJson.scripts.verify, /pnpm run build/)
  assert.match(packageJson.scripts.verify, /pnpm run test/)
  assert.match(packageJson.scripts.verify, /pnpm run typecheck/)
  assert.doesNotMatch(packageJson.scripts.verify, /lint/)
})
