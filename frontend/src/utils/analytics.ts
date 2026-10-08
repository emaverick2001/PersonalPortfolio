import type { CaptureOptions, CaptureResult } from "posthog-js"

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

type AnalyticsInteraction = {
  [Event in AnalyticsEvent]: {
    event: Event
    properties: AnalyticsEventProperties[Event]
  }
}[AnalyticsEvent]

const analyticsPropertyAllowlist = {
  page_viewed: ["path"],
  navigation_clicked: ["destination", "region", "source_path"],
  project_opened: ["project_slug", "source_path"],
  resume_clicked: ["action", "source_path"],
  contact_clicked: ["channel", "source_path"],
  inspirations_filter_changed: ["category"],
  inspirations_sort_changed: ["order"],
} as const satisfies Record<AnalyticsEvent, readonly string[]>

const transportProperties = ["token", "distinct_id", "$cookieless_mode", "$process_person_profile"] as const
const pendingAnalyticsKey = "portfolio.analytics.pending.v1"
const pendingAnalyticsLifetimeMs = 60_000
const analyticsExclusionKey = "portfolio.analytics.excluded.v1"
const immediateCaptureOptions = { send_instantly: true, transport: "sendBeacon" } as const satisfies CaptureOptions
const allowedNavigationRegions = new Set(["main", "portfolio", "social", "selected_projects", "inspirations_index", "other"])

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
  excluded: boolean,
) {
  return environment === "production"
    && enabled
    && !excluded
    && productionHosts.has(location.hostname)
    && !previewRoutes.some(route => location.pathname.startsWith(route))
}

type AnalyticsPreferenceLocation = Pick<Location, "href">
type AnalyticsPreferenceHistory = Pick<History, "state" | "replaceState">
type AnalyticsPreferenceStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">

function cleanAnalyticsControl(url: URL, history: AnalyticsPreferenceHistory) {
  if (!url.searchParams.has("analytics")) return
  url.searchParams.delete("analytics")
  const replacement = `${url.pathname}${url.search}${url.hash}`
  try {
    history.replaceState(history.state, "", replacement)
  } catch {
    // URL cleanup is best-effort and must not break the page.
  }
}

export function resolveAnalyticsExclusion(
  location: AnalyticsPreferenceLocation,
  history: AnalyticsPreferenceHistory,
  storage: AnalyticsPreferenceStorage,
) {
  const url = new URL(location.href)
  const command = url.searchParams.get("analytics")
  cleanAnalyticsControl(url, history)

  if (command === "exclude") {
    try {
      storage.setItem(analyticsExclusionKey, "true")
    } catch {
      // The explicit opt-out still applies to this page when persistence fails.
    }
    return true
  }

  if (command === "include") {
    try {
      storage.removeItem(analyticsExclusionKey)
      return false
    } catch {
      return true
    }
  }

  try {
    return storage.getItem(analyticsExclusionKey) === "true"
  } catch {
    return true
  }
}

function currentPath() {
  return window.location.pathname
}

function captureAnalytics<Event extends AnalyticsEvent>(
  event: Event,
  properties: AnalyticsEventProperties[Event],
  options?: CaptureOptions,
) {
  if (options) window.posthog?.capture(event, properties, options)
  else window.posthog?.capture(event, properties)
}

