# Remaining Portfolio Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the remaining minimal editorial portfolio pages, remove the approved promotional blocks, and add a one-entry résumé hub without adding analytics or inventing content.

**Architecture:** Each redesigned route gets one focused `Growth*.astro` page component and one page-specific stylesheet layered on the existing shared growth shell. Existing content modules and assets remain the source of truth; a small typed résumé collection makes future verified variants additive without exposing placeholders. Each page is implemented and browser-reviewed as its own gate before the next page begins.

**Tech Stack:** Astro 5, TypeScript, existing CSS design tokens, Node's built-in test runner, existing browser QA workflow.

**Spec:** `docs/superpowers/specs/2026-09-26-remaining-portfolio-pages-design.md`

## Global Constraints

- Preserve the approved warm-ivory, forest-green, editorial visual system and existing shared navigation behavior.
- Preserve existing assets and source content; do not imply dated material has been reverified.
- Do not publish, deploy, push, commit, install dependencies, add analytics, collect visitor data, or implement future résumé variants.
- Do not add PostHog, vendor-specific event calls, tracking attributes, persistent identifiers, session replay, or visitor-input capture.
- Keep the existing September 2025 PDF at `/assets/files/Resume_09_20_2025.pdf` and label it by its actual date.
- Use semantic landmarks, stable routes, accessible names, and focused component boundaries so a future analytics project can measure meaningful interactions without restructuring these pages.
- Stop after each task's browser review for user approval before starting the next task.

## Review Focus

- A page with many long inspiration titles must wrap without horizontal overflow; Task 2 tests and browser-checks 390 px layout.
- Personal images with mixed aspect ratios must remain legible and uncropped unless the composition is intentional; Task 3 checks intrinsic loading and rendered bounds.
- Dated professional statements must not be presented as newly verified; Task 4 preserves source wording only inside a visibly dated September 2025 snapshot and records the content-review boundary in the release log.
- The résumé hub must work with exactly one entry and no public empty variants; Task 5 tests card count, date, and both PDF actions.
- Centralizing Background and Resume navigation must not duplicate links or break active state and Escape focus restoration; Task 5 tests rendered link counts and Task 6 browser-checks the menu.

---

### Task 1: Remove About and Blog promotional endings

**Files:**
- Create: `frontend/scripts/about-page.test.mjs`
- Modify: `frontend/scripts/blog-pages.test.mjs`
- Modify: `frontend/src/components/GrowthAbout.astro:47`
- Modify: `frontend/src/components/GrowthBlogIndex.astro:117-124`
- Modify: `frontend/src/styles/about-preview.css:1-2`
- Modify: `frontend/src/styles/blog.css:1-3`
- Modify: `docs/release-session-2026-09-25.md`

**Interfaces:**
- Consumes: existing `GrowthFooterLinks` and `.footer-meta` footer primitives.
- Produces: About and Blog footers that begin with standard portfolio navigation and contain no promotional heading block.

- [ ] **Step 1: Write the failing build-output tests**

Add `about-page.test.mjs` assertions that `dist/about/index.html` retains the shared footer, portfolio navigation, and audio instrument but contains neither `There’s more to explore` nor `about-footer-title`. Add a Blog assertion that the index retains portfolio navigation but contains neither `Keep exploring` nor `Different forms`.

- [ ] **Step 2: Run the tests to verify RED**

Run: `node --test scripts/about-page.test.mjs scripts/blog-pages.test.mjs`

Expected: About and Blog promotional-block assertions fail against the existing build.

- [ ] **Step 3: Remove only the approved blocks**

Delete `about-footer-title` from `GrowthAbout.astro`. Delete the `about-row` inside the Blog index footer. Preserve `GrowthFooterLinks`, `.footer-meta`, preview disclosure, contact/back-to-top actions, Blog tools, and About audio markup.

- [ ] **Step 4: Remove only CSS selectors made unreachable by Step 3**

Delete `.about-footer-title` and the two `.writing-footer .about-row...` selectors. Do not change shared `.about-row` styling used by the homepage.

- [ ] **Step 5: Build and verify GREEN**

Run: `npm run build && node --test scripts/about-page.test.mjs scripts/blog-pages.test.mjs scripts/test-about-audio.mjs`

Expected: build exits 0; all focused tests pass; About audio lifecycle remains unchanged.

- [ ] **Step 6: Browser review and release note**

Verify `/about/` and `/blog/` at 390 × 844 and 1440 × 900. Confirm the pages end directly in standard navigation, audio still requires explicit consent, and there is no horizontal overflow. Append Result / Friction / Next action and stop for review. Do not commit.

---

