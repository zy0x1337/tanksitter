'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2, Mail, Fish, Sparkles } from 'lucide-react'
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] -z-20 mask-image-gradient" />
        
        <div className="max-w-md w-full bg-card/60 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-border/50 text-center animate-in zoom-in-95 duration-500 relative z-10">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50 dark:ring-green-900/10">
            <Mail className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">{t('success_title')}</h2>
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            {t('success_msg_1')} <span className="font-bold text-foreground block mt-1">{email}</span> 
            <span className="text-sm mt-2 block">{t('success_msg_3')}</span>
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 p-4 rounded-xl text-sm text-blue-700 dark:text-blue-300 mb-8 flex items-center gap-3 text-left">
            <Sparkles className="w-5 h-5 shrink-0" />
            {t('spam_hint')}
          </div>

          <Button 
            variant="ghost" 
            onClick={() => setIsSent(false)}
            className="w-full h-12 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          >
            {t('back_button')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] -z-20 mask-image-gradient" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link href={`/${locale}`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors px-2 group">
          <div className="w-8 h-8 rounded-full bg-secondary/50 group-hover:bg-secondary flex items-center justify-center mr-3 transition-colors">
             <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-medium">{t('back_button')}</span>
        </Link>

        <div className="bg-card/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-white/20 dark:border-white/5 p-8 md:p-12 relative overflow-hidden">
          {/* Top Gradient Border Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 opacity-50" />
          
          <div className="flex flex-col items-center text-center mb-10">
            {/* Logo Icon */}
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-cyan-500 text-white rounded-3xl shadow-lg shadow-blue-500/30 flex items-center justify-center mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
               <Fish className="w-10 h-10" strokeWidth={2} />
            </div>
            
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{t('title')}</h1>
            <p className="text-muted-foreground mt-3 text-base">{t('subtitle')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 relative group">
              <Label htmlFor="email" className="sr-only">Email</Label>
              <div className="absolute left-4 top-3.5 text-muted-foreground group-focus-within:text-blue-500 transition-colors">
                  <Mail className="w-5 h-5" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder={t('email_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-12 bg-secondary/30 border-transparent focus:bg-background focus:border-blue-500/50 text-lg pl-12 rounded-xl transition-all shadow-inner"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300"
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

          <p className="text-xs text-center text-muted-foreground mt-8 px-4 leading-relaxed opacity-70">
            {t('magic_link_hint')}
          </p>
        </div>
      </div>
    </div>
  )
}
