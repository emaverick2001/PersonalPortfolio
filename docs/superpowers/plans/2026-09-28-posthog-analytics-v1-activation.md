# PostHog Analytics v1 Activation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Activate the portfolio's existing seven-event analytics contract and deliver one verified private PostHog dashboard without adding instrumentation or weakening privacy.

**Architecture:** Keep the existing event code and PostHog configuration unchanged. Correct the rendered-output test so it recognizes staging-disabled, production-disabled, and production-enabled builds; then promote one exact reviewed SHA with the existing manual workflow and configure private PostHog insights from real captured events.

**Tech Stack:** Astro 5, TypeScript, Node test runner, pnpm 10.20.0, PostHog JS, PostHog Cloud, GitHub Actions, Cloudflare Pages authenticated staging, GitHub Pages production.

**Spec:** `docs/superpowers/specs/2026-09-28-posthog-analytics-v1-activation-design.md`

## Global Constraints

- Preserve the exact seven approved event names and their controlled properties.
- Do not modify `frontend/src/utils/analytics.ts` or `frontend/src/components/PostHog.astro` unless a failing contract proves the existing source violates the approved specification; if that occurs, stop for owner review.
- Keep cookieless capture, no person profiles, Do Not Track, IP discard, no autocapture, no replay, no heatmaps, and the existing final payload allowlist.
- Do not collect visitor input, raw referrers, query strings, hashes, coordinates, email addresses, arbitrary URLs, source attribution, location, section activity, recruiter intent, sessions, or retention.
- Keep analytics disabled on localhost, staging, Cloudflare preview hosts, and preview routes.
- Keep the PostHog dashboard private and do not embed it in the portfolio.
- Use exact-path staging. Commit, push, pull request, merge, staging, production activation, and evidence commit remain separate approval gates.
- Stop after dashboard verification and the Result / Friction / Next action record. Do not expand analytics or begin Daily Focus Coach work inside this branch.

## Review Focus

- `PUBLIC_SITE_ENV=staging` with `PUBLIC_ANALYTICS_ENABLED=true` must still render `portfolio-analytics=disabled` and `noindex, nofollow` on every page.
- `PUBLIC_SITE_ENV=production` with analytics false must remain a supported rollback build with `portfolio-analytics=disabled`.
- `PUBLIC_SITE_ENV=production` with analytics true must render `portfolio-analytics=enabled`, while `shouldEnableAnalytics` must still reject preview routes, localhost, invalid environments, and Cloudflare preview hosts.
- The enabled build must retain the exact seven-event and property allowlists, Do Not Track, cookieless mode, and every non-recording PostHog setting.
- An empty dashboard or empty insight must remain visibly empty; never substitute sample data, unique-person claims, sessions, retention, source attribution, or recruiter claims.

---

### Task 1: Reconcile the release-evidence prerequisite

**Files:**
- Read: `docs/release-session-2026-09-25.md`
- Read from approved branch: `codex/analytics-setup` commit `6f12bc98ea5272edbc5e66279b523c02557d9994`

**Interfaces:**
- Consumes: the production-release evidence recorded as Tasks 27 and 28 on `codex/analytics-setup`.
- Produces: a branch baseline whose release log ends with Task 28 before analytics activation evidence is appended.

- [ ] **Step 1: Inspect the current execution branch and release log**

Run:

```bash
git status --short --branch
git rev-parse HEAD
tail -n 80 docs/release-session-2026-09-25.md
```

Expected: clean worktree; the exact branch and SHA are recorded. If the log ends at Task 26, continue to Step 2 without editing it.

- [ ] **Step 2: Confirm the approved release-record commit remains available**

Run:

```bash
git show --stat --oneline 6f12bc98ea5272edbc5e66279b523c02557d9994
```

Expected: the approved two-file production-release evidence commit is readable.

- [ ] **Step 3: Stop at the release-record integration gate when Task 28 is absent**

Request separate approval to open and merge the already-pushed `codex/analytics-setup` release-record branch. Do not cherry-pick, merge, rebase, copy its log entries, or append a new activation entry on top of Task 26 without that approval.

- [ ] **Step 4: Recheck the post-integration baseline**

After the approved release-record integration and a separately approved clean analytics branch/worktree refresh, rerun Step 1.

