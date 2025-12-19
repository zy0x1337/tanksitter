import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ArrowLeft, Mail, MapPin, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function ImprintPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('Legal')

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 py-12 px-4 sm:px-6 relative">
      
      <div className="max-w-2xl mx-auto mt-8">
        
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
            
            <h1 className="text-3xl font-bold mb-2 tracking-tight text-slate-900">{t('imprint_title')}</h1>
            <p className="text-slate-500 mb-10 text-sm font-medium">{t('imprint_subtitle')}</p>
            
            <div className="space-y-10">
                
                {/* Section 1 */}
                <div className="flex gap-5 items-start">
                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 shrink-0">
                        <MapPin size={22} />
                    </div>
                    <div>
                        <h3 className="font-bold mb-1.5 text-base text-slate-900">{t('imprint.section1_title')}</h3>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            Mika Roprecht<br />
                            Lönsstr. 2<br />
                            31515 Wunstorf<br />
                            Germany
                        </p>
                    </div>
                </div>

                {/* Section 2 */}
                <div className="flex gap-5 items-start">
                    <div className="bg-purple-50 p-3 rounded-2xl text-purple-600 shrink-0">
                        <Mail size={22} />
                    </div>
                    <div>
                        <h3 className="font-bold mb-1.5 text-base text-slate-900">{t('imprint.section2_title')}</h3>
                        <p className="text-slate-600 text-sm">
                            <a href="mailto:zy0x1337@proton.me" className="text-slate-900 hover:text-blue-600 transition-colors font-medium underline underline-offset-4 decoration-slate-200 hover:decoration-blue-600">
                                zy0x1337@proton.me
                            </a>
                        </p>
                    </div>
                </div>

                {/* Section 3 */}
                <div className="flex gap-5 items-start">
                     <div className="bg-amber-50 p-3 rounded-2xl text-amber-600 shrink-0">
                        <Scale size={22} />
                    </div>
                    <div>
                        <h3 className="font-bold mb-1.5 text-base text-slate-900">{t('imprint.section3_title')}</h3>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-bold">{t('imprint.section3_subtitle')}</p>
                        <p className="text-slate-600 text-sm">
                            Mika Roprecht<br />
                            Lönsstr. 2, 31515 Wunstorf
                        </p>
                    </div>
                </div>
            </div>

            <div className="my-10 h-px bg-slate-100 w-full" />

            {/* Disclaimer */}
            <div className="bg-slate-50 p-5 rounded-2xl text-xs text-slate-500 leading-relaxed border border-slate-100">
                <p>{t('imprint.disclaimer_text')}</p>
            </div>

        </div>
      </div>
    </div>
  )
}
