import { Button } from "@cimena/ui";
import type { Movie } from "@/data/movies";

type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 text-white shadow-xl shadow-black/20">
      <div
        className="aspect-[3/4] bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
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
          <h3 className="text-lg font-bold leading-tight text-white">
            {movie.title}
          </h3>
          <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-zinc-400">
            {movie.synopsis}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {movie.showtimes.slice(0, 3).map((showtime) => (
            <button
              className="min-h-9 rounded-md border border-zinc-700 px-3 text-sm font-semibold text-zinc-100 transition hover:border-amber-300 hover:bg-amber-300 hover:text-zinc-950"
              key={showtime}
            >
              {showtime}
            </button>
          ))}
        </div>
        <Button className="w-full bg-zinc-100 text-zinc-950 hover:bg-amber-300">
          Book tickets
        </Button>
      </div>
    </article>
  );
}
