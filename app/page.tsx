import { Suspense } from 'react';
import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/hero-section';
import { MovieRow } from '@/components/movie-row';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getTrendingTVShows,
  getPopularTVShows,
  getTopRatedTVShows,
} from '@/lib/tmdb';

async function HomeContent() {
  try {
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

    // Get the hero movie (first trending movie)
    const heroMovie = trendingMovies.results[0];

    return (
      <>
        {/* Hero Section */}
        {heroMovie && <HeroSection movie={heroMovie} />}

        {/* Content Rows */}
        <div className="bg-black min-h-screen pb-20">
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
      </>
    );
  } catch (error) {
    console.error('Error loading content:', error);
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Errore nel caricamento</h1>
          <p className="text-white/70">Si è verificato un errore durante il caricamento dei contenuti.</p>
        </div>
      </div>
    );
  }
}

function LoadingSkeleton() {
  return (
    <div className="bg-black min-h-screen">
      {/* Hero Skeleton */}
      <div className="h-[100vh] bg-gray-800 animate-pulse" />

      {/* Content Rows Skeleton */}
      <div className="p-4 md:p-8 lg:p-16 space-y-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-8 w-64 bg-gray-800" />
            <div className="flex gap-2 overflow-x-auto">
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <Skeleton key={j} className="min-w-[280px] h-[157px] bg-gray-800" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="bg-black">
      <Navbar />
      <Suspense fallback={<LoadingSkeleton />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}
