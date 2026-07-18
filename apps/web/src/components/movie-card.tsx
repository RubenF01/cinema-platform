import Link from "next/link";
import type { Movie } from "@/data/movies";

type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 text-white shadow-xl shadow-black/20">
      <Link
        aria-label={`View details for ${movie.title}`}
        className="block aspect-[3/4] bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
        href={`/movies/${movie.id}`}
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(9,9,11,0.45), rgba(9,9,11,0.05)), url(${movie.posterImage})`,
        }}
      />
      <div className="space-y-4 p-4">
        <div>
          <div className="mb-2 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            <span>{movie.rating}</span>
            <span>{movie.duration}</span>
          </div>
          <Link
            className="text-lg font-bold leading-tight text-white transition hover:text-amber-300"
            href={`/movies/${movie.id}`}
          >
            {movie.title}
          </Link>
          <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-zinc-400">
            {movie.synopsis}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {movie.showtimes.slice(0, 3).map((showtime) => (
            <Link
              className="inline-flex min-h-9 items-center rounded-md border border-zinc-700 px-3 text-sm font-semibold text-zinc-100 transition hover:border-amber-300 hover:bg-amber-300 hover:text-zinc-950"
              href={`/purchase/${movie.id}?day=0&time=${encodeURIComponent(showtime)}`}
              key={showtime}
            >
              {showtime}
            </Link>
          ))}
        </div>
        <Link
          className="inline-flex min-h-10 w-full items-center justify-center rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          href={`/movies/${movie.id}#screenings`}
        >
          Book tickets
        </Link>
      </div>
    </article>
  );
}
