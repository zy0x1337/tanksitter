import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { 
  Plus, 
  Settings, 
  QrCode, 
  UserCog, 
  ArrowRight, 
  Fish, 
  Waves, 
  Droplets, 
  Anchor, 
  Shrimp, 
  Leaf, 
  Sprout, 
  Thermometer 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ShareDialog } from '@/components/share-dialog'
import { ModeToggle } from '@/components/mode-toggle'
import { InstallPrompt } from '@/components/install-prompt'

// Icon Mapping für dynamische Anzeige
const iconMap: Record<string, any> = {
  fish: Fish,
  shrimp: Shrimp,
  planted: Sprout,
  waves: Waves,
  nature: Leaf,
  tech: Thermometer,
  chem: Droplets,
  deco: Anchor
}

export default async function Dashboard({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('Dashboard')
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`) 

  // Tanks laden
  const { data: tanks } = await supabase
    .from('tanks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background p-4 pb-24 md:p-8 relative overflow-hidden transition-colors duration-700">
      
      {/* NOISE & GRID BACKGROUNDS */}
      <div className="bg-noise pointer-events-none fixed inset-0 z-50"></div>
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] -z-20 mask-image-gradient" />
      
      {/* AMBIENT GLOWS */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
         <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
          <div className="space-y-1.5">
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">{t('your_tanks')}</h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2 text-sm md:text-base">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                {user.email}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <ModeToggle />
             
             <Link href={`/${locale}/dashboard/settings`}>
                <Button variant="outline" size="icon" className="rounded-xl border-border/60 hover:bg-secondary hover:border-border transition-all w-11 h-11">
                  <UserCog className="w-5 h-5 text-muted-foreground" />
                </Button>
             </Link>

             <Link href={`/${locale}/dashboard/new`}>
                <Button className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 font-semibold">
                  <Plus className="w-5 h-5 mr-2" />
                  {t('new_tank_button')}
                </Button>
             </Link>
          </div>
        </div>

        {/* GRID */}
        {tanks && tanks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tanks.map((tank) => {
              // Icon dynamisch auswählen (Fallback auf Fish)
              const TankIcon = iconMap[tank.icon] || Fish

              return (
                <div key={tank.id} className="group relative bg-card/60 dark:bg-card/40 backdrop-blur-md rounded-[2rem] border border-border/50 hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden flex flex-col">
                  
                  {/* Decoration Gradient */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700 pointer-events-none" />
                  
                  <div className="p-8 relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl flex items-center justify-center shadow-inner border border-white/20 dark:border-white/5 group-hover:scale-110 transition-transform duration-500">
                            <TankIcon className="w-7 h-7 text-blue-500 group-hover:text-cyan-500 transition-colors" />
                        </div>
                        <ShareDialog 
                          tankName={tank.name}
                          shareToken={tank.share_token}
                          triggerButton={
                             <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/10 transition-colors">
                                <QrCode className="w-5 h-5" />
                             </Button>
                          }
                        />
                    </div>

                    <h3 className="font-bold text-2xl mb-2 text-foreground tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{tank.name}</h3>
                    <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mb-8">
                      {t('created_at', { date: new Date(tank.created_at).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US') })}
                    </p>

                    <div className="mt-auto pt-4">
                      <Link href={`/${locale}/dashboard/${tank.id}`} className="block">
                        <Button 
                          className="w-full justify-between bg-white dark:bg-white/5 border border-border/50 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 text-foreground h-12 rounded-xl group-hover:shadow-lg transition-all"
                        >
                          <span className="font-semibold">{t('manage_button')}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          // Empty State - Optimized with Fish Icon
          <div className="flex flex-col items-center justify-center py-32 px-4 text-center border-2 border-dashed border-border/60 rounded-[3rem] bg-secondary/5 relative overflow-hidden group">
             {/* Background Blob for Empty State */}
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
             
            <div className="relative z-10">
                <div className="w-24 h-24 bg-gradient-to-tr from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-3xl flex items-center justify-center mb-8 shadow-inner animate-float ring-1 ring-white/20">
                  <Fish className="w-12 h-12 text-blue-500 dark:text-cyan-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight">{t('no_tanks')}</h3>
                <p className="text-muted-foreground mb-8 max-w-sm text-lg leading-relaxed text-balance">
                  {t('no_tanks_desc')}
                </p>
                <Link href={`/${locale}/dashboard/new`}>
                  <Button size="lg" className="rounded-2xl h-14 px-8 text-lg bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/20 hover:-translate-y-1 transition-all group-hover:shadow-blue-500/30">
                    <Plus className="w-5 h-5 mr-2" />
                    {t('new_tank_button')}
                  </Button>
                </Link>
            </div>
          </div>
        )}

      </div>
      <InstallPrompt />
    </div>
  )
}
