export interface SoftwareData {
  name: string
  lang: string
  desc: string
  sourceCode?: string
  link?: string
  enabled?: boolean
}

export interface PerformanceData {
  name: string
  date: string
  hrefLink: string
  thumbnailLink?: string
}
