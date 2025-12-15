import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Plus, Settings, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ShareDialog } from '@/components/share-dialog'
import { InstallPrompt } from '@/components/install-prompt'

export default async function Dashboard({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('Dashboard')
  const supabase = await createClient()

  // Auth Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  // Daten laden
  const { data: tanks } = await supabase
    .from('tanks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-24 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('your_tanks')}</h1>
            <p className="text-slate-500 text-sm mt-1">{user.email}</p>
          </div>
          <Link href={`/${locale}/dashboard/new`}>
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              {t('new_tank_button')}
            </Button>
          </Link>
        </div>

        {/* Grid */}
        {tanks && tanks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tanks.map((tank) => (
              <div key={tank.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group relative overflow-hidden">
                
                {/* Deko Background */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity" />

                <div className="relative">
                  <h3 className="font-bold text-xl text-slate-900 mb-1 truncate pr-8">{tank.name}</h3>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-6">
                    {t('created_at', { date: new Date(tank.created_at).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US') })}
                  </p>

                  <div className="flex gap-2">
                    <Link href={`/${locale}/dashboard/${tank.id}`} className="flex-1">
                      <Button variant="outline" className="w-full justify-between group-hover:border-blue-200">
                        {t('manage_button')}
                        <Settings className="w-4 h-4 text-slate-400" />
                      </Button>
                    </Link>
                    
                    {/* Share Dialog Button */}
                    <ShareDialog 
                      tankName={tank.name}
                      shareToken={tank.share_token}
                      triggerButton={
                        <Button variant="secondary" size="icon" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 shadow-sm">
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
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl grayscale opacity-50">🐠</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t('no_tanks')}</h3>
            <p className="text-slate-500 mb-6 max-w-xs mx-auto text-sm leading-relaxed">
              {t('no_tanks_desc')}
            </p>
            <Link href={`/${locale}/dashboard/new`}>
              <Button variant="default" className="bg-blue-600 rounded-xl">
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
