import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
import { AnimatePresence, motion } from "framer-motion"
import { socialIcons } from "src/content/socials"
import { navLink } from "src/content/navInfo"

export const HeaderSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  return (
    <>
      <header className="sticky top-0 z-40 border-b-4 border-gray-200/50 bg-zinc-100/50 backdrop-blur-lg">
        <div className="container">
          <div className="flex h-24 items-center justify-between md:h-28">
            <div>
              <a href="/">
                <img
                  src="/assets/images/websitelogonobackground.png"
                  alt="Logo"
                  className="h-10 w-10"
                />
              </a>
            </div>
            <div className="flex items-center gap-4 md:hidden">
              <div className="relative size-10" onClick={() => setIsOpen((curr) => !curr)}>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div
                    className={twMerge(
                      "h-0.5 w-5 -translate-y-1 bg-black transition-all duration-500",
                      isOpen && "translate-y-0 rotate-45",
                    )}
                  ></div>
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div
                    className={twMerge(
                      "h-0.5 w-5 translate-y-1 bg-black transition-all duration-500",
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
                  className="font-serif text-lg font-black tracking-tight text-black transition duration-300 hover:text-zinc-500"
                >
                  {routes.title}
                </a>
              ))}
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
            className="fixed left-0 top-0 z-30 size-full bg-zinc-100"
          >
            <div className="absolute inset-1 z-0 border border-solid border-[#222222]/10 p-8 shadow-[0_7px_14px_#EAEAEA] md:mt-28">
              {/* add background designs like shapes hexagon etc */}
              <div className="flex h-full flex-col items-center justify-center">
                <nav className="flex flex-col items-center gap-8 text-4xl font-bold tracking-tight md:gap-16">
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
                      <span className="font-serif text-4xl font-black text-black transition duration-300 hover:text-zinc-500 md:text-5xl lg:text-6xl">
                        {routes.title}
                      </span>
                    </motion.a>
                  ))}
                </nav>
                <div className="absolute bottom-4 flex justify-center gap-4 border-t-4 border-gray-200 bg-zinc-100 py-4">
                  {socialIcons.map((icons) => (
                    <a
                      key={icons.href}
                      href={icons.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={icons.onclick}
                      className="inline-flex size-10 items-center justify-center rounded-full bg-zinc-300 transition hover:bg-zinc-400"
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
