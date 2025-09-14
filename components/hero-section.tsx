'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Info } from 'lucide-react';
import { getBackdropUrl } from '@/lib/tmdb';
import type { Movie } from '@/lib/types';

interface HeroSectionProps {
  movie: Movie;
}

export function HeroSection({ movie }: HeroSectionProps) {
  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'original');

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
    </div>
  );
}