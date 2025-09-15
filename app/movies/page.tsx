import { Navbar } from '@/components/navbar';
import { MovieRow } from '@/components/movie-row';
import { getPopularMovies, getTopRatedMovies, getTrendingMovies, getUpcomingMovies } from '@/lib/tmdb';

// Enable static generation for better performance
export const revalidate = 3600; // Revalidate every hour

export default async function MoviesPage() {
  try {
    const [popularMovies, topRatedMovies, trendingMovies, upcomingMovies] = await Promise.all([
      getPopularMovies(),
      getTopRatedMovies(),
      getTrendingMovies(),
      getUpcomingMovies()
    ]);

    return (
      <main className="bg-black min-h-screen">
        <Navbar />

        <div className="pt-20 pb-20 px-4 md:px-8 lg:px-16">
          <h1 className="text-white text-4xl font-bold mb-8">Film</h1>

          <MovieRow
            title="Film di tendenza"
            items={trendingMovies.results}
            type="movie"
          />

          <MovieRow
            title="Film popolari"
            items={popularMovies.results}
            type="movie"
          />

          <MovieRow
            title="Film più votati"
            items={topRatedMovies.results}
            type="movie"
          />

          <MovieRow
            title="Prossimamente"
            items={upcomingMovies.results}
            type="movie"
          />
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error loading movies:', error);
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