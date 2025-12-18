// proxy.ts
import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { updateSession } from "@/lib/supabase-middleware"; // Dein Pfad

const intlMiddleware = createMiddleware({
  locales: ["en", "de"],
  defaultLocale: "en",
  localePrefix: "always"
});

export async function proxy(request: NextRequest) {
  // 1. Erst intl-Middleware ausführen (entscheidet über Redirects/Rewrites)
  const response = intlMiddleware(request);

  // 2. Diese Response an Supabase übergeben, damit Cookies gesetzt werden können
  return await updateSession(request, response);
}

export const config = {
  matcher: [
    // Matcht alles außer statische Dateien
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
