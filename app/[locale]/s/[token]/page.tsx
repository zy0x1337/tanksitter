import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertTriangle, Phone } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
// Wir brauchen eine Client Component für die "Erledigt"-Interaktion
import { TaskCard } from '@/components/sitter/task-card' 

export default async function SitterPage({
  params
}: {
  params: Promise<{ locale: string; token: string }>
}) {
  const { token, locale } = await params
  const t = await getTranslations('Sitter') // Du musst diese Keys gleich in de.json anlegen
  const supabase = await createClient()

  // 1. Tank anhand des TOKENS finden (Security by Obscurity UUID)
  // Wichtig: Wir suchen NICHT nach ID, sondern nach share_token!
  const { data: tank } = await supabase
    .from('tanks')
    .select('*')
    .eq('share_token', token)
    .single()

  if (!tank) notFound()

  // 2. Tasks laden
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('tank_id', tank.id)
  
  // Hier würden wir filtern: Welche Tasks sind HEUTE fällig?
  // Für MVP zeigen wir einfach alle "Daily" tasks und einmalige Tasks.

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Header (Mobil optimiert) */}
      <div className="bg-white border-b sticky top-0 z-10 px-4 py-4 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-xs font-uppercase text-gray-400 tracking-wider">AQUARIUM</h2>
          <h1 className="text-xl font-bold text-slate-900">{tank.name}</h1>
        </div>
        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
          🐟
        </div>
      </div>

      {/* Notfall Kontakt (Immer sichtbar) */}
      {tank.emergency_contact && (
        <div className="m-4 mb-6">
          <a href={`https://wa.me/${tank.emergency_contact.replace(/[^0-9]/g, '')}`} target="_blank">
            <Button variant="destructive" className="w-full gap-2 shadow-md" size="lg">
              <AlertTriangle className="h-5 w-5" />
              {t('emergency_button')}
            </Button>
          </a>
        </div>
      )}

      <div className="px-4 space-y-6">
        <div className="flex items-center gap-2 mt-6 mb-2">
          <CheckCircle2 className="text-green-600 h-5 w-5" />
          <h3 className="font-semibold text-slate-700">{t('todo_today_title')}</h3>
        </div>

        {/* Task Liste */}
        <div className="space-y-6">
          {tasks?.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
          
          {(!tasks || tasks.length === 0) && (
            <div className="text-center p-8 bg-white rounded-xl border border-dashed">
              <p className="text-gray-500">Nichts zu tun! 🎉</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
