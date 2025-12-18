import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // WICHTIG: Wir setzen die Cookies auf der Response, 
          // die wir von next-intl bekommen haben!
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Session aktualisieren (wichtig für Server Components)
  const { data: { user } } = await supabase.auth.getUser()

  // AUTH GUARD: Schütze alles unter /dashboard
  // Wir prüfen auf den Pfad OHNE Locale-Prefix, da next-intl das manchmal schon handhabt,
  // aber sicherheitshalber prüfen wir den rohen Pfad.
  const path = request.nextUrl.pathname

  // Einfache Prüfung: Enthält der Pfad "/dashboard"?
  if (path.includes('/dashboard') && !user) {
    // Redirect zur Login-Seite, aber wir müssen die Locale beibehalten
    // Wir holen uns die Locale aus dem Pfad (z.B. /de/dashboard -> de)
    const locale = path.split('/')[1] || 'en'
    
    // Redirect URL bauen
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/login`
    return NextResponse.redirect(url)
  }

  return response
}