function captureInteraction(interaction: AnalyticsInteraction, options?: CaptureOptions) {
  if (options) window.posthog?.capture(interaction.event, interaction.properties, options)
  else window.posthog?.capture(interaction.event, interaction.properties)
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

function interactionForAnchor(anchor: HTMLAnchorElement): { interaction: AnalyticsInteraction; url?: URL } | null {
  const href = anchor.getAttribute("href")
  if (!href) return null

  const sourcePath = currentPath()

  if (href.startsWith("mailto:")) {
    return {
      interaction: { event: "contact_clicked", properties: { channel: "email", source_path: sourcePath } },
    }
  }

  const url = new URL(anchor.href, window.location.href)
  const resumeAction = anchor.dataset.resumeAction

  if (url.pathname === "/resume/") {
    return {
      interaction: { event: "resume_clicked", properties: { action: "open_hub", source_path: sourcePath } },
      url,
    }
  }

  if (resumeAction === "view_pdf" || resumeAction === "download_pdf") {
    return {
      interaction: { event: "resume_clicked", properties: { action: resumeAction, source_path: sourcePath } },
      url,
    }
  }

  const projectMatch = url.origin === window.location.origin
    ? url.pathname.match(/^\/projects\/([^/]+)\/$/)
    : null
  if (projectMatch?.[1] && url.pathname !== sourcePath) {
    return {
      interaction: {
        event: "project_opened",
        properties: { project_slug: projectMatch[1], source_path: sourcePath },
      },
      url,
    }
  }

  const nav = anchor.closest("nav")
  if (nav instanceof HTMLElement) {
    return {
      interaction: {
        event: "navigation_clicked",
        properties: {
          destination: destinationFor(url),
          region: navigationRegion(nav),
          source_path: sourcePath,
        },
      },
      url,
    }
  }

  return null
}

function isControlledPath(value: unknown): value is string {
  return typeof value === "string"
    && value.startsWith("/")
    && !value.includes("?")
    && !value.includes("#")
    && value.length <= 200
}

function isNavigationRegion(value: unknown): value is string {
  return typeof value === "string" && allowedNavigationRegions.has(value)
}

function parsePendingInteraction(raw: string, now: number): AnalyticsInteraction | null {
  let pending: unknown
  try {
    pending = JSON.parse(raw)
  } catch {
    return null
  }

  if (!pending || typeof pending !== "object") return null
  const candidate = pending as Record<string, unknown>
  const createdAt = candidate.created_at_ms
  if (candidate.version !== 1 || typeof createdAt !== "number") return null
  const age = now - createdAt
  if (age < -5_000 || age > pendingAnalyticsLifetimeMs) return null

  const properties = candidate.properties
  if (!properties || typeof properties !== "object") return null
  const values = properties as Record<string, unknown>

  if (candidate.event === "resume_clicked"
    && values.action === "open_hub"
    && isControlledPath(values.source_path)) {
    return {
      event: "resume_clicked",
      properties: { action: "open_hub", source_path: values.source_path },
    }
  }

  if (candidate.event === "project_opened"
    && typeof values.project_slug === "string"
    && /^[a-z0-9-]{1,100}$/.test(values.project_slug)
    && isControlledPath(values.source_path)) {
    return {
      event: "project_opened",
      properties: { project_slug: values.project_slug, source_path: values.source_path },
    }
  }

  if (candidate.event === "navigation_clicked"
    && isControlledPath(values.destination)
    && isNavigationRegion(values.region)
    && isControlledPath(values.source_path)) {
    return {
      event: "navigation_clicked",
      properties: {
        destination: values.destination,
        region: values.region,
        source_path: values.source_path,
      },
    }
  }

  return null
}

function queueInteractionForDestination(interaction: AnalyticsInteraction) {
  try {
    window.sessionStorage.setItem(pendingAnalyticsKey, JSON.stringify({
      version: 1,
      event: interaction.event,
      properties: interaction.properties,
      created_at_ms: Date.now(),
    }))
    return true
  } catch {
    return false
  }
}

function consumePendingInteraction() {
  let raw: string | null
  try {
    raw = window.sessionStorage.getItem(pendingAnalyticsKey)
    if (raw !== null) window.sessionStorage.removeItem(pendingAnalyticsKey)
  } catch {
    return null
  }

  return raw === null ? null : parsePendingInteraction(raw, Date.now())
}

function shouldHandoffToDestination(anchor: HTMLAnchorElement, url: URL | undefined, event: MouseEvent) {
  if (!url || url.origin !== window.location.origin || url.pathname === currentPath()) return false
  if (anchor.hasAttribute("download")) return false
  if (anchor.target && anchor.target !== "_self") return false
  return event.button === 0
    && !event.metaKey
    && !event.ctrlKey
    && !event.shiftKey
    && !event.altKey
}

function trackAnchor(anchor: HTMLAnchorElement, event: MouseEvent) {
  const classified = interactionForAnchor(anchor)
  if (!classified) return

  if (shouldHandoffToDestination(anchor, classified.url, event)
    && queueInteractionForDestination(classified.interaction)) {
    return
  }

  captureInteraction(classified.interaction, immediateCaptureOptions)
}

export function installAnalytics() {
  if (document.documentElement.dataset.analyticsReady === "true") return
  document.documentElement.dataset.analyticsReady = "true"

  const pendingInteraction = consumePendingInteraction()
  if (pendingInteraction) captureInteraction(pendingInteraction)
  captureAnalytics("page_viewed", { path: currentPath() })
  document.addEventListener("click", event => {
    if (event.defaultPrevented) return
    if (!(event.target instanceof Element)) return
    const anchor = event.target.closest("a")
    if (anchor instanceof HTMLAnchorElement) trackAnchor(anchor, event)
  })
}

export function trackInspirationsFilterChanged(category: string) {
  captureAnalytics("inspirations_filter_changed", { category })
}

export function trackInspirationsSortChanged(order: string) {
  captureAnalytics("inspirations_sort_changed", { order })
}
