import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest, response: NextResponse) {
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
          // Cookies im Request für diesen Render-Cycle setzen
          cookiesToSet.forEach(({ name, value }) => 
            request.cookies.set(name, value)
          )
          
          // Cookies auf die Response anwenden
          cookiesToSet.forEach(({ name, value, options }) => 
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // User sicher abrufen
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // --- Redirect Logik ---

  // 1. Geschützte Routen (Dashboard) -> Login, wenn kein User
  if (pathname.includes('/dashboard') && !user) {
    const locale = pathname.split('/')[1] || 'en'
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/login`
    return NextResponse.redirect(url)
  }

  // 2. Auth Routen (Login) -> Dashboard, wenn User eingeloggt
  if (pathname.includes('/login') && user) {
    const locale = pathname.split('/')[1] || 'en'
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/dashboard`
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
