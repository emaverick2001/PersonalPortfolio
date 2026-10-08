import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import vm from "node:vm"
import { build } from "esbuild"

const posthogSource = await readFile("src/components/PostHog.astro", "utf8")
const analyticsSource = await readFile("src/utils/analytics.ts", "utf8")
const inspirationsSource = await readFile("src/components/GrowthInspirations.astro", "utf8")
const growthResumeSource = await readFile("src/components/GrowthResume.astro", "utf8")
const growthHeaderSource = await readFile("src/components/GrowthHeader.astro", "utf8")
const siteLayoutSource = await readFile("src/layouts/SiteLayout.astro", "utf8")
const legacyHeaderSource = await readFile("src/components/Header.tsx", "utf8")
const projectGridSource = await readFile("src/components/ProjectGrid.tsx", "utf8")
const socialSource = await readFile("src/content/socials.tsx", "utf8")
const projectSource = await readFile("src/content/projects.ts", "utf8")
const releasedProject = await readFile("dist/projects/molecule-generation-with-rl/index.html", "utf8")

const analyticsBundle = await build({
  entryPoints: ["src/utils/analytics.ts"],
  bundle: true,
  write: false,
  format: "cjs",
  platform: "node",
})
const analyticsModule = { exports: {} }
vm.runInNewContext(analyticsBundle.outputFiles[0].text, {
  module: analyticsModule,
  exports: analyticsModule.exports,
})
const { filterAnalyticsEvent, resolveReleaseEnvironment, shouldEnableAnalytics } = analyticsModule.exports

