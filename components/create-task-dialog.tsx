'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function CreateTaskDialog({ tankId }: { tankId: string }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Auffälliger roter Button zum Testen */}
        <Button className="bg-red-600 hover:bg-red-700 text-white font-bold w-full sm:w-auto">
           🔴 TEST BUTTON (Datei wird geladen)
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <div className="p-6 text-center space-y-4">
            <h2 className="text-2xl font-bold text-green-600">Erfolg! ✅</h2>
            <p className="font-medium">
                Die Datei <code>create-task-dialog.tsx</code> wird korrekt verwendet.
            </p>
            <p className="text-sm text-muted-foreground">
                Tank ID: {tankId}
            </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
