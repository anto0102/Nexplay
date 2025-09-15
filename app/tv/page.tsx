import { Navbar } from '@/components/navbar';
import { MovieRow } from '@/components/movie-row';
import { getPopularTVShows, getTopRatedTVShows, getTrendingTVShows } from '@/lib/tmdb';

// Enable static generation for better performance
export const revalidate = 3600; // Revalidate every hour

export default async function TVPage() {
  try {
    const [popularTVShows, topRatedTVShows, trendingTVShows] = await Promise.all([
      getPopularTVShows(),
      getTopRatedTVShows(),
      getTrendingTVShows()
    ]);

    return (
      <main className="bg-black min-h-screen">
        <Navbar />

        <div
          className="px-4 md:px-8 lg:px-16"
          style={{ paddingTop: 'calc(var(--banner-height, 0px) + 80px)' }}
        >
          <h1 className="text-white text-4xl font-bold mb-8">Serie TV</h1>

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
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error loading TV shows:', error);
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