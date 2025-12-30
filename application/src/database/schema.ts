import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

// NOTE track users with clerk
// TODO Need to find out if I can utilize posthod info to display on my admindashboard for geography map and other stats

export const blogsTable = pgTable("blogs_table", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  title: text("title").notNull().unique(),
  description: text("description"),
  content: text("content").notNull(),
  image: text("image"), // Featured image URL
  slug: varchar("slug", { length: 255 }).notNull().unique(), // URL-friendly identifier
  categories: text("categories").array().notNull(), // Array of category tags
  author: varchar("author", { length: 255 }).notNull().default("Maverick Espinosa"),
  publishDate: timestamp("publish_date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
})

export const projectsTable = pgTable("projects_table", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(), // URL-friendly identifier
  description: text("description").notNull(), // Short desc for cards
  image: text("image"), // Featured image URL
  categories: text("categories").array().notNull(), // Array of category tags
  sourceCode: text("source_code"), // GitHub/repo link
  projectLink: text("project_link"), // Live demo/deployed link

  // Timestamps
  publishDate: timestamp("publish_date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),

  // Content sections
  overview: text("overview"), // Detailed overview
  features: text("features").array(), // Array of feature descriptions
  howItWorks: text("how_it_works"), // Technical explanation
  directoryStructure: text("directory_structure"), // File structure
  usage: text("usage").array(), // Array of usage instructions
  importantNotes: text("important_notes").array(), // Array of notes
  toolIcon: text("text_icon"), // Icon of tech tool used
  techAndDependencies: text("tech_and_dependencies"), // Array of dependencies
  gettingStarted: text("getting_started"), // Setup instructions
  contributions: text("contributions"), // Contribution guidelines
  license: varchar("license", { length: 255 }), // License type
  credits: text("credits"), // Credits/acknowledgements
  acknowledgements: text("acknowledgements").array(), // Array of people/projects
})

export const songsTable = pgTable("songs_table", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  title: text("title").notNull().unique(),
  image: text("image"), // Album/track cover image URL
  categories: text("categories").array().notNull(), // Array of category tags
  slug: varchar("slug", { length: 255 }).notNull().unique(), // URL-friendly identifier
  features: varchar("features", { length: 255 }), // Credits/acknowledgements

  // Audio links
  hrefLink: text("href_link").notNull(), // SoundCloud or streaming platform link
  thumbnailLink: text("thumbnail_link"), // Album art/thumbnail image

  // Timestamps
  publishDate: timestamp("publish_date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
})

export type InsertBlog = typeof blogsTable.$inferInsert
export type SelectBlog = typeof blogsTable.$inferSelect

export type InsertProject = typeof projectsTable.$inferInsert
export type SelectProject = typeof projectsTable.$inferSelect

export type InsertSong = typeof songsTable.$inferInsert
export type SelectSong = typeof songsTable.$inferSelect
