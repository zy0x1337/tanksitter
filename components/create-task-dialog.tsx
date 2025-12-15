'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { createTask } from '@/actions/tasks'
import { Loader2, Camera, Utensils, Droplets, FlaskConical, Zap } from 'lucide-react'

// Unsere Smart Presets
const PRESETS = [
  { 
    id: 'feed', 
    label: 'Füttern', 
    icon: <Utensils className="w-4 h-4" />,
    title: 'Füttern', 
    desc: 'Bitte genau die Menge auf dem Foto beachten. Nicht mehr!',
    freq: 'daily'
  },
  { 
    id: 'water', 
    label: 'Wasserwechsel', 
    icon: <Droplets className="w-4 h-4" />,
    title: 'Wasserwechsel (30%)', 
    desc: 'Temperatur beachten! Wasseraufbereiter nicht vergessen.',
    freq: 'weekly'
  },
  { 
    id: 'fert', 
    label: 'Düngen', 
    icon: <FlaskConical className="w-4 h-4" />,
    title: 'Pflanzendünger', 
    desc: 'Nach dem Licht-Anschalten düngen.',
    freq: 'daily'
  },
  { 
    id: 'tech', 
    label: 'Technik', 
    icon: <Zap className="w-4 h-4" />,
    title: 'Technik Check', 
    desc: 'Läuft der Filter? Ist die Temperatur bei 24°C?',
    freq: 'daily'
  }
]

export function CreateTaskDialog({ tankId }: { tankId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // State für Formular-Felder, damit wir sie durch Presets füllen können
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [freq, setFreq] = useState('daily')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    formData.append('tankId', tankId)
    // Wir müssen sicherstellen, dass unsere State-Werte genutzt werden,
    // falls der User nichts geändert hat (FormData holt Inputs, das passt, solange value={state} gesetzt ist)
    
    await createTask(formData)
    setLoading(false)
    setOpen(false)
    // Reset
    setTitle('')
    setDesc('')
    setFreq('daily')
  }

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setTitle(preset.title)
    setDesc(preset.desc)
    setFreq(preset.freq)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-md">
           <span>+</span> Aufgabe hinzufügen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Neue Aufgabe erstellen</DialogTitle>
        </DialogHeader>
        
        {/* Preset Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
          {PRESETS.map(preset => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded-full text-xs font-medium transition-colors border border-transparent hover:border-blue-200 whitespace-nowrap"
            >
              {preset.icon}
              {preset.label}
            </button>
          ))}
        </div>

        <form action={handleSubmit} className="grid gap-5 py-2">
          
          {/* FOTO - Jetzt ganz oben und prominent */}
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-4 text-center group hover:border-blue-300 transition-colors">
            <Label htmlFor="image" className="cursor-pointer block">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm text-slate-400 group-hover:text-blue-500">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-slate-700">Foto hinzufügen (Optional)</span>
              <p className="text-xs text-slate-400 mt-1">Zeig den Löffel oder die Dose!</p>
            </Label>
            <Input 
              id="image" 
              name="image" 
              type="file" 
              accept="image/*" 
              className="hidden" // Input verstecken, Label triggert es
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Titel</Label>
            <Input 
              id="title" 
              name="title" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              placeholder="z.B. Füttern" 
              required 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="frequency">Wie oft?</Label>
            <Select name="frequency" value={freq} onValueChange={setFreq}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Täglich</SelectItem>
                <SelectItem value="every_2_days">Alle 2 Tage</SelectItem>
                <SelectItem value="weekly">Wöchentlich</SelectItem>
                <SelectItem value="once">Einmalig</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Details für den Sitter..." 
              className="resize-none h-24"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11 text-base bg-blue-600 hover:bg-blue-700">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Aufgabe speichern'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
