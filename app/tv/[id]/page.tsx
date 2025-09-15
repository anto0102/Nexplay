import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { Skeleton } from '@/components/ui/skeleton';
import { MovieRow } from '@/components/movie-row';
import { TVShowDetailsClient } from '@/components/tv-details-client';
import {
  getTVShowDetails,
  getTVShowCredits,
  getTVShowVideos,
  getTVShowRecommendations,
  getSimilarTVShows,
} from '@/lib/tmdb';
import { getImageUrl, getBackdropUrl } from '@/lib/tmdb';

interface TVPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TVPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tvId = parseInt(resolvedParams.id);

  if (isNaN(tvId)) {
    return {
      title: 'Serie TV non trovata - NexPlay',
    };
  }

  try {
    const tvDetails = await getTVShowDetails(tvId);
    const posterUrl = getImageUrl(tvDetails.poster_path, 'w500');
    const backdropUrl = getBackdropUrl(tvDetails.backdrop_path, 'w1280');

    return {
      title: `${tvDetails.name} - NexPlay`,
      description: tvDetails.overview || `Guarda ${tvDetails.name} in streaming su NexPlay`,
      openGraph: {
        title: `${tvDetails.name} - NexPlay`,
        description: tvDetails.overview || `Guarda ${tvDetails.name} in streaming su NexPlay`,
        images: [
          {
            url: backdropUrl,
            width: 1280,
            height: 720,
            alt: tvDetails.name,
          },
          {
            url: posterUrl,
            width: 500,
            height: 750,
            alt: tvDetails.name,
          },
        ],
        type: 'video.tv_show',
        siteName: 'NexPlay',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${tvDetails.name} - NexPlay`,
        description: tvDetails.overview || `Guarda ${tvDetails.name} in streaming su NexPlay`,
        images: [backdropUrl],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Serie TV - NexPlay',
    };
  }
}

async function TVContent({ id }: { id: string }) {
  try {
    const tvId = parseInt(id);
    if (isNaN(tvId)) {
      notFound();
    }

    const [tvDetails, credits, , recommendations, similar] = await Promise.all([
      getTVShowDetails(tvId),
      getTVShowCredits(tvId),
      getTVShowVideos(tvId),
      getTVShowRecommendations(tvId).catch(() => ({ results: [] })),
      getSimilarTVShows(tvId).catch(() => ({ results: [] })),
    ]);


    return (
      <>
        <TVShowDetailsClient
          tvDetails={tvDetails}
          credits={credits}
        />

        {/* Recommendations */}
        <div className="bg-black pb-20">
          {recommendations?.results?.length > 0 && (
            <MovieRow
              title="Serie TV consigliate"
              items={recommendations.results}
              type="tv"
            />
          )}

          {similar?.results?.length > 0 && (
            <MovieRow
              title="Serie TV simili"
              items={similar.results}
              type="tv"
            />
          )}
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading TV show details:', error);
    notFound();
  }
}

function TVDetailsSkeleton() {
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
            <div className="lg:col-span-2 space-y-8">
              <div>
                <Skeleton className="h-8 w-32 bg-gray-800 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-32 bg-gray-800" />
                  ))}
                </div>
              </div>
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

export default async function TVPage({ params }: TVPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return (
    <main className="bg-black">
      <Navbar />
      <Suspense fallback={<TVDetailsSkeleton />}>
        <TVContent id={id} />
      </Suspense>
    </main>
  );
}