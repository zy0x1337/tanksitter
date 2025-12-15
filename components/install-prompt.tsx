'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, X, Share } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    // 1. Check if iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIosDevice)

    // 2. Check if already installed (Standalone Mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    if (isStandalone) return // Nicht anzeigen, wenn schon installiert

    // 3. Android/Chrome Event Listener
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Auf iOS zeigen wir es standardmäßig an (wenn nicht standalone)
    if (isIosDevice && !isStandalone) {
      // Kleiner Delay, damit es nicht sofort nervt
      setTimeout(() => setShow(true), 3000)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setShow(false)
    }
    setDeferredPrompt(null)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-50 animate-in slide-in-from-bottom-4 fade-in duration-700">
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 max-w-sm flex flex-col gap-3 relative">
        
        <button 
          onClick={() => setShow(false)} 
          className="absolute top-2 right-2 text-slate-400 hover:text-white"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl">
             <span className="text-xl">🐟</span>
          </div>
          <div>
            <h3 className="font-bold text-sm">TankSitter App</h3>
            <p className="text-xs text-slate-300">
              {isIOS ? 'Install for better experience' : 'Install as App'}
            </p>
          </div>
        </div>

        {isIOS ? (
          <div className="text-xs text-slate-300 bg-slate-800 p-3 rounded-lg border border-slate-700">
            Tap <Share className="inline h-3 w-3 mx-1" /> and select <br/>
            <span className="font-bold text-white">"Add to Home Screen"</span>
          </div>
        ) : (
          <Button 
            onClick={handleInstallClick} 
            size="sm" 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold"
          >
            <Download className="w-4 h-4 mr-2" />
            Install Now
          </Button>
        )}
      </div>
    </div>
  )
}
