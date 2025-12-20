import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'
import { 
  Check, 
  Fish, 
  Camera, 
  QrCode, 
  Lock, 
  Heart,
  ArrowRight,
  Sparkles,
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
    <div className="min-h-screen bg-background font-sans selection:bg-blue-500/30 dark:selection:bg-cyan-500/30 overflow-hidden relative transition-colors duration-700">
      
      {/* NOISE OVERLAY FOR TEXTURE */}
      <div className="bg-noise pointer-events-none fixed inset-0 z-50"></div>

      {/* GRID PATTERN BACKGROUND */}
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] -z-20 mask-image-gradient" />
      
      {/* AMBIENT GLOWS - Adjusted for Premium Feel */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
         <div className="absolute -top-[10%] right-[0%] w-[800px] h-[800px] bg-blue-500/10 dark:bg-cyan-500/10 rounded-full blur-[120px] animate-pulse-slow" />
         <div className="absolute top-[30%] -left-[10%] w-[600px] h-[600px] bg-purple-500/5 dark:bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      {/* NAVBAR - Glassmorphism */}
      <nav className="fixed w-full z-40 top-0 border-b border-white/5 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer select-none">
            <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative bg-gradient-to-tr from-blue-600 to-cyan-500 p-2 rounded-xl text-white shadow-lg ring-1 ring-white/20 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                  <Fish size={20} strokeWidth={2.5} className="drop-shadow-md" />
                </div>
            </div>
            <span className="font-bold text-foreground tracking-tight text-xl">TankSitter</span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:block">
               <LanguageSwitcher />
            </div>
            <ModeToggle />
            
            {user ? (
               <Link href={`/${locale}/dashboard`}>
                 <Button variant="secondary" className="font-semibold shadow-sm hover:shadow-md transition-all rounded-xl h-10 px-5 bg-secondary hover:bg-secondary/80 border border-border/50">
                   Dashboard
                 </Button>
               </Link>
            ) : (
               <Link href={`/${locale}/login`}>
                 <Button className="font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-xl shadow-lg h-10 px-6 transition-transform active:scale-95">
                   Login
                 </Button>
               </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-4 sm:px-6 relative z-10">
        
        {/* HERO SECTION */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            
            {/* Left: Content */}
            <div className="text-center lg:text-left space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-1000 flex flex-col items-center lg:items-start">
                
                {/* Premium Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/30 text-blue-700 dark:text-blue-300 text-[11px] font-bold tracking-wider uppercase mb-2 shadow-[0_0_15px_rgba(37,99,235,0.1)] backdrop-blur-md cursor-default hover:scale-105 transition-transform">
                    <Sparkles size={12} className="fill-current animate-pulse" />
                    <span>v1.0 Public Beta</span>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-extrabold text-foreground tracking-tighter leading-[1.1] text-balance">
                    {t('subtitle').split(' ').slice(0, -2).join(' ')} 
                    <br className="hidden lg:block"/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 dark:from-cyan-300 dark:via-blue-400 dark:to-cyan-300 pb-2 inline-block animate-gradient-x bg-[length:200%_auto]">
                          {' ' + t('subtitle').split(' ').slice(-2).join(' ')}
                    </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-muted-foreground/90 max-w-xl leading-relaxed font-medium text-balance">
                    {t('description')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
                    {user ? (
                        <Link href={`/${locale}/dashboard`} className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto h-14 text-lg rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1 relative overflow-hidden group">
                                <span className="relative z-10 flex items-center justify-center">
                                    {t('to_dashboard')} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
                            </Button>
                        </Link>
                    ) : (
                        <Link href={`/${locale}/login`} className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto h-14 text-lg rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1 relative overflow-hidden group border border-white/10">
                                <span className="relative z-10 flex items-center justify-center">
                                    {t('start_button')} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
                            </Button>
                        </Link>
                    )}
                </div>
                
                {/* Micro Social Proof */}
                <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-3 text-sm font-semibold text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-full bg-green-500/10 text-green-500 ring-1 ring-green-500/20"><Check size={10} strokeWidth={4} /></div>
                        Open Source
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-full bg-green-500/10 text-green-500 ring-1 ring-green-500/20"><Check size={10} strokeWidth={4} /></div>
                        100% Free
                      </div>
                </div>
            </div>

            {/* Right: Mockup (Floating & Premium) */}
            <div className="relative flex justify-center perspective-1000 lg:h-[800px] items-center animate-in fade-in zoom-in duration-1000 delay-200 mt-12 lg:mt-0">
                
                {/* Glow behind phone */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[500px] bg-gradient-to-tr from-blue-600/30 to-cyan-400/30 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />

                {/* IPHONE FRAME - Floating Animation */}
                <div className="relative animate-float bg-[#020617] border-[#1e293b] border-[8px] rounded-[3rem] h-[600px] w-[300px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rotate-[-6deg] hover:rotate-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ring-1 ring-white/10 group z-10">
                    
                    {/* Screen Reflection (Glossy) */}
                    <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/5 to-transparent rounded-r-[2.5rem] pointer-events-none z-30" />

                    {/* Dynamic Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[25px] bg-[#020617] rounded-b-2xl z-40 border-b border-l border-r border-[#1e293b]"></div>

                    {/* Screen Content */}
                    <div className="h-full w-full bg-white dark:bg-slate-950 rounded-[2.5rem] overflow-hidden flex flex-col relative z-20">
                        
                        {/* Status Bar Fake */}
                        <div className="h-10 w-full z-20 flex items-end justify-between px-6 pb-2 select-none text-slate-900 dark:text-white">
                             <span className="text-[10px] font-bold tracking-wider">9:41</span>
                             <div className="flex gap-1.5">
                                 <div className="w-1.5 h-1.5 bg-current rounded-full opacity-40"></div>
                                 <div className="w-1.5 h-1.5 bg-current rounded-full opacity-40"></div>
                                 <div className="w-3.5 h-1.5 bg-current rounded-full opacity-40"></div>
                             </div>
                        </div>

                        {/* Content Header */}
                        <div className="p-6 pt-6 pb-4">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">{t('mockup.view_title')}</div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{t('mockup.tank_name')}</h2>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/40 dark:to-slate-900 rounded-2xl shadow-inner flex items-center justify-center border border-slate-200 dark:border-white/10">
                                    <Waves className="w-6 h-6 text-blue-500" />
                                </div>
                            </div>
                        </div>

                        {/* Tasks List Container */}
                        <div className="flex-1 px-5 space-y-4 bg-slate-50 dark:bg-[#0B1121] pt-6 rounded-t-[2.5rem] border-t border-slate-100 dark:border-white/5 shadow-inner">
                            
                            {/* Done Task */}
                            <div className="bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-slate-200/50 dark:border-white/5 p-4 rounded-2xl flex items-center gap-4 opacity-50 select-none grayscale">
                                <div className="w-9 h-9 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                                    <Check size={16} strokeWidth={3} />
                                </div>
                                <div>
                                    <div className="font-bold text-sm line-through text-slate-500 dark:text-slate-400">{t('mockup.task_done_title')}</div>
                                    <div className="text-[10px] text-green-600 dark:text-green-500 font-medium">{t('mockup.task_done_time')}</div>
                                </div>
                            </div>

                            {/* Active Task (Hero) */}
                            <div className="bg-white dark:bg-[#151e32] border border-slate-200 dark:border-blue-500/20 shadow-xl shadow-blue-500/10 rounded-2xl overflow-hidden transform scale-105 origin-center transition-transform group-hover:scale-110">
                                <div className="h-32 bg-slate-100 dark:bg-slate-900 relative flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-blue-500/10 grid-pattern" />
                                    {/* Mockup Image Placeholder Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 mix-blend-overlay" />
                                    <Camera className="text-slate-300 dark:text-slate-600 w-10 h-10 relative z-10" />
                                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[9px] px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow-lg border border-white/10">
                                        <Camera size={10} /> {t('mockup.photo_label')}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="font-bold text-base mb-1 text-slate-900 dark:text-white">{t('mockup.task_active_title')}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-black/20 p-2 rounded-lg mb-3 leading-relaxed border border-transparent dark:border-white/5">
                                        {t('mockup.task_active_desc')}
                                    </div>
                                    <Button size="sm" className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold h-9 shadow-lg shadow-blue-500/20 border-0">
                                        {t('mockup.button_done')}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Mockup Footer / Home Indicator */}
                        <div className="p-6 bg-white dark:bg-[#020617] text-center relative z-20">
                             <div className="w-16 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* FEATURES GRID - Premium Cards */}
        <div className="max-w-7xl mx-auto mt-32 lg:mt-40">
            <div className="text-center mb-16 space-y-4">
                 <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">{t('trust_badges.features_headline') || 'Why TankSitter?'}</h2>
                 <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Build for hobbyists, by hobbyists.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                {[
                { 
                    icon: <Camera className="w-6 h-6 text-blue-600 dark:text-cyan-400" />,
                    gradient: "from-blue-500/10 to-cyan-500/10",
                    border: "group-hover:border-blue-500/30",
                    title: t('trust_badges.photo_title'),
                    desc: t('trust_badges.photo_desc')
                },
                { 
                    icon: <QrCode className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
                    gradient: "from-purple-500/10 to-pink-500/10",
                    border: "group-hover:border-purple-500/30",
                    title: t('trust_badges.qr_title'),
                    desc: t('trust_badges.qr_desc')
                },
                { 
                    icon: <Lock className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
                    gradient: "from-amber-500/10 to-orange-500/10",
                    border: "group-hover:border-amber-500/30",
                    title: t('trust_badges.security_title'),
                    desc: t('trust_badges.security_desc')
                }
                ].map((feature, i) => (
                    <div key={i} className={`group p-8 rounded-[2rem] bg-card/50 backdrop-blur-sm border border-border hover:bg-card transition-all duration-500 hover:-translate-y-1 relative overflow-hidden ${feature.border}`}>
                        
                        {/* Gradient Blob Background */}
                        <div className={`absolute top-0 right-0 w-[150px] h-[150px] bg-gradient-to-br ${feature.gradient} blur-[60px] opacity-50 group-hover:opacity-100 transition-opacity duration-500 rounded-full -mr-10 -mt-10`} />
                        
                        <div className="relative z-10">
                            <div className="bg-background w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-border group-hover:scale-110 transition-transform duration-500">
                                {feature.icon}
                            </div>
                            <h3 className="font-bold text-xl mb-3 tracking-tight text-foreground">{feature.title}</h3>
                            <p className="text-base text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-border/40 bg-background/50 backdrop-blur-xl py-16 relative z-10">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-8">
          <div className="inline-flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors cursor-default grayscale hover:grayscale-0 duration-300">
             <Fish size={24} /> 
             <span className="font-bold tracking-tight text-xl">TankSitter</span>
          </div>
          
          <p className="text-muted-foreground text-sm flex items-center justify-center gap-1.5">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" /> for the community.
          </p>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              <Link href="/legal/imprint" className="hover:text-primary transition-colors hover:underline">Imprint</Link>
              <Link href="/legal/privacy" className="hover:text-primary transition-colors hover:underline">Privacy</Link>
              <a href="https://github.com/zy0x1337/tanksitter" target="_blank" className="hover:text-primary transition-colors hover:underline">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
