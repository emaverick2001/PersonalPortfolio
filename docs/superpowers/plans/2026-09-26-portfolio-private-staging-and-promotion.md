# Portfolio Private Staging and Promotion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move one verified portfolio commit through authenticated Cloudflare staging and then, only after approval, publish that same commit to GitHub Pages with a documented rollback point.

**Architecture:** Push the finished release-candidate branch for review, merge it without deploying, create a Direct Upload Cloudflare Pages project whose preview deployments are protected by Access, and dispatch staging for the exact resulting `master` SHA. After hosted desktop/mobile review, production is a separate manual workflow dispatch for that identical SHA with analytics disabled.

**Tech Stack:** GitHub, GitHub Actions, Cloudflare Pages Direct Upload, Cloudflare Access one-time PIN, Wrangler, GitHub Pages, Astro static output.

**Spec:** `docs/superpowers/specs/2026-09-26-private-staging-release-gate-design.md`

## Global Constraints

- Execute this plan only after `2026-09-26-portfolio-release-foundation.md` is complete and locally verified.
- Do not put reviewer email addresses, Cloudflare account IDs, API tokens, one-time codes, or Access logs in Git, workflow summaries, or release records.
- Use a Cloudflare Direct Upload project named `maverick-portfolio-staging`; do not connect the GitHub repository and do not attach `maverickespinosa.com`.
- Protect all preview deployments with Cloudflare Access using one-time PIN plus an exact-email allowlist; never allow Everyone, all valid emails, or a domain wildcard.
- The first public release must dispatch with analytics disabled.
- Push, pull request, merge, Cloudflare resource creation, secret creation, staging dispatch, and production dispatch are separate approval gates.
- A staged SHA and production SHA mismatch is a hard stop.
- A failed access, privacy, build, test, browser, or public smoke check is a hard stop; do not weaken authentication or skip evidence to continue.

## Review Focus

- The primary `<project>.pages.dev` address must not become an unprotected duplicate; only Access-protected preview deployments are shared.
- Enabling one-time PIN alone is unsafe; the Allow policy must also contain the exact approved email selector.
- The immutable deployment URL and the branch alias must both require authentication before site content is returned.
- GitHub secrets must be available only to the staging workflow and never echoed; repository variables may contain only the non-secret project name.
- Production must use the exact hosted-review SHA and preserve the previous public SHA as the rollback target.

---

### Task 1: Publish the release candidate for review without deploying

**Files:**
- No source changes.

**Interfaces:**
- Consumes: the final clean local SHA from the release-foundation plan.
- Produces: a reviewed commit on `master` whose workflow definitions are available for manual dispatch while the existing public site remains unchanged.

- [ ] **Step 1: Reconcile remote state read-only**

Fetch `origin` after explicit network approval. Compare local `master`, `origin/master`, and `codex/portfolio-release-candidate`; stop if remote master has unexpected commits or the working tree is not clean.

- [ ] **Step 2: Push only the candidate branch after the explicit push gate**

Push `codex/portfolio-release-candidate` to `origin` without force and confirm the remote SHA matches local HEAD.

- [ ] **Step 3: Open and review a pull request after the explicit PR gate**

Target `master`, summarize the redesign, privacy boundaries, analytics-disabled launch, verification totals, and workflow separation. Attach the created pull request to the current Codex task.

- [ ] **Step 4: Merge only after the explicit merge gate**

Use the repository's normal GitHub merge method. Confirm that the merged `master` workflow contains no push-triggered production deployment. Record the resulting full `master` SHA; this becomes both the staging and production candidate.

- [ ] **Step 5: Confirm the public site did not change**

Check GitHub Actions and `https://maverickespinosa.com/`. Expected: verification may run, but GitHub Pages production does not deploy automatically and the old public SHA remains live.

---

### Task 2: Create the private Cloudflare preview boundary

**Files:**
- No repository files; dashboard configuration only.

**Interfaces:**
- Consumes: one Cloudflare account and the exact private reviewer email supplied interactively by Maverick.
- Produces: Direct Upload project `maverick-portfolio-staging` with Access-protected preview deployments.

- [ ] **Step 1: Create the Direct Upload project after the explicit account-creation gate**

In Workers & Pages, create `maverick-portfolio-staging` as Direct Upload. Do not connect GitHub, attach the production domain, or upload a production deployment.

- [ ] **Step 2: Enable preview deployment Access**

Open Pages project Settings → General → Enable access policy for preview deployments. Configure an Allow policy whose Include selector is Maverick's exact email and whose required login method is one-time PIN. Confirm there is no Everyone, All valid emails, email-domain, or wildcard Allow rule.

- [ ] **Step 3: Create the least-privilege upload token**

Create one custom Cloudflare API token with Account → Cloudflare Pages → Edit scoped to the relevant account. Do not grant DNS, zone, Access-policy, Workers, or account-administration permissions to the upload token.

- [ ] **Step 4: Add GitHub Actions configuration after the explicit secret gate**

Add repository secrets `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`. Add repository variable `CLOUDFLARE_PAGES_PROJECT` with value `maverick-portfolio-staging`. Never paste their values into chat, files, logs, or release records.

- [ ] **Step 5: Manually verify the dashboard boundary**

Record only the verification date and verifier in the later release record: Direct Upload, no Git integration, no custom domain, preview Access enabled, exact-email Allow rule, one-time PIN required, and no analytics product enabled.

