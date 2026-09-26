# Maverick Espinosa Personal Portfolio

An Astro portfolio presenting selected engineering work, research, music, writing, inspirations, and a dated résumé through a shared botanical editorial design.

The current redesign is a local release candidate under review. Do not infer that uncommitted work has been published.

## Local development

The application lives in `frontend/`.

```sh
cd frontend
pnpm install
pnpm dev
```

Create a production build with:

```sh
pnpm build
```

Run the supported regression suite with:

```sh
node --test scripts/*.test.mjs scripts/test-about-audio.mjs scripts/test-vine-growth.mjs
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

## Deployment boundary

`.github/workflows/deploy.yml` builds and deploys GitHub Pages on a push to `master` or a manual workflow dispatch. Therefore, pushing `master` is a production action—not merely repository synchronization—and requires explicit release approval followed by live verification.

The source includes a narrow production-only analytics contract. Localhost and preview routes remain inactive. Production analytics must not be enabled until the documented privacy settings and release gates are satisfied.
