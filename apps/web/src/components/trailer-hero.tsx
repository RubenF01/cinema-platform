"use client";

import { useEffect, useState } from "react";
import type { MovieDetails } from "@/data/movies";

type TrailerHeroProps = {
  movie: MovieDetails;
};

export function TrailerHero({ movie }: TrailerHeroProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        aria-label={`Play trailer for ${movie.title}`}
        className="group relative min-h-[560px] w-full overflow-hidden bg-zinc-950 pt-16 text-left text-white"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <span
          className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.03]"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(9,9,11,0.96) 0%, rgba(9,9,11,0.74) 44%, rgba(9,9,11,0.22) 100%), linear-gradient(0deg, rgba(9,9,11,1) 0%, rgba(9,9,11,0.16) 48%), url(${movie.heroImage})`,
          }}
        />
        <span className="relative z-10 mx-auto flex min-h-[496px] max-w-7xl flex-col justify-end px-4 pb-14 sm:px-6 lg:px-8">
          <span className="mb-6 grid size-20 place-items-center rounded-full border border-white/25 bg-white/12 text-3xl text-white shadow-2xl shadow-black/40 backdrop-blur-md transition group-hover:scale-105 group-hover:bg-amber-400 group-hover:text-zinc-950">
            ▶
          </span>
          <span className="mb-4 flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
            <span>Watch trailer</span>
            <span className="h-1 w-1 rounded-full bg-amber-300" />
            <span>{movie.format}</span>
          </span>
          <span className="block max-w-4xl text-5xl font-black leading-[0.95] sm:text-6xl lg:text-7xl">
            {movie.title}
          </span>
          <span className="mt-5 block max-w-2xl text-xl font-medium text-zinc-100">
            {movie.tagline}
          </span>
        </span>
      </button>

      {isOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          role="dialog"
        >
          <div
            className="w-full max-w-5xl overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-2xl shadow-black"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-300">
                {movie.title} trailer
              </h2>
              <button
                aria-label="Close trailer"
                className="grid size-9 place-items-center rounded-md text-2xl text-zinc-300 transition hover:bg-white/10 hover:text-white"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
                src={`${movie.trailerUrl}?autoplay=1&rel=0`}
                title={`${movie.title} trailer`}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
