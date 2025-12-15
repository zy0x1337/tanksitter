import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Calendar } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { TaskCard } from '@/components/sitter/task-card' 
import LanguageSwitcher from '@/components/language-switcher'

// Hilfsfunktion: Wochentag prüfen
function isTaskDueToday(task: any) {
  if (task.frequency_type === 'daily') return true
  if (task.frequency_type === 'once') return true
  
  if (task.frequency_type === 'weekly' && task.frequency_days) {
    // JS: 0 = Sonntag, 1 = Montag ...
    const todayIndex = new Date().getDay()
    // Wir nehmen an, du speicherst 0-6 in der DB. 
    // Falls du 1-7 speicherst, musst du hier anpassen.
    return task.frequency_days.includes(todayIndex)
  }
  return false
}

export default async function SitterPage({
  params
}: {
  params: Promise<{ locale: string; token: string }>
}) {
  const { token, locale } = await params
  const t = await getTranslations('Sitter')
  const supabase = await createClient()

  // 1. Tank laden
  const { data: tank } = await supabase
    .from('tanks')
    .select('*')
    .eq('share_token', token)
    .single()

  if (!tank) notFound()

  // 2. Tasks laden
  const { data: allTasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('tank_id', tank.id)
    .order('created_at', { ascending: true })

  // 3. Filtern: Nur was heute dran ist
  const tasks = allTasks?.filter(isTaskDueToday) || []

  // 4. Datum formatieren (Lokalisiert)
  const todayDate = new Date().toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 px-4 py-3 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl shadow-inner">
            🐟
          </div>
          <div className="overflow-hidden">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">TankSitter</h2>
            <h1 className="text-lg font-bold text-slate-900 leading-none truncate w-full">{tank.name}</h1>
          </div>
        </div>
        <LanguageSwitcher />
      </div>

      <div className="max-w-md mx-auto">
        
        {/* Notfall Kontakt Button */}
        {tank.emergency_contact && (
          <div className="mx-4 mt-6">
            <a href={`https://wa.me/${tank.emergency_contact.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
              <Button variant="destructive" className="w-full gap-2 shadow-md h-12 text-base font-bold bg-red-500 hover:bg-red-600 active:scale-95 transition-all">
                <AlertTriangle className="h-5 w-5" />
                {t('emergency_button')}
              </Button>
            </a>
          </div>
        )}

        <div className="px-4 space-y-6">
          
          {/* Datums-Anzeige */}
          <div className="flex items-center gap-2 mt-8 mb-4 px-1">
            <Calendar className="text-blue-600 h-5 w-5" />
            <h3 className="font-bold text-slate-800 text-lg capitalize">
              {todayDate}
            </h3>
          </div>

          {/* Task Liste */}
          <div className="space-y-8">
            {tasks.length > 0 ? (
              tasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <div className="text-center py-16 px-4 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <div className="text-4xl mb-4">🎉</div>
                <p className="text-slate-900 font-bold text-lg mb-1">{t('empty_title')}</p>
                <p className="text-slate-500">{t('empty_desc')}</p>
              </div>
            )}
          </div>
          
          <div className="h-10"></div>
        </div>
      </div>
    </div>
  )
}
