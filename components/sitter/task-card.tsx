'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Clock, Camera } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useTranslations } from 'next-intl'

export function TaskCard({ task }: { task: any }) {
  const t = useTranslations('Sitter') // Zugriff auf den "Sitter" Namespace
  const [isDone, setIsDone] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // Hydration Fix & LocalStorage Check
  useEffect(() => {
    setHydrated(true)
    const today = new Date().toISOString().split('T')[0]
    const doneKey = `task-${task.id}-done-${today}`
    if (localStorage.getItem(doneKey)) {
      setIsDone(true)
    }
  }, [task.id])

  const handleDone = () => {
    const today = new Date().toISOString().split('T')[0]
    const doneKey = `task-${task.id}-done-${today}`
    
    localStorage.setItem(doneKey, 'true')
    setIsDone(true)
    
    // Konfetti-Explosion
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.65 },
      colors: ['#3B82F6', '#10B981', '#F59E0B']
    })
  }

  // Helper für die übersetzten Labels
  const getFrequencyLabel = (type: string) => {
    switch(type) {
      case 'daily': return t('task_frequency.daily');
      case 'weekly': return t('task_frequency.weekly');
      case 'once': return t('task_frequency.once');
      default: return type;
    }
  }

  // Skeleton während Loading
  if (!hydrated) return <div className="h-80 bg-slate-100 rounded-3xl animate-pulse" />

  // Erledigt-Ansicht
  if (isDone) {
    return (
      <div className="bg-green-50/50 border border-green-100 rounded-3xl p-6 flex items-center gap-5 opacity-60 grayscale-[0.5] transition-all">
        <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0 shadow-sm border border-green-200">
          <Check className="h-7 w-7" />
        </div>
        <div>
          <h4 className="font-bold text-slate-700 line-through text-lg">{task.title}</h4>
          <p className="text-sm text-green-700 font-medium mt-1">{t('card.done_status')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300">
      
      {/* Bild Bereich */}
      <div className="aspect-[4/3] w-full bg-slate-100 relative overflow-hidden">
        {task.image_path ? (
           <img 
             src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/task-images/${task.image_path}`} 
             alt={t('card.image_alt')}
             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
           <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-300 gap-3">
              <Camera className="w-12 h-12 opacity-30" />
              <span className="text-xs font-medium uppercase tracking-wider opacity-40">No Image</span>
           </div>
        )}
        
        {/* Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1.5 border border-white/50">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          {getFrequencyLabel(task.frequency_type)}
        </div>
      </div>

      {/* Content Bereich */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-2xl font-bold text-slate-900 mb-3 leading-tight">{task.title}</h3>
        
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-600 leading-relaxed text-sm mb-6 flex-1">
          {task.description || t('card.no_description')}
        </div>

        <Button 
          onClick={handleDone}
          className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all
                     bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
        >
          {t('card.done_button')}
        </Button>
      </div>
    </div>
  )
}
