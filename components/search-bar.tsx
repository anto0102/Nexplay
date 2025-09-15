'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { searchMulti, getImageUrl } from '@/lib/tmdb';
import type { SearchResultItem } from '@/lib/types';

interface SearchBarProps {
  className?: string;
}


export function SearchBar({ className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const searchResults = await searchMulti(query);
        console.log('Search results:', searchResults);

        // Check if we have valid results
        if (searchResults && searchResults.results && Array.isArray(searchResults.results)) {
          // Filter out people and limit to 8 results
          const filteredResults = searchResults.results
            .filter((item) => item.media_type !== 'person')
            .slice(0, 8);
          console.log('Filtered results:', filteredResults);
          setResults(filteredResults);
          setShowResults(true);
          console.log('showResults set to true');
        } else {
          console.warn('Invalid search results format:', searchResults);
          setResults([]);
          setShowResults(false);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setShowResults(false);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
      setQuery('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleResultClick = (result: SearchResultItem) => {
    const url = result.media_type === 'movie' ? `/movie/${result.id}` : `/tv/${result.id}`;
    router.push(url);
    setShowResults(false);
    setQuery('');
  };

  const getTitle = (result: SearchResultItem) => {
    return result.title || result.name || 'Senza titolo';
  };

  const getYear = (result: SearchResultItem) => {
    const date = result.release_date || result.first_air_date;
    return date ? new Date(date).getFullYear() : '';
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Input
          type="text"
          placeholder="Cerca film, serie TV..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          className="bg-black/50 border-white/20 text-white placeholder:text-white/60 w-full pr-20 rounded-full focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-full w-8 h-8"
              onClick={() => {
                setQuery('');
                setResults([]);
                setShowResults(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="text-white/60 hover:text-white hover:bg-white/10 rounded-full w-8 h-8"
            onClick={() => handleSearch()}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (results.length > 0 || isLoading) && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-black/90 border-white/20 backdrop-blur-xl max-h-96 overflow-y-auto z-[60]">
          {isLoading ? (
            <div className="p-4 text-center text-white/60">
              Ricerca in corso...
            </div>
          ) : (
            <div className="p-2">
              {results.map((result) => (
                <div
                  key={`${result.media_type}-${result.id}`}
                  className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex-shrink-0 w-12 h-16 rounded overflow-hidden bg-gray-800">
                    <Image
                      src={getImageUrl(result.poster_path || result.profile_path || null, 'w154')}
                      alt={getTitle(result)}
                      width={48}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold line-clamp-1">
                      {getTitle(result)}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <span className="capitalize">
                        {result.media_type === 'movie' ? 'Film' : 'Serie TV'}
                      </span>
                      {getYear(result) && (
                        <>
                          <span>•</span>
                          <span>{getYear(result)}</span>
                        </>
                      )}
                    </div>

                    {result.overview && (
                      <p className="text-xs text-white/50 line-clamp-2 mt-1">
                        {result.overview}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {query.length >= 2 && (
                <div className="border-t border-white/20 mt-2 pt-2">
                  <Button
                    variant="ghost"
                    className="w-full text-white/80 hover:text-white hover:bg-white/10 justify-start"
                    onClick={() => handleSearch()}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Visualizza tutti i risultati per &quot;{query}&quot;
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}