import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import sitemap from "@astrojs/sitemap"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import dotenv from "dotenv"

dotenv.config()

// https://astro.build/config
export default defineConfig({
  site: "https://maverickespinosa.com",
  base: "/",
  trailingSlash: "always",
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      filter: (page) =>
        !page.endsWith("/preview/") &&
        !page.endsWith("/about-preview/") &&
        !page.endsWith("/work-preview/") &&
        !page.endsWith("/synthesizer-preview/"),
    }),
    mdx(),
    react(),
  ],
})
