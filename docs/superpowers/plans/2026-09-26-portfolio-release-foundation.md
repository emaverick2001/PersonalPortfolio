# Portfolio Release Foundation Implementation Plan

> **Sequence notice:** The approved `2026-09-26-recruiter-ready-portfolio-v1-design.md` adds a content, resume, and project-completion phase before this infrastructure plan. Do not execute this plan against the earlier page candidate. Execute the recruiter-ready plan first, then revise this plan's starting SHA, file inventory, test totals, and packaging steps against the approved final content candidate.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the reviewed local portfolio into a deterministic release candidate whose verification, authenticated staging, and public deployment are separate exact-SHA operations.

**Architecture:** Preserve and package the approved redesign first, then pin the frontend dependency graph, add one build-time release-environment contract, and replace push-to-production with read-only verification plus manual staging and production workflows. Production analytics remain disabled for the first release; the existing seven-event contract stays in source for a later separately approved activation.

**Tech Stack:** Astro 5, TypeScript, pnpm 10.20.0, Node 22 in CI, Node's test runner, GitHub Actions, GitHub Pages, Cloudflare Pages Direct Upload, Wrangler.

**Spec:** `docs/superpowers/specs/2026-09-26-private-staging-release-gate-design.md`

## Global Constraints

- Preserve the current `codex/portfolio-release-candidate` branch and every user-owned change; do not reset, clean, stash, rebase, pull, or overwrite.
- Keep GitHub Pages as the only production host and Cloudflare Pages as preview-only infrastructure.
- A normal push or merge must not publish production.
- Staging and production must both check out and verify an explicitly supplied full commit SHA.
- The first production release must build with analytics disabled.
- Staging must emit `noindex, nofollow` on every HTML page and must not initialize PostHog.
- Generated headshot versions 1–4 remain in `.private-review/headshots/`, ignored by Git and absent from every build.
- Do not add Cloudflare Web Analytics, session replay, form capture, visitor-input persistence, or another data collector.
- Do not redesign pages, clean legacy resources, update résumé content, expand project case studies, or resume Daily Focus Coach implementation.
- Staging account creation, secrets, push, pull request, merge, staging dispatch, and production dispatch remain separate approval gates.

## Review Focus

- An omitted or invalid `PUBLIC_SITE_ENV` must not silently create an indexable staging build; release workflows always supply an allowed value and tests reject any other value.
- `PUBLIC_ANALYTICS_ENABLED=true` must still fail to initialize analytics unless the build is `production`, the hostname is exactly `maverickespinosa.com`, and the route is not a preview route.
- Preview routes must remain `noindex` in production, while every route becomes `noindex, nofollow` in staging.
- Workflow inputs must reject a short, missing, nonexistent, or mismatched SHA before build or upload.
- The deploy workflow must have no `push` trigger, and the verification workflow must have no deployment credentials or write permissions.

---

### Task 1: Close portrait review and package the approved page slice

**Files:**
- Modify: `docs/release-session-2026-09-25.md`
- Stage exactly the currently reviewed modified and untracked Personal, Background, Inspirations, Music, Blog, navigation, sitemap, tests, styles, `.gitignore`, and release-log paths reported by `git status --short`
- Verify but never stage: `.private-review/headshots/headshot-editorial-v1.png` through `headshot-editorial-v4.png`

**Interfaces:**
- Consumes: the current dirty working tree at `492fcbf220ebad17b2c241ca5da94918ae1cb8c8` on `codex/portfolio-release-candidate`.
- Produces: one reviewed local commit containing the final page slice and an explicit record that the first release has no generated headshot.

- [ ] **Step 1: Re-run the repository preflight**

Run `git branch --show-current`, `git rev-parse HEAD`, `git status --short`, `git diff --name-status`, and `git diff --check` from the repository root.

Expected: branch is `codex/portfolio-release-candidate`; HEAD is still the observed starting commit or any drift is classified before proceeding; no private portrait is tracked.

- [ ] **Step 2: Record the portrait decision**

Append a factual correction to Task 17 in `docs/release-session-2026-09-25.md`: generated portraits 1–4 were useful composition studies but were rejected as final identity representations; the release proceeds without a headshot; all versions remain private and unintegrated.

- [ ] **Step 3: Run the complete local release baseline**

Run from `frontend/`:

```sh
npm run build
node --test scripts/*.test.mjs scripts/test-about-audio.mjs scripts/test-vine-growth.mjs
npm run typecheck
```

Then run `git diff --check` from the repository root.

