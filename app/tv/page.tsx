import { Suspense } from 'react';
import { Navbar } from '@/components/navbar';
import { MovieRow } from '@/components/movie-row';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getPopularTVShows,
  getTopRatedTVShows,
  getTrendingTVShows,
  discoverTVShows,
} from '@/lib/tmdb';

async function TVContent() {
  try {
    const [
      popularTVShows,
      topRatedTVShows,
      trendingTVShows,
      actionTVShows,
      comedyTVShows,
      dramaTVShows,
      crimeTVShows,
      scifiTVShows,
    ] = await Promise.all([
      getPopularTVShows(),
      getTopRatedTVShows(),
      getTrendingTVShows(),
      discoverTVShows({ genre: 10759 }), // Action & Adventure
      discoverTVShows({ genre: 35 }),    // Comedy
      discoverTVShows({ genre: 18 }),    // Drama
      discoverTVShows({ genre: 80 }),    // Crime
      discoverTVShows({ genre: 10765 }), // Sci-Fi & Fantasy
    ]);

    return (
      <div className="bg-black min-h-screen pt-20 pb-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Serie TV</h1>
          <p className="text-white/70 text-lg">Scopri le migliori serie TV di ogni genere</p>
        </div>

        <div className="space-y-8">
          <MovieRow
            title="Serie TV di tendenza"
            items={trendingTVShows.results}
            type="tv"
          />

          <MovieRow
            title="Serie TV popolari"
            items={popularTVShows.results}
            type="tv"
          />

          <MovieRow
            title="Serie TV più votate"
            items={topRatedTVShows.results}
            type="tv"
          />

          <MovieRow
            title="Serie d'azione e avventura"
            items={actionTVShows.results}
            type="tv"
          />

          <MovieRow
            title="Serie comiche"
            items={comedyTVShows.results}
            type="tv"
          />

          <MovieRow
            title="Serie drammatiche"
            items={dramaTVShows.results}
            type="tv"
          />

          <MovieRow
            title="Serie crime"
            items={crimeTVShows.results}
            type="tv"
          />

          <MovieRow
            title="Serie sci-fi e fantasy"
            items={scifiTVShows.results}
            type="tv"
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading TV shows:', error);
    return (
      <div className="bg-black min-h-screen flex items-center justify-center pt-20">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Errore nel caricamento</h1>
          <p className="text-white/70">Si è verificato un errore durante il caricamento delle serie TV.</p>
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

export default function TVPage() {
  return (
    <main className="bg-black">
      <Navbar />
      <Suspense fallback={<LoadingSkeleton />}>
        <TVContent />
      </Suspense>
    </main>
  );
}