Expected: the release log ends with Task 28 and the working tree is clean before implementation begins.

### Task 2: Correct the three-state rendered-output contract

**Files:**
- Modify: `frontend/scripts/release-environment.test.mjs:34-49`
- Test: `frontend/scripts/release-environment.test.mjs`
- Test: `frontend/scripts/analytics-contract.test.mjs`
- Test: `frontend/scripts/release-workflows.test.mjs`

**Interfaces:**
- Consumes: `portfolio-environment` and `portfolio-analytics` metadata emitted by the existing build.
- Produces: a rendered-output assertion whose expected analytics value is `enabled` only when the built environment is `production` and `PUBLIC_ANALYTICS_ENABLED` is exactly `true`.

- [ ] **Step 1: Install the committed dependency graph**

Run from `frontend/`:

```bash
CI=true pnpm install --frozen-lockfile
```

Expected: the committed lockfile is accepted without modifying `package.json` or `pnpm-lock.yaml`.

- [ ] **Step 2: Reproduce the current enabled-production failure**

Run from `frontend/`:

```bash
PUBLIC_SITE_ENV=production PUBLIC_ANALYTICS_ENABLED=true pnpm run build
PUBLIC_SITE_ENV=production PUBLIC_ANALYTICS_ENABLED=true node --test scripts/release-environment.test.mjs
```

Expected: the build succeeds and the test fails because the current assertion requires `portfolio-analytics=disabled` even though the production-enabled build emits `enabled`.

- [ ] **Step 3: Update the expected rendered analytics state**

In `release-environment.test.mjs`, derive one expected value before the page loop:

```js
const analyticsExpected = environment === "production" && process.env.PUBLIC_ANALYTICS_ENABLED === "true"
  ? "enabled"
  : "disabled"
```

Assert that every built page's `portfolio-analytics` metadata equals `analyticsExpected`. Preserve the existing single-environment, staging robots, and private-portrait assertions.

- [ ] **Step 4: Verify accidental staging enablement remains disabled**

Run from `frontend/`:

```bash
PUBLIC_SITE_ENV=staging PUBLIC_ANALYTICS_ENABLED=true pnpm run build
PUBLIC_SITE_ENV=staging PUBLIC_ANALYTICS_ENABLED=true node --test scripts/release-environment.test.mjs scripts/analytics-contract.test.mjs scripts/release-workflows.test.mjs
```

Expected: PASS; every HTML page reports staging and analytics disabled, every page contains `noindex, nofollow`, and the runtime/workflow contracts remain green.

- [ ] **Step 5: Verify the rollback production state**

Run from `frontend/`:

```bash
PUBLIC_SITE_ENV=production PUBLIC_ANALYTICS_ENABLED=false pnpm run build
PUBLIC_SITE_ENV=production PUBLIC_ANALYTICS_ENABLED=false node --test scripts/release-environment.test.mjs scripts/analytics-contract.test.mjs scripts/release-workflows.test.mjs
```

Expected: PASS; every HTML page reports production and analytics disabled.

- [ ] **Step 6: Verify the enabled production state**

Run from `frontend/`:

```bash
PUBLIC_SITE_ENV=production PUBLIC_ANALYTICS_ENABLED=true pnpm run build
PUBLIC_SITE_ENV=production PUBLIC_ANALYTICS_ENABLED=true node --test scripts/release-environment.test.mjs scripts/analytics-contract.test.mjs scripts/release-workflows.test.mjs
```

Expected: PASS; every HTML page reports production and analytics enabled, while the runtime test still rejects preview routes, localhost, invalid environments, disabled production, and Cloudflare preview hosts.

- [ ] **Step 7: Review the exact implementation diff**

Run:

```bash
git diff --check
git diff -- frontend/scripts/release-environment.test.mjs
git status --short
```

Expected: one modified test file and no generated build output or dependency files.

- [ ] **Step 8: Stop for the implementation commit gate**

After owner approval, stage only `frontend/scripts/release-environment.test.mjs` and commit with:

```bash
git add -- frontend/scripts/release-environment.test.mjs
git commit -m "test: permit approved production analytics"
```

Do not push during this step.

### Task 3: Run the complete local release matrix

**Files:**
- Read: `frontend/package.json`
- Read: `frontend/dist/`

