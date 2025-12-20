import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'
import { 
  Check, 
  Zap, 
  Fish, 
  Camera, 
  QrCode, 
  Lock, 
  Heart,
  ArrowRight,
  Sparkles,
  Coffee,
  Waves
} from 'lucide-react'
import { LanguageSwitcher } from '@/components/language-switcher'
import { ModeToggle } from '@/components/mode-toggle'
import { createClient } from '@/lib/supabase-server'

export default async function IndexPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('Index')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-blue-200 dark:selection:bg-blue-900 overflow-hidden relative">
      
      {/* GRID PATTERN BACKGROUND */}
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] -z-20 mask-image-gradient" />
      
      {/* AMBIENT GLOWS */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
         <div className="absolute -top-[10%] right-[0%] w-[1000px] h-[1000px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow" />
         <div className="absolute top-[40%] -left-[20%] w-[800px] h-[800px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      {/* NAVBAR */}
      <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/40 transition-all supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-default select-none">
            <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
              <Fish size={20} strokeWidth={2.5} className="drop-shadow-sm" />
            </div>
            <span className="font-extrabold text-foreground tracking-tight text-xl">TankSitter</span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:block">
               <LanguageSwitcher />
            </div>
            <ModeToggle />
            
            {user ? (
               <Link href={`/${locale}/dashboard`}>
                 <Button variant="secondary" className="font-semibold shadow-sm hover:shadow-md transition-all rounded-xl h-10 px-5 bg-secondary/80 hover:bg-secondary">
                    Dashboard
                 </Button>
               </Link>
            ) : (
               <Link href={`/${locale}/login`}>
                 <Button className="font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-xl shadow-lg h-10 px-6">
                    Login
                 </Button>
               </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-4 sm:px-6 relative">
        
        {/* HERO SECTION */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left: Content */}
            <div className="text-center lg:text-left space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-700">
                
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/80 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-wide uppercase mb-4 mx-auto lg:mx-0 shadow-sm backdrop-blur-sm hover:bg-blue-100/50 transition-colors cursor-default">
                    <Sparkles size={12} className="fill-current animate-pulse" />
                    <span>v1.0 Public Beta</span>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-[5rem] font-extrabold text-foreground tracking-tight leading-[1.05] text-balance">
                    {t('subtitle').split(' ').slice(0, -2).join(' ')} 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 pb-2 inline-block">
                         {' ' + t('subtitle').split(' ').slice(-2).join(' ')}
                    </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium text-balance">
                    {t('description')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
                    {user ? (
                        <Link href={`/${locale}/dashboard`} className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto h-14 text-lg rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/25 transition-all hover:-translate-y-1 hover:shadow-blue-500/40">
                                {t('to_dashboard')}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    ) : (
                        <Link href={`/${locale}/login`} className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto h-14 text-lg rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/25 transition-all hover:-translate-y-1 hover:shadow-blue-500/40">
                                {t('start_button')}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    )}
                </div>
                
                {/* Micro Social Proof */}
                <div className="pt-6 flex items-center justify-center lg:justify-start gap-6 text-sm font-medium text-muted-foreground/60">
                     <div className="flex items-center gap-1.5">
                        <div className="p-1 rounded-full bg-green-500/10 text-green-500"><Check size={10} strokeWidth={4} /></div>
                        Open Source
                     </div>
                     <div className="flex items-center gap-1.5">
                        <div className="p-1 rounded-full bg-green-500/10 text-green-500"><Check size={10} strokeWidth={4} /></div>
                        No Credit Card
                     </div>
                </div>
            </div>

                        {/* Right: Mockup (Floating) */}
            <div className="relative flex justify-center perspective-1000 lg:h-[750px] items-center animate-in fade-in zoom-in duration-1000 delay-150">
                
                {/* Glow behind phone */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full blur-[90px] opacity-20 dark:opacity-30 animate-pulse-slow pointer-events-none" />

                {/* IPHONE FRAME (Immer dunkel) */}
                <div className="relative bg-[#0f172a] border-[#1e293b] border-[10px] rounded-[3rem] h-[640px] w-[330px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] rotate-[-6deg] hover:rotate-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ring-1 ring-white/10 group">
                    
                    {/* Screen Reflection */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent rounded-r-[2.5rem] pointer-events-none z-30" />

                    {/* Screen Content - Passt sich Theme an, aber kontrolliert */}
                    <div className="h-full w-full bg-white dark:bg-slate-950 rounded-[2.3rem] overflow-hidden flex flex-col relative z-10">
                        
                        {/* Status Bar Fake */}
                        <div className="h-8 w-full z-20 flex items-center justify-between px-7 pt-3 select-none text-slate-900 dark:text-white">
                             <span className="text-[10px] font-bold tracking-wider">9:41</span>
                             <div className="flex gap-1.5">
                                 <div className="w-1.5 h-1.5 bg-current rounded-full opacity-20"></div>
                                 <div className="w-1.5 h-1.5 bg-current rounded-full opacity-20"></div>
                                 <div className="w-3.5 h-1.5 bg-current rounded-full opacity-20"></div>
                             </div>
                        </div>

                        {/* Content Header */}
                        <div className="p-6 pt-6 pb-4">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">{t('mockup.view_title')}</div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{t('mockup.tank_name')}</h2>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/50 dark:to-slate-800 rounded-2xl shadow-sm flex items-center justify-center border border-slate-200 dark:border-white/5">
                                    <Waves className="w-6 h-6 text-blue-500" />
                                </div>
                            </div>
                        </div>

                        {/* Tasks List Container */}
                        <div className="flex-1 px-5 space-y-4 bg-slate-50 dark:bg-slate-900/50 pt-6 rounded-t-3xl border-t border-slate-100 dark:border-slate-800">
                            
                            {/* Done Task */}
                            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-4 rounded-2xl flex items-center gap-4 opacity-60 select-none">
                                <div className="w-9 h-9 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                                    <Check size={16} strokeWidth={3} />
                                </div>
                                <div>
                                    <div className="font-bold text-sm line-through text-slate-500 dark:text-slate-400">{t('mockup.task_done_title')}</div>
                                    <div className="text-[10px] text-green-600 dark:text-green-500 font-medium">{t('mockup.task_done_time')}</div>
                                </div>
                            </div>

                            {/* Active Task (Hero) */}
                            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl shadow-blue-500/5 rounded-2xl overflow-hidden transform scale-105 origin-center transition-transform group-hover:scale-110">
                                <div className="h-36 bg-slate-100 dark:bg-slate-900 relative flex items-center justify-center">
                                    <div className="absolute inset-0 bg-blue-500/5 grid-pattern" />
                                    <Camera className="text-slate-300 dark:text-slate-600 w-12 h-12" />
                                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-[9px] px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow-lg">
                                        <Camera size={10} /> {t('mockup.photo_label')}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="font-bold text-base mb-1.5 text-slate-900 dark:text-white">{t('mockup.task_active_title')}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg mb-4 leading-relaxed">
                                        {t('mockup.task_active_desc')}
                                    </div>
                                    <Button size="sm" className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold h-10 shadow-md border-0">
                                        {t('mockup.button_done')}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Mockup Footer / Home Indicator */}
                        <div className="p-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 text-center">
                             <div className="w-16 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* FEATURES GRID */}
        <div className="max-w-7xl mx-auto mt-32 lg:mt-40">
            <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-4xl font-extrabold mb-4">{t('trust_badges.features_headline') || 'Why TankSitter?'}</h2>
                 <p className="text-muted-foreground max-w-2xl mx-auto">Build for hobbyists, by hobbyists.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                { 
                    icon: <Camera className="w-6 h-6 text-blue-600 dark:text-blue-300" />,
                    bg: "bg-blue-100/50 dark:bg-blue-900/20",
                    title: t('trust_badges.photo_title'),
                    desc: t('trust_badges.photo_desc')
                },
                { 
                    icon: <QrCode className="w-6 h-6 text-purple-600 dark:text-purple-300" />,
                    bg: "bg-purple-100/50 dark:bg-purple-900/20",
                    title: t('trust_badges.qr_title'),
                    desc: t('trust_badges.qr_desc')
                },
                { 
                    icon: <Lock className="w-6 h-6 text-amber-600 dark:text-amber-300" />,
                    bg: "bg-amber-100/50 dark:bg-amber-900/20",
                    title: t('trust_badges.security_title'),
                    desc: t('trust_badges.security_desc')
                },
                { 
                    icon: <Zap className="w-6 h-6 text-green-600 dark:text-green-300" />,
                    bg: "bg-green-100/50 dark:bg-green-900/20",
                    title: t('trust_badges.free_title'),
                    desc: t('trust_badges.free_desc')
                }
                ].map((feature, i) => (
                    <div key={i} className="group p-8 rounded-[2rem] bg-card border border-border/50 hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                        
                        {/* Soft Gradient Overlay on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative z-10">
                            <div className={`${feature.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                {feature.icon}
                            </div>
                            <h3 className="font-bold text-lg mb-3 tracking-tight">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm py-16">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-8">
          <div className="inline-flex items-center gap-2.5 text-muted-foreground/80 hover:text-foreground transition-colors cursor-default">
             <div className="p-1.5 bg-secondary rounded-lg">
                <Fish size={18} /> 
             </div>
             <span className="font-bold tracking-tight text-lg">TankSitter</span>
          </div>
          
          <p className="text-muted-foreground text-sm flex items-center justify-center gap-1.5">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" /> for the community.
          </p>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Link href="/legal/imprint" className="hover:text-foreground transition-colors hover:underline">Imprint</Link>
              <Link href="/legal/privacy" className="hover:text-foreground transition-colors hover:underline">Privacy</Link>
              <Link href="https://github.com/zy0x1337/tanksitter" target="_blank" className="hover:text-foreground transition-colors hover:underline">GitHub</Link>
          </div>

        </div>
      </footer>
    </div>
  )
}
