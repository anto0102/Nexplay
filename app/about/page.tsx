import { Navbar } from '@/components/navbar';
import { AboutSection } from '@/components/about-section';

export default function AboutPage() {
  return (
    <main className="bg-black">
      <Navbar />

      <div
        className="bg-black min-h-screen pt-10"
        style={{ marginTop: 'calc(var(--banner-height, 0px) + 80px)' }}
      >
        <AboutSection />
      </div>
    </main>
  );
}