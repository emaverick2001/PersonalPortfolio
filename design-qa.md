# About preview QA

Final result: blocked

The build completed with 26 pages and zero Astro errors/warnings. The audio lifecycle test passes for silent initialization, explicit enable, pointer cancellation, blur mute, AudioContext reuse, keyboard note release, and muted controls.

Browser visual and listening verification has not been performed. Do not treat build/tests as visual fidelity approval. The About preview reuses the approved homepage botanical sprite rather than the mockup's branch illustration. The keyboard is a functional flat control layout with sliders, not the approved tactile render and rotary knobs. The book is typographic rather than a cover image. These remain visual implementation work before claiming fidelity to the mockup.

The existing /about/ route is preserved. The new /about-preview/ route is noindex and excluded from the sitemap. Nothing was published. No visitor-data collection was added.

Figma is an editable structural comparison board, not pixel-exact homepage/About screens. URL: https://www.figma.com/design/fvw0hUu1odFMNbdMtJ0Cx4

## Connected preview update

Home and About now share GrowthHeader and GrowthFooterLinks. The original About content is preserved at /background/. Build: 27 pages. Audio lifecycle tests pass. Browser QA attempted at the supervised preview and blocked by ERR_BLOCKED_BY_CLIENT. A single-file preview embeds both pages, carries theme between them, handles Back/Forward, and sends pagehide before switching to silence audio. Remaining legacy links open the public site. No deployment.

## Work + case study slice

Build: 29 pages, zero Astro errors/warnings. Original project README, .pd source and notes PDF inspected. Rayas JPEGs are cat photos, excluded from the case study. Root artwork inspected before use; pale paper removed at runtime using the existing botanical renderer. Responsive CSS includes stacked mobile cards and tables that can scroll if needed. Connected-route simulation covers four pages, anchors, theme handoff, pagehide and history. This does not substitute for real browser QA; the earlier ERR_BLOCKED_BY_CLIENT remains a browser verification limitation. User review of rendered layout is required.

## Perspective narrative and Writing doorway, 2026-09-24

The homepage now follows curiosity, shared understanding, and useful action. Daily Focus Coach and Writing follow the growth story as separate sections. The original capture interaction remains in an optional details panel. Existing artwork, routes, and shared theme/navigation are retained.

Astro check: zero errors and zero warnings across 65 files. Build: 29 pages. Connected-preview routing simulation passes for Work, case study, About, Home, anchors, theme carryover, and pagehide. Static HTML inspection confirms three growth stages, unique/resolving fragment anchors, retained capture IDs, a real blog destination, and no em dashes or analytics in the homepage.

The standalone connected preview now opens Home by default. Browser QA was attempted again through the supported supervised preview, but navigation failed with net::ERR_BLOCKED_BY_CLIENT. No desktop/mobile visual verification or interaction QA in a real browser is claimed for this slice. The new sections use responsive stacking and existing theme variables; rendered review remains necessary.

The blog retains its existing content and design. No new essay, visitor-data collection, or publication was added. Work roots remain the prior version pending a separate vine proposal.

## Ivy scroll preview, 2026-09-24

The approved ivy concept replaces the root artwork on Work. Three full states correspond to the featured project sections: emerging, fuller growth with buds, and flowering. The same top anchor and scale are used in each state; no moving reveal boundary or crossfade is used. A sticky margin carries the plant through the final featured project at its natural aspect ratio. Mobile keeps a smaller protected margin. The origin position accounts for short-window resizing, and reduced motion displays a static full vine.

Source artwork: generated RGBA sheet, 1536x1024, three 512px columns, ivy-growth-states.png. Observed source top anchors: (259,74), (237,75), (215,74), relative to each column. Renderer registers those at canvas (150,0), with a 400x950 canvas. Near-transparent generation haze below alpha 24 is omitted; opaque ivory petals are retained. Some existing leaf shapes/positions still vary between generated states; these are discrete storyboard states, not continuous morphing or perfectly identical established leaves.

Targeted tests pass for project-boundary progression, reverse scrolling, layout changes when project content expands, proportional sizing on narrow/short viewports, and static reduced motion. The audio lifecycle check also passes. Browser navigation was attempted through the supported preview and again returned net::ERR_BLOCKED_BY_CLIENT; desktop/mobile rendering and subjective motion quality remain unverified. Build and connected export/routing results are recorded in the handoff. No publication or visitor-data collection.


## Document-anchored ivy correction, 2026-09-24

