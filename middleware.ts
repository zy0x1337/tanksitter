// middleware.ts
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

// 1. next-intl Middleware vorbereiten
const intlMiddleware = createIntlMiddleware({
  locales: ['de', 'en'],
  defaultLocale: 'de'
});

// 2. Eigene Wrapper-Middleware
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Manifest, Icons, Favicon & statische Dateien nicht anfassen
  if (
    pathname === '/manifest.json' ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/icons/') ||
    pathname.startsWith('/_next/') ||
    pathname.match(/.*\.[a-zA-Z0-9]+$/)
  ) {
    return;
  }

  return intlMiddleware(req);
}

// 3. Matcher
export const config = {
  matcher: ['/((?!_next|icons|manifest\\.json|favicon\\.ico|.*\\..*).*)'],
};
