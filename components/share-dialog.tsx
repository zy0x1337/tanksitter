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
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    // Wir holen uns das aktuelle Datum für den Ausdruck
    const date = new Date().toLocaleDateString('de-DE')
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Pflegeplan - ${tankName}</title>
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
              <h1>Aquarium Pflegeplan</h1>
              <div class="meta">Becken: <strong>${tankName}</strong></div>
            </div>
            <div class="meta">Erstellt am: ${date}</div>
          </div>

          <div class="grid">
            <div class="instructions">
              <div class="note">
                <strong>Wichtig für den Sitter:</strong><br>
                Im Zweifel immer <strong>WENIGER</strong> füttern als zu viel. Fische verhungern nicht so schnell, aber Futterreste vergiften das Wasser.
                <br><br>
                Bei Problemen (Leck, Stromausfall, trübes Wasser): <strong>Nicht füttern, anrufen!</strong>
              </div>

              <h2>Aufgaben-Checkliste</h2>
              <table>
                <thead>
                  <tr>
                    <th style="width: 50%">Aufgabe</th>
                    <th style="width: 30%">Intervall</th>
                    <th style="width: 20%">Erledigt</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Hier würden wir idealerweise die e echten Tasks reinloopen. 
                       Da wir sie im Dialog nicht haben, lassen wir Platzhalterzeilen 
                       oder müssten die Tasks als Prop übergeben. -->
                  <tr>
                    <td>
                      <strong>Füttern</strong><br>
                      <span style="color:#666; font-size:12px;">Siehe Fotos im QR-Code Link für Menge</span>
                    </td>
                    <td>Täglich / Alle 2 Tage</td>
                    <td><div class="checkbox"></div></td>
                  </tr>
                   <tr>
                    <td><strong>Technik-Check</strong> (Filter läuft? Temperatur ok?)</td>
                    <td>Täglich</td>
                    <td><div class="checkbox"></div></td>
                  </tr>
                  <!-- Leere Zeilen für Notizen -->
                   <tr>
                    <td>&nbsp;</td>
                    <td></td>
                    <td><div class="checkbox"></div></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="qr-section">
              <span class="qr-label">Scan für Fotos & Details</span>
              <div class="qr">${document.getElementById('qr-code-svg')?.outerHTML || ''}</div>
              <p style="font-size: 12px; margin-top: 15px; color: #666;">
                Öffnet die interaktive Ansicht mit Fotos der Futterdosen und Mengen.
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
