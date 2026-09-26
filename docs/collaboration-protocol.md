# PersonalPortfolio collaboration protocol

## Purpose

This protocol keeps the portfolio understandable, reviewable, and safe when humans and automated contributors work on it. It protects user-owned changes, keeps Git history scoped, prevents parallel work from colliding, and gives each design decision and verification result one durable home.

The protocol does not authorize a commit, push, merge, deployment, cleanup, or analytics activation. Those remain separate decisions by the repository owner.

## Sources of truth

Use the narrowest authoritative document for the question at hand:

| Concern | Source of truth |
| --- | --- |
| Contributor and Git rules | `AGENTS.md` and this protocol |
| Approved product or architecture decision | `docs/superpowers/specs/` |
| Approved implementation sequence | `docs/superpowers/plans/` |
| Current release evidence and review gates | `docs/release-session-2026-09-25.md` |
| Product source | `frontend/src/` and `frontend/public/` |
| Build and test commands | `frontend/package.json` and this repository's supported test commands |
| Deployment behavior | `.github/workflows/deploy.yml` |

If two documents conflict, stop and resolve the conflict explicitly. A later approved decision can supersede an older one, but the release log must record the ruling and its consequence.

## Work states

Every change moves through these states:

1. **Proposed** — intent and boundaries are described; no mutation is implied.
2. **Approved** — the owner approves the exact design or bounded write set.
3. **In progress** — one contributor owns named paths and performs the approved work.
4. **Verified** — relevant checks have fresh passing evidence; exclusions are named.
5. **Review** — the running result and diff are presented to the owner.
6. **Integrated** — a reviewed commit is reconciled into the intended branch.
7. **Released** — the owner separately authorizes deployment and the live result is verified.

Do not describe an earlier state as a later one. A local build is not a release, an accepted command is not independently verified delivery, and approval to edit is not approval to commit or deploy.

## Preflight

Before writing, record:

- repository root and current branch;
- exact `HEAD` commit;
- staged, tracked, and untracked changes;
- the approved task boundary;
- owned paths and explicitly read-only paths;
- the relevant specification, plan, and release-log entry;
- the verification commands expected for the task.

Existing changes belong to the user unless proven otherwise. If an untracked file has no baseline, inspect it directly and never assume it is disposable.

If branch state or file fingerprints change after preflight, pause. Reinspect and classify the drift before applying or integrating work.

## Branching and worktrees

`master` is the release branch and triggers the GitHub Pages workflow when pushed. It is not a development branch.

- Automated contributors use `codex/<short-scope>`.
- Human contributors use `feature/<short-scope>`, `fix/<short-scope>`, or `docs/<short-scope>` as appropriate.
- One branch contains one coherent reviewable outcome.
- Create a branch from an explicitly observed commit.
- Use a separate worktree for concurrent implementation.
- Give every concurrent worker a non-overlapping owned-path list.
- Assign one integrator to reconcile reviewed worker commits in an explicit order.

A worktree created from a commit does not contain uncommitted changes from another checkout. When the intended release candidate is dirty, do not create a supposedly equivalent worktree or move changes automatically. First inventory and review the candidate, then obtain approval for a checkpoint or other explicit transfer method.

## Ownership and collaboration

Owned paths are the complete mutation allowlist for a task. A path not listed is read-only even when it is not explicitly forbidden.

Before parallel work begins, contributors must agree on:

- task name and intended outcome;
- starting commit;
- owned paths for each contributor;
- shared interfaces that may be read but not edited concurrently;
- integrator and reconciliation order;
- required checks and review gate.

If two contributors need the same path, serialize the work or assign the path to the integrator. Do not rely on a later merge conflict to coordinate design decisions.

## Safe Git operations

Allowed without a separate mutation approval:

- inspecting status, diffs, history, branches, and worktrees;
- running non-mutating validation;
- creating the already-approved scoped files and edits.

Require explicit approval for the exact target and operation:

- creating or switching the release candidate's branch when the source checkout is dirty;
- staging and committing;
- stashing, rebasing, pulling, merging, or cherry-picking;
- pushing or opening a pull request;
- reconciling a worker commit into another branch;
- deploying or manually dispatching the deployment workflow;
- deleting or cleaning files, branches, worktrees, or generated artifacts.

Never use `git add .`, `git add -A`, destructive reset or checkout, force push, or history rewriting as a convenience. Stage exact files only, inspect the staged diff, and confirm the commit contains no unrelated changes.

## Documentation protocol

### Specifications

Specifications explain the approved outcome, constraints, user-visible behavior, and important decisions. They should not become execution diaries.

### Plans

Plans translate an approved specification into bounded implementation and verification steps. Update a plan when the implementation contract changes; do not use it to narrate every command.

### Release evidence

The active release log is append-only except for explicit factual corrections. Each completed slice records:

- **Result** — what changed and what was directly verified;
- **Friction** — failures, uncertainty, exclusions, or decisions that altered the path;
- **Next action** — the next bounded gate, including what remains prohibited.

Do not create additional release logs for the same release merely because another contributor or session begins. Continue the existing log.

### Ideas and parked work

Future features belong in an approved specification, a clearly marked proposal, or the release log's next-action boundary. Do not insert roadmap promises into recruiter-facing copy merely to preserve an internal idea.

### Historical integrity

Do not silently rewrite earlier evidence. When a statement becomes incorrect, append a correction that names the previous claim, the new evidence, and the effect on the decision.

## Verification

Verification must match the risk of the change and use fresh evidence.

For the current Astro site, the release baseline includes:

```sh
cd frontend
npm run build
node --test scripts/*.test.mjs scripts/test-about-audio.mjs scripts/test-vine-growth.mjs
```

Also run `git diff --check` from the repository root. User-visible changes require browser verification at relevant viewport sizes and interaction states. Report unavailable optional checks rather than silently omitting them.

Before a commit, inspect the exact staged paths and staged diff. Before reconciliation, repeat the target checkout's preflight. After reconciliation, confirm the target commit, status, diff, and required checks again.

## Review and release gates

At the end of a slice, provide:

1. changed paths;
2. implementation and decision summary;
3. checks run and their results;
4. exclusions and remaining risks;
5. `Result → Friction → Next action`;
6. the exact approval needed next.

Stop at that gate. Do not infer permission to commit, push, merge, deploy, clean the repository, activate analytics, or begin the next feature.

Because a push to `master` invokes the Pages deployment workflow, pushing `master` is both a Git operation and a production-release action. It always requires explicit release approval and must be followed by live-site verification.