**Interfaces:**
- Consumes: Task 2's three-state contract.
- Produces: complete build, regression, TypeScript, and rendered-output evidence for staging-disabled, production-disabled, and production-enabled states.

- [ ] **Step 1: Run complete staging verification**

Run from `frontend/`:

```bash
PUBLIC_SITE_ENV=staging PUBLIC_ANALYTICS_ENABLED=false pnpm run verify
```

Expected: Astro check/build, the complete Node test suite, and TypeScript all pass; rendered pages report staging and analytics disabled.

- [ ] **Step 2: Run complete production-disabled verification**

Run from `frontend/`:

```bash
PUBLIC_SITE_ENV=production PUBLIC_ANALYTICS_ENABLED=false pnpm run verify
```

Expected: the complete supported suite passes; rendered pages report production and analytics disabled.

- [ ] **Step 3: Run complete production-enabled verification**

Run from `frontend/`:

```bash
PUBLIC_SITE_ENV=production PUBLIC_ANALYTICS_ENABLED=true pnpm run verify
```

Expected: the complete supported suite passes; rendered pages report production and analytics enabled; the seven-event and privacy contracts remain unchanged.

- [ ] **Step 4: Verify no source or dependency drift**

Run:

```bash
git diff --check
git status --short
git diff --stat
```

Expected: only the approved test-contract change is present after excluding the already committed spec and plan documents.

### Task 4: Create the private PostHog dashboard shell

**Files:**
- External configuration only: existing PostHog project `PersonalPortfolio`

**Interfaces:**
- Consumes: the existing privacy-configured PostHog project.
- Produces: one private dashboard named `Portfolio activity`, defaulting to 30 days with comparison to the previous 30 days.

- [ ] **Step 1: Recheck the project privacy boundary**

In PostHog, confirm IP discard is on; autocapture, web vitals, dead-click capture, replay, and heatmaps are off; there are no active surveys or feature flags. Record only observed settings.

- [ ] **Step 2: Create the dashboard shell**

Create `Portfolio activity`, keep its sharing private, select the last 30 days, and enable comparison to the previous period. Prefer a dashboard-level comparison; if the current UI lacks one, configure previous-period comparison on each applicable insight. If neither mechanism is available, stop and report the dashboard limitation before production activation.

Expected: the dashboard exists, is visible only to the owner's PostHog project, and contains no public link, embed, sample data, or invented insight.

- [ ] **Step 3: Add only insights backed by already-visible event schemas**

If the seven event names and their approved properties are selectable before activation, create the nine views defined below. If an event or property is unavailable because no real event has arrived, leave the dashboard shell empty and defer that view to Task 7 rather than generating sample events or widening capture.

1. Page views by `path`.
2. Engagement events over time.
3. Projects opened by `project_slug`.
4. Resume actions by `action`.
5. Navigation clicks by `destination`.
6. Navigation clicks by `region`.
7. Contact clicks by `source_path`.
8. Inspirations filters by `category`.
9. Inspirations sorting by `order`.

### Task 5: Pass the remote Git and authenticated-staging gates

**Files:**
- No additional source files.
- External: GitHub branch, pull request, checks, and Cloudflare Pages staging deployment.

**Interfaces:**
- Consumes: the approved Task 2 commit and Task 3 verification evidence.
- Produces: one merged SHA reviewed through authenticated staging with analytics disabled.

- [ ] **Step 1: Stop for push approval**

After approval, push the exact analytics branch. Confirm the read-only verification workflow completes successfully. A push must not deploy production.

- [ ] **Step 2: Stop for pull-request approval**

After approval, open a pull request to `master`, attach it to the task, and report the URL and checks. Do not merge.

- [ ] **Step 3: Stop for merge approval**

After approval and green checks, merge the pull request without force operations or history rewriting. Record the exact merged SHA.

- [ ] **Step 4: Stop for authenticated-staging approval**

After approval, dispatch `Stage Portfolio Preview` for the exact merged SHA. The workflow must build with `PUBLIC_SITE_ENV=staging` and `PUBLIC_ANALYTICS_ENABLED=false`.

- [ ] **Step 5: Verify authenticated staging**

