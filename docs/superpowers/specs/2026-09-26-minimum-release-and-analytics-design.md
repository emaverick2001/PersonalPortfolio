# Minimum Portfolio Release and Analytics Design

Date: 2026-09-26
Status: Approved 2026-09-26

## Goal

Finish the smallest credible portfolio release without inventing personal or professional facts, then add a narrow PostHog measurement layer that can answer basic UI and navigation questions without recording visitor input or replaying sessions.

## Release boundary

- Freeze the approved Inspirations page and its 58 entries, category filters, sorting, and editorial framing.
- Keep Personal and Background & Experience routes and source files, but remove them from visible shared navigation and the sitemap and mark them `noindex` until a privacy and currency review is complete.
- Add `/resume/` as the stable résumé destination with exactly one entry for the existing September 20, 2025 PDF.
- Route visible résumé actions through `/resume/`; keep the existing PDF path working for the hub's View and Download actions.
- Preserve the approved botanical design, all existing portfolio routes, and the transient homepage thought interaction.
- Keep Daily Focus Coach parked. Do not clean legacy files or redesign project stories in this slice.

## Analytics questions

1. Which released pages are viewed?
2. Which shared navigation paths lead visitors deeper into the portfolio?
3. Which projects, résumé actions, and contact actions receive intentional engagement?
4. Are the Inspirations category and sort controls useful?

## Event taxonomy

- `page_viewed`: `path`
- `navigation_clicked`: `destination`, `region`, `source_path`
- `project_opened`: `project_slug`, `source_path`
- `resume_clicked`: `action`, `source_path`
- `contact_clicked`: `channel`, `source_path`
- `inspirations_filter_changed`: `category`
- `inspirations_sort_changed`: `order`

All property values come from controlled route or option values. Do not send textarea/form values, element text, query strings, hashes, click coordinates, raw referrers, email addresses, or arbitrary URLs.

## PostHog privacy contract

- Run only on `maverickespinosa.com` and exclude preview routes.
- Disable autocapture, automatic pageviews, session replay, surveys, feature flags, web experiments, section observation, and web-vitals capture.
- Use cookieless mode, no person profiles, no IP collection, no persistent browser identifier, and respect Do Not Track.
- Do not identify visitors.
- Do not capture homepage thought-interaction submissions or other form input.
- Proposed dashboard retention: 90 days, to be confirmed in PostHog before publication.

## Verification

- Build and run all supported regression tests.
- Assert the résumé hub has one dated entry and two explicit PDF actions.
- Assert Personal and Background are absent from navigation and sitemap, remain buildable, and are `noindex`.
- Assert the PostHog configuration and seven-event allowlist in built output.
- Assert local and preview routes do not transmit analytics.
- In a browser, verify desktop and mobile layout, navigation, keyboard behavior, résumé actions, Inspirations controls, and that the thought interaction remains local-only.
- Inspect network activity so only approved events can leave the published-domain configuration.

## Review gate

Stop with the local site running for review. Do not commit, push, publish, deploy, clean legacy resources, redesign showcased projects, or begin Daily Focus Coach integration.

## Later approved direction

After this release slice is reviewed: audit and clean legacy files/resources; improve showcased project narratives and visuals for recruiters; then return to Daily Focus Coach and explore a portfolio hub connection to the Assistant OS harness and its evidence-producing trials.
