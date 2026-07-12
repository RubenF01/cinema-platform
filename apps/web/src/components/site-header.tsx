export function SiteHeader() {
  return (
    <header className="absolute left-0 right-0 top-0 z-30 border-b border-white/10 bg-zinc-950/45 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#"
          className="flex items-center gap-3"
          aria-label="Cimena home"
        >
          <span className="grid size-9 place-items-center rounded-md bg-amber-400 text-sm font-black text-zinc-950">
            C
          </span>
          <span className="text-base font-semibold tracking-wide text-white">
            Cimena
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-medium text-zinc-300 md:flex">
          <a className="transition hover:text-white" href="#movies">
            Movies
          </a>
          <a className="transition hover:text-white" href="#showtimes">
            Showtimes
          </a>
          <a className="transition hover:text-white" href="#offers">
            Offers
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <button className="hidden min-h-10 rounded-md px-4 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white sm:inline-flex sm:items-center">
            Sign in
          </button>
        </div>
      </div>
    </header>
  );
}