Expected: build exits 0, all 55 currently supported tests pass, type checking exits 0, and the diff check is empty. Report the optional undeclared `@napi-rs/canvas` renderer screenshot test as excluded rather than installing it.

- [ ] **Step 4: Stage exact reviewed paths and inspect the staged diff**

Use explicit `git add <path>` arguments for the preflight inventory; never use `git add .` or `git add -A`. Run `git diff --cached --name-status`, `git diff --cached --stat`, and `git diff --cached --check`.

Expected: staged content contains only the reviewed page slice, tests, `.gitignore`, and the release log; `.private-review/` is absent.

- [ ] **Step 5: Commit the reviewed page slice after the explicit commit gate**

```sh
git commit -m "feat: finish portfolio release candidate"
```

Expected: commit succeeds without bypassing privacy, secret, lint, type, or commit-message hooks. If the known artwork-size hook applies only to already reviewed assets, preserve the previously documented exception and bypass only that hook.

---

### Task 2: Pin the frontend dependency graph

**Files:**
- Modify: `.gitignore`
- Modify: `frontend/package.json`
- Create: `frontend/pnpm-lock.yaml`

**Interfaces:**
- Consumes: pnpm 10.20.0 and the existing frontend dependency declarations.
- Produces: `packageManager: "pnpm@10.20.0"` and a committed lockfile accepted by `pnpm install --frozen-lockfile`.

- [ ] **Step 1: Write a failing dependency-contract test**

Create `frontend/scripts/release-dependencies.test.mjs` with assertions that `frontend/package.json` declares `pnpm@10.20.0`, `.gitignore` does not ignore `pnpm-lock.yaml`, and `frontend/pnpm-lock.yaml` exists.

- [ ] **Step 2: Run the focused test and verify it fails**

Run `node --test scripts/release-dependencies.test.mjs` from `frontend/`.

Expected: FAIL because the package manager is undeclared and the lockfile is ignored and absent.

- [ ] **Step 3: Add the deterministic dependency contract**

Remove only `pnpm-lock.yaml` from `.gitignore`, add `"packageManager": "pnpm@10.20.0"` to `frontend/package.json`, and generate `frontend/pnpm-lock.yaml` using pnpm 10.20.0 without changing declared dependency ranges.

- [ ] **Step 4: Verify frozen installation and the focused test**

Run from `frontend/`:

```sh
pnpm install --frozen-lockfile
node --test scripts/release-dependencies.test.mjs
pnpm run build
```

Expected: frozen install, focused test, and build all exit 0.

- [ ] **Step 5: Commit deterministic dependencies after the explicit commit gate**

```sh
git add .gitignore frontend/package.json frontend/pnpm-lock.yaml frontend/scripts/release-dependencies.test.mjs
git commit -m "build: pin portfolio dependencies"
```

---

### Task 3: Add the build-time environment and analytics gate

**Files:**
- Create: `frontend/src/components/ReleaseMetadata.astro`
- Modify: `frontend/src/components/PostHog.astro`
- Modify: `frontend/src/utils/analytics.ts`
- Modify: `frontend/src/env.d.ts`
- Modify: `frontend/src/components/GrowthHomepage.astro`
- Modify: `frontend/src/components/GrowthAbout.astro`
- Modify: `frontend/src/components/GrowthPage.astro`
- Modify: `frontend/src/components/GrowthResearch.astro`
- Modify: `frontend/src/components/GrowthBlogIndex.astro`
- Modify: `frontend/src/components/GrowthBlogArticle.astro`
- Modify: `frontend/src/components/GrowthMusic.astro`
- Modify: `frontend/src/components/GrowthInspirations.astro`
- Modify: `frontend/src/components/GrowthResume.astro`
- Modify: `frontend/src/components/GrowthPersonal.astro`
- Modify: `frontend/src/components/GrowthBackground.astro`
- Modify: `frontend/src/layouts/SiteLayout.astro`
- Modify: `frontend/scripts/analytics-contract.test.mjs`
- Create: `frontend/scripts/release-environment.test.mjs`

**Interfaces:**
- Consumes: `PUBLIC_SITE_ENV` with allowed values `production | staging`, defaulting to `production` only for ordinary local development; `PUBLIC_ANALYTICS_ENABLED` with exact enabled value `true`.
- Produces: `<meta name="portfolio-environment" content="production|staging">`, `<meta name="portfolio-analytics" content="enabled|disabled">`, staging robots metadata on every page, and `shouldEnableAnalytics(location, environment, enabled)`.

- [ ] **Step 1: Write failing environment and analytics tests**

