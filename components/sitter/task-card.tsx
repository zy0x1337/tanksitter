'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function TaskCard({ task }: { task: any }) {
  const [isDone, setIsDone] = useState(false)

  // Check localStorage on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
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
    
    // Optional: Konfetti-Effekt hier auslösen! 
  }

  if (isDone) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center gap-4 opacity-60">
        <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
          <Check className="h-6 w-6" />
        </div>
        <div>
          <h4 className="font-medium text-green-900 line-through decoration-green-500">{task.title}</h4>
          <p className="text-xs text-green-700">Erledigt für heute</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Das riesige Bild */}
      {task.image_path ? (
        <div className="aspect-video w-full bg-slate-100 relative">
          <img 
             src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/task-images/${task.image_path}`} 
             alt={task.title}
             className="w-full h-full object-cover"
          />
          {/* Overlay Gradient für bessere Lesbarkeit wenn Text im Bild wäre */}
        </div>
      ) : (
         <div className="h-32 bg-slate-100 flex items-center justify-center text-slate-400">
            <span className="text-4xl">📸</span>
         </div>
      )}

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-900">{task.title}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
             {task.frequency_type}
          </span>
        </div>
        
        <p className="text-slate-600 text-base leading-relaxed mb-6">
          {task.description || "Keine weitere Beschreibung."}
        </p>

        <Button 
          onClick={handleDone}
          className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl shadow-blue-200 shadow-lg active:scale-95 transition-all"
        >
          Erledigt ✅
        </Button>
      </div>
    </div>
  )
}
