import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertTriangle, Phone, Calendar } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { TaskCard } from '@/components/sitter/task-card' 
import LanguageSwitcher from '@/components/language-switcher'

export default async function SitterPage({
  params
}: {
  params: Promise<{ locale: string; token: string }>
}) {
  const { token, locale } = await params
  const t = await getTranslations('Sitter')
  const supabase = await createClient()

  // Tank anhand des Tokens laden
  const { data: tank } = await supabase
    .from('tanks')
    .select('*')
    .eq('share_token', token)
    .single()

  if (!tank) notFound()

  // Tasks laden
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('tank_id', tank.id)
    .order('created_at', { ascending: true })

  // Datum formatieren (für den Header)
  const today = new Date().toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      
      {/* Header mit Language Switcher */}
      <div className="bg-white border-b sticky top-0 z-10 px-4 py-3 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl shadow-inner">
            🐟
          </div>
          <div>
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">TankSitter</h2>
            <h1 className="text-lg font-bold text-slate-900 leading-none truncate max-w-[150px]">{tank.name}</h1>
          </div>
        </div>
        <LanguageSwitcher />
      </div>

      <div className="max-w-md mx-auto">
        
        {/* Notfall Kontakt (Prominent!) */}
        {tank.emergency_contact && (
          <div className="mx-4 mt-6">
            <a href={`https://wa.me/${tank.emergency_contact.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
              <Button variant="destructive" className="w-full gap-2 shadow-md h-12 text-base font-bold bg-red-500 hover:bg-red-600" size="lg">
                <AlertTriangle className="h-5 w-5" />
                {t('emergency_button')}
              </Button>
            </a>
          </div>
        )}

        <div className="px-4 space-y-6">
          
          {/* Datums-Header */}
          <div className="flex items-center gap-2 mt-8 mb-4">
            <Calendar className="text-blue-600 h-5 w-5" />
            <h3 className="font-bold text-slate-800 text-lg capitalize">
              {today}
            </h3>
          </div>

          {/* Task Liste */}
          <div className="space-y-6">
            {tasks && tasks.length > 0 ? (
              tasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <div className="text-center p-10 bg-white rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-500 font-medium">Alles erledigt! 🎉</p>
                <p className="text-slate-400 text-sm mt-1">Keine Aufgaben gefunden.</p>
              </div>
            )}
          </div>
          
          <div className="h-10"></div> {/* Spacer */}
        </div>
      </div>
    </div>
  )
}
