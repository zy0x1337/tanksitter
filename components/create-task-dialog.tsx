'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { createTask } from '@/actions/tasks'

export function CreateTaskDialog({ tankId }: { tankId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    // Wir müssen tankId manuell anfügen, da sie nicht im Formular als Input steht
    formData.append('tankId', tankId) 
    
    await createTask(formData)
    setLoading(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Aufgabe hinzufügen</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Neue Aufgabe erstellen</DialogTitle>
        </DialogHeader>
        
        <form action={handleSubmit} className="grid gap-4 py-4">
          
          <div className="grid gap-2">
            <Label htmlFor="title">Was ist zu tun? (Titel)</Label>
            <Input id="title" name="title" placeholder="z.B. Füttern (Abends)" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="frequency">Wie oft?</Label>
            <Select name="frequency" defaultValue="daily">
              <SelectTrigger>
                <SelectValue placeholder="Wähle Intervall" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Täglich</SelectItem>
                <SelectItem value="every_2_days">Alle 2 Tage</SelectItem>
                <SelectItem value="weekly">Wöchentlich</SelectItem>
                <SelectItem value="once">Einmalig (Nur für diesen Urlaub)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">Foto (Extrem wichtig für den Sitter!)</Label>
            <Input id="image" name="image" type="file" accept="image/*" />
            <p className="text-xs text-gray-500">Zeig genau, welcher Löffel oder welche Dose gemeint ist.</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Beschreibung (Optional)</Label>
            <Textarea id="description" name="description" placeholder="Nur einen halben Löffel! Wenn Wasser trüb, weglassen." />
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? 'Lädt hoch...' : 'Aufgabe speichern'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
