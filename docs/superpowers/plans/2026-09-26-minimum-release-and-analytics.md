# Minimum Portfolio Release and Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the minimum release boundary and replace broad legacy tracking with seven explicit privacy-minimized events.

**Architecture:** The résumé hub follows the existing Growth page pattern. Shared navigation owns the release-visible route list, while retained stale routes opt out of indexing. One PostHog bootstrap and one typed analytics helper provide production-host-only event capture; page components emit only controlled values.

**Tech Stack:** Astro 5, TypeScript, PostHog JS, Node test runner, existing growth CSS system.

**Spec:** `docs/superpowers/specs/2026-09-26-minimum-release-and-analytics-design.md`

## Global Constraints

- Preserve every unrelated local change.
- Freeze Inspirations visually and structurally except for approved filter/sort events.
- Do not record visitor input, enable replay/autocapture, identify visitors, or persist identifiers.
- Do not commit, push, deploy, publish, clean legacy resources, redesign projects, or start Daily Focus Coach work.
- Stop with the local site running for review.

## Review Focus

- Personal and Background remain directly accessible but are absent from shared navigation and sitemap and are `noindex`.
- The résumé PDF is reachable by both View and Download without duplicate direct-PDF navigation links.
- Analytics does not initialize on localhost or preview routes.
- The homepage thought interaction never enters analytics properties or network calls.
- Shared navigation and project links emit one intended event rather than duplicate events.

---

### Task 1: Release navigation and résumé hub

**Files:**
- Create: `frontend/src/content/resumes.ts`
- Create: `frontend/src/components/GrowthResume.astro`
- Create: `frontend/src/styles/resume.css`
- Create: `frontend/src/pages/resume.astro`
- Create: `frontend/scripts/resume-page.test.mjs`
- Modify: `frontend/src/content/navInfo.tsx`
- Modify: `frontend/src/components/GrowthHeader.astro`
- Modify: `frontend/src/components/GrowthFooterLinks.astro`
- Modify: `frontend/src/components/GrowthHomepage.astro`
- Modify: `frontend/src/components/Head.astro`
- Modify: `frontend/src/layouts/SiteLayout.astro`
- Modify: `frontend/src/pages/personal.astro`
- Modify: `frontend/src/pages/background.astro`
- Modify: `frontend/astro.config.mjs`
- Modify: `frontend/public/sitemap.xml`

**Interfaces:**
- Produces: `resumeEntries` with one September 20, 2025 PDF entry; `/resume/`; optional `noindex` support in `SiteLayout` and `Head`.

- [ ] Write build-output tests for the résumé hub, navigation boundary, sitemap exclusion, and retained `noindex` routes.
- [ ] Run the focused tests and verify they fail for missing `/resume/` and exposed stale routes.
- [ ] Implement the minimum route/navigation changes and dated résumé hub.
- [ ] Build and rerun focused tests until green.

### Task 2: Privacy-minimized analytics contract

**Files:**
- Create: `frontend/scripts/analytics-contract.test.mjs`
- Modify: `frontend/src/components/PostHog.astro`
- Modify: `frontend/src/utils/analytics.ts`
- Modify: `frontend/src/env.d.ts`
- Modify: `frontend/src/components/GrowthHeader.astro`
- Modify: `frontend/src/components/GrowthInspirations.astro`
- Modify: `frontend/src/pages/projects/index.astro`
- Modify: `frontend/src/pages/projects/pure-data-synthesizer--visualizer.astro`
- Modify: `frontend/src/layouts/SiteLayout.astro`
- Modify: `frontend/scripts/about-page.test.mjs`
- Modify: `frontend/scripts/blog-pages.test.mjs`
- Modify: `frontend/scripts/inspirations-page.test.mjs`
- Modify: `frontend/scripts/music-page.test.mjs`
- Modify: `frontend/scripts/research-page.test.mjs`
- Modify: `frontend/scripts/work-production-route.test.mjs`

**Interfaces:**
- Produces: production-host-only PostHog initialization and the seven approved event names with controlled properties.

- [ ] Write the analytics contract test and update route tests to distinguish approved analytics from broad tracking.
- [ ] Run focused tests and verify they fail against the legacy PostHog setup.
- [ ] Replace legacy tracking and wire the approved résumé, contact, project, navigation, filter, and sort events.
- [ ] Build and rerun focused tests until green.

### Task 3: Full QA and review handoff

**Files:**
- Modify: `docs/release-session-2026-09-25.md`

**Interfaces:**
- Consumes: Tasks 1 and 2.
- Produces: verified local review state and Result / Friction / Next action record.

- [ ] Run the full supported regression suite and production build.
- [ ] Browser-test desktop and mobile navigation, keyboard behavior, résumé actions, Inspirations controls, and local-only thought capture.
- [ ] Verify localhost and preview routes send no analytics requests.
- [ ] Append Result / Friction / Next action and leave the review page running.
- [ ] Stop without commit, push, deploy, cleanup, project redesign, or Daily Focus Coach work.
