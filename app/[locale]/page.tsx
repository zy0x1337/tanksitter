import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Check, 
  ShieldCheck, 
  Zap, 
  Smartphone, 
  Fish, 
  Camera, 
  QrCode, 
  Lock, 
  Heart,
  ArrowRight
} from 'lucide-react'
import { LanguageSwitcher } from '@/components/language-switcher'
import { ModeToggle } from '@/components/mode-toggle'

export default function IndexPage() {
  const t = useTranslations('Index')

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-blue-100 dark:selection:bg-blue-900">
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-default">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <Fish size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-foreground tracking-tight text-lg">TankSitter</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ModeToggle />
            <Link href="/login">
              <Button variant="ghost" className="font-medium text-foreground hover:bg-secondary">Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4">
        
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 border border-border text-muted-foreground text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            v1.0 Public Beta
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-8 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700">
            {t('subtitle')}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            {t('description')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20 rounded-2xl group">
                {t('start_button')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Mockup / Demo Section */}
        <div className="max-w-sm mx-auto bg-card rounded-[3rem] shadow-2xl border-8 border-slate-900 overflow-hidden relative transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 mb-32 ring-1 ring-border">
          <div className="bg-slate-900 text-white p-6 pt-10 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl"></div>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">
              {t('mockup.view_title')}
            </p>
            <h3 className="font-bold text-lg">{t('mockup.tank_name')}</h3>
          </div>
          
          <div className="p-5 space-y-4 bg-slate-50 min-h-[420px]">
            {/* Erledigter Task */}
            <div className="bg-green-50/80 p-4 rounded-2xl border border-green-100 flex items-center gap-3 opacity-60 grayscale-[50%]">
              <div className="bg-green-100 p-2 rounded-full text-green-600">
                <Check size={16} strokeWidth={3} />
              </div>
              <div>
                <p className="font-bold text-slate-700 line-through text-sm">{t('mockup.task_done_title')}</p>
                <p className="text-[10px] text-green-700 font-medium">{t('mockup.task_done_time')}</p>
              </div>
            </div>

            {/* Aktiver Task */}
            <div className="bg-white p-0 rounded-3xl shadow-lg border border-slate-100 overflow-hidden group cursor-pointer">
              <div className="h-40 bg-blue-50 flex items-center justify-center text-blue-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-100/50" />
                <Camera className="w-16 h-16 relative z-10 text-blue-300" />
                
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-md font-medium flex items-center gap-1">
                  <Camera size={10} />
                  {t('mockup.photo_label')}
                </div>
              </div>
              <div className="p-5">
                <p className="font-bold text-slate-900 mb-1 text-lg">{t('mockup.task_active_title')}</p>
                <p className="text-xs text-slate-500 leading-relaxed mb-4 font-medium">
                  {t('mockup.task_active_desc')}
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-sm rounded-xl text-white font-bold shadow-md shadow-blue-200">
                  {t('mockup.button_done')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges Grid - Jetzt 4 Spalten */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: <Camera className="w-6 h-6 text-blue-600" />,
                bg: "bg-blue-100 dark:bg-blue-900/20",
                title: t('trust_badges.photo_title'),
                desc: t('trust_badges.photo_desc')
              },
              { 
                icon: <QrCode className="w-6 h-6 text-purple-600" />,
                bg: "bg-purple-100 dark:bg-purple-900/20",
                title: t('trust_badges.qr_title'),
                desc: t('trust_badges.qr_desc')
              },
              { 
                icon: <Lock className="w-6 h-6 text-amber-600" />,
                bg: "bg-amber-100 dark:bg-amber-900/20",
                title: t('trust_badges.security_title'),
                desc: t('trust_badges.security_desc')
              },
              { 
                icon: <Zap className="w-6 h-6 text-green-600" />,
                bg: "bg-green-100 dark:bg-green-900/20",
                title: t('trust_badges.free_title'),
                desc: t('trust_badges.free_desc')
              }
            ].map((feature, i) => (
              <div key={i} className="bg-card p-6 rounded-3xl shadow-sm border border-border flex flex-col items-start text-left hover:-translate-y-1 transition-all duration-300 hover:shadow-md">
                <div className={`${feature.bg} p-3 rounded-2xl mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-foreground mb-1 text-lg">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </main>

      <footer className="border-t border-border py-12 bg-background/50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
            Built with <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> for the community.
          </p>
          <div className="flex justify-center gap-8 text-xs font-medium text-muted-foreground mt-6">
              <Link href="/legal/imprint" className="hover:text-foreground transition-colors">Imprint</Link>
              <Link href="/legal/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="https://github.com" target="_blank" className="hover:text-foreground transition-colors">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
