'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Clock, Camera } from 'lucide-react'
import confetti from 'canvas-confetti'

export function TaskCard({ task }: { task: any }) {
  const [isDone, setIsDone] = useState(false)
  const [hydrated, setHydrated] = useState(false) // Gegen Hydration-Mismatch

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
    
    // KONFETTI!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#60A5FA', '#34D399', '#FBBF24']
    })
  }

  if (!hydrated) return <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />

  if (isDone) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center gap-4 opacity-70 transition-all">
        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0 shadow-sm">
          <Check className="h-6 w-6" />
        </div>
        <div>
          <h4 className="font-bold text-green-900 line-through text-lg">{task.title}</h4>
          <p className="text-sm text-green-700 font-medium">Erledigt für heute ✅</p>
        </div>
      </div>
    )
  }

  // Helper für die Frequenz-Anzeige
  const getFrequencyLabel = (type: string) => {
    switch(type) {
      case 'daily': return 'Täglich';
      case 'weekly': return 'Wöchentlich';
      case 'once': return 'Einmalig';
      default: return type;
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
      {/* Das riesige Bild */}
      <div className="aspect-video w-full bg-slate-100 relative">
        {task.image_path ? (
           // Hinweis: Im echten Projekt hier Next/Image nutzen, aber für Storage URLs ist <img> oft einfacher wegen Domains
           <img 
             src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/task-images/${task.image_path}`} 
             alt={task.title}
             className="w-full h-full object-cover"
          />
        ) : (
           <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
              <Camera className="w-16 h-16 opacity-50" />
           </div>
        )}
        
        {/* Frequenz Badge oben rechts */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {getFrequencyLabel(task.frequency_type)}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{task.title}</h3>
        
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-600 leading-relaxed text-sm mb-6 flex-1">
          {task.description || "Keine Beschreibung. Siehe Foto."}
        </div>

        <Button 
          onClick={handleDone}
          className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
        >
          Erledigt ✅
        </Button>
      </div>
    </div>
  )
}
