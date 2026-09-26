# Work + first case study proposal

## Observed need
The existing project content includes placeholder prose and unverified descriptions. The Work page should make one real contribution understandable before increasing visual or content density.

## Bounded proposal
Keep /projects/ as the Work destination. Start with one featured case study and preserve the remaining projects as a browsable collection. Use the shared portfolio header, typography, palette and footer. Case study order: human/creative question, interaction, system mapping, implementation evidence, limitations, next question.

## First candidate: Pure Data Synthesizer + Visualizer
Source inspected: emaverick2001/Pure-Data-Synthesizer, commit 9f36d7c39f2568e23726e104fa79b019b3165d06. Files include VirtKeyboard.pd, README.md, two JPEGs, model.dae and project notes PDF. Visual inspection showed the JPEGs are cat photos, not project screenshots; do not use them as visualizer evidence.

README supports: MIDI keyboard input, eight audio controls, optional four-note arpeggiator, GEM shape and particle scenes, mappings from audio controls to visual parameters. Example: volume maps to object size; panning moves objects left/right. Some mappings explicitly remain unfinished. Patch includes MIDI input and GEM/audio objects.

Proposed headline: One gesture, two ways to understand it.
Proposed framing: An exploration of connecting sound and visual feedback through the same physical controls.

Do not claim improved learning, validated usability, adoption, current production readiness, or open-source licensing. The repository has no LICENSE among its visible root files. Do not call the new website keyboard a port of this patch; it is a separate browser interaction.

Tradeoff: tangible source and visuals connect naturally to About, but an older creative instrument may be less relevant as the leading case for software/data recruiting than Assistant OS or RevoStep. User decision needed on featured-project priority before changing Work positioning. Current Assistant OS/RevoStep evidence would be needed to lead with either instead.

## Approved and implemented slice

User approved featuring the class synthesizer project, with Assistant OS and RevoStep in progress. Work preview and synthesizer case study use the shared layout. Browser instrument and hardware MIDI integration remain separate. Original PDF commentary dated 2024-04-27 supports initial vocoder concept, scope narrowing, and use of hierarchical abstractions. No course name supplied or inferred.

Routes: /work-preview/, /synthesizer-preview/. Existing /projects/ and project detail pages preserved. Connected HTML captures Home, About, Work and the case study. Actual asset generated: narrow botanical root connection. It is decorative and not a chronological assertion.

## Review corrections

User approved visual system architecture and case-study navigation/layout. Shared header order is now About then Work. RevoStep contribution is a visualization dashboard built using the team’s data, not ownership of the assistive device. PactSpace is past work, including wireframing; user has left and thinks it may have been abandoned, but abandonment is not established. Music recommendation system is incomplete and needs rework.

The root treatment is rejected as awkward and line-like. Keep this issue open; propose a compact branching connection with a clear origin rather than stretching a tall root across the whole page. No replacement visual approved yet.

Add master’s projects after resolving names and source evidence: Diff Flow / molecule generation (unclear whether one or two projects), and KV-cache optimization. Need repository/report and individual contribution before adding technical or performance claims.

## Naming corrections

The portfolio project is Daily Focus Coach, not Assistant OS. DiffFlow molecule generation is one master’s project; source to come later. Looking for KV-cache optimization source before introducing claims.

### Root branching study, pending visual review
User approved an isolated two-card experiment with eight discrete branching growth states, replacing the rejected scanner-style reveal. Added `frontend/experiments/root-branching-preview.html` and `root-branching-states.png`. Full registered tiles swap without a clipping boundary or opacity crossfade. Includes scroll scrubbing, manual stage controls, day/night, reduced-motion manual mode. Existing portfolio root implementation unchanged pending review. Artwork visually inspected; final growth jump is larger than preceding stages and remains a review point. Script simulation passed forward/reverse scrolling, manual hold/resume, reduced motion, and full-frame drawing; no browser rendering QA claimed. Standalone `root-branching-preview.html` delivered.
