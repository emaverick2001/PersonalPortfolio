import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import sitemap from "@astrojs/sitemap"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"

// https://astro.build/config
export default defineConfig({
  site: "https://emaverick2001.github.io/PersonalPortfolio/",
  base: "/PersonalPortfolio/"
  trailingSlash: "always",
  integrations: [tailwind({ applyBaseStyles: false }), sitemap(), mdx(), react()],
})