Add assertions that every built HTML page exposes the environment marker; every staging page contains `noindex, nofollow`; a staging build reports analytics disabled; and `shouldEnableAnalytics` returns true only for the production environment, explicit analytics enablement, canonical hostname, and non-preview routes. Include invalid environment, canonical preview route, localhost, Cloudflare hostname, and Do Not Track-preserving configuration cases.

- [ ] **Step 2: Run the focused tests and verify they fail**

Run `node --test scripts/release-environment.test.mjs scripts/analytics-contract.test.mjs` from `frontend/`.

Expected: FAIL because release metadata and the environment argument do not exist.

- [ ] **Step 3: Implement `ReleaseMetadata.astro` and add it to every document head**

The component validates the two allowed environment values, emits the environment and analytics markers, and emits `noindex, nofollow` for staging. Preserve each preview route's existing production `noindex` behavior.

- [ ] **Step 4: Strengthen `shouldEnableAnalytics`**

Change its interface to require the build environment and explicit enablement in addition to the existing exact-host and preview-route checks. Read those values from the release metadata in `PostHog.astro`. Do not change the seven-event allowlist or add any event/property.

- [ ] **Step 5: Verify staging and production builds separately**

Run from `frontend/`:

```sh
PUBLIC_SITE_ENV=staging PUBLIC_ANALYTICS_ENABLED=false pnpm run build
node --test scripts/release-environment.test.mjs scripts/analytics-contract.test.mjs
PUBLIC_SITE_ENV=production PUBLIC_ANALYTICS_ENABLED=false pnpm run build
node --test scripts/release-environment.test.mjs scripts/analytics-contract.test.mjs
```

Expected: both builds and focused tests pass; staging output is universally `noindex, nofollow`; the initial production output reports analytics disabled; no private portrait exists in `dist/`.

- [ ] **Step 6: Commit the environment boundary after the explicit commit gate**

Stage only the files listed in this task and commit:

```sh
git commit -m "feat: add explicit release environments"
```

---

### Task 4: Correct the production sitemap contract

**Files:**
- Modify: `frontend/public/robots.txt`
- Delete: `frontend/public/sitemap.xml`
- Modify: `frontend/astro.config.mjs`
- Create: `frontend/scripts/sitemap-release.test.mjs`

**Interfaces:**
- Consumes: `@astrojs/sitemap` output and the canonical apex domain `https://maverickespinosa.com`.
- Produces: one generated `sitemap-index.xml` referenced by robots, with all production routes and no preview routes.

- [ ] **Step 1: Write a failing sitemap release test**

Assert that `robots.txt` references `https://maverickespinosa.com/sitemap-index.xml`, the generated sitemap contains About, Work, Research, Blog, Music, Inspirations, Personal, Background, Resume, and released project routes, and it excludes the four preview routes.

- [ ] **Step 2: Run the focused test and verify it fails**

Run `node --test scripts/sitemap-release.test.mjs` from `frontend/`.

Expected: FAIL because robots points at the `www` static sitemap and that sitemap is incomplete.

- [ ] **Step 3: Remove the competing static sitemap and point robots at generated output**

Delete only `frontend/public/sitemap.xml`, update `frontend/public/robots.txt`, and retain the existing Astro preview-route filter.

- [ ] **Step 4: Build and verify the generated sitemap**

Run `PUBLIC_SITE_ENV=production PUBLIC_ANALYTICS_ENABLED=false pnpm run build && node --test scripts/sitemap-release.test.mjs`.

Expected: PASS with one canonical apex sitemap index and no preview entries.

- [ ] **Step 5: Commit the sitemap correction after the explicit commit gate**

```sh
git add frontend/public/robots.txt frontend/astro.config.mjs frontend/scripts/sitemap-release.test.mjs
git add -u frontend/public/sitemap.xml
git commit -m "fix: align production sitemap discovery"
```

---

### Task 5: Separate verification, staging, and production workflows

**Files:**
- Create: `.github/workflows/verify-portfolio.yml`
- Create: `.github/workflows/stage-portfolio.yml`
- Modify: `.github/workflows/deploy.yml`
- Modify: `frontend/package.json`
- Create: `frontend/scripts/release-workflows.test.mjs`

**Interfaces:**
- Consumes: required `commit_sha` workflow input; production also consumes required `staged_sha` and optional boolean `enable_analytics` defaulting to `false`; secrets `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`; repository variable `CLOUDFLARE_PAGES_PROJECT=maverick-portfolio-staging`.
- Produces: read-only CI; manual preview deployment to branch `review-<full-sha>`; manual GitHub Pages production deployment only when `commit_sha == staged_sha`.

