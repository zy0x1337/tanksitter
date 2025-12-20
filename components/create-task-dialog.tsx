'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { TaskForm } from './task-form'

interface CreateTaskDialogProps {
  tankId: string
}

export function CreateTaskDialog({ tankId }: CreateTaskDialogProps) {
  const t = useTranslations('Forms')
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          {t('add_task_title')}
        </Button>
      </DialogTrigger>
      
      {/* 
        Hier geben wir dem Dialog genug Breite (sm:max-w-2xl) 
        und erlauben Scrollen auf Handys (max-h-[90vh] overflow-y-auto),
        damit die Presets immer erreichbar sind.
      */}
      <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto p-0 gap-0">
        <div className="p-6">
            <DialogHeader className="mb-5">
                <DialogTitle className="text-xl">{t('add_task_title')}</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                    Create a task manually or choose a smart preset.
                </DialogDescription>
            </DialogHeader>
            
            <TaskForm tankId={tankId} onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
