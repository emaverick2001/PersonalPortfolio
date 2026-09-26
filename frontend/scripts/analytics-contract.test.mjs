import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const posthogSource = await readFile("src/components/PostHog.astro", "utf8")
const analyticsSource = await readFile("src/utils/analytics.ts", "utf8")
const inspirationsSource = await readFile("src/components/GrowthInspirations.astro", "utf8")
const growthHeaderSource = await readFile("src/components/GrowthHeader.astro", "utf8")
const siteLayoutSource = await readFile("src/layouts/SiteLayout.astro", "utf8")
const legacyHeaderSource = await readFile("src/components/Header.tsx", "utf8")
const projectGridSource = await readFile("src/components/ProjectGrid.tsx", "utf8")
const socialSource = await readFile("src/content/socials.tsx", "utf8")
const projectSource = await readFile("src/content/projects.ts", "utf8")
const legacyProject = await readFile("dist/projects/pactspace/index.html", "utf8")

const approvedEvents = [
  "contact_clicked",
  "inspirations_filter_changed",
  "inspirations_sort_changed",
  "navigation_clicked",
  "page_viewed",
  "project_opened",
  "resume_clicked",
]

test("PostHog initializes only for the public production experience", () => {
  assert.match(analyticsSource, /maverickespinosa\.com/)
  assert.doesNotMatch(analyticsSource, /www\.maverickespinosa\.com/)
  for (const route of ["/preview/", "/about-preview/", "/work-preview/", "/synthesizer-preview/"]) {
    assert.match(analyticsSource, new RegExp(route.replaceAll("/", "\\/")))
  }
  assert.match(growthHeaderSource, /PostHog/)
  assert.equal((legacyProject.match(/_astro\/PostHog[^"']+\.js/g) ?? []).length, 1)
})

test("PostHog uses the approved cookieless and non-recording configuration", () => {
  for (const setting of [
    /capture_pageview:\s*false/,
    /capture_pageleave:\s*false/,
    /autocapture:\s*false/,
    /disable_session_recording:\s*true/,
    /cookieless_mode:\s*["']always["']/,
    /person_profiles:\s*["']never["']/,
    /respect_dnt:\s*true/,
    /disable_surveys:\s*true/,
    /disable_web_experiments:\s*true/,
    /advanced_disable_feature_flags:\s*true/,
  ]) {
    assert.match(posthogSource, setting)
  }

  assert.doesNotMatch(posthogSource, /onFeatureFlags|getFeatureFlag|web-vitals|trackSectionView/)
  assert.doesNotMatch(posthogSource, /ip:\s*false/)
  assert.match(posthogSource, /IP discard must be enabled in PostHog project settings before publication/)
  assert.match(posthogSource, /import\(["']posthog-js["']\)/)
  assert.doesNotMatch(posthogSource, /import posthog from ["']posthog-js["']/)
  assert.doesNotMatch(posthogSource, /persistence:\s*["']localStorage/)
  assert.equal((siteLayoutSource.match(/<PostHog\s*\/>/g) ?? []).length, 0)
})

test("Only the seven approved event names are captured", () => {
  const capturedEvents = [
    ...analyticsSource.matchAll(/captureAnalytics\(["']([^"']+)["']/g),
  ].map((match) => match[1]).sort()

  assert.deepEqual([...new Set(capturedEvents)], approvedEvents)
  assert.doesNotMatch(analyticsSource, /cta_clicked|section_viewed|doc_downloaded|web_vital/)
  assert.match(analyticsSource, /type AnalyticsEventProperties\s*=\s*\{/)
  assert.doesNotMatch(analyticsSource, /type AnalyticsProperties\s*=\s*Record/)
  assert.doesNotMatch(analyticsSource, /source_region/)
})

test("Delegated tracking remains the only click capture path", () => {
  for (const source of [legacyHeaderSource, projectGridSource, socialSource, projectSource]) {
    assert.doesNotMatch(source, /trackCTA|trackProjectOpened|\.onclick\(\)|onClick=\{[^}]*\.onclick\}/)
  }
})

test("Analytics never reads or sends the homepage perspective interaction", () => {
  const combined = `${posthogSource}\n${analyticsSource}`
  assert.doesNotMatch(combined, /perspective-form|focused-thought|next-action|textarea|FormData|thought/i)
  assert.match(posthogSource, /property_denylist/)
  assert.match(posthogSource, /\$current_url/)
  assert.match(posthogSource, /\$referrer/)
})

test("Inspirations emits controlled filter and sort values", () => {
  assert.match(inspirationsSource, /trackInspirationsFilterChanged\(categorySelect\.value\)/)
  assert.match(inspirationsSource, /trackInspirationsSortChanged\(sortSelect\.value\)/)
})
