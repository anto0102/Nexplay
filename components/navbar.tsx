'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, User, Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchBar } from '@/components/search-bar';
import { useMyList } from '@/contexts/my-list-context';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { myList } = useMyList();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/95 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Left Side - Logo + Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-red-600 font-bold text-2xl flex-shrink-0">
              NEXPLAY
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link href="/" className="text-white hover:text-white/80 transition-colors">
                Home
              </Link>
              <Link href="/movies" className="text-white hover:text-white/80 transition-colors">
                Film
              </Link>
              <Link href="/tv" className="text-white hover:text-white/80 transition-colors">
                Serie TV
              </Link>
              <Link href="/trending" className="text-white hover:text-white/80 transition-colors">
                Tendenze
              </Link>
              <Link href="/my-list" className="text-white hover:text-white/80 transition-colors relative">
                La mia lista
                {myList.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-600 hover:bg-red-600"
                  >
                    {myList.length > 99 ? '99+' : myList.length}
                  </Badge>
                )}
              </Link>
            </div>
          </div>

          {/* Center - Search Bar (Always visible on desktop) */}
          <div className="hidden md:block flex-1 max-w-md">
            <SearchBar />
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-white/80 md:hidden"
              onClick={() => {
                setIsMobileSearchOpen(!isMobileSearchOpen);
                setIsMobileMenuOpen(false);
              }}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-white/80 md:hidden"
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsMobileSearchOpen(false);
              }}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-white/80 hidden sm:flex"
            >
              <Bell className="h-5 w-5" />
            </Button>

            {/* Profile */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-white/80"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className={`md:hidden transition-all duration-300 ${
          isMobileSearchOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="bg-black/80 backdrop-blur-sm rounded-lg border border-white/20 p-4">
            <SearchBar />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-black/80 backdrop-blur-sm rounded-lg border border-white/20 p-4 space-y-4">
            {/* Mobile Links */}
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-white hover:text-white/80 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/movies"
                className="text-white hover:text-white/80 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Film
              </Link>
              <Link
                href="/tv"
                className="text-white hover:text-white/80 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Serie TV
              </Link>
              <Link
                href="/trending"
                className="text-white hover:text-white/80 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tendenze
              </Link>
              <Link
                href="/my-list"
                className="text-white hover:text-white/80 transition-colors relative flex items-center justify-between py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>La mia lista</span>
                {myList.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-600 hover:bg-red-600"
                  >
                    {myList.length > 9 ? '9+' : myList.length}
                  </Badge>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}