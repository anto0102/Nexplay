import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/hero-section';
import { MovieRow } from '@/components/movie-row';
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getTrendingTVShows,
  getPopularTVShows,
  getTopRatedTVShows,
} from '@/lib/tmdb';

export default async function Home() {
  try {
    // Fetch all data in parallel server-side
    const [
      trendingMovies,
      popularMovies,
      topRatedMovies,
      trendingTVShows,
      popularTVShows,
      topRatedTVShows,
    ] = await Promise.all([
      getTrendingMovies(),
      getPopularMovies(),
      getTopRatedMovies(),
      getTrendingTVShows(),
      getPopularTVShows(),
      getTopRatedTVShows(),
    ]);

    // Get random hero movie from trending
    const heroMovie = trendingMovies.results[Math.floor(Math.random() * Math.min(trendingMovies.results.length, 10))];

    return (
      <main className="bg-black">
        <Navbar />

        {/* Hero Section */}
        <HeroSection movie={heroMovie} />

        {/* Content Rows */}
        <div className="bg-black min-h-screen pb-20 pt-10">
          <MovieRow
            title="Tendenze del momento"
            items={trendingMovies.results.slice(1, 20)}
            type="movie"
          />

          <MovieRow
            title="Serie TV di tendenza"
            items={trendingTVShows.results}
            type="tv"
          />

          <MovieRow
            title="Film popolari"
            items={popularMovies.results}
            type="movie"
          />

          <MovieRow
            title="Serie TV popolari"
            items={popularTVShows.results}
            type="tv"
          />

          <MovieRow
            title="Film più votati"
            items={topRatedMovies.results}
            type="movie"
          />

          <MovieRow
            title="Serie TV più votate"
            items={topRatedTVShows.results}
            type="tv"
          />
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error loading homepage:', error);
    return (
      <main className="bg-black min-h-screen flex items-center justify-center">
        <Navbar />
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Errore nel caricamento</h1>
          <p className="text-white/70">Si è verificato un errore. Riprova più tardi.</p>
        </div>
      </main>
    );
  }
}
