'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Phone, MessageCircle, Send, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export function ProfileForm({ user, initialData }: { user: any, initialData: any }) {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Namespace laden
  const t = useTranslations('Settings')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const updates = {
      id: user.id,
      phone: formData.get('phone'),
      whatsapp: formData.get('whatsapp'),
      telegram: formData.get('telegram'),
      emergency_notes: formData.get('emergency_notes'),
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('profiles').upsert(updates)

    if (error) {
      toast.error('Error updating profile')
    } else {
      toast.success(t('saved_success'))
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      
      <div className="space-y-2">
        <Label htmlFor="phone">{t('label_phone')}</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            id="phone" 
            name="phone" 
            placeholder={t('placeholder_phone')} 
            defaultValue={initialData?.phone || ''} 
            className="pl-10 h-11 bg-background/50 border-border/60 focus:bg-background transition-colors" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsapp">{t('label_whatsapp')}</Label>
        <div className="relative">
          <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            id="whatsapp" 
            name="whatsapp" 
            placeholder={t('placeholder_whatsapp')} 
            defaultValue={initialData?.whatsapp || ''} 
            className="pl-10 h-11 bg-background/50 border-border/60 focus:bg-background transition-colors" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="telegram">{t('label_telegram')}</Label>
        <div className="relative">
          <Send className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            id="telegram" 
            name="telegram" 
            placeholder={t('placeholder_telegram')} 
            defaultValue={initialData?.telegram || ''} 
            className="pl-10 h-11 bg-background/50 border-border/60 focus:bg-background transition-colors" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="emergency_notes">{t('label_emergency_notes')}</Label>
        <Textarea 
          id="emergency_notes" 
          name="emergency_notes" 
          placeholder={t('placeholder_emergency_notes')} 
          defaultValue={initialData?.emergency_notes || ''} 
          className="min-h-[120px] bg-background/50 border-border/60 focus:bg-background transition-colors resize-none p-3"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 mt-4">
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
    </form>
  )
}
