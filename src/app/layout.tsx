import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { siteSettings } from '@/lib/data/content';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ImmersiveBackground } from '@/components/ui/ImmersiveBackground';
import { AiChat } from '@/components/ai/AiChat';
import { ExperienceProvider } from '@/components/experience/ExperienceContext';
import { ExperienceControlCenter } from '@/components/experience/ExperienceControlCenter';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: siteSettings.studioName,
    template: `%s — ${siteSettings.studioName}`,
  },
  description: siteSettings.description,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-text-primary">
        <ExperienceProvider>
          <ImmersiveBackground />
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
          <AiChat />
          <ExperienceControlCenter />
        </ExperienceProvider>
      </body>
    </html>
  );
}
