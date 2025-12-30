import type { AstroGlobal } from "astro"
import type { PostHog } from "posthog-js"

declare global {
  var Astro: AstroGlobal
  interface Window {
    posthog?: PostHog
  }
}

export {}
