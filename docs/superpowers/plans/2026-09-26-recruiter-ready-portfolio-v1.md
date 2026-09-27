# Recruiter-Ready Portfolio v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a locally verified, recruiter-ready portfolio candidate with one current resume, sharper AI/ML-and-data positioning, two evidence-backed flagship case studies, and no stale public project routes.

**Architecture:** Preserve the approved Astro visual shell and introduce only two reusable content boundaries: an evidence ledger that controls factual edits and a `CaseStudyQuickTour.astro` summary shared by the two released case studies. Explicit project pages remain the public allowlist; the legacy data-driven catch-all first stops generating routes, then its unused machinery and generic images are removed only after a complete reference audit. This plan ends with a complete local candidate; deterministic release infrastructure, authenticated staging, and production promotion remain downstream plans.

**Tech Stack:** Astro 5, TypeScript, CSS, Node test runner, existing browser QA harness, PDF inspection tools.

**Spec:** `docs/superpowers/specs/2026-09-26-recruiter-ready-portfolio-v1-design.md`

## Global Constraints

- Work only on `codex/portfolio-release-candidate` after rechecking the live branch, HEAD, staged changes, tracked changes, and untracked paths.
- Preserve every existing user-owned change; do not reset, clean, stash, rebase, pull, overwrite, or broadly stage the checkout.
- Do not implement release infrastructure in this plan. The revised release-foundation and private-staging plans begin only after this local candidate is approved.
- Lead with AI/ML, data, and software-engineering evidence; use creative and interactive systems as the differentiator.
- Preserve the approved botanical design, night-first behavior, reversible growth artwork, page shell, and privacy behavior.
- Publish only factual claims supported by a supplied resume, repository, project document, approved owner correction, or inspected artifact.
- Keep one public primary resume. Do not expose role-specific resume placeholders or stale resume files.
- Release exactly two flagship case studies: Molecule Generation with Reinforcement Learning and Pure Data Synthesizer + Visualizer.
- Keep RevoStep and Daily Focus Coach secondary and accurately labeled. Do not claim a Daily Focus Coach product, trial, data connector, or persistent memory exists.
- Do not add analytics, session replay, visitor-input capture, storage, account connectors, personal-data ingestion, or external embeds.
- Do not integrate a generated headshot, decorative 3D scene, travel globe, background soundtrack, learning module, or KV-cache case study.
- Commit, push, pull request, merge, staging, and production remain separate approval gates.

## Review Focus

- A missing or contradictory resume fact must block the affected public edit rather than be inferred; Task 1's evidence-ledger review and Task 2's PDF/text assertions exercise this.
- A stale legacy project route must return no generated page and appear in no sitemap while the two allowlisted case studies remain available; Task 4's route-contract test exercises this.
- A case-study quick tour must remain useful without JavaScript, have exactly six labeled entries, and link to valid in-page targets; Task 5's rendered-output tests exercise this.
- The synthesizer evidence interaction must identify itself as documentation-based, work by keyboard, reveal no undocumented behavior, and remain understandable without interaction; Task 6's model and browser checks exercise this.
- Missing images, private portrait files, visitor-input transmission, mobile overflow, reduced-motion regressions, or a broken navigation/contact/resume destination must block the local release gate; Task 9 exercises these conditions.

---

### Task 1: Establish the recruiter-content evidence ledger

**Files:**
- Create: `docs/recruiter-ready-content-audit.md`
- Modify: `docs/release-session-2026-09-25.md`

**Interfaces:**
- Consumes: the current built pages; the approved v1 specification; Maverick's supplied current resume source files; inspected project repositories and documents; owner corrections made during review.
- Produces: an owner-reviewed ledger with one row per public route and claim group, using statuses `verified`, `omit`, or `needs-owner-confirmation`, plus exact approved homepage copy and exact primary-resume metadata for later tasks.

- [ ] **Step 1: Re-run the repository preflight**

Record repository root, branch, full HEAD, staged paths, tracked changes, untracked paths, and current diff check. Confirm the approved specification and this plan are present and that no existing change is silently assigned to this task.

- [ ] **Step 2: Inventory every currently generated public route**

