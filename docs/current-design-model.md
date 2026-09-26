# Portfolio design model

Updated 2026-09-24. This records the current preview direction, not approval to publish.

## Grounded in Maverick's statements

- Professional identity: Design Engineer & Builder, interested in making perspective and learning tools that support human flourishing.
- Method: understand the person and problem, make assumptions visible, build a small useful interaction, learn from it, and iterate.
- Interests include psychology, philosophy, cognitive science, neuroscience, systems engineering, mathematical models, and visualization. Interest is not a claim of disciplinary expertise or demonstrated outcomes.
- Daily Focus Coach is in development. A broader open-source Assistant OS is an eventual ambition.
- Writing is both personal expression and a way to learn through explaining. Posts should make their central point clear with concrete examples and diagrams.
- Preserve the green/tan botanical design, readable typography, focused attention, day/night modes, shared navigation, existing content, and optional discovery.
- ADHD disclosure remains optional; do not publish a partner's health information. Avoid em dashes.

## Working model

| Field | Current model | Confidence |
| --- | --- | --- |
| Primary audience | Recruiters and potential collaborators; thoughtful builders and researchers are additional readers. This prioritization is a working interpretation of the ongoing job search and networking goals. | Medium |
| Intended first impression | A thoughtful builder who helps people understand problems through different perspectives and makes ideas usable. | High, aligned with user statements |
| Core narrative | Curiosity leads to shared understanding, then useful action. Experience prompts another question. | High, approved for this preview |
| Main hierarchy | Mission and approach, current project, writing, personal connection. | High, user approved the revised homepage |
| Key destinations | About, Work, Research, Music, Blog/Writing, Inspirations, Personal, Background. | High, existing content preserved |
| Visual principles | One focal point at a time; calm botanical growth; concise language; diagrams that clarify relationships. | High |
| Remain | Seed growth artwork, theme controls, shared header/footer, original routes, local perspective-shift concept, About instrument. | High |
| Change | Homepage should express the broader mission; Daily Focus Coach should be an example rather than the subject of the entire seed narrative. | High, explicit critique |

## Implemented bounded slice

- Three existing growth stages now read Curiosity / Shared understanding / Useful action.
- Daily Focus Coach sits below the seed story with the user's approved development description.
- The local perspective-shift concept is available as an optional, explicitly illustrative interaction.
- A Writing section links to the existing blog and states the intent to learn through words, examples, and diagrams.
- No new essays, research results, analytics, visitor storage, deployment, or vine animation.

## Assumptions and open questions

- The seed is a metaphor for Maverick's approach, not a universal theory of learning. Dialogue can include reflection and experimentation; learning need not always begin with a conversation.
- Maverick approved the revised homepage ("love the redesign") and identified the Work vine as the next change. This is owner approval, not independent visitor validation.
- The existing blog destination still has its earlier content and design. Future essays and blog design need their own bounded review.
- Work roots and synthetic stem connectors were rejected. Maverick approved the isolated nine-state intact ivy study ("yes perfect") and then approved integration into Work. The current integrated preview retains those full drawings and their native proportions. A scrolling viewing window follows the drawing across the three projects; earlier stem moves out of view and reverse scrolling returns it. This camera treatment is an implementation adaptation to differing project lengths, not yet owner-validated. It replaces the earlier physically elongated document-space stem. The standalone approved study remains unchanged.
- Open-source, transparency, and user ownership are intended principles. Do not describe them as verified guarantees of unfinished projects.

## Proposed first essay, not approved copy

Working question: When does feedback actually change a system?

One possible central point: a response becomes useful to a builder when it changes the next question, decision, or experiment.

Use the portfolio animation work as an example: the roots looked promising alone; in the page they did not guide attention far enough; changing the growth's relationship to scrolling received a more positive reaction; text collisions and incomplete coverage then exposed new problems. These are observed user reactions, not controlled evidence of general usability.

Proposed structure: one concrete difficulty, one loop diagram, trace one revision through it, identify what stayed uncertain, and end with the next question. Distinguish personal observations, analogies, and sourced systems-engineering concepts. A diagram should identify a relationship or change, not merely decorate the post.

