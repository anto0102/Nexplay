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
            /* Empty state */
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <Card className="bg-gray-900 border-0 p-12 max-w-md mx-auto">
                <div className="space-y-6">
                  <div className="w-20 h-20 mx-auto bg-red-600/20 rounded-full flex items-center justify-center">
                    <Heart className="w-10 h-10 text-red-500" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">La tua lista è vuota</h2>
                    <p className="text-white/70">
                      Aggiungi film e serie TV alla tua lista personale per guardarli più tardi
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-white/60">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Clicca il pulsante "+" sui contenuti per aggiungerli qui</span>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            /* List content */
            <div className="space-y-6">
              <p className="text-white/70 text-lg">
                {myList.length} {myList.length === 1 ? 'elemento' : 'elementi'} nella tua lista
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {myList.map((item) => {
                  const title = item.title || item.name || 'Titolo non disponibile';
                  const year = item.release_date || item.first_air_date
                    ? new Date(item.release_date || item.first_air_date!).getFullYear()
                    : '';
                  const detailsUrl = item.type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;

                  return (
                    <Card key={`${item.type}-${item.id}`} className="bg-gray-900 border-0 overflow-hidden group hover:scale-105 transition-transform duration-300">
                      <div className="relative aspect-[2/3]">
                        <Image
                          src={getImageUrl(item.poster_path, 'w342')}
                          alt={title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                        />

                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="flex gap-2">
                            <Link href={detailsUrl}>
                              <Button size="sm" className="bg-white text-black hover:bg-white/80">
                                <Play className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemove(item.id, item.type)}
                              title="Rimuovi dalla lista"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <Link href={detailsUrl}>
                          <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2 hover:text-white/80">
                            {title}
                          </h3>
                        </Link>

                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                            ⭐ {item.vote_average.toFixed(1)}
                          </Badge>
                          {year && <span className="text-white/60 text-xs">{year}</span>}
                        </div>

                        <Badge variant="outline" className="border-white/20 text-white text-xs">
                          {item.type === 'movie' ? 'Film' : 'Serie TV'}
                        </Badge>
                      </div>
                    </Card>
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