Build the current site and derive the route list from `dist/` and both sitemap outputs. In the ledger, classify Home, About, Work, the two explicit case studies, Research, Background, Personal, Music, Blog and each article, Inspirations, Resume, and every legacy project route.

- [ ] **Step 3: Record claim provenance**

For every page being retained, list the public claim group, its source, its current status, and the permitted action. Record unknown dates, job status, project ownership, performance results, and private information as `needs-owner-confirmation` or `omit`; do not rewrite them.

- [ ] **Step 4: Inspect the supplied resume sources using the resume and PDF workflows**

Use the `resume-builder` skill for factual resume reconciliation and the `pdf` skill for rendered/text verification. Record the approved title, update date, final source artifact, intended public filename, page count, and verified role/education/project facts. Stop this task if no current resume source has been supplied.

- [ ] **Step 5: Present the exact content decision set for owner review**

The decision set must include the three homepage positioning strings, resume metadata, public project allowlist, RevoStep status, Daily Focus Coach status, supporting-page corrections, and omitted legacy routes. Resolve every `needs-owner-confirmation` item that would otherwise affect public output.

- [ ] **Step 6: Mark the ledger approved and record the gate**

After explicit owner approval, mark the ledger `Approved` with the date and append Result, Friction, and Next action to the release log. Do not stage or commit either document without a separate Git gate.

---

### Task 2: Replace the dated public resume with one current verified artifact

**Files:**
- Modify: `frontend/src/content/resumes.ts`
- Modify: `frontend/src/components/GrowthResume.astro`
- Modify: `frontend/scripts/resume-page.test.mjs`
- Create: `frontend/public/assets/files/Maverick_Espinosa_Resume.pdf`
- Delete after verification: `frontend/public/assets/files/Resume_09_20_2025.pdf`

**Interfaces:**
- Consumes: Task 1's approved resume title, date, source artifact, public filename, and verified factual text.
- Produces: `resumeEntries` with exactly one `ResumeEntry` pointing to `/assets/files/Maverick_Espinosa_Resume.pdf`, and a built Resume page whose View and Download actions reference that same file.

- [ ] **Step 1: Update the resume contract test and verify it fails**

Change `resume-page.test.mjs` to assert the approved update label, the stable public PDF path, exactly one entry, two distinct actions, absence of `Resume_09_20_2025.pdf`, and absence of AI Engineer/Data Engineer placeholders. Run `npm run build && node --test scripts/resume-page.test.mjs` and expect failure on the old date/path.

- [ ] **Step 2: Materialize the approved PDF without editorial invention**

Copy or render the owner-approved resume to `Maverick_Espinosa_Resume.pdf`. Preserve its approved wording and layout; do not silently rewrite bullets, dates, titles, employers, education, or skills.

- [ ] **Step 3: Verify the PDF itself**

Render the PDF and inspect every page. Extract its text, confirm the approved page count, date-sensitive facts, section order, absence of clipping, and selectable/readable text. A visually rendered file without successful text verification is not sufficient.

- [ ] **Step 4: Update the resume data and page copy**

Set the single `resumeEntries` record to the approved title/date/path. Replace the temporary archive/future-variants framing with concise current-document language. Keep View PDF and Download PDF as separate accessible actions.

- [ ] **Step 5: Remove the stale public PDF and verify**

Delete only `frontend/public/assets/files/Resume_09_20_2025.pdf`, then rebuild and run `resume-page.test.mjs`. Confirm the old URL is absent from `dist/`, the stable new file exists, and both buttons work in the browser.

- [ ] **Step 6: Stop for resume review and optional commit gate**

Show the rendered Resume page and PDF. If approved and a commit is authorized, stage only the five paths in this task and use `feat: publish current portfolio resume`.

---

### Task 3: Sharpen the homepage positioning and fastest proof path

**Files:**
- Modify: `frontend/src/components/GrowthHomepage.astro`
- Modify: `frontend/src/styles/growth-preview.css` only if the approved copy produces a verified layout defect; otherwise leave it unchanged
- Modify: `frontend/scripts/homepage-principles.test.mjs`
- Create: `frontend/scripts/recruiter-positioning.test.mjs`

