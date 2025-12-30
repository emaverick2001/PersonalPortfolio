export const BLOG_CATEGORIES = [
  "Anthropology",
  "Communication",
  "Economics",
  "Health",
  "Math",
  "Neuroscience",
  "Philosophy",
  "Physics",
  "Psychology",
  "Sociology",
  "Technology",
  "Reflection",
  "Tutorial",
  "Analysis",
  "Opinion",
  "Research",
] as const

export type BlogCategory = (typeof BLOG_CATEGORIES)[number]
