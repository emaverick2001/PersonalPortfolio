import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import sitemap from "@astrojs/sitemap"

// https://astro.build/config
export default defineConfig({
  site: "https://dbiswas.com/",
  trailingSlash: "always",
  integrations: [
    tailwind({
      config: { applyBaseStyles: false },
    }),
    sitemap(),
  ],
})