---

### Task 3: Stage the exact candidate SHA

**Files:**
- Create after the content SHA exists: `docs/releases/2026-09-26-portfolio-redesign.md`

**Interfaces:**
- Consumes: the full merged `master` SHA and the configured staging workflow.
- Produces: an authenticated immutable Cloudflare preview URL, branch alias, and candidate evidence record.

- [ ] **Step 1: Dispatch staging after the explicit staging gate**

Run the `Portfolio staging` workflow with the full merged SHA. Do not dispatch against a branch name or short SHA.

- [ ] **Step 2: Verify workflow output**

Confirm checkout SHA, frozen install, full tests, staging build, and Direct Upload all pass. Capture the immutable preview URL and `review-<full-sha>` branch alias; do not expose credentials.

- [ ] **Step 3: Create the release record**

Create `docs/releases/2026-09-26-portfolio-redesign.md` containing candidate name, full SHA, staging URLs, automated results, approval state `pending`, analytics state `disabled`, current production rollback SHA, and empty hosted-review result fields—not secrets, reviewer identity, or visitor data.

- [ ] **Step 4: Commit and push only the audit record after its separate gates**

Commit the record on the release branch or a documentation branch. It is not part of the staged content SHA and must not change which revision is promoted.

---

### Task 4: Verify authenticated staging

**Files:**
- Modify: `docs/releases/2026-09-26-portfolio-redesign.md`

**Interfaces:**
- Consumes: the immutable staging URL, branch alias, exact candidate SHA, and Access policy.
- Produces: recorded hosted QA evidence and a production approval request.

- [ ] **Step 1: Verify anonymous denial**

Open both staging URLs in a signed-out/private browser. Expected: Cloudflare Access intercepts before portfolio content is returned.

- [ ] **Step 2: Verify allowlisted and unallowlisted behavior**

Authenticate with Maverick's allowlisted email and one-time PIN. Attempt access with an address absent from the exact-email policy and confirm it cannot obtain working site access. Do not record either address or the one-time code.

- [ ] **Step 3: Verify indexing and analytics boundaries**

Confirm `X-Robots-Tag: noindex` on both URLs, `noindex, nofollow` in every sampled page head, `portfolio-environment=staging`, `portfolio-analytics=disabled`, no PostHog request, and no thought-interaction request.

- [ ] **Step 4: Run hosted browser QA**

At 390 × 844, 768 × 900, and 1440 × 900, check Home, About, Work, the two released case studies, Research, Blog/article, Music, Inspirations, Personal, Background, and Resume. Verify layout, no horizontal overflow, navigation, keyboard focus, theme persistence, reduced motion, image loading, reversible seed growth, Work vine reversal, résumé actions, outbound links, and the local-only thought interaction.

- [ ] **Step 5: Update the release record**

Record Result, Friction, Next action, viewport coverage, privacy checks, and approval state. Stop and request production approval; do not dispatch production in the same step.

---

### Task 5: Promote the staged SHA to GitHub Pages

**Files:**
- Modify after deployment: `docs/releases/2026-09-26-portfolio-redesign.md`
- Modify: `docs/release-session-2026-09-25.md`

**Interfaces:**
- Consumes: explicit production approval and identical `commit_sha` and `staged_sha` values.
- Produces: the approved redesign at `https://maverickespinosa.com/`, with analytics disabled and a recorded rollback SHA.

- [ ] **Step 1: Dispatch production after the explicit deployment gate**

Run the manual GitHub Pages workflow with `commit_sha=<reviewed full SHA>`, `staged_sha=<same full SHA>`, and `enable_analytics=false`.

- [ ] **Step 2: Verify the deployment job**

Confirm SHA equality, frozen verification, production build, artifact upload, and GitHub Pages deployment all pass. Record the deployment URL and workflow run without claiming success from workflow acceptance alone.

- [ ] **Step 3: Smoke-test the public domain**

Verify Home, Work, About, Resume, one case study, navigation, theme, seed reversal, mobile layout, images, sitemap index, robots file, HTTPS, canonical host, and absence of PostHog requests. Confirm preview routes remain `noindex` and private headshots are unavailable.

- [ ] **Step 4: Complete the release record**

Record production outcome, exact deployed SHA, previous production rollback SHA, public smoke-test result, Result, Friction, and Next action. Mark analytics `disabled pending separate privacy-settings review`.

- [ ] **Step 5: Commit and push the final audit update after separate approval**

Stage only the two documentation files and commit `docs: record portfolio production release`. Because production is manual-only, this documentation push must not create another deployment; verify that no Pages release started.

---

### Task 6: Exercise rollback only if the public smoke test fails

**Files:**
- Modify: `docs/releases/2026-09-26-portfolio-redesign.md`

**Interfaces:**
- Consumes: the recorded previous known-good production SHA.
- Produces: a manual redeployment of that known-good SHA and an auditable failure record.

- [ ] **Step 1: Stop normal promotion work on any public failure**

Do not patch production directly or deploy an unreviewed commit.

- [ ] **Step 2: Dispatch the production workflow with the known-good SHA in both SHA inputs**

Keep `enable_analytics=false`. Verify the workflow and public domain independently.

- [ ] **Step 3: Record the rollback**

Document the failed SHA, observed failure, rollback SHA, restored public result, friction, and next action without storing visitor or credential data.
