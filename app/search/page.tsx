import { Suspense } from 'react';
import { Navbar } from '@/components/navbar';
import { MovieRow } from '@/components/movie-row';
import { Skeleton } from '@/components/ui/skeleton';
import { searchMulti } from '@/lib/tmdb';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function SearchResults({ query }: { query: string }) {
  if (!query || query.length < 2) {
    return (
      <div
        className="bg-black min-h-screen pb-20"
        style={{ paddingTop: 'calc(var(--banner-height, 0px) + 120px)' }}
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Cerca contenuti</h1>
            <p className="text-white/70 text-lg">
              Digita almeno 2 caratteri per iniziare la ricerca
            </p>
          </div>
        </div>
      </div>
    );
  }

  try {
    const searchResults = await searchMulti(query);

    const movies = searchResults.results.filter(item => item.media_type === 'movie');
    const tvShows = searchResults.results.filter(item => item.media_type === 'tv');

    return (
      <div
        className="bg-black min-h-screen pb-20"
        style={{ paddingTop: 'calc(var(--banner-height, 0px) + 120px)' }}
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-16 mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Risultati per &quot;{query}&quot;
          </h1>
          <p className="text-white/70 text-lg">
            {searchResults.total_results} risultati trovati
          </p>
        </div>

        <div className="space-y-8">
          {movies.length > 0 && (
            <MovieRow
              title="Film"
              items={movies}
              type="movie"
            />
          )}

          {tvShows.length > 0 && (
            <MovieRow
              title="Serie TV"
              items={tvShows}
              type="tv"
            />
          )}

          {searchResults.results.length === 0 && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-white mb-4">
                Nessun risultato trovato
              </h2>
              <p className="text-white/70">
                Prova a cercare con parole chiave diverse
              </p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error searching:', error);
    return (
      <div
      className="bg-black min-h-screen pb-20 flex items-center justify-center"
      style={{ paddingTop: 'calc(var(--banner-height, 0px) + 120px)' }}
    >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Errore nella ricerca</h1>
          <p className="text-white/70">
            Si è verificato un errore durante la ricerca. Riprova più tardi.
          </p>
        </div>
      </div>
    );
  }
}

function SearchSkeleton() {
  return (
    <div
      className="bg-black min-h-screen pb-20"
      style={{ paddingTop: 'calc(var(--banner-height, 0px) + 120px)' }}
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16 mb-8">
        <Skeleton className="h-10 w-64 bg-gray-800 mb-2" />
        <Skeleton className="h-6 w-48 bg-gray-800" />
      </div>

      <div className="space-y-8 px-4 md:px-8 lg:px-16">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-8 w-32 bg-gray-800" />
            <div className="flex gap-3 overflow-x-auto">
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

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';

  return (
    <main className="bg-black">
      <Navbar />
      <Suspense fallback={<SearchSkeleton />}>
        <SearchResults query={query} />
      </Suspense>
    </main>
  );
}