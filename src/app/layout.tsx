import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "World Football Hub | Live Scores, World Cup & Football News",
    template: "%s | World Football Hub"
  },
  description: "Get real-time live scores, match commentary, player stats, team rankings, schedules, and complete FIFA World Cup coverage at World Football Hub.",
  keywords: ["football", "soccer", "live scores", "world cup", "football news", "match commentary", "player stats", "team standings"],
  authors: [{ name: "World Football Hub Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
  openGraph: {
    title: "World Football Hub",
    description: "Premium live coverage, football news, match schedules and World Cup bracket.",
    url: "https://footballhub.asia",
    siteName: "World Football Hub",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "World Football Hub Coverage",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "World Football Hub",
    description: "Premium live coverage, football news, match schedules and World Cup bracket.",
    images: ["https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#080c14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-brand-green selection:text-background pb-16 md:pb-0">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
