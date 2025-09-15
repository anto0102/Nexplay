'use client';

import { Play, Users, Film, Tv, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AboutSection() {
  return (
    <section className="bg-black py-16">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Chi siamo
          </h2>
          <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            NexPlay è la tua piattaforma di streaming definitiva che ti offre accesso illimitato
            a migliaia di film e serie TV. Un'esperienza di intrattenimento senza confini.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6">
            <div className="mb-4">
              <Users className="h-12 w-12 text-red-600 mx-auto" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">14K+</div>
            <div className="text-white/60 text-sm md:text-base">Contenuti totali</div>
          </div>

          <div className="text-center p-6">
            <div className="mb-4">
              <Film className="h-12 w-12 text-red-600 mx-auto" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">9K</div>
            <div className="text-white/60 text-sm md:text-base">Film disponibili</div>
          </div>

          <div className="text-center p-6">
            <div className="mb-4">
              <Tv className="h-12 w-12 text-red-600 mx-auto" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">6K</div>
            <div className="text-white/60 text-sm md:text-base">Serie TV</div>
          </div>

          <div className="text-center p-6">
            <div className="mb-4">
              <Play className="h-12 w-12 text-red-600 mx-auto" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
            <div className="text-white/60 text-sm md:text-base">Streaming</div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Perché scegliere NexPlay?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Catalogo sempre aggiornato</h4>
                  <p className="text-white/70">Le ultime novità di film e serie TV sempre disponibili</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Qualità HD garantita</h4>
                  <p className="text-white/70">Streaming in alta definizione per un'esperienza ottimale</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-3 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Interfaccia intuitiva</h4>
                  <p className="text-white/70">Design moderno e facilità di navigazione per tutti</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-600 rounded-lg">
                <Play className="h-8 w-8 text-white" />
              </div>
              <span className="text-3xl font-bold text-white">NexPlay</span>
            </div>
            <p className="text-white/70 text-lg leading-relaxed mb-6">
              La nostra missione è semplice: portarti il meglio dell'intrattenimento
              mondiale in un'unica piattaforma, con la qualità e l'affidabilità che meriti.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center p-8 border border-white/10 rounded-lg">
          <MessageCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h4 className="text-xl md:text-2xl font-bold text-white mb-4">
            Unisciti alla community NexPlay
          </h4>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Resta sempre aggiornato sui nuovi contenuti, ricevi anteprime esclusive
            e partecipa alle discussioni con altri appassionati di cinema e serie TV.
          </p>
          <a
            href="https://t.me/nexplayita"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              <MessageCircle className="h-5 w-5 mr-2" />
              Unisciti al canale Telegram
            </Button>
          </a>
        </div>

      </div>
    </section>
  );
}