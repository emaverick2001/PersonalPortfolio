import type { AstroGlobal } from "astro"
import type { PostHogInterface } from "posthog-js"

declare global {
  var Astro: AstroGlobal
  interface ImportMetaEnv {
    readonly PUBLIC_SITE_ENV?: "production" | "staging"
    readonly PUBLIC_ANALYTICS_ENABLED?: "true" | "false"
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  interface Window {
    posthog?: PostHogInterface
  }
}

export {}
