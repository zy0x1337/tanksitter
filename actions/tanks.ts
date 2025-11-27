'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// 1. Neuen Tank erstellen
export async function createTank(formData: FormData) {
  const supabase = await createClient()
  
  // User ID holen
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Nicht eingeloggt')

  const name = formData.get('name') as string
  
  if (!name) return

  const { error } = await supabase
    .from('tanks')
    .insert({
      name,
      user_id: user.id,
      // share_token wird von der DB automatisch generiert (default: gen_random_uuid())
    })

  if (error) {
    console.error('Error creating tank:', error)
    return { error: 'Fehler beim Erstellen' }
  }

  revalidatePath('/dashboard') // Cache leeren, damit das neue Becken sofort erscheint
  return { success: true }
}

// 2. Tank löschen
export async function deleteTank(tankId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('tanks')
    .delete()
    .eq('id', tankId)

  if (error) {
    console.error('Error deleting tank:', error)
    return { error: 'Fehler beim Löschen' }
  }

  revalidatePath('/dashboard')
}
