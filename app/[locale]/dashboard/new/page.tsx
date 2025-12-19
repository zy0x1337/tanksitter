'use client'

import { useState, use } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

// WICHTIG: Params als Promise typisieren
export default function NewTankPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params) // use() Hook für Params
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
        share_token: crypto.randomUUID(), // Token direkt generieren
      })

    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      toast.success('Tank created!')
      router.refresh()
      router.push(`/${locale}/dashboard`) // Redirect
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
        
        {/* Deko Background (analog Login) */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
            
            {/* Back Link */}
            <Link href={`/${locale}/dashboard`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('cancel')}
            </Link>

            <div className="bg-card rounded-3xl shadow-xl shadow-black/5 border border-border p-8 md:p-10">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🐠</span>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">{t('create_tank_title')}</h1>
                    <p className="text-muted-foreground mt-2 text-sm">
                        Gib deinem Aquarium einen Namen.
                    </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground font-medium">
                            {t('tank_name_label')}
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder={t('tank_name_placeholder')}
                            required
                            disabled={loading}
                            className="h-12 bg-background border-input text-lg px-4 focus-visible:ring-blue-500"
                        />
                    </div>

                    <div className="pt-2">
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    {t('saving')}
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    {t('save_button')}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}
