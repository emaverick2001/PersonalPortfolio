# PostHog Delivery Repair Design

Date: 2026-10-07
Status: Approved 2026-10-07

## Goal

Restore trustworthy portfolio analytics by making intentional résumé and same-origin navigation events survive page changes, keeping owner/test traffic out of audience metrics, and proving the behavior before production analytics is reactivated.

## Observed failure

- Production previously received `page_viewed` but did not receive `resume_clicked` with `action: "open_hub"` after two real homepage-to-résumé navigations.
- A source-page `sendBeacon` capture passed local argument tests but still failed live, so another source-page transport tweak is not sufficient evidence.
- The current PDF filename is `Maverick_Espinosa_Resume.pdf`, while the current analytics classifier still recognizes the retired `Resume_09_20_2025.pdf` path.
- Analytics is currently disabled in production, and the private PostHog dashboard remains empty.

## Delivery model

- Classify every interaction into the existing seven-event contract using only controlled properties.
- For a same-origin, same-tab navigation, write one sanitized pending interaction to session storage before navigation. On the destination page, remove and capture that pending interaction before `page_viewed`.
- If session storage is unavailable, fall back to an immediate `sendBeacon` capture.
- For interactions that do not replace the current page, including PDF view/download actions, capture immediately with explicit transport options.
- Use stable `data-resume-action` markers for PDF actions rather than recognizing a versioned filename.
- Never store or send visitor input, query strings, hashes, raw referrers, element text, click coordinates, email addresses, or arbitrary URLs.

The pending handoff contains only an approved event name and its already-approved controlled properties. It is removed on first read, is scoped to the current tab session, and is not an identity or durable visitor profile.

## Internal-traffic boundary

- A browser-local exclusion flag prevents PostHog initialization entirely on the owner's normal browser.
- Visiting the canonical site with `?analytics=exclude` sets that local flag, removes the control parameter from the visible URL, and keeps analytics disabled on subsequent visits in that browser.
- Visiting with `?analytics=include` clears the flag for an explicit verification session, also removes the control parameter, and does not override Do Not Track.
- The exclusion flag is never transmitted to PostHog and never identifies the visitor.
- Staging and localhost remain analytics-disabled independently of this flag.

PostHog's standard person-property internal-user filter is not the primary control because the approved portfolio setup is cookieless, anonymous, and has person profiles disabled. The local exclusion prevents owner events from entering the dataset rather than filtering them after ingestion.

## Privacy and product constraints

- Preserve the existing seven event names and approved event properties.
- Preserve cookieless capture, no person profiles, no replay, no autocapture, no automatic pageviews, no surveys, no experiments, no feature flags, no web-vitals capture, and Do Not Track support.
- Keep the homepage thought interaction completely outside analytics.
- Confirm PostHog IP discard and the approved retention setting before production activation.
- Do not add heatmaps, session replay, visitor identification, or new product metrics in this repair.

## Acceptance criteria

1. A test proves the previous source-only delivery model loses a same-tab navigation event and the new destination handoff captures it exactly once.
2. A test proves the pending payload is removed before capture and malformed or unapproved payloads are discarded.
3. Résumé hub, View PDF, and Download PDF actions emit the correct controlled values using stable markers.
4. Internal exclusion prevents SDK initialization without weakening the production-host, environment, preview-route, or Do Not Track boundaries.
5. The supported regression suite, production-disabled build, and TypeScript checks pass.
6. Browser verification covers desktop and mobile navigation, back/forward behavior, PDF actions, localhost inactivity, and the local exclusion toggle.
7. No production activation occurs until the separately approved commit, push, pull request, merge, staging, and production gates complete.

## Review gate

Stop with the repaired branch, fresh verification evidence, and a local review surface. Do not commit, push, open or merge a pull request, deploy staging, reactivate production analytics, or populate dashboards without the next explicit gate.
