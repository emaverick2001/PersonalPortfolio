# Remaining portfolio pages: minimal editorial integration

Date: 2026-09-26
Status: Approved 2026-09-26

## Purpose

Complete the remaining portfolio redesign without expanding the approved visual language or inventing personal and professional claims. The updated pages should feel like one site: warm ivory, forest green, editorial typography, botanical restraint, concise copy, and clear navigation. Each page should have a distinct role so visitors do not encounter the same biography in several places.

## Outcomes

- Remove the promotional endings from About and Blog while preserving their standard navigation footers.
- Bring Inspirations, Personal, and Background & Experience into the approved shared shell.
- Separate personal material from professional history.
- Add a minimal `/resume/` hub that exposes only the existing September 2025 résumé PDF while its content awaits a separate review.
- Route existing résumé links through the hub while keeping the existing PDF available to view or download.
- Preserve existing source assets and content unless this brief explicitly moves or trims them; do not imply that dated material has been reverified.
- Keep the work local and review-gated. Do not publish, deploy, push, commit, add analytics, or collect visitor data.

## Shared design system

All affected pages and the résumé hub use the existing `GrowthHeader`, `GrowthFooterLinks`, theme controls, warm-ivory and forest-green palettes, editorial type, responsive content insets, focus treatment, and day/night behavior.

The pages should avoid promotional footer headings, decorative microcopy, archive counts, repeated summaries, and grey explanatory asides. Page introductions should state the page's purpose once, then let the content carry the experience. Existing visual assets may be recomposed or resized, but not replaced with unrelated imagery in this slice.

## Page designs

### About

Keep the approved About page and interactive sound garden unchanged. Remove only the “There’s more to explore” footer heading. The shared portfolio and social links, preview disclosure, contact action, and audio consent/lifecycle behavior remain.

### Blog

Keep the approved Writing index, search, filtering, pagination, articles, artwork, and article reading layouts unchanged. Remove the entire “Keep exploring / Different forms, related questions” promotional block from the Blog index. The shared portfolio and social footer links remain.

### Inspirations

Purpose: a quiet record of influences rather than an exhaustive personal essay.

- Use one concise introduction.
- Retain the existing Kana Akatsuki quotation as the page's primary editorial anchor, with its attribution.
- Preserve every existing inspiration entry and destination.
- Present People, Posts, Talks, Videos, Music, Games, and Media as sparse, readable categories rather than legacy bullet lists.
- Remove apologetic or provisional language such as promises to organize the page later.
- External links remain explicit outbound actions with safe link attributes.
- Do not add new influences, commentary, or claims.

### Personal

Purpose: show the human life around the work without repeating the professional résumé.

- Remove the professional Background section from this page; professional education and employment belong on Background & Experience.
- Preserve the existing fitness, pets, relationships, and creative-interest material from Personal and the legacy Background page, subject to a privacy and currency review before publication.
- Keep the existing pet and activity imagery, using contained or intentionally composed crops with accessible names.
- Organize the page around a few short sections such as Music and making, Movement, and Home and companions.
- Use brief descriptions and image-led composition. Do not turn the page into another biography or project archive.
- Do not infer relationship status, location, routines, or other personal facts beyond the existing source.

### Background & Experience

Purpose: one factual professional narrative for education, roles, selected work, and skills.

- Replace the legacy `SiteLayout` presentation with the approved shared shell.
- Use a concise introduction followed by an editorial timeline for education and experience.
- Consolidate professional material removed from Personal when it is current and supported.
- Preserve existing employers, education, skills, and project references as source material, but do not silently treat old “current” statements, locations, dates, or availability as verified.
- Present the professional narrative as a dated content snapshot with a visible “Information last reviewed September 2025” note until a separate content review verifies it.
- Remove PostHog handlers and all visitor analytics from the page.
- Keep a compact skills/toolbox presentation only where it helps someone understand the work; avoid a wall of badges.
- Link to the résumé hub rather than directly to the PDF.
- Mark unresolved content for internal review in source or project notes, never as public “TBD” copy.

