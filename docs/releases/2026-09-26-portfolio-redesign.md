# Portfolio redesign release

## Candidate

- Release: Recruiter-ready portfolio v1
- Reviewed and deployed SHA: `e8aff8490f8fec9c463a8af035ea5776f018cd96`
- Previous production rollback SHA: `06a9b765e678fa720bd0c9975a4567cdf5108e7a`
- Production host: `https://maverickespinosa.com/`
- Release date: 2026-09-28
- Analytics state: disabled

## Authenticated staging

- Workflow: `Stage Portfolio Preview`
- Run: `36483968129`
- Result: success
- Immutable preview: `https://45d305c8.maverick-portfolio-staging.pages.dev`
- Branch alias: `https://review-e8aff8490f8fec9c463a8.maverick-portfolio-staging.pages.dev`
- Environment: staging
- Analytics: disabled
- Automated verification: 78/78 tests passed, TypeScript passed, Astro reported 0 errors, 0 warnings, and 3 existing hints.
- Hosted review: desktop and mobile review completed behind Cloudflare Access; the owner approved promotion of this exact SHA.

## Production promotion

- Workflow: `Release Portfolio to GitHub Pages`
- Run: `36491897565`
- Requested commit SHA: `e8aff8490f8fec9c463a8af035ea5776f018cd96`
- Staged SHA: `e8aff8490f8fec9c463a8af035ea5776f018cd96`
- `enable_analytics`: `false`
- Build job: success
- Deployment job: success
- GitHub Pages deployment record: `6721899583`
- Recorded production SHA: `e8aff8490f8fec9c463a8af035ea5776f018cd96`

## Public smoke test

Result: the public domain returned HTTPS 200 from GitHub Pages and served the redesigned portfolio. Home, Work, About, Resume, the molecule case study, and the preview route loaded with the expected headings and no horizontal overflow at the default desktop viewport and 390 × 844 mobile viewport. Visible images on the sampled routes had no broken resources. The homepage seed-to-plant sequence advanced from frame 0 to 10 and reversed from 10 to 0 under normal scrolling at both viewport sizes. Mobile Explore opened, closed with Escape, and restored focus. The primary résumé exposed distinct view and download actions, and the PDF returned HTTPS 200 as `application/pdf`. The temporary perspective interaction completed its two-step flow and reported that nothing was saved or sent.

Privacy and indexing checks: every sampled production page reported `portfolio-environment=production` and `portfolio-analytics=disabled`; `window.posthog` was absent. The preview route declared `noindex, nofollow`. The canonical homepage and sampled released routes used the HTTPS production host. `robots.txt` returned successfully and advertised `https://maverickespinosa.com/sitemap-index.xml`; the sitemap index returned successfully. The live browser reported no console warnings or errors.

Friction: GitHub Actions reported that several pinned upstream actions still target Node.js 20 and are currently being forced onto Node.js 24, plus an upcoming `ubuntu-latest` migration notice. Neither warning affected this release, but workflow dependency maintenance should be scheduled separately. The current `robots.txt` retains stale Next.js-oriented comments and exclusions from the previous site; its sitemap directive and public crawling behavior are valid, so this is a cleanup item rather than a release blocker. Live browser resource-timing inspection was unavailable, so the no-analytics result is supported by the disabled build marker, absent PostHog runtime, production-disabled workflow input, project-level privacy configuration, and the passing analytics contract—not by an invented network-timing claim.

Next action: keep production analytics disabled until the existing seven-event contract receives a separate activation approval and its release-environment test is deliberately updated. The portfolio redesign release is complete. Resume Daily Focus Coach planning and implementation as a separate project slice; do not mix Coach code, private data, analytics activation, historical PostHog deletion, or portfolio cleanup into this release record.
