import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ScreeningSchedule } from "@/components/screening-schedule";
import { SiteHeader } from "@/components/site-header";
import { TrailerHero } from "@/components/trailer-hero";
import {
  allMovies,
  getMovieById,
  getNextFiveScreeningDays,
} from "@/data/movies";

type MoviePageProps = {
  params: Promise<{
    movieId: string;
  }>;
};

export function generateStaticParams() {
  return allMovies.map((movie) => ({
    movieId: movie.id,
  }));
}

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const { movieId } = await params;
  const movie = getMovieById(movieId);

  if (!movie) {
    return {
      title: "Movie not found | Cimena",
    };
  }

  return {
    title: `${movie.title} | Cimena`,
    description: movie.synopsis,
  };
}

export default async function MovieDetailPage({ params }: MoviePageProps) {
  const { movieId } = await params;
  const movie = getMovieById(movieId);

  if (!movie) {
    notFound();
  }

  const screeningDays = getNextFiveScreeningDays(movie);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <SiteHeader />
      <TrailerHero movie={movie} />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Link
          className="text-sm font-semibold text-zinc-400 transition hover:text-white"
          href="/"
        >
          Back to movies
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-10">
            <section>
              <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <MovieFact label="Release date" value={movie.releaseDate} />
                <MovieFact label="Genre" value={movie.genres.join(" / ")} />
                <MovieFact label="Duration" value={movie.duration} />
                <MovieFact label="Age rating" value={movie.rating} />
              </dl>

              <div className="mt-10">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
                  Synopsis
                </p>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-300">
                  {movie.synopsis}
                </p>
              </div>
            </section>

            <section className="border-t border-zinc-800 pt-10">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
                Movie information
              </p>
              <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                <CreditBlock label="Director" value={movie.director} />
                <CreditBlock label="Producer" value={movie.producer} />
                <CreditBlock
                  className="sm:col-span-2"
                  label="Cast"
                  value={movie.cast.join(", ")}
                />
              </dl>
            </section>

            <ScreeningSchedule days={screeningDays} movieId={movie.id} />
          </div>

          <aside className="h-fit rounded-lg border border-zinc-800 bg-zinc-900 p-4 shadow-xl shadow-black/20">
            <div
              className="aspect-[3/4] rounded-md bg-cover bg-center"
              style={{ backgroundImage: `url(${movie.posterImage})` }}
            />
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Presentation
              </p>
              <p className="mt-2 text-2xl font-black text-white">
                {movie.format}
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {movie.tagline}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function MovieFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </dt>
      <dd className="mt-2 text-sm font-semibold text-white">{value}</dd>
    </div>
  );
}

function CreditBlock({
  className,
  label,
  value,
}: {
  className?: string;
  label: string;
  value: string;
}) {
  return (
    <div className={className}>
      <dt className="text-sm font-semibold text-zinc-500">{label}</dt>
      <dd className="mt-2 text-base font-semibold text-white">{value}</dd>
    </div>
  );
}
