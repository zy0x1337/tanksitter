import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Plus, Settings, QrCode, UserCog } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ShareDialog } from '@/components/share-dialog'
import { ModeToggle } from '@/components/mode-toggle'
import { InstallPrompt } from '@/components/install-prompt'

export default async function Dashboard({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('Dashboard')
  const supabase = await createClient()

  // User abrufen
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/login`) 
  }

  // Tanks laden
  const { data: tanks } = await supabase
    .from('tanks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background p-4 pb-24 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('your_tanks')}</h1>
            <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
          </div>
          
          <div className="flex items-center gap-3">
             <ModeToggle />
             
             {/* Profile / Settings Button */}
             <Link href={`/${locale}/dashboard/settings`}>
                <Button variant="outline" size="icon" title="Settings">
                  <UserCog className="w-4 h-4" />
                </Button>
             </Link>

             <Link href={`/${locale}/dashboard/new`}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  {t('new_tank_button')}
                </Button>
             </Link>
          </div>
        </div>

        {/* Grid */}
        {tanks && tanks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tanks.map((tank) => (
              <div key={tank.id} className="bg-card text-card-foreground rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-all group relative overflow-hidden">
                
                {/* Deko Background */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/20 rounded-bl-full -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity" />

                <div className="relative">
                  <h3 className="font-bold text-xl mb-1 truncate pr-8">{tank.name}</h3>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-6">
                    {t('created_at', { date: new Date(tank.created_at).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US') })}
                  </p>

                  <div className="flex gap-2">
                    <Link href={`/${locale}/dashboard/${tank.id}`} className="flex-1">
                      <Button variant="outline" className="w-full justify-between group-hover:border-blue-200 dark:group-hover:border-blue-800">
                        {t('manage_button')}
                        <Settings className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </Link>
                    
                    {/* Share Dialog Button */}
                    <ShareDialog 
                      tankName={tank.name}
                      shareToken={tank.share_token}
                      triggerButton={
                        <Button variant="secondary" size="icon" className="bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border shadow-sm">
                           <QrCode className="w-4 h-4" />
                        </Button>
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-20 bg-card rounded-3xl border-2 border-dashed border-border">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl grayscale opacity-50">🐠</span>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{t('no_tanks')}</h3>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto text-sm leading-relaxed">
              {t('no_tanks_desc')}
            </p>
            <Link href={`/${locale}/dashboard/new`}>
              <Button variant="default" className="bg-blue-600 text-white rounded-xl">
                {t('new_tank_button')}
              </Button>
            </Link>
          </div>
        )}

      </div>

      <InstallPrompt />

    </div>
  )
}
