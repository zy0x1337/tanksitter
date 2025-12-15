import { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Toaster } from "@/components/ui/sonner";
import "../globals.css";

// 1. Schriftart laden
const inter = Inter({ subsets: ['latin'] });

// 2. Viewport Konfiguration (Wichtig für PWA "App-Feeling")
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Verhindert Zoomen auf Mobile (wirkt wie native App)
};

// 3. Metadaten inkl. PWA Einstellungen
export const metadata: Metadata = {
  title: {
    template: '%s | TankSitter',
    default: 'TankSitter - Der Urlaubs-Guide für dein Aquarium',
  },
  description: 'Erstelle kostenlose, visuelle Pflegepläne für deinen Aquariums-Sitter. Verhindere Überfütterung und Unfälle. Kein Login für den Sitter nötig.',
  manifest: "/manifest.json", // Verweis auf die PWA Config
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TankSitter",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'TankSitter',
    description: 'Keine toten Fische nach dem Urlaub. Erstelle einen visuellen Guide in Sekunden.',
    url: 'https://tanksitter.vercel.app', 
    siteName: 'TankSitter',
    type: 'website',
    locale: 'de_DE',
  },
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Wichtig für Next.js 15: Params awaiten
  const { locale } = await params;

  // Übersetzungen laden
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          
          {children}
          
          {/* Toaster für Notifications (Sonner) */}
          <Toaster position="top-center" richColors />

        </NextIntlClientProvider>
      </body>
    </html>
  );
}
