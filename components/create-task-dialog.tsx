'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Plus, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface TaskFormProps {
  tankId: string
  onSuccess?: () => void // Optional callback if used in dialog
}

export function TaskForm({ tankId, onSuccess }: TaskFormProps) {
  const t = useTranslations('Forms')
  const supabase = createClient()
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  // Image Preview Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    setFile(selected)
    const objectUrl = URL.createObjectURL(selected)
    setPreview(objectUrl)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const frequency_type = formData.get('frequency_type') as string
    
    let image_path = null

    // 1. Image Upload
    if (file) {
      const ext = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('task-images')
        .upload(fileName, file)

      if (uploadError) {
        toast.error('Image upload failed')
        setLoading(false)
        return
      }
      image_path = fileName
    } else {
        // Zwingend ein Bild verlangen?
        toast.error('Please upload a photo')
        setLoading(false)
        return
    }

    // 2. Insert Task
    const { error } = await supabase
      .from('tasks')
      .insert({
        tank_id: tankId,
        title,
        frequency_type,
        image_path
      })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Task added!')
      if (onSuccess) {
          onSuccess()
      } else {
          router.refresh()
          // Reset form manually or redirect
          setPreview(null)
          setFile(null)
          e.currentTarget.reset()
      }
    }
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
        
        {/* Title Input */}
        <div className="space-y-2">
            <Label htmlFor="title">{t('task_title_label')}</Label>
            <Input 
                id="title" 
                name="title" 
                placeholder={t('task_title_placeholder')} 
                required 
                className="bg-background border-input"
            />
        </div>

        {/* Frequency Select */}
        <div className="space-y-2 relative z-20"> 
            {/* z-20 hilft oft bei Überlappung */}
            <Label htmlFor="frequency_type">{t('frequency_label')}</Label>
            <Select name="frequency_type" defaultValue="daily" required>
                <SelectTrigger className="w-full bg-background border-input">
                    <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="daily">{t('freq_daily')}</SelectItem>
                    <SelectItem value="weekly">{t('freq_weekly')}</SelectItem>
                    <SelectItem value="once">{t('freq_once')}</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {/* Image Upload Area */}
        <div className="space-y-2 relative z-10 pt-2">
            <Label>{t('image_label')}</Label>
            
            <div className={`
                border-2 border-dashed rounded-xl p-4 transition-colors text-center cursor-pointer relative overflow-hidden group
                ${preview ? 'border-blue-500 bg-blue-50/50' : 'border-border hover:border-blue-400 hover:bg-secondary/50'}
            `}>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {preview ? (
                    <div className="relative h-48 w-full rounded-lg overflow-hidden">
                        <Image src={preview} alt="Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white font-medium text-sm">Change Photo</p>
                        </div>
                    </div>
                ) : (
                    <div className="py-8 text-muted-foreground flex flex-col items-center gap-2">
                        <div className="p-3 bg-secondary rounded-full">
                            <Upload className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium">{t('upload_hint')}</span>
                        <span className="text-xs opacity-50">JPG, PNG, WEBP</span>
                    </div>
                )}
            </div>
        </div>

        <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={loading}>
            {loading ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('saving')}
                </>
            ) : (
                <>
                    <Plus className="w-5 h-5 mr-2" />
                    {t('save_button')}
                </>
            )}
        </Button>
    </form>
  )
}
