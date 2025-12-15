import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from '@/components/language-switcher'
import { CheckCircle2, QrCode, Camera } from 'lucide-react'

export default function Home() {
  const t = useTranslations('Index')

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-hidden relative">
      
      {/* Navbar / Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageSwitcher />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Text & CTA */}
          <div className="lg:col-span-6 text-center lg:text-left mb-16 lg:mb-0 space-y-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              <span className="block text-blue-600">{t('title')}</span>
              <span className="block text-3xl sm:text-4xl lg:text-5xl mt-2 font-bold text-slate-700">
                {t('subtitle')}
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t('description')}
              <br className="hidden lg:block"/>
              Vergiss Zettelwirtschaft und WhatsApp-Chaos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all hover:scale-105">
                  {t('start_button')}
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 rounded-full px-8 border-2 text-slate-600 hover:bg-slate-50">
                Live Demo
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-100 mt-8">
              <div className="flex flex-col items-center lg:items-start">
                <Camera className="w-6 h-6 text-blue-500 mb-2" />
                <span className="text-sm font-medium text-slate-900">Foto-Tasks</span>
                <span className="text-xs text-slate-500">Statt langer Texte</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <QrCode className="w-6 h-6 text-blue-500 mb-2" />
                <span className="text-sm font-medium text-slate-900">QR Zugang</span>
                <span className="text-xs text-slate-500">Kein Login nötig</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <CheckCircle2 className="w-6 h-6 text-blue-500 mb-2" />
                <span className="text-sm font-medium text-slate-900">100% Free</span>
                <span className="text-xs text-slate-500">Für Hobbyisten</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Phone Mockup (Pure CSS) */}
          <div className="lg:col-span-6 relative flex justify-center perspective-1000">
            {/* Blob Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -z-10 animate-pulse"></div>

            {/* IPHONE FRAME */}
            <div className="relative mx-auto border-slate-900 bg-slate-900 border-[12px] rounded-[3rem] h-[650px] w-[340px] shadow-2xl rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
              {/* Notch / Buttons */}
              <div className="h-[32px] w-[3px] bg-slate-800 absolute -start-[15px] top-[72px] rounded-s-lg"></div>
              <div className="h-[46px] w-[3px] bg-slate-800 absolute -start-[15px] top-[124px] rounded-s-lg"></div>
              <div className="h-[46px] w-[3px] bg-slate-800 absolute -end-[15px] top-[124px] rounded-e-lg"></div>
              
              {/* SCREEN CONTENT */}
              <div className="rounded-[2.2rem] overflow-hidden h-full w-full bg-slate-50 flex flex-col relative">
                
                {/* Simulated Header */}
                <div className="bg-white p-5 pt-8 border-b border-slate-100 shadow-sm z-10">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Sitter View</div>
                      <div className="text-lg font-bold text-slate-800">Nano Cube 30L</div>
                    </div>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">🐟</div>
                  </div>
                </div>

                {/* Simulated Content */}
                <div className="p-4 space-y-4 overflow-hidden relative flex-1">
                  
                  {/* Task Card 1 (Done) */}
                  <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex gap-3 opacity-60 scale-95 origin-top">
                     <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">✓</div>
                     <div>
                       <div className="font-bold text-green-900 line-through">Licht Check</div>
                       <div className="text-xs text-green-700">Erledigt um 09:15</div>
                     </div>
                  </div>

                  {/* Task Card 2 (Active) */}
                  <div className="bg-white p-0 rounded-xl shadow-md border border-slate-100 overflow-hidden group">
                    <div className="h-32 bg-slate-200 relative">
                       {/* Simuliertes Foto */}
                       <div className="absolute inset-0 flex items-center justify-center text-4xl bg-gradient-to-tr from-slate-200 to-slate-100">🥄</div>
                       <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Foto</div>
                    </div>
                    <div className="p-4">
                      <div className="font-bold text-slate-900 text-lg">Füttern (Abends)</div>
                      <div className="text-slate-500 text-sm mt-1">Nur einen halben Löffel! Wenn Wasser trüb, weglassen.</div>
                      <div className="mt-4 w-full bg-blue-600 text-white font-bold py-3 rounded-lg text-center shadow-lg shadow-blue-200">
                        Erledigt ✅
                      </div>
                    </div>
                  </div>

                  {/* Finger / Cursor Hint */}
                  <div className="absolute bottom-20 right-10 pointer-events-none animate-bounce">
                    <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Das sieht dein Sitter 👇
                    </div>
                  </div>

                </div>

                {/* Simulated Bottom Bar */}
                <div className="bg-white p-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
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
