import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/hero-section';
import { MovieRow } from '@/components/movie-row';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Shuffle function for randomizing content order
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
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

    // Shuffle all content arrays for fresh order on each refresh
    const shuffledTrendingMovies = shuffleArray(trendingMovies.results);
    const shuffledPopularMovies = shuffleArray(popularMovies.results);
    const shuffledTopRatedMovies = shuffleArray(topRatedMovies.results);
    const shuffledTrendingTVShows = shuffleArray(trendingTVShows.results);
    const shuffledPopularTVShows = shuffleArray(popularTVShows.results);
    const shuffledTopRatedTVShows = shuffleArray(topRatedTVShows.results);

    // Get hero movies and initial index based on current time
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const intervalIndex = Math.floor(currentTime / 10); // Changes every 10 seconds
    const heroMovies = shuffledTrendingMovies.slice(0, 10); // Get first 10 movies from shuffled array
    const heroIndex = intervalIndex % heroMovies.length;

    return (
      <main className="bg-black">
        <Navbar />

        {/* Hero Section */}
        <HeroSection
          heroMovies={heroMovies}
          initialIndex={heroIndex}
        />

        {/* Content Rows */}
        <div className="bg-black min-h-screen pb-20 pt-10">
          <MovieRow
            title="Tendenze del momento"
            items={shuffledTrendingMovies.slice(10, 30)} // Skip first 10 used for hero
            type="movie"
          />

          <MovieRow
            title="Serie TV di tendenza"
            items={shuffledTrendingTVShows}
            type="tv"
          />

          <MovieRow
            title="Film popolari"
            items={shuffledPopularMovies}
            type="movie"
          />

          <MovieRow
            title="Serie TV popolari"
            items={shuffledPopularTVShows}
            type="tv"
          />

          <MovieRow
            title="Film più votati"
            items={shuffledTopRatedMovies}
            type="movie"
          />

          <MovieRow
            title="Serie TV più votate"
            items={shuffledTopRatedTVShows}
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
