import "dotenv/config"
import { parseFrontmatter } from "@astrojs/markdown-remark"
import { neon } from "@neondatabase/serverless"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const sql = neon(process.env.DATABASE_URL)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const blogDir = path.join(__dirname, "../src/content/blog")

const files = await readdir(blogDir)
const blogFiles = files.filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))

if (blogFiles.length === 0) {
  console.log("No blog posts found in src/content/blog.")
  process.exit(0)
}

for (const file of blogFiles) {
  const filePath = path.join(blogDir, file)
  const raw = await readFile(filePath, "utf-8")
  const { frontmatter, content } = parseFrontmatter(raw, { frontmatter: "remove" })
  const slug = path.basename(file, path.extname(file))

  const title = frontmatter.title?.trim()
  const publishDateValue = frontmatter.publishDate
  const publishDate = publishDateValue instanceof Date ? publishDateValue : new Date(publishDateValue)
  const description = frontmatter.description ?? null
  const image = frontmatter.image ?? null
  const categories = Array.isArray(frontmatter.categories) ? frontmatter.categories : ["Reflection"]

  if (!title || Number.isNaN(publishDate.getTime())) {
    console.warn(`Skipping ${file}: missing title or publishDate.`)
    continue
  }

  await sql`
    insert into blogs_table (title, description, content, image, slug, categories, publish_date, updated_at)
    values (${title}, ${description}, ${content.trim()}, ${image}, ${slug}, ${categories}, ${publishDate}, ${new Date()})
    on conflict (slug) do update set
      title = excluded.title,
      description = excluded.description,
      content = excluded.content,
      image = excluded.image,
      categories = excluded.categories,
      publish_date = excluded.publish_date,
      updated_at = now()
  `

  console.log(`Seeded ${slug}`)
}
