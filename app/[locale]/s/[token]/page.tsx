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
    Info,
    Glasses // Icon für den Modus
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
  const t = useTranslations('SitterView')
  const tForms = useTranslations('Forms')
  
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [tank, setTank] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [owner, setOwner] = useState<any>(null)
  const [doneTasks, setDoneTasks] = useState<string[]>([])
  
  // GRANNY MODE STATE
  const [isSimpleMode, setIsSimpleMode] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const { data: tankData, error } = await supabase
        .from('tanks')
        .select(`*, profiles:user_id (phone, whatsapp, telegram, emergency_notes)`)
        .eq('share_token', token)
        .single()
      
      if (!tankData || error) {
        setLoading(false)
        return
      }

      setTank(tankData)
      const ownerData = Array.isArray(tankData.profiles) ? tankData.profiles[0] : tankData.profiles
      setOwner(ownerData)

      const { data: taskData } = await supabase
        .from('tasks')
        .select('*')
        .eq('tank_id', tankData.id)
        .order('created_at')
      
      setTasks(taskData || [])
      setLoading(false)

      const today = new Date().toISOString().split('T')[0]
      const storageKey = `tanksitter_done_${tankData.id}_${today}`
      const savedDone = localStorage.getItem(storageKey)
      if (savedDone) setDoneTasks(JSON.parse(savedDone))
    }
    fetchData()
  }, [token, supabase])

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

  // Fallback Helper
  const getText = (key: string, fallback?: string) => {
    try {
        const text = t(key as any)
        if (text && text !== `SitterView.${key}`) return text
    } catch {}
    return fallback || key
  }

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-16 h-16 bg-muted rounded-full animate-pulse"/></div>
  if (!tank) return notFound()

  const allDone = tasks.length > 0 && doneTasks.length === tasks.length

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isSimpleMode ? 'bg-white text-black' : 'bg-background text-foreground'}`}>
      
      {/* Sticky Header */}
      <div className={`sticky top-0 z-50 border-b p-4 shadow-sm transition-all ${isSimpleMode ? 'bg-white border-black border-b-2 py-6' : 'bg-background/80 backdrop-blur-md border-border'}`}>
        <div className="max-w-md mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
                {!isSimpleMode && (
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl text-blue-600 dark:text-blue-400">
                        <span className="text-xl">🐠</span>
                    </div>
                )}
                <div>
                    <h1 className={`font-bold leading-none truncate max-w-[200px] ${isSimpleMode ? 'text-3xl text-black' : 'text-foreground text-base'}`}>
                        {tank.name}
                    </h1>
                    {!isSimpleMode && <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">Sitter Guide</p>}
                </div>
            </div>
            
            <div className="flex gap-2">
                {/* SIMPLE MODE TOGGLE */}
                <Button 
                    variant={isSimpleMode ? "default" : "outline"} 
                    size={isSimpleMode ? "lg" : "icon"}
                    onClick={() => setIsSimpleMode(!isSimpleMode)}
                    className={isSimpleMode ? "bg-black text-white hover:bg-slate-800 text-lg font-bold px-6 border-2 border-black" : ""}
                    title="Toggle Simple View"
                >
                    {isSimpleMode ? (
                         <span className="flex items-center gap-2"><Glasses className="w-6 h-6" /> {t('toggle_normal_mode')}</span>
                    ) : (
                         <Glasses className="w-4 h-4" />
                    )}
                </Button>

                {!isSimpleMode && <ModeToggle />}
            </div>
        </div>
      </div>

      <main className="max-w-md mx-auto p-4 pb-24 space-y-6">
        
        {/* Intro / Status Card */}
        <div className={`
            rounded-3xl p-6 shadow-sm border transition-all duration-500 relative overflow-hidden
            ${isSimpleMode 
                ? (allDone ? 'bg-green-100 border-4 border-green-600' : 'bg-white border-4 border-black') 
                : (allDone ? 'bg-green-100/50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30' : 'bg-card border-border')
            }
        `}>
            <div className="relative z-10">
                <h2 className={`font-bold mb-2 flex items-center gap-2 ${isSimpleMode ? 'text-3xl' : 'text-xl'}`}>
                    {allDone 
                        ? <span className="text-green-700">Alles fertig! 🎉</span> 
                        : getText('tasks_title', 'Tasks for Today')
                    }
                </h2>
                
                {/* Im Simple Mode verstecken wir den Text wenn fertig, damit es übersichtlicher ist */}
                {(!allDone || !isSimpleMode) && (
                    <p className={`text-muted-foreground leading-relaxed mb-6 ${isSimpleMode ? 'text-xl text-black' : 'text-sm'}`}>
                        {allDone 
                            ? getText('intro_done', 'Great job! See you tomorrow!') 
                            : getText('intro_pending', 'Please complete these tasks.')
                        }
                    </p>
                )}
                
                {/* Progress Bar (Gigantisch im Simple Mode) */}
                <div className={`rounded-full overflow-hidden ${isSimpleMode ? 'h-8 bg-gray-200 border-2 border-black' : 'h-2 bg-secondary'}`}>
                    <div 
                        className={`h-full transition-all duration-500 ease-out ${allDone ? 'bg-green-500' : 'bg-blue-600'}`}
                        style={{ width: `${(doneTasks.length / Math.max(tasks.length, 1)) * 100}%` }}
                    />
                </div>
            </div>
        </div>

        {/* Task Liste */}
        <div className={`space-y-4 ${isSimpleMode ? 'space-y-8' : ''}`}>
            {tasks.map(task => {
                const isDone = doneTasks.includes(task.id)
                
                return (
                    <div 
                        key={task.id}
                        onClick={() => handleToggleTask(task.id)}
                        className={`
                            relative group cursor-pointer transition-all duration-300
                            rounded-2xl overflow-hidden
                            ${isSimpleMode 
                                ? `border-4 ${isDone ? 'border-green-500 bg-green-50 opacity-50' : 'border-black bg-white shadow-xl'}`
                                : `border ${isDone ? 'bg-secondary/30 border-transparent opacity-60 scale-[0.98]' : 'bg-card border-border hover:border-blue-300'}`
                            }
                        `}
                    >
                        {/* Image Section */}
                        {task.image_path && (
                             <div className={`w-full bg-secondary relative overflow-hidden ${isSimpleMode ? 'h-64' : 'h-40'}`}>
                                <img 
                                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/task-images/${task.image_path}`} 
                                    className={`w-full h-full object-cover ${isDone ? 'grayscale' : ''}`}
                                />
                                {isDone && (
                                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                        <Check className="w-16 h-16 text-green-700" strokeWidth={4} />
                                    </div>
                                )}
                             </div>
                        )}

                        <div className={`flex gap-4 items-start ${isSimpleMode ? 'p-6 block' : 'p-5'}`}>
                             {/* Icon hidden in Simple Mode if Image exists to save space, otherwise huge */}
                             {!task.image_path && (
                                <div className={`shrink-0 flex items-center justify-center transition-colors 
                                    ${isSimpleMode 
                                        ? `w-16 h-16 rounded-2xl mb-4 ${isDone ? 'bg-green-200' : 'bg-blue-100'}` 
                                        : `w-12 h-12 rounded-xl ${isDone ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'}`
                                    }`}>
                                    {isDone ? <Check className={isSimpleMode ? "w-10 h-10 text-black" : "w-6 h-6"} /> : <Droplets className={isSimpleMode ? "w-10 h-10 text-black" : "w-6 h-6"} />}
                                </div>
                             )}

                            <div className="flex-1 min-w-0">
                                <h3 className={`font-bold leading-tight ${isSimpleMode ? 'text-3xl text-black mb-2' : 'text-lg text-foreground'}`}>
                                    {task.title}
                                </h3>
                                
                                {!isSimpleMode && (
                                    <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wide mb-3 bg-secondary`}>
                                        <Clock size={10} />
                                        {tForms(`freq_${task.frequency_type}`) || task.frequency_type}
                                    </span>
                                )}

                                <p className={`text-muted-foreground leading-snug ${isSimpleMode ? 'text-xl text-gray-600 mb-6' : 'text-sm'}`}>
                                    {task.description || getText('no_description', 'No description provided.')}
                                </p>
                                
                                {/* SIMPLE MODE BUTTON */}
                                {isSimpleMode && (
                                    <button className={`
                                        w-full py-4 rounded-xl text-xl font-black uppercase tracking-wider border-2
                                        ${isDone 
                                            ? 'bg-white border-green-600 text-green-700' 
                                            : 'bg-green-600 border-green-800 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none'
                                        }
                                    `}>
                                        {isDone ? t('simple_mode_done') : t('simple_mode_todo')}
                                    </button>
                                )}
                            </div>
                            
                            {/* Checkbox Button (Desktop/NoImage Layout) - Hide in Simple Mode */}
                            {!task.image_path && !isSimpleMode && (
                                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                    isDone ? 'border-green-500 bg-green-500' : 'border-muted-foreground/30'
                                }`}>
                                    {isDone && <Check className="w-3 h-3 text-white" />}
                                </div>
                            )}
                        </div>
                        
                        {/* Normal Button Bar */}
                        {!isSimpleMode && task.image_path && (
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
        </div>

        {/* EMERGENCY CONTACTS */}
        {(owner?.phone || owner?.whatsapp) && (
          <div className={`mt-12 pt-8 ${isSimpleMode ? 'border-t-4 border-black' : 'border-t border-border'}`}>
            <h2 className={`font-bold text-destructive mb-4 flex items-center gap-2 ${isSimpleMode ? 'text-3xl' : ''}`}>
              <AlertTriangle className={isSimpleMode ? "w-8 h-8" : "w-5 h-5"} />
              {getText('emergency.title', 'Emergency Contact')}
            </h2>
            
            <div className="grid gap-4">
              {owner.phone && (
                <a href={`tel:${owner.phone}`} className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                    isSimpleMode 
                        ? 'bg-red-100 border-4 border-red-600 hover:bg-red-200' 
                        : 'bg-card border border-border hover:bg-secondary shadow-sm'
                }`}>
                  <div className={`rounded-full flex items-center justify-center ${
                      isSimpleMode ? 'bg-red-600 text-white w-16 h-16' : 'bg-green-100 dark:bg-green-900/30 p-3 text-green-700'
                  }`}>
                    <Phone size={isSimpleMode ? 32 : 20} />
                  </div>
                  <div>
                    <div className={`font-bold ${isSimpleMode ? 'text-2xl text-black' : 'text-foreground'}`}>
                        {getText('emergency.call_button', 'Call Owner')}
                    </div>
                    <div className={`${isSimpleMode ? 'text-xl font-mono text-black' : 'text-xs text-muted-foreground'}`}>{owner.phone}</div>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
