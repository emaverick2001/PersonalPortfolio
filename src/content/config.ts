import { z, defineCollection } from "astro:content"

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    author: z.string(),
    tagline: z.string(),
    publishDate: z.coerce.date(),
  }),
})

export const collections = {
  blog,
}
