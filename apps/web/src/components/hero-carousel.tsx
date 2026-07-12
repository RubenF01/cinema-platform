"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@cimena/ui";
import type { Movie } from "@/data/movies";

type HeroCarouselProps = {
  movies: Movie[];
};

export function HeroCarousel({ movies }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const movieCount = Math.max(movies.length, 1);
  const activeMovie = movies[activeIndex] ?? movies[0];

  const nextIndex = useMemo(
    () => (activeIndex + 1) % movieCount,
    [activeIndex, movieCount],
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % movieCount);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [movieCount]);

  if (!activeMovie) {
    return null;
  }

  function showPrevious() {
    setActiveIndex((current) => (current === 0 ? movieCount - 1 : current - 1));
  }

  function showNext() {
    setActiveIndex(nextIndex);
  }

  return (
    <section className="relative min-h-[720px] overflow-hidden bg-zinc-950 pt-16 text-white">
      {movies.map((movie, index) => (
        <div
          aria-hidden={activeIndex !== index}
          className="absolute inset-0 transition-opacity duration-700"
          key={movie.id}
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(9,9,11,0.96) 0%, rgba(9,9,11,0.78) 36%, rgba(9,9,11,0.18) 72%), linear-gradient(0deg, rgba(9,9,11,1) 0%, rgba(9,9,11,0.08) 42%), url(${movie.heroImage})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            opacity: activeIndex === index ? 1 : 0,
          }}
        />
      ))}

      <div className="relative z-10 mx-auto grid min-h-[656px] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div className="max-w-3xl pt-10 lg:pt-0">
          <div className="mb-5 flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
            <span>Now showing</span>
            <span className="h-1 w-1 rounded-full bg-amber-300" />
            <span>{activeMovie.format}</span>
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] text-white sm:text-6xl lg:text-7xl">
            {activeMovie.title}
          </h1>
          <p className="mt-5 max-w-2xl text-xl font-medium text-zinc-100">
            {activeMovie.tagline}
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
            {activeMovie.synopsis}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-medium text-zinc-200">
            <span className="rounded-md border border-white/20 px-3 py-1">
              {activeMovie.rating}
            </span>
            <span>{activeMovie.duration}</span>
            <span>{activeMovie.genres.join(" / ")}</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button className="bg-amber-400 text-zinc-950 hover:bg-amber-300">
              Book tickets
            </Button>
            <Button
              className="border-white/25 bg-white/10 text-white hover:bg-white/20"
              variant="secondary"
            >
              View details
            </Button>
          </div>
        </div>

        <aside className="hidden rounded-lg border border-white/10 bg-zinc-950/70 p-4 shadow-2xl shadow-black/40 backdrop-blur-md lg:block">
          <div
            className="aspect-[3/4] rounded-md bg-cover bg-center"
            style={{ backgroundImage: `url(${activeMovie.posterImage})` }}
          />
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Next showtimes
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {activeMovie.showtimes.map((showtime) => (
                <button
                  className="min-h-10 rounded-md border border-white/10 bg-white/5 text-sm font-semibold text-white transition hover:border-amber-300 hover:bg-amber-300 hover:text-zinc-950"
                  key={showtime}
                >
                  {showtime}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="absolute bottom-7 left-4 right-4 z-20 mx-auto flex max-w-7xl items-center justify-between gap-4 px-0 sm:left-6 sm:right-6 lg:left-8 lg:right-8">
          <div className="flex gap-2">
            {movies.map((movie, index) => (
              <button
                aria-label={`Show ${movie.title}`}
                className="h-2.5 rounded-full transition-all"
                key={movie.id}
                onClick={() => setActiveIndex(index)}
                style={{
                  backgroundColor:
                    activeIndex === index
                      ? movie.accentColor
                      : "rgba(255,255,255,0.32)",
                  width: activeIndex === index ? "2.5rem" : "0.75rem",
                }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              aria-label="Previous featured movie"
              className="grid size-11 place-items-center rounded-md border border-white/15 bg-white/10 text-xl font-semibold text-white transition hover:bg-white/20"
              onClick={showPrevious}
            >
              ‹
            </button>
            <button
              aria-label="Next featured movie"
              className="grid size-11 place-items-center rounded-md border border-white/15 bg-white/10 text-xl font-semibold text-white transition hover:bg-white/20"
              onClick={showNext}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
