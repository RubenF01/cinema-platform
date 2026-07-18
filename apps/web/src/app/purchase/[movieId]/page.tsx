import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PurchaseFlow } from "@/components/purchase/purchase-flow";
import {
  allMovies,
  getMovieById,
  getNextFiveScreeningDays,
  hasBookableScreenings,
} from "@/data/movies";

type PurchasePageProps = {
  params: Promise<{
    movieId: string;
  }>;
  searchParams: Promise<{
    day?: string;
    time?: string;
  }>;
};

export function generateStaticParams() {
  return allMovies
    .filter(hasBookableScreenings)
    .map((movie) => ({ movieId: movie.id }));
}

export async function generateMetadata({
  params,
}: PurchasePageProps): Promise<Metadata> {
  const { movieId } = await params;
  const movie = getMovieById(movieId);

  if (!movie) {
    return {
      title: "Purchase unavailable | Cimena",
    };
  }

  return {
    title: `Buy tickets for ${movie.title} | Cimena`,
    description: `Select seats and checkout for ${movie.title}.`,
  };
}

export default async function PurchasePage({
  params,
  searchParams,
}: PurchasePageProps) {
  const { movieId } = await params;
  const { day, time } = await searchParams;
  const movie = getMovieById(movieId);

  if (!movie || !hasBookableScreenings(movie)) {
    notFound();
  }

  const screeningDays = getNextFiveScreeningDays(movie);
  const selectedDayIndex = parseDayIndex(day);
  const selectedDay = screeningDays[selectedDayIndex];
  const selectedTime = time ?? selectedDay?.times[0];

  if (
    !selectedDay ||
    !selectedTime ||
    !selectedDay.times.includes(selectedTime)
  ) {
    notFound();
  }

  return (
    <PurchaseFlow
      initialDayIndex={selectedDayIndex}
      initialTime={selectedTime}
      movie={movie}
      screeningDays={screeningDays}
    />
  );
}

function parseDayIndex(day: string | undefined) {
  if (!day) {
    return 0;
  }

  const parsedDay = Number(day);

  return Number.isInteger(parsedDay) ? parsedDay : -1;
}
