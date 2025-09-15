'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    // Update CSS variable immediately when banner is dismissed
    document.documentElement.style.setProperty('--banner-height', '0px');
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-2 px-3 fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        {/* Desktop version */}
        <div className="hidden sm:flex items-center justify-center text-center w-full">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">📢</span>
            <span>
              Unisciti al nostro canale Telegram per news e aggiornamenti!
            </span>
            <a
              href="https://t.me/nexplayita"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-slate-800 px-3 py-1 rounded-full text-xs font-semibold hover:bg-gray-100 transition-colors ml-2"
            >
              Unisciti ora
            </a>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 p-1 h-auto text-white hover:bg-white/20"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile version - compact */}
        <div className="sm:hidden flex items-center justify-between w-full text-xs">
          <span className="text-white/90">📢 Entra nel canale per news</span>
          <div className="flex items-center gap-2">
            <a
              href="https://t.me/nexplayita"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-slate-800 px-2 py-1 rounded-full text-xs font-semibold hover:bg-gray-100 transition-colors"
            >
              Unisciti
            </a>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-auto text-white hover:bg-white/20"
              onClick={handleDismiss}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}