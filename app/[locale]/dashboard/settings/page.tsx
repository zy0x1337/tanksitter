import { createClient } from '@/lib/supabase-server'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft, UserCog, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export default async function SettingsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('Settings')
  const supabase = await createClient()

  // Auth Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  // Profil laden
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 relative overflow-hidden flex flex-col items-center justify-center">
      
      {/* PREMIUM BACKGROUNDS */}
      <div className="bg-noise pointer-events-none fixed inset-0 z-50"></div>
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] -z-20 mask-image-gradient" />
      
      {/* AMBIENT GLOWS */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
         <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-purple-500/5 dark:bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-2xl relative z-10 animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">
        
        {/* Back Button */}
        <div className="mb-8">
          <Link href={`/${locale}/dashboard`}>
            <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-blue-500 transition-colors group text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              {t('back_to_dashboard')}
            </Button>
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-card/80 dark:bg-card/50 backdrop-blur-xl border border-border/50 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 overflow-hidden relative">
           
           {/* Decoration Header */}
           <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500" />

           <div className="p-8 sm:p-12">
              
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-10 border-b border-border/40 pb-8">
                  <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center shadow-sm border border-purple-100 dark:border-purple-800">
                      <UserCog className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                      <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{t('title')}</h1>
                      <p className="text-muted-foreground font-medium text-lg leading-snug">
                         {t('contact_info_desc')}
                      </p>
                  </div>
              </div>

              {/* Form Section */}
              <div className="space-y-6">
                  <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">
                     <ShieldAlert className="w-4 h-4 text-amber-500" />
                     {t('contact_info_title')}
                  </div>

                  {/* Client Form Component */}
                  <div className="bg-background/40 p-6 rounded-2xl border border-border/40">
                     <ProfileForm user={user} initialData={profile} />
                  </div>
              </div>

           </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground mt-8 opacity-40 font-mono uppercase tracking-widest">
            Data Privacy Protected
        </p>

      </div>
    </div>
  )
}