Confirm the workflow succeeds, record the immutable and branch-alias URLs, and verify behind Cloudflare Access that the site remains `noindex, nofollow` and analytics-disabled. Review the core homepage, Work, Resume, and one released case study at desktop and mobile widths.

### Task 6: Activate production analytics and verify capture

**Files:**
- External: GitHub Pages production workflow and public portfolio.

**Interfaces:**
- Consumes: Task 5's exact merged and staged SHA.
- Produces: the same source SHA deployed with `enable_analytics=true` and verified public event capture.

- [ ] **Step 1: Stop for production-activation approval**

Present the exact `commit_sha`, identical `staged_sha`, known rollback SHA, workflow name, and `enable_analytics=true`. Do not dispatch until approved.

- [ ] **Step 2: Dispatch and monitor the production workflow**

Run the manual `Release Portfolio to GitHub Pages` workflow with the approved values. Wait for both build and deploy jobs and record the workflow URL and deployment result.

- [ ] **Step 3: Verify the live runtime boundary**

On `https://maverickespinosa.com/`, confirm HTTPS 200 and `portfolio-environment=production`, `portfolio-analytics=enabled`. Confirm `window.posthog` initializes on a released route. On `/preview/`, confirm `noindex, nofollow` remains and the runtime does not initialize PostHog despite the production-enabled build metadata.

- [ ] **Step 4: Generate bounded owner verification activity**

At a recorded local timestamp, use the public site normally to generate a small known sequence from the approved interactions: page views, one navigation click, one project open, resume hub/view actions, and one Inspirations filter/sort change. Do not submit visitor text, identify a person, fabricate a contact click, or call PostHog directly.

- [ ] **Step 5: Inspect the captured events**

In PostHog, verify the known-time events arrived under the seven approved names and inspect their properties. Confirm no raw URL, query, referrer, element text, coordinate, email, homepage thought text, or unapproved property is present.

- [ ] **Step 6: Exercise rollback if any boundary fails**

If the live site, payload, or PostHog configuration violates the contract, stop analysis and rerun the manual production workflow for the same reviewed SHA with `enable_analytics=false`. Verify the disabled public marker and absent runtime before diagnosing further.

### Task 7: Complete the private dashboard and release evidence

**Files:**
- Modify: `docs/release-session-2026-09-25.md`
- External: private PostHog dashboard `Portfolio activity`

**Interfaces:**
- Consumes: Task 6's verified real event schemas and exact release evidence.
- Produces: nine source-backed private dashboard views and one Task 29 Result / Friction / Next action entry.

- [ ] **Step 1: Create a clean evidence branch from the activated production SHA**

After confirming `master` contains Tasks 27 and 28 and the activated source SHA, create a new `codex/posthog-analytics-evidence` branch/worktree from that observed commit. Do not append release evidence on a stale pre-merge branch.

- [ ] **Step 2: Create or complete the nine dashboard views**

Use only the real approved events and properties observed in Task 6. Configure the nine views listed in Task 4, keep the 30-day period and previous-period comparison, and leave legitimately empty series empty.

- [ ] **Step 3: Inspect the dashboard**

Confirm each card's event, aggregation, breakdown, date window, and comparison. Verify labels say event counts or actions rather than people, sessions, retention, recruiter activity, source, location, dwell time, or attention zones. Confirm the dashboard remains private.

- [ ] **Step 4: Append Task 29 release evidence**

Add one entry to `docs/release-session-2026-09-25.md` containing:

- Result: test-only source change, exact merged/staged/deployed SHA, workflow and deployment results, live markers, verified event names/properties, and private dashboard views.
- Friction: actual setup or verification limitations, empty cards, dashboard UI constraints, and any excluded checks.
- Next action: inspect organic data later before changing instrumentation; resume Daily Focus Coach as a separate project; keep recruiter identification, attribution, section zones, custom admin, alerts, and automation deferred.

- [ ] **Step 5: Verify the documentation diff**

Run:

```bash
git diff --check
git diff -- docs/release-session-2026-09-25.md
git status --short
```

Expected: only the release-session evidence file is modified after the implementation commit; historical entries remain unchanged.

- [ ] **Step 6: Stop for the evidence commit and push gates**

After owner approval, stage only `docs/release-session-2026-09-25.md` and create a documentation-only commit. Request separate push approval. That push must not dispatch staging or production.