Owner feedback: the vine size and growth were liked, but the sticky origin was rejected. The intended behavior is to travel past the origin and see later sections grow, with reverse scroll retracing growth. Nine image states now give each project pre/main/post progression. The margin is absolute within the project journey, with no sticky/fixed artwork. The full-grown tip is placed at the last featured project bottom, including expanded details.

The new transparent source is ivy-journey-states.png (724x2172). Rows have different heights; anchors and bare-stem joints are explicit metadata in vine-growth.ts. Canvas draws the complete artwork in pieces at bare stem joints and connects those joints with curved stems to fit document length. This is spatial layout, not a moving crop/reveal or a crossfade. Leaves retain a common uniform scale across all nine frames; added page length is carried by internodes. Generated leaf shapes still differ between some states, so this remains discrete growth rather than continuous anatomical morphing. Narrow margins produce longer bare stem intervals and need owner review.

Validation: three targeted tests pass for nine-state progression, reverse scroll, content expansion, reduced motion, fixed document origin, final tip reach, and contained visible bounds at rail widths 200/150/76 with journey heights up to 3500. Astro check: 67 files, zero errors/warnings. Build: 29 pages. A canvas-only rendering of five states was visually inspected on the cream background for joins and leaf proportions. It does not exercise browser layout or scrolling. Browser QA remains blocked by the previously observed ERR_BLOCKED_BY_CLIENT; no desktop/mobile browser approval is claimed.

No content positioning changes, publication, analytics, or visitor-data collection were introduced.


## Two-state continuous-stem experiment, 2026-09-25

Scope: isolated proof of the owner-approved illustrated stem and two adjacent growth states. This does not replace the nine-state Work implementation yet. Full transparent source drawings replace the split-art-and-generic-connector method within the study. Source: ivy-continuous-two-states.png, 1086x1448 RGBA, two 543px columns, anchors (297,22) and (243.5,22) local to each cell. Early botanical length 1179; late length 1395. A five-pixel lower margin is reserved. Both share a single natural-aspect-ratio scale, with the origin fixed in document space.

One generated sprite was used. Browser asset encoding was normalized losslessly after the native canvas decoder rejected its original metadata; exact decoded RGBA equality was asserted. The original generated file is retained separately. Source and embedded PNG bytes match.

Targeted script checks pass for forward/reverse scrolling, manual state comparison, reduced motion, theme toggling, common top anchors, and proportional rendering at rail widths 220, 138 and 115. A canvas-only contact sheet was visually inspected on both cream and forest backgrounds. Upper leaves align closely; lower foliage changes slightly between drawings. Real browser layout and scroll feel remain unverified because the browser infrastructure was previously blocked. This plain HTML study requires no Astro rebuild. No publication, analytics, or visitor-data collection.


## Full-growth study correction, 2026-09-25

A regression assertion reproduced the user-reported scope problem: only two nearly grown frames existed. The corrected standalone study renders nine intact drawings from ivy-journey-states.png, uniformly scaled and registered at their original top anchors. Each drawing includes its own full stem. No generic stem strokes or spacing extensions are used. The image source rectangle selects a complete frame and does not move during scroll.

Scroll thresholds follow the difference between each botanical length and the first length, so progression starts early and follows the tip while the origin leaves view. Short viewports first bring the tip into view. Earlier/Later controls were removed. The failing two-frame assertion now passes with nine states; targeted tests also verify first growth within 120px at the test viewport, visiting all states in both directions, restart, reduced motion, theme switching, uniform scale and a fixed document origin across three widths. A canvas-only four-position scroll sequence was visually inspected. Browser layout and subjective motion remain unverified. The connected portfolio itself remains unchanged pending review.


## Integrated intact ivy, 2026-09-26

The owner approved the corrected standalone nine-state study, then authorized integration into Work. The split-art renderer and synthetic Bezier connectors have been removed. The Work renderer draws one full source frame at one uniform scale. The original approved study is preserved.

Responsive adaptation: a sticky viewing window, beneath the shared header, pans along the intact drawing as projects scroll. The initial stem moves outside that viewing window; it is not held stationary. Final growth accompanies the RevoStep Visualization Dashboard. The viewing window is bounded by the project list so it leaves with the last project. This is a deliberate camera treatment to avoid stretching artwork to desktop/mobile content lengths, and awaits owner review. It is not a claim that a fixed document-space vine now spans the whole list.

Targeted tests cover nine states in both directions, project-boundary remeasurement, proportional containment, camera reversal, reduced motion, and asset failure. Native canvas execution of the actual renderer and a four-position contact sheet passed and were inspected. The browser navigation returned ERR_BLOCKED_BY_CLIENT; real browser sticky layout, responsive overlap, and perceived motion remain unverified. No publishing, new analytics, or visitor collection.
