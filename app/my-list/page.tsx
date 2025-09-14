'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMyList } from '@/contexts/my-list-context';
import { getImageUrl } from '@/lib/tmdb';
import { Heart, Plus, Play, Trash2 } from 'lucide-react';

export default function MyListPage() {
  const { myList, removeFromList } = useMyList();

  const handleRemove = (id: number, type: 'movie' | 'tv') => {
    removeFromList(id, type);
  };

  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      <div className="pt-20 pb-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">La mia lista</h1>

          {myList.length === 0 ? (
            /* Empty state - minimalist design */
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
              <div className="max-w-sm mx-auto space-y-6">
                <div className="w-16 h-16 mx-auto bg-red-600/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Heart className="w-8 h-8 text-red-500" />
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-white">La tua lista è vuota</h2>
                  <p className="text-white/60 text-base leading-relaxed">
                    Aggiungi film e serie TV per creare la tua collezione personale
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
                  <Plus className="w-4 h-4" />
                  <span>Usa il pulsante &quot;+&quot; per aggiungere contenuti</span>
                </div>
              </div>
            </div>
          ) : (
            /* List content - modern grid */
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <p className="text-white/60 text-sm">
                  {myList.length} {myList.length === 1 ? 'elemento' : 'elementi'}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
                {myList.map((item) => {
                  const title = item.title || item.name || 'Titolo non disponibile';
                  const year = item.release_date || item.first_air_date
                    ? new Date(item.release_date || item.first_air_date!).getFullYear()
                    : '';
                  const detailsUrl = item.type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;

                  return (
                    <div key={`${item.type}-${item.id}`} className="group cursor-pointer">
                      {/* Poster Container */}
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-900/50 backdrop-blur-sm border border-white/5 group-hover:border-white/20 transition-all duration-300">
                        <Image
                          src={getImageUrl(item.poster_path, 'w342')}
                          alt={title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Action buttons - minimalist */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="flex gap-2">
                            <Link href={detailsUrl}>
                              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200">
                                <Play className="h-4 w-4 text-white ml-0.5" fill="white" />
                              </div>
                            </Link>
                            <button
                              onClick={() => handleRemove(item.id, item.type)}
                              className="w-10 h-10 bg-red-500/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-red-500/30 transition-colors duration-200"
                              title="Rimuovi dalla lista"
                            >
                              <Trash2 className="h-4 w-4 text-white" />
                            </button>
                          </div>
                        </div>

                        {/* Type badge */}
                        <div className="absolute top-2 left-2">
                          <div className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white/80 font-medium">
                            {item.type === 'movie' ? 'Film' : 'TV'}
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="absolute top-2 right-2">
                          <div className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white/80 font-medium flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            {item.vote_average.toFixed(1)}
                          </div>
                        </div>
                      </div>

                      {/* Info section - minimal */}
                      <div className="mt-3 px-1">
                        <Link href={detailsUrl}>
                          <h3 className="text-white text-sm font-medium line-clamp-2 leading-tight group-hover:text-white/80 transition-colors duration-200">
                            {title}
                          </h3>
                        </Link>
                        {year && (
                          <p className="text-white/40 text-xs mt-1 font-normal">
                            {year}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}