'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog'
import { Share2, Copy, Printer, Check, Link as LinkIcon, Loader2 } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useLocale, useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase-client'

export function ShareDialog({ 
  tankName, 
  shareToken, 
  triggerButton 
}: { 
  tankName: string, 
  shareToken: string, 
  triggerButton?: React.ReactNode 
}) {
  const [copied, setCopied] = useState(false)
  const [printing, setPrinting] = useState(false) // Loading State
  const [origin, setOrigin] = useState('')
  const locale = useLocale()
  const t = useTranslations('Share') 
  const tForms = useTranslations('Forms') 
  const supabase = createClient()
  
  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const shareUrl = origin ? `${origin}/${locale}/s/${shareToken}` : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success('Link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = async () => {
    setPrinting(true)
    const toastId = toast.loading("Preparing Print View...")

    // 1. Echte Daten laden (Versuche ohne Profiles, falls RLS Probleme macht)
    // Wenn Profiles erwünscht sind und RLS stimmt: .select(`*, tasks(*), profiles(full_name, emergency_phone)`)
    const { data: tankData, error } = await supabase
        .from('tanks')
        .select(`*, tasks(*)`) 
        .eq('share_token', shareToken)
        .single()

    if (error || !tankData) {
        console.error("Print Error:", error)
        toast.error("Could not load tank data for printing.")
        setPrinting(false)
        toast.dismiss(toastId)
        return
    }

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      const date = new Date().toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US')
      const qrSvgElement = document.getElementById('qr-code-svg')
      const qrSvg = qrSvgElement ? qrSvgElement.outerHTML : ''

      // Dynamische Tabelle bauen
      let tasksHtml = ''
      
      if (!tankData.tasks || tankData.tasks.length === 0) {
          // EMPTY STATE: Keine Tabelle, nur Notiz
          tasksHtml = `
            <div class="note" style="text-align: center; color: #888; border: 2px dashed #eee; background: white;">
                <em>${t('pdf_no_tasks') || 'No tasks have been created for this tank yet.'}</em>
            </div>
          `
      } else {
          // TABLE STATE: Echte Tasks rendern
          const rows = tankData.tasks.map((task: any) => {
              // Einfacher Fallback für Übersetzungen, falls Key nicht existiert
              const freqLabel = ['daily', 'weekly', 'once'].includes(task.frequency_type) 
                  ? tForms(`freq_${task.frequency_type}`) 
                  : task.frequency_type

              return `
                <tr>
                  <td>
                    <strong>${task.title}</strong>
                    ${task.description ? `<br><span style="font-size: 11px; color: #666;">${task.description}</span>` : ''}
                  </td>
                  <td>${freqLabel}</td>
                  <td style="text-align: center;"><div class="checkbox"></div></td>
                </tr>
              `
          }).join('')

          tasksHtml = `
            <h2>Checklist</h2>
            <table>
              <thead>
                <tr>
                  <th style="width: 55%">${t('pdf_col_task')}</th>
                  <th style="width: 25%">${t('pdf_col_freq')}</th>
                  <th style="width: 20%; text-align: center;">${t('pdf_col_done')}</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          `
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>TankSitter - ${tankName}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #111; padding: 40px; max-width: 800px; margin: 0 auto; }
              .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
              h1 { font-size: 28px; margin: 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 800; }
              .meta { font-size: 14px; color: #666; font-weight: 500; }
              
              .grid { display: grid; grid-template-columns: 2fr 1fr; gap: 40px; }
              
              .instructions h2 { font-size: 16px; text-transform: uppercase; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-top: 0; color: #444; }
              .note { background: #f3f4f6; border-left: 4px solid #333; padding: 15px; font-size: 14px; margin-bottom: 30px; line-height: 1.5; }
              
              table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
              th { text-align: left; border-bottom: 2px solid #ddd; padding: 10px 5px; text-transform: uppercase; font-size: 11px; color: #666; letter-spacing: 0.5px; }
              td { border-bottom: 1px solid #eee; padding: 12px 5px; vertical-align: top; }
              .checkbox { width: 16px; height: 16px; border: 1.5px solid #333; border-radius: 3px; display: inline-block; margin-top: 2px; }
              
              .qr-section { text-align: center; background: #f9fafb; padding: 30px; border-radius: 12px; border: 1px solid #eee; height: fit-content; }
              .qr-label { font-weight: bold; margin-bottom: 15px; display: block; font-size: 14px; letter-spacing: 1px; }
              .qr svg { max-width: 140px; height: auto; }
              
              @media print {
                body { padding: 0; }
                .no-print { display: none; }
                .qr-section { -webkit-print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <h1>${tankName}</h1>
                <div class="meta" style="margin-top: 5px;">${t('pdf_title')}</div>
              </div>
              <div class="meta">${date}</div>
            </div>

            <div class="grid">
              <div class="instructions">
                <div class="note">
                  <strong>${t('pdf_important')}</strong><br>
                  ${t('pdf_note')}
                </div>
                
                ${tasksHtml} 
              </div>

              <div class="qr-section">
                <span class="qr-label">${t('scan_label')}</span>
                <div class="qr">${qrSvg}</div>
                <p style="font-size: 11px; margin-top: 15px; color: #666; line-height: 1.4;">
                  ${t('scan_desc')}
                </p>
              </div>
            </div>
            
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
    
    setPrinting(false)
    toast.dismiss(toastId)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" /> Share
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-background border border-border shadow-2xl p-0 overflow-hidden rounded-2xl">
        
        {/* Header */}
        <div className="bg-muted/30 p-6 border-b border-border text-center">
             <DialogHeader>
                <DialogTitle className="text-center">{t('dialog_title')}</DialogTitle>
                <DialogDescription className="text-center">
                    {t('dialog_desc')}
                </DialogDescription>
            </DialogHeader>
        </div>
        
        <div className="flex flex-col items-center justify-center p-6 space-y-6">
          
          {/* QR Code Container */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100" id="qr-code-wrapper">
             {origin && (
                 <div style={{ height: "auto", margin: "0 auto", maxWidth: 160, width: "100%" }}>
                    <QRCodeSVG
                      id="qr-code-svg"
                      value={shareUrl}
                      size={256}
                      level="M" 
                      includeMargin={false}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    />
                </div>
             )}
          </div>

          {/* Copy & Input */}
          <div className="w-full space-y-3">
             <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <input 
                    readOnly 
                    value={shareUrl} 
                    className="w-full pl-10 pr-12 py-2.5 bg-secondary/30 border border-border rounded-xl text-xs font-mono text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all truncate"
                />
                <div className="absolute inset-y-0 right-1 flex items-center">
                     <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={handleCopy} 
                        className="h-8 w-8 p-0 rounded-lg hover:bg-background shadow-sm"
                     >
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
             </div>

             <Button variant="secondary" className="w-full gap-2 border border-border/50" onClick={handlePrint} disabled={printing}>
                {printing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
                {t('button_print')}
             </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
