import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MainWrapper } from '@/components/layout/MainWrapper';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://vixelmedia.com'),
  title: {
    default: 'Vixel Media | Creative Video Editing & Motion Design Agency',
    template: '%s | Vixel Media',
  },
  description: 'Creative That Converts. High-impact video editing, cinematic documentaries, 3D map animations, and high-retention reels engineered for brands and creators.',
  keywords: ['video editing agency', 'motion graphics', 'reels editing', '3D map animation', 'vixel media', 'youtube video editor'],
  authors: [{ name: 'Vixel Media' }],
  creator: 'Vixel Media Studio',
  publisher: 'Vixel Media Studio',
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
  openGraph: {
    title: 'Vixel Media | Creative Video Editing Agency',
    description: 'We craft high-impact videos, visuals, and digital experiences for brands and creators.',
    url: 'https://vixelmedia.com',
    siteName: 'Vixel Media',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vixel Media | Creative Video Editing Agency',
    description: 'We craft high-impact videos, visuals, and digital experiences for brands and creators.',
    creator: '@vixelmedia',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col bg-[#0B0B0D] text-[#F4F4F6] selection:bg-violet-600 selection:text-white antialiased">
        <Navbar />
        <MainWrapper>
          {children}
        </MainWrapper>
        <Footer />
      </body>
    </html>
  );
}
