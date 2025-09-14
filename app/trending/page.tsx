import { Navbar } from '@/components/navbar';
import { TrendingContentClient } from '@/components/trending-content-client';

export default function TrendingPage() {
  return (
    <main className="bg-black">
      <Navbar />
      <TrendingContentClient />
    </main>
  );
}