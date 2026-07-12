export type Movie = {
  id: string;
  title: string;
  tagline: string;
  synopsis: string;
  releaseDate: string;
  rating: string;
  duration: string;
  genres: string[];
  director: string;
  producer: string;
  cast: string[];
  format: string;
  showtimes: string[];
  screenings: string[][];
  trailerUrl: string;
  heroImage: string;
  posterImage: string;
  accentColor: string;
};

export type ComingSoonMovie = Omit<Movie, "showtimes" | "screenings"> & {
  screenings: [];
};

export type MovieDetails = Movie | ComingSoonMovie;

export type ScreeningDay = {
  date: string;
  label: string;
  times: string[];
};

export const featuredMovies: Movie[] = [
  {
    id: "midnight-orbit",
    title: "Midnight Orbit",
    tagline: "A final transmission changes the course of deep space.",
    synopsis:
      "When a remote station falls silent, a rescue crew follows the signal into a storm of impossible gravity and buried secrets.",
    releaseDate: "July 4, 2026",
    rating: "PG-13",
    duration: "2h 08m",
    genres: ["Sci-Fi", "Thriller"],
    director: "Mara Ellison",
    producer: "Jonas Vale",
    cast: ["Rina Cole", "Mateo Voss", "Elena Park", "Darius Kent"],
    format: "IMAX",
    showtimes: ["12:20", "3:40", "7:10", "10:25"],
    screenings: [
      ["12:20", "3:40", "7:10", "10:25"],
      ["11:45", "2:55", "6:30", "9:50"],
      ["1:15", "4:35", "8:05"],
      ["12:10", "3:30", "7:00", "10:20"],
      ["11:20", "2:40", "6:10", "9:35"],
    ],
    trailerUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
    heroImage:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1800&q=85",
    posterImage:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=700&q=80",
    accentColor: "#22d3ee",
  },
  {
    id: "the-last-marquee",
    title: "The Last Marquee",
    tagline: "One theater. One night. Every secret in town.",
    synopsis:
      "On closing night at a historic cinema, a young projectionist uncovers a mystery hidden between reels of forgotten film.",
    releaseDate: "June 28, 2026",
    rating: "PG",
    duration: "1h 54m",
    genres: ["Drama", "Mystery"],
    director: "Nadia Reyes",
    producer: "Caleb Stone",
    cast: ["Amara Quinn", "Theo Jameson", "Lucia Bell", "Henry Cho"],
    format: "Dolby Atmos",
    showtimes: ["11:30", "2:15", "5:45", "8:30"],
    screenings: [
      ["11:30", "2:15", "5:45", "8:30"],
      ["12:00", "3:05", "6:20", "9:15"],
      ["10:50", "1:45", "5:10", "8:00"],
      ["11:20", "2:30", "6:00", "8:45"],
      ["12:35", "3:25", "7:05"],
    ],
    trailerUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
    heroImage:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=85",
    posterImage:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80",
    accentColor: "#f97316",
  },
  {
    id: "neon-run",
    title: "Neon Run",
    tagline: "The fastest way out is through the city.",
    synopsis:
      "A courier with one last delivery races across a rain-soaked metropolis while rival crews close in from every side.",
    releaseDate: "July 10, 2026",
    rating: "R",
    duration: "1h 47m",
    genres: ["Action", "Crime"],
    director: "Kellan Ward",
    producer: "Priya Sato",
    cast: ["Jules Vega", "Marcus Reed", "Nora Lin", "Ari Sol"],
    format: "4DX",
    showtimes: ["1:00", "4:20", "7:45", "11:05"],
    screenings: [
      ["1:00", "4:20", "7:45", "11:05"],
      ["12:35", "3:55", "7:20", "10:40"],
      ["1:30", "4:50", "8:15", "11:20"],
      ["2:05", "5:25", "8:50"],
      ["12:50", "4:10", "7:35", "10:55"],
    ],
    trailerUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
    heroImage:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1800&q=85",
    posterImage:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=80",
    accentColor: "#ec4899",
  },
];

