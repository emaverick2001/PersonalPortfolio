import { Triangle, BookMarkedIcon, RadioIcon, CodeIcon } from "lucide-react"
import { useState } from "react"
import { twMerge } from "tailwind-merge"
import { AnimatePresence, motion } from "framer-motion"
import { projects, slugify } from "../content/projects"

export default function ProjectAccordion() {
  const [selectedIndex, setSelectedIndex] = useState<null | number>(null)

  return (
    <div className="mx-auto mb-6 grid max-w-5xl grid-cols-1 items-start gap-8 md:grid-cols-2">
      {projects.map((project, projectIndex) => (
        <div
          key={projectIndex}
          className={twMerge(
            "w-full cursor-pointer rounded-3xl border border-solid border-[#222222]/10 bg-white p-8 text-zinc-900 shadow-[0_7px_14px_#EAEAEA] transition duration-200 hover:bg-zinc-200 dark:border-zinc-800/60 dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-[0_7px_14px_#0F0F0F] dark:hover:bg-zinc-700",
          )}
          onClick={() => {
            setSelectedIndex(projectIndex)
            project.onclick()
          }}
        >
          <div className="aspect-video">
            <img
              src={project.image}
              alt="Project Image"
              width="256"
              height="256"
              className="size-full rounded-lg object-cover"
            />
          </div>
          <div className="mt-6 flex items-center justify-between">
            <h3 className="text-xl font-bold">{project.name}</h3>
            <Triangle
              className={twMerge(
                "h-5 w-5 flex-shrink-0 rotate-90 fill-black transition duration-300 dark:fill-zinc-100",
                selectedIndex === projectIndex && "rotate-180",
              )}
            />
          </div>
          <AnimatePresence>
            {selectedIndex === projectIndex && (
              <motion.div
                initial={{
                  height: 0,
                  marginTop: 0,
                }}
                animate={{
                  height: "auto",
                  marginTop: 24,
                }}
                exit={{
                  height: 0,
                  marginTop: 0,
                }}
                className={twMerge("mt-6 overflow-hidden")}
              >
                <p className="mb-4 text-base font-medium text-zinc-700 dark:text-zinc-200">
                  {project.desc}
                </p>
                <div className="mb-1 mt-6 flex flex-col flex-wrap items-center gap-3 lg:flex-row lg:items-start lg:justify-start">
                  <a
                    href={`/projects/${slugify(project.name)}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-auto items-center gap-2 rounded-full bg-zinc-100 px-3 py-3 text-base font-medium text-black shadow transition hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <BookMarkedIcon className="h-5 w-5" />
                    Learn More
                  </a>
                  {project.projectLink && (
                    <a
                      href={project.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-auto items-center gap-2 rounded-full bg-zinc-100 px-3 py-3 text-base font-medium text-black shadow transition hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <RadioIcon className="h-5 w-5" />
                      Live Demo
                    </a>
                  )}
                  {project.sourceCode && (
                    <a
                      href={project.sourceCode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-auto items-center gap-2 rounded-full bg-zinc-100 px-3 py-3 text-base font-medium text-black shadow transition hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <CodeIcon className="h-5 w-5" />
                      Source Code
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
