import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const handleI18n = createMiddleware({
  locales: ['de', 'en', 'es'],
  defaultLocale: 'de'
});

export async function proxy(request: NextRequest) {
  // 1. Führe i18n Routing aus
  // Wir müssen die Response hier speichern, um Cookies darauf zu setzen
  const response = handleI18n(request);

  // 2. Initialisiere Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Hier setzen wir die Cookies auf dem Request UND der Response
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set({
              name,
              value,
              ...options,
            });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          });
        },
      },
    }
  );

  // 3. Session Refresh (wichtig für Middleware auth checks)
  // Hinweis: Das Ergebnis wird hier nicht verwendet, aber der Call
  // aktualisiert die Cookies, falls das Token erneuert werden muss.
  await supabase.auth.getSession();

  return response;
}

export const config = {
  matcher: [
    // Matcht alle Pfade außer interne Next.js Dateien und statische Assets
    '/((?!api|_next|.*\\..*).*)',
  ]
};