### Task 2: Integrate Inspirations into the shared editorial shell

**Files:**
- Create: `frontend/src/components/GrowthInspirations.astro`
- Create: `frontend/src/styles/inspirations.css`
- Create: `frontend/scripts/inspirations-page.test.mjs`
- Modify: `frontend/src/pages/inspirations.astro:1-106`
- Preserve: `frontend/src/content/inspirations.ts`
- Modify: `docs/release-session-2026-09-25.md`

**Interfaces:**
- Consumes: `inspirations` from `src/content/inspirations.ts`, `GrowthHeader`, `GrowthFooterLinks`, and `growth-theme.ts`.
- Produces: `GrowthInspirations.astro` with no props; renders seven `data-inspiration-category` sections and 59 `data-inspiration-item` entries.

- [ ] **Step 1: Write the failing route test**

Test `dist/inspirations/index.html` for one `h1`, the shared header/footer, `aria-current="page"` on Inspirations, seven categories, 59 items, the Kana Akatsuki attribution, absence of PostHog, and absence of the promise to organize the page later. Assert all 40 linked entries use `target="_blank"` and `rel="noopener noreferrer"`.

- [ ] **Step 2: Run the test to verify RED**

Run: `node --test scripts/inspirations-page.test.mjs`

Expected: FAIL because the legacy page lacks the shared shell and item/category markers.

- [ ] **Step 3: Implement `GrowthInspirations.astro`**

Render a concise hero, the existing quotation and attribution, and categories in this source order: People, Posts, Talks, Videos, Music, Games, Media. Reuse every existing title, name, author, and destination. Add semantic list markup plus the two stable data attributes for structural tests and future non-vendor measurement. External links get safe new-tab attributes; Games and Media remain text-only.

- [ ] **Step 4: Implement responsive editorial styling**

Create a wide hero/quote pairing on desktop, a sparse two-column category flow where content permits, and a single-column mobile layout. Long titles wrap; links have visible focus and at least 44 px touch height. Do not add imagery or decorative commentary.

- [ ] **Step 5: Replace the route with a thin wrapper and verify GREEN**

`src/pages/inspirations.astro` should only import and render `GrowthInspirations`.

Run: `npm run build && node --test scripts/inspirations-page.test.mjs`

Expected: build exits 0 and all Inspirations assertions pass.

- [ ] **Step 6: Browser review and release note**

Verify 390 × 844, 768 × 900, and 1440 × 900; inspect the longest titles, quote wrapping, all category counts, Day/Night, Explore active state, keyboard focus, and outbound links. Append Result / Friction / Next action and stop for review. Do not commit.

---

### Task 3: Separate Personal from professional background

**Files:**
- Create: `frontend/src/components/GrowthPersonal.astro`
- Create: `frontend/src/styles/personal.css`
- Create: `frontend/scripts/personal-page.test.mjs`
- Modify: `frontend/src/pages/personal.astro:1-140`
- Reuse: `frontend/public/assets/images/notionlogo.jpg`
- Reuse: `frontend/public/assets/images/cats1.jpg`
- Reuse: `frontend/public/assets/images/cats2.jpg`
- Reuse: `frontend/public/assets/images/dogs.jpg`
- Modify: `docs/release-session-2026-09-25.md`

**Interfaces:**
- Consumes: personal and creative-interest copy already present in legacy `personal.astro` and `background.astro`; shared growth shell components.
- Produces: `GrowthPersonal.astro` with no props; renders `music-making`, `movement`, and `home-companions` section IDs.

- [ ] **Step 1: Write the failing page-boundary test**

Test for the shared shell, one `h1`, active Personal navigation, the three section IDs, all four existing image paths, and absence of PostHog. Assert the page does not contain professional-background markers `GEM Employer Fellow`, `University of Illinois Urbana-Champaign`, or `Johns Hopkins CPCR`.

- [ ] **Step 2: Run the test to verify RED**

Run: `node --test scripts/personal-page.test.mjs`

Expected: FAIL because the legacy page repeats professional background and lacks the shared shell/section boundaries.

- [ ] **Step 3: Implement `GrowthPersonal.astro` from existing source only**

Move the existing music/making material from the legacy Background source into `music-making`; keep the existing fitness description and Notion destination in `movement`; keep the existing pets/relationship copy and three pet images in `home-companions`. Do not add or update relationship status, location, routines, achievements, or preferences. External personal links use safe attributes.

- [ ] **Step 4: Implement image-led responsive styling**

Use concise text blocks and a calm asymmetric media layout. Preserve the full visible subject in each image; use `object-fit: contain` unless a crop is explicitly retained from the legacy composition. Stack media on mobile, preserve meaningful alt text, and provide visible link focus.

