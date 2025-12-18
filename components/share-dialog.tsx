'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription
} from '@/components/ui/dialog'
import { Share2, Copy, Printer, Check } from 'lucide-react'
import QRCode from 'react-qr-code'
import { useLocale, useTranslations } from 'next-intl'

export function ShareDialog({ tankName, shareToken, triggerButton }: { tankName: string, shareToken: string, triggerButton?: React.ReactNode }) {
  const [copied, setCopied] = useState(false)
  const [origin, setOrigin] = useState('')
  const locale = useLocale()
  const t = useTranslations('Share') // Eigener Namespace
  const tForms = useTranslations('Forms') // Für Frequenzen
  
  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const shareUrl = origin ? `${origin}/${locale}/s/${shareToken}` : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      const date = new Date().toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US')
      const qrSvg = document.getElementById('qr-code-svg')?.outerHTML || ''

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>TankSitter - ${tankName}</title>
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; padding: 40px; max-width: 800px; margin: 0 auto; }
              .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
              h1 { font-size: 28px; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
              .meta { font-size: 14px; color: #666; }
              
              .grid { display: grid; grid-template-columns: 2fr 1fr; gap: 40px; }
              
              .instructions h2 { font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-top: 0; }
              .note { background: #f9f9f9; border-left: 4px solid #333; padding: 15px; font-size: 14px; margin-bottom: 30px; }
              
              table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
              th { text-align: left; border-bottom: 2px solid #ddd; padding: 10px 5px; text-transform: uppercase; font-size: 12px; color: #666; }
              td { border-bottom: 1px solid #eee; padding: 12px 5px; vertical-align: top; }
              .checkbox { width: 20px; height: 20px; border: 1px solid #333; display: inline-block; }
              
              .qr-section { text-align: center; background: #eee; padding: 30px; border-radius: 8px; }
              .qr-label { font-weight: bold; margin-bottom: 10px; display: block; }
              .qr svg { max-width: 150px; height: auto; }
              
              @media print {
                body { padding: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <h1>${tankName}</h1>
                <div class="meta">${t('pdf_title')}</div>
              </div>
              <div class="meta">${date}</div>
            </div>

            <div class="grid">
              <div class="instructions">
                <div class="note">
                  <strong>${t('pdf_important')}</strong><br>
                  ${t('pdf_note')}
                </div>

                <h2>Checklist</h2>
                <table>
                  <thead>
                    <tr>
                      <th style="width: 50%">${t('pdf_col_task')}</th>
                      <th style="width: 30%">${t('pdf_col_freq')}</th>
                      <th style="width: 20%">${t('pdf_col_done')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>${t('pdf_dummy_feed')}</strong>
                      </td>
                      <td>${tForms('freq_daily')} / ${tForms('freq_weekly')}</td>
                      <td><div class="checkbox"></div></td>
                    </tr>
                     <tr>
                      <td><strong>${t('pdf_dummy_check')}</strong></td>
                      <td>${tForms('freq_daily')}</td>
                      <td><div class="checkbox"></div></td>
                    </tr>
                     <tr>
                      <td>&nbsp;</td>
                      <td></td>
                      <td><div class="checkbox"></div></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="qr-section">
                <span class="qr-label">${t('scan_label')}</span>
                <div class="qr">${qrSvg}</div>
                <p style="font-size: 12px; margin-top: 15px; color: #666;">
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('dialog_title')}</DialogTitle>
          <DialogDescription>
            {t('dialog_desc')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-6 space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100" id="qr-code-wrapper">
             {origin && (
                 <div style={{ height: "auto", margin: "0 auto", maxWidth: 150, width: "100%" }}>
                    <QRCode
                      size={256}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      value={shareUrl}
                      viewBox={`0 0 256 256`}
                      id="qr-code-svg"
                    />
                </div>
             )}
          </div>

          <div className="flex gap-2 w-full">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">Link</Label>
              <Input id="link" defaultValue={shareUrl || 'Loading...'} readOnly className="bg-secondary" />
            </div>
            <Button type="button" size="icon" className="px-3 shrink-0" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <Button variant="secondary" className="w-full gap-2" onClick={handlePrint}>
            <Printer className="h-4 w-4" /> 
            {t('button_print')}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  )
}
