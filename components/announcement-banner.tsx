'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated and check sessionStorage
    setIsHydrated(true);
    const dismissed = sessionStorage.getItem('banner-dismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
      setIsDismissed(true);
    }
  }, []);

  useEffect(() => {
    // Set CSS variable for banner height only after hydration
    if (!isHydrated) return;

    const updateBannerHeight = () => {
      if (isVisible && !isDismissed) {
        document.documentElement.style.setProperty('--banner-height', '48px');
      } else {
        document.documentElement.style.setProperty('--banner-height', '0px');
      }
    };

    updateBannerHeight();

    return () => {
      if (isDismissed) {
        document.documentElement.style.setProperty('--banner-height', '0px');
      }
    };
  }, [isVisible, isDismissed, isHydrated]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('banner-dismissed', 'true');
    // Force layout recalculation
    document.documentElement.style.setProperty('--banner-height', '0px');
  };

  // Check sessionStorage on client side only
  if (typeof window !== 'undefined') {
    const dismissed = sessionStorage.getItem('banner-dismissed');
    if (dismissed === 'true') {
      return null;
    }
  }

  // Don't render close button until hydrated
  if (!isHydrated) {
    return (
      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white py-3 px-4 fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div className="container mx-auto flex items-center justify-center text-center">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <span className="font-medium">📢</span>
              <span>
                Unisciti al nostro canale Telegram per news e aggiornamenti!
              </span>
            </div>
            <a
              href="https://t.me/nexplayita"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-red-600 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold hover:bg-red-50 transition-colors"
            >
              Unisciti ora
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!isVisible || isDismissed) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-500 text-white py-3 px-4 fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="container mx-auto flex items-center justify-center text-center">
        <div className="flex flex-col sm:flex-row items-center gap-2 text-sm sm:text-base">
          <div className="flex items-center gap-2">
            <span className="font-medium">📢</span>
            <span>
              Unisciti al nostro canale Telegram per news e aggiornamenti!
            </span>
          </div>
          <a
            href="https://t.me/nexplayita"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-red-600 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold hover:bg-red-50 transition-colors"
          >
            Unisciti ora
          </a>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto text-white hover:bg-white/20"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}