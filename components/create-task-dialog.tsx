'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Phone, MessageCircle, Send } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl' // Import hinzufügen

export function ProfileForm({ user, initialData }: { user: any, initialData: any }) {
  const t = useTranslations('Settings') // Hook nutzen
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    // ... (onSubmit Logik bleibt gleich) ...
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    // ... Supabase Update ...
    const { error } = await supabase.from('profiles').upsert({
         id: user.id,
         phone: formData.get('phone'),
         whatsapp: formData.get('whatsapp'),
         telegram: formData.get('telegram'),
         emergency_notes: formData.get('emergency_notes'),
         updated_at: new Date().toISOString(),
    })
    // ...
    if (error) toast.error('Error')
    else {
        toast.success(t('saved_success')) // Auch Toast übersetzen
        router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      
      <div className="space-y-2">
        <Label htmlFor="phone">{t('label_phone')}</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            id="phone" 
            name="phone" 
            placeholder={t('placeholder_phone')} 
            defaultValue={initialData?.phone || ''} 
            className="pl-9" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsapp">{t('label_whatsapp')}</Label>
        <div className="relative">
          <MessageCircle className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            id="whatsapp" 
            name="whatsapp" 
            placeholder={t('placeholder_phone')} 
            defaultValue={initialData?.whatsapp || ''} 
            className="pl-9" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="telegram">{t('label_telegram')}</Label>
        <div className="relative">
          <Send className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            id="telegram" 
            name="telegram" 
            placeholder={t('placeholder_telegram')} 
            defaultValue={initialData?.telegram || ''} 
            className="pl-9" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="emergency_notes">{t('label_notes')}</Label>
        <Textarea 
          id="emergency_notes" 
          name="emergency_notes" 
          placeholder={t('placeholder_notes')} 
          defaultValue={initialData?.emergency_notes || ''} 
          className="min-h-[100px]"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? t('save_button') + '...' : t('save_button')}
      </Button>
    </form>
  )
}
