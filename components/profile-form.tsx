'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client' // Dein Client-Supabase
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Phone, MessageCircle, Send } from 'lucide-react'
import { toast } from 'sonner' // oder dein Toast Provider
import { useRouter } from 'next/navigation'

export function ProfileForm({ user, initialData }: { user: any, initialData: any }) {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

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
      toast.error('Fehler beim Speichern')
    } else {
      toast.success('Profil aktualisiert')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      
      <div className="space-y-2">
        <Label htmlFor="phone">Mobilnummer (für Anrufe)</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input id="phone" name="phone" placeholder="+49 170 1234567" defaultValue={initialData?.phone || ''} className="pl-9" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsapp">WhatsApp Nummer (optional)</Label>
        <div className="relative">
          <MessageCircle className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input id="whatsapp" name="whatsapp" placeholder="+49 170 1234567" defaultValue={initialData?.whatsapp || ''} className="pl-9" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="telegram">Telegram Username (optional)</Label>
        <div className="relative">
          <Send className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input id="telegram" name="telegram" placeholder="@username" defaultValue={initialData?.telegram || ''} className="pl-9" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="emergency_notes">Zusätzliche Notfall-Infos</Label>
        <Textarea 
          id="emergency_notes" 
          name="emergency_notes" 
          placeholder="z.B. Nachbar hat Ersatzschlüssel..." 
          defaultValue={initialData?.emergency_notes || ''} 
          className="min-h-[100px]"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Speichere...' : 'Speichern'}
      </Button>
    </form>
  )
}
