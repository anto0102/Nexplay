import { Navbar } from '@/components/navbar';
import { HomeContentClient } from '@/components/home-content-client';

export default function Home() {
  return (
    <main className="bg-black">
      <Navbar />
      <HomeContentClient />
    </main>
  );
}
