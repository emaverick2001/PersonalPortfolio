import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
import { AnimatePresence, motion } from "framer-motion"
import { socialIcons } from "src/content/socials"
import { navLink } from "src/content/navInfo"


export const HeaderSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldBeDark = savedTheme ? savedTheme === "dark" : prefersDark

    setIsDark(shouldBeDark)
    applyTheme(shouldBeDark)
  }, [])

  const applyTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("theme", dark ? "dark" : "light")
  }

  const toggleTheme = () => {
    const newDarkState = !isDark
    setIsDark(newDarkState)
    applyTheme(newDarkState)
  }

  const ThemeToggleButton = () => (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={toggleTheme}
      className="relative inline-flex h-9 w-16 items-center rounded-full border border-zinc-300 bg-zinc-200 p-1 transition-colors duration-300 dark:border-zinc-700 dark:bg-zinc-900"
    >
      <span
        className={twMerge(
          "flex size-7 items-center justify-center rounded-full bg-white text-zinc-700 shadow transition-transform duration-300",
          isDark && "translate-x-7 bg-zinc-100 text-zinc-900",
        )}
      >
        {isDark ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4 text-yellow-500"
          >
            <circle cx="12" cy="12" r="5" />
            <line
              x1="12"
              y1="1"
              x2="12"
              y2="3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="12"
              y1="21"
              x2="12"
              y2="23"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="4.22"
              y1="4.22"
              x2="5.64"
              y2="5.64"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="18.36"
              y1="18.36"
              x2="19.78"
              y2="19.78"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="1"
              y1="12"
              x2="3"
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="21"
              y1="12"
              x2="23"
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="4.22"
              y1="19.78"
              x2="5.64"
              y2="18.36"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="18.36"
              y1="5.64"
              x2="19.78"
              y2="4.22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
    </button>
  )

  return (
    <>
      <header className="sticky top-0 z-40 border-b-4 border-gray-200/50 bg-zinc-100/50 backdrop-blur-lg dark:border-zinc-800/60 dark:bg-zinc-900/70">
        <div className="container">
          <div className="flex h-24 items-center justify-between md:h-28">
            <div>
              <a href="/">
                <img
                  src="/assets/images/websitelogonobackground.png"
                  alt="Logo"
                  className="h-10 w-10 dark:invert"
                />
              </a>
            </div>
            <div className="flex items-center gap-4 md:hidden">
              <ThemeToggleButton />
              <div className="relative size-10" onClick={() => setIsOpen((curr) => !curr)}>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div
                    className={twMerge(
                      "h-0.5 w-5 -translate-y-1 bg-black transition-all duration-500 dark:bg-zinc-100",
                      isOpen && "translate-y-0 rotate-45",
                    )}
                  ></div>
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div
                    className={twMerge(
                      "h-0.5 w-5 translate-y-1 bg-black transition-all duration-500 dark:bg-zinc-100",
                      isOpen && "translate-y-0 -rotate-45",
                    )}
                  ></div>
                </div>
              </div>
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
              <ThemeToggleButton />
            </nav>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed left-0 top-0 z-30 size-full bg-zinc-100 dark:bg-zinc-900"
          >
            <div className="absolute inset-1 z-0 border border-solid border-[#222222]/10 p-8 shadow-[0_7px_14px_#EAEAEA] dark:border-zinc-800/60 dark:shadow-[0_7px_14px_#0F0F0F] md:mt-28">
              {/* add background designs like shapes hexagon etc */}
              <div className="flex h-full flex-col items-center justify-center">
                <nav className="flex max-h-[60vh] flex-col items-center gap-8 overflow-y-auto pr-8 text-4xl font-bold tracking-tight md:gap-16">
                  {navLink.map((routes, index) => (
                    <motion.a
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: "linear",
                        delay: 0.25 * index,
                      }}
                      key={routes.title}
                      href={routes.route}
                    >
                      <span className="font-serif text-4xl font-black text-black transition duration-300 hover:text-zinc-500 dark:text-zinc-100 dark:hover:text-zinc-400 md:text-5xl lg:text-6xl">
                        {routes.title}
                      </span>
                    </motion.a>
                  ))}
                </nav>
                <div className="absolute bottom-4 flex justify-center gap-4 border-t-4 border-gray-200 bg-zinc-100 py-4 dark:border-zinc-800 dark:bg-zinc-900">
                  {socialIcons.map((icons) => (
                    <a
                      key={icons.href}
                      href={icons.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={icons.onclick}
                      className="inline-flex size-10 items-center justify-center rounded-full bg-zinc-300 transition hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                      aria-label="Social link"
                    >
                      {icons.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
