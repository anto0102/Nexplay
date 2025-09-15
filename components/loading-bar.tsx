'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';

export default function LoadingBar() {
  const pathname = usePathname();

  useEffect(() => {
    // Configure NProgress
    NProgress.configure({
      showSpinner: false,
      speed: 400,
      minimum: 0.08,
    });

    // Start loading on pathname change
    NProgress.start();

    // Complete loading after a short delay
    const timer = setTimeout(() => {
      NProgress.done();
    }, 100);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname]);

  // Handle page refresh and navigation
  useEffect(() => {
    const handleStart = () => NProgress.start();

    // Listen for navigation events
    window.addEventListener('beforeunload', handleStart);

    // Listen for popstate (back/forward buttons)
    window.addEventListener('popstate', handleStart);

    return () => {
      window.removeEventListener('beforeunload', handleStart);
      window.removeEventListener('popstate', handleStart);
    };
  }, []);

  return null;
}