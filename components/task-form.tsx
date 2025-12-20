'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Plus, Upload, Fish, Droplets, TestTube, Leaf, Zap } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface TaskFormProps {
  tankId: string
  onSuccess?: () => void 
}

export function TaskForm({ tankId, onSuccess }: TaskFormProps) {
  const t = useTranslations('Forms')
  const tPresets = useTranslations('Presets')
  const supabase = createClient()
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  // State für Formularfelder, damit Presets sie füllen können
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [frequency, setFrequency] = useState('daily')

  // Preset Definitionen
  const presets = [
    { id: 'feed_fish', icon: Fish, freq: 'daily' },
    { id: 'feed_shrimp', icon: Fish, freq: 'daily' },
    { id: 'check_tech', icon: Zap, freq: 'daily' },
    { id: 'fertilizer', icon: Leaf, freq: 'weekly' },
    { id: 'water_change', icon: Droplets, freq: 'weekly' },
    { id: 'test_water', icon: TestTube, freq: 'weekly' },
  ]

  const applyPreset = (preset: typeof presets[0]) => {
    // Casting zu 'any', da TypeScript die dynamischen Keys nicht im Voraus kennt
    setTitle(tPresets(preset.id as any))
    setDescription(tPresets(`desc_${preset.id}` as any))
    setFrequency(preset.freq)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    // Image Upload
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
    }

    const { error } = await supabase.from('tasks').insert({
        tank_id: tankId,
        title,
        description,
        frequency_type: frequency,
        image_path
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Task added!')
      if (onSuccess) onSuccess()
      else {
          router.refresh()
          // Reset
          setTitle('')
          setDescription('')
          setFrequency('daily')
          setPreview(null)
          setFile(null)
      }
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
        
        {/* PRESETS SECTION */}
        <div>
            <Label className="text-xs uppercase text-muted-foreground font-bold mb-3 block tracking-wider">
                {tPresets('title')}
            </Label>
            <div className="grid grid-cols-3 gap-2">
                {presets.map((p) => (
                    <button
                        key={p.id}
                        type="button"
                        onClick={() => applyPreset(p)}
                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-secondary/20 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20 dark:hover:border-blue-800 transition-all text-center gap-2 group"
                    >
                        <p.icon className="w-5 h-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                        <span className="text-[10px] font-medium leading-tight line-clamp-1">{tPresets(p.id as any)}</span>
                    </button>
                ))}
            </div>
        </div>

        <div className="h-px bg-border w-full" />

        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">{t('task_title_label')}</Label>
                <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t('task_title_placeholder')} 
                    required 
                    className="font-medium"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea 
                    id="description" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Only half a spoon..." 
                    className="resize-none"
                    rows={2}
                />
            </div>

            <div className="space-y-2 relative z-20">
                <Label htmlFor="frequency_type">{t('frequency_label')}</Label>
                <Select value={frequency} onValueChange={setFrequency} required>
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
                <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer relative overflow-hidden h-32 flex items-center justify-center transition-colors ${preview ? 'border-solid border-blue-500 p-0' : 'hover:bg-secondary/50 border-muted-foreground/30'}`}>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                    {preview ? (
                        <div className="relative w-full h-full group">
                            <Image src={preview} alt="Preview" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-bold">Change Image</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-muted-foreground flex flex-col items-center">
                            <Upload className="w-5 h-5 mb-1" />
                            <span className="text-[10px] font-medium uppercase tracking-wide">{t('upload_hint')}</span>
                        </div>
                    )}
                </div>
            </div>

            <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-blue-500/10" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {t('save_button')}
            </Button>
        </form>
    </div>
  )
}
