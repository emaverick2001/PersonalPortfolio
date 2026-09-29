import type { CaptureResult } from "posthog-js"

type AnalyticsEventProperties = {
  page_viewed: { path: string }
  navigation_clicked: { destination: string; region: string; source_path: string }
  project_opened: { project_slug: string; source_path: string }
  resume_clicked: { action: "open_hub" | "view_pdf" | "download_pdf"; source_path: string }
  contact_clicked: { channel: "email"; source_path: string }
  inspirations_filter_changed: { category: string }
  inspirations_sort_changed: { order: string }
}

type AnalyticsEvent = keyof AnalyticsEventProperties

const analyticsPropertyAllowlist = {
  page_viewed: ["path"],
  navigation_clicked: ["destination", "region", "source_path"],
  project_opened: ["project_slug", "source_path"],
  resume_clicked: ["action", "source_path"],
  contact_clicked: ["channel", "source_path"],
  inspirations_filter_changed: ["category"],
  inspirations_sort_changed: ["order"],
} as const satisfies Record<AnalyticsEvent, readonly string[]>

const transportProperties = ["token", "distinct_id", "$cookieless_mode"] as const

export function filterAnalyticsEvent(capture: CaptureResult | null): CaptureResult | null {
  if (!capture || !Object.prototype.hasOwnProperty.call(analyticsPropertyAllowlist, capture.event)) return null

  const event = capture.event as AnalyticsEvent
  const properties: CaptureResult["properties"] = {}
  for (const key of [...transportProperties, ...analyticsPropertyAllowlist[event]]) {
    if (Object.prototype.hasOwnProperty.call(capture.properties, key)) {
      properties[key] = capture.properties[key]
    }
  }

  const filtered: CaptureResult = {
    uuid: capture.uuid,
    event,
    properties,
  }
  if (capture.timestamp) filtered.timestamp = capture.timestamp
  return filtered
}

const productionHosts = new Set(["maverickespinosa.com"])
const previewRoutes = ["/preview/", "/about-preview/", "/work-preview/", "/synthesizer-preview/"]

export type ReleaseEnvironment = "production" | "staging"

export function resolveReleaseEnvironment(value: string | undefined, isDevelopment: boolean): ReleaseEnvironment {
  if (!value && isDevelopment) return "production"
  if (value === "production" || value === "staging") return value
  throw new Error('PUBLIC_SITE_ENV must be "production" or "staging" for release builds')
}

export function shouldEnableAnalytics(
  location: Pick<Location, "hostname" | "pathname">,
  environment: string | null | undefined,
  enabled: boolean,
) {
  return environment === "production"
    && enabled
    && productionHosts.has(location.hostname)
    && !previewRoutes.some(route => location.pathname.startsWith(route))
}

function currentPath() {
  return window.location.pathname
}

function captureAnalytics<Event extends AnalyticsEvent>(event: Event, properties: AnalyticsEventProperties[Event]) {
  window.posthog?.capture(event, properties)
}

function navigationRegion(nav: HTMLElement) {
  const label = nav.getAttribute("aria-label")
  const regions: Record<string, string> = {
    "Main navigation": "main",
    "Portfolio pages": "portfolio",
    "Social and contact links": "social",
    "Selected projects": "selected_projects",
    "Browse inspiration categories": "inspirations_index",
  }
  return label ? regions[label] ?? "other" : "other"
}

function destinationFor(url: URL) {
  return url.origin === window.location.origin ? url.pathname : url.hostname
}

function trackAnchor(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href")
  if (!href) return

  const sourcePath = currentPath()

  if (href.startsWith("mailto:")) {
    captureAnalytics("contact_clicked", { channel: "email", source_path: sourcePath })
    return
  }

  const url = new URL(anchor.href, window.location.href)
  const resumeAction = anchor.dataset.resumeAction

  if (url.pathname === "/resume/") {
    captureAnalytics("resume_clicked", { action: "open_hub", source_path: sourcePath })
    return
  }

  if (resumeAction === "view_pdf" || resumeAction === "download_pdf") {
    captureAnalytics("resume_clicked", { action: resumeAction, source_path: sourcePath })
    return
  }

  const projectMatch = url.origin === window.location.origin
    ? url.pathname.match(/^\/projects\/([^/]+)\/$/)
    : null
  if (projectMatch?.[1] && url.pathname !== sourcePath) {
    captureAnalytics("project_opened", { project_slug: projectMatch[1], source_path: sourcePath })
    return
  }

  const nav = anchor.closest("nav")
  if (nav instanceof HTMLElement) {
    captureAnalytics("navigation_clicked", {
      destination: destinationFor(url),
      region: navigationRegion(nav),
      source_path: sourcePath,
    })
  }
}

export function installAnalytics() {
  if (document.documentElement.dataset.analyticsReady === "true") return
  document.documentElement.dataset.analyticsReady = "true"

  captureAnalytics("page_viewed", { path: currentPath() })
  document.addEventListener("click", event => {
    if (!(event.target instanceof Element)) return
    const anchor = event.target.closest("a")
    if (anchor instanceof HTMLAnchorElement) trackAnchor(anchor)
  })
}

export function trackInspirationsFilterChanged(category: string) {
  captureAnalytics("inspirations_filter_changed", { category })
}

export function trackInspirationsSortChanged(order: string) {
  captureAnalytics("inspirations_sort_changed", { order })
}
