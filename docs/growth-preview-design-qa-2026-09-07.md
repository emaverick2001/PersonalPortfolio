# Growth Preview Design QA

## Evidence

- Source visual truth: `/Users/maver/Downloads/codex-growth-handoff.zip`, including `references/approved-storyboard.png` and `portfolio-growth-preview.html`.
- Baseline capture: `/private/tmp/growth-baseline-desktop.png`.
- Desktop implementation capture: `/private/tmp/growth-implementation-desktop.png`.
- Mobile implementation capture: `/private/tmp/growth-implementation-mobile.png`.
- Full-view comparisons: `/private/tmp/growth-baseline-vs-implementation.png` and `/private/tmp/growth-storyboard-vs-implementation.png`.
- Focused botanical comparison: `/private/tmp/growth-source-vs-final-art.png`.
- Desktop viewport and density: 1280 x 720 CSS pixels at device scale 1. Source and implementation captures are both 1280 x 720 pixels.
- Mobile viewport and density: 390 x 844 CSS pixels at device scale 1. Implementation capture is 390 x 844 pixels.
- Focused artwork normalization: the 512 x 1024 source panel was resized to the rendered 224 x 448 CSS-pixel frame and compared with a 224 x 448 implementation crop.
- States inspected: initial seed, root emergence, stem rise, partial leaf, complete sprout, reverse scroll, desktop, and narrow mobile.

## Findings

No actionable P0, P1, or P2 differences remain.

- Fonts and typography: Charter, Arial utility text, hierarchy, line height, wrapping, and letter spacing remain consistent with the supplied runnable preview.
- Spacing and layout rhythm: the header, two-column story, sticky illustration slot, chapter rhythm, form, and footer retain the baseline dimensions. The 390-pixel layout preserves the compact sticky illustration and has no horizontal overflow.
- Colors and visual tokens: the parchment, forest green, ink, muted text, and rules continue to use the supplied preview tokens.
- Image quality and asset fidelity: the animation uses a 512 x 1024 transparent derivative of the supplied central botanical stage. The final sprout retains the source linework, palette, proportions, and texture. No crossfade, ghosted double image, or rectangular raster seam remains.
- Copy and content: public wording is unchanged. The preview remains marked `noindex`, is excluded from the sitemap, and retains the no-send, no-save form disclosure.
- Interaction and accessibility: forward and reverse scroll states were inspected in-browser; the same 720-pixel scroll position produced identical values before and after reversing. The illustrative form was submitted and reset in-browser. The DOM retains native links, buttons, textarea, summary, skip target, and visible focus styling. Reduced motion is covered by the focused automated test.
- Console: no warnings or errors were reported by the browser.

## Open Questions

- The initial frame now uses the grounded shell from the same seedling artwork rather than the separate floating seed panel. This is an intentional continuity tradeoff: it keeps one physical shell and root origin throughout the transformation. Treat any preference for the larger floating seed silhouette as a P3 review note, not a reason to return to a stage swap.

## Comparison History

1. First implementation pass showed rectangular raster backgrounds, horizontal overflow, and a collapsed initial shell. These were P1/P2 issues.
2. The artwork was converted into a transparent RGBA rig derived from the supplied source, the illustration frame was clipped, and shell masks and transforms were retuned.
3. The revised same-viewport comparisons show the original layout, typography, palette, and botanical texture with clean continuous layers. The earlier P1/P2 issues are absent.

## Implementation Checklist

- [x] Preserve approved visual identity and wording.
- [x] Drive one shell, root, stem, and leaf sequence from normal scroll.
- [x] Restore exact earlier states on backward scroll.
- [x] Retain reduced-motion behavior and semantic controls.
- [x] Verify desktop and narrow mobile rendering.
- [x] Keep the preview unpublished and free of visitor-data collection.

## Follow-up Polish

- P3: after Maverick reviews the motion in real use, the early shell scale and split distance can be tuned without changing the rig or expanding to the mature plant.

final result: passed
