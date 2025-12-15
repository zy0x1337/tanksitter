'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function NewTankPage() {
  const t = useTranslations('Forms')
  const locale = useLocale()
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [emergency, setEmergency] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // 1. User ID holen
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        router.push(`/${locale}/login`)
        return
    }

    // 2. Tank speichern
    const { error } = await supabase
      .from('tanks')
      .insert({
        user_id: user.id,
        name,
        emergency_contact: emergency,
      })

    if (error) {
      alert('Error: ' + error.message)
      setLoading(false)
    } else {
      router.push(`/${locale}/dashboard`)
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        
        <div className="mb-6 flex items-center gap-2">
          <Link href={`/${locale}/dashboard`} className="text-slate-400 hover:text-slate-600">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold text-slate-900">{t('create_tank_title')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t('tank_name_label')}</Label>
            <Input 
              id="name" 
              placeholder={t('tank_name_placeholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12 text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergency">{t('emergency_label')}</Label>
            <Input 
              id="emergency" 
              placeholder={t('emergency_placeholder')}
              value={emergency}
              onChange={(e) => setEmergency(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="pt-4 flex gap-3">
             <Link href={`/${locale}/dashboard`} className="flex-1">
                <Button type="button" variant="outline" className="w-full h-12">
                  {t('cancel')}
                </Button>
             </Link>
            <Button type="submit" disabled={loading} className="flex-1 h-12 bg-blue-600 hover:bg-blue-700">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('saving')}
                </>
              ) : (
                t('save_button')
              )}
            </Button>
          </div>
        </form>

      </div>
    </div>
  )
}
