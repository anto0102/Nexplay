import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/hero-section';
import { MovieRow } from '@/components/movie-row';

// Force dynamic rendering to ensure fresh content on every refresh
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

// Function to mix movies and TV shows and return mixed array with proper type info
function mixAndShuffleContent(movies: any[], tvShows: any[], maxItems: number = 20) {
  const moviesWithType = movies.map(item => ({ ...item, media_type: 'movie' }));
  const tvWithType = tvShows.map(item => ({ ...item, media_type: 'tv' }));
  const combined = [...moviesWithType, ...tvWithType];
  return shuffleArray(combined).slice(0, maxItems);
}
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getTrendingTVShows,
  getPopularTVShows,
  getTopRatedTVShows,
  discoverMovies,
  discoverTVShows,
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
      // Genre-specific content
      romanceMovies,
      horrorMovies,
      warMovies,
      comedyMovies,
      actionMovies,
      dramaMovies,
      crimeMovies,
      scifiMovies,
      thrillerMovies,
      animationMovies,
      // TV Genres
      romanceTV,
      crimeTV,
      dramaTV,
      comedyTV,
      scifiTV,
    ] = await Promise.all([
      getTrendingMovies(),
      getPopularMovies(),
      getTopRatedMovies(),
      getTrendingTVShows(),
      getPopularTVShows(),
      getTopRatedTVShows(),
      // Movies by genre
      discoverMovies({ genre: 10749, sortBy: 'popularity.desc' }), // Romance
      discoverMovies({ genre: 27, sortBy: 'popularity.desc' }), // Horror
      discoverMovies({ genre: 10752, sortBy: 'popularity.desc' }), // War
      discoverMovies({ genre: 35, sortBy: 'popularity.desc' }), // Comedy
      discoverMovies({ genre: 28, sortBy: 'popularity.desc' }), // Action
      discoverMovies({ genre: 18, sortBy: 'popularity.desc' }), // Drama
      discoverMovies({ genre: 80, sortBy: 'popularity.desc' }), // Crime
      discoverMovies({ genre: 878, sortBy: 'popularity.desc' }), // Sci-Fi
      discoverMovies({ genre: 53, sortBy: 'popularity.desc' }), // Thriller
      discoverMovies({ genre: 16, sortBy: 'popularity.desc' }), // Animation
      // TV Shows by genre
      discoverTVShows({ genre: 10749, sortBy: 'popularity.desc' }), // Romance
      discoverTVShows({ genre: 80, sortBy: 'popularity.desc' }), // Crime
      discoverTVShows({ genre: 18, sortBy: 'popularity.desc' }), // Drama
      discoverTVShows({ genre: 35, sortBy: 'popularity.desc' }), // Comedy
      discoverTVShows({ genre: 10765, sortBy: 'popularity.desc' }), // Sci-Fi & Fantasy
    ]);

    // Shuffle all content arrays for fresh order on each refresh
    const shuffledTrendingMovies = shuffleArray(trendingMovies.results);
    const shuffledPopularMovies = shuffleArray(popularMovies.results);
    const shuffledTopRatedMovies = shuffleArray(topRatedMovies.results);
    const shuffledTrendingTVShows = shuffleArray(trendingTVShows.results);
    const shuffledPopularTVShows = shuffleArray(popularTVShows.results);
    const shuffledTopRatedTVShows = shuffleArray(topRatedTVShows.results);

    // Mix movies and TV shows by genre
    const mixedRomance = mixAndShuffleContent(romanceMovies.results, romanceTV.results);
    const mixedComedy = mixAndShuffleContent(comedyMovies.results, comedyTV.results);
    const mixedDrama = mixAndShuffleContent(dramaMovies.results, dramaTV.results);
    const mixedCrime = mixAndShuffleContent(crimeMovies.results, crimeTV.results);
    const mixedScifi = mixAndShuffleContent(scifiMovies.results, scifiTV.results);

    // Keep movies-only genres shuffled
    const shuffledHorrorMovies = shuffleArray(horrorMovies.results);
    const shuffledWarMovies = shuffleArray(warMovies.results);
    const shuffledActionMovies = shuffleArray(actionMovies.results);
    const shuffledThrillerMovies = shuffleArray(thrillerMovies.results);
    const shuffledAnimationMovies = shuffleArray(animationMovies.results);

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

          {/* Sezioni Tematiche */}
          <MovieRow
            title="Romantici"
            items={mixedRomance}
            type="mixed"
          />

          <MovieRow
            title="Commedie"
            items={mixedComedy}
            type="mixed"
          />

          <MovieRow
            title="Drammatici"
            items={mixedDrama}
            type="mixed"
          />

          <MovieRow
            title="Crime"
            items={mixedCrime}
            type="mixed"
          />

          <MovieRow
            title="Fantascienza"
            items={mixedScifi}
            type="mixed"
          />

          <MovieRow
            title="Horror"
            items={shuffledHorrorMovies}
            type="movie"
          />

          <MovieRow
            title="Guerra"
            items={shuffledWarMovies}
            type="movie"
          />

          <MovieRow
            title="Azione"
            items={shuffledActionMovies}
            type="movie"
          />

          <MovieRow
            title="Thriller"
            items={shuffledThrillerMovies}
            type="movie"
          />

          <MovieRow
            title="Animazione"
            items={shuffledAnimationMovies}
            type="movie"
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
