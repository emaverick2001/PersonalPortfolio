import React from "react"

type Props = {
  href: string
  children: React.ReactNode
}

export const Link: React.FC<Props> = ({ href, children }) => (
  <a
    href={href}
    className="underline decoration-purple-500 decoration-2 underline-offset-2 transition ease-out hover:text-purple-500"
  >
    {children}
  </a>
)