export const availableMovies: Movie[] = [
  ...featuredMovies,
  {
    id: "summer-at-seat-seven",
    title: "Summer at Seat Seven",
    tagline: "Some memories deserve the big screen.",
    synopsis:
      "Two childhood friends reconnect during a summer film festival and find the courage to rewrite their next chapter.",
    releaseDate: "June 21, 2026",
    rating: "PG",
    duration: "1h 42m",
    genres: ["Romance", "Comedy"],
    director: "Sofia Lane",
    producer: "Miles Harper",
    cast: ["Clara West", "Ben Mori", "Imani Fox", "Leo Grant"],
    format: "Standard",
    showtimes: ["10:40", "1:25", "6:20", "9:10"],
    screenings: [
      ["10:40", "1:25", "6:20", "9:10"],
      ["11:10", "2:05", "5:50", "8:40"],
      ["10:30", "1:20", "6:05"],
      ["12:15", "3:00", "7:30", "9:55"],
      ["11:45", "2:35", "6:45"],
    ],
    trailerUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
    heroImage:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1800&q=85",
    posterImage:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=700&q=80",
    accentColor: "#f59e0b",
  },
  {
    id: "after-the-applause",
    title: "After the Applause",
    tagline: "The encore begins when the curtain falls.",
    synopsis:
      "A celebrated stage actor returns home to repair old friendships before the role of a lifetime pulls her away again.",
    releaseDate: "July 1, 2026",
    rating: "PG-13",
    duration: "2h 01m",
    genres: ["Drama"],
    director: "Graham Holt",
    producer: "Selene Park",
    cast: ["Vivian Cross", "Malik Hayes", "Rose Kim", "Peter Alden"],
    format: "Laser",
    showtimes: ["12:05", "3:15", "6:35", "9:50"],
    screenings: [
      ["12:05", "3:15", "6:35", "9:50"],
      ["11:50", "2:55", "6:15", "9:30"],
      ["12:25", "3:35", "7:00"],
      ["1:10", "4:20", "8:05"],
      ["11:35", "2:45", "6:05", "9:20"],
    ],
    trailerUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
    heroImage:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1800&q=85",
    posterImage:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=700&q=80",
    accentColor: "#a3e635",
  },
  {
    id: "signal-9",
    title: "Signal 9",
    tagline: "Every warning arrives one second too late.",
    synopsis:
      "A city dispatcher discovers a pattern in emergency calls that points to a threat already moving through downtown.",
    releaseDate: "July 8, 2026",
    rating: "R",
    duration: "1h 58m",
    genres: ["Suspense", "Crime"],
    director: "Iris Caldwell",
    producer: "Dante Brooks",
    cast: ["Mina Scott", "Owen Pierce", "Kei Tanaka", "Sasha Monroe"],
    format: "Dolby Atmos",
    showtimes: ["2:40", "5:30", "8:15", "10:55"],
    screenings: [
      ["2:40", "5:30", "8:15", "10:55"],
      ["1:50", "4:45", "7:40", "10:30"],
      ["2:20", "5:15", "8:10"],
      ["12:55", "3:50", "6:45", "9:40"],
      ["1:35", "4:30", "7:25", "10:15"],
    ],
    trailerUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
    heroImage:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1800&q=85",
    posterImage:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=700&q=80",
    accentColor: "#38bdf8",
  },
];

export const comingSoonMovies: ComingSoonMovie[] = [
  {
    id: "velvet-skyline",
    title: "Velvet Skyline",
    tagline: "Ambition looks different from the top floor.",
    synopsis:
      "A rising architect is pulled into a rivalry that could reshape the city and the people who built it.",
    releaseDate: "July 26, 2026",
    rating: "PG-13",
    duration: "2h 06m",
    genres: ["Drama", "Suspense"],
    director: "Evan Mercer",
    producer: "Talia Brooks",
    cast: ["Mae Porter", "Julian Cross", "Noah Reyes", "Faye Collins"],
    format: "Laser",
    screenings: [],
    trailerUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
    heroImage:
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?auto=format&fit=crop&w=1800&q=85",
    posterImage:
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?auto=format&fit=crop&w=700&q=80",
    accentColor: "#60a5fa",
  },
  {
    id: "orbit-kids",
    title: "Orbit Kids",
    tagline: "Small astronauts. Big neighborhood mission.",
    synopsis:
      "A group of friends turns a backyard rocket build into a summer adventure that brings their whole block together.",
    releaseDate: "August 2, 2026",
    rating: "PG",
    duration: "1h 36m",
    genres: ["Family", "Adventure"],
    director: "Lena Ortiz",
    producer: "Harper Singh",
    cast: ["Milo Bennett", "Tess Young", "Ava Brooks", "Noel Price"],
    format: "Standard",
    screenings: [],
    trailerUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
    heroImage:
      "https://images.unsplash.com/photo-1462332420958-a05d1e002413?auto=format&fit=crop&w=1800&q=85",
    posterImage:
      "https://images.unsplash.com/photo-1462332420958-a05d1e002413?auto=format&fit=crop&w=700&q=80",
    accentColor: "#facc15",
  },
  {
    id: "harbor-blackout",
    title: "Harbor Blackout",
    tagline: "When the lights go out, every debt comes due.",
    synopsis:
      "During a citywide power failure, a detective follows one last lead through the waterfront underworld.",
    releaseDate: "August 9, 2026",
    rating: "R",
    duration: "1h 51m",
    genres: ["Crime", "Thriller"],
    director: "Marcus Wynn",
    producer: "Elaine Frost",
    cast: ["Victor Kane", "Alina Shaw", "Tomas Reed", "June Hart"],
    format: "Dolby Atmos",
    screenings: [],
    trailerUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
    heroImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85",
    posterImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80",
    accentColor: "#fb7185",
  },
];

export const allMovies: MovieDetails[] = [
  ...availableMovies,
  ...comingSoonMovies,
];

export function getMovieById(movieId: string): MovieDetails | undefined {
  return allMovies.find((movie) => movie.id === movieId);
}

export function hasBookableScreenings(movie: MovieDetails): movie is Movie {
  return "showtimes" in movie && movie.screenings.length > 0;
}

export function getNextFiveScreeningDays(
  movie: MovieDetails,
  startDate = new Date(),
): ScreeningDay[] {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });
  const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  });

  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    const times = hasBookableScreenings(movie)
      ? (movie.screenings[index] ?? [])
      : [];

    return {
      date: formatter.format(date),
      label: index === 0 ? "Today" : weekdayFormatter.format(date),
      times,
    };
  });
}
