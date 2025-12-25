'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDropzone } from 'react-dropzone'
import { 
    Loader2, 
    Plus, 
    UploadCloud, 
    Image as ImageIcon,
    X,
    Fish, 
    Droplets, 
    TestTube, 
    FlaskConical, 
    Snowflake, 
    Scissors, 
    Wind, 
    Filter 
} from 'lucide-react'
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
  
  // Formular State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [frequency, setFrequency] = useState('daily')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Drag & Drop Logic
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      const file = acceptedFiles[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, 
    accept: { 'image/*': [] }, 
    maxFiles: 1, 
    multiple: false
  })

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation() // Verhindert Klick auf Dropzone
    setImageFile(null)
    setImagePreview(null)
  }

  // Expert Presets Definition
  const presets = [
    { id: 'feed_dry', icon: Fish, freq: 'daily', color: 'text-orange-500' },
    { id: 'feed_frozen', icon: Snowflake, freq: 'daily', color: 'text-blue-400' },
    { id: 'fertilizer', icon: FlaskConical, freq: 'daily', color: 'text-green-500' },
    { id: 'co2_check', icon: Wind, freq: 'daily', color: 'text-emerald-500' },
    { id: 'water_change', icon: Droplets, freq: 'weekly', color: 'text-blue-600' },
    { id: 'filter_clean', icon: Filter, freq: 'weekly', color: 'text-slate-600' },
    { id: 'test_params', icon: TestTube, freq: 'weekly', color: 'text-purple-500' },
    { id: 'trim_plants', icon: Scissors, freq: 'weekly', color: 'text-lime-600' },
  ]

  const applyPreset = (preset: typeof presets[0]) => {
    setTitle(tPresets(preset.id as any))
    setDescription(tPresets(`desc_${preset.id}` as any))
    setFrequency(preset.freq)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    let image_path = null
    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${ext}`
      const filePath = `${tankId}/${fileName}`
      
      const { error: uploadError } = await supabase.storage.from('task-images').upload(filePath, imageFile)
      if (uploadError) {
        toast.error('Image upload failed: ' + uploadError.message)
        setLoading(false)
        return
      }
      image_path = filePath
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
      toast.success(t('add_task_title') + ' added!') 
      if (onSuccess) onSuccess()
      else {
          router.refresh()
          setTitle('')
          setDescription('')
          setFrequency('daily')
          setImagePreview(null)
          setImageFile(null)
      }
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
        
        {/* PRESETS GRID */}
        <div>
            <Label className="text-[10px] uppercase text-muted-foreground font-bold mb-3 block tracking-wider">
                {tPresets('title')}
            </Label>
            <div className="grid grid-cols-4 gap-2">
                {presets.map((p) => (
                    <button
                        key={p.id}
                        type="button"
                        onClick={() => applyPreset(p)}
                        className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-border/50 bg-secondary/10 hover:bg-secondary/40 hover:border-blue-300/50 hover:shadow-sm transition-all text-center gap-1.5 group h-[70px]"
                        title={tPresets(p.id as any)}
                    >
                        <p.icon className={`w-5 h-5 ${p.color} opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all`} />
                        <span className="text-[9px] font-medium leading-tight w-full truncate px-1 text-muted-foreground group-hover:text-foreground">
                            {tPresets(p.id as any)}
                        </span>
                    </button>
                ))}
            </div>
        </div>

        <div className="h-px bg-border/50 w-full" />

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
                <Label htmlFor="description">Details</Label>
                <Textarea 
                    id="description" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Only half a spoon..." 
                    className="resize-none min-h-[80px]"
                />
            </div>

            <div className="space-y-2">
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
                
                {/* DRAG AND DROP ZONE */}
                <div 
                  {...getRootProps()} 
                  className={`
                    relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer min-h-[160px] text-center
                    ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]' : 'border-border bg-secondary/20 hover:bg-secondary/40 hover:border-muted-foreground'}
                    ${imagePreview ? 'border-none p-0 overflow-hidden bg-black' : ''}
                  `}
                >
                  <input {...getInputProps()} />
                  
                  {imagePreview ? (
                    <div className="relative w-full h-48 group">
                      <Image 
                        src={imagePreview} 
                        alt="Preview" 
                        fill 
                        className="object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <Button type="button" variant="destructive" size="icon" className="rounded-full" onClick={removeImage}>
                            <X className="w-5 h-5" />
                         </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 pointer-events-none">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto transition-colors ${isDragActive ? 'bg-blue-100 text-blue-600' : 'bg-background text-muted-foreground shadow-sm'}`}>
                        {isDragActive ? <UploadCloud className="w-6 h-6 animate-bounce" /> : <ImageIcon className="w-6 h-6" />}
                      </div>
                      <div>
                         <p className="text-sm font-bold text-foreground">{isDragActive ? "Drop image here!" : t('upload_hint')}</p>
                         <p className="text-[10px] text-muted-foreground mt-1">PNG, JPG, WEBP (max. 5MB)</p>
                      </div>
                    </div>
                  )}
                </div>
            </div>

            <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-blue-500/10 mt-4" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {t('save_button')}
            </Button>
        </form>
    </div>
  )
}