function loadAnalyticsClickRuntime() {
  class FakeElement {
    closest() {
      return null
    }
  }

  class FakeHTMLElement extends FakeElement {
    getAttribute() {
      return null
    }
  }

  class FakeAnchorElement extends FakeHTMLElement {
    constructor(href) {
      super()
      this.href = href
      this.dataset = {}
    }

    getAttribute(name) {
      return name === "href" ? new URL(this.href).pathname : null
    }

    closest(selector) {
      return selector === "a" ? this : null
    }
  }

  const listeners = new Map()
  const captures = []
  const document = {
    documentElement: { dataset: {} },
    addEventListener(type, listener) {
      listeners.set(type, listener)
    },
  }
  const window = {
    location: {
      href: "https://maverickespinosa.com/",
      hostname: "maverickespinosa.com",
      origin: "https://maverickespinosa.com",
      pathname: "/",
    },
    posthog: {
      capture(...args) {
        captures.push(args)
      },
    },
  }
  const module = { exports: {} }
  const context = vm.createContext({
    module,
    exports: module.exports,
    document,
    window,
    listeners,
    URL,
    Element: FakeElement,
    HTMLElement: FakeHTMLElement,
    HTMLAnchorElement: FakeAnchorElement,
  })
  vm.runInContext(analyticsBundle.outputFiles[0].text, context)

  return {
    analytics: module.exports,
    captures,
    clickResumeLink() {
      vm.runInContext(
        'listeners.get("click")({ target: new HTMLAnchorElement("https://maverickespinosa.com/resume/") })',
        context,
      )
    },
  }
}

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
  assert.equal((releasedProject.match(/_astro\/PostHog[^"']+\.js/g) ?? []).length, 1)
})

test("analytics requires an explicit production release on the canonical public route", () => {
  assert.equal(
    shouldEnableAnalytics({ hostname: "maverickespinosa.com", pathname: "/research/" }, "production", true),
    true,
  )

  for (const [location, environment, enabled] of [
    [{ hostname: "maverickespinosa.com", pathname: "/research/" }, "staging", true],
    [{ hostname: "maverickespinosa.com", pathname: "/research/" }, "invalid", true],
    [{ hostname: "maverickespinosa.com", pathname: "/research/" }, "production", false],
    [{ hostname: "maverickespinosa.com", pathname: "/preview/" }, "production", true],
    [{ hostname: "localhost", pathname: "/research/" }, "production", true],
    [{ hostname: "review-123.maverick-portfolio-staging.pages.dev", pathname: "/research/" }, "production", true],
  ]) {
    assert.equal(shouldEnableAnalytics(location, environment, enabled), false)
  }
})

test("release environments reject missing or invalid production-build values", () => {
  assert.equal(resolveReleaseEnvironment(undefined, true), "production")
  assert.equal(resolveReleaseEnvironment("production", false), "production")
  assert.equal(resolveReleaseEnvironment("staging", false), "staging")
  assert.throws(() => resolveReleaseEnvironment(undefined, false), /PUBLIC_SITE_ENV/)
  assert.throws(() => resolveReleaseEnvironment("preview", false), /PUBLIC_SITE_ENV/)
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
    /advanced_disable_flags:\s*true/,
    /advanced_disable_feature_flags:\s*true/,
    /capture_heatmaps:\s*false/,
    /capture_performance:\s*false/,
    /before_send:\s*filterAnalyticsEvent/,
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

test("the final analytics payload filter rejects SDK events and strips undeclared properties", () => {
  const transport = {
    token: "project-token",
    distinct_id: "cookieless-request",
    $cookieless_mode: "always",
    $process_person_profile: false,
  }
  const sdkPayload = {
    uuid: "00000000-0000-4000-8000-000000000000",
    event: "$$heatmap",
    properties: {
      ...transport,
      $heatmap_data: { x: 42, y: 19, href: "https://example.com/?focus=private#thought" },
    },
  }
  assert.equal(filterAnalyticsEvent(sdkPayload), null)
  assert.equal(filterAnalyticsEvent({ ...sdkPayload, event: "$web_vitals" }), null)
  assert.equal(filterAnalyticsEvent({ ...sdkPayload, event: "constructor" }), null)

  const approved = filterAnalyticsEvent({
    ...sdkPayload,
    event: "page_viewed",
    properties: {
      ...transport,
      path: "/research/",
      $current_url: "https://example.com/?focus=private#thought",
      $referrer: "https://private.example/",
      $heatmap_data: { x: 42, y: 19 },
      arbitrary: "not approved",
    },
  })
  assert.deepEqual({ ...approved.properties }, { ...transport, path: "/research/" })
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

test("Résumé actions use stable explicit markers instead of a versioned filename", () => {
  assert.match(growthResumeSource, /data-resume-action=["']view_pdf["']/)
  assert.match(growthResumeSource, /data-resume-action=["']download_pdf["']/)
  assert.match(analyticsSource, /anchor\.dataset\.resumeAction/)
  assert.doesNotMatch(analyticsSource, /Resume_09_20_2025/)
})

test("Résumé hub navigation uses an immediate beacon capture before leaving the page", () => {
  const { analytics, captures, clickResumeLink } = loadAnalyticsClickRuntime()
  analytics.installAnalytics()

  clickResumeLink()

  assert.deepEqual(captures.map(([event]) => event), ["page_viewed", "resume_clicked"])
  const resumeCapture = captures.find(([event]) => event === "resume_clicked")
  assert.deepEqual(JSON.parse(JSON.stringify(resumeCapture)), [
    "resume_clicked",
    { action: "open_hub", source_path: "/" },
    { send_instantly: true, transport: "sendBeacon" },
  ])
})

test("Analytics never reads or sends the homepage perspective interaction", () => {
  const combined = `${posthogSource}\n${analyticsSource}`
  assert.doesNotMatch(combined, /perspective-form|focused-thought|next-action|textarea|FormData|thought/i)
  assert.match(posthogSource, /property_denylist/)
  assert.match(posthogSource, /\$current_url/)
  assert.match(posthogSource, /\$referrer/)
})

test("Inspirations emits controlled filter and sort values", () => {
  assert.match(inspirationsSource, /const category = section\.dataset\.inspirationCategory/)
  assert.match(inspirationsSource, /if \(category\) trackInspirationsFilterChanged\(category\)/)
  assert.match(inspirationsSource, /trackInspirationsSortChanged\(sortSelect\.value\)/)
})
