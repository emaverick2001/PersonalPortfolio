# Private Staging and Explicit Portfolio Release Gate Design

Date: 2026-09-26
Status: Parked by user on 2026-09-26; resume only after the portfolio redesign is complete

## Intent

Create an intermediate environment where Maverick can review the real built portfolio on an internet-hosted server before the public site changes. The system should be inexpensive, minimally restrictive, understandable without deployment expertise, and explicit about what was tested and approved.

Success means:

- a selected repository revision can be viewed at a private URL;
- only explicitly allowed reviewers can authenticate;
- the staged site is excluded from search indexing and production analytics;
- reviewing staging cannot publish the public site;
- production promotion is a separate, explicit action against the reviewed revision; and
- each candidate records its result, friction, next action, evidence, and approval state.

## Current state

- GitHub Pages is the sole public host for `maverickespinosa.com`.
- `.github/workflows/deploy.yml` currently builds and publishes whenever `master` is pushed, so merging and releasing are not separate actions.
- The Astro configuration treats `https://maverickespinosa.com` as the canonical public site.
- PostHog is host-gated to `maverickespinosa.com`; localhost and Cloudflare preview hostnames do not initialize it.
- The repository has no committed package-manager lockfile, so remote dependency resolution is not yet deterministic.
- The current checkout contains substantial unrelated and uncommitted redesign work. It must be reviewed and preserved before any branch, commit, remote, or workflow changes.

## Decisions

### Hosting boundary

- Keep GitHub Pages as the only production host.
- Use Cloudflare Pages only for authenticated preview deployments.
- Create Cloudflare Pages as a Direct Upload project rather than linking it to `master`. This avoids creating an automatically updated public duplicate of the portfolio and limits Cloudflare's repository access.
- Do not attach the production domain to Cloudflare Pages in this slice.
- Do not publish a production deployment to the Cloudflare Pages project. Staging uploads must use a non-production preview branch name.

### Access boundary

- Protect every Cloudflare preview deployment with Cloudflare Access.
- Use email one-time PIN authentication and an exact-email allowlist.
- Do not use `Everyone`, `All valid emails`, or an email-domain wildcard.
- Keep reviewer email addresses in Cloudflare Access configuration, not in the repository or release record.
- Begin with Maverick as the only reviewer. Additional reviewers can be added later without changing the site.

### Release boundary

- A normal push or merge must not publish production.
- Verification, staging, and production are separate operations.
- Staging is manually dispatched for an exact Git commit SHA.
- Production is manually dispatched for the same reviewed commit SHA only after explicit approval.
- A production job must rebuild and verify that SHA; it must not silently substitute current `master`.
- A failed or canceled verification or staging run cannot trigger production.
- Rollback uses a previously recorded known-good production SHA through the same explicit production workflow.

### Privacy boundary

- Continue using the existing production-host check so Cloudflare preview domains never initialize PostHog.
- Add a staging build marker so every generated page emits `noindex, nofollow` even if a platform header changes.
- Verify Cloudflare's preview `X-Robots-Tag: noindex` header as a second layer.
- Do not add Cloudflare Web Analytics, browser recording, form capture, logs exported to the repository, or any new visitor-data collection.
- The homepage thought interaction remains local to the browser and is neither transmitted nor persisted.

### Audit boundary

- Store one concise repository record per release candidate under `docs/releases/`.
- Record: candidate name, exact SHA, staging URL, build and test results, browser checks, reviewer approval state, result, friction, next action, production outcome, and rollback SHA when relevant.
- Do not record secrets, reviewer email addresses, one-time codes, access tokens, or visitor-level Access logs.
- External dashboard settings that cannot be proven from the repository must be marked as manually verified, with date and verifier, rather than implied by code.

### Daily Focus Coach boundary

- Daily Focus Coach remains parked as a product implementation.
- Its authoritative documentation should record the release-loop decisions because future Coach-to-portfolio work may surface trial evidence through this hub.
- The durable record should state that the portfolio has local, authenticated staging, and public production states; promotion is approval-gated; release checkpoints use `result -> friction -> next action`; analytics remain production-only and privacy-preserving; and no Coach input or visitor input is transmitted by the staging mechanism.
- This documentation change does not authorize a Daily Focus Coach feature, integration, schema migration, automation, or data pipeline.

## System flow

1. Preserve and review the current dirty checkout.
2. Create a reviewed candidate commit on a release branch.
3. Run repository verification against the exact commit.
4. Manually dispatch the staging workflow with that commit SHA.
5. Build with a committed lockfile and upload `frontend/dist` as a Cloudflare preview deployment.
6. Confirm unauthenticated requests are intercepted by Cloudflare Access.
7. Authenticate using an allowlisted email and inspect the deployed site on desktop and mobile.
8. Record checks using `result -> friction -> next action` and stop for review.
9. After explicit approval, manually dispatch production with the same SHA.
10. Rebuild, verify, deploy to GitHub Pages, smoke-test the public URL, and complete the release record.

