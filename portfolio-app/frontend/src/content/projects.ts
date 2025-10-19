export const projects = [
  // {
  //   name: "Clarinet BBoard Proxy",
  //   image: "/assets/images/project-1.jpg",
  //   desc: "A mobile-focused reader for the Clarinet BBoard focused on readability, design, and UX.",
  //   sourceCode: "https://github.com/debashisbiswas/bboard-proxy",
  //   projectLink: "https://clarinet-bboard.vercel.app/",
  // },
  {
    name: "Minimet",
    image: "/assets/images/project-2.jpg",
    desc: "Mini metronome, intended to be embedded on smaller screens.",
    sourceCode: "https://github.com/debashisbiswas/minimet",
    projectLink: "https://dbiswas.com/minimet/",
  },
  // {
  //   name: "Spire HTMX",
  //   image: "/assets/images/project-3.jpg",
  //   desc: "Append-only notes augmented with AI - implemented with HTMX.",
  //   sourceCode: "https://github.com/debashisbiswas/spire-htmx",
  // },
  // {
  //   name: "Word of the Day",
  //   image: "/assets/images/project-4.jpg",
  //   desc: 'Quickly generate Japanese "Word of the Day" posts.',
  //   sourceCode: "https://github.com/debashisbiswas/word-of-the-day",
  // },
  {
    name: "Binaural Beats Generator",
    image: "/assets/images/project-5.jpg",
    desc: "Write binaural beats to a WAV file byte-by-byte in Rust.",
    sourceCode: "https://github.com/debashisbiswas/word-of-the-day",
  },
  // {
  //   name: "Duplicate Encode",
  //   desc: "Code optimization challenge with a friend. His solutions were in Python, and mine were in Rust.",
  //   sourceCode: "https://github.com/debashisbiswas/duplicate-encode",
  // },
  {
    name: "Portable Subtitles",
    desc: "Watch videos using the mpv player and sync the subtitles to another device over a WebSocket.",
    sourceCode: "https://github.com/debashisbiswas/portable-subs",
    demo: "https://youtu.be/98LBklGn2f0",
  },
  {
    name: "Scale Scrambler",
    desc: "Web app using randomization to supplement music practice. Used as a teaching tool in the ASU music program.",
    sourceCode: "https://github.com/debashisbiswas/scales",
    projectLink: "https://dbiswas.com/scales/",
  },
]

export const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
