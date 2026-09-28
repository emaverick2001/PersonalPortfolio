# Resume-Backed Project Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two reviewed technical case studies to the local recruiter-ready portfolio, remove the generic Work explanation, and record an APL public-claim approval boundary.

**Architecture:** Keep explicit Astro routes as the public project allowlist. Extend the existing Work component and evidence-led case-study styles with two server-rendered pages and static accessible diagrams; use rendered-output tests as the route and claim contract.

**Tech Stack:** Astro 5, TypeScript, CSS, Node test runner.

**Spec:** `docs/superpowers/specs/2026-09-27-resume-backed-project-expansion-design.md`

## Global Constraints

- Work in the approved dirty `codex/portfolio-release-candidate` checkout; preserve all unrelated changes.
- Owned product paths are `frontend/src/components/GrowthWork.astro`, the two new project routes, `frontend/src/styles/work-preview.css`, `frontend/scripts/work-production-route.test.mjs`, and `frontend/scripts/project-route-contract.test.mjs`.
- Owned documentation paths are this plan/spec, `docs/apl-public-claim-review.md`, `docs/recruiter-ready-content-audit.md`, and `docs/release-session-2026-09-25.md`.
- No commit, push, deployment, analytics change, visitor-data collection, external-repository edit, or Daily Focus Coach expansion.
- Preserve the approved visual system and existing molecule/synthesizer narratives.

## Review Focus

- A recruiter should not mistake a team result for Maverick's individual contribution.
- A metric must retain its sample, comparison, and limitation rather than appear as a general benchmark claim.
- The new pages must remain legible and unclipped at 390 x 844 and 1440 x 900.
- Work navigation, route generation, and sitemaps must expose both new routes without restoring legacy routes.
- APL review material must not appear in public HTML or contain new nonpublic operational detail.

---

### Task 1: Expand the Work route contract

**Files:**
- Modify: `frontend/scripts/work-production-route.test.mjs`
- Modify: `frontend/scripts/project-route-contract.test.mjs`
- Modify: `frontend/src/components/GrowthWork.astro`

**Interfaces:**
- Produces four released project links in the approved order and no `The Standard` footer.

- [x] Write rendered-output assertions for the two new routes, approved order, Daily Focus Coach status, and removed generic footer.
- [x] Run the focused tests after a build and verify failure because the routes and entries do not exist.
- [x] Add the two evidence-led Work entries and remove the generic footer.
- [x] Rebuild and verify the focused tests pass.

### Task 2: Add the Symbiotic-SWE case study

**Files:**
- Create: `frontend/src/pages/projects/symbiotic-swe.astro`
- Modify: `frontend/src/styles/work-preview.css`
- Modify: `frontend/scripts/work-production-route.test.mjs`

**Interfaces:**
- Produces `/projects/symbiotic-swe/` with Question, Contribution, System, Evidence, Friction, and Next action sections.

- [x] Add failing rendered-output assertions for contribution, four conditions, 14-task scope, 14.3% to 35.7% result, cost trade-off, repository link, and limitations.
- [x] Run the focused test and verify failure because the page does not exist.
- [x] Implement the route and accessible static system/evidence visuals.
- [x] Rebuild and verify the focused test passes.

### Task 3: Add the SACKV case study

**Files:**
- Create: `frontend/src/pages/projects/semantic-aware-kv-cache-eviction.astro`
- Modify: `frontend/src/styles/work-preview.css`
- Modify: `frontend/scripts/work-production-route.test.mjs`

**Interfaces:**
- Produces `/projects/semantic-aware-kv-cache-eviction/` with five-person attribution, bounded individual contribution, exact warmup metrics, and no external source link.

- [x] Add failing rendered-output assertions for team attribution, contribution boundary, 50-example/30% context, 713 blocks, estimated 654 MB, 0% quality delta, 56% latency increase, 40% degradation, and absence of a source/report link.
- [x] Run the focused test and verify failure because the page does not exist.
- [x] Implement the route and accessible chunk-eviction/evidence visuals.
- [x] Rebuild and verify the focused test passes.

### Task 4: Record the APL claim gate and verify the slice

**Files:**
- Create: `docs/apl-public-claim-review.md`
- Modify: `docs/recruiter-ready-content-audit.md`
- Modify: `docs/release-session-2026-09-25.md`

**Interfaces:**
- Produces a public-safe approval checklist and final Result, Friction, and Next action evidence.

- [x] Record only reviewed-resume facts and explicit publish/confirm/omit categories; do not place the checklist in public HTML.
- [x] Run build, all supported tests, type checking, and `git diff --check`.
- [x] Browser-check Work plus both new case studies at desktop and mobile sizes, including links, focus, clipping, theme, reduced motion, and console/image errors.
- [x] Append the exact verification evidence to the release log and stop for owner review without committing.
