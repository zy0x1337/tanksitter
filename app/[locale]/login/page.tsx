'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function getBaseUrl() {
  // Primär: explizit gesetzte URL (Prod: https://tanksitter.vercel.app, lokal: http://localhost:3000)
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (envUrl) return envUrl.replace(/\/$/, '')

  // Fallback: aktueller Origin im Browser
  if (typeof window !== 'undefined') return window.location.origin

  // Letzter Fallback
  return 'https://tanksitter.vercel.app'
}

export default function LoginPage() {
  const t = useTranslations('Login')
  const locale = useLocale()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const baseUrl = getBaseUrl()
    const redirectTo = `${baseUrl}/${locale}/auth/callback`

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Wichtig: Locale-aware Callback, sonst landest du auf /auth/callback und nicht auf /de/auth/callback
        emailRedirectTo: redirectTo,
      },
    })

    if (error) {
      alert('Fehler: ' + error.message)
    } else {
      alert('Check deine E-Mail für den Magic Link!')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TankSitter</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder={t('email_placeholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            inputMode="email"
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('button_sending') : t('button_send')}
          </Button>
        </form>

        <p className="text-xs text-gray-500 text-center">
          {t('magic_link_hint')}
        </p>
      </div>
    </div>
  )
}
