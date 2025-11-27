'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription
} from '@/components/ui/dialog'
import { Share2, Copy, Printer, Check } from 'lucide-react'
import QRCode from 'react-qr-code'

export function ShareDialog({ tankName, shareToken }: { tankName: string, shareToken: string }) {
  const [copied, setCopied] = useState(false)
  
  // Wir bauen die URL dynamisch zusammen. 
  // window.location.origin ist im Client verfügbar.
  // Da wir SSR nutzen, müssen wir aufpassen, aber im onClick ist es sicher.
  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/de/s/${shareToken}` // TODO: Sprache dynamisch machen
    }
    return ''
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(getShareUrl())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    // Ein einfaches Druck-Fenster öffnen
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Sitter Guide - ${tankName}</title>
            <style>
              body { font-family: sans-serif; text-align: center; padding: 40px; }
              h1 { font-size: 24px; margin-bottom: 10px; }
              p { color: #666; margin-bottom: 40px; }
              .qr { margin: 0 auto; max-width: 300px; }
            </style>
          </head>
          <body>
            <h1>Scan mich zum Füttern! 🐟</h1>
            <p>Aquarium: ${tankName}</p>
            <div class="qr">${document.getElementById('qr-code-svg')?.outerHTML || ''}</div>
            <p style="margin-top: 40px; font-size: 12px;">Powered by TankSitter</p>
            <script>window.print();</script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" /> Teilen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Zugang teilen</DialogTitle>
          <DialogDescription>
            Gib diesen Link oder QR-Code deinem Sitter. Er braucht keinen Account.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-6 space-y-6">
          
          {/* QR Code Anzeige */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100" id="qr-code-wrapper">
             {/* Wir rendern den QR Code hier, damit wir ihn fürs Drucken grabben können */}
             <div style={{ height: "auto", margin: "0 auto", maxWidth: 150, width: "100%" }}>
                <QRCode
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={typeof window !== 'undefined' ? `${window.location.origin}/de/s/${shareToken}` : ''}
                  viewBox={`0 0 256 256`}
                  id="qr-code-svg"
                />
            </div>
          </div>

          <div className="flex gap-2 w-full">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">Link</Label>
              <Input id="link" defaultValue={typeof window !== 'undefined' ? `${window.location.origin}/de/s/${shareToken}` : 'Lädt...'} readOnly />
            </div>
            <Button type="button" size="icon" className="px-3" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <Button variant="secondary" className="w-full gap-2" onClick={handlePrint}>
            <Printer className="h-4 w-4" /> 
            Anleitung drucken (PDF)
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  )
}
