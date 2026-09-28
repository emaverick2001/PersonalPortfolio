const dayButton = document.getElementById('theme-day') as HTMLButtonElement
const nightButton = document.getElementById('theme-night') as HTMLButtonElement
let preference: string | null = null
try { preference = localStorage.getItem('theme') } catch { /* File previews may disallow storage. */ }
function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
  dayButton.setAttribute('aria-pressed', String(!dark))
  nightButton.setAttribute('aria-pressed', String(dark))
}
applyTheme(preference !== 'light')
function selectTheme(dark: boolean) {
  preference = dark ? 'dark' : 'light'
  applyTheme(dark)
  try { localStorage.setItem('theme', preference) } catch { /* Keep this visit usable without storage. */ }
}
dayButton.addEventListener('click', () => selectTheme(false))
nightButton.addEventListener('click', () => selectTheme(true))
window.addEventListener('storage', event => {
  if (event.key === 'theme') {
    preference = event.newValue
    applyTheme(preference !== 'light')
  }
})
