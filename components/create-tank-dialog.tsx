'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createTank } from '@/actions/tanks'
import { useTranslations } from 'next-intl'

export function CreateTankDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const t = useTranslations('Dashboard')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    await createTank(formData)
    setLoading(false)
    setOpen(false) // Dialog schließen
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          {t('new_tank_button')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('new_tank_button')}</DialogTitle>
          <DialogDescription>
            Gib deinem Aquarium einen Namen (z.B. "30L Cube" oder "Wohnzimmer").
          </DialogDescription>
        </DialogHeader>
        
        <form action={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="z.B. Garnelen Zucht" required />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Speichert...' : 'Erstellen'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
