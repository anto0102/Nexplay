'use client';

import { useState, useEffect } from 'react';
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
import type { Movie, TVShow } from '@/lib/types';

interface ContentData {
  trendingMovies: Movie[];
  popularMovies: Movie[];
  topRatedMovies: Movie[];
  trendingTVShows: TVShow[];
  popularTVShows: TVShow[];
  topRatedTVShows: TVShow[];
}

export function HomeContentClient() {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroIndex, setHeroIndex] = useState(() => Math.floor(Math.random() * 10)); // Random start
  const [progress, setProgress] = useState(0);

  // Auto-rotate hero every 10 seconds with progress bar
  useEffect(() => {
    if (!content || content.trendingMovies.length === 0) return;

    const totalDuration = 10000; // 10 seconds
    const updateInterval = 50; // Update every 50ms for smooth animation
    const increment = (updateInterval / totalDuration) * 100;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Reset progress and move to next hero
          setHeroIndex((prevIndex) =>
            (prevIndex + 1) % Math.min(content.trendingMovies.length, 10)
          );
          return 0;
        }
        return prev + increment;
      });
    }, updateInterval);

    return () => clearInterval(progressInterval);
  }, [content]);

  const loadContent = async () => {
    setError(null);

    try {
      const [
        trendingMoviesRes,
        popularMoviesRes,
        topRatedMoviesRes,
        trendingTVShowsRes,
        popularTVShowsRes,
        topRatedTVShowsRes,
      ] = await Promise.all([
        getTrendingMovies(),
        getPopularMovies(),
        getTopRatedMovies(),
        getTrendingTVShows(),
        getPopularTVShows(),
        getTopRatedTVShows(),
      ]);

      // Shuffle arrays to get different content on each page load
      const shuffleArray = <T>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };

      setContent({
        trendingMovies: shuffleArray(trendingMoviesRes.results),
        popularMovies: shuffleArray(popularMoviesRes.results),
        topRatedMovies: shuffleArray(topRatedMoviesRes.results),
        trendingTVShows: shuffleArray(trendingTVShowsRes.results),
        popularTVShows: shuffleArray(popularTVShowsRes.results),
        topRatedTVShows: shuffleArray(topRatedTVShowsRes.results),
      });

    } catch (err) {
      console.error('Error loading content:', err);
      setError('Errore nel caricamento dei contenuti');
    } finally {
      setLoading(false);
    }
  };

  // Load content on mount
  useEffect(() => {
    loadContent();
  }, []);

  const handleManualHeroChange = (index: number) => {
    setHeroIndex(index);
    setProgress(0); // Reset progress when manually changing
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !content) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-white text-center space-y-4">
          <h1 className="text-2xl font-bold">Errore nel caricamento</h1>
          <p className="text-white/70">{error || 'Si è verificato un errore durante il caricamento.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Ricarica pagina
          </button>
        </div>
      </div>
    );
  }

  const heroMovie = content.trendingMovies[heroIndex];

  return (
    <>

      {/* Hero Section Container */}
      <div className="relative">
        {/* Hero Section with auto-rotation */}
        {heroMovie && <HeroSection movie={heroMovie} />}

        {/* Progress Bar */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-80 z-40">
          <div className="bg-white/20 h-1 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="bg-red-600 h-full transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Hero Indicator Dots */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3 z-40">
          {content.trendingMovies.slice(0, 10).map((_, index) => (
            <button
              key={index}
              onClick={() => handleManualHeroChange(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 border-2 ${
                index === heroIndex
                  ? 'bg-red-600 border-red-600 scale-110'
                  : 'bg-transparent border-white/50 hover:border-white hover:scale-105'
              }`}
              aria-label={`Vai al film ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content Rows */}
      <div className="bg-black min-h-screen pb-20 pt-10">
        <MovieRow
          title="Tendenze del momento"
          items={content.trendingMovies.slice(1, 20)}
          type="movie"
        />

        <MovieRow
          title="Serie TV di tendenza"
          items={content.trendingTVShows}
          type="tv"
        />

        <MovieRow
          title="Film popolari"
          items={content.popularMovies}
          type="movie"
        />

        <MovieRow
          title="Serie TV popolari"
          items={content.popularTVShows}
          type="tv"
        />

        <MovieRow
          title="Film più votati"
          items={content.topRatedMovies}
          type="movie"
        />

        <MovieRow
          title="Serie TV più votate"
          items={content.topRatedTVShows}
          type="tv"
        />
      </div>
    </>
  );
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