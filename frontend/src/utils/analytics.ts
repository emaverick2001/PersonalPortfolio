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

const productionHosts = new Set(["maverickespinosa.com"])
const previewRoutes = ["/preview/", "/about-preview/", "/work-preview/", "/synthesizer-preview/"]

export function shouldEnableAnalytics(location: Pick<Location, "hostname" | "pathname">) {
  return productionHosts.has(location.hostname) && !previewRoutes.some(route => location.pathname.startsWith(route))
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

  if (url.pathname === "/resume/" || url.pathname.endsWith("/Resume_09_20_2025.pdf")) {
    const action = url.pathname === "/resume/" ? "open_hub" : anchor.hasAttribute("download") ? "download_pdf" : "view_pdf"
    captureAnalytics("resume_clicked", { action, source_path: sourcePath })
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
