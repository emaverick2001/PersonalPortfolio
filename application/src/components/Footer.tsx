import { useEffect } from "react"
import { socialIcons } from "src/content/socials"
import { navLink } from "src/content/navInfo"

export const FooterSection: React.FC = () => {
  useEffect(() => {
    const btn = document.getElementById("scrollTopBtn")
    if (!btn) return

    const toggleVisibility = () => {
      const btn = document.getElementById("scrollTopBtn")
      if (!btn) return

      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Show button when user is within 100px of the bottom
      if (scrollY + windowHeight >= documentHeight - 100) {
        btn.classList.remove("opacity-0", "-translate-y-4", "pointer-events-none")
        btn.classList.add("opacity-100", "translate-y-0")
      } else {
        btn.classList.add("opacity-0", "-translate-y-4", "pointer-events-none")
        btn.classList.remove("opacity-100", "translate-y-0")
      }
    }

    toggleVisibility()
    window.addEventListener("scroll", toggleVisibility, { passive: true })
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }))

    return () => {
      window.removeEventListener("scroll", toggleVisibility)
      btn.removeEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }))
    }
  }, [])
  return (
    <footer className="w-full border-t-4 border-gray-200 bg-zinc-100 py-8 text-sm text-gray-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
      <div className="container">
        <div className="flex items-center justify-between">
          <div>
            <a href="/">
              <img
                src="/assets/images/websitelogonobackground.png"
                alt="Logo"
                className="h-10 w-10 dark:invert"
              />
            </a>
          </div>
          {/* NavLinks: hidden on mobile, visible on tablet and up */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLink.map((routes) => (
              <a
                key={routes.title}
                href={routes.route}
                className="font-serif text-lg font-black tracking-tight text-black transition duration-300 hover:text-zinc-500 dark:text-zinc-100 dark:hover:text-zinc-400"
              >
                {routes.title}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-4 items-center justify-between md:flex">
          <p>
            &copy; {new Date().getFullYear()} Maverick Espinosa. Site made with{" "}
            <a
              href="https://astro.build/"
              className="underline hover:text-blue-600 dark:hover:text-blue-400"
            >
              Astro
            </a>
            .
          </p>
          <div className="mt-4 flex justify-center gap-4 md:mt-0">
            {socialIcons.map((icons) => (
              <a
                key={icons.href}
                href={icons.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-10 items-center justify-center rounded-full bg-zinc-300 transition hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                aria-label="Social link"
              >
                {icons.icon}
              </a>
            ))}
          </div>
        </div>
        {/* -- Scroll to top button (centered, overlaps footer)*/}
        <button
          id="scrollTopBtn"
          aria-label="Scroll to top"
          className="pointer-events-none fixed bottom-24 left-1/2 z-50 -translate-x-1/2 -translate-y-4 rounded-full border border-gray-200 bg-white p-3 opacity-0 shadow-lg transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900"
          title="Back to top"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700 dark:text-zinc-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    </footer>
  )
}
