'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface VideoPlayerProps {
  tmdbId: number;
  type: 'movie' | 'tv';
  season?: number;
  episode?: number;
}

interface PlayerEvent {
  type: 'PLAYER_EVENT';
  data: {
    event: 'play' | 'pause' | 'seeked' | 'ended' | 'timeupdate';
    currentTime: number;
    duration: number;
    video_id: number;
  };
}

export function VideoPlayer({ tmdbId, type, season, episode }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getPlayerUrl = () => {
    const baseUrl = 'https://vixsrc.to';

    // Customization parameters for better experience
    const params = new URLSearchParams({
      primaryColor: 'E50914', // Netflix red
      secondaryColor: '831010', // Darker red
      autoplay: 'false',
      lang: 'it'
    });

    if (type === 'movie') {
      return `${baseUrl}/movie/${tmdbId}?${params.toString()}`;
    } else if (type === 'tv' && season !== undefined && episode !== undefined) {
      return `${baseUrl}/tv/${tmdbId}/${season}/${episode}?${params.toString()}`;
    }

    throw new Error('Invalid player configuration');
  };

  useEffect(() => {
    // Listen for player events
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://vixsrc.to') return;

      try {
        const message = event.data as PlayerEvent;
        if (message.type === 'PLAYER_EVENT') {
          console.log('Player event:', message.data);

          // Handle different player events
          switch (message.data.event) {
            case 'play':
              console.log('Video started playing');
              break;
            case 'pause':
              console.log('Video paused');
              break;
            case 'ended':
              console.log('Video ended');
              break;
            case 'seeked':
              console.log('Video seeked to:', message.data.currentTime);
              break;
            case 'timeupdate':
              // Handle time updates if needed (careful with frequency)
              break;
          }
        }
      } catch (error) {
        console.error('Error handling player message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Errore durante il caricamento del video');
  };

  try {
    const playerUrl = getPlayerUrl();

    return (
      <div className="relative w-full h-full min-h-[60vh] bg-black rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center space-y-4">
              <Skeleton className="w-16 h-16 rounded-full bg-gray-800 mx-auto" />
              <p className="text-white/70">Caricamento video...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-2xl">⚠️</div>
              <p className="text-white">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Riprova
              </button>
            </div>
          </div>
        )}

        <iframe
          src={playerUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="absolute inset-0 w-full h-full"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          title={`Player per ${type === 'movie' ? 'film' : 'serie TV'}`}
        />
      </div>
    );
  } catch {
    return (
      <div className="w-full h-full min-h-[60vh] bg-black rounded-lg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-2xl">⚠️</div>
          <p className="text-white">Configurazione del player non valida</p>
          <p className="text-white/70 text-sm">
            {type === 'tv' && (season === undefined || episode === undefined)
              ? 'Stagione ed episodio richiesti per le serie TV'
              : 'Parametri del player non validi'}
          </p>
        </div>
      </div>
    );
  }
}