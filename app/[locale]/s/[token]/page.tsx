'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useTranslations } from 'next-intl'
import { 
    Phone, 
    Check, 
    AlertTriangle, 
    Droplets, 
    Clock, 
    Glasses,
    ArrowRight,
    Fish,
    Printer
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

  // PRINT FUNCTION
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>TankSitter - ${tank.name}</title>
          <style>
            body { font-family: sans-serif; color: #111; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { font-size: 28px; margin: 0 0 10px 0; }
            .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
            .meta { font-size: 14px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; border-bottom: 2px solid #ddd; padding: 10px 5px; text-transform: uppercase; font-size: 12px; }
            td { border-bottom: 1px solid #eee; padding: 12px 5px; vertical-align: middle; }
            .checkbox { width: 16px; height: 16px; border: 1.5px solid #333; display: inline-block; margin-right: 10px; }
            .emergency { background: #f9f9f9; padding: 20px; margin-top: 40px; border-radius: 8px; border: 1px solid #eee; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${tank.name}</h1>
            <div class="meta">TankSitter Guide</div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 50%">Task</th>
                <th style="width: 20%">Frequency</th>
                <th style="width: 30%">Check</th>
              </tr>
            </thead>
            <tbody>
              ${tasks.map(t => `
                <tr>
                  <td><strong>${t.title}</strong><br><span style="font-size: 12px; color: #666;">${t.description || ''}</span></td>
                  <td>${t.frequency_type}</td>
                  <td><div class="checkbox"></div> Done</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          ${(owner?.phone || owner?.emergency_notes) ? `
            <div class="emergency">
              <strong>🚨 Emergency Contact:</strong><br>
              ${owner.phone ? `Phone: ${owner.phone}<br>` : ''}
              ${owner.emergency_notes ? `<br>Notes:<br>${owner.emergency_notes}` : ''}
            </div>
          ` : ''}

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Fallback Helper
  const getText = (key: string, fallback?: string) => {
    try {
        const text = t(key as any)
        if (text && text !== `SitterView.${key}`) return text
    } catch {}
    return fallback || key
  }

  if (loading) return (
      <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full animate-ping" />
          </div>
      </div>
  )
  if (!tank) return notFound()

  const allDone = tasks.length > 0 && doneTasks.length === tasks.length

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-hidden relative ${isSimpleMode ? 'bg-white text-black' : 'bg-background text-foreground'}`}>
      
      {/* PREMIUM BACKGROUNDS (Only in Normal Mode) */}
      {!isSimpleMode && (
         <>
             <div className="bg-noise pointer-events-none fixed inset-0 z-50"></div>
             <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] -z-20 mask-image-gradient" />
             <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
             </div>
         </>
      )}
      
      {/* Sticky Header */}
      <div className={`sticky top-0 z-40 transition-all duration-300 ${
          isSimpleMode 
            ? 'bg-white border-black border-b-4 py-4 shadow-sm' 
            : 'bg-background/80 backdrop-blur-xl border-b border-border/50 py-3'
      }`}>
        <div className="max-w-md mx-auto px-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
                {!isSimpleMode && (
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20 shrink-0">
                        <Fish className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                )}
                <div className="overflow-hidden">
                    <h1 className={`font-extrabold leading-none truncate ${isSimpleMode ? 'text-3xl text-black uppercase tracking-tighter' : 'text-lg text-foreground tracking-tight'}`}>
                        {tank.name}
                    </h1>
                    {!isSimpleMode && <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mt-0.5">Sitter Guide</p>}
                </div>
            </div>
            
            <div className="flex gap-2 items-center shrink-0">
                {/* PRINT BUTTON (Only in Normal Mode) */}
                {!isSimpleMode && (
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={handlePrint}
                        className="bg-secondary/50 hover:bg-secondary border border-border/50 w-10 h-10 rounded-xl"
                        title="Print Guide"
                    >
                        <Printer className="w-5 h-5 text-muted-foreground" />
                    </Button>
                )}

                {/* SIMPLE MODE TOGGLE WITH TEXT */}
                <Button 
                    variant={isSimpleMode ? "default" : "outline"} 
                    onClick={() => setIsSimpleMode(!isSimpleMode)}
                    className={`rounded-xl transition-all border-2 ${
                        isSimpleMode 
                            ? "bg-black text-white hover:bg-gray-800 text-lg font-bold px-4 border-black h-12" 
                            : "bg-white/50 hover:bg-white text-foreground border-foreground/10 hover:border-foreground/30 h-10 px-3 text-xs sm:text-sm font-semibold"
                    }`}
                    title={isSimpleMode ? t('toggle_normal_mode') : t('toggle_simple_mode')}
                >
                    <Glasses className={`mr-2 ${isSimpleMode ? "w-6 h-6" : "w-4 h-4"}`} />
                    <span className="hidden sm:inline">{isSimpleMode ? t('toggle_normal_mode') : t('toggle_simple_mode')}</span>
                    <span className="sm:hidden">{isSimpleMode ? "Normal" : "Groß"}</span>
                </Button>

                {!isSimpleMode && <ModeToggle />}
            </div>
        </div>
      </div>

      <main className="max-w-md mx-auto p-4 pb-24 space-y-6 relative z-10">
        
        {/* Intro / Status Card */}
        <div className={`
            p-6 transition-all duration-500 relative overflow-hidden group
            ${isSimpleMode 
                ? (allDone ? 'bg-green-100 border-4 border-green-600 rounded-2xl' : 'bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]') 
                : (allDone ? 'bg-green-500/10 border-green-500/20 rounded-3xl' : 'bg-card/60 backdrop-blur-md border border-border/50 rounded-3xl shadow-sm')
            }
        `}>
            {/* Decoration for Normal Mode */}
            {!isSimpleMode && !allDone && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full pointer-events-none" />
            )}

            <div className="relative z-10">
                <h2 className={`font-bold mb-2 flex items-center gap-2 ${isSimpleMode ? 'text-3xl' : 'text-xl tracking-tight'}`}>
                    {allDone 
                        ? <span className="text-green-600 dark:text-green-400 flex items-center gap-2"><Check className="w-6 h-6" /> Done!</span> 
                        : getText('tasks_title', 'Tasks for Today')
                    }
                </h2>
                
                {(!allDone || !isSimpleMode) && (
                    <p className={`leading-relaxed mb-6 ${isSimpleMode ? 'text-xl text-black font-medium' : 'text-sm text-muted-foreground'}`}>
                        {allDone 
                            ? getText('intro_done', 'Great job! See you tomorrow!') 
                            : getText('intro_pending', 'Please complete these tasks.')
                        }
                    </p>
                )}
                
                {/* Progress Bar */}
                <div className={`rounded-full overflow-hidden ${isSimpleMode ? 'h-6 bg-gray-200 border-2 border-black' : 'h-1.5 bg-secondary'}`}>
                    <div 
                        className={`h-full transition-all duration-700 ease-out ${allDone ? 'bg-green-500' : 'bg-blue-600'}`}
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
                            overflow-hidden
                            ${isSimpleMode 
                                ? `rounded-xl border-4 ${isDone ? 'border-green-600 bg-green-50 opacity-60' : 'border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none'}`
                                : `rounded-[1.5rem] border ${isDone ? 'bg-secondary/30 border-transparent opacity-60' : 'bg-card/80 backdrop-blur-sm border-border/50 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5'}`
                            }
                        `}
                    >
                        {/* Image Section */}
                        {task.image_path && (
                             <div className={`w-full bg-secondary relative overflow-hidden ${isSimpleMode ? 'h-64 border-b-4 border-black' : 'h-48'}`}>
                                <img 
                                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/task-images/${task.image_path}`} 
                                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isDone ? 'grayscale' : ''}`}
                                />
                                {isDone && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-300">
                                        <div className="bg-green-500 text-white rounded-full p-3 shadow-lg transform scale-125">
                                            <Check className="w-8 h-8" strokeWidth={4} />
                                        </div>
                                    </div>
                                )}
                             </div>
                        )}

                        <div className={`flex gap-4 items-start ${isSimpleMode ? 'p-6 block' : 'p-5'}`}>
                            {/* Icon */}
                            {!task.image_path && (
                                <div className={`shrink-0 flex items-center justify-center transition-all duration-300
                                    ${isSimpleMode 
                                        ? `w-16 h-16 rounded-xl mb-4 border-2 border-black ${isDone ? 'bg-green-200' : 'bg-yellow-200'}` 
                                        : `w-12 h-12 rounded-2xl ${isDone ? 'bg-green-100 text-green-600 dark:bg-green-900/20' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 shadow-sm'}`
                                    }`}>
                                    {isDone 
                                        ? <Check className={isSimpleMode ? "w-8 h-8 text-black" : "w-6 h-6"} /> 
                                        : <Droplets className={isSimpleMode ? "w-8 h-8 text-black" : "w-6 h-6"} />
                                    }
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className={`font-bold leading-tight ${isSimpleMode ? 'text-3xl text-black mb-3' : 'text-lg text-foreground mb-1'}`}>
                                        {task.title}
                                    </h3>
                                    {!isSimpleMode && !task.image_path && (
                                         <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isDone ? 'bg-green-500 border-green-500' : 'border-border'}`}>
                                              {isDone && <Check size={12} className="text-white" />}
                                         </div>
                                    )}
                                </div>
                                
                                {!isSimpleMode && (
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md tracking-wider bg-secondary/80 text-secondary-foreground`}>
                                            <Clock size={10} />
                                            {tForms(`freq_${task.frequency_type}`) || task.frequency_type}
                                        </span>
                                    </div>
                                )}

                                <p className={`leading-relaxed ${isSimpleMode ? 'text-xl text-black font-medium mb-6' : 'text-sm text-muted-foreground'}`}>
                                    {task.description || getText('no_description', 'No description provided.')}
                                </p>
                                
                                {/* SIMPLE MODE BUTTON */}
                                {isSimpleMode && (
                                    <button className={`
                                        w-full py-4 rounded-xl text-xl font-black uppercase tracking-wider border-2 border-black transition-transform active:scale-95
                                        ${isDone 
                                            ? 'bg-gray-100 text-gray-500' 
                                            : 'bg-black text-white'
                                        }
                                    `}>
                                        {isDone ? t('simple_mode_done') : t('simple_mode_todo')}
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {/* Normal Button Bar */}
                        {!isSimpleMode && task.image_path && (
                            <div className={`px-5 pb-5 pt-0 transition-all ${isDone ? 'opacity-50' : ''}`}>
                                <Button 
                                    variant={isDone ? "outline" : "default"} 
                                    className={`w-full h-11 rounded-xl font-bold shadow-sm transition-all active:scale-[0.98] ${
                                        isDone 
                                            ? 'border-green-500 text-green-600 hover:text-green-700 hover:bg-green-50' 
                                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                                    }`}
                                >
                                    {isDone ? (
                                        <>
                                            <Check className="w-4 h-4 mr-2" />
                                            {getText('mark_done_button', 'Done')}
                                        </>
                                    ) : (
                                        <>
                                            {getText('mark_done_button', 'Mark as Done')}
                                            <ArrowRight className="w-4 h-4 ml-2 opacity-50" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>

        {/* EMERGENCY CONTACTS */}
        {(owner?.phone || owner?.whatsapp) && (
          <div className={`mt-12 pt-8 ${isSimpleMode ? 'border-t-4 border-black' : 'border-t border-border/50'}`}>
            <h2 className={`font-bold text-destructive mb-6 flex items-center gap-2 ${isSimpleMode ? 'text-3xl' : 'text-sm uppercase tracking-widest'}`}>
              <AlertTriangle className={isSimpleMode ? "w-8 h-8" : "w-4 h-4"} />
              {getText('emergency.title', 'Emergency Contact')}
            </h2>
            
            <div className="grid gap-4">
              {owner.phone && (
                <a href={`tel:${owner.phone}`} className={`flex items-center gap-4 p-4 rounded-2xl transition-all active:scale-[0.98] ${
                    isSimpleMode 
                        ? 'bg-red-50 border-4 border-red-600 hover:bg-red-100' 
                        : 'bg-card/50 backdrop-blur-sm border border-red-200/50 hover:bg-red-50/50 dark:hover:bg-red-900/10 shadow-sm'
                }`}>
                  <div className={`rounded-full flex items-center justify-center shrink-0 ${
                      isSimpleMode ? 'bg-red-600 text-white w-16 h-16 border-2 border-black' : 'bg-red-100 dark:bg-red-900/30 p-3 text-red-600 w-12 h-12'
                  }`}>
                    <Phone size={isSimpleMode ? 32 : 20} />
                  </div>
                  <div>
                    <div className={`font-bold leading-none ${isSimpleMode ? 'text-2xl text-black mb-1' : 'text-foreground mb-1'}`}>
                        {getText('emergency.call_button', 'Call Owner')}
                    </div>
                    <div className={`${isSimpleMode ? 'text-xl font-mono text-black' : 'text-sm text-muted-foreground font-mono'}`}>{owner.phone}</div>
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
