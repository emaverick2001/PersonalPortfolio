# Growth homepage preview

Approved scope: three homepage moments with botanical sketch imagery, parchment, forest green, editorial serif typography, no decorative phrases or em dashes. Add normal-scroll growth and gentle navigation motion. No deployment or replacement of existing pages.

Implementation: isolated Astro route `/preview/`, dedicated stylesheet and client script. Reuse bundled Charter fonts. New generated botanical triptych becomes three stages in a sticky illustration. Scroll progress crossfades the stages; small screens use a compact sticky illustration. Reduced motion uses discrete stages without transitions. Content and navigation work without JavaScript.

- [x] Build route, styles, and animation. Assistant OS interaction is explicitly illustrative, uses transient state only, and claims no verified product results.
- [x] Static Astro build passes. Three focused tests pass for scroll stage progression, discrete reduced-motion states, and capture validation/reset with safe text rendering.
- [ ] Browser QA: internal preview starts but browser access fails with ERR_BLOCKED_BY_CLIENT, including one root-address recovery. Desktop/mobile layout and real animation remain visually unverified. No alternate browser path attempted.
- [x] Export self-contained unpublished HTML for user review; preserve existing routes and assets; do not publish.

Existing repository limitation: Astro check reports a missing `../types` import in the unchanged `PerformanceDisplay.astro`. No errors remain in new preview files. Full static build succeeds independently. Preview excluded from sitemap and marked noindex. Export includes images, fonts, styles, and JavaScript with no external asset dependencies.

Review criteria: retain approved visual character, engineering identity obvious, growth follows normal scroll, readable mobile layout, no competing decorative text, clear illustrative labeling, no private diagnosis disclosure.
