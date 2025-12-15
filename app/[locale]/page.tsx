import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, ShieldCheck, Zap, Smartphone } from 'lucide-react'
import LanguageSwitcher from '@/components/language-switcher'

export default function IndexPage() {
  const t = useTranslations('Index')

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐟</span>
            <span className="font-bold text-slate-900 tracking-tight">TankSitter</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/login">
              <Button variant="ghost" className="font-medium">Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4">
        
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            v1.0 Public Beta
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700">
            {t('subtitle')}
          </h1>
          
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            {t('description')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 rounded-2xl">
                {t('start_button')}
              </Button>
            </Link>
            <p className="text-sm text-slate-400 sm:hidden mt-2">100% Free & Open Source</p>
          </div>
        </div>

        {/* Mockup / Demo Section */}
        <div className="max-w-sm mx-auto bg-white rounded-[2.5rem] shadow-2xl border-8 border-slate-900 overflow-hidden relative transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 mb-24">
          <div className="bg-slate-900 text-white p-6 pt-10 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl"></div>
            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-1">
              {t('mockup.view_title')}
            </p>
            <h3 className="font-bold text-xl">{t('mockup.tank_name')}</h3>
          </div>
          
          <div className="p-4 space-y-4 bg-slate-50 min-h-[400px]">
            {/* Done Task */}
            <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-center gap-3 opacity-60">
              <div className="bg-green-100 p-2 rounded-full text-green-600"><Check size={16} /></div>
              <div>
                <p className="font-bold text-slate-700 line-through text-sm">{t('mockup.task_done_title')}</p>
                <p className="text-[10px] text-green-600">{t('mockup.task_done_time')}</p>
              </div>
            </div>

            {/* Active Task with Image */}
            <div className="bg-white p-0 rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
              <div className="h-32 bg-blue-100 flex items-center justify-center text-blue-300 relative">
                <span className="text-4xl">🦐</span>
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">
                  {t('mockup.photo_label')}
                </div>
              </div>
              <div className="p-4">
                <p className="font-bold text-slate-900 mb-1">{t('mockup.task_active_title')}</p>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {t('mockup.task_active_desc')}
                </p>
                <Button className="w-full bg-blue-600 h-10 text-sm rounded-xl">
                  {t('mockup.button_done')}
                </Button>
              </div>
            </div>
            
            {/* Pointer Text */}
<div className="absolute bottom-4 right-4 bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm border border-yellow-200 z-20 flex items-center gap-2 animate-bounce">
  <span>👇</span> {t('mockup.hint_finger')}
</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: <ShieldCheck className="w-8 h-8 text-blue-500" />,
              title: t('trust_badges.qr_title'),
              desc: t('trust_badges.qr_desc')
            },
            { 
              icon: <Zap className="w-8 h-8 text-amber-500" />,
              title: t('trust_badges.photo_title'),
              desc: t('trust_badges.photo_desc')
            },
            { 
              icon: <Smartphone className="w-8 h-8 text-green-500" />,
              title: t('trust_badges.free_title'),
              desc: t('trust_badges.free_desc')
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
              <div className="bg-slate-50 p-4 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-500 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-12 bg-white text-center">
        <p className="text-slate-400 text-sm">
          Built with 💙 for the fish-keeping community.
        </p>
        <div className="flex justify-center gap-6 text-xs text-slate-400">
    <Link href="/legal/imprint" className="hover:text-slate-600">Imprint</Link>
    <Link href="/legal/privacy" className="hover:text-slate-600">Privacy</Link>
  </div>
      </footer>
    </div>
  )
}
