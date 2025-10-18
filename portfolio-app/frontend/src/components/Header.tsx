import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
import { AnimatePresence, motion } from "framer-motion"

interface Route {
  title: string
  route: string
}

const navLink: Route[] = [
  { title: "Home", route: "/" },
  { title: "Software", route: "/software/" },
  //   { title: "Blog", route: "/blog/" },
  //   { title: "Streams", route: "/streams/" },
  //   { title: "Music", route: "/music/" },
  //   { title: "Inspirations", route: "/inspirations/" },
  //   { title: "Keyboards", route: "/keyboards/" },
]

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
              <img src="/websitelogonobackground.png" alt="Logo" className="h-10 w-10" />
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
                  className="font-serif text-lg font-bold tracking-tight text-black transition duration-200 hover:text-white"
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
            <div className="absolute inset-2 z-0 mt-24 rounded-md bg-zinc-200 md:mt-28">
              {/* add background designs like shapes hexagon etc */}
              <div className="flex h-full items-center justify-center">
                {/* Want to create hamburger menu for mobile view with the navLink */}
                <nav className="flex flex-col items-center gap-12 text-4xl font-bold tracking-tight md:gap-16">
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
