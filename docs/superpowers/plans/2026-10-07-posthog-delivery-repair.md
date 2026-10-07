# PostHog Delivery Repair Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reliably deliver privacy-minimized résumé and navigation analytics across page changes, exclude owner traffic at the browser boundary, and prepare a verified release candidate without activating production.

**Architecture:** Keep the existing event taxonomy and PostHog privacy configuration. Replace reliance on source-page network completion for same-origin navigation with a one-shot, sanitized session handoff that is captured on the destination page; use stable résumé action markers and a local, non-transmitted owner exclusion flag.

**Tech Stack:** Astro 5, TypeScript, PostHog JS, Node test runner, browser verification.

**Spec:** `docs/superpowers/specs/2026-10-07-posthog-delivery-repair-design.md`

## Global Constraints

- Preserve the approved seven-event taxonomy and controlled property allowlists.
- Do not identify visitors or collect visitor input, raw URLs, referrers, query strings, click coordinates, or session recordings.
- Analytics remains disabled on localhost, staging, preview routes, Do Not Track sessions, and browsers with the local exclusion flag.
- Preserve all unrelated source, content, design, and release behavior.
- Commit, push, pull request, merge, staging, and production activation remain separate owner gates.

## Review Focus

- A same-origin navigation must create one interaction event after the destination loads, not zero or two.
- Back/forward or direct arrival must not replay a consumed pending event.
- Corrupt, stale, or unapproved session payloads must be removed without capture.
- PDF actions must stay correct when the résumé filename changes again.
- Storage failure must preserve navigation and use the immediate beacon fallback without throwing.

---

### Task 1: Navigation handoff and résumé action contract

**Files:**
- Modify: `frontend/scripts/analytics-contract.test.mjs`
- Modify: `frontend/src/utils/analytics.ts`
- Modify: `frontend/src/components/GrowthResume.astro`

**Interfaces:**
- Produces: one-shot pending-event helpers consumed by `installAnalytics`; stable `data-resume-action` markers.

- [ ] Write behavior tests that simulate a homepage click, destination initialization, exact-once capture, replay prevention, invalid payload removal, storage failure fallback, and current résumé actions.
- [ ] Run the focused analytics test and verify each new behavior fails for the expected missing contract.
- [ ] Implement the smallest typed pending-event handoff and explicit résumé marker classification.
- [ ] Rerun the focused analytics test until green.

### Task 2: Browser-local internal traffic exclusion

**Files:**
- Modify: `frontend/scripts/analytics-contract.test.mjs`
- Modify: `frontend/src/utils/analytics.ts`
- Modify: `frontend/src/components/PostHog.astro`

**Interfaces:**
- Consumes: existing `shouldEnableAnalytics` production boundary.
- Produces: local exclusion preference resolution and sanitized query toggle before SDK initialization.

- [ ] Write behavior tests for set, clear, persistence, URL cleanup, storage failure, and unchanged production/staging/preview boundaries.
- [ ] Run the focused analytics test and verify the new cases fail for the expected missing behavior.
- [ ] Implement the local exclusion preference and wire it ahead of the PostHog import.
- [ ] Rerun the focused analytics test until green.

### Task 3: Regression, browser, and PostHog readiness verification

**Files:**
- Modify: `docs/release-session-2026-09-25.md`

**Interfaces:**
- Consumes: Tasks 1 and 2.
- Produces: fresh Result / Friction / Next action evidence and an explicit release gate.

- [ ] Run the focused analytics contract, production-disabled build, complete supported test suite, TypeScript, and `git diff --check`.
- [ ] Run a local production-enabled build on a noncanonical host and confirm the canonical-host boundary still prevents network analytics.
- [ ] Browser-test desktop and mobile résumé navigation, PDF actions, back/forward behavior, exclusion toggle, keyboard access, and absence of console errors.
- [ ] Inspect PostHog project settings for IP discard, retention, and existing internal/test filters without changing them unless the user separately approves the exact external mutation.
- [ ] Append one Result / Friction / Next action entry and stop for review before any Git or release gate.
