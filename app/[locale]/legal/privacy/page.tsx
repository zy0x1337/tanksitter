import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ArrowLeft, Shield, Server, Database, Lock, Image as ImageIcon, Scale, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function PrivacyPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('Legal')

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 py-12 px-4 sm:px-6 relative">
      
      <div className="max-w-3xl mx-auto mt-8">
        
        {/* Back Navigation */}
        <div className="mb-8">
           <Link href={`/${locale}`}>
             <Button variant="ghost" className="-ml-4 text-slate-500 hover:text-slate-900 pl-0 pr-4 hover:bg-transparent group hover:underline underline-offset-4">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                {t('back_home')}
             </Button>
           </Link>
        </div>

        {/* Content Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50">
            
            <div className="mb-10">
                <h1 className="text-3xl font-bold mb-2 tracking-tight text-slate-900">{t('privacy_title')}</h1>
                <p className="text-slate-500 text-lg">{t('privacy_subtitle')}</p>
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                    {t('last_updated')}
                </div>
            </div>
            
            <div className="space-y-12">
                
                {/* 1. General */}
                <div className="flex gap-5 items-start">
                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 shrink-0">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h2 className="font-bold text-xl text-slate-900 mb-3">{t('privacy.gen_title')}</h2>
                        <div className="text-slate-600 text-sm leading-relaxed space-y-4">
                            <p>{t('privacy.gen_text')}</p>
                        </div>
                    </div>
                </div>

                {/* 2. Hosting & Backend */}
                <div className="flex gap-5 items-start">
                    <div className="bg-purple-50 p-3 rounded-2xl text-purple-600 shrink-0">
                        <Server size={24} />
                    </div>
                    <div className="w-full">
                        <h2 className="font-bold text-xl text-slate-900 mb-4">{t('privacy.hosting_title')}</h2>
                        
                        <div className="grid gap-4">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                                    Vercel Inc.
                                </h3>
                                <p className="text-slate-600 text-sm">{t('privacy.vercel_text')}</p>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                                    <Database size={14} /> Supabase
                                </h3>
                                <p className="text-slate-600 text-sm">{t('privacy.supabase_text')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Data Collection */}
                <div className="flex gap-5 items-start">
                    <div className="bg-amber-50 p-3 rounded-2xl text-amber-600 shrink-0">
                        <Lock size={24} />
                    </div>
                    <div>
                        <h2 className="font-bold text-xl text-slate-900 mb-3">{t('privacy.data_title')}</h2>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li className="flex gap-2">
                                <span className="font-semibold text-slate-900 min-w-[100px]">{t('privacy.data_account')}</span>
                                <span>{t('privacy.data_account_text')}</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-semibold text-slate-900 min-w-[100px]">{t('privacy.data_usage')}</span>
                                <span>{t('privacy.data_usage_text')}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 4. Images */}
                <div className="flex gap-5 items-start">
                    <div className="bg-pink-50 p-3 rounded-2xl text-pink-600 shrink-0">
                        <ImageIcon size={24} />
                    </div>
                    <div>
                        <h2 className="font-bold text-xl text-slate-900 mb-3">{t('privacy.img_title')}</h2>
                        <div className="bg-pink-50/50 p-4 rounded-xl border border-pink-100 text-sm text-slate-700">
                             <p className="mb-2 font-medium text-pink-900">{t('privacy.img_note')}</p>
                             {t('privacy.img_text')}
                        </div>
                    </div>
                </div>

                {/* 5. Rights */}
                <div className="flex gap-5 items-start">
                     <div className="bg-green-50 p-3 rounded-2xl text-green-600 shrink-0">
                        <Scale size={24} />
                    </div>
                    <div>
                        <h2 className="font-bold text-xl text-slate-900 mb-3">{t('privacy.rights_title')}</h2>
                        <p className="text-slate-600 text-sm leading-relaxed">{t('privacy.rights_text')}</p>
                    </div>
                </div>

                {/* Contact Footer */}
                <div className="mt-8 pt-8 border-t border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                        <Mail size={16} />
                    </div>
                    <div className="text-sm">
                        <span className="text-slate-500 mr-2">{t('questions')}</span>
                        <a href="mailto:zy0x1337@proton.me" className="font-semibold text-slate-900 hover:text-blue-600 underline decoration-slate-200 underline-offset-4 hover:decoration-blue-600 transition-all">
                            zy0x1337@proton.me
                        </a>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  )
}
