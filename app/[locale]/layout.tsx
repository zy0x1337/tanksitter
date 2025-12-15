import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "../globals.css";

// 1. Schriftart laden (Sieht deutlich moderner aus als Standard-Schrift)
const inter = Inter({ subsets: ['latin'] });

// 2. Professionelle Metadaten für SEO und Link-Vorschau (Reddit/WhatsApp)
export const metadata: Metadata = {
  title: {
    template: '%s | TankSitter',
    default: 'TankSitter - Der Urlaubs-Guide für dein Aquarium',
  },
  description: 'Erstelle kostenlose, visuelle Pflegepläne für deinen Aquariums-Sitter. Verhindere Überfütterung und Unfälle. Kein Login für den Sitter nötig.',
  openGraph: {
    title: 'TankSitter',
    description: 'Keine toten Fische nach dem Urlaub. Erstelle einen visuellen Guide in Sekunden.',
    url: 'https://tanksitter.app', // Falls du später eine Domain hast, hier anpassen
    siteName: 'TankSitter',
    type: 'website',
    locale: 'de_DE',
  },
  // Hier könntest du später Icons hinzufügen, wenn du sie generiert hast
  // icons: {
  //   icon: '/favicon.ico',
  //   apple: '/apple-touch-icon.png',
  // }
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
