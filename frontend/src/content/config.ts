import { z, defineCollection } from "astro:content"
import { BLOG_CATEGORIES } from "./blogCategories"

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    publishDate: z.date(),
    description: z.string().optional(),
    image: z.string().optional(),
    categories: z.array(z.enum(BLOG_CATEGORIES)).min(1).max(3).default(["Reflection"]),
  }),
})

const streams = defineCollection({
  type: "content",
  schema: z.object({ date: z.date() }),
})

export const collections = {
  blog,
  streams,
}
