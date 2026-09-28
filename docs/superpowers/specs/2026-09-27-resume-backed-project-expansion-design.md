# Resume-Backed Project Expansion Design

Date: 2026-09-27
Status: Approved 2026-09-27

## Decision

Extend the recruiter-ready Work page with the strongest reviewed technical evidence already present in Maverick's current resume and project records:

1. add Symbiotic-SWE as the missing resume-backed flagship;
2. add Semantic-Aware Chunk-Level KV Cache Eviction as a five-person collaborative research case study;
3. remove the generic `The Standard` footer from Work because the case studies should demonstrate that structure rather than explain it;
4. keep Daily Focus Coach in development and do not expand it;
5. create a public-claim review checklist for APL, but publish no new APL project or case-study copy in this slice.

This decision supersedes the earlier Portfolio v1 constraints that released exactly two flagship case studies and deferred the semantic KV-cache case study. It does not supersede the evidence, privacy, visual-design, or release gates.

## Work hierarchy

The Work page order is:

1. Symbiotic-SWE;
2. Molecule Generation with Reinforcement Learning;
3. Semantic-Aware Chunk-Level KV Cache Eviction;
4. Pure Data Synthesizer + Visualizer;
5. Daily Focus Coach, still labeled `In development`.

Each released case study must make the question, individual contribution, system, evidence, friction, and next action understandable without claiming more than the source supports.

## Symbiotic-SWE evidence boundary

- Public source: `https://github.com/emaverick2001/CS-527-Symbiotic-SWE`.
- Scope: a neuro-symbolic software-repair and evaluation system for a held-out 14-task SymPy subset.
- Supported result: the `neural_cegf` condition resolved 5 of 14 tasks (35.7%) versus 2 of 14 (14.3%) for `neural_only`.
- Supported trade-off: `neural_cegf` used more average tokens and runtime.
- Required limitations: one repository family, small descriptive sample, incomplete solver coverage, and recurring patch-application failures.
- Do not generalize the result to all SWE-bench tasks or claim universal cost efficiency.

## SACKV evidence boundary

- Primary evidence: the final May 15, 2026 project report at `/Users/maver/Documents/Research/Projects/AI/sackv/CS598_Final_Report.pdf`.
- Attribution: five-person course collaboration by Maverick Espinosa, Aarul Dhawan, Yu Fu, Naman Raina, and Keshav Trikha.
- Maverick's supported contribution: led the offline pipeline and chunk-level utility formulation; defined the end-to-end dataflow, shared offline/online feature contract, trace structure, and implementation/methodology documentation; helped transition from the MLP predictor to a parameterized utility and tune coefficients; helped run cluster smoke tests.
- Supported live warmup result: at 30% eviction on 50 MuSiQue examples, the system freed 713 cache blocks, representing an estimated 654 MB, with 0% quality delta and 56% higher latency than no eviction.
- Required limitations: the result is a small live warmup, the memory number is an estimate, latency regressed, 40% budgets degraded quality, and the prototype was not production-ready.
- Keep the report private and provide no external repository or report link until a shareable source is separately approved.

## APL disclosure boundary

The checklist may contain only facts already present in the reviewed public resume and neutral approval categories. It must not add system names, customers, missions, datasets, screenshots, diagrams, code, architecture, performance figures, or operational scenarios. Every future public sentence remains an owner approval gate.

## Visual and interaction boundary

- Preserve the existing warm ivory/forest green, editorial, botanical design.
- Use static, accessible system diagrams and evidence summaries; do not add decorative 3D scenes or mandatory animation.
- Preserve night-first theme behavior, keyboard access, reduced motion, and mobile layouts.
- Do not add visitor-data collection, persistence, forms, external embeds, analytics behavior, or new input handling.

## Release boundary

This slice is local review work only. It does not authorize a commit, push, pull request, merge, publication, deployment, analytics activation, GitHub-profile edit, or external repository change.