**Interfaces:**
- Consumes: Task 1's exact approved eyebrow, headline, introductory sentence, primary case-study CTA label, and secondary Work/Resume actions.
- Produces: a first-screen path from positioning to `/projects/molecule-generation-with-rl/`, with Work and Resume still available and the existing botanical/Coach behavior unchanged.

- [ ] **Step 1: Write the failing recruiter-positioning test**

Assert that `dist/index.html` contains the exact Task 1 positioning strings, links the primary button directly to `/projects/molecule-generation-with-rl/`, retains accessible links to `/projects/` and `/resume/`, contains one `h1`, and does not reintroduce unsupported seniority or a generated portrait.

- [ ] **Step 2: Run the focused test and verify it fails**

Run `npm run build && node --test scripts/recruiter-positioning.test.mjs scripts/homepage-principles.test.mjs`. Expected: the new positioning and primary proof path are absent.

- [ ] **Step 3: Apply only the approved positioning copy and link hierarchy**

Edit the hero text and CTA destinations. Preserve the three scroll chapters, eleven-state growth sequence, current writing/research sections, local-only thought interaction, and Daily Focus Coach's `In development` framing.

- [ ] **Step 4: Verify layout and privacy behavior**

Run the focused tests, `growth-preview.test.mjs`, and `analytics-contract.test.mjs`. In the browser at 390 × 844 and 1440 × 900, verify no clipping or overflow, the direct flagship CTA, reverse scrolling, reduced motion, keyboard focus, and that thought text is neither saved nor transmitted.

- [ ] **Step 5: Stop for homepage review and optional commit gate**

If approved and a commit is authorized, stage only the homepage component, the tests, and any necessary narrowly scoped CSS change; use `feat: clarify portfolio positioning`.

---

### Task 4: Enforce the public project-route allowlist

**Files:**
- Modify: `frontend/src/pages/projects/[...slug].astro`
- Modify: `frontend/src/components/GrowthWork.astro`
- Modify: `frontend/scripts/work-production-route.test.mjs`
- Modify: `frontend/scripts/analytics-contract.test.mjs`
- Create: `frontend/scripts/project-route-contract.test.mjs`

**Interfaces:**
- Consumes: Task 1's approved public-project allowlist and exact RevoStep/Daily Focus Coach statuses.
- Produces: only `/projects/`, `/projects/molecule-generation-with-rl/`, and `/projects/pure-data-synthesizer--visualizer/` as built Work routes; no generated legacy detail pages.

- [ ] **Step 1: Write the failing project-route contract**

Assert that the two explicit case-study files and Work index exist; that `pactspace`, `cpcr-datacatalog`, `ctr-analysis`, `ai-policy-web-crawler`, `phi-redactor`, `visual-score`, and `music-recommendation-system` do not exist under `dist/projects/`; and that no sitemap contains those seven legacy slugs.

- [ ] **Step 2: Run the route contract and verify it fails**

Run `npm run build && node --test scripts/project-route-contract.test.mjs`. Expected: FAIL because the catch-all currently generates the seven legacy routes.

- [ ] **Step 3: Stop catch-all route generation without deleting source evidence**

Change `getStaticPaths` in `[...slug].astro` to produce no legacy route. Preserve `frontend/src/content/projects.ts` and old project assets as read-only source for the later cleanup inventory; do not expose them through Work, navigation, or sitemap.

- [ ] **Step 4: Update Work's secondary statuses and analytics fixture**

Apply only the approved Task 1 wording for RevoStep and Daily Focus Coach. Change `analytics-contract.test.mjs` to inspect a released page rather than the removed PactSpace build output; do not alter the seven-event contract.

- [ ] **Step 5: Verify the allowlist and direct navigation**

Run the two Work tests, analytics contract, sitemap assertions available in the current branch, and a browser check of valid and removed paths. Valid case studies must open; a removed legacy URL must resolve to the site's not-found behavior and never appear in navigation or sitemap.

- [ ] **Step 6: Stop for Work-route review and optional commit gate**

If approved and a commit is authorized, stage only the five files in this task and use `fix: curate public project routes`.

---

### Task 5: Add the reusable 60-second case-study quick tour

