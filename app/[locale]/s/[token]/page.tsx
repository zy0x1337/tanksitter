'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useTranslations } from 'next-intl'
import { 
    Phone, 
    Check, 
    AlertTriangle, 
    CloudRain, 
    Droplets, 
    MessageCircle, 
    Send, 
    Clock, 
    Moon, 
    Sun,
    Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'
import { ModeToggle } from '@/components/mode-toggle'

interface PageProps {
  params: Promise<{
    locale: string;
    token: string
  }>
}

export default function SitterView({ params }: PageProps) {
  const { token } = use(params)
  const t = useTranslations('SitterView') // Achte auf den richtigen Namespace (SitterView vs Sitter)
  // Fallback Namespace falls du SitterView noch nicht überall hast:
  const tSitter = useTranslations('Sitter') 
  const tForms = useTranslations('Forms')
  
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [tank, setTank] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [owner, setOwner] = useState<any>(null)
  
  // State für erledigte Tasks (ID Array)
  const [doneTasks, setDoneTasks] = useState<string[]>([])

  // 1. Daten laden
  useEffect(() => {
    const fetchData = async () => {
      // Tank laden
      const { data: tankData, error } = await supabase
        .from('tanks')
        .select(`
            *,
            profiles:user_id (
                phone, whatsapp, telegram, emergency_notes
            )
        `)
        .eq('share_token', token)
        .single()
      
      if (!tankData || error) {
        setLoading(false)
        return // Handle 404 later
      }

      setTank(tankData)
      
      // Profile extrahieren (Supabase gibt Array oder Objekt zurück je nach Rel)
      const ownerData = Array.isArray(tankData.profiles) ? tankData.profiles[0] : tankData.profiles
      setOwner(ownerData)

      // Tasks laden
      const { data: taskData } = await supabase
        .from('tasks')
        .select('*')
        .eq('tank_id', tankData.id)
        .order('created_at')
      
      setTasks(taskData || [])
      setLoading(false)

      // LocalStorage checken: Welche Tasks wurden HEUTE schon erledigt?
      const today = new Date().toISOString().split('T')[0]
      const storageKey = `tanksitter_done_${tankData.id}_${today}`
      const savedDone = localStorage.getItem(storageKey)
      if (savedDone) {
        setDoneTasks(JSON.parse(savedDone))
      }
    }
    fetchData()
  }, [token, supabase])

  // 2. Task abhaken
  const handleToggleTask = (taskId: string) => {
    const isDone = doneTasks.includes(taskId)
    let newDone = []

    if (isDone) {
      newDone = doneTasks.filter(id => id !== taskId)
    } else {
      newDone = [...doneTasks, taskId]
    }

    setDoneTasks(newDone)

    const today = new Date().toISOString().split('T')[0]
    const storageKey = `tanksitter_done_${tank?.id}_${today}`
    localStorage.setItem(storageKey, JSON.stringify(newDone))
  }

  // Helper für Translations (Fallback Logik)
  const getText = (key: string, fallback?: string) => {
    // Versuch SitterView Namespace, sonst Sitter, sonst Fallback
    try {
        const text = t(key as any)
        if (text && text !== `SitterView.${key}`) return text
    } catch {}
    try {
        const text = tSitter(key as any)
        if (text && text !== `Sitter.${key}`) return text
    } catch {}
    return fallback || key
  }

  // Loading State
  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="w-16 h-16 bg-muted rounded-full"></div>
            <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
    </div>
  )

  // 404
  if (!tank) return notFound()

  const allDone = tasks.length > 0 && doneTasks.length === tasks.length

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border p-4 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl text-blue-600 dark:text-blue-400">
                     <span className="text-xl">🐠</span>
                </div>
                <div>
                    <h1 className="font-bold text-foreground text-base leading-none truncate max-w-[150px]">
                        {tank.name}
                    </h1>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">Sitter Guide</p>
                </div>
            </div>
            
            <div className="flex gap-2">
                <ModeToggle />
                {owner?.phone && (
                    <a href={`tel:${owner.phone}`}>
                        <Button variant="destructive" size="icon" className="rounded-full shadow-md shadow-red-500/20">
                            <Phone className="w-4 h-4" />
                        </Button>
                    </a>
                )}
            </div>
        </div>
      </div>

      <main className="max-w-md mx-auto p-4 pb-20 space-y-6">
        
        {/* Intro / Status Card */}
        <div className={`
            rounded-3xl p-6 shadow-sm border transition-all duration-500 relative overflow-hidden
            ${allDone 
                ? 'bg-green-100/50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30' 
                : 'bg-card border-border'
            }
        `}>
            <div className="relative z-10">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                    {allDone 
                        ? <span className="text-green-600">All done! 🎉</span> 
                        : getText('tasks_title', 'Tasks for Today')
                    }
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {allDone 
                        ? getText('intro_done', 'Great job! The fish are happy. See you tomorrow!') 
                        : getText('intro_pending', 'Please complete these tasks to keep the ecosystem healthy.')
                    }
                </p>
                
                {/* Progress Bar */}
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-500 ease-out rounded-full ${allDone ? 'bg-green-500' : 'bg-blue-600'}`}
                        style={{ width: `${(doneTasks.length / Math.max(tasks.length, 1)) * 100}%` }}
                    />
                </div>
                <div className="mt-2 text-xs text-muted-foreground text-right font-medium">
                    {doneTasks.length} / {tasks.length} {getText('done_status', 'Done')?.replace('✅', '')}
                </div>
            </div>
        </div>

        {/* Task Liste */}
        <div className="space-y-4">
            {tasks.map(task => {
                const isDone = doneTasks.includes(task.id)
                
                return (
                    <div 
                        key={task.id}
                        onClick={() => handleToggleTask(task.id)}
                        className={`
                            relative group cursor-pointer transition-all duration-300
                            rounded-2xl border overflow-hidden
                            ${isDone 
                                ? 'bg-secondary/30 border-transparent opacity-60 scale-[0.98]' 
                                : 'bg-card border-border hover:border-blue-300 hover:shadow-md dark:hover:border-blue-700'
                            }
                        `}
                    >
                        {/* Image Section */}
                        {task.image_path && (
                             <div className="h-40 w-full bg-secondary relative overflow-hidden">
                                <img 
                                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/task-images/${task.image_path}`} 
                                    className={`w-full h-full object-cover transition-all duration-500 ${isDone ? 'grayscale scale-105' : 'group-hover:scale-105'}`}
                                />
                                {isDone && (
                                    <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex items-center justify-center">
                                        <div className="bg-green-500 text-white rounded-full p-3 shadow-lg animate-in zoom-in spin-in-12 duration-300">
                                            <Check className="w-8 h-8" strokeWidth={3} />
                                        </div>
                                    </div>
                                )}
                             </div>
                        )}

                        {/* Content Section */}
                        <div className="p-5 flex gap-4 items-start">
                             {!task.image_path && (
                                <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isDone ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'}`}>
                                    {isDone ? <Check className="w-6 h-6" /> : <Droplets className="w-6 h-6" />}
                                </div>
                             )}

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-bold text-lg leading-tight ${isDone ? 'text-muted-foreground line-through decoration-2' : 'text-foreground'}`}>
                                        {task.title}
                                    </h3>
                                </div>
                                
                                <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wide mb-3 ${
                                    task.frequency_type === 'daily' 
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' 
                                        : 'bg-secondary text-secondary-foreground'
                                }`}>
                                    <Clock size={10} />
                                    {tForms(`freq_${task.frequency_type}`) || task.frequency_type}
                                </span>

                                <p className="text-sm text-muted-foreground leading-snug">
                                    {task.description || getText('no_description', 'No description provided.')}
                                </p>
                            </div>
                            
                            {/* Checkbox Button (Desktop/NoImage Layout) */}
                            {!task.image_path && (
                                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                    isDone ? 'border-green-500 bg-green-500' : 'border-muted-foreground/30'
                                }`}>
                                    {isDone && <Check className="w-3 h-3 text-white" />}
                                </div>
                            )}
                        </div>
                        
                        {/* Button Bar für Image Cards */}
                        {task.image_path && (
                            <div className={`px-5 pb-5 pt-0 transition-all ${isDone ? 'opacity-50' : ''}`}>
                                <Button 
                                    variant={isDone ? "outline" : "default"} 
                                    className={`w-full h-11 rounded-xl font-bold shadow-sm ${isDone ? 'border-green-500 text-green-600' : 'bg-foreground text-background hover:bg-foreground/90'}`}
                                >
                                    {isDone ? getText('mark_done_button', 'Done') : getText('mark_done_button', 'Mark as Done')}
                                </Button>
                            </div>
                        )}
                    </div>
                )
            })}

            {tasks.length === 0 && (
                <div className="text-center py-10 px-4 text-muted-foreground bg-secondary/30 border border-dashed border-border rounded-3xl">
                    <CloudRain className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>{getText('no_tasks', 'No tasks pending.')}</p>
                </div>
            )}
        </div>

        {/* EMERGENCY CONTACTS */}
        {(owner?.phone || owner?.whatsapp || owner?.telegram || owner?.emergency_notes) && (
          <div className="mt-12 border-t border-border pt-8">
            <h2 className="font-bold text-destructive mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {getText('emergency.title', 'Emergency Contact')}
            </h2>
            
            <p className="text-sm text-muted-foreground mb-4">
              {getText('emergency.subtitle', 'If something looks wrong or isn\'t working:')}
            </p>

            <div className="grid gap-3">
              {owner.phone && (
                <a href={`tel:${owner.phone}`} className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:bg-secondary transition-colors shadow-sm group">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-700 dark:text-green-400 group-hover:scale-110 transition-transform">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">{getText('emergency.call_button', 'Call Owner')}</div>
                    <div className="text-xs text-muted-foreground">{owner.phone}</div>
                  </div>
                </a>
              )}
              
              {owner.whatsapp && (
                <a href={`https://wa.me/${owner.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:bg-secondary transition-colors shadow-sm group">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-700 dark:text-green-400 group-hover:scale-110 transition-transform">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">WhatsApp</div>
                    <div className="text-xs text-muted-foreground">{getText('emergency.whatsapp_action', 'Send Message')}</div>
                  </div>
                </a>
              )}

               {owner.telegram && (
                <a href={`https://t.me/${owner.telegram.replace('@', '')}`} target="_blank" className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:bg-secondary transition-colors shadow-sm group">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <Send size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">Telegram</div>
                    <div className="text-xs text-muted-foreground">{owner.telegram}</div>
                  </div>
                </a>
              )}

              {owner.emergency_notes && (
                <div className="mt-2 p-4 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/30 rounded-xl text-sm">
                   <div className="font-bold text-yellow-800 dark:text-yellow-500 mb-1 text-xs uppercase tracking-wider flex items-center gap-1">
                     <Info size={12} /> {getText('emergency.notes_label', 'Important Notes')}
                   </div>
                   <p className="text-yellow-900 dark:text-yellow-200 leading-relaxed whitespace-pre-wrap">
                     {owner.emergency_notes}
                   </p>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
