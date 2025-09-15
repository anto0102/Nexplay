'use client';

import Image from 'next/image';
import { Heart, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-8">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Creator Attribution */}
          <div className="flex items-center gap-2 text-white/70">
            <span className="text-sm">Fatto con</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span className="text-sm">da</span>
            <span className="text-white font-medium">Anto</span>
          </div>

          {/* Center - Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="NexPlay"
              width={48}
              height={48}
              className="w-10 h-10 sm:w-12 sm:h-12"
            />
            <span className="text-red-600 font-bold text-xl sm:text-2xl">NEXPLAY</span>
          </div>

          {/* Telegram Channel */}
          <div className="flex items-center gap-2">
            <span className="text-white/70 text-sm">Canale ufficiale:</span>
            <a
              href="https://t.me/nexplayita"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              @nexplayita
            </a>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <p className="text-white/50 text-xs">
            © 2025 NexPlay. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
}