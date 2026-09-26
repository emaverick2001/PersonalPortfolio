# About preview implementation plan

Approved scope: the selected botanical About direction, shared homepage controls, and a playable keyboard. No publishing, data collection, new biography claims, or removal of existing content.

1. Extract the current header and footer links into shared Astro components without changing homepage appearance. About preview uses the same components, CSS tokens, and theme script.
2. Create `/about-preview/` with approved introduction, feedback loop, CPCR and interests distinction, music interaction, and selected book passage. Preserve `/about/` until review. Reuse the approved botanical asset.
3. Implement Web Audio only after Enable sound. Map one octave to accessible buttons and computer keys. Apply pitch, delay, and reverb; stop voices on release, blur, hidden tab, and mute. No microphone or network calls.
4. Run Astro build and focused audio lifecycle tests. Export a self-contained review HTML. Report browser verification limitations honestly.

Figma comparison: https://www.figma.com/design/fvw0hUu1odFMNbdMtJ0Cx4
