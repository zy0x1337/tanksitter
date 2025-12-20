'use client'

import { useState, use } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2, PlusCircle, Waves, Save } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function NewTankPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const t = useTranslations('Forms')
  const supabase = createClient()
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string

    // 1. User holen
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        toast.error('Session expired. Please login again.')
        setLoading(false)
        return
    }

    // 2. Insert
    const { error } = await supabase
      .from('tanks')
      .insert({
        name,
        user_id: user.id,
        share_token: crypto.randomUUID(),
      })

    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      toast.success('Tank created successfully!')
      router.refresh()
      router.push(`/${locale}/dashboard`)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        
        {/* PREMIUM BACKGROUNDS */}
        <div className="bg-noise pointer-events-none fixed inset-0 z-50"></div>
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] -z-20 mask-image-gradient" />
        
        {/* AMBIENT GLOWS */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 dark:bg-cyan-500/5 rounded-full blur-[120px] animate-pulse-slow" />
        </div>

        <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">
            
            {/* Back Link */}
            <div className="mb-6">
                <Link href={`/${locale}/dashboard`}>
                    <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-blue-500 transition-colors group text-muted-foreground">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        {t('cancel')}
                    </Button>
                </Link>
            </div>

            {/* Main Card */}
            <div className="bg-card/80 dark:bg-card/50 backdrop-blur-xl border border-border/50 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 overflow-hidden relative">
                
                {/* Decoration Top */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full pointer-events-none" />

                <div className="p-8 sm:p-10">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100 dark:border-blue-800 animate-float">
                             <Waves className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{t('create_tank_title')}</h1>
                        <p className="text-muted-foreground mt-2 text-sm font-medium">
                            Give your new ecosystem a name.
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-foreground font-semibold ml-1">
                                {t('tank_name_label')}
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder={t('tank_name_placeholder')}
                                required
                                disabled={loading}
                                className="h-14 bg-background/50 border-border/60 text-lg px-5 rounded-2xl focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all shadow-sm"
                            />
                        </div>

                        <div className="pt-4">
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        {t('saving')}
                                    </>
                                ) : (
                                    <>
                                        <PlusCircle className="w-5 h-5 mr-2" />
                                        {t('save_button')}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}
