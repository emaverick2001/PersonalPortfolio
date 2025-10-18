export const FooterSection: React.FC = () => {
  return (
    <footer className="mt-12 w-full border-t-4 border-gray-200 bg-zinc-100 text-sm text-gray-700">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-2 px-4 py-6 md:flex-row">
        <div>
          © {new Date().getFullYear()} Maverick Espinosa.
          <br />
          Site made with{" "}
          <a href="https://astro.build/" className="underline hover:text-blue-600">
            Astro
          </a>
          .
        </div>
        <div className="flex items-center gap-4">
          <a href="mailto:your@email.com" aria-label="Email" className="hover:text-blue-600">
            <svg
              className="inline h-5 w-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 4h16v16H4V4zm0 0l8 8 8-8"></path>
            </svg>
          </a>
          <a
            href="https://github.com/yourusername"
            aria-label="GitHub"
            className="hover:text-blue-600"
          >
            <svg className="inline h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.92.58.11.79-.25.79-.56v-2.01c-3.2.7-3.87-1.54-3.87-1.54-.53-1.35-1.29-1.71-1.29-1.71-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.45.11-3.02 0 0 .97-.31 3.18 1.18a11.1 11.1 0 012.9-.39c.98.01 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.57.23 2.73.12 3.02.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.08.79 2.18v3.23c0 .31.21.67.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"></path>
            </svg>
          </a>
          <a
            href="https://x.com/MaverickEspDev"
            aria-label="Twitter"
            className="hover:text-blue-600"
          >
            <svg className="inline h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4.36a9.09 9.09 0 01-2.88 1.1A4.48 4.48 0 0016.11 0c-2.48 0-4.49 2.01-4.49 4.49 0 .35.04.69.11 1.02C7.69 5.4 4.07 3.67 1.64 1.15c-.38.65-.6 1.4-.6 2.21 0 1.53.78 2.88 1.97 3.67A4.48 4.48 0 01.96 6.1v.06c0 2.14 1.52 3.93 3.54 4.33-.37.1-.76.16-1.16.16-.28 0-.55-.03-.81-.08.55 1.72 2.16 2.97 4.07 3A9.05 9.05 0 010 19.54a12.8 12.8 0 006.94 2.03c8.33 0 12.89-6.9 12.89-12.89 0-.2 0-.39-.01-.58A9.22 9.22 0 0023 3z"></path>
            </svg>
          </a>
        </div>
        <div>
          <a href="/accessibility" className="underline hover:text-blue-600">
            Accessibility
          </a>
        </div>
      </div>

      {/*-- Scroll to top button (centered, overlaps footer)*/}
      {/*} <button
    id="scrollTopBtn"
    aria-label="Scroll to top"
    className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50 bg-white border border-gray-200 rounded-full p-3 shadow-lg transition-all duration-300 opacity-0 -translate-y-4 pointer-events-none"
    title="Back to top"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  </button>

  <script type="module">
    const btn = document.getElementById('scrollTopBtn');
    if (btn) {
      const toggleVisibility = () => {
        if (window.scrollY > 200) {
          btn.classList.remove('opacity-0', '-translate-y-4', 'pointer-events-none');
          btn.classList.add('opacity-100', 'translate-y-0');
        } else {
          btn.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none');
          btn.classList.remove('opacity-100', 'translate-y-0');
        }
      };

      // initial state
      toggleVisibility();

      window.addEventListener('scroll', toggleVisibility, { passive: true });
      btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
  </script> */}
    </footer>
  )
}
