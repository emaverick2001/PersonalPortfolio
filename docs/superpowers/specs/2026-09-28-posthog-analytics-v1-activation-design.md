# PostHog Analytics v1 Activation Design

Date: 2026-09-28
Status: Approved 2026-09-28

## Goal

Activate the portfolio's existing seven-event PostHog contract and create one private native PostHog dashboard that gives the owner something useful to inspect immediately. This slice favors the fastest trustworthy measurement baseline over new instrumentation or a custom administration interface.

The dashboard should answer what released pages and actions receive attention. It must not imply that anonymous visitors have been identified or that the current event contract measures acquisition source, geographic origin, section-level attention, sessions, or retention.

## Decision

Use the existing event taxonomy without adding events or properties. Keep PostHog as the initial private analysis surface. Defer the custom portfolio dashboard, source attribution, section activity zones, and recruiter-intent measurement until a later design slice informed by real event volume.

This is an activation and dashboard-configuration slice, not a redesign of portfolio analytics.

## Existing event contract

The implementation preserves these exact events and controlled properties:

| Event | Properties |
| --- | --- |
| `page_viewed` | `path` |
| `navigation_clicked` | `destination`, `region`, `source_path` |
| `project_opened` | `project_slug`, `source_path` |
| `resume_clicked` | `action`, `source_path` |
| `contact_clicked` | `channel`, `source_path` |
| `inspirations_filter_changed` | `category` |
| `inspirations_sort_changed` | `order` |

The event filter continues to reject unapproved event names and remove undeclared properties before transmission.

## Dashboard questions and views

Create one private PostHog dashboard named `Portfolio activity` with a default 30-day window and comparison to the previous 30 days.

1. **Page interest**
   - Measure: total `page_viewed` events.
   - Breakdown: `path`.
   - Decision supported: which released pages merit deeper review or improvement.
   - Caveat: this is an event count, not a verified count of people or sessions.

2. **Engagement activity**
   - Measure: event totals for `navigation_clicked`, `project_opened`, `resume_clicked`, `contact_clicked`, `inspirations_filter_changed`, and `inspirations_sort_changed`.
   - Display: trend over time with each event as a separate series.
   - Decision supported: whether visitors are doing more than loading pages and which interaction class deserves investigation.

3. **Project interest**
   - Measure: total `project_opened` events.
   - Breakdown: `project_slug`.
   - Decision supported: which project stories attract intentional opens.

4. **Resume intent**
   - Measure: total `resume_clicked` events.
   - Breakdown: `action`.
   - Decision supported: whether visitors open the resume hub, view the PDF, or download it.

5. **Navigation choices**
   - Measure: total `navigation_clicked` events.
   - Breakdowns: `destination` and `region`, using separate views if PostHog cannot present both clearly in one insight.
   - Decision supported: which shared navigation paths visitors use.

6. **Contact intent**
   - Measure: total `contact_clicked` events.
   - Breakdown: `source_path`.
   - Decision supported: which page preceded an intentional contact action.

7. **Inspirations controls**
   - Measures: `inspirations_filter_changed` by `category` and `inspirations_sort_changed` by `order`.
   - Decision supported: whether the curated controls receive meaningful use.

Empty cards are acceptable immediately after activation. They must not be populated with sample data or historical claims.

## Architecture and data flow

```text
Public production page
  -> production/environment/route gate
  -> typed event capture
  -> final event/property allowlist
  -> privacy-configured PostHog project
  -> private PostHog insights and dashboard
  -> owner interpretation and later portfolio decisions
```

The public browser receives only the PostHog project token already present in the approved client integration. Dashboard and query credentials remain inside the owner's PostHog account and are never embedded in the portfolio.

## Activation contract

The current release workflow already accepts `enable_analytics`. The implementation changes only the rendered-output test that still treats analytics-disabled output as the only valid production state.

The revised contract must prove all three supported build states:

- staging with analytics disabled;
- production with analytics disabled;
- production with analytics enabled.

Staging must never report analytics enabled. Runtime analytics must initialize only when the environment is production, the explicit release input is enabled, the hostname is exactly `maverickespinosa.com`, and the path is not a preview route. The existing runtime tests for invalid environments, localhost, Cloudflare preview hosts, disabled production, and preview routes remain required.