**Files:**
- Create: `frontend/src/components/CaseStudyQuickTour.astro`
- Modify: `frontend/src/pages/projects/molecule-generation-with-rl.astro`
- Modify: `frontend/src/pages/projects/pure-data-synthesizer--visualizer.astro`
- Modify: `frontend/src/styles/work-preview.css`
- Modify: `frontend/scripts/work-production-route.test.mjs`

**Interfaces:**
- Consumes: `items: readonly QuickTourItem[]`, where `QuickTourItem` is `{ label: 'Question' | 'Contribution' | 'System' | 'Evidence' | 'Friction' | 'Next action'; summary: string; href: `#${string}` }`.
- Produces: `CaseStudyQuickTour.astro`, a server-rendered `<nav aria-label="60-second project overview">` with exactly six ordered links and no client JavaScript.

- [ ] **Step 1: Add failing rendered-output assertions**

For both case studies, assert one `60-second project overview`, exactly six labels in the interface order, six fragment links, and matching section IDs. Assert the molecule summary includes the non-reproduction and preliminary-evidence boundary; assert the synthesizer summary includes the completed-class-project and unfinished-mapping boundaries.

- [ ] **Step 2: Run the focused Work test and verify it fails**

Run `npm run build && node --test scripts/work-production-route.test.mjs`. Expected: FAIL because the shared quick tour and target IDs do not exist.

- [ ] **Step 3: Implement `CaseStudyQuickTour.astro`**

Render an ordered, scan-friendly list of six links using the exact interface. Do not add a carousel, animation, storage, tracking call, or collapsed-by-default content.

- [ ] **Step 4: Add evidence-specific quick-tour data and target IDs**

On each explicit case-study page, define six items from its existing verified story and connect them to stable section IDs. The summary must distinguish system implementation from outcome evidence and must not strengthen any claim.

- [ ] **Step 5: Style and verify the quick tour**

Add responsive styles following the existing paper/ink/green tokens. Run build, Work tests, style-token tests, and browser checks at 390 × 844 and 1440 × 900. Verify keyboard traversal, visible focus, valid fragments, no horizontal overflow, and readable order without CSS.

- [ ] **Step 6: Stop for case-tour review and optional commit gate**

If approved and a commit is authorized, stage only the five task paths and use `feat: add case study quick tours`.

---

### Task 6: Turn synthesizer documentation into an honest interactive visual

**Files:**
- Create: `frontend/src/components/SynthSignalExplorer.astro`
- Create: `frontend/src/scripts/synth-signal-explorer.ts`
- Modify: `frontend/src/pages/projects/pure-data-synthesizer--visualizer.astro`
- Modify: `frontend/src/styles/work-preview.css`
- Create: `frontend/scripts/synth-signal-explorer.test.mjs`
- Modify: `frontend/scripts/work-production-route.test.mjs`

**Interfaces:**
- Consumes: the three already sourced mappings `Volume → Sound level → Object size`, `Tempo → Arpeggiator rate → object/particle spawn rate`, and `Pan → Stereo position → objects move left/right`.
- Produces: a progressively enhanced three-choice explorer with `data-synth-signal-explorer`, buttons using `aria-pressed`, a live visual mapping panel, and the fixed disclosure `Documentation-based walkthrough — not a live project demo.`

- [ ] **Step 1: Write failing markup and state-transition tests**

Assert that built output contains all three mappings, the exact disclosure, three buttons, and a complete no-JavaScript fallback. Bundle the controller and simulate selection by keyboard/click; assert one active control, matching audio text, matching visual text, and no network, storage, form, audio-capture, or analytics call.

- [ ] **Step 2: Run the focused test and verify it fails**

Run `npm run build && node --test scripts/synth-signal-explorer.test.mjs scripts/work-production-route.test.mjs`. Expected: FAIL because the component and controller do not exist.

- [ ] **Step 3: Implement `SynthSignalExplorer.astro`**

Render Volume as the initial selected mapping and include every mapping in server-rendered fallback content. Label the artifact as a documentation-based explanation and retain links to the original pinned repository source.

- [ ] **Step 4: Implement the small controller**

Export `initSynthSignalExplorers(root: ParentNode = document): void`. It updates `aria-pressed` and the two text outputs from fixed `data-*` values only. It must not synthesize sound, imitate GEM output, read user input, persist state, or contact a service.

