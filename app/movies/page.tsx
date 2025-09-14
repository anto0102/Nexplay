import { Suspense } from 'react';
import { Navbar } from '@/components/navbar';
import { MovieRow } from '@/components/movie-row';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
  discoverMovies,
} from '@/lib/tmdb';

async function MoviesContent() {
  try {
    const [
      popularMovies,
      topRatedMovies,
      upcomingMovies,
      nowPlayingMovies,
      actionMovies,
      comedyMovies,
      dramaMovies,
      horrorMovies,
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

    return (
      <div className="bg-black min-h-screen pt-20 pb-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Film</h1>
          <p className="text-white/70 text-lg">Scopri migliaia di film di ogni genere</p>
        </div>

        <div className="space-y-8">
          <MovieRow
            title="Film popolari"
            items={popularMovies.results}
            type="movie"
          />

          <MovieRow
            title="Al cinema ora"
            items={nowPlayingMovies.results}
            type="movie"
          />

          <MovieRow
            title="Film più votati"
            items={topRatedMovies.results}
            type="movie"
          />

          <MovieRow
            title="Film in arrivo"
            items={upcomingMovies.results}
            type="movie"
          />

          <MovieRow
            title="Film d'azione"
            items={actionMovies.results}
            type="movie"
          />

          <MovieRow
            title="Film comici"
            items={comedyMovies.results}
            type="movie"
          />

          <MovieRow
            title="Film drammatici"
            items={dramaMovies.results}
            type="movie"
          />

          <MovieRow
            title="Film horror"
            items={horrorMovies.results}
            type="movie"
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading movies:', error);
    return (
      <div className="bg-black min-h-screen flex items-center justify-center pt-20">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Errore nel caricamento</h1>
          <p className="text-white/70">Si è verificato un errore durante il caricamento dei film.</p>
        </div>
      </div>
    );
  }
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

export default function MoviesPage() {
  return (
    <main className="bg-black">
      <Navbar />
      <Suspense fallback={<LoadingSkeleton />}>
        <MoviesContent />
      </Suspense>
    </main>
  );
}