- [ ] **Step 1: Write failing workflow-contract tests**

Assert that production has no `push` trigger; all deployment workflows require full SHA inputs and validate checked-out HEAD; every install uses pnpm 10.20.0 and `--frozen-lockfile`; verification has `contents: read` only and references no Cloudflare/GitHub Pages deployment credentials; staging sets `PUBLIC_SITE_ENV=staging` and analytics false; production sets `PUBLIC_SITE_ENV=production`, defaults analytics false, and fails when `commit_sha` differs from `staged_sha`.

- [ ] **Step 2: Run the focused test and verify it fails**

Run `node --test scripts/release-workflows.test.mjs` from `frontend/`.

Expected: FAIL because CI/staging workflows do not exist and production still triggers on pushes to `master`.

- [ ] **Step 3: Add the reusable package scripts**

Add `test` for the supported Node test suite and `verify` for production build, supported tests, and type checking. Do not make lint auto-fix part of CI.

- [ ] **Step 4: Add read-only verification**

`verify-portfolio.yml` runs on pull requests to `master`, pushes to `codex/**`, and manual dispatch. It uses Node 22, pnpm 10.20.0, frozen dependencies, `PUBLIC_SITE_ENV=production`, analytics false, and `pnpm run verify`; it has no deployment job or secret reference.

- [ ] **Step 5: Add manual exact-SHA staging**

`stage-portfolio.yml` uses `workflow_dispatch` only, requires a 40-character `commit_sha`, checks out that SHA, verifies `git rev-parse HEAD`, runs the full frozen verification with staging/analytics-disabled values, and invokes `cloudflare/wrangler-action@v4` with `pages deploy frontend/dist --project-name=${{ vars.CLOUDFLARE_PAGES_PROJECT }} --branch=review-${{ inputs.commit_sha }}`. Write the immutable URL and branch alias to the workflow summary without printing secrets.

- [ ] **Step 6: Make GitHub Pages production manual-only**

Remove the push trigger from `deploy.yml`. Require `commit_sha`, `staged_sha`, and `enable_analytics` inputs; reject mismatched SHAs; check out and verify the exact full SHA; run frozen verification; build production with the requested analytics flag, default false; upload `frontend/dist`; then deploy through the existing `github-pages` environment and summarize the deployed SHA.

- [ ] **Step 7: Run workflow, build, and regression contracts**

Run from `frontend/`:

```sh
node --test scripts/release-workflows.test.mjs scripts/release-environment.test.mjs scripts/analytics-contract.test.mjs
PUBLIC_SITE_ENV=production PUBLIC_ANALYTICS_ENABLED=false pnpm run verify
```

Then run `git diff --check` from the root.

Expected: all contracts and the complete 55+ supported regression suite pass, production has no automatic trigger, and the diff check is empty.

- [ ] **Step 8: Commit workflow separation after the explicit commit gate**

```sh
git add .github/workflows/verify-portfolio.yml .github/workflows/stage-portfolio.yml .github/workflows/deploy.yml frontend/package.json frontend/scripts/release-workflows.test.mjs
git commit -m "ci: separate staging from production release"
```

---

### Task 6: Produce the final local candidate evidence

**Files:**
- Modify: `docs/release-session-2026-09-25.md`

**Interfaces:**
- Consumes: the final local candidate HEAD and all Task 1–5 verification outputs.
- Produces: a reviewable exact-SHA handoff for the remote staging plan.

- [ ] **Step 1: Run the final branch audit**

Run branch/HEAD/status, `pnpm install --frozen-lockfile`, both staging and production-disabled-analytics builds, `pnpm run verify`, workflow tests, `git diff --check`, and a desktop/mobile local browser smoke check covering navigation, keyboard access, reduced motion, images, reversible growth, and local-only thought interaction.

- [ ] **Step 2: Append Result, Friction, and Next action**

Record the exact candidate SHA, test totals, build diagnostics, browser evidence, optional renderer-test exclusion, analytics-disabled state, private-headshot exclusion, and any unresolved issue. The next action must be remote review/push approval, not deployment.

- [ ] **Step 3: Commit only the evidence update after the explicit commit gate**

```sh
git add docs/release-session-2026-09-25.md
git commit -m "docs: record release foundation evidence"
```

- [ ] **Step 4: Stop for remote-operation approval**

Do not push, open a pull request, merge, create Cloudflare resources, add secrets, stage, or publish. Present the final SHA and exact remote operation sequence for approval.
