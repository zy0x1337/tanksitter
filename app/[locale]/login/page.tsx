'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MailCheck, Loader2 } from 'lucide-react'

// Base-URL Helper
function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (envUrl) return envUrl.replace(/\/$/, '')
  if (typeof window !== 'undefined') return window.location.origin
  return 'https://tanksitter.vercel.app'
}

export default function LoginPage() {
  const t = useTranslations('Login')
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const baseUrl = getBaseUrl()
    const redirectTo = `${baseUrl}/${locale}/auth/callback`

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    })

    setLoading(false)

    if (error) {
      alert('Error: ' + error.message) // Einfaches Error-Handling ist ok
    } else {
      setSuccess(true)
    }
  }

  // Success-State (Jetzt übersetzt!)
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
            <MailCheck className="w-8 h-8" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900">
            {t('success_title')}
          </h2>
          
          <p className="text-slate-600 leading-relaxed">
            {t.rich('success_message', {
              email: email,
              strong: (chunks) => <strong className="font-semibold text-slate-900">{chunks}</strong>,
              br: () => <br />
            })}
          </p>

          <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-500 border border-slate-100">
            <p>{t('spam_hint')}</p>
          </div>

          <Button 
            variant="outline" 
            onClick={() => setSuccess(false)}
            className="w-full mt-4"
          >
            {t('back_button')}
          </Button>
        </div>
      </div>
    )
  }

  // Normales Formular
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">TankSitter</h1>
          <p className="text-slate-500">{t('subtitle')}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder={t('email_placeholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="h-12 text-lg"
          />
          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-medium bg-blue-600 hover:bg-blue-700 transition-all" 
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> {t('button_sending')}
              </span>
            ) : (
              t('button_send')
            )}
          </Button>
        </form>

        <p className="text-xs text-slate-400 text-center px-4">
          {t('magic_link_hint')}
        </p>
      </div>
    </div>
  )
}
