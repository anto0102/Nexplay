import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MyListProvider } from "@/contexts/my-list-context";
import LoadingBar from "@/components/loading-bar";
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
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MyListProvider>
          <LoadingBar />
          {children}
        </MyListProvider>
      </body>
    </html>
  );
}
