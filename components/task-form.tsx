'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Plus, Upload } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface TaskFormProps {
  tankId: string
  onSuccess?: () => void 
}

export function TaskForm({ tankId, onSuccess }: TaskFormProps) {
  const t = useTranslations('Forms')
  const supabase = createClient()
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const frequency_type = formData.get('frequency_type') as string
    
    let image_path = null

    if (file) {
      const ext = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${ext}`
      const { error: uploadError } = await supabase.storage.from('task-images').upload(fileName, file)
      if (uploadError) {
        toast.error('Image upload failed')
        setLoading(false)
        return
      }
      image_path = fileName
    } else {
        // Fallback: Kein Bild (oder Fehler werfen, wenn Pflicht)
        // toast.error('Please upload a photo')
        // setLoading(false)
        // return
    }

    const { error } = await supabase.from('tasks').insert({
        tank_id: tankId,
        title,
        frequency_type,
        image_path
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Task added!')
      if (onSuccess) onSuccess()
      else router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="title">{t('task_title_label')}</Label>
            <Input id="title" name="title" placeholder={t('task_title_placeholder')} required />
        </div>

        <div className="space-y-2 relative z-50">
            <Label htmlFor="frequency_type">{t('frequency_label')}</Label>
            <Select name="frequency_type" defaultValue="daily" required>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="daily">{t('freq_daily')}</SelectItem>
                    <SelectItem value="weekly">{t('freq_weekly')}</SelectItem>
                    <SelectItem value="once">{t('freq_once')}</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div className="space-y-2">
            <Label>{t('image_label')}</Label>
            <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer relative overflow-hidden h-40 flex items-center justify-center ${preview ? 'border-solid border-blue-500 p-0' : 'hover:bg-accent'}`}>
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                {preview ? (
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                ) : (
                    <div className="text-muted-foreground flex flex-col items-center">
                        <Upload className="w-6 h-6 mb-2" />
                        <span className="text-xs">{t('upload_hint')}</span>
                    </div>
                )}
            </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            {t('save_button')}
        </Button>
    </form>
  )
}
