# Repository collaboration rules

These rules apply to every automated contributor working in this repository. Human contributors follow the same workflow through [the collaboration protocol](docs/collaboration-protocol.md); automated contributors have the additional restrictions below.

## Before changing files

1. Read `docs/collaboration-protocol.md` and the task's approved specification or plan, if one exists.
2. Inspect the current branch, `HEAD`, staged changes, tracked changes, and untracked paths.
3. State the task boundary and the exact paths you own. Paths outside that list are read-only.
4. Treat all existing changes as user-owned unless the current task explicitly identifies them as yours.
5. If the checkout changed after preflight, stop and reclassify the drift before integrating anything.

## Git safety

- The release branch is `master`. Do not commit directly to it.
- Automated work uses `codex/<short-scope>` branches. Start from an explicitly observed commit, not an assumed remote state.
- Do not create a branch or worktree from a dirty release candidate until the owner approves how that candidate will be checkpointed.
- Concurrent work requires separate worktrees, non-overlapping owned paths, and one named integrator.
- Never run destructive cleanup, hard reset, force checkout, history rewrite, or force push.
- Do not stash, rebase, pull, merge, cherry-pick, or resolve another contributor's work without explicit approval for that exact operation.
- Never use broad staging such as `git add .` or `git add -A`. Stage exact reviewed paths only.
- Committing, pushing, opening or merging a pull request, and deploying are separate approval gates. Permission for one does not imply another.

## Documentation and logs

- `docs/superpowers/specs/` records approved design intent.
- `docs/superpowers/plans/` records implementation steps derived from an approved design.
- `docs/release-session-2026-09-25.md` is the current release evidence log. Append one `Result`, `Friction`, and `Next action` entry per completed slice; do not create a competing session log.
- `docs/collaboration-protocol.md` is the repository workflow contract. Update it deliberately; do not hide policy changes inside a task log.
- Preserve historical entries. Correct a factual error with an explicit correction note instead of silently rewriting history.
- Record observed evidence separately from inference, unresolved questions, and future ideas.
- Do not add generated output, temporary diagnostics, downloaded handoffs, or private visitor data to the repository.

## Verification and handoff

- Run checks appropriate to the changed paths, then run the supported regression suite and production build before claiming release readiness.
- Report the exact commands, results, exclusions, and remaining risks.
- End substantive slices with `Result → Friction → Next action`.
- Stop for review when the approved scope is complete. Do not use spare time to expand the scope.
