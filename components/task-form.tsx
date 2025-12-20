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
import { 
    Loader2, 
    Plus, 
    Upload, 
    Fish, 
    Droplets, 
    TestTube, 
    FlaskConical, // Für Dünger (Chemie Look)
    Zap, 
    Snowflake, // Für Frostfutter
    Scissors, // Für Pflanzen schneiden
    Wind, // Für CO2/Gas
    Filter // Für Filter
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
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  // State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [frequency, setFrequency] = useState('daily')

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

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
      toast.success(t('add_task_title') + ' added!') // Fallback success msg
      if (onSuccess) onSuccess()
      else {
          router.refresh()
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
                <Label htmlFor="description">Description</Label>
                <Textarea 
                    id="description" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Only half a spoon..." 
                    className="resize-none min-h-[80px]"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
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

                {/* Simplified Image Upload Button */}
                <div className="space-y-2">
                    <Label>{t('image_label')}</Label>
                    <div className="relative">
                        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 z-10 cursor-pointer w-full h-10" />
                        <Button type="button" variant="outline" className="w-full justify-start text-muted-foreground font-normal">
                             <Upload className="w-4 h-4 mr-2" />
                             {preview ? 'Image selected' : 'Upload'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Image Preview Area (Only if image selected) */}
            {preview && (
                 <div className="relative w-full h-32 rounded-xl overflow-hidden border border-border">
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                    <button 
                        type="button"
                        onClick={() => {setPreview(null); setFile(null)}}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full backdrop-blur-sm transition-colors"
                    >
                        <Upload className="w-3 h-3 rotate-45" /> {/* Makes a mock 'X' */}
                    </button>
                 </div>
            )}

            <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-blue-500/10 mt-2" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {t('save_button')}
            </Button>
        </form>
    </div>
  )
}
