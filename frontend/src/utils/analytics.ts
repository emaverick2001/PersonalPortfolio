// src/utils/analytics.ts

// ---------- CTA & Project Events ----------
export function trackCTA(name: string, location: string) {
  window.posthog?.capture("cta_clicked", { cta_name: name, location })
}

export function trackProjectOpened(project: string, section: string) {
  window.posthog?.capture("project_opened", { project, section })
}

// ---------- Section View Event ----------
export function trackSectionView(selector: string, sectionName: string) {
  const el = document.querySelector(selector)
  if (!el || !window.posthog) return

  let sent = false
  const observer = new IntersectionObserver(
    (entries, obs) => {
      if (sent) return
      const entry = entries[0]
      if (entry && entry.isIntersecting && entry.intersectionRatio >= 0.4) {
        if (window.posthog) {
          window.posthog.capture("section_viewed", { section: sectionName })
        }
        sent = true
        obs.disconnect()
      }
    },
    { threshold: [0.4] },
  )

  observer.observe(el)
}
