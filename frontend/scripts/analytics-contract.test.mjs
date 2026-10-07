import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import vm from "node:vm"
import { build } from "esbuild"

const posthogSource = await readFile("src/components/PostHog.astro", "utf8")
const analyticsSource = await readFile("src/utils/analytics.ts", "utf8")
const inspirationsSource = await readFile("src/components/GrowthInspirations.astro", "utf8")
const growthHeaderSource = await readFile("src/components/GrowthHeader.astro", "utf8")
const siteLayoutSource = await readFile("src/layouts/SiteLayout.astro", "utf8")
const legacyHeaderSource = await readFile("src/components/Header.tsx", "utf8")
const projectGridSource = await readFile("src/components/ProjectGrid.tsx", "utf8")
const socialSource = await readFile("src/content/socials.tsx", "utf8")
const projectSource = await readFile("src/content/projects.ts", "utf8")
const releasedProject = await readFile("dist/projects/molecule-generation-with-rl/index.html", "utf8")
const releasedResume = await readFile("dist/resume/index.html", "utf8")

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
  URL,
})
const {
  filterAnalyticsEvent,
  resolveAnalyticsExclusion,
  resolveReleaseEnvironment,
  shouldEnableAnalytics,
} = analyticsModule.exports

function createSessionStorage(sharedValues = new Map(), failure = null) {
  return {
    getItem(key) {
      if (failure === "read") throw new Error("storage read failed")
      return sharedValues.get(key) ?? null
    },
    setItem(key, value) {
      if (failure === "write") throw new Error("storage write failed")
      sharedValues.set(key, value)
    },
    removeItem(key) {
      if (failure === "remove") throw new Error("storage remove failed")
      sharedValues.delete(key)
    },
  }
}

function loadAnalyticsRuntime({
  pathname = "/",
  sharedStorage = new Map(),
  storageFailure = null,
  now = 1_000_000,
} = {}) {
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
    constructor(href, options = {}) {
      super()
      this.rawHref = href
      this.href = new URL(href, `https://maverickespinosa.com${pathname}`).href
      this.dataset = options.dataset ?? {}
      this.target = options.target ?? ""
      this.download = options.download ?? false
      this.nav = options.nav ?? null
    }

    getAttribute(name) {
      if (name === "href") return this.rawHref
      if (name === "target") return this.target || null
      if (name === "aria-label" && this.nav) return this.nav
      return null
    }

    hasAttribute(name) {
      return name === "download" ? this.download : false
    }

    closest(selector) {
      if (selector === "a") return this
      if (selector === "nav" && this.nav) {
        return new FakeHTMLElementWithLabel(this.nav)
      }
      return null
    }
  }

  class FakeHTMLElementWithLabel extends FakeHTMLElement {
    constructor(label) {
      super()
      this.label = label
    }

    getAttribute(name) {
      return name === "aria-label" ? this.label : null
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
      href: `https://maverickespinosa.com${pathname}`,
      hostname: "maverickespinosa.com",
      origin: "https://maverickespinosa.com",
      pathname,
    },
    posthog: {
      capture(...args) {
        captures.push(args)
      },
    },
    sessionStorage: createSessionStorage(sharedStorage, storageFailure),
  }
  const module = { exports: {} }
  const context = vm.createContext({
    module,
    exports: module.exports,
    document,
    window,
    URL,
    Date: class extends Date {
      static now() {
        return now
      }
    },
    Element: FakeElement,
    HTMLElement: FakeHTMLElement,
    HTMLAnchorElement: FakeAnchorElement,
  })
  vm.runInContext(analyticsBundle.outputFiles[0].text, context)

  return {
    analytics: module.exports,
    captures,
    sharedStorage,
    click(href, options = {}) {
      const event = {
        target: new FakeAnchorElement(href, options),
        defaultPrevented: false,
        metaKey: false,
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        button: 0,
        ...options.event,
      }
      listeners.get("click")(event)
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
    shouldEnableAnalytics({ hostname: "maverickespinosa.com", pathname: "/research/" }, "production", true, false),
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
    assert.equal(shouldEnableAnalytics(location, environment, enabled, false), false)
  }

  assert.equal(
    shouldEnableAnalytics({ hostname: "maverickespinosa.com", pathname: "/research/" }, "production", true, true),
    false,
  )
})

test("the local exclusion control persists, clears, and cleans its URL before analytics initialization", () => {
  const values = new Map()
  const storage = createSessionStorage(values)
  const replacements = []
  const history = {
    state: { preserved: true },
    replaceState(...args) {
      replacements.push(args)
    },
  }

  assert.equal(resolveAnalyticsExclusion(
    { href: "https://maverickespinosa.com/research/?topic=systems&analytics=exclude#evidence" },
    history,
    storage,
  ), true)
  assert.equal(values.get("portfolio.analytics.excluded.v1"), "true")
  assert.deepEqual(replacements.at(-1), [history.state, "", "/research/?topic=systems#evidence"])

  assert.equal(resolveAnalyticsExclusion(
    { href: "https://maverickespinosa.com/projects/" },
    history,
    storage,
  ), true)

  assert.equal(resolveAnalyticsExclusion(
    { href: "https://maverickespinosa.com/projects/?analytics=include#selected" },
    history,
    storage,
  ), false)
  assert.equal(values.has("portfolio.analytics.excluded.v1"), false)
  assert.deepEqual(replacements.at(-1), [history.state, "", "/projects/#selected"])
})

