'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Share, Copy, Check } from 'lucide-react';

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
}

export function ShareButton({ url, title, description }: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShare = () => {
    setShowModal(true);
  };

  return (
    <>
      <button
        onClick={handleShare}
        className="w-12 h-12 rounded-full border-2 border-white/60 hover:border-white bg-transparent hover:bg-white/10 transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
        aria-label="Condividi"
      >
        <Share className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />

        {/* Animated ripple effect */}
        <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 ease-out" />
      </button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-black border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold mb-4">
              Condividi
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Title */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              {description && (
                <p className="text-white/70 text-sm line-clamp-2">{description}</p>
              )}
            </div>

            {/* Share URL */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/80">
                Link da condividere:
              </label>
              <div className="flex items-center gap-2 p-3 bg-white/10 rounded-lg border border-white/20">
                <input
                  type="text"
                  value={url}
                  readOnly
                  className="flex-1 bg-transparent text-white text-sm outline-none"
                />
                <Button
                  size="sm"
                  onClick={handleCopy}
                  className={`transition-all duration-200 ${
                    copied
                      ? 'bg-green-600 hover:bg-green-600'
                      : 'bg-red-600 hover:bg-red-500'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copiato!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copia
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Social sharing info */}
            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white/60 text-sm">
                💡 Incolla questo link su Telegram, WhatsApp o altri social per condividere con anteprima automatica!
              </p>
            </div>

            {/* Close button */}
            <Button
              onClick={() => setShowModal(false)}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              Chiudi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}