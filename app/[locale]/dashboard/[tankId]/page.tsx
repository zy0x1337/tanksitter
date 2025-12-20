'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Trash2, Loader2, Image as ImageIcon, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { toast } from "sonner"
import { CreateTaskDialog } from '@/components/create-task-dialog' // <-- Nutzt jetzt den Dialog mit Presets

interface PageProps {
  params: Promise<{ 
    locale: string; 
    tankId: string 
  }>
}

export default function TankDetailPage({ params }: PageProps) {
  const { locale, tankId } = use(params)
  const t = useTranslations('Forms')
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [tank, setTank] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  
  // State für UI
  const [deletingTank, setDeletingTank] = useState(false)

  // Daten laden
  const fetchData = async () => {
      const { data: tankData } = await supabase.from('tanks').select('*').eq('id', tankId).single()
      if (tankData) {
          setTank(tankData)
          const { data: taskData } = await supabase.from('tasks').select('*').eq('tank_id', tankId).order('created_at')
          setTasks(taskData || [])
      }
      setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [tankId, supabase])


  const handleDeleteTask = async (taskId: string) => {
    if(!confirm(t('delete_confirm') || 'Delete?')) return
    
    // Optimistic Update
    const oldTasks = [...tasks]
    setTasks(prev => prev.filter(t => t.id !== taskId))
    toast.info("Task deleted")
    
    const { error } = await supabase.from('tasks').delete().eq('id', taskId)
    if (error) { 
        toast.error("Error deleting task")
        setTasks(oldTasks) // Rollback bei Fehler
    }
  }

  const handleDeleteTank = async () => {
    if (!confirm(locale === 'de' ? `Wirklich löschen?` : `Really delete?`)) return
    setDeletingTank(true)
    const toastId = toast.loading("Deleting tank...")
    const { error } = await supabase.from('tanks').delete().eq('id', tankId)
    if (error) {
      toast.dismiss(toastId)
      toast.error('Error: ' + error.message)
      setDeletingTank(false)
    } else {
      toast.dismiss(toastId)
      toast.success("Tank deleted")
      router.push(`/${locale}/dashboard`)
      router.refresh()
    }
  }

  // Callback, wenn eine neue Aufgabe im Dialog erstellt wurde
  const onTaskCreated = () => {
      fetchData() // Liste neu laden
  }

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
  if (!tank) return <div className="p-8 text-center text-muted-foreground">Tank not found (ID: {tankId})</div>

  return (
    <div className="min-h-screen bg-background p-4 pb-24 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <Link href={`/${locale}/dashboard`} className="bg-card p-2 rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">{tank.name}</h1>
                    <a href={`/${locale}/s/${tank.share_token}`} target="_blank" className="text-sm text-primary hover:underline font-medium">
                        Public Sitter Link ↗
                    </a>
                </div>
            </div>
            
            {/* HIER IST DER NEUE BUTTON MIT PRESETS */}
            <CreateTaskDialog tankId={tank.id} onSuccess={onTaskCreated} />
        </div>

        {/* Task Liste */}
        <div className="space-y-4">
            {tasks.map(task => (
                <div key={task.id} className="bg-card p-4 rounded-2xl border border-border flex items-center gap-4 group hover:shadow-md transition-all hover:border-blue-200 dark:hover:border-blue-800 animate-in fade-in slide-in-from-bottom-2">
                    <div className="h-20 w-20 bg-secondary rounded-xl overflow-hidden shrink-0 border border-border relative">
                        {task.image_path ? (
                             <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/task-images/${task.image_path}`} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-muted-foreground" /></div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-foreground truncate">{task.title}</h3>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wide ${
                            task.frequency_type === 'daily' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-secondary text-secondary-foreground'
                          }`}>
                              {task.frequency_type}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{task.description || "No description"}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)} className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-5 h-5" />
                    </Button>
                </div>
            ))}

            {tasks.length === 0 && (
                <div className="text-center py-16 px-4 text-muted-foreground border-2 border-dashed border-border rounded-3xl bg-secondary/20">
                    <p className="font-medium">No tasks yet.</p>
                </div>
            )}
        </div>

        {/* DANGER ZONE */}
        <div className="mt-20 pt-10 border-t border-border">
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-red-900 dark:text-red-400 font-bold flex items-center gap-2 mb-1">
                <AlertTriangle className="h-5 w-5" />
                {t('delete_tank')}
              </h3>
              <p className="text-red-700 dark:text-red-300 text-sm">
                This action permanently removes the tank.
              </p>
            </div>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTank} 
              disabled={deletingTank}
              className="bg-red-600 hover:bg-red-700 text-white shrink-0 shadow-sm"
            >
              {deletingTank ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="h-4 w-4 mr-2" />}
              {t('delete_tank')}
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