Production never follows automatically from steps 2 through 8.

## Repository components

### Verification workflow

A GitHub Actions workflow will run the full supported build and interaction-test suite for pull requests and release candidates. It has read-only repository permissions and no deployment credentials.

### Staging workflow

A manual GitHub Actions workflow will:

- require an exact commit SHA as input;
- check out that SHA;
- install the pinned package manager and frozen dependencies;
- run the full verification command;
- build with the staging marker enabled;
- upload only the static build output to a Cloudflare preview branch; and
- report the immutable preview URL and branch alias.

Its Cloudflare token must be scoped only to the one Pages project and stored as a GitHub Actions secret. The token is never printed, copied into documentation, or made available to the public site.

### Production workflow

The existing GitHub Pages workflow will become manual-only. It will require the reviewed commit SHA, repeat verification, build without the staging marker, and deploy through the existing `github-pages` environment. The workflow will make the chosen SHA visible in its summary.

### Site environment contract

The site will expose a small build-time environment distinction with two allowed values: `production` and `staging`. The distinction controls robots directives and provides an inspectable environment marker; it does not change content, routes, visual design, or interaction behavior. Analytics continue to require both the production build value and the canonical production hostname.

### Release record

Each candidate receives one Markdown record. It is an audit artifact, not a status dashboard or analytics store. The record must make observed facts, manual confirmations, failures, and unresolved items distinguishable.

## Failure behavior

- Missing lockfile, missing deployment secret, invalid SHA, failed tests, or failed build: stop before upload.
- Cloudflare upload succeeds but Access is not confirmed: mark staging unsafe, do not share the URL, and do not promote.
- An unallowlisted address reaches the site: revoke the deployment or disable it, correct the policy, and repeat access verification.
- Analytics initializes on staging: treat as a release blocker and fix before review.
- Staging SHA and requested production SHA differ: fail the production workflow.
- Public smoke test fails after deployment: record the failure and redeploy the last known-good SHA through the manual workflow.
- Cloudflare's free plan or account requirements become unsuitable: stop and reassess the provider; do not weaken authentication to keep the workflow moving.

## Verification contract

### Automated

- Existing Astro check and build pass.
- All supplied interaction and regression tests pass.
- Workflow tests or static assertions confirm production deploy has no push trigger.
- Staging output contains `noindex, nofollow` on every page.
- Staging output cannot initialize PostHog.
- Production output retains the approved analytics allowlist and canonical-host guard.
- Workflows use an exact SHA and frozen dependencies.

### Hosted staging

- An unauthenticated browser is redirected to Cloudflare Access.
- An allowlisted reviewer can authenticate with a one-time PIN.
- An unallowlisted email cannot receive working access.
- The deployed revision matches the recorded SHA.
- `X-Robots-Tag` and page metadata both prevent indexing.
- No analytics or thought-input request leaves the browser.
- Desktop and mobile checks cover layout, navigation, keyboard access, reduced motion, images, reversible growth animation, and the thought interaction.

### Production promotion

- Approval is recorded before dispatch.
- The production workflow uses the staged SHA.
- The public site passes a focused smoke test after deployment.
- The release record captures result, friction, next action, and rollback information.

## Phased implementation

1. **Repository readiness:** inventory the dirty checkout, review the current redesign, establish a safe release branch, add a lockfile, and make verification deterministic.
2. **Release separation:** split continuous verification from manual GitHub Pages production deployment.
3. **Private staging:** create the Cloudflare Direct Upload project, exact-email Access policy, restricted token, and manual staging workflow.
4. **Hosted validation:** deploy one candidate, exercise authentication and browser checks, and record the evidence.
5. **Promotion rehearsal:** promote only after approval, then verify production and rollback documentation.

Each phase stops at its own review gate. Creating accounts, secrets, remote branches, commits, deployments, or production changes requires explicit execution approval at the relevant phase.

## Alternatives considered

- **Vercel protected previews:** simpler Git integration, but the free plan's external-collaborator limit and Vercel-account requirement create more reviewer restrictions.
- **A public unlisted preview:** simpler, but a secret URL is not authentication and does not satisfy the private review requirement.
- **Self-hosted VPN or tunnel:** provides strong control but adds device enrollment, availability, and maintenance beyond current needs.

## Non-goals

- Redesigning the approved portfolio.
- Publishing or deploying during specification and planning.
- Adding analytics or changing the approved analytics event taxonomy.
- Collecting visitor or reviewer input.
- Resuming Daily Focus Coach development.
- Cleaning legacy files or improving showcased project narratives in this release-infrastructure slice.
- Moving production hosting away from GitHub Pages.

## Review gate

This specification authorizes planning only after review. It does not authorize commits, pushes, account creation, secret creation, staging deployment, production deployment, or edits to the Daily Focus Coach documentation until its exact authoritative target and patch are confirmed.