test("local exclusion fails closed when browser storage is unavailable", () => {
  const replacements = []
  const history = {
    state: null,
    replaceState(...args) {
      replacements.push(args)
    },
  }

  for (const failure of ["read", "write", "remove"]) {
    const command = failure === "write" ? "exclude" : failure === "remove" ? "include" : null
    const href = command
      ? `https://maverickespinosa.com/?analytics=${command}`
      : "https://maverickespinosa.com/"
    assert.equal(resolveAnalyticsExclusion(
      { href },
      history,
      createSessionStorage(new Map(), failure),
    ), true)
  }

  assert.deepEqual(replacements, [
    [history.state, "", "/"],
    [history.state, "", "/"],
  ])
})

test("PostHog resolves the local exclusion before evaluating the production boundary", () => {
  assert.match(posthogSource, /resolveAnalyticsExclusion/)
  assert.match(posthogSource, /shouldEnableAnalytics\([^)]*analyticsExcluded/s)
  assert.ok(posthogSource.indexOf("resolveAnalyticsExclusion") < posthogSource.indexOf("import(\"posthog-js\")"))
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
  const runtime = loadAnalyticsRuntime({ pathname: "/" })
  runtime.analytics.installAnalytics()
  runtime.click("mailto:hello@example.com")
  runtime.click("/resume/", { target: "_blank" })
  runtime.click("/projects/molecule-generation-with-rl/", { target: "_blank" })
  runtime.click("https://github.com/emaverick2001", { nav: "Social and contact links" })
  runtime.analytics.trackInspirationsFilterChanged("Games")
  runtime.analytics.trackInspirationsSortChanged("desc")

  const capturedEvents = runtime.captures.map(([event]) => event).sort()
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

test("same-tab résumé navigation is captured exactly once on the destination page", () => {
  const sharedStorage = new Map()
  const source = loadAnalyticsRuntime({ pathname: "/", sharedStorage })
  source.analytics.installAnalytics()

  source.click("/resume/")

  assert.deepEqual(source.captures.map(([event]) => event), ["page_viewed"])
  assert.equal(sharedStorage.size, 1)

  const destination = loadAnalyticsRuntime({ pathname: "/resume/", sharedStorage, now: 1_000_500 })
  destination.analytics.installAnalytics()

  assert.deepEqual(JSON.parse(JSON.stringify(destination.captures)), [
    ["resume_clicked", { action: "open_hub", source_path: "/" }],
    ["page_viewed", { path: "/resume/" }],
  ])
  assert.equal(sharedStorage.size, 0)

  const reload = loadAnalyticsRuntime({ pathname: "/resume/", sharedStorage, now: 1_001_000 })
  reload.analytics.installAnalytics()
  assert.deepEqual(reload.captures.map(([event]) => event), ["page_viewed"])
})

test("invalid or stale pending navigation payloads are removed without capture", () => {
  for (const value of [
    "not json",
    JSON.stringify({ version: 1, event: "thought_submitted", properties: { thought: "private" }, created_at_ms: 1_000_000 }),
    JSON.stringify({
      version: 1,
      event: "navigation_clicked",
      properties: { destination: "/research/", region: "private note", source_path: "/" },
      created_at_ms: 1_000_000,
    }),
    JSON.stringify({ version: 1, event: "resume_clicked", properties: { action: "open_hub", source_path: "/" }, created_at_ms: 1 }),
  ]) {
    const sharedStorage = new Map([["portfolio.analytics.pending.v1", value]])
    const runtime = loadAnalyticsRuntime({ pathname: "/resume/", sharedStorage, now: 1_000_000 })
    runtime.analytics.installAnalytics()

    assert.deepEqual(runtime.captures.map(([event]) => event), ["page_viewed"])
    assert.equal(sharedStorage.size, 0)
  }
})

test("storage failure falls back to an immediate beacon capture without blocking navigation", () => {
  const runtime = loadAnalyticsRuntime({ pathname: "/", storageFailure: "write" })
  runtime.analytics.installAnalytics()

  assert.doesNotThrow(() => runtime.click("/resume/"))
  assert.deepEqual(JSON.parse(JSON.stringify(runtime.captures)), [
    ["page_viewed", { path: "/" }],
    [
      "resume_clicked",
      { action: "open_hub", source_path: "/" },
      { send_instantly: true, transport: "sendBeacon" },
    ],
  ])
})

test("résumé PDF actions use stable explicit markers and immediate delivery", () => {
  const runtime = loadAnalyticsRuntime({ pathname: "/resume/" })
  runtime.analytics.installAnalytics()

  runtime.click("/assets/files/Maverick_Espinosa_Resume.pdf", {
    dataset: { resumeAction: "view_pdf" },
    target: "_blank",
  })
  runtime.click("/assets/files/Maverick_Espinosa_Resume.pdf", {
    dataset: { resumeAction: "download_pdf" },
    download: true,
  })

  assert.deepEqual(JSON.parse(JSON.stringify(runtime.captures.slice(1))), [
    [
      "resume_clicked",
      { action: "view_pdf", source_path: "/resume/" },
      { send_instantly: true, transport: "sendBeacon" },
    ],
    [
      "resume_clicked",
      { action: "download_pdf", source_path: "/resume/" },
      { send_instantly: true, transport: "sendBeacon" },
    ],
  ])
  assert.match(releasedResume, /data-resume-action="view_pdf"/)
  assert.match(releasedResume, /data-resume-action="download_pdf"/)
  assert.doesNotMatch(analyticsSource, /Resume_09_20_2025/)
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
