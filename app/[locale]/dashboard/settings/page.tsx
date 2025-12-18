import { createClient } from '@/lib/supabase-server'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
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
  // Hinweis: Wir nutzen .maybeSingle() statt .single(), um Fehler zu vermeiden, 
  // falls noch kein Profil existiert (z.B. bei neuen Usern).
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Back Button */}
        <div className="mb-6">
          <Link href={`/${locale}/dashboard`}>
            <Button variant="ghost" className="pl-0 hover:pl-2 transition-all -ml-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('back_to_dashboard') || 'Back to Dashboard'}
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-2 tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          {t('contact_info_desc')}
        </p>
        
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 pb-4 border-b border-border">
            <span className="text-xl">☎️</span> {t('contact_info_title')}
          </h2>

          {/* Client Form Component */}
          <ProfileForm user={user} initialData={profile} />
        </div>

      </div>
    </div>
  )
}
