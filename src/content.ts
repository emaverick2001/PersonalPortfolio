// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.
import type { SoftwareData, PerformanceData } from "./types"

export const SITE_TITLE = "Debashis Biswas"
export const SITE_DESCRIPTION =
  "Collection of software projects and music performances by Debashis Biswas"

export const SOFTWARE_PROJECTS: SoftwareData[] = [
  {
    name: "SRP Peak Status",
    lang: "HTML/CSS/JS + Bootstrap",
    desc: "Displays current SRP peak status to help decide when to use energy throughout the day.",
    sourceCode: "https://github.com/debashisbiswas/srp-peak-status",
    link: "https://debashisbiswas.github.io/srp-peak-status/",
  },
  {
    name: "Binaural Beats Generator",
    lang: "Rust",
    desc: "CLI program to create binaural beats, writing to a WAV file.",
    sourceCode: "https://github.com/debashisbiswas/rust_binaural_beats",
  },
  {
    name: "Senior Recital Program",
    lang: "HTML/CSS/JS + Bootstrap",
    desc: "Music program for my senior clarinet recital, accessible on mobile devices through a QR code and the web.",
    sourceCode: "https://github.com/debashisbiswas/senior-recital-program",
    link: "https://debashisbiswas.github.io/senior-recital-program/",
  },
  {
    name: "Duplicate Encode",
    lang: "Python + Rust",
    desc: "Exploration of optimization in Python and Rust for a simple coding puzzle",
    sourceCode: "https://github.com/debashisbiswas/duplicate-encode",
  },
  {
    name: "Word of the Day Generator",
    lang: "Python",
    desc: "Automatically generate posts for Japanese vocabulary words, including definitions and example sentences",
    sourceCode: "https://github.com/debashisbiswas/word-of-the-day",
  },
  {
    name: "Additive Synthesis Website",
    lang: "HTML/CSS/JS + Bootstrap",
    desc: "Webpage that demonstrates instrumental additive synthesis through the JavaScript Web Audio API",
    sourceCode: "https://github.com/debashisbiswas/timbre-gen",
    link: "https://debashisbiswas.github.io/timbre-gen/",
  },
  {
    name: "Scale Scrambler",
    lang: "HTML/CSS/JS + Bootstrap",
    desc: "Responsive web app that randomizes fundamental exercises to supplement music practice",
    sourceCode: "https://github.com/debashisbiswas/scales",
    link: "https://debashisbiswas.github.io/scales",
  },
  {
    name: "KKΨ Beta Omicron Website",
    lang: "Firebase + Node.js + Bootstrap",
    desc: "Website, built from the ground up, to digitize history for the Beta Omicron Chapter of ΚΚΨ.",
    link: "https://kkp-bo-website.web.app",
  },
  {
    name: "Teleprompter",
    lang: "Android (Java + Kotlin)",
    desc: "Teleprompter Android App on the Google Play Store",
    sourceCode: "https://github.com/debashisbiswas/teleprompter",
    link: "https://play.google.com/store/apps/details?id=com.maestoso.teleprompter",
  },
  {
    name: "KOA Pom War 2021 Bot",
    lang: "Python + MySQL",
    desc: "Discord bot that managed the Knights of Academia 2021 Pom War, a competition to log pomodoro sessions",
  },
]

export const OPEN_SOURCE_CONTRIBUTIONS: SoftwareData[] = [
  {
    name: "Eminent Reader",
    lang: "Node.js",
    desc: "Japanese webnovel downloader and reader, to supplement Japanese study",
    sourceCode: "https://github.com/cademcniven/Eminent-Reader",
  },
  {
    name: "Habitica for Android",
    lang: "Java + Kotlin",
    desc: "A habit-building application that uses game mechanics from classic RPGs to motivate users to achieve their goals",
    sourceCode: "https://github.com/HabitRPG/habitica-android",
  },
  {
    name: "Stardew Checkup",
    lang: "HTML/ CSS / JS",
    desc: "Checks achievement and milestone progress on a Stardew Valley save file",
    sourceCode: "https://github.com/MouseyPounds/stardew-checkup",
  },
  {
    name: "Horace",
    lang: "JavaScript + Node.js",
    desc: "Discord bot that oversees the Knights of Academia Discord server",
    sourceCode: "https://github.com/Knights-Of-Academia/horace",
  },
]

export const MUSIC_PERFORMANCES: PerformanceData[] = [
  {
    name: "Senior Clarinet Recital",
    date: "April 16, 2022",
    embedLink: "https://www.youtube.com/embed/1t8fU8YPe2c",
  },
  {
    name: "Lowenstern: My Favorite Things",
    date: "February 21, 2022",
    embedLink: "https://www.youtube.com/embed/kQSEs8U5Ee4",
  },
  {
    name: "Artie Shaw: Concerto (Ensemble)",
    date: "November 23, 2021",
    embedLink: "https://www.youtube.com/embed/cIxiNypcWpo?start=1974",
  },
  {
    name: "Parker: Grooves",
    date: "November 15, 2021",
    embedLink: "https://www.youtube.com/embed/Lv3ftDBDmh0?start=34",
  },
  {
    name: "Shared Recital with Adam Schay",
    date: "April 15, 2021",
    embedLink: "https://www.youtube.com/embed/KOUfF_aeAZk?start=2475",
  },
  {
    name: "Piazzolla: 3 Tangos (Live)",
    date: "November 21, 2020",
    embedLink: "https://www.youtube.com/embed/bs_aJkjmj64?start=3407",
  },
  {
    name: "Piazzolla: 3 Tangos",
    date: "November 15, 2020",
    embedLink: "https://www.youtube.com/embed/d8VvURsGo2E",
  },
  {
    name: "Views of the Blues with Lizeth Gil",
    date: "April 25, 2020",
    embedLink: "https://www.youtube.com/embed/txnp8mszRsU?start=2080",
  },
  {
    name: "Szalowski: Sonatina - 1, 2",
    date: "December 2, 2019",
    embedLink: "https://www.youtube.com/embed/JgM6tUMkcaY",
  },
  {
    name: "Russell: Bass Clarinet Double Concerto (ensemble)",
    date: "November 22, 2019",
    embedLink: "https://www.youtube.com/embed//k3XtJrf4-eI?start=4205",
  },
  {
    name: "Weber: Concertino",
    date: "July 15, 2019",
    embedLink: "https://www.youtube.com/embed/0YFkiAuHW-M",
  },
  {
    name: "Shared Recital with Selena Graf",
    date: "April 14, 2019",
    embedLink: "https://www.youtube.com/embed/7m8qzWEhSZM?start=565",
  },
  {
    name: "Mandat: Tricolor Capers - 1, 2",
    date: "October 28, 2019",
    embedLink: "https://www.youtube.com/embed/LWCXOTGhLk0",
  },
  {
    name: "Mandat: Tricolor Capers - 1",
    date: "September 23, 2019",
    embedLink: "https://www.youtube.com/embed/Wl-MR09BpGc",
  },
  {
    name: "Devienne: Deuxieme Sonata",
    date: "March 18, 2019",
    embedLink: "https://www.youtube.com/embed/MZBN6R462Zw",
  },
]
