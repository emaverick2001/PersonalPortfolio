# Maverick Espinosa Personal Portfolio

An Astro portfolio presenting selected AI/ML and data work, research, creative systems, music, writing, inspirations, and a résumé through a shared botanical editorial design.

The recruiter-ready redesign is integrated into `master`, but it has not been released to the public website. The next release gate is an authenticated Cloudflare staging review of an exact commit. Repository state, passing checks, staging, and production are deliberately treated as different states.

## Local development

The application lives in `frontend/`.

```sh
cd frontend
pnpm install --frozen-lockfile
pnpm dev
```

Run the supported build, regression suite, and type check with:

```sh
pnpm run verify
```

Individual commands remain available when diagnosing a specific failure:

```sh
pnpm run build
pnpm run test
pnpm run typecheck
```

The optional native Work-artwork screenshot test additionally requires `@napi-rs/canvas`; that package is not currently declared or installed and should not be added implicitly.

## Repository map

- `frontend/src/` — Astro, React, styles, scripts, and content sources.
- `frontend/public/` — static artwork and downloadable assets.
- `frontend/scripts/` — supported regression and preview helpers.
- `docs/superpowers/specs/` — approved product and architecture decisions.
- `docs/superpowers/plans/` — approved implementation plans.
- `docs/release-session-2026-09-25.md` — current release evidence and review gates.
- `docs/collaboration-protocol.md` — Git, branching, documentation, and collaboration workflow.
- `.github/workflows/stage-portfolio.yml` — manual authenticated Cloudflare staging workflow.
- `.github/workflows/deploy.yml` — manual GitHub Pages production-release workflow.
- `AGENTS.md` — mandatory additional rules for automated contributors.

## Collaboration

Read [the collaboration protocol](docs/collaboration-protocol.md) before changing the repository. Its main safeguards are:

- inspect the live checkout and preserve existing changes;
- work within explicitly owned paths;
- use one scoped branch per reviewable outcome;
- isolate concurrent work in non-overlapping worktrees;
- stage exact files instead of using broad Git staging;
- keep specifications, plans, and release evidence in their designated locations;
- treat commits, pushes, merges, and deployments as separate approval gates.

The release branch is `master`. Automated branches use `codex/<short-scope>`. Human branches use `feature/`, `fix/`, or `docs/` prefixes.

## Release environments

The repository uses three distinct environments:

1. **Local development** — `pnpm dev` for implementation and browser review on the contributor's machine.
2. **Authenticated staging** — `.github/workflows/stage-portfolio.yml` manually builds an exact 40-character commit SHA with `PUBLIC_SITE_ENV=staging`, forces analytics off, and uploads it to the private Cloudflare Pages preview protected by Cloudflare Access.
3. **Production** — `.github/workflows/deploy.yml` is manually dispatched with both the release SHA and the previously reviewed staging SHA. The workflow rejects the release unless those full SHAs match.

Merging or pushing `master` does not invoke either release workflow. Integration, authenticated staging, and production deployment remain separate owner approval gates. A successful build or merge must not be described as a deployment.

## Privacy and analytics

The source includes a narrow production-only analytics contract, but analytics defaults to disabled. Local development and authenticated staging must remain analytics-free. Enabling production analytics requires a separate explicit release decision and the documented privacy constraints; the temporary homepage thought interaction must never save or transmit visitor input.
