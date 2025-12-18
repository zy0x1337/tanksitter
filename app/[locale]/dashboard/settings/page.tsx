import { createClient } from '@/lib/supabase-server'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile-form'

export default async function SettingsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('Settings')
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  // Profil laden
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 pb-24">
      <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>
      
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">{t('contact_info_title')}</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {t('contact_info_desc')}
        </p>

        <ProfileForm user={user} initialData={profile} />
      </div>
    </div>
  )
}