### Resume hub

Route: `/resume/`

Purpose: provide one stable place for résumé selection without crowding the homepage or exposing unfinished variants.

- Initially show only the existing September 2025 résumé PDF, labeled by its actual date rather than described as current.
- Display its descriptive title and visible last-updated date.
- Provide separate “View PDF” and “Download PDF” actions.
- Preserve the existing PDF file and do not rewrite its contents in this visual-integration slice.
- Do not show empty cards, “coming soon,” or public TBD labels for AI Engineer, Data Engineer, or other future variants.
- Structure the page so verified variants can be added later as independent entries with the same title, emphasis, date, view, and download fields.
- Future tailored versions may reorder or emphasize verified evidence, but must not change dates, titles, employment status, or outcomes without support.

## Navigation and routing

- Homepage Resume, shared Explore navigation, About, and Background & Experience link to `/resume/`.
- `/resume/` owns the choice between viewing and downloading the existing PDF.
- The PDF remains directly accessible at its existing asset path so old links do not break.
- Inspirations, Personal, Background & Experience, and Resume expose the correct active navigation state.
- Existing portfolio, social, project, blog, and music routes remain unchanged.

## Accessibility and responsive behavior

- One `h1` per page with a logical heading sequence.
- Keyboard-visible focus for navigation and all outbound actions.
- Sufficient touch targets on phone and tablet.
- No horizontal overflow at 390 px, 768 px, or 1440 px widths.
- Images retain useful alternative text, load successfully, and avoid accidental clipping.
- Theme controls, Explore dismissal, Escape focus return, and reduced-motion behavior remain consistent with the approved pages.
- PDF actions are named by behavior so visitors can distinguish viewing from downloading.

## Privacy and data handling

- No PostHog, analytics, tracking pixels, visitor-input persistence, or new external embeds.
- External destinations open safely where a new tab is appropriate.
- Personal-page facts and images receive an explicit privacy and currency review before publication.
- No résumé variant or background statement is presented as current until its source has been checked.

## Future analytics compatibility

Analytics remain outside this implementation. A later, separately approved measurement slice may use PostHog or another analytics library to study UI/UX and support website-refinement tools. That slice must begin with explicit research questions, a minimal event taxonomy, privacy and consent decisions, retention rules, Do Not Track behavior, and a review of what data is necessary.

The current pages should preserve semantic landmarks, stable routes, accessible control names, and clear component boundaries so future measurement can target meaningful interactions without rewriting page structure. Do not add vendor-specific scripts, event calls, tracking attributes, persistent identifiers, session replay, or visitor-input capture now.

## Verification

- Add focused build-output tests for the two removed promotional blocks, the shared shell on each migrated route, résumé-hub routing, the absence of analytics, preserved category/item counts, and correct production links.
- Run the full Astro check and static build.
- Run the supported regression suite for Home, About audio, Work, Research, Blog, Music, and the new pages.
- Browser-test day/night behavior, navigation, keyboard access, outbound links, images, and responsive layouts at 390 × 844, 768 × 900, and 1440 × 900.
- Confirm the existing PDF can both open and download without transmitting visitor information.

## Delivery order and review gates

1. Remove the approved About and Blog promotional blocks.
2. Integrate Inspirations and pause for review.
3. Integrate Personal and perform a privacy/currency review before treating its content as publishable.
4. Integrate Background & Experience using only verified or explicitly preserved facts.
5. Add the one-entry Resume hub and update internal résumé links.
6. Run the complete cross-page browser walkthrough and stop for release review.

Each page remains a bounded review slice. Approval of this design does not authorize publication, content invention, résumé tailoring, or work on future résumé variants.

## Excluded scope

- Publishing, deployment, pushing, committing, or analytics.
- Creating AI Engineer, Data Engineer, or other tailored résumé files.
- Rewriting the current PDF.
- Inventing professional outcomes, dates, current roles, relationship status, locations, or personal routines.
- Replacing the approved visual system or adding new decorative imagery before a visual direction is selected.
- Daily Focus Coach development or other new product features.
