import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest, response: NextResponse) {
  // Wir starten mit der Response, die wir von der Intl-Middleware erhalten haben.
  // Das ist entscheidend, damit Redirects/Rewrites von next-intl erhalten bleiben.
  let supabaseResponse = response

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // 1. Cookies im Request aktualisieren (für Server Components in diesem Render-Cycle)
          cookiesToSet.forEach(({ name, value }) => 
            request.cookies.set(name, value)
          )
          
          // 2. Cookies in der Response setzen (für den Client)
          // Wir klonen die Response nicht neu mit NextResponse.next(), 
          // weil wir sonst Header/Status der ursprünglichen 'response' verlieren könnten.
          cookiesToSet.forEach(({ name, value, options }) => 
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // WICHTIG: getUser() statt getSession() verwenden.
  // getUser validiert das Auth-Token sicher gegen die Datenbank.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // --- Protected Routes Logik ---
  
  // Prüfen, ob der User auf einer geschützten Route ist
  // Passe diesen Pfad an deine Struktur an (z.B. /dashboard)
  if (request.nextUrl.pathname.includes('/dashboard') && !user) {
    // Wenn kein User da ist, Redirect zum Login.
    // Wir müssen hier das Locale berücksichtigen, falls es im Pfad ist.
    // Einfacher Fix: Wir nehmen das erste Segment als Locale an oder fallbacken auf 'en'.
    const locale = request.nextUrl.pathname.split('/')[1] || 'en'
    
    // Wir erstellen eine NEUE Redirect-Response, da der Zugriff verweigert wird.
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/login`
    return NextResponse.redirect(url)
  }

  // --- Auth Pages Logik (Optional) ---

  // Wenn User eingeloggt ist und auf Login/Register zugreift, weiterleiten zum Dashboard
  if ((request.nextUrl.pathname.includes('/login') || request.nextUrl.pathname.includes('/register')) && user) {
    const locale = request.nextUrl.pathname.split('/')[1] || 'en'
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/dashboard`
    return NextResponse.redirect(url)
  }

  // Gib die ursprüngliche (ggf. modifizierte) Response zurück
  return supabaseResponse
}
