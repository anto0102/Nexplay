import { Navbar } from '@/components/navbar';
import { TVContentClient } from '@/components/tv-content-client';

export default function TVPage() {
  return (
    <main className="bg-black">
      <Navbar />
      <TVContentClient />
    </main>
  );
}