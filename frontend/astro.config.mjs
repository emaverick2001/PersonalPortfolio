import { defineConfig } from "astro/config"
import node from "@astrojs/node"
import tailwind from "@astrojs/tailwind"
import sitemap from "@astrojs/sitemap"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import dotenv from "dotenv"
import clerk from "@clerk/astro"

dotenv.config()

// https://astro.build/config
export default defineConfig({
  site: "https://maverickespinosa.com",
  base: "/",
  trailingSlash: "always",
  integrations: [tailwind({ applyBaseStyles: false }), sitemap(), mdx(), react(), clerk()],
  adapter: node({ mode: "standalone" }),
  output: "server",
})