- [ ] **Step 5: Integrate and visually verify**

Place the explorer in the Interaction section without removing the source-based table. Verify mouse, keyboard, no-JavaScript content, Day/Night, reduced motion, 390 × 844, and 1440 × 900. Confirm the interaction cannot be mistaken for footage or a live port.

- [ ] **Step 6: Stop for synthesizer-evidence review and optional commit gate**

If approved and a commit is authorized, stage only the six paths in this task and use `feat: visualize synthesizer signal mappings`.

---

### Task 7: Apply the approved supporting-content and destination corrections

**Files:**
- Modify only the exact public page/content files listed as `verified correction` in `docs/recruiter-ready-content-audit.md`
- Modify: `frontend/src/content/navInfo.tsx` only if the approved audit changes a public navigation label or destination
- Create: `frontend/scripts/public-content-contract.test.mjs`

**Interfaces:**
- Consumes: Task 1's exact approved correction list and current public route inventory.
- Produces: current, concise public copy and a test manifest of required internal destinations, external HTTPS destinations, and prohibited internal-planning phrases.

- [ ] **Step 1: Write the failing public-content contract**

Encode the exact approved corrections and required destinations from the ledger. Assert that public output contains no owner-rejected status statement, internal `TBD`, `coming soon`, `paste the README`, `once finalized`, generated-headshot path, or unapproved project promise. Scope assertions to the public pages named in the ledger so historical blog quotations are not rewritten accidentally.

- [ ] **Step 2: Run the focused test and verify it fails for each approved correction**

Run `npm run build && node --test scripts/public-content-contract.test.mjs`. Record the failing pages and do not broaden the edit set to unrelated content.

- [ ] **Step 3: Apply the exact approved corrections**

Edit only ledger-approved strings, dates, labels, links, and status descriptions. Preserve page layouts and omit unknown facts. Do not add generic promotional microcopy or another "keep exploring" section.

- [ ] **Step 4: Verify destinations and supporting pages in the browser**

Check About, Research, Background, Personal, Music, Blog/article, Inspirations, Resume, Contact, social links, and all internal actions on desktop and mobile. External links must use the existing safe new-tab/referrer behavior where applicable.

- [ ] **Step 5: Stop for content review and optional commit gate**

Run the focused test, all affected page tests, build, and diff check. If approved and a commit is authorized, stage only the ledger-approved page/content files plus the contract test and use `content: finish recruiter-ready portfolio copy`.

---

### Task 8: Retire the verified-unused legacy project machinery

**Files:**
- Delete: `frontend/src/pages/projects/[...slug].astro`
- Delete: `frontend/src/components/ProjectGrid.tsx`
- Delete: `frontend/src/content/projects.ts`
- Delete: `frontend/public/assets/images/project-1.jpg`
- Delete: `frontend/public/assets/images/project-2.jpg`
- Delete: `frontend/public/assets/images/project-3.jpg`
- Delete: `frontend/public/assets/images/project-4.jpg`
- Delete: `frontend/public/assets/images/project-5.jpg`
- Delete: `frontend/public/assets/images/project-6.jpg`
- Delete: `frontend/public/assets/images/project-7.jpg`
- Delete: `frontend/public/assets/images/project-8.jpg`
- Delete: `frontend/public/assets/images/project-9.jpg`
- Modify: `frontend/scripts/analytics-contract.test.mjs`
- Create: `frontend/scripts/legacy-project-cleanup.test.mjs`

**Interfaces:**
- Consumes: Task 4's passing public route allowlist and a repository-wide reference scan proving that the catch-all route, legacy grid/data, and nine generic project images have no released consumer.
- Produces: a smaller recruiter-facing source tree with no placeholder project generator or orphaned generic project thumbnails; Git history remains the recovery mechanism.

- [ ] **Step 1: Write the cleanup contract before deleting anything**

Assert that no released source imports `ProjectGrid.tsx` or `content/projects.ts`, no built HTML references `project-1.jpg` through `project-9.jpg`, and the two explicit flagship pages and Work index still exist. Run the contract before deletion and record the current legacy-only references.

Expected before cleanup: FAIL on the catch-all, grid, data, or generic-image source that Task 4 deliberately preserved for this audited deletion gate.

