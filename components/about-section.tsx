'use client';

import { Play, Users, Film, Tv, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function AboutSection() {
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Chi siamo?
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-600 rounded-lg">
                <Play className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">NexPlay</h3>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed">
              NexPlay è la tua piattaforma di streaming definitiva che ti permette di accedere
              a un vasto catalogo di contenuti di intrattenimento. Con una collezione in
              costante crescita, offriamo un'esperienza di visione senza pari.
            </p>

            <p className="text-gray-300 text-lg leading-relaxed">
              La nostra missione è portarti i migliori film e serie TV, sempre aggiornati
              con le ultime novità e i classici intramontabili che ami rivedere.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="https://t.me/nexplayita"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Unisciti al canale Telegram
                </Button>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="bg-black/40 border-red-600/20 text-center p-6">
              <CardContent className="p-0">
                <div className="p-3 bg-red-600/10 rounded-lg w-fit mx-auto mb-4">
                  <Users className="h-8 w-8 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">14K+</div>
                <div className="text-gray-400">Contenuti totali</div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-red-600/20 text-center p-6">
              <CardContent className="p-0">
                <div className="p-3 bg-red-600/10 rounded-lg w-fit mx-auto mb-4">
                  <Film className="h-8 w-8 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">9K</div>
                <div className="text-gray-400">Film disponibili</div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-red-600/20 text-center p-6">
              <CardContent className="p-0">
                <div className="p-3 bg-red-600/10 rounded-lg w-fit mx-auto mb-4">
                  <Tv className="h-8 w-8 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">6K</div>
                <div className="text-gray-400">Serie TV</div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-red-600/20 text-center p-6">
              <CardContent className="p-0">
                <div className="p-3 bg-red-600/10 rounded-lg w-fit mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-400">Aggiornamenti</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 p-6 bg-gradient-to-r from-red-600/10 to-red-500/10 rounded-lg border border-red-600/20">
          <div className="text-center">
            <h4 className="text-xl font-bold text-white mb-2">
              Resta sempre aggiornato!
            </h4>
            <p className="text-gray-300 mb-4">
              Unisciti al nostro canale Telegram per ricevere notizie sui nuovi contenuti,
              aggiornamenti della piattaforma e tutte le novità di NexPlay.
            </p>
            <a
              href="https://t.me/nexplayita"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <MessageCircle className="h-4 w-4 mr-2" />
                @nexplayita
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}