'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function createTask(formData: FormData) {
  const supabase = await createClient()
  
  // Authentifizierung prüfen
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const tankId = formData.get('tankId') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const frequency = formData.get('frequency') as string
  const imageFile = formData.get('image') as File

  let imagePath = null

  // 1. Bild hochladen (wenn vorhanden)
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${user.id}/${tankId}/${fileName}` // Ordnerstruktur: UserID/TankID/Bild

    const { error: uploadError } = await supabase.storage
      .from('task-images')
      .upload(filePath, imageFile)

    if (uploadError) {
      console.error('Upload error', uploadError)
      return { error: 'Bild-Upload fehlgeschlagen' }
    }
    
    imagePath = filePath
  }

  // 2. Task in DB speichern
  const { error: dbError } = await supabase
    .from('tasks')
    .insert({
      tank_id: tankId,
      title,
      description,
      frequency_type: frequency,
      image_path: imagePath
    })

  if (dbError) {
    return { error: 'Datenbank Fehler' }
  }

  revalidatePath(`/dashboard/${tankId}`)
  return { success: true }
}