No event, property, SDK configuration, or portfolio interaction changes in this slice.

## Privacy and truthfulness boundary

Retain the approved settings and code constraints:

- cookieless capture;
- no person profiles or visitor identification;
- Do Not Track respected;
- IP discard enabled in the PostHog project;
- no autocapture, session replay, heatmaps, surveys, feature flags, experiments, performance capture, or web-vitals capture;
- no visitor input, element text, query strings, hashes, click coordinates, raw referrers, email addresses, or arbitrary URLs;
- no homepage thought-interaction data;
- no analytics on localhost, authenticated staging, Cloudflare preview hosts, or preview routes.

The dashboard must not label event counts as unique people, sessions, retention, recruiter activity, traffic source, geographic location, dwell time, or section attention. Those require separate evidence and approval.

## Implementation boundary

Expected repository changes:

- modify `frontend/scripts/release-environment.test.mjs` to express the three-state build contract;
- append activation evidence to `docs/release-session-2026-09-25.md` after verification.

`frontend/src/utils/analytics.ts`, `frontend/src/components/PostHog.astro`, and the seven-event allowlist are read-only unless a failing test proves the existing implementation does not satisfy this specification. Any newly discovered product-code change upgrades the scope and returns to owner review before implementation.

Expected external changes:

- create the private `Portfolio activity` dashboard and its source-backed insights in the existing PostHog project;
- enable analytics only through the existing manual production workflow after the exact merged SHA passes authenticated staging review.

No PostHog insight or dashboard may be made public or embedded in the portfolio.

## Verification and release sequence

1. Write the enabled-production build expectation first and confirm it fails against the current disabled-only test contract.
2. Update only the release-environment test logic.
3. Run focused environment, analytics, and workflow tests.
4. Run complete staging-disabled, production-disabled, and production-enabled verification builds.
5. Confirm the enabled production build still rejects preview-route initialization through the existing runtime contract.
6. Create and inspect the private PostHog dashboard without sample data.
7. Commit, push, open a pull request, and merge only through their separate approval gates.
8. Stage the exact merged SHA with analytics disabled and complete authenticated review.
9. Promote that same SHA through the manual production workflow with `enable_analytics=true`.
10. Verify the public build reports production analytics enabled on released routes, preview routes remain runtime-excluded, and PostHog receives only clearly identified verification events from the owner.
11. Confirm those events appear in the intended dashboard cards and record Result, Friction, and Next action.
12. Stop. Do not add events or continue into dashboard expansion.

## Rollback

If analytics initialization, payloads, site behavior, or PostHog configuration do not match this contract, rerun the manual production workflow for the same reviewed SHA with `enable_analytics=false`. This restores an analytics-disabled build without changing the portfolio source or deleting evidence needed to diagnose the failure.

If the portfolio itself regresses, use the previously recorded production rollback SHA through the normal exact-SHA release process. Do not disable privacy settings, widen capture, or bypass the test contract to make a dashboard populate.

## Acceptance criteria

- The private PostHog dashboard contains the approved views and no invented data.
- All three release build states pass their intended contracts.
- Staging and preview contexts remain analytics-disabled at runtime.
- Production initializes only the approved seven-event contract after explicit activation.
- Owner-generated verification activity arrives with only approved properties.
- No visitor identity, raw source, location, section, replay, input, or recruiter claim is introduced.
- The activation and dashboard evidence is recorded with Result, Friction, and Next action.
- The slice stops before any custom admin dashboard, additional event, attribution work, or Daily Focus Coach implementation.

## Deferred work

- recruiter-identification or recruiter-intent metrics;
- traffic-source, referral, UTM, or geographic attribution;
- section-level activity zones, scroll depth, dwell time, or heatmaps;
- retention, stickiness, lifecycle, or unique-visitor claims;
- a custom authenticated portfolio administration dashboard;
- alerts, scheduled summaries, AI-generated recommendations, or automated design changes;
- historical PostHog data deletion;
- Daily Focus Coach and morning-routine automation work, which resumes after this activation slice closes.
