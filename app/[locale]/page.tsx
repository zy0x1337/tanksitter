import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from '@/components/language-switcher'
import { CheckCircle2, QrCode, Camera } from 'lucide-react'

export default function Home() {
  const t = useTranslations('Index')

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-hidden relative font-sans">
      
      {/* Navbar / Top Right - Language Switcher */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageSwitcher />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Text & CTA */}
          <div className="lg:col-span-6 text-center lg:text-left mb-16 lg:mb-0 space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-700">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              <span className="block text-blue-600">{t('title')}</span>
              <span className="block text-3xl sm:text-4xl lg:text-5xl mt-2 font-bold text-slate-700">
                {t('subtitle')}
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t('description')}
              <br className="hidden lg:block"/>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all hover:scale-105 active:scale-95">
                  {t('start_button')}
                </Button>
              </Link>
              {/* Optional: Scroll to features or demo */}
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 rounded-full px-8 border-2 text-slate-600 hover:bg-slate-50">
                Live Demo
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-100 mt-8">
              <div className="flex flex-col items-center lg:items-start group">
                <div className="p-2 bg-blue-50 rounded-lg mb-2 group-hover:bg-blue-100 transition-colors">
                  <Camera className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-bold text-slate-900">{t('trust_badges.photo_title')}</span>
                <span className="text-xs text-slate-500">{t('trust_badges.photo_desc')}</span>
              </div>
              <div className="flex flex-col items-center lg:items-start group">
                <div className="p-2 bg-blue-50 rounded-lg mb-2 group-hover:bg-blue-100 transition-colors">
                  <QrCode className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-bold text-slate-900">{t('trust_badges.qr_title')}</span>
                <span className="text-xs text-slate-500">{t('trust_badges.qr_desc')}</span>
              </div>
              <div className="flex flex-col items-center lg:items-start group">
                <div className="p-2 bg-blue-50 rounded-lg mb-2 group-hover:bg-blue-100 transition-colors">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-bold text-slate-900">{t('trust_badges.free_title')}</span>
                <span className="text-xs text-slate-500">{t('trust_badges.free_desc')}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Phone Mockup (Pure CSS) */}
          <div className="lg:col-span-6 relative flex justify-center perspective-1000 animate-in zoom-in fade-in duration-1000 delay-200">
            {/* Blob Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -z-10 animate-pulse"></div>

            {/* IPHONE FRAME */}
            <div className="relative mx-auto border-slate-900 bg-slate-900 border-[12px] rounded-[3rem] h-[650px] w-[340px] shadow-2xl rotate-[-3deg] hover:rotate-0 transition-transform duration-500 ease-out">
              {/* Notch / Buttons */}
              <div className="h-[32px] w-[3px] bg-slate-800 absolute -start-[15px] top-[72px] rounded-s-lg"></div>
              <div className="h-[46px] w-[3px] bg-slate-800 absolute -start-[15px] top-[124px] rounded-s-lg"></div>
              <div className="h-[46px] w-[3px] bg-slate-800 absolute -end-[15px] top-[124px] rounded-e-lg"></div>
              
              {/* SCREEN CONTENT */}
              <div className="rounded-[2.2rem] overflow-hidden h-full w-full bg-slate-50 flex flex-col relative">
                
                {/* Simulated Header */}
                <div className="bg-white p-5 pt-10 border-b border-slate-100 shadow-sm z-10 sticky top-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                        {t('mockup.view_title')}
                      </div>
                      <div className="text-lg font-bold text-slate-800 truncate max-w-[180px]">
                        {t('mockup.tank_name')}
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg shadow-inner">🐟</div>
                  </div>
                </div>

                {/* Simulated Content Scroll Area */}
                <div className="p-4 space-y-4 overflow-hidden relative flex-1 bg-slate-50/50">
                  
                  {/* Task Card 1 (Done) */}
                  <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex gap-3 opacity-60 scale-95 origin-top transition-all hover:scale-100 hover:opacity-100 cursor-default">
                     <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">✓</div>
                     <div>
                       <div className="font-bold text-green-900 line-through text-sm">
                         {t('mockup.task_done_title')}
                       </div>
                       <div className="text-xs text-green-700 mt-0.5">
                         {t('mockup.task_done_time')}
                       </div>
                     </div>
                  </div>

                  {/* Task Card 2 (Active) */}
                  <div className="bg-white p-0 rounded-xl shadow-md border border-slate-100 overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="h-36 bg-slate-200 relative overflow-hidden">
                       {/* Simuliertes Foto Pattern */}
                       <div className="absolute inset-0 flex items-center justify-center text-5xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-300">🥄</div>
                       
                       <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                         <Camera className="w-3 h-3" /> {t('mockup.photo_label')}
                       </div>
                    </div>
                    <div className="p-4">
                      <div className="font-bold text-slate-900 text-lg leading-tight">
                        {t('mockup.task_active_title')}
                      </div>
                      <div className="text-slate-500 text-xs mt-2 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {t('mockup.task_active_desc')}
                      </div>
                      <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-center shadow-lg shadow-blue-200 active:scale-95 transition-all text-sm">
                        {t('mockup.button_done')}
                      </button>
                    </div>
                  </div>

                  {/* Finger Hint Animation */}
                  <div className="absolute bottom-12 right-6 pointer-events-none animate-bounce z-20">
                    <div className="bg-yellow-400 text-yellow-950 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-yellow-300 whitespace-nowrap">
                      {t('mockup.hint_finger')}
                    </div>
                  </div>

                </div>

                {/* Footer */}
                <div className="bg-white p-3 border-t border-slate-100 text-center text-[9px] text-slate-400 font-medium tracking-wide uppercase">
                  Powered by TankSitter
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
