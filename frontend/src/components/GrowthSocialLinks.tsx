import { socialIcons } from '../content/socials'

// Render the existing brand icons on the server, without tracking handlers or hydration.
const links = [
  { index: 2, label: 'GitHub' },
  { index: 1, label: 'LinkedIn' },
  { index: 3, label: 'SoundCloud' },
  { index: 0, label: 'X' },
  { index: 4, label: 'Email' },
]
export default function GrowthSocialLinks() {
  return <nav className="social-links" aria-label="Social and contact links">
    {links.map(({ index, label }) => {
      const social = socialIcons[index]!
      return <a key={label} href={social.href} aria-label={label} title={label}>
        <span aria-hidden="true">{social.icon}</span>
      </a>
    })}
  </nav>
}
