import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Vixel Media | Creative Video Editing & Motion Design Agency',
  description: 'Creative That Converts. High-impact video editing, cinematic documentaries, 3D map animations, and high-retention reels engineered for brands and creators.',
  keywords: ['video editing agency', 'motion graphics', 'reels editing', '3D map animation', 'vixel media', 'youtube video editor'],
  authors: [{ name: 'Vixel Media' }],
  openGraph: {
    title: 'Vixel Media | Creative Video Editing Agency',
    description: 'We craft high-impact videos, visuals, and digital experiences for brands and creators.',
    type: 'website',
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
        <main className="flex-1 pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
