'use client'

import { useState, use } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  ArrowLeft, 
  Loader2, 
  PlusCircle, 
  Fish, 
  Waves, 
  Droplets, 
  Anchor, 
  Shrimp, 
  Leaf,
  Sprout, 
  Thermometer 
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Verfügbare Icons definieren
const TANK_ICONS = [
  { id: 'fish', icon: Fish, labelKey: 'icon_label_fish' },
  { id: 'shrimp', icon: Shrimp, labelKey: 'icon_label_shrimp' },
  { id: 'planted', icon: Sprout, labelKey: 'icon_label_planted' },
  { id: 'waves', icon: Waves, labelKey: 'icon_label_water' },
  { id: 'nature', icon: Leaf, labelKey: 'icon_label_nature' },
  { id: 'tech', icon: Thermometer, labelKey: 'icon_label_tech' },
  { id: 'chem', icon: Droplets, labelKey: 'icon_label_chem' },
  { id: 'deco', icon: Anchor, labelKey: 'icon_label_deco' },
]

export default function NewTankPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const t = useTranslations('Forms')
  const supabase = createClient()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState('fish')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string

    // 1. User holen
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        toast.error('Session expired. Please login again.')
        setLoading(false)
        return
    }

    // 2. Insert mit Icon
    const { error } = await supabase
      .from('tanks')
      .insert({
        name,
        icon: selectedIcon,
        user_id: user.id,
        share_token: crypto.randomUUID(),
      })

    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      toast.success('Tank created successfully!')
      router.refresh()
      router.push(`/${locale}/dashboard`)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        
        {/* PREMIUM BACKGROUNDS */}
        <div className="bg-noise pointer-events-none fixed inset-0 z-50"></div>
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] -z-20 mask-image-gradient" />
        
        {/* AMBIENT GLOWS */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 dark:bg-cyan-500/5 rounded-full blur-[120px] animate-pulse-slow" />
        </div>

        <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">
            
            {/* Back Link */}
            <div className="mb-6">
                <Link href={`/${locale}/dashboard`}>
                    <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-blue-500 transition-colors group text-muted-foreground">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        {t('cancel')}
                    </Button>
                </Link>
            </div>

            {/* Main Card */}
            <div className="bg-card/80 dark:bg-card/50 backdrop-blur-xl border border-border/50 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 overflow-hidden relative">
                
                {/* Decoration Top */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400" />

                <div className="p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{t('create_tank_title')}</h1>
                        <p className="text-muted-foreground mt-2 text-sm font-medium">
                            Customize your new ecosystem.
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-8">
                        
                        {/* 1. Name Input */}
                        <div className="space-y-3">
                            <Label htmlFor="name" className="text-foreground font-semibold ml-1">
                                {t('tank_name_label')}
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder={t('tank_name_placeholder')}
                                required
                                disabled={loading}
                                className="h-14 bg-background/50 border-border/60 text-lg px-5 rounded-2xl focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all shadow-sm"
                            />
                        </div>

                        {/* 2. Icon Selection Grid */}
                        <div className="space-y-3">
                            <Label className="text-foreground font-semibold ml-1">Icon</Label>
                            <div className="grid grid-cols-4 gap-3">
                                {TANK_ICONS.map(({ id, icon: Icon, labelKey }) => {
                                    const isSelected = selectedIcon === id
                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => setSelectedIcon(id)}
                                            className={cn(
                                                "aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border gap-2",
                                                isSelected 
                                                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105" 
                                                    : "bg-background/40 border-border/60 text-muted-foreground hover:bg-secondary hover:border-blue-500/30 hover:text-blue-500"
                                            )}
                                        >
                                            <Icon className={cn("w-6 h-6", isSelected && "animate-pulse")} strokeWidth={isSelected ? 2.5 : 2} />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                                {t(labelKey)}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        {t('saving')}
                                    </>
                                ) : (
                                    <>
                                        <PlusCircle className="w-5 h-5 mr-2" />
                                        {t('save_button')}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}
