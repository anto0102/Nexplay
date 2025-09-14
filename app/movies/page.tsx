import { Navbar } from '@/components/navbar';
import { MoviesContentClient } from '@/components/movies-content-client';

export default function MoviesPage() {
  return (
    <main className="bg-black">
      <Navbar />
      <MoviesContentClient />
    </main>
  );
}