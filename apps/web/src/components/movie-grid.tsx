import type { Movie } from "@/data/movies";
import { MovieCard } from "./movie-card";

type MovieGridProps = {
  movies: Movie[];
};

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <section
      className="bg-zinc-950 px-4 py-16 text-white sm:px-6 lg:px-8"
      id="movies"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
              Available today
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Movies to watch
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-zinc-400">
            Pick a showtime from today&apos;s lineup and reserve your seats in a
            few steps.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
}
