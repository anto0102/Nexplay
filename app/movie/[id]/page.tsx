import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { Skeleton } from '@/components/ui/skeleton';
import { MovieRow } from '@/components/movie-row';
import { MovieDetailsClient } from '@/components/movie-details-client';
import {
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getMovieRecommendations,
  getSimilarMovies,
} from '@/lib/tmdb';
import { getImageUrl, getBackdropUrl } from '@/lib/tmdb';

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const movieId = parseInt(resolvedParams.id);

  if (isNaN(movieId)) {
    return {
      title: 'Film non trovato - NexPlay',
    };
  }

  try {
    const movieDetails = await getMovieDetails(movieId);
    const posterUrl = getImageUrl(movieDetails.poster_path, 'w500');
    const backdropUrl = getBackdropUrl(movieDetails.backdrop_path, 'w1280');

    return {
      title: `${movieDetails.title} - NexPlay`,
      description: movieDetails.overview || `Guarda ${movieDetails.title} in streaming su NexPlay`,
      openGraph: {
        title: `${movieDetails.title} - NexPlay`,
        description: movieDetails.overview || `Guarda ${movieDetails.title} in streaming su NexPlay`,
        images: [
          {
            url: backdropUrl,
            width: 1280,
            height: 720,
            alt: movieDetails.title,
          },
          {
            url: posterUrl,
            width: 500,
            height: 750,
            alt: movieDetails.title,
          },
        ],
        type: 'video.movie',
        siteName: 'NexPlay',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${movieDetails.title} - NexPlay`,
        description: movieDetails.overview || `Guarda ${movieDetails.title} in streaming su NexPlay`,
        images: [backdropUrl],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Film - NexPlay',
    };
  }
}

async function MovieContent({ id }: { id: string }) {
  try {
    const movieId = parseInt(id);
    if (isNaN(movieId)) {
      notFound();
    }

    const [movieDetails, credits, , recommendations, similar] = await Promise.all([
      getMovieDetails(movieId),
      getMovieCredits(movieId),
      getMovieVideos(movieId),
      getMovieRecommendations(movieId).catch(() => ({ results: [] })),
      getSimilarMovies(movieId).catch(() => ({ results: [] })),
    ]);


    return (
      <>
        <MovieDetailsClient
          movieDetails={movieDetails}
          credits={credits}
        />

        {/* Recommendations */}
        <div className="bg-black pb-20">
          {recommendations?.results.length > 0 && (
            <MovieRow
              title="Film consigliati"
              items={recommendations.results}
              type="movie"
            />
          )}

          {similar?.results.length > 0 && (
            <MovieRow
              title="Film simili"
              items={similar.results}
              type="movie"
            />
          )}
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading movie details:', error);
    notFound();
  }
}

function MovieDetailsSkeleton() {
  return (
    <div className="bg-black min-h-screen pt-20">
      {/* Hero Skeleton */}
      <div className="h-[80vh] bg-gray-800 animate-pulse" />

      {/* Details Skeleton */}
      <div className="py-16">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Skeleton className="w-[300px] h-[450px] bg-gray-800 mx-auto lg:mx-0" />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div>
                <Skeleton className="h-8 w-48 bg-gray-800 mb-4" />
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-32 bg-gray-800" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function MoviePage({ params }: MoviePageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return (
    <main className="bg-black">
      <Navbar />
      <Suspense fallback={<MovieDetailsSkeleton />}>
        <MovieContent id={id} />
      </Suspense>
    </main>
  );
}