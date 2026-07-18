import Link from "next/link";
import type { ScreeningDay } from "@/data/movies";

type ScreeningScheduleProps = {
  days: ScreeningDay[];
  movieId: string;
};

export function ScreeningSchedule({ days, movieId }: ScreeningScheduleProps) {
  const hasScreenings = days.some((day) => day.times.length > 0);

  return (
    <section className="border-t border-zinc-800 pt-10" id="screenings">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
            Screenings
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
            Next 5 days
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-zinc-400">
          Select a time to continue toward seat selection once booking is
          connected.
        </p>
      </div>

      {hasScreenings ? (
        <div className="mt-6 grid gap-3">
          {days.map((day, dayIndex) => (
            <article
              className="grid gap-4 rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 sm:grid-cols-[160px_1fr] sm:items-center"
              key={`${day.label}-${day.date}`}
            >
              <div>
                <h3 className="font-bold text-white">{day.label}</h3>
                <p className="mt-1 text-sm text-zinc-400">{day.date}</p>
              </div>
              {day.times.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {day.times.map((time) => (
                    <Link
                      className="inline-flex min-h-10 items-center rounded-md border border-zinc-700 px-4 text-sm font-semibold text-zinc-100 transition hover:border-amber-300 hover:bg-amber-300 hover:text-zinc-950"
                      href={`/purchase/${movieId}?day=${dayIndex}&time=${encodeURIComponent(time)}`}
                      key={time}
                    >
                      {time}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">No screenings this day</p>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-zinc-700 bg-zinc-900/60 p-8 text-center">
          <h3 className="text-xl font-bold text-white">
            No available screenings
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-400">
            Showtimes have not opened for this movie yet. Check back closer to
            release day.
          </p>
        </div>
      )}
    </section>
  );
}
