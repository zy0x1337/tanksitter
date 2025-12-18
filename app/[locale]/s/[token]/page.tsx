'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useTranslations } from 'next-intl'
import { Phone, Check, AlertTriangle, CloudRain, Droplets } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    locale: string;
    token: string
  }>
}

export default function SitterView({ params }: PageProps) {
  const { token } = use(params)
  const t = useTranslations('Sitter')
  const tForms = useTranslations('Forms') // Für "freq_daily" etc.
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [tank, setTank] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [doneTasks, setDoneTasks] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: tankData } = await supabase
        .from('tanks')
        .select('*')
        .eq('share_token', token)
        .single()
      
      if (!tankData) {
        setLoading(false)
        return
      }

      setTank(tankData)

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
      if (savedDone) {
        setDoneTasks(JSON.parse(savedDone))
      }
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

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="w-16 h-16 bg-secondary rounded-full"></div>
            <div className="h-4 w-32 bg-secondary rounded"></div>
        </div>
    </div>
  )

  if (!tank) return notFound()

  const allDone = tasks.length > 0 && doneTasks.length === tasks.length

  return (
    <div className="min-h-screen bg-background font-sans">
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border p-4 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
            <div>
                <h1 className="font-bold text-foreground text-lg leading-none">{tank.name}</h1>
                <p className="text-xs text-muted-foreground mt-1">Sitter Guide</p>
            </div>
            
            {tank.emergency_contact && (
                <a href={`tel:${tank.emergency_contact}`}>
                    <Button variant="destructive" size="sm" className="shadow-red-500/20 shadow-lg rounded-xl animate-pulse hover:animate-none">
                        <Phone className="w-4 h-4 mr-2" />
                        {t('emergency_button').split(' ')[0]}
                    </Button>
                </a>
            )}
        </div>
      </div>

      <main className="max-w-md mx-auto p-4 pb-20 space-y-6">
        
        {/* Intro Card */}
        <div className="bg-blue-600 text-white rounded-3xl p-6 shadow-xl shadow-blue-600/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">
                    {allDone ? t('empty_title') : t('todo_today_title')}
                </h2>
                <p className="text-blue-100 text-sm leading-relaxed opacity-90">
                    {allDone ? t('intro_done') : t('intro_pending')}
                </p>
                
                {/* Progress Bar */}
                <div className="mt-6 h-2 bg-black/20 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-white transition-all duration-500 ease-out"
                        style={{ width: `${(doneTasks.length / Math.max(tasks.length, 1)) * 100}%` }}
                    />
                </div>
                <div className="mt-2 text-xs text-blue-200 text-right font-medium">
                    {t('progress_text', { done: doneTasks.length, total: tasks.length })}
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
                            rounded-2xl border p-4 shadow-sm
                            ${isDone 
                                ? 'bg-secondary/50 border-transparent opacity-60 scale-[0.98]' 
                                : 'bg-card border-border hover:border-blue-300 hover:shadow-md dark:hover:border-blue-700'
                            }
                        `}
                    >
                        <div className="flex gap-4">
                            {/* Bild */}
                            <div className="h-24 w-24 bg-secondary rounded-xl overflow-hidden shrink-0 border border-border relative">
                                {task.image_path ? (
                                    <img 
                                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/task-images/${task.image_path}`} 
                                        className={`w-full h-full object-cover transition-all ${isDone ? 'grayscale' : ''}`}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                        <Droplets className="w-8 h-8 opacity-20" />
                                    </div>
                                )}
                                
                                {isDone && (
                                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                        <div className="bg-green-500 text-white rounded-full p-1 shadow-sm">
                                            <Check className="w-6 h-6" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 py-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-bold text-lg leading-tight ${isDone ? 'text-muted-foreground line-through decoration-2' : 'text-foreground'}`}>
                                        {task.title}
                                    </h3>
                                </div>
                                
                                <span className={`inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wide mb-2 ${
                                    task.frequency_type === 'daily' 
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' 
                                        : 'bg-secondary text-secondary-foreground'
                                }`}>
                                    {tForms(`freq_${task.frequency_type}`) || task.frequency_type}
                                </span>

                                <p className="text-sm text-muted-foreground leading-snug">
                                    {task.description || t('card.no_description')}
                                </p>
                            </div>
                        </div>

                        <div className={`absolute bottom-4 right-4 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isDone ? 'border-green-500 bg-green-500' : 'border-muted-foreground/30'
                        }`}>
                            {isDone && <Check className="w-3 h-3 text-white" />}
                        </div>
                    </div>
                )
            })}

            {tasks.length === 0 && (
                <div className="text-center py-10 px-4 text-muted-foreground bg-secondary/20 rounded-3xl">
                    <CloudRain className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>{t('empty_desc')}</p>
                </div>
            )}
        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-muted-foreground pt-8 pb-4">
            <p className="flex items-center justify-center gap-1 opacity-50">
                <AlertTriangle className="w-3 h-3" />
                {t('footer_warning')}
            </p>
        </div>

      </main>
    </div>
  )
}
