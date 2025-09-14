'use client';

import { useState, useEffect } from 'react';
import { MovieRow } from '@/components/movie-row';
import { Skeleton } from '@/components/ui/skeleton';
import { getTrendingMovies, getTrendingTVShows } from '@/lib/tmdb';
import type { Movie, TVShow } from '@/lib/types';

interface TrendingData {
  trendingMovies: Movie[];
  trendingTVShows: TVShow[];
}

export function TrendingContentClient() {
  const [content, setContent] = useState<TrendingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = async () => {
    setError(null);

    try {
      const [trendingMoviesRes, trendingTVShowsRes] = await Promise.all([
        getTrendingMovies(),
        getTrendingTVShows(),
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
        trendingTVShows: shuffleArray(trendingTVShowsRes.results),
      });

    } catch (err) {
      console.error('Error loading trending content:', err);
      setError('Errore nel caricamento delle tendenze');
    } finally {
      setLoading(false);
    }
  };

  // Load content on mount
  useEffect(() => {
    loadContent();
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !content) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center pt-20">
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

  return (
    <>

      <div className="bg-black min-h-screen pt-20 pb-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Tendenze</h1>
          <p className="text-white/70 text-lg">I contenuti più popolari del momento</p>
        </div>

        <div className="space-y-8">
          <MovieRow
            title="Film di tendenza"
            items={content.trendingMovies}
            type="movie"
          />

          <MovieRow
            title="Serie TV di tendenza"
            items={content.trendingTVShows}
            type="tv"
          />
        </div>
      </div>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div className="bg-black min-h-screen pt-20">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 mb-8">
        <Skeleton className="h-12 w-48 bg-gray-800 mb-2" />
        <Skeleton className="h-6 w-80 bg-gray-800" />
      </div>

      <div className="space-y-8 p-4 md:p-8 lg:p-16">
        {[1, 2].map((i) => (
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