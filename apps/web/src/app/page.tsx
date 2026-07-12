import { ComingSoonSection } from "@/components/coming-soon-section";
import { HeroCarousel } from "@/components/hero-carousel";
import { MovieGrid } from "@/components/movie-grid";
import { SiteHeader } from "@/components/site-header";
import {
  availableMovies,
  comingSoonMovies,
  featuredMovies,
} from "@/data/movies";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <SiteHeader />
      <HeroCarousel movies={featuredMovies} />
      <MovieGrid movies={availableMovies} />
      <ComingSoonSection movies={comingSoonMovies} />
    </main>
  );
}
