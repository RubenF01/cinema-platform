export type Movie = {
  id: string;
  title: string;
  tagline: string;
  synopsis: string;
  rating: string;
  duration: string;
  genres: string[];
  format: string;
  showtimes: string[];
  heroImage: string;
  posterImage: string;
  accentColor: string;
};

export const featuredMovies: Movie[] = [
  {
    id: "midnight-orbit",
    title: "Midnight Orbit",
    tagline: "A final transmission changes the course of deep space.",
    synopsis:
      "When a remote station falls silent, a rescue crew follows the signal into a storm of impossible gravity and buried secrets.",
    rating: "PG-13",
    duration: "2h 08m",
    genres: ["Sci-Fi", "Thriller"],
    format: "IMAX",
    showtimes: ["12:20", "3:40", "7:10", "10:25"],
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
    rating: "PG",
    duration: "1h 54m",
    genres: ["Drama", "Mystery"],
    format: "Dolby Atmos",
    showtimes: ["11:30", "2:15", "5:45", "8:30"],
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
    rating: "R",
    duration: "1h 47m",
    genres: ["Action", "Crime"],
    format: "4DX",
    showtimes: ["1:00", "4:20", "7:45", "11:05"],
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
    rating: "PG",
    duration: "1h 42m",
    genres: ["Romance", "Comedy"],
    format: "Standard",
    showtimes: ["10:40", "1:25", "6:20", "9:10"],
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
    rating: "PG-13",
    duration: "2h 01m",
    genres: ["Drama"],
    format: "Laser",
    showtimes: ["12:05", "3:15", "6:35", "9:50"],
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
    rating: "R",
    duration: "1h 58m",
    genres: ["Suspense", "Crime"],
    format: "Dolby Atmos",
    showtimes: ["2:40", "5:30", "8:15", "10:55"],
    heroImage:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1800&q=85",
    posterImage:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=700&q=80",
    accentColor: "#38bdf8",
  },
];
