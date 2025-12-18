'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2, Mail, Fish } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function LoginPage() {
  const t = useTranslations('Login')
  const locale = useLocale()
  const supabase = createClient()
  
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const origin = window.location.origin
    const redirectTo = `${origin}/${locale}/auth/callback`

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    })

    setIsLoading(false)

    if (error) {
      toast.error(error.message)
    } else {
      setIsSent(true)
      toast.success(t('success_title'))
    }
  }

  if (isSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-3xl p-8 shadow-xl border border-border text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{t('success_title')}</h2>
          <p className="text-muted-foreground mb-6">
            {t('success_msg_1')} <span className="font-bold text-foreground">{email}</span> {t('success_msg_2')}
            <br />
            {t('success_msg_3')}
          </p>
          <div className="bg-secondary/50 p-3 rounded-xl text-xs text-muted-foreground mb-6">
            {t('spam_hint')}
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsSent(false)}
            className="w-full"
          >
            {t('back_button')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Blobs (Deko) */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('back_button')}
        </Link>

        <div className="bg-card rounded-3xl shadow-2xl shadow-black/5 border border-border p-8 md:p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4">
               <Fish className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
            <p className="text-muted-foreground mt-2 text-sm">{t('subtitle')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="sr-only">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('email_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-12 bg-background border-input text-lg px-4"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t('button_sending')}
                </>
              ) : (
                t('button_send')
              )}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-6 px-4 leading-relaxed">
            {t('magic_link_hint')}
          </p>
        </div>
      </div>
    </div>
  )
}
