'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VideoPlayer } from '@/components/video-player';
import { Dialog, DialogContent, VisuallyHidden, DialogTitle } from '@/components/ui/dialog';
import { useMyList } from '@/contexts/my-list-context';
import { Play, Plus, Check, Info, VolumeX, Volume2 } from 'lucide-react';
import { getImageUrl, getBackdropUrl } from '@/lib/tmdb';

interface MovieDetailsClientProps {
  movieDetails: any;
  credits: any;
  videos: any;
}

export function MovieDetailsClient({ movieDetails, credits, videos }: MovieDetailsClientProps) {
  const { addToList, removeFromList, isInList } = useMyList();
  const [showPlayer, setShowPlayer] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const trailer = videos?.results.find((video: any) =>
    video.type === 'Trailer' && video.site === 'YouTube'
  );

  const inMyList = isInList(movieDetails.id, 'movie');

  const handleMyListClick = () => {
    if (inMyList) {
      removeFromList(movieDetails.id, 'movie');
    } else {
      addToList(movieDetails, 'movie');
    }
  };

  const handlePlay = () => {
    setShowPlayer(true);
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen w-full">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={getBackdropUrl(movieDetails.backdrop_path, 'original')}
            alt={movieDetails.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-end h-full">
          <div className="container mx-auto px-4 md:px-8 lg:px-16 pb-32">
            <div className="max-w-2xl space-y-6">
              {/* Title */}
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                {movieDetails.title}
              </h1>

              {/* Info Row */}
              <div className="flex items-center gap-4 text-white/90">
                <Badge className="bg-green-600 text-white font-semibold px-3 py-1">
                  {Math.round(movieDetails.vote_average * 10)}% Match
                </Badge>
                <span className="text-lg font-medium">{new Date(movieDetails.release_date).getFullYear()}</span>
                <Badge variant="outline" className="border-white/40 text-white/90">
                  {movieDetails.adult ? '18+' : '13+'}
                </Badge>
                {movieDetails.runtime && (
                  <span>{Math.floor(movieDetails.runtime / 60)}h {movieDetails.runtime % 60}min</span>
                )}
                <Badge variant="secondary" className="bg-white/20 text-white">
                  HD
                </Badge>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {movieDetails.genres.slice(0, 3).map((genre: any) => (
                  <span key={genre.id} className="text-white/80">
                    {genre.name}
                  </span>
                )).reduce((acc: any, curr: any, i: number, arr: any[]) => {
                  return i < arr.length - 1 ? [...acc, curr, <span key={`sep-${i}`} className="text-white/60">•</span>] : [...acc, curr];
                }, [])}
              </div>

              {/* Description */}
              <p className="text-xl text-white/90 leading-relaxed max-w-xl line-clamp-3">
                {movieDetails.overview}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 mt-8">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-white/80 text-lg font-semibold px-8 py-4 h-auto"
                  onClick={handlePlay}
                >
                  <Play className="mr-3 h-6 w-6 fill-black" />
                  Riproduci
                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white/20 text-white hover:bg-white/30 text-lg font-semibold px-8 py-4 h-auto border-0"
                  onClick={() => setShowInfo(true)}
                >
                  <Info className="mr-3 h-6 w-6" />
                  Altre info
                </Button>
              </div>

              {/* Secondary Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleMyListClick}
                  className="w-12 h-12 rounded-full border-2 border-white/60 hover:border-white bg-transparent hover:bg-white/10 transition-colors flex items-center justify-center group"
                >
                  {inMyList ? (
                    <Check className="h-6 w-6 text-white" />
                  ) : (
                    <Plus className="h-6 w-6 text-white" />
                  )}
                </button>

                <button className="w-12 h-12 rounded-full border-2 border-white/60 hover:border-white bg-transparent hover:bg-white/10 transition-colors flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM8.5 16l3.5-2.5 3.5 2.5L12 18.5 8.5 16z"/>
                  </svg>
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-12 h-12 rounded-full border-2 border-white/60 hover:border-white bg-transparent hover:bg-white/10 transition-colors flex items-center justify-center ml-auto"
                >
                  {isMuted ? (
                    <VolumeX className="h-6 w-6 text-white" />
                  ) : (
                    <Volume2 className="h-6 w-6 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      {credits.cast && credits.cast.length > 0 && (
        <div className="bg-black py-16">
          <div className="container mx-auto px-4 md:px-8 lg:px-16">
            <h2 className="text-2xl font-bold text-white mb-8">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {credits.cast.slice(0, 12).map((actor: any) => (
                <div key={actor.id} className="text-center">
                  <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden mb-3">
                    <Image
                      src={getImageUrl(actor.profile_path, 'w185')}
                      alt={actor.name}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-white font-medium text-sm line-clamp-1 mb-1">
                    {actor.name}
                  </h3>
                  <p className="text-white/60 text-xs line-clamp-1">
                    {actor.character}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Simili Section */}
      <div className="bg-black pb-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <h2 className="text-2xl font-bold text-white mb-8">Simili a questo</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Placeholder per film simili - da implementare */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-video bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Player Dialog */}
      <Dialog open={showPlayer} onOpenChange={setShowPlayer}>
        <DialogContent className="max-w-6xl w-full h-[90vh] bg-black border-0 p-0">
          <VisuallyHidden>
            <DialogTitle>Riproduci {movieDetails.title}</DialogTitle>
          </VisuallyHidden>
          <VideoPlayer
            tmdbId={movieDetails.id}
            type="movie"
          />
        </DialogContent>
      </Dialog>

      {/* Info Dialog */}
      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
          <VisuallyHidden>
            <DialogTitle>Informazioni su {movieDetails.title}</DialogTitle>
          </VisuallyHidden>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">{movieDetails.title}</h2>
            <p className="text-white/80 leading-relaxed">{movieDetails.overview}</p>

            <div className="space-y-4">
              <div>
                <span className="text-white/60">Anno: </span>
                <span className="text-white">{new Date(movieDetails.release_date).getFullYear()}</span>
              </div>

              <div>
                <span className="text-white/60">Generi: </span>
                <span className="text-white">
                  {movieDetails.genres.map((g: any) => g.name).join(', ')}
                </span>
              </div>

              {movieDetails.runtime && (
                <div>
                  <span className="text-white/60">Durata: </span>
                  <span className="text-white">{Math.floor(movieDetails.runtime / 60)}h {movieDetails.runtime % 60}min</span>
                </div>
              )}

              <div>
                <span className="text-white/60">Valutazione: </span>
                <span className="text-white">{movieDetails.vote_average.toFixed(1)}/10</span>
              </div>

              {movieDetails.budget > 0 && (
                <div>
                  <span className="text-white/60">Budget: </span>
                  <span className="text-white">${movieDetails.budget.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}