- [ ] **Step 5: Replace the route wrapper and verify GREEN**

Run: `npm run build && node --test scripts/personal-page.test.mjs`

Expected: build exits 0; professional markers are absent; all personal assets and sections remain.

- [ ] **Step 6: Privacy/currency browser review and release note**

Verify 390 × 844, 768 × 900, and 1440 × 900, image loading/clipping, links, Day/Night, keyboard access, and absence of overflow. Present the preserved personal facts for user review; do not treat them as publishable approval. Append Result / Friction / Next action and stop. Do not commit.

---

### Task 4: Integrate Background & Experience without rewriting dated facts

**Files:**
- Create: `frontend/src/components/GrowthBackground.astro`
- Create: `frontend/src/styles/background.css`
- Create: `frontend/scripts/background-page.test.mjs`
- Modify: `frontend/src/pages/background.astro:1-219`
- Reuse: `frontend/public/assets/images/headshot_500x500.webp`
- Reuse: `frontend/public/assets/images/hopkinslogo.jpg`
- Reuse: `frontend/public/assets/images/uiuclogo.jpg`
- Reuse: `frontend/public/assets/images/gemlogo.jpg`
- Modify: `docs/release-session-2026-09-25.md`

**Interfaces:**
- Consumes: the legacy Background page's existing education, employment, experience, skills, headshot, and institution assets.
- Produces: `GrowthBackground.astro` with no props and semantic `education`, `experience`, and `skills` sections.

- [ ] **Step 1: Write the failing migration test**

Test for the shared shell, one `h1`, `education`, `experience`, and `skills` section IDs, existing institution/headshot assets, preserved markers for JHU Applied Physics Lab, CPCR, UIUC, and the B.S. in Computer Science, and the visible note `Information last reviewed September 2025`. Assert no `posthog`, `doc_downloaded`, inline `onclick`, legacy `SiteLayout` output, direct résumé PDF link, or broken `/resume/` link before the hub exists.

- [ ] **Step 2: Run the test to verify RED**

Run: `node --test scripts/background-page.test.mjs`

Expected: FAIL because the legacy page includes PostHog hooks, SiteLayout, and direct PDF links.

- [ ] **Step 3: Implement `GrowthBackground.astro`**

Recompose the existing source into: a concise identity/header block; the visible snapshot note `Information last reviewed September 2025`; Education; Experience timeline; and a compact Skills section. Preserve existing names, claims, and status wording verbatim where included, with an adjacent source comment stating that dated status claims require content review before publication. Do not promote preserved source text to a newly verified claim. Omit the résumé action in this bounded task so the page never exposes either a direct PDF link or a broken `/resume/` route; Task 5 adds the hub and its action together.

- [ ] **Step 4: Implement responsive timeline styling**

Use restrained borders and spacing rather than cards/badge walls. Keep the headshot and institution marks contained. Timeline semantics must remain readable without CSS; mobile stacks dates and descriptions without horizontal scrolling.

- [ ] **Step 5: Replace the route wrapper and verify GREEN**

Run: `npm run build && node --test scripts/background-page.test.mjs`

Expected: build exits 0; shared shell and source markers are present; analytics and direct PDF links are absent.

- [ ] **Step 6: Browser and content-boundary review**

Verify all target widths, assets, navigation, theme, focus, and the deliberate absence of a résumé action until Task 5. Report every preserved “current” or otherwise time-sensitive statement as awaiting content review. Append Result / Friction / Next action and stop. Do not commit.

---

### Task 5: Add the scalable one-entry Resume hub and centralize navigation

**Files:**
- Create: `frontend/src/content/resumes.ts`
- Create: `frontend/src/components/GrowthResume.astro`
- Create: `frontend/src/styles/resume.css`
- Create: `frontend/src/pages/resume.astro`
- Create: `frontend/scripts/resume-page.test.mjs`
- Create: `frontend/scripts/site-navigation.test.mjs`
- Modify: `frontend/src/content/navInfo.tsx:6-15`
- Modify: `frontend/src/components/GrowthHeader.astro:2-16`
- Modify: `frontend/src/components/GrowthFooterLinks.astro:2-6`
- Modify: `frontend/src/components/GrowthHomepage.astro:46`
- Modify: `frontend/src/components/GrowthBackground.astro`
- Preserve: `frontend/public/assets/files/Resume_09_20_2025.pdf`
- Modify: `docs/release-session-2026-09-25.md`

