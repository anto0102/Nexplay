import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MyListProvider } from "@/contexts/my-list-context";
import LoadingBar from "@/components/loading-bar";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { Footer } from "@/components/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexPlay - Film e Serie TV in Streaming",
  description: "Guarda migliaia di film e serie TV in streaming. Scopri i contenuti più popolari e le ultime novità su NexPlay.",
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.documentElement.style.setProperty('--banner-height', '40px');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MyListProvider>
          <LoadingBar />
          <AnnouncementBanner />
          {children}
          <Footer />
        </MyListProvider>
      </body>
    </html>
  );
}
