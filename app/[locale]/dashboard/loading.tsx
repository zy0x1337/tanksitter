import { Waves } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] -z-20 mask-image-gradient" />
      <div className="fixed inset-0 pointer-events-none -z-10">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 dark:bg-cyan-500/10 rounded-full blur-[100px] animate-pulse-slow" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Pulsating Logo Container */}
        <div className="w-24 h-24 bg-gradient-to-tr from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20 border border-white/20 dark:border-white/5 animate-bounce-slow">
            <Waves className="w-10 h-10 text-blue-500 dark:text-cyan-400 animate-pulse" />
        </div>

        {/* Loading Text */}
        <div className="mt-8 space-y-2 text-center">
            <h2 className="text-xl font-bold text-foreground tracking-tight animate-pulse">Loading TankSitter...</h2>
            <div className="flex gap-1.5 justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            </div>
        </div>
      </div>
    </div>
  )
}
