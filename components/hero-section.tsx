'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { getBackdropUrl } from '@/lib/tmdb';
import type { Movie } from '@/lib/types';
import { useEffect, useState, useRef, useCallback } from 'react';

interface HeroSectionProps {
  heroMovies: Movie[];
  initialIndex: number;
}

export function HeroSection({ heroMovies, initialIndex }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const currentMovie = heroMovies[currentIndex];

  // Swipe detection
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
    setProgress(0);
  }, [heroMovies.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
    setProgress(0);
  }, [heroMovies.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  }, []);

  useEffect(() => {
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 1;
      });
    }, 100); // Update every 100ms to reach 100% in 10 seconds

    const heroInterval = setInterval(() => {
      goToNext();
    }, 10000); // Change hero every 10 seconds

    return () => {
      clearInterval(progressInterval);
      clearInterval(heroInterval);
    };
  }, [heroMovies.length, goToNext]);

  return (
    <div
      ref={heroRef}
      className="relative h-[100vh] w-full overflow-hidden touch-pan-y"
      style={{ marginTop: 'calc(var(--banner-height, 0px) + 80px)' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={getBackdropUrl(currentMovie.backdrop_path, 'hero')}
          alt={currentMovie.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={85}
        />
      </div>

      {/* Gradients overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10" />

      {/* Desktop Navigation Arrows */}
      <div className="hidden md:block">
        {/* Previous Arrow */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 text-white/70 hover:text-white transition-all duration-300 h-12 w-12 rounded-full"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Next Arrow */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 text-white/70 hover:text-white transition-all duration-300 h-12 w-12 rounded-full"
          onClick={goToNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

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
              {currentMovie.title}
            </h1>

            {/* Rating & Details */}
            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant="secondary" className="bg-green-600 text-white">
                ⭐ {currentMovie.vote_average.toFixed(1)}
              </Badge>
              <span className="text-white/80">
                {new Date(currentMovie.release_date).getFullYear()}
              </span>
              <Badge variant="outline" className="border-white/20 text-white">
                {currentMovie.adult ? '18+' : '13+'}
              </Badge>
            </div>

            {/* Overview */}
            <p className="text-lg md:text-xl text-white/90 leading-relaxed line-clamp-3 max-w-2xl">
              {currentMovie.overview}
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-4 flex-wrap">
              <Link href={`/movie/${currentMovie.id}`}>
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 font-bold"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Riproduci
                </Button>
              </Link>

              <Link href={`/movie/${currentMovie.id}`}>
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
            {Array.from({ length: heroMovies.length }, (_, i) => (
              <button
                key={i}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentIndex
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
                onClick={() => goToSlide(i)}
                aria-label={`Vai al film ${i + 1}`}
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