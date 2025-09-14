'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { getImageUrl } from '@/lib/tmdb';

interface Episode {
  id: number;
  name: string;
  episode_number: number;
  air_date: string;
  overview: string;
  still_path: string;
  runtime: number;
}

interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  air_date: string;
  poster_path: string | null;
  overview: string;
}

interface EpisodeCarouselProps {
  tvId: number;
  seasons: Season[];
  onEpisodeSelect: (season: number, episode: number) => void;
  selectedSeason?: number;
}

export function EpisodeCarousel({
  tvId,
  seasons,
  onEpisodeSelect,
  selectedSeason = 1,
}: EpisodeCarouselProps) {
  const [currentSeason, setCurrentSeason] = useState(selectedSeason);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const availableSeasons = seasons.filter(season => season.season_number > 0);


  useEffect(() => {
    const fetchEpisodesEffect = async (seasonNumber: number) => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}?api_key=2d082597ab951b3a9596ca23e71413a8&language=it-IT`
        );

        if (response.ok) {
          const data = await response.json();
          setEpisodes(data.episodes || []);
        }
      } catch (error) {
        console.error('Error fetching episodes:', error);
        setEpisodes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodesEffect(currentSeason);
  }, [currentSeason, tvId]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleEpisodeClick = (episodeNumber: number) => {
    onEpisodeSelect(currentSeason, episodeNumber);
  };

  if (availableSeasons.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-4">
      {/* Season Selector */}
      <div className="flex flex-wrap gap-2">
        {availableSeasons.map((season) => (
          <Button
            key={season.id}
            variant={currentSeason === season.season_number ? "default" : "outline"}
            size="sm"
            className={`${
              currentSeason === season.season_number
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-transparent border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
            }`}
            onClick={() => setCurrentSeason(season.season_number)}
          >
            Stagione {season.season_number}
          </Button>
        ))}
      </div>

      {/* Episodes Carousel */}
      <div className="relative">
        <div className="flex items-center space-x-4">
          {/* Left Arrow */}
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 text-white hover:bg-white/10 p-2 h-auto"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Episodes Container */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex space-x-4 pb-2">
              {loading ? (
                // Loading Skeletons
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="shrink-0 w-72">
                    <div className="aspect-video bg-gray-700 rounded animate-pulse mb-3" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
                      <div className="h-3 bg-gray-700 rounded w-full animate-pulse" />
                      <div className="h-3 bg-gray-700 rounded w-2/3 animate-pulse" />
                    </div>
                  </div>
                ))
              ) : (
                episodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="shrink-0 w-72 cursor-pointer group"
                    onClick={() => handleEpisodeClick(episode.episode_number)}
                  >
                    <div className="relative mb-3">
                      {/* Episode Image */}
                      <div className="aspect-video bg-gray-800 rounded overflow-hidden relative">
                        {episode.still_path ? (
                          <Image
                            src={getImageUrl(episode.still_path, 'w500')}
                            alt={episode.name}
                            width={288}
                            height={162}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                            <Play className="h-12 w-12 text-white/40" />
                          </div>
                        )}

                        {/* Episode Number Overlay */}
                        <div className="absolute top-2 left-2 bg-black/80 text-white text-4xl font-bold px-2 py-1 rounded">
                          {episode.episode_number}
                        </div>

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="bg-white/90 rounded-full p-3">
                            <Play className="h-6 w-6 text-black fill-black" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Episode Title */}
                    <h4 className="text-white font-medium text-sm line-clamp-2 leading-tight">
                      {episode.name}
                    </h4>

                    {/* Episode Description */}
                    <p className="text-white/70 text-xs mt-1 line-clamp-3 leading-relaxed">
                      {episode.overview || 'Nessuna descrizione disponibile per questo episodio.'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Arrow */}
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 text-white hover:bg-white/10 p-2 h-auto"
            onClick={scrollRight}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}