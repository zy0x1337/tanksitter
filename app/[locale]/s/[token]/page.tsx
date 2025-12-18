import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Phone, 
  MessageCircle, 
  Send, 
  Info,
  Camera
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TaskCard } from '@/components/sitter/task-card' // Annahme: Du hast Tasks ausgelagert oder willst sie hier inline haben?
// Falls TaskCard noch nicht existiert, integriere ich die Logik hier direkt der Einfachheit halber.
// Aber sauberer ist eine separate Komponente für die Interaktivität (Mark as Done).

// Ich erstelle hier eine "Server Component" Page, die Client Components für die Tasks nutzt.

export default async function SitterPage({
  params
}: {
  params: Promise<{ locale: string; token: string }>
}) {
  const { locale, token } = await params
  const t = await getTranslations('SitterView')
  const supabase = await createClient()

  // 1. Tank & Owner Profile laden
  // Wir nutzen einen Join auf die 'profiles' Tabelle über user_id
  const { data: tank, error } = await supabase
    .from('tanks')
    .select(`
      *,
      tasks (*),
      profiles:user_id (
        phone,
        whatsapp,
        telegram,
        emergency_notes
      )
    `)
    .eq('share_token', token)
    .single()

  if (error || !tank) {
    notFound()
  }

  // Sortiere Tasks (z.B. nach Zeit oder Priorität)
  // Hier einfach nach created_at, aber idealerweise hast du ein 'order' feld oder 'time_of_day'
  const tasks = tank.tasks?.sort((a: any, b: any) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  ) || []

  // Profil-Daten extrahieren (kann Array oder Single Object sein je nach Supabase FK Setup, meist Single Object)
  const owner = Array.isArray(tank.profiles) ? tank.profiles[0] : tank.profiles

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      
      {/* Header Image / Name */}
      <div className="bg-white dark:bg-slate-900 border-b border-border shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
           <div>
             <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
               {t('header_subtitle')}
             </p>
             <h1 className="text-xl font-bold text-foreground truncate max-w-[200px] sm:max-w-sm">
               {tank.name}
             </h1>
           </div>
           <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
             <span className="text-2xl">🐠</span>
           </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-8">

        {/* Info Box (optional Beschreibung) */}
        {tank.description && (
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 p-4 rounded-xl text-sm flex gap-3 leading-relaxed">
            <Info className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
            <div>{tank.description}</div>
          </div>
        )}

        {/* Tasks Section */}
        <div>
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            {t('tasks_title')}
          </h2>
          
          <div className="space-y-4">
            {tasks.length > 0 ? (
              tasks.map((task: any) => (
                // Hier würde normalerweise deine interaktive <TaskItem /> Client Component stehen
                // Ich rendere es hier als statisches Beispiel, wie es aussehen sollte
                <div key={task.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                   {task.image_url && (
                     <div className="h-48 bg-slate-200 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={task.image_url} alt={task.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm">
                           <Camera size={12} /> {t('photo_label')}
                        </div>
                     </div>
                   )}
                   <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{task.title}</h3>
                        <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-muted-foreground uppercase">
                          {task.frequency || 'Daily'}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                        {task.description || t('no_description')}
                      </p>
                      
                      <Button className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 h-12 rounded-xl font-bold shadow-md">
                        <CheckCircle2 className="mr-2 w-5 h-5" /> 
                        {t('mark_done_button')}
                      </Button>
                   </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                <p className="text-muted-foreground">{t('no_tasks')}</p>
              </div>
            )}
          </div>
        </div>

        {/* EMERGENCY CONTACTS SECTION */}
        {(owner?.phone || owner?.whatsapp || owner?.telegram || owner?.emergency_notes) && (
          <div className="border-t border-border pt-8 mt-8">
            <h2 className="font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5" />
              {t('emergency.title')}
            </h2>
            
            <p className="text-sm text-muted-foreground mb-4">
              {t('emergency.subtitle')}
            </p>

            <div className="grid gap-3">
              {/* Phone Call */}
              {owner.phone && (
                <a href={`tel:${owner.phone}`} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm group">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-700 dark:text-green-400 group-hover:scale-110 transition-transform">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">{t('emergency.call_button')}</div>
                    <div className="text-xs text-muted-foreground">{owner.phone}</div>
                  </div>
                </a>
              )}
              
              {/* WhatsApp */}
              {owner.whatsapp && (
                <a 
                  href={`https://wa.me/${owner.whatsapp.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm group"
                >
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-700 dark:text-green-400 group-hover:scale-110 transition-transform">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">WhatsApp</div>
                    <div className="text-xs text-muted-foreground">{t('emergency.whatsapp_action')}</div>
                  </div>
                </a>
              )}

               {/* Telegram */}
               {owner.telegram && (
                <a 
                  href={`https://t.me/${owner.telegram.replace('@', '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm group"
                >
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <Send size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">Telegram</div>
                    <div className="text-xs text-muted-foreground">{owner.telegram}</div>
                  </div>
                </a>
              )}

              {/* Notes */}
              {owner.emergency_notes && (
                <div className="mt-2 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-xl text-sm">
                   <div className="font-bold text-yellow-800 dark:text-yellow-500 mb-1 text-xs uppercase tracking-wider">
                     {t('emergency.notes_label')}
                   </div>
                   <p className="text-yellow-900 dark:text-yellow-100 leading-relaxed whitespace-pre-wrap">
                     {owner.emergency_notes}
                   </p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
