'use client';

import { useState, useEffect } from 'react';
import { MovieRow } from '@/components/movie-row';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
  discoverMovies,
} from '@/lib/tmdb';
import type { Movie } from '@/lib/types';

interface MoviesData {
  popularMovies: Movie[];
  topRatedMovies: Movie[];
  upcomingMovies: Movie[];
  nowPlayingMovies: Movie[];
  actionMovies: Movie[];
  comedyMovies: Movie[];
  dramaMovies: Movie[];
  horrorMovies: Movie[];
}

export function MoviesContentClient() {
  const [content, setContent] = useState<MoviesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = async () => {
    setError(null);

    try {
      const [
        popularMoviesRes,
        topRatedMoviesRes,
        upcomingMoviesRes,
        nowPlayingMoviesRes,
        actionMoviesRes,
        comedyMoviesRes,
        dramaMoviesRes,
        horrorMoviesRes,
      ] = await Promise.all([
        getPopularMovies(),
        getTopRatedMovies(),
        getUpcomingMovies(),
        getNowPlayingMovies(),
        discoverMovies({ genre: 28 }), // Action
        discoverMovies({ genre: 35 }), // Comedy
        discoverMovies({ genre: 18 }), // Drama
        discoverMovies({ genre: 27 }), // Horror
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
        popularMovies: shuffleArray(popularMoviesRes.results),
        topRatedMovies: shuffleArray(topRatedMoviesRes.results),
        upcomingMovies: shuffleArray(upcomingMoviesRes.results),
        nowPlayingMovies: shuffleArray(nowPlayingMoviesRes.results),
        actionMovies: shuffleArray(actionMoviesRes.results),
        comedyMovies: shuffleArray(comedyMoviesRes.results),
        dramaMovies: shuffleArray(dramaMoviesRes.results),
        horrorMovies: shuffleArray(horrorMoviesRes.results),
      });

    } catch (err) {
      console.error('Error loading movies:', err);
      setError('Errore nel caricamento dei film');
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Film</h1>
          <p className="text-white/70 text-lg">Scopri migliaia di film di ogni genere</p>
        </div>

        <div className="space-y-8">
          <MovieRow
            title="Film popolari"
            items={content.popularMovies}
            type="movie"
          />

          <MovieRow
            title="Al cinema ora"
            items={content.nowPlayingMovies}
            type="movie"
          />

          <MovieRow
            title="Film più votati"
            items={content.topRatedMovies}
            type="movie"
          />

          <MovieRow
            title="Film in arrivo"
            items={content.upcomingMovies}
            type="movie"
          />

          <MovieRow
            title="Film d'azione"
            items={content.actionMovies}
            type="movie"
          />

          <MovieRow
            title="Film comici"
            items={content.comedyMovies}
            type="movie"
          />

          <MovieRow
            title="Film drammatici"
            items={content.dramaMovies}
            type="movie"
          />

          <MovieRow
            title="Film horror"
            items={content.horrorMovies}
            type="movie"
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
        <Skeleton className="h-12 w-32 bg-gray-800 mb-2" />
        <Skeleton className="h-6 w-64 bg-gray-800" />
      </div>

      <div className="space-y-8 p-4 md:p-8 lg:p-16">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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