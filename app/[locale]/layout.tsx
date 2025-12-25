import { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "../globals.css";

// 1. Schriftart laden
const inter = Inter({ subsets: ['latin'] });

// 2. Viewport Konfiguration
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" }, // Stone 950 für Darkmode
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// 3. Metadaten inkl. PWA Einstellungen
export const metadata: Metadata = {
  title: {
    template: '%s | TankSitter',
    default: 'TankSitter',
  },
  description: 'Erstelle kostenlose, visuelle Pflegepläne für deinen Aquariums-Sitter. Verhindere Überfütterung und Unfälle. Kein Login für den Sitter nötig.',
  manifest: "/manifest.json",
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
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <NextIntlClientProvider messages={messages}>
              
              {children}
              
              <Toaster position="top-center" richColors />

            </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