- [ ] **Step 2: Re-run the exact reference inventory**

Search source, tests, styles, configuration, and public markup for every deletion target. If any target has acquired a released consumer since this plan was written, stop and revise the deletion set rather than removing it.

- [ ] **Step 3: Delete only the proven-unused legacy paths**

Remove the catch-all generator, ProjectGrid component, legacy project data file, and nine generic thumbnails. Do not remove explicit flagship pages, case-study source links, botanical artwork, release records, or unrelated assets.

- [ ] **Step 4: Remove obsolete analytics-test fixtures**

Update `analytics-contract.test.mjs` so it no longer reads the deleted component/data files. Retain assertions that released navigation and project actions use only the delegated seven-event analytics contract; do not add or enable analytics.

- [ ] **Step 5: Verify the cleanup**

Run build, `legacy-project-cleanup.test.mjs`, the project-route contract, Work tests, analytics contract, and a repository reference scan. Expected: no missing import or asset error, no legacy route, both flagship routes intact, and no stale generic image reference in `dist/`.

- [ ] **Step 6: Stop for deletion review and optional commit gate**

Present the exact deleted-file list and recovery path through Git history. If approved and a commit is authorized, stage only the deletion set and two tests using exact paths; use `chore: remove legacy project placeholders`.

---

### Task 9: Verify the complete local Portfolio v1 candidate

**Files:**
- Modify: `docs/release-session-2026-09-25.md`
- Modify: `docs/recruiter-ready-content-audit.md` only to record final verification state
- Modify after evidence is known: `docs/superpowers/plans/2026-09-26-portfolio-release-foundation.md`

**Interfaces:**
- Consumes: Tasks 1–8; the exact local candidate HEAD and working-tree diff; the downstream release-foundation plan.
- Produces: a locally approved Portfolio v1 candidate, fresh verification evidence, and a corrected release-foundation starting inventory. It does not produce a commit, remote branch, staging site, or public release.

- [ ] **Step 1: Run the complete automated baseline**

From `frontend/`, run `npm run build`, the supported Node test suite, and `npm run typecheck`; from the root run `git diff --check`. Record exact totals, diagnostics, failures, and the optional native-canvas renderer exclusion rather than assuming the earlier 55-test count still applies.

- [ ] **Step 2: Audit build output and public routes**

Verify the explicit route allowlist, both sitemap outputs, robots behavior, one current PDF, absence of the dated PDF, absence of private portrait paths/files, absence of seven legacy project routes, canonical metadata, and no broken local image or stylesheet reference.

- [ ] **Step 3: Run desktop and mobile browser QA**

At 390 × 844, 768 × 900, and 1440 × 900, check Home, About, Work, both flagship case studies, Research, Blog/article, Music, Inspirations, Personal, Background, and Resume. Verify navigation, keyboard focus and menu escape, Day/Night persistence, reduced motion, reversible seed and vine growth, quick-tour fragments, synthesizer explorer, PDF actions, image loading, no horizontal overflow, and local-only thought interaction.

- [ ] **Step 4: Perform the two-minute recruiter walkthrough**

Starting from a fresh homepage visit, verify that a reviewer can identify the AI/data positioning in about 10 seconds, reach the molecule case in one click, scan its question/contribution/system/evidence/friction/next action within 60–90 seconds, then locate the creative differentiator and current resume. Record observed friction without redesigning during the walkthrough.

- [ ] **Step 5: Record Result, Friction, and Next action**

Append the exact changed paths, test/build/browser evidence, omissions, unsupported evidence that stayed omitted, and remaining risks to the release log. Mark the content audit complete only if every public route is `verified` or deliberately omitted.

- [ ] **Step 6: Rebase the downstream plan on the final candidate facts**

Update only the release-foundation plan's starting HEAD placeholder, expected changed-file inventory, current test totals, and Task 1 packaging boundary. Preserve its analytics-disabled, exact-SHA, manual-release, and private-staging decisions.

- [ ] **Step 7: Stop for local candidate approval**

Show the running site and diff summary. Do not stage, commit, push, configure Cloudflare, dispatch staging, or deploy. The next action is the separately approved release-foundation plan, followed by authenticated staging and exact-SHA production promotion.