**Interfaces:**
- Produces: `ResumeEntry = { id: string; title: string; updatedLabel: string; pdfPath: string; emphasis?: string }` and `resumeEntries: ResumeEntry[]` containing exactly one `resume-2025-09-20` entry.
- Consumes: `resumeEntries` in `GrowthResume.astro`; central `navLink` in Header and Footer.

- [ ] **Step 1: Write the failing Resume and navigation tests**

Test `dist/resume/index.html` for one shared-shell page, active Resume state, exactly one `data-resume-entry`, `September 20, 2025`, one View action with safe new-tab attributes, one Download action with `download`, and no AI/Data Engineer placeholders or PostHog. Test every built primary page for exactly one Resume destination inside the Explore menu and exactly one inside the shared footer, with no direct PDF link outside `/resume/`. Test the homepage and Background page for their intended page-specific `/resume/` actions separately. Confirm the PDF file still exists in `dist/assets/files/`.

- [ ] **Step 2: Run the tests to verify RED**

Run: `node --test scripts/resume-page.test.mjs scripts/site-navigation.test.mjs`

Expected: FAIL because `/resume/` does not exist and current links target the PDF.

- [ ] **Step 3: Add the typed résumé collection**

Create the exact interface above and one entry:

- `id`: `resume-2025-09-20`
- `title`: `Resume`
- `updatedLabel`: `September 20, 2025`
- `pdfPath`: `/assets/files/Resume_09_20_2025.pdf`
- omit `emphasis`

- [ ] **Step 4: Implement `GrowthResume.astro` and `resume.css`**

Render a minimal hero plus the collection. Each entry has `data-resume-entry`, visible title/date, “View PDF” linking safely to `pdfPath`, and “Download PDF” linking to the same path with `download`. Render no variant explanation, empty state, or public TBD copy. Use the shared header/footer and `activeExplore="/resume/"`.

- [ ] **Step 5: Centralize Background and Resume routes**

Add Background & Experience and Resume to `navLink` after Personal. Remove the duplicated hard-coded anchors from `GrowthHeader` and `GrowthFooterLinks`. Keep `primaryRoutes` filtering Projects from Explore. Update the homepage Resume action and Background résumé action to `/resume/`; the About footer receives the route through shared footer navigation.

- [ ] **Step 6: Build and verify GREEN**

Run: `npm run build && node --test scripts/resume-page.test.mjs scripts/site-navigation.test.mjs scripts/homepage-principles.test.mjs scripts/about-page.test.mjs scripts/background-page.test.mjs`

Expected: build exits 0; the hub has one entry; primary pages route through `/resume/`; no duplicate navigation links or analytics appear.

- [ ] **Step 7: Browser review and release note**

Verify the hub and Explore menu at all target widths, View/Download behavior, active state, Escape focus return, and PDF loading. Confirm there are no hidden variant cards. Append Result / Friction / Next action and stop. Do not commit.

---

### Task 6: Complete cross-page regression and release QA

**Files:**
- Modify only if a verified routine defect is found in files already owned by Tasks 1-5.
- Modify: `docs/release-session-2026-09-25.md`

**Interfaces:**
- Consumes: the completed About, Blog, Inspirations, Personal, Background & Experience, and Resume routes.
- Produces: one evidence-backed local release-candidate report; no deployment or commit.

- [ ] **Step 1: Run formatting and build integrity checks**

Run: `git diff --check && npm run build`

Expected: diff check exits 0; Astro reports 0 errors and the known hint count only.

- [ ] **Step 2: Run the supported regression suite**

Run all supported `.test.mjs` page tests plus `test-about-audio.mjs` and `test-vine-growth.mjs`. Exclude only the already documented native renderer test if `@napi-rs/canvas` remains undeclared and unavailable; report that exclusion explicitly.

Expected: 0 failures.

- [ ] **Step 3: Audit analytics absence in built output**

Search the built HTML for `posthog`, `sessionRecording`, vendor tracking script URLs, and direct visitor-input transmission. Expected: none on the redesigned routes. Treat semantic `data-*` structure markers as non-tracking and document their purpose.

- [ ] **Step 4: Run responsive browser QA**

At 390 × 844, 768 × 900, and 1440 × 900, walk Home → About → Work → Explore → Inspirations → Personal → Background & Experience → Resume → Blog. Check theme, active state, Explore close/Escape focus, keyboard access, images, PDF actions, no overflow, and no console errors.

- [ ] **Step 5: Record the final result and stop**

Append final Result / Friction / Next action with unresolved content-review items, the absent native renderer dependency if still applicable, and the separate future analytics opportunity. Leave the local site open on the first page requiring user review. Do not publish, deploy, push, commit, or begin analytics implementation.
