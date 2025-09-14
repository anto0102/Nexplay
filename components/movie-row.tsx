'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play, Plus, Check, ThumbsUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMyList } from '@/contexts/my-list-context';
import { Movie, TVShow, getImageUrl } from '@/lib/tmdb';

interface MovieRowProps {
  title: string;
  items: (Movie | TVShow)[];
  type: 'movie' | 'tv';
}

interface MovieCardProps {
  item: Movie | TVShow;
  type: 'movie' | 'tv';
}

function MovieCard({ item, type }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToList, removeFromList, isInList } = useMyList();

  const title = type === 'movie' ? (item as Movie).title : (item as TVShow).name;
  const releaseDate = type === 'movie' ? (item as Movie).release_date : (item as TVShow).first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const detailsUrl = type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;

  const inMyList = isInList(item.id, type);

  const handleMyListClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inMyList) {
      removeFromList(item.id, type);
    } else {
      addToList(item, type);
    }
  };

  return (
    <div
      className="group relative min-w-[280px] cursor-pointer transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={detailsUrl}>
        <Card className="overflow-hidden border-0 bg-transparent">
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
            <Image
              src={getImageUrl(item.backdrop_path, 'w500')}
              alt={title}
              fill
              className="object-cover transition-opacity duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Simple overlay on hover */}
            {isHovered && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            )}

            {/* Play button */}
            {isHovered && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-3 shadow-lg hover:bg-white transition-colors">
                  <Play className="h-6 w-6 text-black fill-black ml-0.5" />
                </div>
              </div>
            )}

            {/* Rating badge */}
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                ⭐ {item.vote_average.toFixed(1)}
              </Badge>
            </div>
          </div>

          {/* Content on hover */}
          {isHovered && (
            <div className="absolute inset-x-0 bottom-0 p-4 text-white bg-black/80 rounded-b-lg">
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">{title}</h3>

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-white/80">{year}</span>
                <span className="text-xs px-2 py-1 bg-white/20 rounded">
                  {type === 'movie' ? 'FILM' : 'SERIE'}
                </span>
              </div>

              <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
                <Button size="sm" className="bg-white text-black hover:bg-white/80">
                  <Play className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className={`text-white hover:bg-white/20 ${inMyList ? 'bg-green-600/20' : ''}`}
                  onClick={handleMyListClick}
                  title={inMyList ? 'Rimuovi dalla mia lista' : 'Aggiungi alla mia lista'}
                >
                  {inMyList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 ml-auto">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </Link>
    </div>
  );
}

export function MovieRow({ title, items, type }: MovieRowProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(`scroll-container-${title}`);
    if (!container) return;

    const scrollAmount = 300;
    const newPosition = direction === 'left'
      ? Math.max(0, scrollPosition - scrollAmount)
      : scrollPosition + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });

    setScrollPosition(newPosition);
    setCanScrollLeft(newPosition > 0);
    setCanScrollRight(newPosition < container.scrollWidth - container.clientWidth - 10);
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="relative mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-4 md:px-8 lg:px-16">
        {title}
      </h2>

      <div className="relative group">
        {/* Left Arrow */}
        {canScrollLeft && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}

        {/* Scrollable Container */}
        <div
          id={`scroll-container-${title}`}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-4 md:px-8 lg:px-16 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <MovieCard key={item.id} item={item} type={type} />
          ))}
        </div>
      </div>
    </div>
  );
}