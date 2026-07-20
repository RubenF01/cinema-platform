import Link from "next/link";
import type { ComingSoonMovie } from "@/data/movies";

type ComingSoonSectionProps = {
  movies: ComingSoonMovie[];
};

export function ComingSoonSection({ movies }: ComingSoonSectionProps) {
  return (
    <section
      className="bg-zinc-950 px-4 pb-20 text-white sm:px-6 lg:px-8"
      id="coming-soon"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
              Coming soon
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Next on the big screen
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-zinc-400">
            Preview upcoming releases and plan your next visit before showtimes
            open.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {movies.map((movie) => (
            <article
              className="grid overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 text-white shadow-xl shadow-black/20 sm:grid-cols-[180px_1fr] lg:block"
              key={movie.id}
            >
              <Link
                aria-label={`View details for ${movie.title}`}
                className="group relative block min-h-64 overflow-hidden bg-zinc-950 sm:min-h-full lg:aspect-[16/10]"
                href={`/movies/${movie.id}`}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.04]"
                  style={{
                    backgroundImage: `url(${movie.posterImage})`,
                  }}
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent"
                />
                <span className="absolute inset-x-0 bottom-0 p-4">
                  <span className="block text-base font-black leading-tight text-white sm:text-lg lg:text-xl">
                    {movie.title}
                  </span>
                  <span className="mt-2 block text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
                    Opens {movie.releaseDate}
                  </span>
                </span>
              </Link>
              <div className="flex flex-col justify-between gap-5 p-5">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    <span>{movie.rating}</span>
                    <span>{movie.duration}</span>
                    <span>{movie.genres.join(" / ")}</span>
                  </div>
                  <Link
                    className="text-xl font-bold leading-tight text-white transition hover:text-amber-300"
                    href={`/movies/${movie.id}`}
                  >
                    {movie.title}
                  </Link>
                  <p className="mt-2 text-sm font-medium text-amber-300">
                    Opens {movie.releaseDate}
                  </p>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">
                    {movie.synopsis}
                  </p>
                </div>
                <Link
                  className="inline-flex min-h-10 items-center justify-center rounded-md border border-zinc-700 px-4 text-sm font-semibold text-zinc-100 transition hover:border-amber-300 hover:bg-amber-300 hover:text-zinc-950"
                  href={`/movies/${movie.id}`}
                >
                  View details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