Possible later questions: What belongs inside a system boundary? How can the same problem look different at different levels of abstraction? These are ideas, not an article backlog to implement automatically.

## Continuous-stem correction, 2026-09-25

Maverick found the document-scrolling behavior better but rejected the generic stems joining image strips as unrealistic. He approved a new continuous illustrated stem study, then approved testing two adjacent scrolling states before rebuilding all nine.

The isolated ivy-stem-transition-preview.html experiment uses two complete transparent drawings with matched top anchors and a shared scale. It has no inserted connecting strokes, spatially separated image strips, aspect-ratio stretching, fades, or moving reveal masks. Manual Earlier/Later controls allow comparing the frames without moving the viewport; Scroll restores progression, and Day/Night checks the backdrop. Lower leaves shift slightly between generated states. The two-state test is implemented and awaiting owner review. The previous connected portfolio preview remains version 4 pending this review.

## Growth-test clarity correction, 2026-09-25

Maverick found the two-state study confusing: most scrolling showed no growth, and Earlier/Later labels did not explain the interaction. The prototype had tested a small late-growth change rather than the full growth experience he expected.

The same isolated preview now uses the existing nine complete ivy drawings at one uniform scale, without the inserted connector stems. It starts short, advances at thresholds determined by actual growth lengths, and reverses through all nine states on upward scrolling. The origin scrolls past in document space. Snapshot comparison controls were removed; Restart and Day/Night remain. A clear Growth N of 9 readout gives feedback. This reuses the earlier full ivy sequence intact to test understandable progression; the newer two-state continuous-stem asset remains available, and has not been extended to all nine states. Full portfolio integration still awaits review.


## Work integration review, 2026-09-26

Authorization: the user approved moving the nine-state growth study into Work. No new positioning, content, publication, or visitor collection was authorized or added.

Implementation: intact source frames, uniform scale, no inserted connector strokes. A protected margin contains the drawing; a viewing window pans along it as all three project sections scroll. State thresholds remeasure when details expand. Reduced motion shows the complete illustration without camera movement. The viewport treatment preserves leaf proportions on narrow screens without making new long bare stems. Its pacing beside real content still requires owner review. This is a tradeoff from the isolated study's fixed document origin, not proof of the same interaction.

Evidence: targeted state/camera checks and execution of the actual renderer with native canvas pass. Native canvas samples were inspected, but this does not validate browser layout. The managed browser again rejected the preview navigation with ERR_BLOCKED_BY_CLIENT. No independent visitor validation has occurred.

## Owner review and navigation cleanup, September 25, 2026 (Arizona)

Maverick reports that the integrated growth "feels natural" and that the preview "looks good so far." Treat this as owner acceptance of the current vine interaction, superseding the pending owner review above. It does not establish independent visitor comprehension or broad usability validation.

He wants the eventual experience walkthrough to assess whether the site feels like a story, helps visitors take his perspective, and communicates his direction. This is a future review criterion, not a request for recording or visitor-data collection.

Explore cleanup: remove Projects because Work already provides that destination, and omit other aliases of visible About/Work navigation. Older distinct destinations remain available. His wording about other sections was ambiguous; an optional clarification received no answer, so the implementation takes the narrower interpretation of removing duplicates, not hiding unfinished pages. The footer and underlying page content remain intact.

## Daily Focus Coach reframing, September 26, 2026 (Arizona)

Maverick found the capture-only homepage concept disconnected from Daily Focus Coach. He approved reframing the project around attention and useful action, with deliberate perspective shifts as a method: notice what has attention, examine it through another lens, choose one small action, then learn from what happens.

The optional homepage demonstration now follows that loop with personal, relational, system, and future perspectives. It uses fixed prompts rather than pretending to analyze the visitor. All text remains in the current page only and is neither persisted nor transmitted. The accompanying copy describes perspective-shifting techniques, higher-order algorithms, and data structures as research interests, not validated product capabilities or established outcomes.
