import type { AstroGlobal } from "astro"
import type { PostHogInterface } from "posthog-js"

declare global {
  var Astro: AstroGlobal
  interface Window {
    posthog?: PostHogInterface
  }
}

export {}
