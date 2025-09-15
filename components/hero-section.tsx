'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Info } from 'lucide-react';
import { getBackdropUrl } from '@/lib/tmdb';
import type { Movie } from '@/lib/types';
import { useEffect, useState } from 'react';

interface HeroSectionProps {
  movie: Movie;
  totalItems: number;
  currentIndex: number;
}

export function HeroSection({ movie, totalItems, currentIndex }: HeroSectionProps) {
  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'original');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 100); // Update every 100ms to reach 100% in 10 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="relative h-[100vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Gradients overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center z-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="max-w-3xl space-y-6">

            {/* Simple badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white font-semibold rounded text-sm">
              FILM ESCLUSIVO
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              {movie.title}
            </h1>

            {/* Rating & Details */}
            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant="secondary" className="bg-green-600 text-white">
                ⭐ {movie.vote_average.toFixed(1)}
              </Badge>
              <span className="text-white/80">
                {new Date(movie.release_date).getFullYear()}
              </span>
              <Badge variant="outline" className="border-white/20 text-white">
                {movie.adult ? '18+' : '13+'}
              </Badge>
            </div>

            {/* Overview */}
            <p className="text-lg md:text-xl text-white/90 leading-relaxed line-clamp-3 max-w-2xl">
              {movie.overview}
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-4 flex-wrap">
              <Link href={`/movie/${movie.id}`}>
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 font-bold"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Riproduci
                </Button>
              </Link>

              <Link href={`/movie/${movie.id}`}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-gray-600/80 text-white hover:bg-gray-600/60"
                >
                  <Info className="mr-2 h-5 w-5" />
                  Maggiori info
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <div className="flex items-center gap-3">
          {/* Dots */}
          <div className="flex gap-2">
            {Array.from({ length: totalItems }, (_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-20 mx-auto">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-600 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}